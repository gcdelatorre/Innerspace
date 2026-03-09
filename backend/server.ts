import "dotenv/config";
import express from "express";
import cors from "cors";
import { createClient } from "@supabase/supabase-js";

const app = express();

app.use(cors());
app.use(express.json());

const supabaseUrl = process.env.SUPABASE_URL || '';
const supabaseKey = process.env.SUPABASE_ANON_KEY || '';

const supabase = createClient(supabaseUrl, supabaseKey);

const connectDB = async () => {
    try {
        if (!supabaseUrl || !supabaseKey) {
            console.warn("⚠️ Supabase credentials missing in .env");
            return;
        }

        // Test the connection by trying to fetch a list of tables or a single row
        // Even if the table doesn't exist, a '404' or 'Relation not found' means we connected!
        const { error } = await supabase.from('_connection_test').select('*').limit(1);

        if (error && error.code === 'PGRST301') {
            console.error("❌ Supabase Connection Failed: Invalid API Key or URL");
        } else if (error && error.message.includes("failed to fetch")) {
            console.error("❌ Supabase Connection Failed: Network error or wrong URL");
        } else {
            console.log("✅ Supabase connected successfully!");
        }
    } catch (error: any) {
        console.error(`❌ Unexpected Error: ${error.message}`);
    }
}

connectDB();

// Test Route
app.get('/health', (req, res) => {
    res.json({ status: "ok" })
})

app.listen(5000, () => {
    console.log("🚀 Server is running on http://localhost:5000");
});