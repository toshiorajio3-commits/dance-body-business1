# Dance Match β

ダンスを学ぶ目的・学びたい内容・レッスン環境の希望を整理し、先生・クラス・スクール選びを支援するNext.jsアプリです。

## 現在の機能
- 生徒用（中学生〜大人）
- 保護者用
- 小学生低学年用
- 7つの動機軸 / 4つの学習ニーズ
- 取り組み量と具体的目標を分離
- 教え方の希望
- マンツーマン / 少人数 / グループ候補
- スクールタイプ / 先生の特徴 / 体験時チェック
- 同一ブラウザ内で生徒・保護者結果を比較

## 開発
```bash
npm install
npm run dev
```

## 注意
研究知見をもとに設計したβ版です。医療・心理診断ではなく、現段階で統計的妥当性が確立した尺度とは表示しません。


## Supabase

公開β版は、利用者が明示的に同意した場合のみ、選択式回答と集計結果を匿名保存します。自由記述は保存しません。

必要な環境変数:

```env
NEXT_PUBLIC_SUPABASE_URL=...
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=...
```

DB定義は `supabase/migrations/001_create_anonymous_diagnosis_submissions.sql` にあります。
公開クライアントには publishable key のみを使用し、service_role / secret key は使用しません。


## Deployment

Production is deployed from the `dance-body-business` branch to Vercel with `dance-match` as the project root.
