export interface ITodoItem {
  id: string; // 고유 아이디
  name: string; // 이름
  description: string; // 설명
  createdAt: Date; // 생성 날짜
  updatedAt: Date | null; // 갱신 날짜
  startDateAt: Date | null; // TODO 시작 날짜
  dueDateAt: Date | null; // TODO 종료 날짜
  status: 'IN PROCESS' | 'DONE' | 'IDLE'; // 상태
}