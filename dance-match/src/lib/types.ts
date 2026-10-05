export type Mode = "student" | "parent" | "child";
export type MotivationKey = "fun" | "mastery" | "expression" | "belonging" | "outcome" | "health" | "recovery";
export type NeedKey = "trend" | "basic" | "free" | "body";
export type TeachingKey = "demo" | "explain" | "choice" | "explore";
export type DimensionKey = MotivationKey | NeedKey | TeachingKey | "pressure";

export type ChoiceOption = { value: string; label: string };

export type Question = {
  id: string;
  section: string;
  text: string;
  kind: "likert" | "choice" | "text";
  scale?: 3 | 5;
  dimension?: DimensionKey;
  field?: "effort" | "goal" | "correction" | "group" | "priority1" | "priority2";
  options?: ChoiceOption[];
};

export type Answers = Record<string, number | string>;

export type Scores = {
  motivations: Record<MotivationKey, number>;
  needs: Record<NeedKey, number>;
  teaching: Record<TeachingKey, number>;
  pressure: number;
};

export type ResultProfile = Scores & {
  mode: Mode;
  maxScale: 3 | 5;
  effort?: string;
  goal?: string;
  correction?: string;
  group?: string;
  priority1?: string;
  priority2?: string;
  freeText?: string;
};
