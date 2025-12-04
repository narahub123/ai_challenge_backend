import { DialogueEntry } from "../models";
import { IDialogueEntry } from "../types";
import { DialogueEntryEntity } from "../entities";

class DialogueEntryRepository {
  // 특정 dialogue의 모든 엔트리 조회
  async findByDialogueIdx(
    dialogueIdx: number,
    page: number = 1,
    limit: number = 100
  ): Promise<IDialogueEntry[]> {
    const skip = (page - 1) * limit;
    return await DialogueEntry.find({ dialogue_idx: dialogueIdx })
      .sort({ created_at: 1 })
      .skip(skip)
      .limit(limit)
      .exec();
  }

  // 특정 dialogue의 엔트리 개수 조회
  async countByDialogueIdx(dialogueIdx: number): Promise<number> {
    return await DialogueEntry.countDocuments({
      dialogue_idx: dialogueIdx,
    }).exec();
  }

  // ID로 엔트리 조회
  async findById(entryIdx: number): Promise<IDialogueEntry | null> {
    return await DialogueEntry.findOne({ entry_idx: entryIdx }).exec();
  }

  // dialogue_idx와 entry_idx로 조회
  async findByDialogueAndEntry(
    dialogueIdx: number,
    entryIdx: number
  ): Promise<IDialogueEntry | null> {
    return await DialogueEntry.findOne({
      dialogue_idx: dialogueIdx,
      entry_idx: entryIdx,
    }).exec();
  }

  // 엔트리 생성
  async create(entity: DialogueEntryEntity): Promise<IDialogueEntry> {
    const entry = new DialogueEntry(entity.toPlainObject());
    return await entry.save();
  }

  // 엔트리 업데이트
  async update(
    entryIdx: number,
    entity: Partial<DialogueEntryEntity>
  ): Promise<IDialogueEntry | null> {
    const updateData =
      entity instanceof DialogueEntryEntity
        ? entity.toPlainObject()
        : entity;

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

  // 특정 dialogue의 모든 엔트리 삭제
  async deleteByDialogueIdx(dialogueIdx: number): Promise<number> {
    const result = await DialogueEntry.deleteMany({
      dialogue_idx: dialogueIdx,
    }).exec();
    return result.deletedCount || 0;
  }
}

export default new DialogueEntryRepository();
