import { IDialogue } from "../../types/dialogue.type";
import { IDialogueUser, IDialogueEntry } from "../../types";
import {DialogueUserResponseDto, DialogueEntryResponseDto}from '../../dtos'

/**
 * 대화 응답 DTO
 * 클라이언트로 반환할 데이터 구조
 */
export class DialogueResponseDto {
  dialogue_idx: number;
  title: string | null;
  description: string | null;
  participants: DialogueUserResponseDto[]; // DialogueUser 정보 배열
  status: 0 | 1;
  created_at: string;
  updated_at: string;
  entries: DialogueEntryResponseDto[]; // DialogueEntry 정보 배열

  constructor(data: DialogueResponseDto) {
    this.dialogue_idx = data.dialogue_idx;
    this.title = data.title;
    this.description = data.description;
    this.participants = data.participants;
    this.status = data.status;
    this.created_at = data.created_at;
    this.updated_at = data.updated_at;
    this.entries = data.entries;
  }

  /**
   * Entity나 Document를 Response DTO로 변환
   * @param entity Dialogue 엔티티
   * @param dialogueUsers DialogueUser 배열 (participants의 dialogue_user_idx로 조회한 결과)
   * @param dialogueEntries DialogueEntry 배열 (dialogue_idx로 조회한 결과)
   */
  static fromEntity(
    entity: IDialogue,
    dialogueUsers?: IDialogueUser[],
    dialogueEntries?: IDialogueEntry[]
  ): DialogueResponseDto {
    // Date를 ISO string으로 변환
    const formatDate = (date: Date | undefined | null): string => {
      if (!date) return new Date().toISOString();
      return date instanceof Date
        ? date.toISOString()
        : new Date(date).toISOString();
    };

    // boolean을 0 | 1로 변환
    const booleanToNumber = (value: boolean | undefined | null): 0 | 1 => {
      return value ? 1 : 0;
    };

    // participants 배열의 dialogue_user_idx를 사용해서 DialogueUser 조회
    // dialogueUsers가 제공되지 않으면 빈 배열 반환
    const transformedParticipants = dialogueUsers
      ? dialogueUsers.map((user) => DialogueUserResponseDto.fromEntity(user))
      : [];

    // participants 검증: 최소 2명 이상
    if (transformedParticipants.length < 2) {
      throw new Error(
        `participants는 최소 2명 이상이어야 합니다. 현재: ${transformedParticipants.length}명`
      );
    }

    // dialogue_idx로 DialogueEntry 조회
    // dialogueEntries가 제공되지 않으면 빈 배열 반환
    const transformedEntries = dialogueEntries
      ? dialogueEntries.map((entry) =>
          DialogueEntryResponseDto.fromEntity(entry)
        )
      : [];

    return new DialogueResponseDto({
      dialogue_idx: entity.dialogue_idx || 0,
      title: entity.title ?? null,
      description: entity.description ?? null,
      participants: transformedParticipants,
      status: booleanToNumber(entity.status),
      created_at: formatDate(entity.created_at),
      updated_at: formatDate(entity.updated_at),
      entries: transformedEntries,
    });
  }
}

