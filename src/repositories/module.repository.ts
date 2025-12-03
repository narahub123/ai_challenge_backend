import { Module } from "../models";
import { IModule } from "../types";
import { ModuleEntity } from "../entities";

class ModuleRepository {
  // 전체 모듈 개수 조회 (필터 포함)
  async count(filters?: {
    search?: string;
    format_type?: string;
    status?: boolean;
  }): Promise<number> {
    const query = this.buildQuery(filters);
    return await Module.countDocuments(query).exec();
  }

  // 모든 모듈 조회 (Pagination 및 필터링 지원)
  async findAll(
    page: number = 1,
    limit: number = 10,
    filters?: {
      search?: string;
      format_type?: string;
      status?: boolean;
    }
  ): Promise<IModule[]> {
    const skip = (page - 1) * limit;
    const query = this.buildQuery(filters);
    
    return await Module.find(query)
      .sort({ module_idx: -1 })
      .skip(skip)
      .limit(limit)
      .exec();
  }

  // 필터 쿼리 빌드
  private buildQuery(filters?: {
    search?: string;
    format_type?: string;
    status?: boolean;
  }): any {
    const query: any = {};

    if (filters) {
      // 검색: module_name, description에서 검색
      if (filters.search) {
        query.$or = [
          { module_name: { $regex: filters.search, $options: "i" } },
          { description: { $regex: filters.search, $options: "i" } },
        ];
      }

      // 포맷 타입 필터
      if (filters.format_type) {
        query.format_type = filters.format_type;
      }

      // 상태 필터
      if (filters.status !== undefined) {
        query.status = filters.status;
      }
    }

    return query;
  }

  // ID로 모듈 조회
  async findById(moduleIdx: number): Promise<IModule | null> {
    return await Module.findOne({ module_idx: moduleIdx }).exec();
  }

  // 모듈 생성 (Entity 받아서 처리)
  async create(entity: ModuleEntity): Promise<IModule> {
    const module = new Module(entity.toPlainObject());
    return await module.save();
  }

  // 모듈 업데이트 (Entity 받아서 처리)
  async update(
    moduleIdx: number,
    entity: Partial<ModuleEntity>
  ): Promise<IModule | null> {
    const updateData =
      entity instanceof ModuleEntity ? entity.toPlainObject() : entity;

    return await Module.findOneAndUpdate(
      { module_idx: moduleIdx },
      { $set: updateData },
      { new: true, runValidators: true }
    ).exec();
  }

  // 모듈 삭제
  async delete(moduleIdx: number): Promise<boolean> {
    const result = await Module.findOneAndDelete({ module_idx: moduleIdx }).exec();
    return !!result;
  }
}

export default new ModuleRepository();
