import { Dialogue } from "../models";
import { IDialogue } from "../types";
import { DialogueEntity } from "../entities";

class DialogueRepository {
  // 전체 대화 개수 조회 (필터 포함)
  async count(filters?: {
    search?: string;
    status?: boolean;
  }): Promise<number> {
    const query = this.buildQuery(filters);
    return await Dialogue.countDocuments(query).exec();
  }

  // 모든 대화 조회 (Pagination 및 필터링 지원)
  async findAll(
    page: number = 1,
    limit: number = 10,
    filters?: {
      search?: string;
      status?: boolean;
    }
  ): Promise<IDialogue[]> {
    const skip = (page - 1) * limit;
    const query = this.buildQuery(filters);

    return await Dialogue.find(query)
      .sort({ dialogue_idx: -1 })
      .skip(skip)
      .limit(limit)
      .exec();
  }

  // 필터 쿼리 빌드
  private buildQuery(filters?: {
    search?: string;
    status?: boolean;
  }): any {
    const query: any = {};

    if (filters) {
      // 검색: title, description에서 검색
      if (filters.search) {
        query.$or = [
          { title: { $regex: filters.search, $options: "i" } },
          { description: { $regex: filters.search, $options: "i" } },
        ];
      }

      // 상태 필터
      if (filters.status !== undefined) {
        query.status = filters.status;
      }
    }

    return query;
  }

  // ID로 대화 조회
  async findById(dialogueIdx: number): Promise<IDialogue | null> {
    return await Dialogue.findOne({ dialogue_idx: dialogueIdx }).exec();
  }

  // 대화 생성 (Entity 받아서 처리)
  async create(entity: DialogueEntity): Promise<IDialogue> {
    const dialogue = new Dialogue(entity.toPlainObject());
    return await dialogue.save();
  }

  // 대화 업데이트 (Entity 받아서 처리)
  async update(
    dialogueIdx: number,
    entity: Partial<DialogueEntity>
  ): Promise<IDialogue | null> {
    const updateData =
      entity instanceof DialogueEntity ? entity.toPlainObject() : entity;

    return await Dialogue.findOneAndUpdate(
      { dialogue_idx: dialogueIdx },
      { $set: updateData },
      { new: true, runValidators: true }
    ).exec();
  }

  // 대화 삭제
  async delete(dialogueIdx: number): Promise<boolean> {
    const result = await Dialogue.findOneAndDelete({
      dialogue_idx: dialogueIdx,
    }).exec();
    return !!result;
  }
}

export default new DialogueRepository();
