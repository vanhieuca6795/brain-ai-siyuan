<script lang="ts">
  import { getGraph } from "../api/brain";
  import { onMount } from "svelte";

  let nodes: any[] = [];
  let links: any[] = [];
  let canvas: HTMLCanvasElement;
  let loading = true;

  onMount(async () => {
    try { const data = await getGraph(); nodes = data.nodes || []; links = data.links || []; }
    catch (e) { console.error(e); }
    loading = false;
    drawGraph();
  });

  function drawGraph() {
    if (!canvas || !nodes.length) return;
    const ctx = canvas.getContext("2d")!;
    const w = canvas.width = canvas.parentElement!.clientWidth;
    const h = canvas.height = 400;
    ctx.clearRect(0, 0, w, h);
    
    const positions = nodes.map((n, i) => {
      const angle = (i / nodes.length) * Math.PI * 2 - Math.PI / 2;
      return { x: w/2 + Math.cos(angle) * (w * 0.32), y: h/2 + Math.sin(angle) * (h * 0.32), ...n };
    });

    ctx.strokeStyle = "var(--b3-theme-surface-lighter, #555)";
    ctx.lineWidth = 0.5;
    links.forEach((l: any) => {
      const a = positions.find(p => p.id === l.source);
      const b = positions.find(p => p.id === l.target);
      if (a && b) { ctx.beginPath(); ctx.moveTo(a.x, a.y); ctx.lineTo(b.x, b.y); ctx.stroke(); }
    });

    positions.forEach(n => {
      ctx.beginPath(); ctx.arc(n.x, n.y, 6, 0, Math.PI*2);
      ctx.fillStyle = "var(--b3-theme-primary, #3574f0)"; ctx.fill();
      ctx.fillStyle = "var(--b3-theme-on-surface, #ccc)";
      ctx.font = "9px sans-serif";
      ctx.fillText((n.hpath || n.id?.slice(0,14) || "").substring(0,18), n.x + 10, n.y + 3);
    });
  }
</script>

<div class="graph-panel">
  {#if loading}
    <p class="status">Loading graph...</p>
  {:else if !nodes.length}
    <p class="status">No blocks to display</p>
  {:else}
    <canvas bind:this={canvas}></canvas>
    <p class="count">{nodes.length} blocks</p>
  {/if}
</div>

<style>
  .graph-panel { height: 100%; display: flex; flex-direction: column; position: relative; }
  canvas { flex: 1; width: 100%; }
  .status { padding: 20px; text-align: center; opacity: 0.6; color: var(--b3-theme-on-surface); }
  .count { position: absolute; bottom: 4px; right: 8px; font-size: 10px; opacity: 0.4; color: var(--b3-theme-on-surface); }
</style>
