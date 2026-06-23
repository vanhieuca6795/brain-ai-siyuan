/// <reference types="vite/client" />

declare module "*.svelte" {
  import type { ComponentType } from "svelte";
  const component: ComponentType;
  export default component;
}

declare module "siyuan" {
  export interface Plugin {
    addCommand(options: any): void;
    addDock(options: any): void;
    addTopBar(options: any): void;
    loadData(key: string): Promise<any>;
    saveData(key: string, data: any): Promise<void>;
  }
  export function getFrontend(): string;
  export interface IModel {
    children?: IModel[];
  }
}
