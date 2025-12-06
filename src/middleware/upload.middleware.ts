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

/**
 * 프로젝트 생성/업데이트용 파일 업로드 미들웨어
 * gamebg_images를 처리
 */
export const uploadProjectFiles = (req: Request, res: Response, next: NextFunction) => {
  const uploadFields = upload.fields([
    { name: "gamebg_images", maxCount: 20 }, // 게임 배경 이미지 여러 개
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
 * 대화 엔트리 생성/업데이트용 파일 업로드 미들웨어
 * image_urls와 video_urls를 처리
 * entries 배열의 각 entry에 대한 파일도 처리 (최대 10개 entry 지원)
 */
export const uploadDialogueEntryFiles = (req: Request, res: Response, next: NextFunction) => {
  // 기본 필드: 단일 entry용
  const fields: { name: string; maxCount: number }[] = [
    { name: "image_urls", maxCount: 20 },
    { name: "video_urls", maxCount: 10 },
  ];

  // entries 배열의 각 entry에 대한 파일 필드 추가 (최대 10개 entry 지원)
  // entries[0].image_urls, entries[0].video_urls 형식
  for (let i = 0; i < 10; i++) {
    fields.push({ name: `entries[${i}].image_urls`, maxCount: 20 });
    fields.push({ name: `entries[${i}].video_urls`, maxCount: 10 });
  }

  const uploadFields = upload.fields(fields);

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
 * 대화 사용자 생성/업데이트용 파일 업로드 미들웨어
 * avatar_url을 처리
 */
export const uploadDialogueUserFiles = (req: Request, res: Response, next: NextFunction) => {
  const uploadFields = upload.fields([
    { name: "avatar_url", maxCount: 1 },
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

