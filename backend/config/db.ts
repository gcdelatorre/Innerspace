import { createClient } from "@supabase/supabase-js";
import "dotenv/config";

const supabaseUrl = process.env.SUPABASE_URL || '';
const supabaseKey = process.env.SUPABASE_ANON_KEY || '';

export const supabase = createClient(supabaseUrl, supabaseKey);

const connectDB = async () => {
    try {
        if (!supabaseUrl || !supabaseKey) {
            console.warn("⚠️ Supabase credentials missing in .env");
            return;
        }

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

export default connectDB;