import { settings } from "../lib/store";

let baseUrl = "http://127.0.0.1:6806";
settings.subscribe((s) => (baseUrl = s.siyuanApiUrl));

export async function siyuanPost(path: string, data: any = {}) {
    const r = await fetch(`${baseUrl}${path}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
    });
    return r.json();
}

export async function getBlocks(): Promise<any[]> {
    const sql = `
        SELECT b.id, b.content, b.type, b.root_id, b.hpath
        FROM blocks b
        WHERE b.type IN ('p', 'h', 'b', 'c')
        AND b.content != ''
        AND b.content IS NOT NULL
        ORDER BY b.updated DESC
    `;
    const r = await siyuanPost("/api/query/sql", { stmt: sql });
    return r.data || [];
}

export async function appendBlock(parentId: string, content: string) {
    return siyuanPost("/api/block/appendBlock", {
        dataType: "markdown",
        data: content,
        parentID: parentId,
    });
}

export async function getBlockContent(blockId: string): Promise<string> {
    const r = await siyuanPost("/api/block/getBlockKramdown", { id: blockId });
    return r.data?.kramdown || "";
}
