import projectModuleLinkRepository from "../repositories/project-module-link.repository";
import moduleRepository from "../repositories/module.repository";
import projectRepository from "../repositories/project.repository";
import { AppError } from "../middleware";
import { IProjectModuleLink } from "../types";
import { ModuleResponseDto } from "../dtos/response/module-response.dto";
import { ProjectResponseDto } from "../dtos/response/project-response.dto";
import { ProjectModuleLinkItemDto } from "../dtos/response/project-module-link-response.dto";

class ProjectModuleLinkService {
  // 프로젝트 + 모듈 링크 정보 조회 (차시별로 그룹화)
  async getProjectWithModules(
    projectIdx: number
  ): Promise<{
    project: ProjectResponseDto;
    sessions: { [sessionNumber: number]: ProjectModuleLinkItemDto[] };
  }> {
    // 프로젝트 정보 조회
    const project = await projectRepository.findById(projectIdx);
    if (!project) {
      throw new AppError("프로젝트를 찾을 수 없습니다.", 404);
    }

    // 프로젝트의 모든 모듈 링크 조회
    const links = await projectModuleLinkRepository.findByProject(projectIdx);

    // 모듈 정보 조회 (module_idx 목록)
    const moduleIndices = [...new Set(links.map((link) => link.module_idx))];
    const modules = await Promise.all(
      moduleIndices.map((idx) => moduleRepository.findById(idx))
    );

    // module_idx를 키로 하는 Map 생성
    const moduleMap = new Map<number, ModuleResponseDto>();
    modules.forEach((module) => {
      if (module) {
        moduleMap.set(module.module_idx, ModuleResponseDto.fromEntity(module));
      }
    });

    // 차시별로 그룹화
    const sessions: { [sessionNumber: number]: ProjectModuleLinkItemDto[] } = {};
    links.forEach((link) => {
      const module = moduleMap.get(link.module_idx);
      if (!module) return;

      if (!sessions[link.session_number]) {
        sessions[link.session_number] = [];
      }

      // ProjectModuleLinkItem 생성 (Module + project-module-link 정보)
      sessions[link.session_number].push(
        new ProjectModuleLinkItemDto({
          session_number: link.session_number,
          module_order: link.module_order,
          module_idx: module.module_idx,
          module_name: module.module_name,
          description: module.description,
          format_type: module.format_type,
          format_ref_id: module.format_ref_id,
          game_type: module.game_type,
          status: module.status,
          created_at: module.created_at,
          updated_at: module.updated_at,
        })
      );
    });

    // 각 차시의 모듈을 module_order로 정렬
    Object.keys(sessions).forEach((sessionNum) => {
      sessions[Number(sessionNum)].sort(
        (a, b) => a.module_order - b.module_order
      );
    });

    return {
      project: ProjectResponseDto.fromEntity(project),
      sessions,
    };
  }

  // 모듈 추가
  async addModuleToProject(
    projectIdx: number,
    moduleIdx: number,
    sessionNumber: number
  ): Promise<IProjectModuleLink> {
    // 프로젝트 존재 확인
    const project = await projectRepository.findById(projectIdx);
    if (!project) {
      throw new AppError("프로젝트를 찾을 수 없습니다.", 404);
    }

    // 차시 번호 유효성 검증
    if (
      project.max_session &&
      (sessionNumber < 1 || sessionNumber > project.max_session)
    ) {
      throw new AppError(
        `차시 번호는 1부터 ${project.max_session}까지입니다.`,
        400
      );
    }

    // 모듈 존재 확인
    const module = await moduleRepository.findById(moduleIdx);
    if (!module) {
      throw new AppError("모듈을 찾을 수 없습니다.", 404);
    }

    // 중복 확인 (같은 프로젝트, 같은 차시, 같은 모듈)
    const existing = await projectModuleLinkRepository.findOne(
      projectIdx,
      moduleIdx,
      sessionNumber
    );
    if (existing) {
      throw new AppError(
        "이미 해당 차시에 추가된 모듈입니다.",
        400
      );
    }

    // 해당 차시의 최대 module_order 조회
    const maxOrder = await projectModuleLinkRepository.getMaxOrder(
      projectIdx,
      sessionNumber
    );

    // 모듈 링크 생성
    const link = await projectModuleLinkRepository.create({
      project_idx: projectIdx,
      module_idx: moduleIdx,
      session_number: sessionNumber,
      module_order: maxOrder + 1,
    });

    return link;
  }

  // 모듈 순서 변경
  async updateModuleOrder(
    projectIdx: number,
    moduleIdx: number,
    sessionNumber: number,
    moduleOrder: number
  ): Promise<IProjectModuleLink> {
    // 모듈 링크 존재 확인
    const link = await projectModuleLinkRepository.findOne(
      projectIdx,
      moduleIdx,
      sessionNumber
    );
    if (!link) {
      throw new AppError("모듈 링크를 찾을 수 없습니다.", 404);
    }

    // 순서 유효성 검증
    const sessionModules =
      await projectModuleLinkRepository.findByProjectAndSession(
        projectIdx,
        sessionNumber
      );
    if (moduleOrder < 1 || moduleOrder > sessionModules.length) {
      throw new AppError("유효하지 않은 순서입니다.", 400);
    }

    // 순서 업데이트
    const updated = await projectModuleLinkRepository.updateOrder(
      projectIdx,
      moduleIdx,
      sessionNumber,
      moduleOrder
    );

    if (!updated) {
      throw new AppError("모듈 순서 업데이트에 실패했습니다.", 500);
    }

    return updated;
  }

  // 모듈 제거
  async removeModuleFromProject(
    projectIdx: number,
    moduleIdx: number,
    sessionNumber: number
  ): Promise<void> {
    // 모듈 링크 존재 확인
    const link = await projectModuleLinkRepository.findOne(
      projectIdx,
      moduleIdx,
      sessionNumber
    );
    if (!link) {
      throw new AppError("모듈 링크를 찾을 수 없습니다.", 404);
    }

    // 모듈 링크 삭제
    const deleted = await projectModuleLinkRepository.delete(
      projectIdx,
      moduleIdx,
      sessionNumber
    );

    if (!deleted) {
      throw new AppError("모듈 제거에 실패했습니다.", 500);
    }

    // 해당 차시의 나머지 모듈 순서 재정렬
    const remainingModules =
      await projectModuleLinkRepository.findByProjectAndSession(
        projectIdx,
        sessionNumber
      );

    if (remainingModules.length > 0) {
      const reorderData = remainingModules.map((module, index) => ({
        module_idx: module.module_idx,
        module_order: index + 1,
      }));

      await projectModuleLinkRepository.reorderSessionModules(
        projectIdx,
        sessionNumber,
        reorderData
      );
    }
  }
}

export default new ProjectModuleLinkService();

