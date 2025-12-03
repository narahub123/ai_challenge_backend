import express from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import compression from "compression";
import cors from "cors";
import { connectDB } from "./db";
import router from "./routes";
import { errorHandler, notFoundHandler } from "./middleware";
dotenv.config();

const app = express();

app.use(
  cors({
    origin: process.env.CLIENT_URL || process.env.BASE_URL, // 클라이언트(프론트엔드) URL
    methods: ["GET, POST, PUT, PATCH, DELETE"],
    credentials: true,
  })
);

app.use(express.json({ limit: "100mb" }));

app.use(express.urlencoded({ limit: "100mb", extended: true }));

app.use(compression());

app.use(cookieParser());

// API 라우트 등록
app.use("/api", router());

// 404 핸들러 (알 수 없는 라우트)
app.use(notFoundHandler);

// 전역 에러 핸들러 (모든 에러 처리)
app.use(errorHandler);

connectDB();

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`서버가 포트 ${PORT}에 연결됨`);
});
