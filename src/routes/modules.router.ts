import { Router } from "express";
import moduleController from "../controllers/modules.controller";

export default (router: Router) => {
  // 기본 CRUD 라우트
  router
    .route("/modules")
    .get(moduleController.getAllModules) // GET /api/modules - 모든 모듈 조회 (Pagination 및 필터링)
    .post(moduleController.createModule); // POST /api/modules - 모듈 생성

  router
    .route("/modules/:id")
    .get(moduleController.getModuleById) // GET /api/modules/:id - 모듈 상세 조회
    .patch(moduleController.updateModule) // PATCH /api/modules/:id - 모듈 업데이트
    .delete(moduleController.deleteModule); // DELETE /api/modules/:id - 모듈 삭제
};
