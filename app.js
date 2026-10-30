// Local Gemini Nano Chat - application logic
//
// [Security invariant] モデル出力・localStorage 由来など信頼できない文字列は
// textContent / value 経由でのみ挿入すること。innerHTML への挿入は
// 静的な固定文字列（空クリアを含む）に限定する。CSP の script-src 'self' は
// 本ファイルを自己完結させるための設定であり、XSS の最終防線として機能する。

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

const STORE_KEY = "localGeminiNanoChat.state.v1";
const SETTINGS_KEY = "localGeminiNanoChat.settings.v1";
const HISTORY_LIMIT = 12;

const DEFAULT_SYSTEM_PROMPT =
  "あなたは親切なAIアシスタントです。自然な日本語で簡潔に回答してください。";

const state = {
  threads: [],
  activeId: null
};

let settings = {
  systemPrompt: DEFAULT_SYSTEM_PROMPT,
  temperature: 0.8
};

let lmAPI = null;
let modelReady = false;
let generating = false;
let abortCtrl = null;
let saveTimer = null;

const sessionCache = new Map();

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

async function copyText(text) {
  if (!text) return false;
  try {
    if (navigator.clipboard && window.isSecureContext) {
      await navigator.clipboard.writeText(text);
      return true;
    }
  } catch { }

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
    setStatus("履歴の保存に失敗しました", true);
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
  } catch { }
}

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
    setStatus("生成中はスレッドを切り替えられません", true);
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
  if (thread.messages.length && !confirm(`「${thread.title}」を削除しますか？`)) {
    return;
  }

  const cached = sessionCache.get(id);
  if (cached) {
    try { cached.session.destroy?.(); } catch { }
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
  
  const icon = document.createElement("div");
  icon.className = "empty-icon";
  icon.textContent = "✦";

  const h2 = document.createElement("h2");
  h2.textContent = "Gemini Nano とチャット";

  const p = document.createElement("p");
  p.innerHTML = "すべての処理はこの端末内で完結します。<br>会話はスレッドごとに自動保存されます。";

  const suggestionsBox = document.createElement("div");
  suggestionsBox.className = "suggestions";

  const suggestions = [
    "自己紹介してください",
    "JavaScriptで配列の重複を排除する方法は？",
    "簡単なToDoアプリの概要を教えて",
    "文章を分かりやすく推敲するコツは？"
  ];

  suggestions.forEach((text) => {
    const btn = document.createElement("button");
    btn.className = "suggestion";
    btn.textContent = text;
    btn.addEventListener("click", () => {
      els.userInput.value = text;
      autoResizeInput();
      els.userInput.focus();
    });
    suggestionsBox.appendChild(btn);
  });

  wrap.appendChild(icon);
  wrap.appendChild(h2);
  wrap.appendChild(p);
  wrap.appendChild(suggestionsBox);

  els.chatBox.appendChild(wrap);
}

/* ---- 外部依存を排除した安全なレンダリング機能 ---- */
function renderSafeText(container, text) {
  if (!text) {
    container.innerHTML = "";
    return;
  }

  // 改行および基本テキストの安全なエスケープ表示
  const lines = text.split("\n");
  container.innerHTML = "";

  let inCodeBlock = false;
  let codeBuffer = [];

  lines.forEach((line) => {
    if (line.trim().startsWith("```")) {
      if (inCodeBlock) {
        const pre = document.createElement("pre");
        pre.textContent = codeBuffer.join("\n");
        container.appendChild(pre);
        codeBuffer = [];
        inCodeBlock = false;
      } else {
        inCodeBlock = true;
      }
      return;
    }

    if (inCodeBlock) {
      codeBuffer.push(line);
    } else {
      const p = document.createElement("p");
      p.textContent = line;
      container.appendChild(p);
    }
  });

  if (inCodeBlock && codeBuffer.length > 0) {
    const pre = document.createElement("pre");
    pre.textContent = codeBuffer.join("\n");
    container.appendChild(pre);
  }
}

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
    renderSafeText(content, message.content);
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
      session = await lmAPI.create();
    }
    try { session.destroy?.(); } catch { }
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

function historySignature(messages) {
  const body = messages.map((m) => `${m.role[0]}${m.content.length}`).join("|");
  const last = messages.length ? messages[messages.length - 1].content.slice(0, 64) : "";
  return `${messages.length}#${body}#${last}`;
}

function destroySession(threadId) {
  const cached = sessionCache.get(threadId);
  if (!cached) return;
  try { cached.session.destroy?.(); } catch { }
  sessionCache.delete(threadId);
}

function resetSession(threadId) {
  destroySession(threadId);
  if (threadId === state.activeId) els.usage.textContent = "";
}

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

async function sendMessage() {
  const thread = activeThread();
  const text = els.userInput.value.trim();

  if (!thread || !text || generating) return;
  if (!modelReady) {
    setStatus("モデルの準備が完了していません", true);
    return;
  }

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

  let userIndex = aiIndex - 1;
  while (userIndex >= 0 && thread.messages[userIndex].role !== "user") userIndex--;
  if (userIndex < 0) return;

  const promptText = thread.messages[userIndex].content;
  const seedHistory = thread.messages.slice(0, userIndex);

  thread.messages.splice(aiIndex);
  thread.updatedAt = Date.now();
  resetSession(thread.id);

  saveState();
  renderAll();

  await runTurn(thread, promptText, seedHistory);
}

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

  actionsDiv.style.display = "none";
  contentDiv.textContent = "考え中...";
  scrollToBottom(true);

  let latest = "";
  let renderTimer = null;
  const scheduleRender = () => {
    if (renderTimer) return;
    renderTimer = setTimeout(() => {
      renderTimer = null;
      renderSafeText(contentDiv, latest);
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
        return session.promptStreaming(promptText);
      }
    })();
    for await (const chunk of stream) {
      if (abortCtrl.signal.aborted) break;
      if (typeof chunk !== "string") continue;

      if (chunk.startsWith(latest)) {
        latest = chunk;
      } else {
        latest += chunk;
      }
      aiMessage.content = latest;
      scheduleRender();
    }

    if (!abortCtrl.signal.aborted && !latest.trim()) {
      try {
        const direct = await session.prompt(promptText, { signal: abortCtrl.signal });
        if (direct && direct.trim()) {
          latest = direct;
          aiMessage.content = latest;
        }
      } catch { }
      resetSession(thread.id);
    }

    if (!latest.trim()) {
      latest = "(応答がありませんでした)";
      aiMessage.content = latest;
    }

    clearTimeout(renderTimer);
    renderTimer = null;
    renderSafeText(contentDiv, latest);

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
        const index = thread.messages.indexOf(aiMessage);
        if (index >= 0) thread.messages.splice(index, 1);
        row.remove();
      } else {
        aiMessage.content = latest;
        renderSafeText(contentDiv, latest);
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
      resetSession(thread.id);
      saveState();
    }
  } finally {
    generating = false;
    abortCtrl = null;

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
  if (!confirm("すべてのスレッドを削除します。よろしいですか？")) return;

  sessionCache.forEach((cached) => {
    try { cached.session.destroy?.(); } catch { }
  });
  sessionCache.clear();
  state.threads = [];
  createThread(true);
  setStatus("すべてのスレッドを削除しました");
}

function openSidebar() {
  els.sidebar.classList.add("open");
  els.sidebarOverlay.classList.add("show");
}

function closeSidebar() {
  els.sidebar.classList.remove("open");
  els.sidebarOverlay.classList.remove("show");
}

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

  sessionCache.forEach((cached) => {
    try { cached.session.destroy?.(); } catch { }
  });
  sessionCache.clear();
  els.usage.textContent = "";

  closeSettings();
  setStatus("設定を保存しました（次回の応答から反映）");
}

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
  if (e.key !== "Enter" || e.shiftKey) return;
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

document.addEventListener("keydown", (e) => {
  if (e.key === "Escape") closeSidebar();
});

window.addEventListener("beforeunload", () => {
  clearTimeout(saveTimer);
  persistState();
  sessionCache.forEach((cached) => {
    try { cached.session.destroy?.(); } catch { }
  });
});

(function init() {
  loadSettings();
  loadState();
  renderAll();
  autoResizeInput();
  checkAvailability();
})();
