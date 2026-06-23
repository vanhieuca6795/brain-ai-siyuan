<script lang="ts">
  import { indexBlocks, getStatus } from "../api/brain";
  import { getBlocks } from "../api/siyuan";
  import { onMount } from "svelte";

  let indexedCount = 0;
  let totalBlocks = 0;
  let syncing = false;
  let msg = "";

  onMount(async () => {
    try {
      const s = await getStatus();
      indexedCount = s.total_indexed || 0;
      const blocks = await getBlocks();
      totalBlocks = blocks.length;
    } catch (e) {
      msg = "Brain AI service not running. Start: python server.py";
    }
  });

  async function sync() {
    syncing = true;
    msg = "Indexing...";
    try {
      const r = await indexBlocks(5000);
      indexedCount = r.collection_size || indexedCount;
      msg = `Done: ${r.newly_indexed} new blocks indexed. Total: ${indexedCount}`;
    } catch (e: any) {
      msg = `Error: ${e.message}`;
    }
    syncing = false;
  }

  async function autoLink() {
    syncing = true;
    msg = "Auto-linking blocks...";
    try {
      const r = await fetch("http://127.0.0.1:8765/link-all", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ batch_size: 10 }),
      });
      const d = await r.json();
      msg = `Linked: ${d.links_created || 0} connections`;
    } catch (e: any) {
      msg = `Error: ${e.message}`;
    }
    syncing = false;
  }
</script>

<div class="embed-panel">
  <div class="stats">
    <div class="stat"><span>{indexedCount}</span> indexed</div>
    <div class="stat"><span>{totalBlocks}</span> in SiYuan</div>
  </div>

  <div class="actions">
    <button on:click={sync} disabled={syncing}>Sync Index</button>
    <button on:click={autoLink} disabled={syncing}>Auto-Link All</button>
  </div>

  {#if msg}
    <p class="msg">{msg}</p>
  {/if}

  <div class="info">
    <h4>How it works</h4>
    <p><b>1. Write</b> notes in SiYuan</p>
    <p><b>2. Sync</b> to index with AI embeddings</p>
    <p><b>3. Chat</b> — AI answers from your knowledge</p>
    <p><b>4. Auto-Link</b> — AI connects related blocks</p>
    <p><b>5. Graph</b> — explore your knowledge map</p>
  </div>
</div>

<style>
  .embed-panel { padding: 16px; height: 100%; overflow-y: auto; display: flex; flex-direction: column; gap: 12px; }
  .stats { display: flex; gap: 12px; }
  .stat { flex: 1; text-align: center; padding: 12px; background: var(--b3-theme-surface); border-radius: 8px; }
  .stat span { font-size: 28px; font-weight: 700; display: block; color: var(--b3-theme-primary); }
  .actions { display: flex; gap: 8px; }
  .actions button { flex: 1; padding: 10px; border: none; border-radius: 6px; background: var(--b3-theme-primary); color: var(--b3-theme-on-primary); cursor: pointer; font-size: 13px; }
  .actions button:disabled { opacity: 0.5; cursor: not-allowed; }
  .msg { font-size: 12px; padding: 8px; background: var(--b3-theme-surface); border-radius: 4px; color: var(--b3-theme-on-surface); }
  .info { font-size: 12px; color: var(--b3-theme-on-surface); opacity: 0.7; }
  .info h4 { margin: 0 0 6px; opacity: 1; }
  .info p { margin: 3px 0; }
</style>
