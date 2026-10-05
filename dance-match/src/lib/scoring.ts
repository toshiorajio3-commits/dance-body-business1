import type { Answers, Mode, MotivationKey, NeedKey, Question, ResultProfile, TeachingKey } from "./types";

export const motivationLabels: Record<MotivationKey, string> = {
  fun: "楽しさ・内発的興味", mastery: "上達・習得", expression: "自己表現・個性", belonging: "つながり・所属", outcome: "本番・可視的成果", health: "身体・健康", recovery: "気分転換・リフレッシュ",
};
export const needLabels: Record<NeedKey, string> = { trend: "トレンド・振付", basic: "基礎・技術", free: "フリースタイル・音楽", body: "身体・コンディショニング" };
export const teachingLabels: Record<TeachingKey, string> = { demo: "見本・デモ", explain: "理由の説明", choice: "自分で考える時間", explore: "探索・即興" };

export const effortLabels: Record<string, string> = { A: "レッスンの時間を中心に楽しみたい", B: "気が向いた時に少し自主練もしたい", C: "定期的に自主練にも取り組みたい", D: "目標に合わせて計画的に練習量を増やしたい" };
export const goalLabels: Record<string, string> = { A: "特に具体的な本番目標はない", B: "趣味・健康・日常の楽しみ", C: "発表会・ショーケース", D: "バトル・大会", E: "オーディション・仕事", F: "撮影・作品・SNS", G: "将来指導することも考えている" };
export const groupLabels: Record<string, string> = { A: "マンツーマン", B: "2〜4人程度の少人数", C: "グループ", D: "特にこだわらない" };

function average(values: number[]) { return values.length ? values.reduce((a, b) => a + b, 0) / values.length : 0; }

export function calculateResult(mode: Mode, questions: Question[], answers: Answers): ResultProfile {
  const motivationKeys: MotivationKey[] = ["fun", "mastery", "expression", "belonging", "outcome", "health", "recovery"];
  const needKeys: NeedKey[] = ["trend", "basic", "free", "body"];
  const teachingKeys: TeachingKey[] = ["demo", "explain", "choice", "explore"];
  const buckets = new Map<string, number[]>();
  [...motivationKeys, ...needKeys, ...teachingKeys, "pressure"].forEach(k => buckets.set(k, []));
  const fields: Record<string, string> = {};
  let freeText = "";
  questions.forEach(q => {
    const a = answers[q.id];
    if (q.kind === "likert" && q.dimension && typeof a === "number") buckets.get(q.dimension)?.push(a);
    if (q.kind === "choice" && q.field && typeof a === "string") fields[q.field] = a;
    if (q.kind === "text" && typeof a === "string") freeText = a;
  });
  const motivations = Object.fromEntries(motivationKeys.map(k => [k, average(buckets.get(k) ?? [])])) as Record<MotivationKey, number>;
  const needs = Object.fromEntries(needKeys.map(k => [k, average(buckets.get(k) ?? [])])) as Record<NeedKey, number>;
  const teaching = Object.fromEntries(teachingKeys.map(k => [k, average(buckets.get(k) ?? [])])) as Record<TeachingKey, number>;
  return { mode, maxScale: mode === "child" ? 3 : 5, motivations, needs, teaching, pressure: average(buckets.get("pressure") ?? []), effort: fields.effort, goal: fields.goal, correction: fields.correction, group: fields.group, priority1: fields.priority1, priority2: fields.priority2, freeText };
}

export function rankScores<T extends string>(scores: Record<T, number>) { return (Object.entries(scores) as [T, number][]).sort((a, b) => b[1] - a[1]); }

export function consistency(profile: ResultProfile) {
  const top = rankScores(profile.needs).slice(0, 2).map(([k]) => k);
  let hits = 0;
  if (profile.priority1 === top[0]) hits += 1;
  if (profile.priority2 && top.includes(profile.priority2 as NeedKey)) hits += 1;
  if (hits === 2) return { label: "回答の一貫性：比較的高い", text: "質問得点と最後に選んだ優先順位がよく一致しています。" };
  if (hits === 1) return { label: "回答の一貫性：中程度", text: "大きな方向性は近いですが、一部の優先順位に違いがあります。" };
  return { label: "回答の一貫性：確認推奨", text: "得点と最後の選択が異なるため、点数より本人の言葉を優先して確認します。" };
}

export function lessonFormat(profile: ResultProfile) {
  if (profile.group && profile.group !== "D") return { best: groupLabels[profile.group], second: "体験で確認", reason: `本人が「${groupLabels[profile.group]}」を希望しています。人数の好みは体験への入りやすさに直結するため、まずこの希望を第一候補にします。` };
  const threshold = profile.maxScale === 3 ? 2.35 : 3.9;
  const s = { one: 0, small: 0, group: 0 };
  if (profile.motivations.mastery >= threshold) { s.one += 1; s.small += 1; }
  if (profile.needs.basic >= threshold) s.one += 1;
  if (profile.needs.body >= threshold) s.one += 1;
  if (profile.motivations.belonging >= threshold) { s.small += 2; s.group += 2; }
  if (profile.needs.free >= threshold) s.small += 1;
  if (profile.motivations.fun >= threshold) s.group += 1;
  if (profile.needs.trend >= threshold) s.group += 1;
  if (profile.motivations.outcome >= threshold) s.group += 1;
  if (profile.correction === "C" || profile.correction === "D") s.one += 1;
  const ordered = [["マンツーマン", s.one], ["少人数", s.small], ["グループ", s.group]].sort((a, b) => Number(b[1]) - Number(a[1]));
  if (ordered[0][1] === ordered[1][1]) return { best: `${ordered[0][0]} または ${ordered[1][0]}`, second: String(ordered[2][0]), reason: "回答だけでは一方に絞り切れません。両方を体験し、個別フィードバック量と仲間から得られる刺激を比べるのがおすすめです。" };
  return { best: String(ordered[0][0]), second: String(ordered[1][0]), reason: `明確な人数希望がないため、上達志向・つながり・学びたい内容・修正の希望を合わせると「${ordered[0][0]}」が第一候補です。これは優劣ではなく、体験先を選ぶための目安です。` };
}

export function schoolRecommendations(profile: ResultProfile) {
  const topNeed = rankScores(profile.needs)[0][0];
  const format = lessonFormat(profile);
  const map: Record<NeedKey, [string, string]> = {
    trend: ["トレンド・コレオ型", "新しい楽曲・振付・作品制作を継続的に扱うスクール"],
    basic: ["基礎育成型", "FOUNDATIONやBASICを継続して積み上げるスクール"],
    free: ["カルチャー・フリースタイル型", "グルーヴ・音楽・即興・セッションを重視するスクール"],
    body: ["身体操作重視型", "身体の使い方やコンディショニングも扱うスクール"],
  };
  const out = [map[topNeed]];
  if (format.best.includes("マンツーマン")) out.push(["個別指導型", "一人ひとりの課題や目的に応じて内容を変更できる環境"]);
  if (format.best.includes("少人数")) out.push(["少人数スタジオ型", "個別フィードバックと仲間からの刺激を両立しやすい環境"]);
  if (format.best.includes("グループ")) out.push(["グループ・大型スクール型", "複数の先生やクラスから選びやすく、仲間との刺激も得やすい環境"]);
  if (["C", "D", "E", "F"].includes(profile.goal ?? "") || profile.motivations.outcome >= (profile.maxScale === 3 ? 2.35 : 3.9)) out.push(["目標対応型", "発表・バトル・大会・オーディション等の具体的目標への導線がある環境"]);
  return out.slice(0, 3);
}

export function teacherAdvice(profile: ResultProfile) {
  const topNeed = rankScores(profile.needs)[0][0];
  const base: Record<NeedKey, string> = {
    trend: "流行への感度があり、振付を分解して分かりやすく説明できる先生。",
    basic: "リズムや基本動作を体系的に教え、できない原因まで観察・説明できる先生。",
    free: "基礎を音楽・グルーヴ・即興につなげ、自分で動きを選ぶ力を育てられる先生。",
    body: "姿勢・重心・バランスなど身体操作を説明し、個人差と安全性も考慮できる先生。",
  };
  let text = base[topNeed];
  if (profile.teaching.explain >= 4) text += " 特に動きの理由を言語化できるか確認するとよいでしょう。";
  if (profile.teaching.choice >= 4 || profile.teaching.explore >= 4) text += " 一方的に教えるだけでなく、本人が考えたり試したりする時間を作れることも重要です。";
  return text;
}

export function cautions(profile: ResultProfile) {
  const topNeed = rankScores(profile.needs)[0][0];
  const out: string[] = [];
  if (topNeed === "basic") out.push("振付だけで毎回終了し、基礎を継続して扱わないクラス");
  if (topNeed === "free") out.push("振付の再現だけで、音楽や即興をほとんど扱わないクラス");
  if (topNeed === "trend") out.push("新しい楽曲や振付をほとんど扱わないクラス");
  if (topNeed === "body") out.push("痛みや身体の個人差を無視して、全員に同じ負荷を求める環境");
  if (profile.effort === "A") out.push("自主練や発表参加を当然のように求める環境");
  return out;
}
