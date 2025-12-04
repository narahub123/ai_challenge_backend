/**
 * DialogueUser 도메인 엔티티
 */
export class DialogueUserEntity {
  dialogue_user_idx?: number;
  name: string;
  avatar_url: string | null;
  created_at?: Date;
  updated_at?: Date;

  constructor(data: Partial<DialogueUserEntity>) {
    this.dialogue_user_idx = data.dialogue_user_idx;
    this.name = data.name || "";
    this.avatar_url = data.avatar_url ?? null;
    this.created_at = data.created_at;
    this.updated_at = data.updated_at;
  }

  /**
   * Mongoose Document를 Entity로 변환
   */
  static fromDocument(document: any): DialogueUserEntity {
    return new DialogueUserEntity({
      dialogue_user_idx: document.dialogue_user_idx,
      name: document.name,
      avatar_url: document.avatar_url,
      created_at: document.created_at,
      updated_at: document.updated_at,
    });
  }

  /**
   * Entity를 일반 객체로 변환
   */
  toPlainObject(): Record<string, any> {
    return {
      dialogue_user_idx: this.dialogue_user_idx,
      name: this.name,
      avatar_url: this.avatar_url,
      created_at: this.created_at,
      updated_at: this.updated_at,
    };
  }
}

