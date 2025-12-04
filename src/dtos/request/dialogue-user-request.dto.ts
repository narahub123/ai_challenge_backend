/**
 * 대화 사용자 생성 요청 DTO
 */
export class CreateDialogueUserDto {
  name: string;
  avatar_url?: string | null;

  constructor(data: Partial<CreateDialogueUserDto>) {
    this.name = data.name || "";
    this.avatar_url = data.avatar_url ?? null;
  }
}

/**
 * 대화 사용자 업데이트 요청 DTO
 * 모든 필드가 선택적 (Partial Update)
 */
export class UpdateDialogueUserDto {
  name?: string;
  avatar_url?: string | null;

  constructor(data: Partial<UpdateDialogueUserDto>) {
    if (data.name !== undefined) {
      this.name = data.name;
    }
    if (data.avatar_url !== undefined) {
      this.avatar_url = data.avatar_url;
    }
  }
}

