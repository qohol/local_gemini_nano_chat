<!DOCTYPE html>
<html lang="ja">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Local Gemini Nano Chat</title>
  <!-- Markdownレンダラー -->
  <script src="https://cdn.jsdelivr.net/npm/marked/marked.min.js"></script>
  <!-- 生成HTMLのサニタイズ（XSS対策） -->
  <script src="https://cdn.jsdelivr.net/npm/dompurify@3/dist/purify.min.js"></script>
  <style>
    :root {
      --bg-base: #1e222b;
      --bg-surface: #282c37;
      --bg-input: #1a1d24;
      --bg-sidebar: #171a21;
      --border-color: #3b4252;
      --text-main: #e6edf3;
      --text-muted: #9aa4b2;
      --accent: #3b82f6;
      --accent-hover: #2563eb;
      --ai-bubble: #282c37;
      --user-bubble: #2563eb;
      --btn-sub: #374151;
      --btn-sub-hover: #4b5563;
      --danger: #ef4444;
      --ok: #10b981;
    }

    * {
      box-sizing: border-box;
      margin: 0;
      padding: 0;
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", "Yu Gothic UI", "Noto Sans JP", sans-serif;
    }

    html, body {
      height: 100%;
      background-color: var(--bg-base);
      color: var(--text-main);
      overflow: hidden;
    }

    body { height: 100vh; }

    /* ===== アプリ全体レイアウト ===== */
    #app {
      display: flex;
      height: 100%;
    }

    /* ===== サイドバー（スレッド一覧） ===== */
    #sidebar {
      width: 280px;
      flex-shrink: 0;
      background: var(--bg-sidebar);
      border-right: 1px solid var(--border-color);
      display: flex;
      flex-direction: column;
      min-height: 0;
      z-index: 30;
    }

    .sidebar-brand {
      display: flex;
      align-items: center;
      gap: 8px;
      padding: 16px 16px 12px;
      font-size: 14px;
      font-weight: 700;
      letter-spacing: 0.02em;
    }

    .brand-dot {
      width: 9px;
      height: 9px;
      border-radius: 50%;
      background: linear-gradient(135deg, #60a5fa, #a78bfa);
      box-shadow: 0 0 8px rgba(96, 165, 250, 0.7);
    }

    .new-thread-btn {
      margin: 0 12px 10px;
      padding: 10px 12px;
      background: var(--accent);
      font-size: 13px;
      border-radius: 8px;
    }

    .new-thread-btn:hover:not(:disabled) { background: var(--accent-hover); }

    .thread-search { padding: 0 12px 10px; }

    .thread-search input {
      width: 100%;
      background: var(--bg-input);
      border: 1px solid var(--border-color);
      color: var(--text-main);
      padding: 7px 10px;
      border-radius: 6px;
      font-size: 12px;
      outline: none;
    }

    .thread-search input:focus { border-color: var(--accent); }

    .thread-list {
      flex: 1;
      overflow-y: auto;
      padding: 0 8px 8px;
      display: flex;
      flex-direction: column;
      gap: 2px;
      min-height: 0;
    }

    .thread-item {
      display: flex;
      align-items: center;
      gap: 6px;
      padding: 8px 10px;
      border-radius: 7px;
      cursor: pointer;
      border: 1px solid transparent;
      transition: background 0.15s;
    }

    .thread-item:hover { background: rgba(255, 255, 255, 0.05); }

    .thread-item.active {
      background: rgba(59, 130, 246, 0.16);
      border-color: rgba(59, 130, 246, 0.45);
    }

    .thread-item-main {
      flex: 1;
      min-width: 0;
    }

    .thread-item-title {
      font-size: 12.5px;
      font-weight: 600;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }

    .thread-item-preview {
      font-size: 11px;
      color: var(--text-muted);
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
      margin-top: 2px;
    }

    .thread-del {
      background: transparent;
      border: none;
      color: var(--text-muted);
      font-size: 15px;
      line-height: 1;
      padding: 3px 5px;
      border-radius: 4px;
      cursor: pointer;
      opacity: 0;
      transition: opacity 0.15s, background 0.15s;
    }

    .thread-item:hover .thread-del { opacity: 1; }
    .thread-del:hover { background: rgba(239, 68, 68, 0.2); color: #fca5a5; }

    .sidebar-foot {
      border-top: 1px solid var(--border-color);
      padding: 10px 12px;
    }

    .sidebar-foot button {
      width: 100%;
      padding: 8px;
      font-size: 12px;
      font-weight: 500;
    }

    .thread-empty {
      color: var(--text-muted);
      font-size: 11.5px;
      padding: 12px 8px;
      text-align: center;
    }

    #sidebarOverlay {
      display: none;
      position: fixed;
      inset: 0;
      background: rgba(0, 0, 0, 0.55);
      z-index: 20;
    }

    #sidebarOverlay.show { display: block; }

    /* ===== メインカラム ===== */
    #main {
      flex: 1;
      display: flex;
      flex-direction: column;
      padding: 14px 16px 16px;
      min-width: 0;
      min-height: 0;
    }

    .chat-header {
      display: flex;
      align-items: center;
      gap: 10px;
      padding: 0 2px 10px;
      max-width: 880px;
      width: 100%;
      margin: 0 auto;
      flex-shrink: 0;
    }

    .title-wrap { flex: 1; min-width: 0; }

    .title-wrap h1 {
      font-size: 15px;
      font-weight: 700;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }

    .thread-meta {
      font-size: 11px;
      color: var(--text-muted);
      margin-top: 2px;
    }

    .header-actions { display: flex; gap: 6px; }

    .icon-btn {
      background: var(--btn-sub);
      border: 1px solid var(--border-color);
      color: var(--text-main);
      width: 32px;
      height: 32px;
      padding: 0;
      border-radius: 7px;
      font-size: 14px;
      line-height: 1;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      flex-shrink: 0;
    }

    .icon-btn:hover:not(:disabled) { background: var(--btn-sub-hover); }

    #menuBtn { display: none; }

    /* ===== チャット履歴表示エリア ===== */
    #chat-box {
      flex: 1;
      overflow-y: auto;
      display: flex;
      flex-direction: column;
      gap: 16px;
      padding: 14px;
      margin: 0 auto 12px;
      max-width: 880px;
      width: 100%;
      background: rgba(0, 0, 0, 0.15);
      border-radius: 8px;
      border: 1px solid var(--border-color);
      min-height: 0;
      scrollbar-width: thin;
      scrollbar-color: var(--border-color) transparent;
    }

    #chat-box::-webkit-scrollbar { width: 9px; }
    #chat-box::-webkit-scrollbar-thumb {
      background: var(--border-color);
      border-radius: 9px;
    }

    /* 空状態（スレッド新規作成時） */
    .empty-state {
      margin: auto;
      text-align: center;
      color: var(--text-muted);
      padding: 20px;
      max-width: 460px;
    }

    .empty-icon {
      font-size: 34px;
      color: var(--accent);
      margin-bottom: 8px;
    }

    .empty-state h2 {
      font-size: 17px;
      color: var(--text-main);
      margin-bottom: 6px;
    }

    .empty-state p { font-size: 12.5px; line-height: 1.7; }

    .suggestions {
      display: flex;
      flex-wrap: wrap;
      gap: 8px;
      justify-content: center;
      margin-top: 16px;
    }

    .suggestion {
      background: var(--bg-surface);
      border: 1px solid var(--border-color);
      color: var(--text-main);
      font-size: 12px;
      font-weight: 500;
      padding: 8px 12px;
      border-radius: 16px;
    }

    .suggestion:hover:not(:disabled) { background: var(--btn-sub-hover); }

    /* メッセージ行 */
    .msg-row {
      display: flex;
      width: 100%;
      flex-shrink: 0;
    }

    .msg-row.user { justify-content: flex-end; }
    .msg-row.ai { justify-content: flex-start; }

    /* メッセージ吹き出し */
    .msg-bubble {
      max-width: 85%;
      width: fit-content;
      padding: 12px 16px;
      border-radius: 10px;
      font-size: 14px;
      line-height: 1.6;
      word-break: break-word;
      overflow-wrap: break-word;
      box-shadow: 0 2px 6px rgba(0, 0, 0, 0.2);
      display: flex;
      flex-direction: column;
      gap: 8px;
      min-width: 0;
    }

    .user .msg-bubble {
      background: var(--user-bubble);
      color: #ffffff;
      border-bottom-right-radius: 2px;
    }

    .ai .msg-bubble {
      background: var(--ai-bubble);
      color: var(--text-main);
      border: 1px solid var(--border-color);
      border-bottom-left-radius: 2px;
    }

    /* 吹き出し内コピーボタンバー */
    .bubble-actions {
      display: flex;
      justify-content: flex-end;
      gap: 4px;
      border-top: 1px solid rgba(255, 255, 255, 0.1);
      padding-top: 6px;
      margin-top: 2px;
    }

    .bubble-copy-btn {
      background: transparent;
      border: none;
      color: var(--text-muted);
      font-size: 11px;
      cursor: pointer;
      display: inline-flex;
      align-items: center;
      gap: 4px;
      padding: 2px 6px;
      border-radius: 4px;
      transition: all 0.2s;
    }

    .user .bubble-copy-btn { color: rgba(255, 255, 255, 0.8); }

    .bubble-copy-btn:hover {
      background: rgba(255, 255, 255, 0.15);
      color: #fff;
    }

    .bubble-copy-btn.copied { color: var(--ok); }

    /* Markdownスタイル */
    .msg-content { min-width: 0; }
    .msg-content p { margin-bottom: 8px; }
    .msg-content p:last-child { margin-bottom: 0; }
    .msg-content ul, .msg-content ol { margin-left: 20px; margin-bottom: 8px; }
    .msg-content li { margin-bottom: 4px; }
    .msg-content strong { color: #93c5fd; font-weight: 600; }
    .msg-content a { color: #93c5fd; }
    .msg-content blockquote {
      border-left: 3px solid var(--border-color);
      padding-left: 10px;
      color: var(--text-muted);
      margin: 8px 0;
    }
    .msg-content table {
      border-collapse: collapse;
      margin: 8px 0;
      font-size: 12.5px;
      display: block;
      overflow-x: auto;
    }
    .msg-content th, .msg-content td {
      border: 1px solid var(--border-color);
      padding: 5px 9px;
    }
    .msg-content th { background: rgba(255, 255, 255, 0.05); }
    .msg-content code {
      background: rgba(0, 0, 0, 0.35);
      padding: 2px 6px;
      border-radius: 4px;
      font-family: "Consolas", "Cascadia Mono", monospace;
      font-size: 0.9em;
    }
    .msg-content pre {
      background: rgba(0, 0, 0, 0.45);
      padding: 10px;
      border-radius: 6px;
      overflow-x: auto;
      margin: 8px 0;
    }
    .msg-content pre code { background: none; padding: 0; }

    /* ===== コードブロック（言語ラベル + コピーボタン） ===== */
    .code-block {
      margin: 10px 0;
      border: 1px solid #333a48;
      border-radius: 8px;
      overflow: hidden;
      background: #11141a;
    }

    .code-header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 10px;
      padding: 5px 10px;
      background: #1b1f27;
      border-bottom: 1px solid #2b313d;
      font-size: 11px;
      color: var(--text-muted);
      user-select: none;
    }

    .code-lang {
      text-transform: uppercase;
      letter-spacing: 0.06em;
      font-family: "Consolas", monospace;
    }

    .code-copy-btn {
      background: transparent;
      border: 1px solid #3b4252;
      color: #cfd8e3;
      font-size: 11px;
      font-weight: 500;
      padding: 2px 9px;
      border-radius: 4px;
      cursor: pointer;
      transition: all 0.15s;
    }

    .code-copy-btn:hover { background: rgba(255, 255, 255, 0.1); }
    .code-copy-btn.copied { color: var(--ok); border-color: var(--ok); }

    .code-block pre {
      margin: 0 !important;
      padding: 12px !important;
      background: transparent !important;
      border-radius: 0 !important;
      overflow-x: auto;
    }

    /* ===== 下部入力コントロール ===== */
    .controls {
      display: flex;
      flex-direction: column;
      gap: 8px;
      flex-shrink: 0;
      max-width: 880px;
      width: 100%;
      margin: 0 auto;
    }

    .input-row {
      display: flex;
      gap: 8px;
      align-items: flex-end;
    }

    textarea {
      flex: 1;
      background: var(--bg-input);
      border: 1px solid var(--border-color);
      color: var(--text-main);
      padding: 11px 14px;
      border-radius: 6px;
      font-size: 14px;
      line-height: 1.5;
      outline: none;
      resize: none;
      transition: border-color 0.2s;
      min-height: 44px;
      max-height: 168px;
      overflow-y: auto;
    }

    textarea:focus { border-color: var(--accent); }
    textarea:disabled { opacity: 0.6; }

    button {
      padding: 0 16px;
      background: var(--accent);
      border: none;
      color: #fff;
      font-weight: 600;
      border-radius: 6px;
      cursor: pointer;
      transition: background 0.2s;
      white-space: nowrap;
    }

    button:hover:not(:disabled) { background: var(--accent-hover); }

    /* 入力行のボタンはテキストエリア下端に揃える */
    .input-row button { height: 44px; }

    .btn-secondary {
      background: var(--btn-sub);
      border: 1px solid var(--border-color);
      color: var(--text-main);
    }

    .btn-secondary:hover:not(:disabled) { background: var(--btn-sub-hover); }

    button:disabled {
      opacity: 0.5;
      cursor: not-allowed;
    }

    #sendBtn.btn-stop { background: var(--danger); }
    #sendBtn.btn-stop:hover:not(:disabled) { background: #dc2626; }

    #downloadBtn {
      background: var(--ok);
      padding: 12px;
      font-size: 14px;
      width: 100%;
      display: none;
      height: auto;
    }
    #downloadBtn:hover:not(:disabled) { background: #059669; }

    .status-bar {
      display: flex;
      justify-content: space-between;
      gap: 12px;
      font-size: 11.5px;
      color: var(--text-muted);
      padding: 2px;
      min-height: 16px;
    }

    #status { overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
    #usage { flex-shrink: 0; font-variant-numeric: tabular-nums; }

    /* ===== 設定ダイアログ ===== */
    dialog {
      background: var(--bg-surface);
      color: var(--text-main);
      border: 1px solid var(--border-color);
      border-radius: 12px;
      padding: 0;
      width: min(520px, calc(100vw - 32px));
      box-shadow: 0 20px 60px rgba(0, 0, 0, 0.5);
    }

    dialog::backdrop { background: rgba(0, 0, 0, 0.6); }

    .dialog-head {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 14px 18px;
      border-bottom: 1px solid var(--border-color);
    }

    .dialog-head h2 { font-size: 14px; }

    .dialog-body {
      padding: 16px 18px;
      display: flex;
      flex-direction: column;
      gap: 16px;
      max-height: 65vh;
      overflow-y: auto;
    }

    .field { display: flex; flex-direction: column; gap: 6px; }

    .field label { font-size: 12px; font-weight: 600; color: var(--text-main); }

    .field .hint { font-size: 11px; color: var(--text-muted); }

    .field textarea {
      min-height: 90px;
      max-height: 220px;
      font-size: 12.5px;
    }

    .field input[type="range"] { width: 100%; accent-color: var(--accent); }

    .dialog-foot {
      display: flex;
      justify-content: space-between;
      gap: 8px;
      padding: 12px 18px;
      border-top: 1px solid var(--border-color);
      flex-wrap: wrap;
    }

    .dialog-foot .spacer { flex: 1; }

    .dialog-foot button { height: 36px; font-size: 12.5px; padding: 0 14px; }

    .danger-btn {
      background: transparent;
      border: 1px solid rgba(239, 68, 68, 0.6);
      color: #fca5a5;
      font-weight: 500;
    }

    .danger-btn:hover:not(:disabled) { background: rgba(239, 68, 68, 0.15); }

    /* ===== レスポンシブ ===== */
    @media (max-width: 860px) {
      #sidebar {
        position: fixed;
        top: 0;
        bottom: 0;
        left: 0;
        transform: translateX(-100%);
        transition: transform 0.22s ease;
        box-shadow: 12px 0 30px rgba(0, 0, 0, 0.5);
      }
      #sidebar.open { transform: translateX(0); }
      #menuBtn { display: inline-flex; }
      #main { padding: 10px 10px 12px; }
      .msg-bubble { max-width: 92%; }
    }
  </style>
</head>
<body>

  <div id="app">
    <!-- スレッド一覧 -->
    <aside id="sidebar">
      <div class="sidebar-brand">
        <span class="brand-dot"></span>
        <span>Gemini Nano Chat</span>
      </div>
      <button id="newThreadBtn" class="new-thread-btn">＋ 新しいスレッド</button>
      <div class="thread-search">
        <input type="text" id="threadSearch" placeholder="🔍 スレッドを検索" />
      </div>
      <div id="threadList" class="thread-list"></div>
      <div class="sidebar-foot">
        <button id="settingsBtn" class="btn-secondary">⚙ 設定</button>
      </div>
    </aside>
    <div id="sidebarOverlay"></div>

    <!-- チャット本体 -->
    <main id="main">
      <header class="chat-header">
        <button id="menuBtn" class="icon-btn" title="スレッド一覧を開く">☰</button>
        <div class="title-wrap">
          <h1 id="threadTitle">…</h1>
          <div id="threadMeta" class="thread-meta"></div>
        </div>
        <div class="header-actions">
          <button id="exportBtn" class="icon-btn" title="Markdown形式でエクスポート">⤓</button>
          <button id="renameBtn" class="icon-btn" title="スレッド名を変更">✎</button>
          <button id="clearBtn" class="icon-btn" title="このスレッドの履歴を削除">🗑</button>
        </div>
      </header>

      <!-- 会話ログエリア -->
      <div id="chat-box"></div>

      <!-- 入力・操作エリア -->
      <div class="controls">
        <button id="downloadBtn">Gemini Nano モデルのダウンロード・準備を開始する</button>

        <div class="input-row">
          <textarea id="userInput" rows="1"
            placeholder="メッセージを入力... (Enterで送信 / Shift+Enterで改行)" disabled></textarea>
          <button id="copyInputBtn" class="btn-secondary" title="現在入力されているテキストをコピー">コピー</button>
          <button id="sendBtn" disabled>送信</button>
        </div>

        <div class="status-bar">
          <span id="status">初期化中...</span>
          <span id="usage"></span>
        </div>
      </div>
    </main>
  </div>

  <!-- 設定ダイアログ -->
  <dialog id="settingsDialog">
    <div class="dialog-head">
      <h2>設定</h2>
      <button id="closeSettingsBtn" class="icon-btn" title="閉じる">×</button>
    </div>
    <div class="dialog-body">
      <div class="field">
        <label for="systemPromptInput">システムプロンプト</label>
        <textarea id="systemPromptInput" spellcheck="false"></textarea>
        <span class="hint">新しい応答（次のセッション生成）から反映されます。</span>
      </div>
      <div class="field">
        <label for="temperatureInput">温度（創造性）: <span id="temperatureValue">0.8</span></label>
        <input type="range" id="temperatureInput" min="0" max="1" step="0.05" />
        <span class="hint">低いほど安定、高いほど多様な回答になります。</span>
      </div>
    </div>
    <div class="dialog-foot">
      <button id="exportAllBtn" class="btn-secondary">全履歴をJSON保存</button>
      <button id="deleteAllBtn" class="danger-btn">全スレッド削除</button>
      <span class="spacer"></span>
      <button id="saveSettingsBtn">保存して閉じる</button>
    </div>
  </dialog>

  <script>
    /* =========================================================
       要素参照
    ========================================================= */
    const els = {
      sidebar: document.getElementById("sidebar"),
      sidebarOverlay: document.getElementById("sidebarOverlay"),
      menuBtn: document.getElementById("menuBtn"),
      newThreadBtn: document.getElementById("newThreadBtn"),
      threadSearch: document.getElementById("threadSearch"),
      threadList: document.getElementById("threadList"),
      settingsBtn: document.getElementById("settingsBtn"),
      threadTitle: document.getElementById("threadTitle"),
      threadMeta: document.getElementById("threadMeta"),
      exportBtn: document.getElementById("exportBtn"),
      renameBtn: document.getElementById("renameBtn"),
      clearBtn: document.getElementById("clearBtn"),
      chatBox: document.getElementById("chat-box"),
      userInput: document.getElementById("userInput"),
      sendBtn: document.getElementById("sendBtn"),
      copyInputBtn: document.getElementById("copyInputBtn"),
      downloadBtn: document.getElementById("downloadBtn"),
      status: document.getElementById("status"),
      usage: document.getElementById("usage"),
      settingsDialog: document.getElementById("settingsDialog"),
      systemPromptInput: document.getElementById("systemPromptInput"),
      temperatureInput: document.getElementById("temperatureInput"),
      temperatureValue: document.getElementById("temperatureValue"),
      saveSettingsBtn: document.getElementById("saveSettingsBtn"),
      closeSettingsBtn: document.getElementById("closeSettingsBtn"),
      exportAllBtn: document.getElementById("exportAllBtn"),
      deleteAllBtn: document.getElementById("deleteAllBtn")
    };

    /* =========================================================
       定数・状態
    ========================================================= */
    const STORE_KEY = "localGeminiNanoChat.state.v1";
    const SETTINGS_KEY = "localGeminiNanoChat.settings.v1";
    const HISTORY_LIMIT = 12; // セッション再構築時に引き継ぐ最大メッセージ数

    const DEFAULT_SYSTEM_PROMPT =
      "あなたは親切なAIアシスタントです。Markdown形式（箇条書きや太字、コードブロックなど）を適切に使い、" +
      "自然な日本語で簡潔に回答してください。";

    const state = {
      threads: [],
      activeId: null
    };

    let settings = {
      systemPrompt: DEFAULT_SYSTEM_PROMPT,
      temperature: 0.8
    };

    let lmAPI = null;          // LanguageModel API
    let modelReady = false;    // モデルが利用可能か
    let generating = false;    // 応答生成中か
    let abortCtrl = null;      // 生成停止用
    let saveTimer = null;      // localStorage保存のデバウンス用

    // threadId -> { session, key }
    const sessionCache = new Map();

    /* =========================================================
       汎用ユーティリティ
    ========================================================= */
    function uid() {
      return "t" + Date.now().toString(36) + Math.random().toString(36).slice(2, 7);
    }

    function escapeHtml(text) {
      return String(text)
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#39;");
    }

    function formatDateTime(ts) {
      if (!ts) return "";
      return new Date(ts).toLocaleString("ja-JP", {
        month: "2-digit", day: "2-digit", hour: "2-digit", minute: "2-digit"
      });
    }

    // タイトル自動生成（改行・連続空白を除去して切り詰め）
    function makeTitle(text) {
      const t = text.replace(/\s+/g, " ").trim();
      return t.length > 34 ? t.slice(0, 34) + "…" : (t || "新しいスレッド");
    }

    function sanitizeFileName(name) {
      return (name || "thread").replace(/[\\/:*?"<>|]/g, "_").slice(0, 60);
    }

    function setStatus(msg, isError = false) {
      els.status.textContent = msg;
      els.status.style.color = isError ? "#ef4444" : "#9aa4b2";
    }

    function updateUsage(session) {
      try {
        const used = session?.inputUsage ?? session?.tokensSoFar;
        const quota = session?.inputQuota ?? session?.maxTokens;
        if (typeof used === "number" && typeof quota === "number" && quota > 0) {
          els.usage.textContent = `コンテキスト: ${used.toLocaleString()} / ${quota.toLocaleString()}`;
        } else {
          els.usage.textContent = "";
        }
      } catch {
        els.usage.textContent = "";
      }
    }

    // クリップボードコピー（失敗時は execCommand にフォールバック）
    async function copyText(text) {
      if (!text) return false;
      try {
        if (navigator.clipboard && window.isSecureContext) {
          await navigator.clipboard.writeText(text);
          return true;
        }
      } catch { /* フォールバックへ */ }

      try {
        const ta = document.createElement("textarea");
        ta.value = text;
        ta.style.position = "fixed";
        ta.style.opacity = "0";
        document.body.appendChild(ta);
        ta.select();
        const ok = document.execCommand("copy");
        ta.remove();
        return ok;
      } catch {
        return false;
      }
    }

    // ボタンのラベルを一時的に「コピー済」に変更する
    async function copyToClipboard(text, btnElement = null, label = "📋 コピー") {
      if (!text) return;
      const ok = await copyText(text);
      if (ok) {
        if (btnElement) {
          if (!btnElement.dataset.defaultLabel) {
            btnElement.dataset.defaultLabel = btnElement.textContent;
          }
          btnElement.textContent = "✓ コピー済";
          btnElement.classList.add("copied");
          setTimeout(() => {
            btnElement.textContent = btnElement.dataset.defaultLabel || label;
            btnElement.classList.remove("copied");
          }, 1500);
        }
        setStatus("クリップボードにコピーしました");
      } else {
        setStatus("コピーに失敗しました", true);
      }
    }

    function downloadFile(filename, content, mime = "text/plain") {
      const blob = new Blob([content], { type: `${mime};charset=utf-8` });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      a.remove();
      setTimeout(() => URL.revokeObjectURL(url), 1000);
    }

    /* =========================================================
       永続化（localStorage）
    ========================================================= */
    function normalizeThread(t) {
      return {
        id: t.id || uid(),
        title: t.title || "新しいスレッド",
        messages: Array.isArray(t.messages)
          ? t.messages
              .filter((m) => m && (m.role === "user" || m.role === "ai") && typeof m.content === "string")
              .map((m) => ({ role: m.role, content: m.content, ts: m.ts || Date.now(), error: !!m.error }))
          : [],
        createdAt: t.createdAt || Date.now(),
        updatedAt: t.updatedAt || t.createdAt || Date.now(),
        renamed: !!t.renamed
      };
    }

    function loadState() {
      try {
        const raw = localStorage.getItem(STORE_KEY);
        if (raw) {
          const parsed = JSON.parse(raw);
          if (Array.isArray(parsed.threads)) {
            state.threads = parsed.threads.filter((t) => t && t.id).map(normalizeThread);
            state.activeId = parsed.activeId || null;
          }
        }
      } catch (err) {
        console.warn("保存データの読み込みに失敗しました:", err);
      }

      if (!state.threads.length) {
        const now = Date.now();
        state.threads.push({
          id: uid(),
          title: "新しいスレッド",
          messages: [],
          createdAt: now,
          updatedAt: now,
          renamed: false
        });
      }

      if (!state.threads.some((t) => t.id === state.activeId)) {
        state.activeId = state.threads[0].id;
      }
    }

    function persistState() {
      try {
        localStorage.setItem(STORE_KEY, JSON.stringify({
          threads: state.threads,
          activeId: state.activeId
        }));
      } catch (err) {
        setStatus("履歴の保存に失敗しました（容量超過の可能性）", true);
      }
    }

    function saveState() {
      clearTimeout(saveTimer);
      saveTimer = setTimeout(persistState, 250);
    }

    function loadSettings() {
      try {
        const raw = localStorage.getItem(SETTINGS_KEY);
        if (raw) {
          const parsed = JSON.parse(raw);
          if (typeof parsed.systemPrompt === "string" && parsed.systemPrompt.trim()) {
            settings.systemPrompt = parsed.systemPrompt;
          }
          if (typeof parsed.temperature === "number") {
            settings.temperature = Math.min(1, Math.max(0, parsed.temperature));
          }
        }
      } catch (err) {
        console.warn("設定の読み込みに失敗しました:", err);
      }
    }

    function saveSettings() {
      try {
        localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
      } catch { /* 無視 */ }
    }

    /* =========================================================
       スレッド操作
    ========================================================= */
    function activeThread() {
      return state.threads.find((t) => t.id === state.activeId) || null;
    }

    function createThread(activate = true) {
      const now = Date.now();
      const thread = {
        id: uid(),
        title: "新しいスレッド",
        messages: [],
        createdAt: now,
        updatedAt: now,
        renamed: false
      };
      state.threads.unshift(thread);
      if (activate) state.activeId = thread.id;
      saveState();
      renderAll();
      if (activate) {
        els.userInput.value = "";
        autoResizeInput();
        setTimeout(() => els.userInput.focus(), 0);
      }
      return thread;
    }

    function switchThread(id) {
      if (generating) {
        setStatus("生成中はスレッドを切り替えられません（停止してから再度お試しください）", true);
        return;
      }
      if (!state.threads.some((t) => t.id === id)) return;
      state.activeId = id;
      saveState();
      renderAll();
      closeSidebar();
      updateUsage(sessionCache.get(id)?.session);
      setTimeout(() => els.userInput.focus(), 0);
    }

    function renameThread(thread) {
      if (!thread) return;
      const next = prompt("スレッド名を入力してください", thread.title);
      if (next === null) return;
      const title = next.trim();
      if (!title) return;
      thread.title = title;
      thread.renamed = true;
      thread.updatedAt = Date.now();
      saveState();
      renderAll();
    }

    function deleteThread(id) {
      if (generating) {
        setStatus("生成中はスレッドを削除できません", true);
        return;
      }
      const thread = state.threads.find((t) => t.id === id);
      if (!thread) return;
      if (thread.messages.length && !confirm(`「${thread.title}」を削除しますか？\nこの操作は取り消せません。`)) {
        return;
      }

      // セッションの破棄
      const cached = sessionCache.get(id);
      if (cached) {
        try { cached.session.destroy?.(); } catch { /* 無視 */ }
        sessionCache.delete(id);
      }

      state.threads = state.threads.filter((t) => t.id !== id);

      if (!state.threads.length) {
        createThread(true);
        return;
      }
      if (state.activeId === id) {
        state.activeId = state.threads[0].id;
      }
      saveState();
      renderAll();
    }

    function clearThread() {
      const thread = activeThread();
      if (!thread || generating) return;
      if (!thread.messages.length) return;
      if (!confirm("このスレッドの会話履歴をすべて削除しますか？")) return;

      thread.messages = [];
      thread.updatedAt = Date.now();
      resetSession(thread.id);
      els.usage.textContent = "";
      saveState();
      renderAll();
      setStatus("このスレッドの履歴を削除しました");
    }

    /* =========================================================
       レンダリング
    ========================================================= */
    function renderAll() {
      renderThreadList();
      renderHeader();
      renderMessages();
      updateComposerState();
    }

    function renderThreadList() {
      const query = els.threadSearch.value.trim().toLowerCase();
      const sorted = [...state.threads].sort((a, b) => b.updatedAt - a.updatedAt);
      const filtered = query
        ? sorted.filter((t) =>
            t.title.toLowerCase().includes(query) ||
            t.messages.some((m) => m.content.toLowerCase().includes(query)))
        : sorted;

      els.threadList.innerHTML = "";

      if (!filtered.length) {
        const empty = document.createElement("div");
        empty.className = "thread-empty";
        empty.textContent = query ? "一致するスレッドがありません" : "スレッドがありません";
        els.threadList.appendChild(empty);
        return;
      }

      filtered.forEach((thread) => {
        const item = document.createElement("div");
        item.className = "thread-item" + (thread.id === state.activeId ? " active" : "");
        item.dataset.id = thread.id;

        const main = document.createElement("div");
        main.className = "thread-item-main";

        const title = document.createElement("div");
        title.className = "thread-item-title";
        title.textContent = thread.title;

        const preview = document.createElement("div");
        preview.className = "thread-item-preview";
        const last = thread.messages[thread.messages.length - 1];
        preview.textContent = last
          ? (last.role === "user" ? "あなた: " : "AI: ") + last.content.replace(/\s+/g, " ").slice(0, 44)
          : "まだメッセージがありません";

        main.appendChild(title);
        main.appendChild(preview);

        const delBtn = document.createElement("button");
        delBtn.className = "thread-del";
        delBtn.textContent = "×";
        delBtn.title = "このスレッドを削除";
        delBtn.addEventListener("click", (e) => {
          e.stopPropagation();
          deleteThread(thread.id);
        });

        item.appendChild(main);
        item.appendChild(delBtn);

        item.addEventListener("click", () => switchThread(thread.id));
        item.addEventListener("dblclick", (e) => {
          e.preventDefault();
          renameThread(thread);
        });

        els.threadList.appendChild(item);
      });
    }

    function renderHeader() {
      const thread = activeThread();
      if (!thread) {
        els.threadTitle.textContent = "スレッドがありません";
        els.threadMeta.textContent = "";
        return;
      }
      els.threadTitle.textContent = thread.title;
      const count = thread.messages.filter((m) => m.role === "user").length;
      els.threadMeta.textContent =
        `${count} 件のメッセージ ・ 更新 ${formatDateTime(thread.updatedAt)}`;
      els.threadTitle.title = thread.title;
    }

    function findLastAiIndex(messages) {
      for (let i = messages.length - 1; i >= 0; i--) {
        if (messages[i].role === "ai") return i;
      }
      return -1;
    }

    function renderMessages() {
      els.chatBox.innerHTML = "";
      const thread = activeThread();

      if (!thread || !thread.messages.length) {
        renderEmptyState();
        return;
      }

      const lastAi = findLastAiIndex(thread.messages);
      thread.messages.forEach((message, index) => {
        els.chatBox.appendChild(buildMessageRow(message, index === lastAi));
      });
      scrollToBottom(true);
    }

    function renderEmptyState() {
      const wrap = document.createElement("div");
      wrap.className = "empty-state";
      wrap.innerHTML = `
        <div class="empty-icon">✦</div>
        <h2>Gemini Nano とチャット</h2>
        <p>すべての処理はこの端末内で完結します。<br>会話はスレッドごとに自動保存されます。</p>
        <div class="suggestions"></div>
      `;

      const suggestions = [
        "自己紹介してください",
        "JavaScriptで配列の重複を排除する方法は？",
        "簡単なToDoアプリのHTMLを書いて",
        "Markdownの書き方を教えて"
      ];

      const box = wrap.querySelector(".suggestions");
      suggestions.forEach((text) => {
        const btn = document.createElement("button");
        btn.className = "suggestion";
        btn.textContent = text;
        btn.addEventListener("click", () => {
          els.userInput.value = text;
          autoResizeInput();
          els.userInput.focus();
        });
        box.appendChild(btn);
      });

      els.chatBox.appendChild(wrap);
    }

    /* ---- Markdown / コードブロック ---- */
    function renderMarkdown(container, text) {
      if (!text) {
        container.innerHTML = "";
        return;
      }

      let html;
      if (typeof marked !== "undefined") {
        try {
          html = marked.parse(text);
        } catch {
          html = escapeHtml(text).replace(/\n/g, "<br>");
        }
      } else {
        html = escapeHtml(text).replace(/\n/g, "<br>");
      }

      if (typeof DOMPurify !== "undefined") {
        html = DOMPurify.sanitize(html, { USE_PROFILES: { html: true } });
      }

      container.innerHTML = html;

      // 外部リンクは別タブで開く
      container.querySelectorAll("a[href]").forEach((a) => {
        a.target = "_blank";
        a.rel = "noopener noreferrer";
      });

      decorateCodeBlocks(container);
    }

    // コードブロックに言語ラベルと「コピー」ボタンを付与
    function decorateCodeBlocks(container) {
      container.querySelectorAll("pre").forEach((pre) => {
        if (pre.parentElement && pre.parentElement.classList.contains("code-block")) return;

        const code = pre.querySelector("code");
        let lang = "";
        if (code) {
          const match = (code.className || "").match(/language-([\w+#.-]+)/i);
          if (match) lang = match[1];
        }

        const wrapper = document.createElement("div");
        wrapper.className = "code-block";

        const header = document.createElement("div");
        header.className = "code-header";

        const label = document.createElement("span");
        label.className = "code-lang";
        label.textContent = lang || "code";

        const copyBtn = document.createElement("button");
        copyBtn.type = "button";
        copyBtn.className = "code-copy-btn";
        copyBtn.textContent = "コピー";
        copyBtn.title = "このコードをコピー";
        copyBtn.addEventListener("click", () => {
          const source = code ? code.textContent : pre.textContent;
          copyToClipboard(source, copyBtn, "コピー");
        });

        header.appendChild(label);
        header.appendChild(copyBtn);

        pre.replaceWith(wrapper);
        wrapper.appendChild(header);
        wrapper.appendChild(pre);
      });
    }

    // メッセージ1件分のDOMを生成
    function buildMessageRow(message, isLastAi) {
      const row = document.createElement("div");
      row.className = `msg-row ${message.role}`;

      const bubble = document.createElement("div");
      bubble.className = "msg-bubble";

      const content = document.createElement("div");
      content.className = "msg-content";

      if (message.error) {
        content.textContent = message.content;
        content.style.color = "#fca5a5";
      } else {
        renderMarkdown(content, message.content);
      }

      const actions = document.createElement("div");
      actions.className = "bubble-actions";

      const copyBtn = document.createElement("button");
      copyBtn.className = "bubble-copy-btn";
      copyBtn.textContent = "📋 コピー";
      copyBtn.addEventListener("click", () => {
        copyToClipboard(message.content, copyBtn);
      });
      actions.appendChild(copyBtn);

      // 最後のAI回答にだけ「再生成」を表示
      if (message.role === "ai" && isLastAi && !message.error) {
        const regenBtn = document.createElement("button");
        regenBtn.className = "bubble-copy-btn regen-btn";
        regenBtn.textContent = "↻ 再生成";
        regenBtn.title = "この回答をもう一度生成します";
        regenBtn.addEventListener("click", regenerate);
        actions.appendChild(regenBtn);
      }

      bubble.appendChild(content);
      bubble.appendChild(actions);
      row.appendChild(bubble);

      row.dataset.ts = message.ts || "";
      row.title = message.ts ? formatDateTime(message.ts) : "";

      return row;
    }

    function scrollToBottom(force = false) {
      const box = els.chatBox;
      const nearBottom = box.scrollHeight - box.scrollTop - box.clientHeight < 140;
      if (force || nearBottom) {
        box.scrollTop = box.scrollHeight;
      }
    }

    /* =========================================================
       入力欄まわり
    ========================================================= */
    function autoResizeInput() {
      const el = els.userInput;
      el.style.height = "auto";
      el.style.height = Math.min(el.scrollHeight, 168) + "px";
    }

    function updateComposerState() {
      const canUse = modelReady && !!activeThread();
      els.userInput.disabled = !canUse;
      els.sendBtn.disabled = !canUse;
      els.sendBtn.textContent = generating ? "停止" : "送信";
      els.sendBtn.classList.toggle("btn-stop", generating);
      els.sendBtn.title = generating ? "生成を停止" : "送信 (Enter)";
      els.exportBtn.disabled = !activeThread();
      els.renameBtn.disabled = !activeThread();
      els.clearBtn.disabled = !activeThread();
    }

    /* =========================================================
       モデル初期化
    ========================================================= */
    function monitorDownload(m) {
      if (!m || typeof m.addEventListener !== "function") return;
      m.addEventListener("downloadprogress", (e) => {
        const total = e.total || 0;
        const percent = total ? Math.round((e.loaded / total) * 100) : 0;
        setStatus(`Gemini Nano モデルをダウンロード中... (${percent}%)`);
      });
    }

    async function checkAvailability() {
      try {
        lmAPI = (typeof LanguageModel !== "undefined")
          ? LanguageModel
          : (window.ai && window.ai.languageModel)
            ? window.ai.languageModel
            : null;

        if (!lmAPI) {
          throw new Error("Prompt API が見つかりません。chrome://flags の設定を確認してください。");
        }

        let availability = "unknown";
        if (typeof lmAPI.availability === "function") {
          availability = await lmAPI.availability();
        } else if (typeof lmAPI.capabilities === "function") {
          const cap = await lmAPI.capabilities();
          availability = cap.available;
        }

        if (availability === "readily" || availability === "available") {
          enableModel();
        } else if (
          availability === "downloadable" ||
          availability === "downloading" ||
          availability === "after-download"
        ) {
          setStatus("モデルのダウンロードが必要です。緑のボタンを押してください。");
          els.downloadBtn.style.display = "block";
          els.downloadBtn.disabled = false;
        } else {
          throw new Error(`この端末では利用できません (判定: ${availability})`);
        }
      } catch (err) {
        setStatus(`エラー: ${err.message}`, true);
      }
    }

    async function startDownload() {
      if (!lmAPI) return;
      els.downloadBtn.disabled = true;
      setStatus("モデルを準備しています...");
      try {
        let session;
        try {
          session = await lmAPI.create({ monitor: monitorDownload });
        } catch {
          // monitor オプション非対応の実装向けフォールバック
          session = await lmAPI.create();
        }
        try { session.destroy?.(); } catch { /* 無視 */ }
        enableModel();
      } catch (err) {
        els.downloadBtn.disabled = false;
        setStatus(`ダウンロードに失敗しました: ${err.message}`, true);
      }
    }

    function enableModel() {
      modelReady = true;
      els.downloadBtn.style.display = "none";
      updateComposerState();
      setStatus("準備完了！メッセージを入力できます。");
      setTimeout(() => els.userInput.focus(), 0);
    }

    /* =========================================================
       セッション管理（スレッドごとに1セッション）
    ========================================================= */
    function historySignature(messages) {
      const body = messages.map((m) => `${m.role[0]}${m.content.length}`).join("|");
      const last = messages.length ? messages[messages.length - 1].content.slice(0, 64) : "";
      return `${messages.length}#${body}#${last}`;
    }

    function destroySession(threadId) {
      const cached = sessionCache.get(threadId);
      if (!cached) return;
      try { cached.session.destroy?.(); } catch { /* 無視 */ }
      sessionCache.delete(threadId);
    }

    function resetSession(threadId) {
      destroySession(threadId);
      if (threadId === state.activeId) els.usage.textContent = "";
    }

    // 履歴から新しいセッションを作成（API差異を吸収するため段階的にフォールバック）
    async function createSession(history) {
      const historyPrompts = history
        .slice(-HISTORY_LIMIT)
        .filter((m) => m.content && m.content.trim() && !m.error)
        .map((m) => ({ role: m.role === "user" ? "user" : "assistant", content: m.content }));

      const sys = (settings.systemPrompt || "").trim();
      const temperature = Number(settings.temperature);

      const builders = [
        () => ({
          initialPrompts: [...(sys ? [{ role: "system", content: sys }] : []), ...historyPrompts],
          temperature,
          monitor: monitorDownload
        }),
        () => ({ systemPrompt: sys, initialPrompts: historyPrompts, temperature, monitor: monitorDownload }),
        () => ({ systemPrompt: sys, temperature, monitor: monitorDownload }),
        () => ({ monitor: monitorDownload })
      ];

      let lastError = null;
      for (const build of builders) {
        try {
          return await lmAPI.create(build());
        } catch (err) {
          lastError = err;
        }
      }
      throw lastError || new Error("セッションを作成できませんでした");
    }

    async function ensureSession(thread, history) {
      const key = historySignature(history);
      const cached = sessionCache.get(thread.id);
      if (cached && cached.key === key) {
        return cached.session;
      }
      destroySession(thread.id);
      setStatus("セッションを準備中...");
      const session = await createSession(history);
      sessionCache.set(thread.id, { session, key });
      return session;
    }

    /* =========================================================
       送信・ストリーミング
    ========================================================= */
    async function sendMessage() {
      const thread = activeThread();
      const text = els.userInput.value.trim();

      if (!thread || !text || generating) return;
      if (!modelReady) {
        setStatus("モデルの準備が完了していません", true);
        return;
      }

      // 送信前の履歴（このスレッドのセッション状態と一致しているはず）
      const history = thread.messages.slice();

      thread.messages.push({ role: "user", content: text, ts: Date.now() });
      if (!thread.renamed && thread.messages.filter((m) => m.role === "user").length === 1) {
        thread.title = makeTitle(text);
      }
      thread.updatedAt = Date.now();

      els.userInput.value = "";
      autoResizeInput();
      saveState();
      renderAll();

      await runTurn(thread, text, history);
    }

    async function regenerate() {
      const thread = activeThread();
      if (!thread || generating) return;

      const aiIndex = findLastAiIndex(thread.messages);
      if (aiIndex < 0) return;

      // 直前のユーザーメッセージを探す
      let userIndex = aiIndex - 1;
      while (userIndex >= 0 && thread.messages[userIndex].role !== "user") userIndex--;
      if (userIndex < 0) return;

      const promptText = thread.messages[userIndex].content;
      const seedHistory = thread.messages.slice(0, userIndex);

      // 回答以降を削除して作り直す
      thread.messages.splice(aiIndex);
      thread.updatedAt = Date.now();
      resetSession(thread.id);

      saveState();
      renderAll();

      await runTurn(thread, promptText, seedHistory);
    }

    // 1ターン分の応答生成
    async function runTurn(thread, promptText, history) {
      generating = true;
      abortCtrl = new AbortController();
      updateComposerState();
      setStatus("応答を生成中...");

      const aiMessage = { role: "ai", content: "", ts: Date.now() };
      thread.messages.push(aiMessage);

      const row = buildMessageRow(aiMessage, true);
      els.chatBox.appendChild(row);
      const contentDiv = row.querySelector(".msg-content");
      const actionsDiv = row.querySelector(".bubble-actions");

      // 生成中はコピー/再生成ボタンを隠す
      actionsDiv.style.display = "none";
      contentDiv.innerHTML = "<em>考え中...</em>";
      scrollToBottom(true);

      let latest = "";
      let renderTimer = null;
      const scheduleRender = () => {
        if (renderTimer) return;
        renderTimer = setTimeout(() => {
          renderTimer = null;
          renderMarkdown(contentDiv, latest);
          scrollToBottom();
        }, 60);
      };

      let session = null;
      try {
        session = await ensureSession(thread, history);

        const stream = (() => {
          try {
            return session.promptStreaming(promptText, { signal: abortCtrl.signal });
          } catch {
            // signal 非対応実装向けフォールバック
            return session.promptStreaming(promptText);
          }
        })();
        for await (const chunk of stream) {
          if (abortCtrl.signal.aborted) break;
          if (typeof chunk !== "string") continue;

          // 累積チャンク／差分チャンクの両方に対応
          if (chunk.startsWith(latest)) {
            latest = chunk;
          } else {
            latest += chunk;
          }
          aiMessage.content = latest;
          scheduleRender();
        }

        // ストリーミングが空だった場合のフォールバック（1回だけ）
        if (!abortCtrl.signal.aborted && !latest.trim()) {
          try {
            const direct = await session.prompt(promptText, { signal: abortCtrl.signal });
            if (direct && direct.trim()) {
              latest = direct;
              aiMessage.content = latest;
            }
          } catch { /* 無視 */ }
          // セッション状態が不定になるため作り直させる
          resetSession(thread.id);
        }

        if (!latest.trim()) {
          latest = "(応答がありませんでした)";
          aiMessage.content = latest;
        }

        clearTimeout(renderTimer);
        renderTimer = null;
        renderMarkdown(contentDiv, latest);

        // セッションの「ここまで読んだ履歴」を更新
        if (sessionCache.has(thread.id) && session) {
          sessionCache.set(thread.id, { session, key: historySignature(thread.messages) });
        }

        thread.updatedAt = Date.now();
        saveState();
        updateUsage(session);

        if (abortCtrl.signal.aborted) {
          setStatus("生成を停止しました");
        } else {
          setStatus("回答が完了しました");
        }
      } catch (err) {
        clearTimeout(renderTimer);

        const aborted = err?.name === "AbortError" || abortCtrl?.signal.aborted;

        if (aborted) {
          if (!latest.trim()) {
            // 何も生成できていなければAIメッセージ自体を削除
            const index = thread.messages.indexOf(aiMessage);
            if (index >= 0) thread.messages.splice(index, 1);
            row.remove();
          } else {
            aiMessage.content = latest;
            renderMarkdown(contentDiv, latest);
          }
          setStatus("生成を停止しました");
        } else {
          const message = String(err?.message || err);
          const isQuota = /quota|context|too (long|large)|token/i.test(message);
          aiMessage.error = true;
          aiMessage.content = isQuota
            ? `コンテキストの上限に達しました。新しいスレッドを開始するか、このスレッドの履歴を削減してください。\n（詳細: ${message}）`
            : `エラー: ${message}`;
          contentDiv.textContent = aiMessage.content;
          contentDiv.style.color = "#fca5a5";
          setStatus(isQuota ? "コンテキスト上限に達しました" : "エラーが発生しました", true);
          // セッションを破棄して次回は履歴から作り直す
          resetSession(thread.id);
          saveState();
        }
      } finally {
        generating = false;
        abortCtrl = null;

        // 生成中に隠していたアクションを表示（再生成ボタンの要否を再計算）
        const actions = row.querySelector(".bubble-actions");
        if (actions) {
          actions.style.display = "";
          actions.querySelectorAll(".regen-btn").forEach((b) => b.remove());

          const threadNow = state.threads.find((t) => t.id === thread.id);
          const isLastAi = threadNow && findLastAiIndex(threadNow.messages) === threadNow.messages.indexOf(aiMessage);

          if (threadNow && isLastAi && !aiMessage.error) {
            const regenBtn = document.createElement("button");
            regenBtn.className = "bubble-copy-btn regen-btn";
            regenBtn.textContent = "↻ 再生成";
            regenBtn.title = "この回答をもう一度生成します";
            regenBtn.addEventListener("click", regenerate);
            actions.appendChild(regenBtn);
          }
        }

        updateComposerState();
        renderHeader();
        renderThreadList();
        saveState();
        scrollToBottom();
        els.userInput.focus();
      }
    }

    function stopGeneration() {
      if (!generating || !abortCtrl) return;
      abortCtrl.abort();
      setStatus("停止しています...");
    }

    /* =========================================================
       エクスポート
    ========================================================= */
    function threadToMarkdown(thread) {
      const lines = [
        `# ${thread.title}`,
        "",
        `- 作成日時: ${new Date(thread.createdAt).toLocaleString("ja-JP")}`,
        `- 更新日時: ${new Date(thread.updatedAt).toLocaleString("ja-JP")}`,
        `- メッセージ数: ${thread.messages.length}`,
        ""
      ];
      thread.messages.forEach((m) => {
        lines.push(m.role === "user" ? "## 🧑 ユーザー" : "## 🤖 Gemini Nano", "", m.content, "");
      });
      return lines.join("\n");
    }

    function exportThread() {
      const thread = activeThread();
      if (!thread) return;
      downloadFile(`${sanitizeFileName(thread.title)}.md`, threadToMarkdown(thread), "text/markdown");
      setStatus("Markdownファイルを書き出しました");
    }

    function exportAllThreads() {
      const data = {
        exportedAt: new Date().toISOString(),
        version: 1,
        threads: state.threads
      };
      downloadFile(
        `gemini-nano-chat-${new Date().toISOString().slice(0, 10)}.json`,
        JSON.stringify(data, null, 2),
        "application/json"
      );
      setStatus("全スレッドをJSONで書き出しました");
    }

    function deleteAllThreads() {
      if (generating) {
        setStatus("生成中はスレッドを削除できません", true);
        return;
      }
      if (!confirm("すべてのスレッドを削除します。よろしいですか？\nこの操作は取り消せません。")) return;

      sessionCache.forEach((cached) => {
        try { cached.session.destroy?.(); } catch { /* 無視 */ }
      });
      sessionCache.clear();
      state.threads = [];
      createThread(true);
      setStatus("すべてのスレッドを削除しました");
    }

    /* =========================================================
       サイドバー（モバイル）
    ========================================================= */
    function openSidebar() {
      els.sidebar.classList.add("open");
      els.sidebarOverlay.classList.add("show");
    }

    function closeSidebar() {
      els.sidebar.classList.remove("open");
      els.sidebarOverlay.classList.remove("show");
    }

    /* =========================================================
       設定ダイアログ
    ========================================================= */
    function openSettings() {
      els.systemPromptInput.value = settings.systemPrompt;
      els.temperatureInput.value = String(settings.temperature);
      els.temperatureValue.textContent = settings.temperature.toFixed(2).replace(/0$/, "");
      if (els.settingsDialog.open) return;
      if (typeof els.settingsDialog.showModal === "function") {
        els.settingsDialog.showModal();
      } else {
        els.settingsDialog.setAttribute("open", "");
      }
    }

    function closeSettings() {
      if (typeof els.settingsDialog.close === "function" && els.settingsDialog.open) {
        els.settingsDialog.close();
      } else {
        els.settingsDialog.removeAttribute("open");
      }
    }

    function applySettings() {
      if (generating) {
        setStatus("生成中は設定を変更できません", true);
        return;
      }
      const prompt = els.systemPromptInput.value.trim();
      settings.systemPrompt = prompt || DEFAULT_SYSTEM_PROMPT;
      settings.temperature = Math.min(1, Math.max(0, Number(els.temperatureInput.value) || 0));
      saveSettings();

      // システムプロンプトはセッション生成時に使うため、全セッションを作り直す
      sessionCache.forEach((cached) => {
        try { cached.session.destroy?.(); } catch { /* 無視 */ }
      });
      sessionCache.clear();
      els.usage.textContent = "";

      closeSettings();
      setStatus("設定を保存しました（次回の応答から反映）");
    }

    /* =========================================================
       イベント登録
    ========================================================= */
    els.newThreadBtn.addEventListener("click", () => {
      if (generating) {
        setStatus("生成中は新しいスレッドを作成できません", true);
        return;
      }
      createThread(true);
      closeSidebar();
    });

    els.threadSearch.addEventListener("input", renderThreadList);
    els.settingsBtn.addEventListener("click", openSettings);

    els.menuBtn.addEventListener("click", openSidebar);
    els.sidebarOverlay.addEventListener("click", closeSidebar);

    els.renameBtn.addEventListener("click", () => renameThread(activeThread()));
    els.exportBtn.addEventListener("click", exportThread);
    els.clearBtn.addEventListener("click", clearThread);

    els.copyInputBtn.addEventListener("click", () => {
      copyToClipboard(els.userInput.value, els.copyInputBtn);
    });

    els.downloadBtn.addEventListener("click", startDownload);

    els.sendBtn.addEventListener("click", () => {
      if (generating) stopGeneration();
      else sendMessage();
    });

    els.userInput.addEventListener("input", autoResizeInput);

    els.userInput.addEventListener("keydown", (e) => {
      // Enter: 送信 / Shift+Enter: 改行
      if (e.key !== "Enter" || e.shiftKey) return;
      // IME変換確定のEnterは送信しない（keyCode 229 はIME処理中）
      if (e.isComposing || e.keyCode === 229) return;

      e.preventDefault();
      if (!generating && !els.sendBtn.disabled) sendMessage();
    });

    els.temperatureInput.addEventListener("input", () => {
      els.temperatureValue.textContent = Number(els.temperatureInput.value).toFixed(2).replace(/0$/, "");
    });

    els.saveSettingsBtn.addEventListener("click", applySettings);
    els.closeSettingsBtn.addEventListener("click", closeSettings);
    els.exportAllBtn.addEventListener("click", exportAllThreads);
    els.deleteAllBtn.addEventListener("click", deleteAllThreads);

    // Escでサイドバーを閉じる（モバイル）
    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape") closeSidebar();
    });

    // 終了時にセッションを破棄し、未保存の履歴を確定させる
    window.addEventListener("beforeunload", () => {
      clearTimeout(saveTimer);
      persistState();
      sessionCache.forEach((cached) => {
        try { cached.session.destroy?.(); } catch { /* 無視 */ }
      });
    });

    /* =========================================================
       初期化
    ========================================================= */
    (function init() {
      // marked の基本設定（チャット向けに改行を反映）
      if (typeof marked !== "undefined" && typeof marked.setOptions === "function") {
        marked.setOptions({ gfm: true, breaks: true });
      }

      loadSettings();
      loadState();
      renderAll();
      autoResizeInput();
      checkAvailability();
    })();
  </script>
</body>
</html>
