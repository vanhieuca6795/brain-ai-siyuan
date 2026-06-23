/// <reference types="siyuan" />

import { Plugin, getFrontend, IModel } from "siyuan";
import { initStore, settings } from "./lib/store";
import "./index.css";

export default class BrainAIPlugin extends Plugin {
    private isShow = false;

    onload() {
        initStore(this);
        
        this.addCommand({
            langKey: "toggleBrainAI",
            hotkey: "⌥⇧K",
            callback: () => this.togglePanel(),
        });

        this.addDock({
            type: "brain-ai",
            config: {
                position: "RightBottom",
                size: { width: 400, height: 600 },
                icon: "iconBrain",
                title: "Brain AI",
                hotkey: "⌥⇧K",
            },
            data: {},
            init: () => {
                this.isShow = true;
                const el = document.createElement("div");
                el.id = "brain-ai-root";
                el.style.cssText = "height:100%;display:flex;flex-direction:column";
                this.initUI(el);
                return el;
            },
            destroy: () => {
                this.isShow = false;
            },
        });

        // Add top bar button
        this.addTopBar({
            icon: "iconBrain",
            title: "Brain AI",
            position: "right",
            callback: () => this.togglePanel(),
        });
    }

    onunload() {
        this.isShow = false;
    }

    private async initUI(container: HTMLElement) {
        const { mount } = await import("svelte");
        const { default: Chat } = await import("./chat/Chat.svelte");
        mount(Chat, { target: container });
    }

    private togglePanel() {
        this.isShow = !this.isShow;
    }
}
