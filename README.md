# Brain AI - SiYuan Plugin

AI-powered second brain for SiYuan Note.

## Features

- **Chat with AI** — Ask questions about your notes. AI retrieves relevant blocks via semantic search (RAG).
- **Auto-Embedding** — Sync blocks from SiYuan to vector database for semantic search.
- **Knowledge Graph** — Visualize your note connections.
- **Auto-Link** — AI finds and creates relationships between blocks.
- **DeepSeek/GPT** — Supports any OpenAI-compatible API.

## Setup

1. Install the plugin from SiYuan Marketplace
2. Go to plugin settings → enter your **DeepSeek API key**
3. Install and run Brain AI backend service:
   ```bash
   pip install brain-ai-service
   cd ~/brain_ai && python server.py
   ```
4. Click **Sync Index** in the Embed tab to index your notes
5. Start chatting in the Chat tab

## Requires

- SiYuan Note v3.6.0+
- Brain AI backend service running on `http://127.0.0.1:8765`
- DeepSeek API key (or any OpenAI-compatible API)

## License

MIT
