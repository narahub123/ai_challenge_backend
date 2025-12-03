import multer, { FileFilterCallback } from "multer";
import { Request } from "express";
import path from "path";
import fs from "fs";

// 업로드 디렉토리 생성
const uploadDir = path.join(process.cwd(), "uploads");
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// 파일 저장 설정
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(
      null,
      file.fieldname + "-" + uniqueSuffix + path.extname(file.originalname)
    );
  },
});

// 파일 필터 (이미지, 비디오 허용)
const fileFilter = (
  req: Request,
  file: Express.Multer.File,
  cb: FileFilterCallback
) => {
  const allowedMimes = [
    // 이미지
    "image/jpeg",
    "image/jpg",
    "image/png",
    "image/gif",
    "image/webp",
    // 비디오
    "video/mp4",
    "video/mpeg",
    "video/quicktime",
    "video/x-msvideo",
  ];

  if (allowedMimes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error("허용되지 않은 파일 형식입니다."));
  }
};

// Multer 인스턴스 생성
export const upload = multer({
  storage: storage,
  limits: {
    fileSize: 100 * 1024 * 1024, // 100MB
  },
  fileFilter: fileFilter,
});

/**
 * 파일을 업로드하고 URL 반환
 * @param file Express.Multer.File
 * @returns 업로드된 파일의 URL
 */
export const uploadFile = async (
  file: Express.Multer.File
): Promise<string> => {
  // 실제 프로덕션에서는 S3, Cloudinary 등의 스토리지에 업로드
  // 여기서는 로컬 파일 시스템 기준으로 URL 생성
  const baseUrl = process.env.BASE_URL || "http://localhost:3000";
  const fileUrl = `${baseUrl}/uploads/${file.filename}`;
  return fileUrl;
};

/**
 * 파일 배열을 업로드하고 URL 배열 반환
 * @param files Express.Multer.File[]
 * @returns 업로드된 파일들의 URL 배열
 */
export const uploadFiles = async (
  files: Express.Multer.File[]
): Promise<string[]> => {
  const uploadPromises = files.map((file) => uploadFile(file));
  return await Promise.all(uploadPromises);
};

/**
 * File 또는 string 배열을 string 배열로 변환
 * @param items (Express.Multer.File | string)[]
 * @returns string[] (URL 배열)
 */
export const processFileOrStringArray = async (
  items: (Express.Multer.File | string)[]
): Promise<string[]> => {
  const results: string[] = [];

  for (const item of items) {
    if (typeof item === "string") {
      // 이미 URL인 경우 그대로 사용
      results.push(item);
    } else {
      // File인 경우 업로드 후 URL 반환
      const url = await uploadFile(item);
      results.push(url);
    }
  }

  return results;
};

