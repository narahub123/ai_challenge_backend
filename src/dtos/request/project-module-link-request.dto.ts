/**
 * 프로젝트에 모듈 추가 요청 DTO
 */
export class AddModuleToProjectDto {
  module_idx: number;
  session_number: number;
  module_order?: number; // 선택적, 없으면 자동으로 마지막 순서 + 1

  constructor(data: Partial<AddModuleToProjectDto>) {
    this.module_idx = data.module_idx || 0;
    this.session_number = data.session_number || 1;
    this.module_order = data.module_order;
  }
}

/**
 * 모듈 순서 변경 요청 DTO
 */
export class UpdateModuleOrderDto {
  session_number: number;
  module_order: number;

  constructor(data: Partial<UpdateModuleOrderDto>) {
    this.session_number = data.session_number || 1;
    this.module_order = data.module_order || 1;
  }
}

