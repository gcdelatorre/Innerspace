import "dotenv/config";
import express from "express";
import cors from "cors";
import connectDB from "./config/db";

const app = express();

app.use(cors());
app.use(express.json());



// Test Route
app.get('/health', (req, res) => {
    res.json({ status: "ok" })
})

// start server
const startServer = async () => {
    try {
        await connectDB();
        console.log("DB Connected")
    } catch (err: any) {
        console.error("DB connection failed", err.message);
    } finally {
        app.listen(5000, () => { console.log("🚀 Server is running on http://localhost:5000"); });
    }
}

startServer();
