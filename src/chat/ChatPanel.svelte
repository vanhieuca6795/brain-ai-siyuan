<script lang="ts">
  import { settings } from "../lib/store";
  import { searchBlocks } from "../api/brain";
  import { chatWithContext } from "../api/deepseek";

  let input = "";
  let messages: { role: string; content: string; sources?: any[] }[] = [];
  let loading = false;
  let deepseekKey = "";
  let status = "";

  settings.subscribe(s => deepseekKey = s.deepseekKey);

  async function send() {
    const q = input.trim();
    if (!q || loading) return;
    input = "";
    loading = true;
    messages = [...messages, { role: "user", content: q }];

    try {
      const results = await searchBlocks(q, 5);
      const filtered = results.filter((r: any) => r.score >= 0.3);

      const history = messages
        .filter(m => m.role !== "system")
        .slice(-6)
        .map(m => ({ role: m.role, content: m.content }));

      const answer = filtered.length > 0
        ? await chatWithContext(q, filtered, history)
        : await chatWithContext(q, [], history);

      messages = [...messages, { role: "assistant", content: answer, sources: filtered }];
    } catch (e: any) {
      messages = [...messages, { role: "assistant", content: `Error: ${e.message}` }];
    }
    loading = false;
  }

  function handleKeydown(e: KeyboardEvent) {
    if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); send(); }
  }
</script>

<div class="chat-panel">
  {#if !deepseekKey}
    <div class="setup-note">
      <p>Configure DeepSeek API key in plugin settings</p>
    </div>
  {/if}

  <div class="messages" bind:this={msgContainer}>
    {#each messages as msg}
      <div class="msg {msg.role}">
        <div class="content">{@html msg.content.replace(/\n/g, '<br>').replace(/\[ref:(.*?)\]/g, '<span class="ref">[$1]</span>')}</div>
        {#if msg.sources?.length}
          <div class="sources">
            {#each msg.sources as s}
              <span title={s.id}>{(s.hpath || s.id?.slice(0,12))} ({(s.score*100).toFixed(0)}%)</span>
            {/each}
          </div>
        {/if}
      </div>
    {/each}
    {#if loading}
      <div class="msg assistant"><em>Thinking...</em></div>
    {/if}
  </div>

  <div class="input-row">
    <textarea
      bind:value={input}
      on:keydown={handleKeydown}
      placeholder="Ask your second brain..."
      rows="2"
      disabled={!deepseekKey || loading}
    ></textarea>
    <button on:click={send} disabled={!input.trim() || loading}>Send</button>
  </div>
</div>

<style>
  .chat-panel { height: 100%; display: flex; flex-direction: column; }
  .setup-note { padding: 20px; text-align: center; color: var(--b3-theme-on-surface); opacity: 0.6; }
  .messages { flex: 1; overflow-y: auto; padding: 12px; display: flex; flex-direction: column; gap: 10px; }
  .msg { max-width: 85%; padding: 10px 14px; border-radius: 10px; font-size: 13px; line-height: 1.6; }
  .msg.user { align-self: flex-end; background: var(--b3-theme-primary); color: var(--b3-theme-on-primary); }
  .msg.assistant { align-self: flex-start; background: var(--b3-theme-surface); color: var(--b3-theme-on-surface); }
  .sources { margin-top: 6px; padding-top: 6px; border-top: 1px solid rgba(128,128,128,0.3); font-size: 11px; display: flex; flex-wrap: wrap; gap: 4px; }
  .sources span { cursor: pointer; opacity: 0.7; }
  .sources span:hover { opacity: 1; }
  .ref { color: var(--b3-theme-primary); cursor: pointer; }
  .input-row { display: flex; gap: 6px; padding: 8px; border-top: 1px solid var(--b3-theme-surface-lighter); }
  .input-row textarea { flex: 1; padding: 8px; border: 1px solid var(--b3-theme-surface-lighter); border-radius: 6px; resize: none; font-size: 13px; background: var(--b3-theme-background); color: var(--b3-theme-on-background); outline: none; }
  .input-row textarea:focus { border-color: var(--b3-theme-primary); }
  .input-row button { padding: 8px 16px; border: none; border-radius: 6px; background: var(--b3-theme-primary); color: var(--b3-theme-on-primary); cursor: pointer; font-size: 13px; }
  .input-row button:disabled { opacity: 0.5; cursor: not-allowed; }
</style>
