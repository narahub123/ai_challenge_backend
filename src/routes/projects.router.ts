import { Router } from "express";
import projectController from "../controllers/projects.controller";
import { uploadProjectFiles } from "../middleware/upload.middleware";

export default (router: Router) => {
  // 기본 CRUD 라우트
  router
    .route("/projects")
    .get(projectController.getAllProjects) // GET /api/projects - 모든 프로젝트 조회 (Pagination 및 필터링)
    .post(
      uploadProjectFiles,
      projectController.createProject
    ); // POST /api/projects - 프로젝트 생성 (파일 업로드 지원)

  router
    .route("/projects/:id")
    .get(projectController.getProjectById) // GET /api/projects/:id - 프로젝트 상세 조회
    .patch(
      uploadProjectFiles,
      projectController.updateProject
    ) // PATCH /api/projects/:id - 프로젝트 업데이트 (파일 업로드 지원)
    .delete(projectController.deleteProject); // DELETE /api/projects/:id - 프로젝트 삭제

  // 프로젝트 모듈 링크 관련 라우트
  router
    .route("/projects/:id/modules")
    .get(projectController.getProjectWithModules) // GET /api/projects/:id/modules - 프로젝트 + 모듈 링크 조회
    .post(projectController.addModuleToProject); // POST /api/projects/:id/modules - 모듈 추가

  router
    .route("/projects/:id/modules/:moduleIdx/order")
    .patch(projectController.updateModuleOrder); // PATCH /api/projects/:id/modules/:moduleIdx/order - 모듈 순서 변경

  router
    .route("/projects/:id/modules/:moduleIdx")
    .delete(projectController.removeModuleFromProject); // DELETE /api/projects/:id/modules/:moduleIdx?session_number=:sessionNumber - 모듈 제거
};
