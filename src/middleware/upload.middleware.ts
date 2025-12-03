import { Request, Response, NextFunction } from "express";
import { upload } from "../utils/fileUpload.util";

/**
 * 카드뉴스 생성/업데이트용 파일 업로드 미들웨어
 * thumbnail_url과 video_urls, card_data의 image_urls를 처리
 */
export const uploadCardNewsFiles = (req: Request, res: Response, next: NextFunction) => {
  const uploadFields = upload.fields([
    { name: "thumbnail_url", maxCount: 10 },
    { name: "video_urls", maxCount: 10 },
    { name: "card_data_image_urls", maxCount: 50 }, // card_data 내부의 이미지들
  ]);

  uploadFields(req, res, (err: any) => {
    if (err) {
      return res.status(400).json({
        success: false,
        data: {
          message: err.message || "파일 업로드 중 오류가 발생했습니다.",
        },
      });
    }
    next();
  });
};

/**
 * 퀴즈 생성/업데이트용 파일 업로드 미들웨어
 * quiz_image_url과 quiz_video_urls를 처리
 */
export const uploadQuizFiles = (req: Request, res: Response, next: NextFunction) => {
  const uploadFields = upload.fields([
    { name: "quiz_image_url", maxCount: 1 },
    { name: "quiz_video_urls", maxCount: 10 },
  ]);

  uploadFields(req, res, (err: any) => {
    if (err) {
      return res.status(400).json({
        success: false,
        data: {
          message: err.message || "파일 업로드 중 오류가 발생했습니다.",
        },
      });
    }
    next();
  });
};

