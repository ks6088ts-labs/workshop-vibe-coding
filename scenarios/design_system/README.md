# Design system を用いた vibe coding

[Material UI - Vite example in TypeScript](https://github.com/mui/material-ui/tree/master/examples/material-ui-vite-ts) をベースに、vibe coding でデザインシステムを用いた開発を体験します。

```shell
git clone https://github.com/mui/material-ui.git

cd material-ui/examples/material-ui-vite-ts
npm install
npm run dev
```

[Model Context Protocol (MCP) for MUI](https://mui.com/material-ui/getting-started/mcp/) を参考に、[.vscode/mcp.json](../../.vscode/mcp.json) に Material UI MCP を追加します。
以下のプロンプトを実行して、Material UI のドキュメントを参照しながら Microsoft To Do のようなアプリを GitHub Copilot に実装させてください。
Material UI はオープンソースのデザインシステムであるため、LLM 単独の知識で解決してしまう場合があります。
ここでは、明示的に MCP サーバーとの連携を促すために、[Common issues](https://mui.com/material-ui/getting-started/mcp/#ive-installed-the-mcp-but-its-not-being-used-when-i-ask-questions) を参考に、プロンプトの末尾に MCP サーバーを利用するように指示を追加しています。

```text
Material UI のデザインシステムを活用して Microsoft To Do のようなアプリを実装してください。

---

## Use the mui-mcp server to answer any MUI questions --

- 1. call the "useMuiDocs" tool to fetch the docs of the package relevant in the question
- 2. call the "fetchDocs" tool to fetch any additional docs if needed using ONLY the URLs present in the returned content.
- 3. repeat steps 1-2 until you have fetched all relevant docs for the given question
- 4. use the fetched content to answer the question
```
