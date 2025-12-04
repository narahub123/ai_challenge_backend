import { DialogueUser } from "../models";
import { IDialogueUser } from "../types";
import { DialogueUserEntity } from "../entities";

class DialogueUserRepository {
  // ID 목록으로 사용자 조회
  async findByIds(userIds: number[]): Promise<IDialogueUser[]> {
    if (userIds.length === 0) return [];
    return await DialogueUser.find({
      dialogue_user_idx: { $in: userIds },
    }).exec();
  }

  // ID로 사용자 조회
  async findById(dialogueUserId: number): Promise<IDialogueUser | null> {
    return await DialogueUser.findOne({
      dialogue_user_idx: dialogueUserId,
    }).exec();
  }

  // 모든 사용자 조회 (페이지네이션)
  async findAll(page: number = 1, limit: number = 100): Promise<IDialogueUser[]> {
    const skip = (page - 1) * limit;
    return await DialogueUser.find()
      .sort({ dialogue_user_idx: -1 })
      .skip(skip)
      .limit(limit)
      .exec();
  }

  // 전체 사용자 개수 조회
  async count(): Promise<number> {
    return await DialogueUser.countDocuments().exec();
  }

  // 사용자 생성
  async create(entity: DialogueUserEntity): Promise<IDialogueUser> {
    const user = new DialogueUser(entity.toPlainObject());
    return await user.save();
  }

  // 사용자 업데이트
  async update(
    dialogueUserId: number,
    entity: Partial<DialogueUserEntity>
  ): Promise<IDialogueUser | null> {
    const updateData =
      entity instanceof DialogueUserEntity ? entity.toPlainObject() : entity;

    return await DialogueUser.findOneAndUpdate(
      { dialogue_user_idx: dialogueUserId },
      { $set: updateData },
      { new: true, runValidators: true }
    ).exec();
  }

  // 사용자 삭제
  async delete(dialogueUserId: number): Promise<boolean> {
    const result = await DialogueUser.findOneAndDelete({
      dialogue_user_idx: dialogueUserId,
    }).exec();
    return !!result;
  }
}

export default new DialogueUserRepository();
