import { ModuleFormatType } from "../types";

/**
 * Module 도메인 엔티티
 * DB 스키마와 독립적인 순수 도메인 객체
 */
export class ModuleEntity {
  module_idx?: number;
  module_name: string;
  description: string | null;
  format_type: ModuleFormatType;
  format_ref_id: number;
  module_order: number;
  game_type: string | null;
  status: boolean;
  created_at?: Date;
  updated_at?: Date;

  constructor(data: Partial<ModuleEntity>) {
    this.module_idx = data.module_idx;
    this.module_name = data.module_name || "";
    this.description = data.description ?? null;
    this.format_type = data.format_type || "quiz";
    this.format_ref_id = data.format_ref_id ?? 0;
    this.module_order = data.module_order ?? 0;
    this.game_type = data.game_type ?? null;
    // status를 boolean으로 변환 (0/1도 처리)
    this.status = data.status !== undefined ? Boolean(data.status) : true;
    this.created_at = data.created_at;
    this.updated_at = data.updated_at;
  }

  /**
   * Mongoose Document를 Entity로 변환
   */
  static fromDocument(document: any): ModuleEntity {
    return new ModuleEntity({
      module_idx: document.module_idx,
      module_name: document.module_name,
      description: document.description,
      format_type: document.format_type,
      format_ref_id: document.format_ref_id,
      module_order: document.module_order,
      game_type: document.game_type,
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
      module_idx: this.module_idx,
      module_name: this.module_name,
      description: this.description,
      format_type: this.format_type,
      format_ref_id: this.format_ref_id,
      module_order: this.module_order,
      game_type: this.game_type,
      status: this.status,
      created_at: this.created_at,
      updated_at: this.updated_at,
    };
  }
}

