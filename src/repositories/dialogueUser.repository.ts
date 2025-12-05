import { DialogueUser } from "../models";
import { IDialogueUser } from "../types/dialogue-user.type";
import { DialogueUserEntity } from "../entities";

class DialogueUserRepository {
  // 전체 사용자 개수 조회 (필터 포함)
  async count(filters?: {
    search?: string;
  }): Promise<number> {
    const query = this.buildQuery(filters);
    return await DialogueUser.countDocuments(query).exec();
  }

  // 모든 사용자 조회 (Pagination 및 필터링 지원)
  async findAll(
    page: number = 1,
    limit: number = 10,
    filters?: {
      search?: string;
    }
  ): Promise<IDialogueUser[]> {
    const skip = (page - 1) * limit;
    const query = this.buildQuery(filters);
    
    return await DialogueUser.find(query)
      .sort({ dialogue_user_idx: -1 })
      .skip(skip)
      .limit(limit)
      .exec();
  }

  // 필터 쿼리 빌드
  private buildQuery(filters?: {
    search?: string;
  }): any {
    const query: any = {};

    if (filters) {
      // 검색: name에서 검색
      if (filters.search) {
        query.name = { $regex: filters.search, $options: "i" };
      }
    }

    return query;
  }

  // ID로 사용자 조회
  async findById(userIdx: number): Promise<IDialogueUser | null> {
    return await DialogueUser.findOne({ dialogue_user_idx: userIdx }).exec();
  }

  // 사용자 생성 (Entity 받아서 처리)
  async create(entity: DialogueUserEntity): Promise<IDialogueUser> {
    const user = new DialogueUser(entity.toPlainObject());
    return await user.save();
  }

  // 사용자 업데이트 (Entity 받아서 처리)
  async update(
    userIdx: number,
    entity: Partial<DialogueUserEntity>
  ): Promise<IDialogueUser | null> {
    const updateData =
      entity instanceof DialogueUserEntity ? entity.toPlainObject() : entity;

    return await DialogueUser.findOneAndUpdate(
      { dialogue_user_idx: userIdx },
      { $set: updateData },
      { new: true, runValidators: true }
    ).exec();
  }

  // 사용자 삭제
  async delete(userIdx: number): Promise<boolean> {
    const result = await DialogueUser.findOneAndDelete({
      dialogue_user_idx: userIdx,
    }).exec();
    return !!result;
  }
}

export default new DialogueUserRepository();

