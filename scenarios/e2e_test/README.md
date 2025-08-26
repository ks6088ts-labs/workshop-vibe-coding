# E2E テストシナリオ

[Playwright MCP](https://github.com/microsoft/playwright-mcp) を活用して、[Spec Driven Flow シナリオ](../spec_driven_flows/README.md)で実施したウェブフロントエンドの E2E テストコードを自動生成します。

## 手順

1. [Spec Driven Flow シナリオ](../spec_driven_flows/README.md)で生成したフロントエンドをローカルで起動します。(Live Server など)
2. Playwright MCP を起動します
3. [仕様書](../../spec/spec-process-family-restaurant-ordering-frontend.md)を読み込ませます
4. 以下のプロンプトを GitHub Copilot の playwright-tester モードで実行してください。

```text
#file:spec-process-family-restaurant-ordering-frontend.md の要求仕様を元に作られた以下で動作しているフロントエンドウェブアプリの E2E テストコードを Python で作成してください。
http://127.0.0.1:5500/scenarios/spec_driven_flows/generated/
作成したコードは scenarios/e2e_test/generated 以下のディレクトリに格納してください。
```

# 参考文献

- [🤖 Awesome GitHub Copilot Customizations](https://github.com/github/awesome-copilot)
  - [chatmodes/playwright-tester.chatmode.md](https://github.com/github/awesome-copilot/blob/main/chatmodes/playwright-tester.chatmode.md)
  - [instructions/playwright-python.instructions.md](https://github.com/github/awesome-copilot/blob/main/instructions/playwright-python.instructions.md)
  - [instructions/playwright-typescript.instructions.md](https://github.com/github/awesome-copilot/blob/main/instructions/playwright-typescript.instructions.md)
  - [prompts/playwright-automation-fill-in-form.prompt.md](https://github.com/github/awesome-copilot/blob/main/prompts/playwright-automation-fill-in-form.prompt.md)
  - [prompts/playwright-explore-website.prompt.md](https://github.com/github/awesome-copilot/blob/main/prompts/playwright-explore-website.prompt.md)
  - [prompts/playwright-generate-test.prompt.md](https://github.com/github/awesome-copilot/blob/main/prompts/playwright-generate-test.prompt.md)
