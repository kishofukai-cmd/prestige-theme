# CLAUDE.md — KAPOK KNOT Prestige Theme

KAPOK JAPAN (株式会社 KAPOK JAPAN) が運営する **KAPOK KNOT** の Shopify ストア用 Prestige テーマ（Shopify OS 2.0）カスタマイズリポジトリ。GemPages で作成された LP を、**ネイティブ Liquid セクションへモバイルファーストで再設計・置き換え**しているプロジェクトです（1:1 翻訳は方針転換で撤回済み — §1 参照）。

> **注記:** ユーザーが参照している `claude_migration_guide.md` はこのフォルダには存在しません。移行方針の一次情報は [`implementation_plan_gempages_migration.md`](./implementation_plan_gempages_migration.md) と [`.agents/skills/shopify-lp-customization/SKILL.md`](./.agents/skills/shopify-lp-customization/SKILL.md) を参照してください。

---

## 1. プロジェクト概要と LP 構造

Prestige テーマをベースに、ブランド体験重視の縦長 LP を複数運用しています。現状、同じ体験が **(a) GemPages 製 LP** と **(b) ネイティブ Liquid 製 LP** の 2 系統で並存しており、ネイティブ化を進めることで表示速度・SEO・保守性を改善するのが主目的です。

### 運用中の主要 LP と対応ファイル

| LP / 体験 | テンプレート (JSON) | 専用レイアウト | セクション・プレフィックス |
|---|---|---|---|
| **Musubi LP (重み毛布 国内)** | `templates/page.musubi-lp.json` | `layout/theme.musubi-lp.liquid` | `musubi-lp-*` |
| **Musubi LP (英語版・北米)** | `templates/page.recovery-weighted-blanket-musubi-en.json` | 〃 | `musubi-en-native.liquid` ほか |
| **Airlight 2025 (グローバル)** | `templates/page.airlight-global-lp.json`, `page.airlight-global-agentteam.json` | `layout/theme.airlight-global.liquid` | `airlight-global-*` |
| **Airlight 2025 (国内 LP)** | `templates/page.airlight-lp.json`, `page.airlight2025.json` | `layout/theme.airlight-lp.liquid` | `airlight-lp-*`, `airlight2025-*` |
| **2026SS コレクション** | `templates/page.2026ss.json` | theme.liquid (通常) | `2026ss-native.liquid` |
| **Farm to Fashion** | `templates/page.farm-to-fashion.json` | theme.liquid | `farm-to-fashion-lp.liquid`, `farmtofashion2025-native.liquid` |
| **Dopamine Sleep** | `templates/page.dopamine-sleep.json` | theme.liquid | 汎用 universal LP section |
| **2025 Holiday Gift / 5th Anniversary / Makuake** | `templates/page.2025holidaygift.json` ほか | theme.liquid | `*-makuake.liquid` 系 |

GemPages 由来のテンプレートは `templates/*.gem-*-template.liquid` / `.json` として残存。順次 `page.<name>.json` ＋ ネイティブセクションへ置き換えていく方針です（`implementation_plan_gempages_migration.md` 参照）。

### 🚨 GemPages 移行で判明した困難 5 点 (戦略転換の根拠)

Antigravity で変換スクリプトによる再現を試みた結果、以下 5 点により **1:1 翻訳アプローチは破綻**。`implementation_plan_gempages_migration.md` 記載の「gf_* → ag_* 翻訳方式」は **過去案** であり、現行方針ではない。

1. **独自グリッドシステム** — GemPages の `gf_col-*` クラスは数百行の CSS に依存しており、削除もそのまま残すことも不可能。
2. **膨大なインラインスタイル** — 余白・背景・フォントがすべてインラインに埋め込まれており、一括処理不能。
3. **4〜5 層の深い入れ子構造** — カルーセル等のモジュールをシンプル化すると必ず崩壊。
4. **テキスト配置・フォントの欠落** — クラス (`gf-elm-center` など) を剥がすと LP らしさ（強調・配置・リッチさ）が即座に消失。
5. **レスポンシブ分岐の複雑さ** — CSS + HTML + JS の 3 層組合せで制御されており、機械的な変換では再現不能。

→ **結論: 変換スクリプトを何度書き直しても再現に至らず、ゼロからモバイルファーストで新規設計（`ag-*` クラス体系）に方針転換済み。** GemPages の HTML は「参照資料」として扱い、機械変換のソースとはしない。

### 🎯 LP 設計のゴール優先順位 (厳守)

すべての新規 / リニューアル LP はこの順序で優先度を決める。判断に迷ったら上位を取る。

1. 🥇 **最優先: スマホ表示の完璧さ** — ピクセルパーフェクト相当。
2. 🥈 **次点: レスポンシブで PC もそこそこキレイ** — ピクセルパーフェクト不要、崩れなければ可。
3. 🥉 **付加価値: Shopify テーマエディタでの管理性** — schema / preset / blocks で非エンジニアも編集可能に。

### 🌟 デザインリファレンス — OneNova (ワンノバ)

KAPOK KNOT の新規・リニューアル LP はすべて **OneNova のミニマル・高級感・スマホファースト** な世界観を基準にする。ヘッドラインの余白、ブロック間の呼吸、色数と書体を絞ったブランド統一感は "Material Innovation" ポジションと相性が良い。迷ったら OneNova スタイルに寄せる。

### カルーセルだけは例外

構造を温存し、クラス名だけ差し替えて **Swiper.js** 等の軽量ライブラリで復旧する（CSS Snaps で自作しない — 矢印・ページネーションが崩れる）。

### 補助スクリプト群

`build_airlight_native_v*.js` / `convert_gempages_to_native.js` / `migrate_all.js` などはリポジトリ直下の **解析・参考用スクリプト**。本番変換の主役ではなく、DOM 構造や使用クラスの抽出など新規設計の補助として使う。Node.js + cheerio (`package.json` の唯一の依存)。

### カスタムレイアウトの落とし穴 (SKILL.md より)

- 独自 layout で `{% sections 'footer-group' %}` を呼ぶ場合、`<head>` に必ず `{%- render 'css-variables' -%}` / `{%- render 'js-variables' -%}` / `vendor.min.js` / `theme.js` / `theme.css` を含める。欠けるとフッターが素のスタイルで出る。
- 特定 LP だけフッター色を変えたい場合、`config/settings_data.json` ではなく LP 専用スニペット（例: `snippets/musubi-lp-styles.liquid`）に `!important` 付きで上書きする。
- CSS で画像を中央揃えしているとき、メディアクエリで `margin-left: 0; margin-right: 0;` を書くと PC で左寄せに戻る。常に `margin-left: auto; margin-right: auto;` を明示すること。

---

## 2. デプロイ方法 (`shopify theme push`)

### ストア・テーマ情報

| 項目 | 値 |
|---|---|
| **Store** | `kapok-knot.myshopify.com` |
| **LIVE (本番) Theme ID** | `156604465404` |
| **STAGING Theme ID** | `156913205500` |

### 1. Shopify CLI の準備

```bash
# Shopify CLI 3.x がインストール済みであることが前提
shopify version

# ストアへログイン（初回のみ）
shopify auth login --store kapok-knot.myshopify.com
```

### 2. テーマ一覧の確認

```bash
shopify theme list --store kapok-knot.myshopify.com
```

### 3. ステージングテーマへ push （本番は触らない）

```bash
# 開発用テーマへ（プレビュー URL が発行される）
shopify theme dev --store kapok-knot.myshopify.com

# ステージングテーマ (156913205500) を更新 — 通常運用はこれ
shopify theme push --theme 156913205500 --store kapok-knot.myshopify.com --nodelete
```

- `--nodelete` は **必ず付ける**。未追跡の Shopify 管理画面上の編集を吹き飛ばさないための保険。
- `--json` を付ければ CI 用に出力を機械可読にできる。

### 4. 本番公開はマネジメント経由

```bash
# レビュー後、Shopify 管理画面の「テーマを公開」から切り替えるのが基本
# CLI で本番 (156604465404) へ直接 push する場合のみ（原則禁止）：
shopify theme push --theme 156604465404 --store kapok-knot.myshopify.com --nodelete
```

本番テーマ (`156604465404`) への直接 `push` は禁止。必ずステージング (`156913205500`) で QA → 管理画面で公開切替。

---

## 3. ステージングルール

- **デフォルトブランチは `main`、作業は `staging` ブランチで行う**（現在 checkout 中）。ブランチ: `main`, `staging`, `fixresolveairlightlpconflicts`, `claude/kapok-knot-international-lp-*` など。
- 変更は `staging` → Shopify のステージングテーマへ push → QA 確認 → `main` へ PR → 本番公開、の順。
- **`main` への直接 push / force push は禁止。** PR 経由のみ。
- `config/settings_data.json` はストア管理画面側でも編集されうる。コミット前に `git diff` で意図しない上書きがないか確認する。
- テンプレート JSON (`templates/page.*.json`) は管理画面のセクション編集でも更新されるため、ローカル変更を push する前に最新を pull すること。競合時は管理画面の編集を優先するのが基本。
- 変換スクリプト (`build_*.js`, `analyze_*.js`, `debug_*.js`, `check_*.js` 等) やスクラッチ HTML (`temp_*.html`, `*_dump.css`, `parsed_layout.json`) は **Shopify にアップロードしない**ローカル解析用。`.shopifyignore` 相当で除外対象。誤ってセクションとして push されないよう、配置は必ずリポジトリ直下で `sections/` 等には置かない。
- コミットメッセージは英語、1 行目は命令形・簡潔に（例: `Fix flexbox image blowout bug...`）。直近の `git log` のスタイルに合わせる。

---

## 4. ブランドコンテキスト (Kapok / 受賞歴)

> **一次情報:** ブランド事実の原典は `knowledge/` 配下（Git 管理外・ローカル専用）。本セクションはそのダイジェスト。詳細は `knowledge/brand/*.md`, `knowledge/implementation/material_properties.md`, `knowledge/overview.md` を参照。

### 素材 — KAPOK ファイバー (NEO DOWN KAPOK)

- **KAPOK (カポック)** は東南アジア産の天然中空繊維。KAPOK JAPAN はこれを高機能素材として事業化している国内唯一クラスのブランドで、自らを **"Material Innovation" ブランド**と位置付けている。
- **中核スペック:**
  - **中空率 80%** — 合成繊維の上限 (〜50%) を大きく上回り、優れた保温性を生む。
  - **軽さ** — 綿の約 **1/8**。
  - **調湿・吸湿発熱** — 湿気を吸って発熱しつつ通気性を保ち、蒸れにくい。
  - **手洗い可** — 特許取得済みの **カポックシート** 技術による。
- **環境・社会インパクト (LP コピーで必ず押さえる数値):**
  - 従来のグースダウンジャケット比で **CO₂ 排出 97% 削減**。
  - 1 着あたり **30 羽のガチョウを救う** (アニマルフリー / 動物殺傷なし)。
  - **Farm to Fashion** — インドネシアの農園から最終製品までのトレーサビリティ確保。木を伐らず種子から収穫でき、カポック樹の需要復活＝伐採抑制に繋がるサーキュラーな構造。
- **主要プロダクト系統:**
  - **AIR LIGHT (エアライト)** シリーズ — 軽量コート／アウター。
  - **MUSUBI (むすび)** — Recovery Weighted Blanket (重み付き毛布)。回復・睡眠品質向上のウェルネス訴求。
  - **2026SS コレクション** — 最新シーズンライン。
  - **Farm to Fashion** — トレーサビリティ重視のサステナビリティ訴求コンセプト。
- LP コピーでは **軽さ・保温・サステナ (アニマルフリー & トレーサビリティ)** の 3 点を崩さない。

### 創業者・体制

- **創業者: 深井 喜翔 (Kishow Fukai)** — 4 代続く縫製業の後継者、旭化成 (Asahi Kasei) 出身。LP の "Founder" ブロックではこの経歴（4th-generation successor / Asahi Kasei background）を訴求。

### 受賞歴 (`knowledge/brand/authority_and_awards.md` が原典)

10 を超える国内外のアワードを受賞。LP 上部の Trust バー／Awards セクションで信頼性を担保するために用いる。

1. **METI · JETRO — 始動 Next Innovator 2019** — Silicon Valley Selection **Grand Prize**
2. **Industry Co-Creation (ICC) Summit 2021** — Grand Prix (Crafted Catapult)
3. **日本経済新聞 — Star★Startup Japan 2021** — Next-Generation Venture Award
4. **環境省 — Startup Award 2021** — Outstanding Startup
5. **J-Startup Impact 2023** — 500 社中 30 社に政府選出
6. **SME SDGs ACTION! AWARDS 2022** — Runner-up Grand Prix
7. **Kansai Business Plan Contest 2022** — Grand Prize
8. **ICC Summit 2022** — Catapult Grand Prix Runner-up
9. **Dell Startup Challenge 2025** — Runner-up
10. **Milano Unica 出展 (2023)** — 世界最高峰のテキスタイル展 (Global Presence の象徴)

LP では上記 + 「Makuake でのクラファン実績」を信頼バー／Trust セクションで必ず併用。数値や年号を変える場合は awards プリセットの `meta` / `title` を grep で一括確認すること。

> **注意:** 現在 `sections/airlight-global-awards.liquid` の preset には Good Design Award / Forbes Japan Under 30 / Circular Economy Innovation Award / Asia Innovation Awards / Tokyo Design Week 等、knowledge 原典に無い項目が含まれている。Knowledge 側が正、preset 側は要確認——LP 改修時に両者を照合し、事実確認の取れないアワードは除去する方針。

### Material Innovation Consortium (2024年4月発足)

"Material Innovation" ミッション達成のため KAPOK JAPAN が組成した R&D コンソーシアム。LP の「体制」「サプライチェーン」訴求で参照する場合がある。

| メンバー | 役割 |
|---|---|
| **梶製作所 (Kaji Seisakusho)** | テキスタイル機械製造 |
| **三晶 (Sansho)** | 化学商社 — 人工ダウンの R&D |
| **双葉商事 (Futaba Shoji)** | 縫製インフラ／システム (オーナー家のルーツ企業) |
| **ミリモルホールディングス (Millimole Holdings)** | EC / AI サポート |
| **Warm Heart Cool Head** | ブランドビジネス支援 |

サプライチェーン戦略 **"Farm to Fashion"** は、インドネシア農園からの直接調達＋種子〜最終製品までのトレーサビリティ＋カポック樹の需要復活による森林保全、の 3 点で構成される一貫したメッセージ。

---

## 5. よく触るファイルのパス一覧

### レイアウト (LP ごとの `<html>`〜`<body>` 骨格)

- `layout/theme.liquid` — 通常ストア / 一般ページの骨格。
- `layout/theme.musubi-lp.liquid` — Musubi LP 専用（sticky CTA 等を含む）。
- `layout/theme.airlight-lp.liquid` — Airlight 国内 LP 専用。
- `layout/theme.airlight-global.liquid` — Airlight グローバル LP 専用。
- `layout/theme.gempages.{header,footer,blank}.liquid` — GemPages 互換の旧レイアウト（順次廃止）。

### テンプレート (Page → Layout → Sections を紐づける JSON)

- `templates/page.musubi-lp.json`
- `templates/page.recovery-weighted-blanket-musubi-en.json`
- `templates/page.airlight-lp.json`, `templates/page.airlight2025.json`
- `templates/page.airlight-global-lp.json`, `templates/page.airlight-global-agentteam.json`
- `templates/page.2026ss.json`
- `templates/page.farm-to-fashion.json`
- `templates/page.dopamine-sleep.json`
- `templates/page.2025holidaygift.json`, `templates/page.11_8.json`

### LP 用セクション (`sections/`)

- **Musubi (23 ファイル):** `musubi-lp-hero.liquid`, `musubi-lp-empathy.liquid`, `musubi-lp-why.liquid`, `musubi-lp-science.liquid`, `musubi-lp-material.liquid`, `musubi-lp-comparison.liquid`, `musubi-lp-colors.liquid`, `musubi-lp-sizes.liquid`, `musubi-lp-care.liquid`, `musubi-lp-reviews.liquid`, `musubi-lp-ugc.liquid`, `musubi-lp-faq.liquid`, `musubi-lp-gift.liquid`, `musubi-lp-hotels.liquid`, `musubi-lp-cta.liquid`, `musubi-lp-closing.liquid`, `musubi-lp-guarantee.liquid`, `musubi-lp-cross-sell.liquid`, `musubi-lp-trust-visual.liquid`, `musubi-lp-video-loop.liquid`, `musubi-lp-story.liquid`, `musubi-lp-makuake.liquid`, `musubi-en-native.liquid`
- **Airlight 国内:** `airlight-lp-{hero,empathy,pain,features,material,milano,makuake,awards,colors,comparison,sizing,reviews,review-quote,founders,ethics,sustainability,trust-bar,proof-bar,products,offer,video,cta,faq,brand,closing,header}.liquid` および `airlight2025-{top,bottom,native}.liquid`
- **Airlight グローバル:** `airlight-global-{hero,problem,pain,features,material,brand,trust,awards,reviews,comparison,ethics,size-guide,shipping,products,campaign,faq,cta,closing}.liquid`
- **その他 LP:** `2026ss-native.liquid`, `farm-to-fashion-lp.liquid`, `farmtofashion2025-native.liquid`, `kapok-feature-cards.liquid`

### スニペット (`snippets/`)

- `snippets/musubi-lp-styles.liquid` / `musubi-lp-scripts.liquid`
- `snippets/airlight-lp-styles.liquid` / `airlight-lp-scripts.liquid`
- `snippets/airlight-global-styles.liquid` / `airlight-global-scripts.liquid` / `airlight-global-color-map.liquid`

### アセット (`assets/`)

- `assets/section-kapok-feature-cards.css`
- `assets/airlight-*.{jpg,png,gif}` — Airlight の KV / 素材 / ファクトリー画像
- `assets/theme.css`, `assets/vendor.min.js`, `assets/theme.js` — 親テーマ標準（通常は触らない）

### 設定

- `config/settings_data.json` — テーマ設定（管理画面からも書き換わるので注意）
- `config/settings_schema.json` — 設定スキーマ
- `config/markets.json` — マーケット設定

### 移行用スクリプト群 (ローカル解析専用・Shopify には push しない)

- `build_airlight_native_v3.js` — 最新の変換スクリプト
- `convert_gempages_to_native.js`, `migrate_all.js` — 一括移行用
- `analyze_*.js`, `debug_*.js`, `check_*.js`, `extract_*.js` — 解析ツール群
- `*.html` (リポジトリ直下) — Shopify から取得した実 LP のスナップショット
- `implementation_plan_gempages_migration.md` — 移行方針の原典

### 重要な参考資料

- `.agents/skills/shopify-lp-customization/SKILL.md` — LP カスタマイズの過去の躓きポイント集
- `implementation_plan_gempages_migration.md` — GemPages→ネイティブ移行の設計思想
