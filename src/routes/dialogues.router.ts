import { Router } from "express";
import {dialogueController, dialogueUserController} from "../controllers";
import {
  uploadDialogueUserFiles,
  uploadDialogueEntryFiles,
} from "../middleware";

export default (router: Router) => {
  // 기본 CRUD 라우트
  router
    .route("/dialogues")
    .get(dialogueController.getAllDialogues) // GET /api/dialogues - 모든 대화 조회
    .post(
      uploadDialogueEntryFiles, // entries 배열의 파일 업로드 처리
      dialogueController.createDialogue
    ); // POST /api/dialogues - 대화 생성 (entries 포함 가능)

  router
    .route("/dialogues/:id")
    .get(dialogueController.getDialogueById) // GET /api/dialogues/:id - 대화 상세 조회
    .patch(dialogueController.updateDialogue) // PATCH /api/dialogues/:id - 대화 업데이트
    .delete(dialogueController.deleteDialogue); // DELETE /api/dialogues/:id - 대화 삭제

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
