import { Router } from "express";
import dialogueController from "../controllers/dialogues.controller";
import dialogueEntryController from "../controllers/dialogueEntries.controller";
import dialogueUserController from "../controllers/dialogueUsers.controller";

export default (router: Router) => {
  // 기본 CRUD 라우트
  router
    .route("/dialogues")
    .get(dialogueController.getAllDialogues) // GET /api/dialogues - 모든 대화 조회
    .post(dialogueController.createDialogue); // POST /api/dialogues - 대화 생성

  router
    .route("/dialogues/:id")
    .get(dialogueController.getDialogueById) // GET /api/dialogues/:id - 대화 상세 조회
    .patch(dialogueController.updateDialogue) // PATCH /api/dialogues/:id - 대화 업데이트
    .delete(dialogueController.deleteDialogue); // DELETE /api/dialogues/:id - 대화 삭제

  // Dialogue Entry 라우트 (대화 메시지)
  router
    .route("/dialogues/:dialogueId/entries")
    .get(dialogueEntryController.getEntriesByDialogue) // GET /api/dialogues/:dialogueId/entries - 대화의 모든 엔트리 조회
    .post(dialogueEntryController.createEntry); // POST /api/dialogues/:dialogueId/entries - 대화에 엔트리 추가

  router
    .route("/dialogues/:dialogueId/entries/:entryId")
    .get(dialogueEntryController.getEntryById) // GET /api/dialogues/:dialogueId/entries/:entryId - 엔트리 상세 조회
    .patch(dialogueEntryController.updateEntry) // PATCH /api/dialogues/:dialogueId/entries/:entryId - 엔트리 수정
    .delete(dialogueEntryController.deleteEntry); // DELETE /api/dialogues/:dialogueId/entries/:entryId - 엔트리 삭제

  // Dialogue User 라우트 (대화 참여자)
  router
    .route("/dialogue-users")
    .get(dialogueUserController.getAllUsers) // GET /api/dialogue-users - 모든 대화 사용자 조회
    .post(dialogueUserController.createUser); // POST /api/dialogue-users - 대화 사용자 생성

  router
    .route("/dialogue-users/:userId")
    .get(dialogueUserController.getUserById) // GET /api/dialogue-users/:userId - 사용자 상세 조회
    .patch(dialogueUserController.updateUser) // PATCH /api/dialogue-users/:userId - 사용자 수정
    .delete(dialogueUserController.deleteUser); // DELETE /api/dialogue-users/:userId - 사용자 삭제
};
