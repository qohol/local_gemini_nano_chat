# AGENTS.md

Readme は日本語で書かれており、コード内コメントも日本語が慣例。新規ドキュメント・コメントも日本語で書くこと。

## リポジトリ構造

- **UI は `index.html`、JS は `app.js`（末尾で `<script src="app.js"></script>` を読み込む）**。2 ファイルは必ず同じ場所に置く。`package.json`・ビルド・テスト・リンタは存在しない。
- CSP（`index.html` の `<meta>`）は `script-src 'self'`。**このため JS は外部ファイル必須**（インラインスクリプトは動かない）。新規 JS はすべて `app.js` に追記する。
- 検証方法は「`index.html` を Chrome で開いて動作確認する」のみ。自動テストはない。
- `_old/`・`.session/`・`opencode.json` は `.gitignore` 済みのローカル用ファイル。`_old/index_*.html` は過去バージョンの保存物で、現行アプリからは参照しない。`opencode.json` は個人設定を含むためコミットしない。
- 内部ロジックの正は `README.md` §3（「内部ロジック」）。ここに書かれた挙動と実装が乖離しないよう、仕様変更時は両方を更新する。

## 勝手に「直す」と壊れるところ（Prompt API 周り）

これらは Chrome 実装の仕様差異への対策であり、一見バグに見えるコードは意図的:

- **`lmAPI.create()` の 4 段階フォールバック**（`initialPrompts+temperature` → `systemPrompt` 順 → `monitor` のみ）。どれか1つに整理しない。
- **ストリーミングは累積チャンクと差分チャンクの両対応**：`chunk.startsWith(latest)` なら置換、そうでなければ追記。この判定を削除すると旧/新どちらかの実装で表示が壊れる。
- `promptStreaming` に `{ signal }` を渡す失敗時は引数なしで呼ぶ二段構え。
- **エラーメッセージ（`error: true` の ai メッセージ）は `initialPrompts` / 履歴署名に含めてはいけない**。含めるとセッション再構築時にプロンプトとして送られてしまう。
- **セッションキャッシュの破棄条件の追加・削除は慎重に**。破棄（→履歴から再構築）するのは: 生成停止・エラー・コンテキスト上限・再生成・履歴クリア・設定変更。停止後の部分応答はセッション状態が不定なので必ず破棄する。

## アーキテクチャ上の不変条件

- `sessionCache: Map<threadId, { session, key }>`。`key` は `historySignature(history)`（件数＋各発言の長さ＋末尾64文字）。履歴を変える変更は必ず `resetSession()` を呼ぶ。
- 排他制御は `generating` フラグ。生成中はスレッド切替・削除・全削除・設定保存をブロックすること（新規操作を追加した場合も対象に含める）。
- 表示は `renderSafeText()` で **すべて `textContent` 経由**。モデル出力・localStorage 由来など信頼できない文字列を `innerHTML` に代入禁止（静的な固定文字列と空クリアのみ可）。XSS の第一防線がこれで、CSP `script-src 'self'` が最後の防線。
- **保存は `saveState()` の 250ms デバウンス＋ `beforeunload` 即時確定。**保存頻度を上げると LevelDB 書き込みが増える。
- ストレージキー `localGeminiNanoChat.state.v1` / `.settings.v1` はデータモデル互換の目印。スキーマを壊す変更をする場合はキー名のバージョン上げか `normalizeThread()` による移行を行う。読み込み時の `normalizeThread()` 補正と「スレッド 0 件なら自動作成」は必須。
- `renamed: true` のスレッドは自動タイトル生成を上書きしてはいけない。
