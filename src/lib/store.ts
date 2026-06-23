import type { Plugin } from "siyuan";
import { writable, derived } from "svelte/store";

export let plugin: Plugin;

export const settings = writable({
    deepseekKey: "",
    deepseekModel: "deepseek-chat",
    brainApiUrl: "http://127.0.0.1:8765",
    siyuanApiUrl: "http://127.0.0.1:6806",
});

export const activeTab = writable<"chat" | "graph" | "embed">("chat");

export function initStore(p: Plugin) {
    plugin = p;
    p.loadData("brain-ai-config.json").then((data: any) => {
        if (data) settings.set({ ...data });
    });
}

export async function saveSettings() {
    let current: any;
    settings.subscribe((v) => (current = v))();
    if (plugin) {
        await plugin.saveData("brain-ai-config.json", current);
    }
}
