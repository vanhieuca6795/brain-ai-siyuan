import { Plugin, getFrontend } from "siyuan";
import { initStore, settings } from "./lib/store";
import { mount } from "svelte";
import Chat from "./chat/Chat.svelte";
import "./index.css";

class BrainAIPlugin extends Plugin {
    private isShow = false;

    onload() {
        console.log("[Brain AI] Plugin loading...");
        initStore(this);

        this.addIcons(`<symbol id="iconBrain" viewBox="0 0 32 32">
<path d="M16 2C8.268 2 2 8.268 2 16s6.268 14 14 14 14-6.268 14-14S23.732 2 16 2zm-1.5 5a1.5 1.5 0 1 1 3 0 1.5 1.5 0 0 1-3 0zm-4 8a1.5 1.5 0 1 1 3 0 1.5 1.5 0 0 1-3 0zm8 0a1.5 1.5 0 1 1 3 0 1.5 1.5 0 0 1-3 0zm-2 4a2 2 0 0 1-4 0h4zm-6.5 1h12v2h-12v-2z" fill="currentColor"/>
</symbol>`);

        this.addDock({
            config: {
                position: "RightBottom",
                size: { width: 400, height: 600 },
                icon: "iconBrain",
                title: "Brain AI",
                hotkey: "⌥⇧K",
            },
            data: {},
            type: "brain_ai_dock",
            init: () => {
                this.isShow = true;
                const el = document.createElement("div");
                el.id = "brain-ai-root";
                el.style.cssText = "height:100%;display:flex;flex-direction:column";
                mount(Chat, { target: el });
                return el;
            },
            destroy: () => {
                this.isShow = false;
            },
        });

        console.log("[Brain AI] Plugin loaded successfully");
    }

    onunload() {
        console.log("[Brain AI] Plugin unloaded");
    }
}

// Capture before any other module.exports overwrites it
(globalThis as any).__siyuan_plugin__ = BrainAIPlugin;

export default BrainAIPlugin;
