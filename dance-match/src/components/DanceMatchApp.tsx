"use client";

import { useMemo, useState } from "react";
import { getQuestions } from "@/lib/questions";
import type { Answers, Mode, ResultProfile } from "@/lib/types";
import { saveAnonymousSubmission } from "@/lib/supabase";
import {
  calculateResult,
  cautions,
  consistency,
  effortLabels,
  goalLabels,
  groupLabels,
  lessonFormat,
  motivationLabels,
  needLabels,
  rankScores,
  schoolRecommendations,
  teacherAdvice,
  teachingLabels,
} from "@/lib/scoring";

type Screen = "home" | "quiz" | "result" | "compare" | "about";

type SavedResults = Partial<Record<Mode, ResultProfile>>;

const motiveDesc: Record<string, string> = {
  fun: "踊ること自体や音楽を楽しむ気持ち",
  mastery: "できることを増やし成長を実感したい気持ち",
  expression: "自分らしさや感情を踊りに表したい気持ち",
  belonging: "先生や仲間との関係や所属感を大切にする気持ち",
  outcome: "人前で踊ることや成果を形にすることへの関心",
  health: "身体能力や健康への良い変化を求める気持ち",
  recovery: "ダンスを気分転換やリフレッシュにも使いたい気持ち",
};

function ScoreBars<K extends string>({ scores, labels, max }: { scores: Record<K, number>; labels: Record<K, string>; max: number }) {
  return (
    <div className="score-list">
      {(Object.entries(scores) as [K, number][]).sort((a,b)=>b[1]-a[1]).map(([key, value]) => (
        <div key={key} className="score-row">
          <div className="score-head"><span>{labels[key]}</span><strong>{value.toFixed(1)} / {max}</strong></div>
          <div className="bar"><div className="fill" style={{ width: `${Math.min(100, value / max * 100)}%` }} /></div>
        </div>
      ))}
    </div>
  );
}

function CompareRows<K extends string>({ student, parent, labels }: { student: Record<K, number>; parent: Record<K, number>; labels: Record<K, string> }) {
  return <div className="score-list">{(Object.keys(labels) as K[]).map(key => (
    <div className="compare-row" key={key}>
      <strong>{labels[key]}</strong>
      <div className="compare-line"><span>本人</span><div className="bar"><div className="fill" style={{ width: `${(student[key] ?? 0) / 5 * 100}%` }} /></div><b>{(student[key] ?? 0).toFixed(1)}</b></div>
      <div className="compare-line"><span>保護者</span><div className="bar"><div className="fill alt" style={{ width: `${(parent[key] ?? 0) / 5 * 100}%` }} /></div><b>{(parent[key] ?? 0).toFixed(1)}</b></div>
    </div>
  ))}</div>;
}

export default function DanceMatchApp() {
  const [screen, setScreen] = useState<Screen>("home");
  const [mode, setMode] = useState<Mode>("student");
  const [index, setIndex] = useState(0);
  const [answers, setAnswers] = useState<Answers>({});
  const [result, setResult] = useState<ResultProfile | null>(null);
  const [saved, setSaved] = useState<SavedResults>({});
  const [message, setMessage] = useState("");
  const [consent, setConsent] = useState(false);
  const [saveState, setSaveState] = useState<"idle" | "saving" | "saved" | "error">("idle");

  const questions = useMemo(() => getQuestions(mode), [mode]);
  const q = questions[index];

  const start = (m: Mode) => {
    setMode(m); setIndex(0); setAnswers({}); setResult(null); setMessage(""); setConsent(false); setSaveState("idle"); setScreen("quiz");
  };

  const answer = (value: number | string) => {
    if (!q) return;
    if (q.field === "priority2") {
      const firstQuestion = questions.find(x => x.field === "priority1");
      if (firstQuestion && answers[firstQuestion.id] === value) {
        setMessage("1位とは別の項目を選んでください"); return;
      }
    }
    const next = { ...answers, [q.id]: value };
    setAnswers(next); setMessage("");
    if (index === questions.length - 1) {
      const computed = calculateResult(mode, questions, next);
      setResult(computed);
      setSaved(prev => ({ ...prev, [mode]: computed }));
      setScreen("result");
    } else setIndex(i => i + 1);
  };

  const modeName = mode === "student" ? "生徒用" : mode === "parent" ? "保護者用" : "小学生低学年用";

  const saveResearchData = async () => {
    if (!result || !consent || saveState === "saving" || saveState === "saved") return;
    setSaveState("saving");
    try {
      await saveAnonymousSubmission({ profile: result, questions, answers });
      setSaveState("saved");
    } catch {
      setSaveState("error");
    }
  };

  if (screen === "home") return (
    <main className="page">
      <section className="hero card">
        <div className="eyebrow">研究知見をもとに設計したダンス学習プロフィール β</div>
        <h1>Dance Match</h1>
        <p>あなたを一つの性格タイプに決める診断ではありません。なぜ踊りたいか、何を習いたいか、どんな環境なら続けやすいかを整理し、自分に合う先生やスクールを探すためのプロフィールです。</p>
      </section>
      <section className="role-grid">
        <button className="card role" onClick={() => start("student")}><strong>生徒用</strong><span>中学生〜大人<br/>5段階で詳しく診断</span></button>
        <button className="card role" onClick={() => start("parent")}><strong>保護者用</strong><span>子どもの気持ちを予想せず<br/>保護者自身の期待を回答</span></button>
        <button className="card role" onClick={() => start("child")}><strong>小学生低学年用</strong><span>やさしい言葉・3段階<br/>読み上げ回答にも対応</span></button>
      </section>
      <section className="card"><h2>この診断で分かること</h2><div className="feature-grid">
        <div><b>なぜ踊りたいか</b><span>楽しさ・上達・自己表現・つながり・成果・身体健康・リフレッシュ</span></div>
        <div><b>何を習いたいか</b><span>トレンド振付・基礎技術・フリースタイル音楽・身体コンディショニング</span></div>
        <div><b>どんな環境が合いやすいか</b><span>マンツーマン・少人数・グループ、先生・スクールの特徴</span></div>
        <div><b>親子の希望差</b><span>本人と保護者は平均せず、別々に比較</span></div>
      </div></section>
      <button className="secondary wide" onClick={() => setScreen("about")}>この診断について詳しく見る</button>
      <div className="footer-links"><a href="/privacy">プライバシーポリシー</a></div>
      {saved.student && saved.parent && <button className="primary wide" onClick={() => setScreen("compare")}>生徒と保護者の結果を比較する</button>}
    </main>
  );

  if (screen === "about") return (
    <main className="page"><section className="card"><button className="text-btn" onClick={() => setScreen("home")}>← 戻る</button><h1>この診断について</h1><p>Dance Match βは医療・心理診断ではなく、ダンスを学ぶ目的とレッスン環境の適合を整理するための実務用プロフィールです。</p></section>
      <section className="card prose"><h2>大切にしている原則</h2><p><b>安全性が最優先。</b> 質問できる、痛みを伝えられる、失敗を不必要に責められないことは全員に必要です。</p><p><b>内容の一致を重視。</b> 振付、基礎、フリースタイル、身体操作では必要なクラス内容が異なります。</p><p><b>好み＝能力タイプではありません。</b> 「見本が好き」などは現在の受けやすさであり、最適な学習法を固定するものではありません。</p><p><b>結果は変化します。</b> 経験や目標が変わればプロフィールも変わるため、3〜6か月後の再診断を想定しています。</p></section>
    </main>
  );

  if (screen === "quiz" && q) return (
    <main className="page quiz-page">
      <section className="card compact"><div className="topline"><div><span className="eyebrow">{modeName}</span><b>{q.section}</b></div><button className="secondary" onClick={() => setScreen("home")}>終了</button></div><div className="bar progress"><div className="fill" style={{ width: `${index / questions.length * 100}%` }} /></div><small>{index + 1} / {questions.length}</small></section>
      <section className="card question-card"><h2>{q.text}</h2>{q.kind === "likert" && <p className="muted">いまの気持ちに一番近いものを選んでください</p>}
        <div className="options">
          {q.kind === "likert" && (q.scale === 3 ? [[1,"ちがう"],[2,"すこしそう"],[3,"とてもそう"]] : [[1,"まったく当てはまらない"],[2,"あまり当てはまらない"],[3,"どちらともいえない"],[4,"当てはまる"],[5,"とても当てはまる"]]).map(([v,l]) => <button className="option" key={v} onClick={() => answer(v as number)}>{v}　{l}</button>)}
          {q.kind === "choice" && q.options?.map(o => <button className="option" key={o.value} onClick={() => answer(o.value)}>{o.label}</button>)}
          {q.kind === "text" && <TextAnswer onSubmit={answer} />}
        </div>{message && <p className="warning">{message}</p>}
      </section>
    </main>
  );

  if (screen === "compare" && saved.student && saved.parent) {
    const sTop = rankScores(saved.student.needs).slice(0,2).map(([k])=>k);
    const pTop = rankScores(saved.parent.needs).slice(0,2).map(([k])=>k);
    const common = sTop.filter(k=>pTop.includes(k));
    let compareText = common.length === 2 ? "本人と保護者で、重視する学習内容の上位項目がよく一致しています。" : common.length === 1 ? `共通して重視しているのは「${needLabels[common[0]]}」です。ここを共通軸にすると方針を作りやすいでしょう。` : "本人と保護者で重視する学習内容が異なっています。どちらかを正解にせず、本人が続けたい内容と保護者の期待を共有することをおすすめします。";
    if (saved.student.group !== saved.parent.group) compareText += ` 人数の希望も、本人は「${groupLabels[saved.student.group ?? "D"]}」、保護者は「${groupLabels[saved.parent.group ?? "D"]}」となっています。`;
    return <main className="page"><section className="card"><button className="text-btn" onClick={()=>setScreen("home")}>← トップへ</button><h1>生徒 × 保護者 比較</h1><p className="muted">どちらが正しいかを決めるものではありません。共通点と違いを見つけます。</p></section><section className="card"><h2>ダンスに求める価値</h2><CompareRows student={saved.student.motivations} parent={saved.parent.motivations} labels={motivationLabels}/></section><section className="card"><h2>習いたい内容</h2><CompareRows student={saved.student.needs} parent={saved.parent.needs} labels={needLabels}/></section><section className="card"><h2>比較から見えること</h2><p>{compareText}</p></section></main>;
  }

  if (!result) return null;
  const motiveRank = rankScores(result.motivations), needRank = rankScores(result.needs);
  const topM = motiveRank[0][0], secondM = motiveRank[1][0], topN = needRank[0][0], secondN = needRank[1][0];
  const format = lessonFormat(result), school = schoolRecommendations(result), consistencyInfo = consistency(result);
  const isChild = result.mode === "child", isParent = result.mode === "parent";
  const threshold = isChild ? 2.35 : 3.9;

  return <main className="page result-page">
    <section className="card result-hero"><div className="topline"><div><span className="eyebrow">{isParent ? "保護者プロフィール" : isChild ? "低学年プロフィール" : "あなたのダンスプロフィール"}</span><h1>{needLabels[topN]} <span>×</span> {needLabels[secondN]}</h1></div><button className="secondary" onClick={()=>setScreen("home")}>トップへ</button></div><div className="consistency"><b>{consistencyInfo.label}</b><span>{consistencyInfo.text}</span></div><p className="lead">{isParent ? `保護者としては「${motiveDesc[topM]}」を特に大切にし、学習内容では「${needLabels[topN]}」を強く期待しています。` : isChild ? `いまは「${needLabels[topN]}」をやってみたい気もちが大きそうです。これは今の気もちを見るための結果です。` : `現在は「${motiveDesc[topM]}」が特に強く、学びたい内容は「${needLabels[topN]}」と「${needLabels[secondN]}」が中心です。`}</p><div className="chips">{[motivationLabels[topM],motivationLabels[secondM],needLabels[topN],needLabels[secondN]].map(x=><span className="chip" key={x}>{x}</span>)}</div></section>

    <section className="card"><h2>あなたについて詳しく</h2><div className="prose"><p>{motiveDesc[topM]}がプロフィールの中心です。同時に「{motiveDesc[secondM]}」も強く、一つの動機だけでダンスをしているわけではありません。</p><p>学習内容では「{needLabels[topN]}」が第一候補で、「{needLabels[secondN]}」も高くなっています。両方を扱える先生、または複数クラスを組み合わせる方法も考えられます。</p><p>このプロフィールは固定的な性格ではなく、経験・目標・環境によって変化します。</p></div></section>

    <section className="card"><h2>ダンスに求めていること</h2><ScoreBars scores={result.motivations} labels={motivationLabels} max={result.maxScale}/></section>
    <section className="card"><h2>習いたい内容</h2><ScoreBars scores={result.needs} labels={needLabels} max={result.maxScale}/></section>

    {!isChild && <section className="card"><h2>希望する教え方</h2><ScoreBars scores={result.teaching} labels={teachingLabels} max={5}/><p className="note">これは「学習能力のタイプ」ではなく、現在本人が受けやすいと感じる環境の希望です。</p></section>}

    <section className="split"><div className="card"><h3>レッスン外での取り組み</h3><p>{effortLabels[result.effort ?? ""] ?? "回答なし"}</p></div><div className="card"><h3>現在の目標</h3><p>{goalLabels[result.goal ?? ""] ?? (isChild ? "子ども向け回答" : "回答なし")}</p></div></section>

    <section className="card emphasis"><span className="eyebrow">おすすめのレッスン人数</span><h2>第一候補：{format.best}</h2><p>{format.reason}</p><div className="minor">第二候補：{format.second}</div></section>

    <section className="card"><h2>合いやすいスクール</h2><div className="recommendations">{school.map(([title, text],i)=><div className="recommend" key={title}><b>{i===0 ? "内容面の第一候補" : "候補"}：{title}</b><span>{text}</span></div>)}</div></section>
    <section className="card"><h2>合いやすい先生</h2><p>{teacherAdvice(result)}</p>{result.motivations.mastery >= threshold && <p className="sub-advice">上達志向が高いため、「できていない」だけでなく、原因と次の練習方法まで示してくれる先生か確認するとよいでしょう。</p>}</section>

    <section className="card"><h2>相性を確認した方がよい環境</h2><div className="caution-list">{cautions(result).map(x=><div key={x}>・{x}</div>)}</div></section>
    <section className="card"><h2>体験レッスンで確認</h2><div className="check-list">{["一番習いたい内容を実際に扱っているか","先生が目的を聞いてくれるか","質問や『分からない』を言えるか","痛みや不安を伝えられるか","必要な修正を具体的に説明してくれるか","レッスン終了後にまた受けたいと思えるか"].map(x=><div key={x}>□ {x}</div>)}</div></section>

    {result.pressure > 0 && <section className="card"><h2>周囲からの影響</h2><p>{result.pressure >= (isChild ? 2.5 : 4) ? "周囲からの期待や義務感が比較的強く表れています。良い悪いと判断せず、本人自身がどうしたいかを別に確認します。" : "周囲からの影響は補助情報として扱い、マッチング得点には直接加えません。"}</p></section>}

    <section className="card">
      <h2>匿名データ提供（任意）</h2>
      <p className="muted">Dance Matchの質問や推薦ロジックを改善するため、選択式の回答と計算結果だけを匿名で保存できます。氏名・学校名・メールアドレス・最後の自由記述は保存しません。保存しなくても診断は利用できます。 <a href="/privacy">データの取扱いを見る</a></p>
      <label className="consent">
        <input
          type="checkbox"
          checked={consent}
          disabled={saveState === "saved"}
          onChange={(event) => { setConsent(event.target.checked); if (saveState === "error") setSaveState("idle"); }}
        />
        <span>{isChild ? "保護者として、匿名データを研究・サービス改善に利用することに同意します" : "匿名データを研究・サービス改善に利用することに同意します"}</span>
      </label>
      <button className="primary" disabled={!consent || saveState === "saving" || saveState === "saved"} onClick={saveResearchData}>
        {saveState === "saving" ? "保存中…" : saveState === "saved" ? "保存しました" : "匿名データを提供する"}
      </button>
      {saveState === "saved" && <p className="save-success">ご協力ありがとうございます。匿名データを保存しました。</p>}
      {saveState === "error" && <p className="save-error">保存できませんでした。診断結果には影響ありません。時間をおいてもう一度お試しください。</p>}
    </section>

    <section className="card disclaimer"><p>この結果は医療・心理診断ではありません。現在は研究知見をもとに設計したβ版であり、統計的な妥当性検証を継続して行う前提です。最終的な教室選びでは、安全性・実際の指導内容・通いやすさ・本人の体験を優先してください。</p></section>
    {saved.student && saved.parent && <button className="primary wide" onClick={()=>setScreen("compare")}>生徒と保護者の結果を比較する</button>}
  </main>;
}

function TextAnswer({ onSubmit }: { onSubmit: (value: string) => void }) {
  const [value, setValue] = useState("");
  return <><textarea className="textarea" rows={4} value={value} onChange={e=>setValue(e.target.value)} placeholder="自由に書いてください（空欄でも進めます）"/><button className="primary" onClick={()=>onSubmit(value.trim())}>結果を見る</button></>;
}
