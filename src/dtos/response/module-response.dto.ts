import { ModuleFormatType } from "../../types";

/**
 * 모듈 응답 DTO
 * 클라이언트로 반환할 데이터 구조
 */
export class ModuleResponseDto {
  module_idx: number;
  module_name: string;
  description: string | null;
  format_type: ModuleFormatType;
  format_ref_id: number;
  module_order: number;
  game_type: string | null;
  status: 0 | 1;
  created_at: string;
  updated_at: string;

  constructor(data: ModuleResponseDto) {
    this.module_idx = data.module_idx;
    this.module_name = data.module_name;
    this.description = data.description;
    this.format_type = data.format_type;
    this.format_ref_id = data.format_ref_id;
    this.module_order = data.module_order;
    this.game_type = data.game_type;
    this.status = data.status;
    this.created_at = data.created_at;
    this.updated_at = data.updated_at;
  }

  /**
   * Entity나 Document를 Response DTO로 변환
   */
  static fromEntity(entity: any): ModuleResponseDto {
    // Date를 ISO string으로 변환
    const formatDate = (date: Date | undefined | null): string => {
      if (!date) return new Date().toISOString();
      return date instanceof Date ? date.toISOString() : new Date(date).toISOString();
    };

    // boolean을 0 | 1로 변환
    const booleanToNumber = (value: boolean | undefined | null): 0 | 1 => {
      return value ? 1 : 0;
    };

    return new ModuleResponseDto({
      module_idx: entity.module_idx || 0,
      module_name: entity.module_name || "",
      description: entity.description ?? null,
      format_type: entity.format_type || "quiz",
      format_ref_id: entity.format_ref_id || 0,
      module_order: entity.module_order ?? 0,
      game_type: entity.game_type ?? null,
      status: booleanToNumber(entity.status),
      created_at: formatDate(entity.created_at),
      updated_at: formatDate(entity.updated_at),
    });
  }
}

