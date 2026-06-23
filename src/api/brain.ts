import { settings } from "../lib/store";

let brainApi = "http://127.0.0.1:8765";
settings.subscribe((s) => (brainApi = s.brainApiUrl));

export async function brainPost(path: string, data: any = {}) {
    const r = await fetch(`${brainApi}${path}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
    });
    return r.json();
}

export async function searchBlocks(query: string, topK = 5) {
    const r = await brainPost("/search", { question: query, top_k: topK });
    return r.results || [];
}

export async function indexBlocks(limit = 2000) {
    return brainPost("/index", { limit });
}

export async function getStatus() {
    const r = await fetch(`${brainApi}/status`);
    return r.json();
}

export async function getGraph() {
    const r = await fetch(`${brainApi}/graph`);
    return r.json();
}

export async function linkBlocks(blockId: string, topK = 5) {
    return brainPost("/link", { block_id: blockId, top_k: topK });
}
