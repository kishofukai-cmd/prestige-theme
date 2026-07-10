# Archive — airlight-lp

**airlight-lp: 2026年4月アーカイブ。後継は airlight-global。**

## Archived on
2026-04-20

## Successor
すべての Airlight 系 LP は **`airlight-global-*`** セクション（国内・海外共通）に統合移行済み。`templates/page.airlight-global-lp.json` が後継テンプレート。

## Archived files (31)

### Sections (26)
`airlight-lp-awards.liquid`, `airlight-lp-brand.liquid`, `airlight-lp-closing.liquid`, `airlight-lp-colors.liquid`, `airlight-lp-comparison.liquid`, `airlight-lp-cta.liquid`, `airlight-lp-empathy.liquid`, `airlight-lp-ethics.liquid`, `airlight-lp-faq.liquid`, `airlight-lp-features.liquid`, `airlight-lp-founders.liquid`, `airlight-lp-header.liquid`, `airlight-lp-hero.liquid`, `airlight-lp-makuake.liquid`, `airlight-lp-material.liquid`, `airlight-lp-milano.liquid`, `airlight-lp-offer.liquid`, `airlight-lp-pain.liquid`, `airlight-lp-products.liquid`, `airlight-lp-proof-bar.liquid`, `airlight-lp-review-quote.liquid`, `airlight-lp-reviews.liquid`, `airlight-lp-sizing.liquid`, `airlight-lp-sustainability.liquid`, `airlight-lp-trust-bar.liquid`, `airlight-lp-video.liquid`

### Snippets (2)
`airlight-lp-styles.liquid`, `airlight-lp-scripts.liquid`

### Templates (2)
`page.airlight-lp.json`, `page.airlight2025.json`

### Layout (1)
`theme.airlight-lp.liquid`

## 注意

- アーカイブ当初は `sections/archive/` に置いたが、Shopify CLI は `sections/` 配下のサブフォルダを強制的にセクション／テンプレートとしてパースしてしまい `shopify theme push` がエラーで失敗する。そのため **リポジトリルート直下の `archive/`** に移動した。
- `.shopifyignore` により `archive/` は Shopify にアップロードされない。
- 復活させる場合は各ファイルを元のディレクトリへ戻す必要がある (例: `archive/airlight-lp-hero.liquid` → `sections/airlight-lp-hero.liquid`)。
- 完全削除しないのは、過去の LP URL リダイレクトや文言・レイアウトの参照が必要になった場合のため。
