# Codebase Knowledge Graph

This project uses codebase-memory-mcp.

Always prefer Codebase Memory MCP for code discovery before grep/file search.

Priority:
1. search_code / search_graph
2. trace_path
3. get_code_snippet
4. query_graph
5. get_architecture

Fallback to grep only for string literals, configs, non-code files, or when MCP results are insufficient.

---

**Practical notes for this install**
- `project` id to pass to the MCP tools: `C-Users-rob62-Desktop-jara-website`
- The practical search tool here is `search_code`; if another project exposes it as `search_graph`, it's the same idea — **graph first, then files**.
- Re-index after significant changes: `index_repository(repo_path, mode="moderate")`.
