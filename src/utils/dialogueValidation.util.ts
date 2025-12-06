import { DialogueEntryQA, QuestionContent, AnswerContent } from "../types/dialogue-entry.type";
import { CreateDialogueEntryDto } from "../dtos/request/dialogue-entry-request.dto";

/**
 * DialogueEntryQA의 content가 비어있는지 확인
 */
const isContentEmpty = (qa: DialogueEntryQA<QuestionContent | AnswerContent>): boolean => {
  if (!qa || !qa.content_type) return true;

  if (qa.content_type === "text") {
    return typeof qa.content !== "string" || qa.content.trim().length === 0;
  } else if (qa.content_type === "card-news") {
    const content = qa.content as any;
    return !content || !content.card_news_idx || content.card_news_idx === 0;
  } else if (qa.content_type === "quiz") {
    const content = qa.content as any;
    return !content || !content.quiz_idx || content.quiz_idx === 0;
  }

  return true;
};

/**
 * 단일 DialogueEntry의 유효성 검사
 */
export const validateDialogueEntry = (entry: CreateDialogueEntryDto | Omit<CreateDialogueEntryDto, "dialogue_idx">): void => {
  // Question 검사
  if (!entry.question || isContentEmpty(entry.question)) {
    throw new Error("질문 내용을 입력해주세요.");
  }

  // Answer 검사 (answer가 있고, question이 quiz가 아닌 경우에만)
  if (entry.question?.content_type === "quiz") {
    // 질문이 퀴즈인 경우 답변은 선택 불가
    // 따라서 answer 검사는 하지 않음
  } else if (entry.answer) {
    // answer가 있는 경우 비어있으면 안됨
    if (isContentEmpty(entry.answer)) {
      throw new Error("답변 내용을 입력해주세요.");
    }
  }
};

/**
 * DialogueEntry 배열의 유효성 검사
 */
export const validateDialogueEntries = (
  entries: (CreateDialogueEntryDto | Omit<CreateDialogueEntryDto, "dialogue_idx">)[]
): void => {
  // 최소 1개 이상의 entry가 필요
  if (!entries || entries.length === 0) {
    throw new Error("대화 목록은 최소 1개 이상이어야 합니다.");
  }

  // 각 entry 검사
  entries.forEach((entry, index) => {
    try {
      validateDialogueEntry(entry);
    } catch (error: any) {
      throw new Error(`대화 #${index + 1}: ${error.message}`);
    }
  });
};

