import { ProjectModuleLink } from "../models";
import { IProjectModuleLink } from "../types";

class ProjectModuleLinkRepository {
  // 프로젝트의 모든 모듈 링크 조회
  async findByProject(projectIdx: number): Promise<IProjectModuleLink[]> {
    return await ProjectModuleLink.find({ project_idx: projectIdx })
      .sort({ session_number: 1, module_order: 1 })
      .exec();
  }

  // 프로젝트의 특정 차시 모듈 링크 조회
  async findByProjectAndSession(
    projectIdx: number,
    sessionNumber: number
  ): Promise<IProjectModuleLink[]> {
    return await ProjectModuleLink.find({
      project_idx: projectIdx,
      session_number: sessionNumber,
    })
      .sort({ module_order: 1 })
      .exec();
  }

  // 특정 모듈 링크 조회
  async findOne(
    projectIdx: number,
    moduleIdx: number,
    sessionNumber: number
  ): Promise<IProjectModuleLink | null> {
    return await ProjectModuleLink.findOne({
      project_idx: projectIdx,
      module_idx: moduleIdx,
      session_number: sessionNumber,
    }).exec();
  }

  // 모듈 링크 생성
  async create(data: {
    project_idx: number;
    module_idx: number;
    session_number: number;
    module_order: number;
  }): Promise<IProjectModuleLink> {
    const link = new ProjectModuleLink(data);
    return await link.save();
  }

  // 모듈 순서 업데이트
  async updateOrder(
    projectIdx: number,
    moduleIdx: number,
    sessionNumber: number,
    moduleOrder: number
  ): Promise<IProjectModuleLink | null> {
    return await ProjectModuleLink.findOneAndUpdate(
      {
        project_idx: projectIdx,
        module_idx: moduleIdx,
        session_number: sessionNumber,
      },
      { $set: { module_order: moduleOrder } },
      { new: true, runValidators: true }
    ).exec();
  }

  // 차시 내 모든 모듈의 순서 재정렬
  async reorderSessionModules(
    projectIdx: number,
    sessionNumber: number,
    moduleOrders: Array<{ module_idx: number; module_order: number }>
  ): Promise<void> {
    const bulkOps = moduleOrders.map(({ module_idx, module_order }) => ({
      updateOne: {
        filter: {
          project_idx: projectIdx,
          module_idx: module_idx,
          session_number: sessionNumber,
        },
        update: { $set: { module_order: module_order } },
      },
    }));

    if (bulkOps.length > 0) {
      await ProjectModuleLink.bulkWrite(bulkOps);
    }
  }

  // 모듈 링크 삭제
  async delete(
    projectIdx: number,
    moduleIdx: number,
    sessionNumber: number
  ): Promise<boolean> {
    const result = await ProjectModuleLink.findOneAndDelete({
      project_idx: projectIdx,
      module_idx: moduleIdx,
      session_number: sessionNumber,
    }).exec();
    return !!result;
  }

  // 프로젝트의 모든 모듈 링크 삭제
  async deleteByProject(projectIdx: number): Promise<number> {
    const result = await ProjectModuleLink.deleteMany({
      project_idx: projectIdx,
    }).exec();
    return result.deletedCount || 0;
  }

  // 특정 차시의 모든 모듈 링크 삭제
  async deleteByProjectAndSession(
    projectIdx: number,
    sessionNumber: number
  ): Promise<number> {
    const result = await ProjectModuleLink.deleteMany({
      project_idx: projectIdx,
      session_number: sessionNumber,
    }).exec();
    return result.deletedCount || 0;
  }

  // 특정 차시의 최대 module_order 조회
  async getMaxOrder(
    projectIdx: number,
    sessionNumber: number
  ): Promise<number> {
    const result = await ProjectModuleLink.findOne({
      project_idx: projectIdx,
      session_number: sessionNumber,
    })
      .sort({ module_order: -1 })
      .select("module_order")
      .exec();

    return result?.module_order || 0;
  }
}

export default new ProjectModuleLinkRepository();

