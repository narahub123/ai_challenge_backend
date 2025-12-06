/**
 * 대화 생성 요청 DTO
 */
export class CreateDialogueDto {
  title?: string | null;
  description?: string | null;
  participants: number[]; // DialogueUser 참조 배열
  status?: boolean | 0 | 1;

  constructor(data: Partial<CreateDialogueDto>) {
    this.title = data.title ?? null;
    this.description = data.description ?? null;
    
    if (!data.participants || !Array.isArray(data.participants) || data.participants.length < 2) {
      throw new Error("participants는 최소 2명 이상이어야 합니다.");
    }
    this.participants = data.participants;
    
    this.status = data.status !== undefined ? Boolean(data.status) : true;
  }
}

/**
 * 대화 업데이트 요청 DTO
 * 모든 필드가 선택적 (Partial Update)
 */
export class UpdateDialogueDto {
  title?: string | null;
  description?: string | null;
  participants?: number[];
  status?: boolean | 0 | 1;

  constructor(data: Partial<UpdateDialogueDto>) {
    if (data.title !== undefined) {
      this.title = data.title;
    }
    if (data.description !== undefined) {
      this.description = data.description;
    }
    if (data.participants !== undefined) {
      if (!Array.isArray(data.participants) || data.participants.length < 2) {
        throw new Error("participants는 최소 2명 이상이어야 합니다.");
      }
      this.participants = data.participants;
    }
    if (data.status !== undefined) {
      this.status = Boolean(data.status);
    }
  }
}

