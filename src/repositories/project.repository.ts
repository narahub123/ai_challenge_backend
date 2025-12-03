import { Project } from "../models";
import { IProject } from "../types";
import { ProjectEntity } from "../entities";

class ProjectRepository {
  // 전체 프로젝트 개수 조회 (필터 포함)
  async count(filters?: {
    search?: string;
    grade?: string;
    subject?: string;
    status?: boolean;
  }): Promise<number> {
    const query = this.buildQuery(filters);
    return await Project.countDocuments(query).exec();
  }

  // 모든 프로젝트 조회 (Pagination 및 필터링 지원)
  async findAll(
    page: number = 1,
    limit: number = 10,
    filters?: {
      search?: string;
      grade?: string;
      subject?: string;
      status?: boolean;
    }
  ): Promise<IProject[]> {
    const skip = (page - 1) * limit;
    const query = this.buildQuery(filters);
    
    return await Project.find(query)
      .sort({ project_idx: -1 })
      .skip(skip)
      .limit(limit)
      .exec();
  }

  // 필터 쿼리 빌드
  private buildQuery(filters?: {
    search?: string;
    grade?: string;
    subject?: string;
    status?: boolean;
  }): any {
    const query: any = {};

    if (filters) {
      // 검색: project_name, description에서 검색
      if (filters.search) {
        query.$or = [
          { project_name: { $regex: filters.search, $options: "i" } },
          { description: { $regex: filters.search, $options: "i" } },
        ];
      }

      // 학년 필터
      if (filters.grade) {
        query.grade = filters.grade;
      }

      // 과목 필터
      if (filters.subject) {
        query.subject = filters.subject;
      }

      // 상태 필터
      if (filters.status !== undefined) {
        query.status = filters.status;
      }
    }

    return query;
  }

  // ID로 프로젝트 조회
  async findById(projectIdx: number): Promise<IProject | null> {
    return await Project.findOne({ project_idx: projectIdx }).exec();
  }

  // 프로젝트 생성 (Entity 받아서 처리)
  async create(entity: ProjectEntity): Promise<IProject> {
    const project = new Project(entity.toPlainObject());
    return await project.save();
  }

  // 프로젝트 업데이트 (Entity 받아서 처리)
  async update(
    projectIdx: number,
    entity: Partial<ProjectEntity>
  ): Promise<IProject | null> {
    const updateData =
      entity instanceof ProjectEntity ? entity.toPlainObject() : entity;

    return await Project.findOneAndUpdate(
      { project_idx: projectIdx },
      { $set: updateData },
      { new: true, runValidators: true }
    ).exec();
  }

  // 프로젝트 삭제
  async delete(projectIdx: number): Promise<boolean> {
    const result = await Project.findOneAndDelete({ project_idx: projectIdx }).exec();
    return !!result;
  }
}

export default new ProjectRepository();
