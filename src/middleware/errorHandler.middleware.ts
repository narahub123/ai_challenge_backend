import { Request, Response, NextFunction } from "express";
import mongoose from "mongoose";

// 커스텀 에러 클래스
export class AppError extends Error {
  statusCode: number;
  isOperational: boolean;

  constructor(message: string, statusCode: number = 500) {
    super(message);
    this.statusCode = statusCode;
    this.isOperational = true;

    Error.captureStackTrace(this, this.constructor);
  }
}

// MongoDB 에러 처리
const handleMongoError = (err: any): AppError => {
  if (err.name === "CastError") {
    // 잘못된 ObjectId 형식
    const message = `잘못된 ${err.path}: ${err.value}`;
    return new AppError(message, 400);
  }

  if (err.code === 11000) {
    // 중복 키 에러
    const field = Object.keys(err.keyValue || {})[0];
    const message = `${field}가 이미 존재합니다.`;
    return new AppError(message, 409);
  }

  if (err.name === "ValidationError") {
    // Mongoose 검증 에러
    const errors = Object.values(err.errors || {}).map((el: any) => el.message);
    const message = `입력 데이터 검증 실패: ${errors.join(". ")}`;
    return new AppError(message, 400);
  }

  if (err.name === "MongoServerError") {
    const message = "데이터베이스 작업 중 오류가 발생했습니다.";
    return new AppError(message, 500);
  }

  return err;
};

// 개발 환경용 에러 응답
const sendErrorDev = (err: AppError, res: Response) => {
  res.status(err.statusCode || 500).json({
    status: "error",
    error: err,
    message: err.message,
    stack: err.stack,
  });
};

// 프로덕션 환경용 에러 응답
const sendErrorProd = (err: AppError, res: Response) => {
  // Operational 에러: 클라이언트에게 신뢰할 수 있는 에러 메시지 전송
  if (err.isOperational) {
    res.status(err.statusCode || 500).json({
      status: "error",
      message: err.message,
    });
  } else {
    // 프로그래밍 에러: 세부 정보 누출 방지
    console.error("ERROR 💥", err);
    res.status(500).json({
      status: "error",
      message: "서버에서 오류가 발생했습니다.",
    });
  }
};

// 전역 에러 핸들러 미들웨어
export const errorHandler = (
  err: Error | AppError,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  let error = err instanceof AppError ? err : new AppError(err.message, 500);

  // MongoDB 관련 에러 처리
  if (err instanceof mongoose.Error || (err as any).name?.startsWith("Mongo")) {
    error = handleMongoError(err);
  }

  // 환경에 따른 에러 응답
  if (process.env.NODE_ENV === "production") {
    sendErrorProd(error, res);
  } else {
    sendErrorDev(error, res);
  }
};

// 404 핸들러 (알 수 없는 라우트)
export const notFoundHandler = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const err = new AppError(`경로를 찾을 수 없습니다: ${req.originalUrl}`, 404);
  next(err);
};

// 비동기 함수 에러 래퍼
export const catchAsync = (fn: Function) => {
  return (req: Request, res: Response, next: NextFunction) => {
    fn(req, res, next).catch(next);
  };
};

