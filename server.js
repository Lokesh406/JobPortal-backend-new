import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
import dotenv from "dotenv";
import connectDB from "./utils/db.js";
import userRoute from "./routes/user.route.js";
import companyRoute from "./routes/company.route.js";
import jobRoute from "./routes/job.route.js";
import applicationRoute from "./routes/application.route.js";

dotenv.config(); // load environment variables

const app = express();

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

const stripTrailingSlash = (u) => (u ? u.replace(/\/+$/, "") : u);
const allowedOrigins = (process.env.FRONTEND_URL
  ? process.env.FRONTEND_URL.split(',').map(s => stripTrailingSlash(s.trim()))
  : ['http://localhost:5173', 'http://localhost:5174']);
const corsOptions = {
  origin: function (origin, callback) {
    const normalizedOrigin = stripTrailingSlash(origin);
    if (!origin || allowedOrigins.includes(normalizedOrigin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  }, // frontend URL
  credentials: true
};
app.use(cors(corsOptions));

// API routes
app.use("/api/v1/user", userRoute);
app.use("/api/v1/company", companyRoute);
app.use("/api/v1/job", jobRoute);
app.use("/api/v1/application", applicationRoute);
// Simple health check
app.get(["/","/api/health"], (req, res) => {
  res.status(200).json({ ok: true });
});

const PORT = process.env.PORT || 8000;

// Ensure DB connection (once) and handle Vercel serverless export
let isDbConnected = false;
const ensureDb = async () => {
  if (!isDbConnected) {
    await connectDB();
    isDbConnected = true;
  }
};

// In Vercel serverless environment, do not listen; export the app.
// For local/dev, start the HTTP server normally.
if (!process.env.VERCEL) {
  ensureDb().then(() => {
    app.listen(PORT, () => {
      console.log(`Server running at port ${PORT}`);
    });
  });
} else {
  // Connect DB on cold start for serverless
  ensureDb();
}

// For Vercel serverless: export a handler function
export default async function handler(req, res) {
  try {
    // Allow health checks without DB connection
    if (req.url === "/" || req.url.startsWith("/api/health")) {
      return app(req, res);
    }
    await ensureDb();
    return app(req, res);
  } catch (err) {
    console.error("Request failed:", err);
    const message = err?.message || "Internal Server Error";
    return res.status(500).json({ success: false, message });
  }
}
