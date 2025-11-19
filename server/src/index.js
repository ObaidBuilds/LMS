import cors from "cors";
import express from "express";
import router from "./routes/index.js";
import connectDB from "./config/index.js";
import configurePassport from './config/passport.js';

const app = express();
configurePassport();

app.use(express.json());

console.log(process.env.CLIENT_URL)

const allowedOrigins = [process.env.CLIENT_URL];

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    methods: "GET, POST, PUT, DELETE, PATCH, OPTIONS",
    credentials: true,
    allowedHeaders: ["Content-Type", "Authorization"],
    exposedHeaders: ["Set-Cookie"],
  })
);

app.use("/api", router);

const port = process.env.PORT ?? 5000;
connectDB()
  .then(() => {
    app.listen(port, () => {
      console.log(`Express running → On http://localhost:${port} 🚀`);
    });
  })
  .catch((err) => {
    console.error(err.message);
  });

app.use((req, res, next) => {
  const error = new Error("404 Endpoint Not Found");
  error.status = 404;
  next(error.message);
});

app.use((err, req, res, next) => {
  const message = err || "Internal server error";
  res.status(500).json({
    success: false,
    message,
  });
});
