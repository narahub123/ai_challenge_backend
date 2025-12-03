import { ModuleFormatType } from "../../types";

/**
 * 모듈 생성 요청 DTO
 */
export class CreateModuleDto {
  module_name: string;
  description?: string | null;
  format_type: ModuleFormatType;
  format_ref_id: number;
  module_order?: number;
  game_type?: string | null;
  status?: boolean | 0 | 1;

  constructor(data: Partial<CreateModuleDto>) {
    this.module_name = data.module_name || "";
    this.description = data.description ?? null;
    this.format_type = data.format_type || "quiz";
    this.format_ref_id = data.format_ref_id ?? 0;
    this.module_order = data.module_order ?? 0;
    this.game_type = data.game_type ?? null;
    this.status = data.status !== undefined ? Boolean(data.status) : true;
  }
}

/**
 * 모듈 업데이트 요청 DTO
 * 모든 필드가 선택적 (Partial Update)
 */
export class UpdateModuleDto {
  module_name?: string;
  description?: string | null;
  format_type?: ModuleFormatType;
  format_ref_id?: number;
  module_order?: number;
  game_type?: string | null;
  status?: boolean | 0 | 1;

  constructor(data: Partial<UpdateModuleDto>) {
    if (data.module_name !== undefined) {
      this.module_name = data.module_name;
    }
    if (data.description !== undefined) {
      this.description = data.description;
    }
    if (data.format_type !== undefined) {
      this.format_type = data.format_type;
    }
    if (data.format_ref_id !== undefined) {
      this.format_ref_id = data.format_ref_id;
    }
    if (data.module_order !== undefined) {
      this.module_order = data.module_order;
    }
    if (data.game_type !== undefined) {
      this.game_type = data.game_type;
    }
    if (data.status !== undefined) {
      this.status = Boolean(data.status);
    }
  }
}

