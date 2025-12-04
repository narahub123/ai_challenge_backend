/**
 * Dialogue 도메인 엔티티
 * DB 스키마와 독립적인 순수 도메인 객체
 */
export class DialogueEntity {
  dialogue_idx?: number;
  title: string | null;
  description: string | null;
  participants: number[];
  status: boolean;
  created_at?: Date;
  updated_at?: Date;

  constructor(data: Partial<DialogueEntity>) {
    this.dialogue_idx = data.dialogue_idx;
    this.title = data.title ?? null;
    this.description = data.description ?? null;
    this.participants = data.participants || [];
    this.status = data.status ?? true;
    this.created_at = data.created_at;
    this.updated_at = data.updated_at;
  }

  /**
   * Mongoose Document를 Entity로 변환
   */
  static fromDocument(document: any): DialogueEntity {
    return new DialogueEntity({
      dialogue_idx: document.dialogue_idx,
      title: document.title,
      description: document.description,
      participants: document.participants,
      status: document.status,
      created_at: document.created_at,
      updated_at: document.updated_at,
    });
  }

  /**
   * Entity를 일반 객체로 변환
   */
  toPlainObject(): Record<string, any> {
    return {
      dialogue_idx: this.dialogue_idx,
      title: this.title,
      description: this.description,
      participants: this.participants,
      status: this.status,
      created_at: this.created_at,
      updated_at: this.updated_at,
    };
  }
}

