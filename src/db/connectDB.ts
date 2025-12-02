import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

const mongoURI = process.env.MONGO_URI || "";

export const connectDB = async () => {
  try {
    await mongoose.connect(mongoURI);

    console.log("몽고 DB 연결 성공");
  } catch (error) {
    console.log("몽고 DB 연결 실패", error);
    process.exit(1); // 연결 실패시 애플리케이션 종료
  }
};
