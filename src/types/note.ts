export type Tag = "Todo" | "Personal" | "Work" | "Meeting" | "Shopping";

export interface Note {
  id: number;
  title: string;
  content: string;
  tag: Tag;
}

export interface NewNoteData {
  title: string;
  content: string;
  tag: Tag;
}
