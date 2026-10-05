import type { ChoiceOption, Mode, Question } from "./types";

const effortOptions: ChoiceOption[] = [
  { value: "A", label: "レッスンの時間を中心に楽しみたい" },
  { value: "B", label: "気が向いた時に少し自主練もしたい" },
  { value: "C", label: "定期的に自主練にも取り組みたい" },
  { value: "D", label: "目標に合わせて計画的に練習量を増やしたい" },
];

const goalOptions: ChoiceOption[] = [
  { value: "A", label: "特に具体的な本番目標はない" },
  { value: "B", label: "趣味・健康・日常の楽しみ" },
  { value: "C", label: "発表会・ショーケース" },
  { value: "D", label: "バトル・大会" },
  { value: "E", label: "オーディション・仕事" },
  { value: "F", label: "撮影・作品・SNS" },
  { value: "G", label: "将来指導することも考えている" },
];

export const priorityOptions: ChoiceOption[] = [
  { value: "trend", label: "流行の曲や振付" },
  { value: "basic", label: "ダンスの基礎や技術" },
  { value: "free", label: "音楽・グルーヴ・フリースタイル" },
  { value: "body", label: "身体操作・身体づくり" },
];

const motivationItems = [
  ["fun", "踊っている時間そのものが楽しい", "まずはダンスそのものを楽しんでほしい"],
  ["mastery", "できなかった動きができるようになるとうれしい", "少しずつできることを増やしてほしい"],
  ["expression", "自分らしい踊り方を見つけたい", "本人らしい踊り方や表現を見つけてほしい"],
  ["belonging", "先生や仲間と一緒に踊ることにも楽しさを感じる", "先生や仲間との良い関係も作ってほしい"],
  ["outcome", "発表会やステージなど人前で踊る機会に挑戦したい", "発表会やステージなど人前で踊る機会にも挑戦してほしい"],
  ["health", "ダンスを通して体力や身体の動かしやすさを高めたい", "ダンスを通して体力や身体の使い方を良くしてほしい"],
  ["recovery", "ダンスを気分転換やストレス発散にも使いたい", "ダンスが気分転換やストレス発散になると良いと思う"],
  ["fun", "好きな音楽が流れると自然に身体を動かしたくなる", "上手い下手だけでなく本人が楽しめていることを大切にしたい"],
  ["mastery", "前より上手くなっていることを実感したい", "前より何ができるようになったか分かる指導をしてほしい"],
  ["expression", "習った動きを自分なりに変えたり組み合わせたりしたい", "先生に言われたことだけでなく本人なりの表現も育ててほしい"],
  ["belonging", "ダンスを通して信頼できる先生や仲間とつながりたい", "信頼できる先生や仲間との関係を築いてほしい"],
  ["outcome", "バトル・大会・オーディションなど評価や結果が出る場にも挑戦したい", "発表・大会・評価など目標になる機会があった方が良いと思う"],
  ["health", "ダンスを続けることで健康維持にも役立てたい", "ダンスを続けることで健康的な身体を作ってほしい"],
  ["recovery", "踊ることで気持ちを切り替えたい", "ダンスが気持ちを切り替える時間にもなってほしい"],
  ["fun", "上手くできない日でも踊ること自体には楽しさを感じる", "結果が出なくても本人がダンスを好きでいてくれることを大切にしたい"],
  ["mastery", "できない原因を知り少しずつ改善していきたい", "できない原因まで理解しながら上達してほしい"],
  ["expression", "自分の感情やイメージを動きで表現したい", "本人の個性や感性を伸ばしてほしい"],
  ["belonging", "ダンスの場で自分も仲間の一員だと感じたい", "ダンスの場を本人が自分の居場所だと感じてほしい"],
  ["outcome", "撮影や作品など練習の成果が形に残るとうれしい", "撮影や作品など努力の成果が形に残る機会があるとうれしい"],
  ["health", "姿勢や身体能力など日常生活にも役立つ変化がほしい", "姿勢や身体能力など日常生活にも良い影響があるとうれしい"],
  ["recovery", "日常から離れてリフレッシュできる時間としてダンスを楽しみたい", "学校や日常生活とは違うリフレッシュできる時間になってほしい"],
] as const;

const needItems = [
  ["trend", "今流行っている曲や動きを習いたい", "今流行っている曲や振付も教えてほしい"],
  ["basic", "リズムや基本動作を最初からしっかり身につけたい", "リズムや基本動作を最初からしっかり教えてほしい"],
  ["free", "振付がなくても音楽に合わせて自分で踊れるようになりたい", "振付がなくても音楽に合わせて自分で踊れる力を身につけてほしい"],
  ["body", "姿勢や重心など身体の使い方も教えてほしい", "姿勢や重心など身体の使い方も教えてほしい"],
  ["trend", "SNSやMVで見た振付を踊れるようになりたい", "SNSやMVなどで流行している踊りも経験してほしい"],
  ["basic", "同じ基礎を繰り返し練習することにも価値を感じる", "同じ基礎を繰り返し練習する時間にも価値があると思う"],
  ["free", "音の違いを聞き分けて動きを変えられるようになりたい", "音楽を聞いて自分で動きを選べるようになってほしい"],
  ["body", "バランスや重心移動など身体そのものを使う練習もしたい", "バランスや重心移動など身体そのものを使う練習もしてほしい"],
  ["trend", "新しい曲や流行に合わせてレッスン内容も更新してほしい", "流行や新しい曲にも継続して触れられるレッスンが良い"],
  ["basic", "振付を覚えるだけでなく動きが成り立つ理由や仕組みまで理解したい", "振付だけでなく動きの土台や仕組みまで理解できる指導をしてほしい"],
  ["free", "即興やフリースタイルの練習もしたい", "即興やフリースタイルにも挑戦してほしい"],
  ["body", "無理なく効率よく動くための身体づくりも学びたい", "無理なく効率よく動くための身体づくりにも価値を感じる"],
] as const;

const teachingItems = [
  ["demo", "見本を見て真似する時間があると学びやすい", "先生が見本を分かりやすく示す時間があると良い"],
  ["explain", "なぜそう動くのか理由も説明してほしい", "なぜそう動くのか理由も説明してほしい"],
  ["choice", "自分で考えたり選んだりする時間もほしい", "本人が自分で考えたり選んだりする時間もあってほしい"],
  ["explore", "即興したり自分で試したりする時間も取り入れてほしい", "本人が即興したり試したりする時間も取り入れてほしい"],
] as const;

export function getAdultQuestions(mode: Exclude<Mode, "child">): Question[] {
  const isParent = mode === "parent";
  const qs: Question[] = [];

  motivationItems.forEach(([dimension, student, parent], i) => {
    qs.push({ id: `${mode}-${i + 1}`, section: isParent ? "A｜ダンスを通して何を得てほしい？" : "A｜なぜダンスをする？", text: isParent ? parent : student, kind: "likert", scale: 5, dimension });
  });

  needItems.forEach(([dimension, student, parent], i) => {
    qs.push({ id: `${mode}-${22 + i}`, section: isParent ? "B｜どんなことを教えてほしい？" : "B｜何を習いたい？", text: isParent ? parent : student, kind: "likert", scale: 5, dimension });
  });

  const pressure = isParent
    ? ["本人があまり気乗りしていない時でも続けてほしいと思うことがある", "本人が楽しむことより上達や成果を優先してほしいと思うことがある", "練習しなかったり休んだりするともっと頑張ってほしいと思うことがある"]
    : ["自分がやりたい気持ち以上に親や周りの期待でダンスをしている部分がある", "練習しなかったり休んだりすると誰かをがっかりさせそうで気になる", "本当はやりたくない日でもやらなければならないと感じることがある"];
  pressure.forEach((text, i) => qs.push({ id: `${mode}-${34 + i}`, section: isParent ? "C｜保護者としての期待" : "C｜周囲からの影響", text, kind: "likert", scale: 5, dimension: "pressure" }));

  qs.push({ id: `${mode}-37`, section: "D｜取り組み方", text: isParent ? "レッスン以外ではどのくらい取り組んでほしい？" : "レッスン以外ではどのくらい取り組みたい？", kind: "choice", field: "effort", options: effortOptions });
  qs.push({ id: `${mode}-38`, section: "D｜取り組み方", text: isParent ? "お子さんに期待する目標で一番近いものは？" : "今いちばん近い目標は？", kind: "choice", field: "goal", options: goalOptions });

  teachingItems.forEach(([dimension, student, parent], i) => qs.push({ id: `${mode}-${39 + i}`, section: "E｜レッスン環境の希望", text: isParent ? parent : student, kind: "likert", scale: 5, dimension }));

  qs.push({ id: `${mode}-43`, section: "E｜レッスン環境の希望", text: "先生からの修正はどのくらいほしい？", kind: "choice", field: "correction", options: [
    { value: "A", label: "大事なところだけで楽しく進めたい" },
    { value: "B", label: "必要なところを適度に直してほしい" },
    { value: "C", label: "できていない部分を詳しく教えてほしい" },
    { value: "D", label: "自分から質問しながら細かく改善したい" },
  ]});
  qs.push({ id: `${mode}-44`, section: "E｜レッスン環境の希望", text: isParent ? "希望する人数は？" : "どのくらいの人数がいい？", kind: "choice", field: "group", options: [
    { value: "A", label: "マンツーマン" },
    { value: "B", label: "2〜4人程度の少人数" },
    { value: "C", label: "グループ" },
    { value: "D", label: "特にこだわらない" },
  ]});
  qs.push({ id: `${mode}-45`, section: "F｜優先順位", text: isParent ? "最も重視する内容は？" : "今、一番習いたいものは？", kind: "choice", field: "priority1", options: priorityOptions });
  qs.push({ id: `${mode}-46`, section: "F｜優先順位", text: isParent ? "次に重視する内容は？" : "次に習いたいものは？", kind: "choice", field: "priority2", options: priorityOptions });
  qs.push({ id: `${mode}-47`, section: "F｜最後に", text: isParent ? "お子さんがダンスを通して、こうなってくれたらうれしいということがあれば教えてください" : "ダンスを通して、こうなれたらうれしいということがあれば教えてください", kind: "text" });
  return qs;
}

export function getChildQuestions(): Question[] {
  const q: Question[] = [];
  const motivations = [
    ["fun", "おんがくにあわせて おどるのがたのしい"], ["mastery", "できなかったことが できるようになるとうれしい"], ["expression", "じぶんらしい おどりかたを やってみたい"], ["belonging", "せんせいや おともだちと いっしょにおどるのがたのしい"], ["outcome", "みんなのまえで おどってみたい"], ["health", "ダンスをして からだをげんきにしたい"], ["recovery", "ダンスをすると きぶんがかわったり げんきになったりする"],
  ] as const;
  motivations.forEach(([dimension, text], i) => q.push({ id: `child-${i + 1}`, section: "① ダンスでどんなことがうれしい？", text, kind: "likert", scale: 3, dimension }));
  const needs = [
    ["trend", "いま はやっている ダンスをおどりたい"], ["basic", "リズムや ダンスのきほんを ならいたい"], ["free", "ふりつけがなくても じぶんでおどれるようになりたい"], ["body", "バランスや からだのつかいかたも ならいたい"], ["trend", "SNSやテレビでみた ダンスをおどりたい"], ["basic", "おなじきほんを なんどもれんしゅうしてもいい"], ["free", "おんがくをきいて じぶんでうごきをえらびたい"], ["body", "しせいやバランスの れんしゅうもしてみたい"],
  ] as const;
  needs.forEach(([dimension, text], i) => q.push({ id: `child-${8 + i}`, section: "② どんなことをならいたい？", text, kind: "likert", scale: 3, dimension }));
  q.push({ id: "child-16", section: "③ どのくらいやりたい？", text: "レッスンのそとでも れんしゅうしたい？", kind: "choice", field: "effort", options: [
    { value: "A", label: "レッスンだけで たのしみたい" }, { value: "B", label: "やりたいときに れんしゅうしたい" }, { value: "C", label: "おうちでも れんしゅうしたい" }, { value: "D", label: "もくひょうのために がんばりたい" },
  ]});
  q.push({ id: "child-17", section: "③ どのくらいやりたい？", text: "どんなことを めざしたい？", kind: "choice", field: "goal", options: [
    { value: "A", label: "とくにない" }, { value: "B", label: "たのしく げんきにおどりたい" }, { value: "C", label: "はっぴょうかいで おどりたい" }, { value: "D", label: "バトルや たいかいにでたい" },
  ]});
  q.push({ id: "child-18", section: "④ レッスン", text: "だれとならうのがいい？", kind: "choice", field: "group", options: [
    { value: "A", label: "せんせいと ふたり" }, { value: "B", label: "すくない にんずう" }, { value: "C", label: "みんなと いっしょ" }, { value: "D", label: "どれでもいい" },
  ]});
  q.push({ id: "child-19", section: "⑤ さいごにえらんでね", text: "いちばん やりたいものは？", kind: "choice", field: "priority1", options: priorityOptions });
  q.push({ id: "child-20", section: "⑤ さいごにえらんでね", text: "もうひとつ やりたいものは？", kind: "choice", field: "priority2", options: priorityOptions });
  q.push({ id: "child-21", section: "⑥ さいごに", text: "ダンスで できるようになりたいことがあったら おしえてね", kind: "text" });
  return q;
}

export function getQuestions(mode: Mode): Question[] {
  return mode === "child" ? getChildQuestions() : getAdultQuestions(mode);
}
