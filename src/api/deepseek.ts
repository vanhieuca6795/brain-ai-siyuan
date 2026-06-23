import { settings } from "../lib/store";
import OpenAI from "openai";

let deepseekKey = "";
let deepseekModel = "deepseek-chat";
settings.subscribe((s) => {
    deepseekKey = s.deepseekKey;
    deepseekModel = s.deepseekModel;
});

function getClient() {
    if (!deepseekKey) throw new Error("DeepSeek API key not set");
    return new OpenAI({
        apiKey: deepseekKey,
        baseURL: "https://api.deepseek.com/v1",
        dangerouslyAllowBrowser: true,
    });
}

export async function chat(messages: { role: string; content: string }[]): Promise<string> {
    const client = getClient();
    const r = await client.chat.completions.create({
        model: deepseekModel,
        messages: messages as any,
        temperature: 0.3,
        max_tokens: 2000,
    });
    return r.choices[0]?.message?.content || "";
}

export async function chatWithContext(
    question: string,
    contextBlocks: { id: string; content: string; hpath: string; score: number }[],
    history: { role: string; content: string }[]
): Promise<string> {
    const context = contextBlocks
        .map((b, i) => `[Block ${i + 1}] (${b.hpath || b.id})\n${b.content}`)
        .join("\n---\n");

    const messages: any[] = [
        {
            role: "system",
            content: `You are an AI knowledge assistant. Answer based on the user's notes provided below. 
Only use information from the context. If not found, say so. Cite sources with [ref:block-id]. 
Be concise. Answer in the same language as the user.`,
        },
        ...history.slice(-10),
        {
            role: "user",
            content: `Context from user's notes:\n\n${context}\n\nQuestion: ${question}`,
        },
    ];

    return chat(messages);
}
