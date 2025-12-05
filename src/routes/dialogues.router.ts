import { Router } from "express";
import dialogueUserController from "../controllers/dialogueUsers.controller";
import {
  uploadDialogueUserFiles,
} from "../middleware/upload.middleware";

export default (router: Router) => {
  // Dialogue User 라우트 (대화 참여자)
  router
    .route("/dialogue-users")
    .get(dialogueUserController.getAllUsers) // GET /api/dialogue-users - 모든 대화 사용자 조회
    .post(
      uploadDialogueUserFiles,
      dialogueUserController.createUser
    ); // POST /api/dialogue-users - 대화 사용자 생성 (파일 업로드 지원)

  router
    .route("/dialogue-users/:userId")
    .get(dialogueUserController.getUserById) // GET /api/dialogue-users/:userId - 사용자 상세 조회
    .patch(
      uploadDialogueUserFiles,
      dialogueUserController.updateUser
    ) // PATCH /api/dialogue-users/:userId - 사용자 수정 (파일 업로드 지원)
    .delete(dialogueUserController.deleteUser); // DELETE /api/dialogue-users/:userId - 사용자 삭제
};
