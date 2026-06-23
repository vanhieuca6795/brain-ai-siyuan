<script lang="ts">
  import { activeTab, settings } from "../lib/store";
  import ChatPanel from "./ChatPanel.svelte";
  import GraphPanel from "../graph/GraphPanel.svelte";
  import EmbedPanel from "../embed/EmbedPanel.svelte";

  let currentTab: string = "chat";
  activeTab.subscribe(v => currentTab = v);
</script>

<div class="brain-container">
  <div class="tabs">
    <button class:active={currentTab === 'chat'} on:click={() => activeTab.set('chat')}>Chat</button>
    <button class:active={currentTab === 'graph'} on:click={() => activeTab.set('graph')}>Graph</button>
    <button class:active={currentTab === 'embed'} on:click={() => activeTab.set('embed')}>Embed</button>
  </div>
  <div class="panel">
    {#if currentTab === 'chat'}
      <ChatPanel />
    {:else if currentTab === 'graph'}
      <GraphPanel />
    {:else}
      <EmbedPanel />
    {/if}
  </div>
</div>

<style>
  .brain-container { height: 100%; display: flex; flex-direction: column; background: var(--b3-theme-background); }
  .tabs { display: flex; border-bottom: 1px solid var(--b3-theme-surface-lighter); }
  .tabs button {
    flex: 1; padding: 8px; border: none; background: transparent;
    cursor: pointer; font-size: 13px; color: var(--b3-theme-on-surface);
    border-bottom: 2px solid transparent;
  }
  .tabs button.active { border-bottom-color: var(--b3-theme-primary); color: var(--b3-theme-primary); }
  .tabs button:hover { background: var(--b3-theme-surface); }
  .panel { flex: 1; overflow: hidden; display: flex; flex-direction: column; }
</style>
