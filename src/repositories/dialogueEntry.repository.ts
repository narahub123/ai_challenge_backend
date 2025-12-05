import { DialogueEntry } from "../models";
import { DialogueEntry as IDialogueEntry } from "../types/dialogue-entry.type";
import { DialogueEntryEntity } from "../entities/dialogue-entry.entity";

class DialogueEntryRepository {
  // 전체 엔트리 개수 조회 (필터 포함)
  async count(filters?: {
    dialogue_idx?: number;
    self_dialogue_user_idx?: number;
    opponent_dialogue_user_idx?: number;
  }): Promise<number> {
    const query = this.buildQuery(filters);
    return await DialogueEntry.countDocuments(query).exec();
  }

  // 모든 엔트리 조회 (Pagination 및 필터링 지원)
  async findAll(
    page: number = 1,
    limit: number = 10,
    filters?: {
      dialogue_idx?: number;
      self_dialogue_user_idx?: number;
      opponent_dialogue_user_idx?: number;
    }
  ): Promise<IDialogueEntry[]> {
    const skip = (page - 1) * limit;
    const query = this.buildQuery(filters);
    
    return await DialogueEntry.find(query)
      .sort({ created_at: 1 })
      .skip(skip)
      .limit(limit)
      .exec();
  }

  // 필터 쿼리 빌드
  private buildQuery(filters?: {
    dialogue_idx?: number;
    self_dialogue_user_idx?: number;
    opponent_dialogue_user_idx?: number;
  }): any {
    const query: any = {};

    if (filters) {
      // dialogue_idx 필터
      if (filters.dialogue_idx !== undefined) {
        query.dialogue_idx = filters.dialogue_idx;
      }

      // self_dialogue_user_idx 필터
      if (filters.self_dialogue_user_idx !== undefined) {
        query.self_dialogue_user_idx = filters.self_dialogue_user_idx;
      }

      // opponent_dialogue_user_idx 필터
      if (filters.opponent_dialogue_user_idx !== undefined) {
        query.opponent_dialogue_user_idx = filters.opponent_dialogue_user_idx;
      }
    }

    return query;
  }

  // ID로 엔트리 조회
  async findById(entryIdx: number): Promise<IDialogueEntry | null> {
    return await DialogueEntry.findOne({ entry_idx: entryIdx }).exec();
  }

  // dialogue_idx로 엔트리들 조회
  async findByDialogueIdx(dialogueIdx: number): Promise<IDialogueEntry[]> {
    return await DialogueEntry.find({ dialogue_idx: dialogueIdx })
      .sort({ created_at: 1 })
      .exec();
  }

  // 엔트리 생성 (Entity 받아서 처리)
  async create(entity: DialogueEntryEntity): Promise<IDialogueEntry> {
    const entry = new DialogueEntry(entity.toPlainObject());
    return await entry.save();
  }

  // 엔트리 업데이트 (Entity 받아서 처리)
  async update(
    entryIdx: number,
    entity: Partial<DialogueEntryEntity>
  ): Promise<IDialogueEntry | null> {
    const updateData =
      entity instanceof DialogueEntryEntity ? entity.toPlainObject() : entity;

    return await DialogueEntry.findOneAndUpdate(
      { entry_idx: entryIdx },
      { $set: updateData },
      { new: true, runValidators: true }
    ).exec();
  }

  // 엔트리 삭제
  async delete(entryIdx: number): Promise<boolean> {
    const result = await DialogueEntry.findOneAndDelete({
      entry_idx: entryIdx,
    }).exec();
    return !!result;
  }
}

export default new DialogueEntryRepository();

