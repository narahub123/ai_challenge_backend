/**
 * FormData의 중첩 구조를 파싱하는 유틸리티
 * entries[0].question.content_type 같은 형식을 배열과 중첩 객체로 변환
 */

/**
 * FormData의 entries 배열을 파싱
 * @param body Express의 req.body (FormData 파싱 후)
 * @returns 파싱된 entries 배열
 */
export function parseEntriesFromFormData(body: any): any[] {
  const entries: any[] = [];
  const entryMap = new Map<number, any>();

  // entries[0].question.content_type 같은 키를 찾아서 파싱
  for (const key in body) {
    const match = key.match(/^entries\[(\d+)\]\.(.+)$/);
    if (match) {
      const index = parseInt(match[1], 10);
      const path = match[2];

      if (!entryMap.has(index)) {
        entryMap.set(index, {});
      }

      const entry = entryMap.get(index);
      setNestedValue(entry, path, body[key]);
    }
  }

  // Map을 배열로 변환 (인덱스 순서대로)
  const sortedIndices = Array.from(entryMap.keys()).sort((a, b) => a - b);
  sortedIndices.forEach((index) => {
    entries.push(entryMap.get(index));
  });

  return entries;
}

/**
 * 중첩된 경로에 값을 설정
 * @param obj 대상 객체
 * @param path 경로 (예: "question.content_type")
 * @param value 설정할 값
 */
function setNestedValue(obj: any, path: string, value: any): void {
  const keys = path.split(".");
  let current = obj;

  for (let i = 0; i < keys.length - 1; i++) {
    const key = keys[i];
    if (!current[key]) {
      current[key] = {};
    }
    current = current[key];
  }

  const lastKey = keys[keys.length - 1];
  current[lastKey] = value;
}

/**
 * FormData의 participants 배열을 파싱
 * @param body Express의 req.body
 * @returns participants 배열 (number[])
 */
export function parseParticipantsFromFormData(body: any): number[] {
  const participants: number[] = [];
  const participantMap = new Map<number, string>();

  // participants[0], participants[1] 같은 키를 찾아서 파싱
  for (const key in body) {
    const match = key.match(/^participants\[(\d+)\]$/);
    if (match) {
      const index = parseInt(match[1], 10);
      participantMap.set(index, body[key]);
    }
  }

  // Map을 배열로 변환 (인덱스 순서대로)
  const sortedIndices = Array.from(participantMap.keys()).sort((a, b) => a - b);
  sortedIndices.forEach((index) => {
    const value = participantMap.get(index);
    if (value !== undefined) {
      participants.push(typeof value === "string" ? parseInt(value, 10) : Number(value));
    }
  });

  return participants;
}

