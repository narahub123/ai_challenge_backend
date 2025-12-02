import express from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import compression from "compression";
import cors from "cors";
import { connectDB } from "./db";
dotenv.config();

const app = express();

app.use(
  cors({
    origin: process.env.BASE_URL,
    methods: ["GET, POST, PUT, PATCH, DELETE"],
    credentials: true,
  })
);

app.use(express.json({ limit: "100mb" }));

app.use(express.urlencoded({ limit: "100mb", extended: true }));

app.use(compression());

app.use(cookieParser());

connectDB();

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`서버가 포트 ${PORT}에 연결됨`);
});
