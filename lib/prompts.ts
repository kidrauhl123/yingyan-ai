import type { Audience, VisualSpec } from "./schema";

const audienceGuidance: Record<Audience, string> = {
  leader: "面向管理者：结论先行，强调决策、结果和关键数字，语言极简。",
  client: "面向客户：强调价值、收益和可信度，避免内部术语。",
  student: "面向学习者：逻辑循序渐进，解释概念，语言清晰易懂。",
  social: "面向社交媒体读者：标题有记忆点，句子短，信息密度适中。",
};

export function generationPrompt(text: string, audience: Audience) {
  return `你是资深信息设计师。把原文压缩为一张可信、清晰的中文信息图。

${audienceGuidance[audience]}

规则：
1. 只使用原文能够支持的信息，不补充事实或数字。
2. 提炼 3-7 个互不重复的核心信息项。
3. 每一项的 sourceQuote 必须逐字摘录原文中支持该项的短句。
4. label 不超过 12 个汉字，description 不超过 36 个汉字。
5. conclusion 是整张图最重要的一句话，不超过 32 个汉字。
6. 为每项判断 role：core=核心结论，evidence=证据，action=行动，context=背景。
7. 为每项选择语义 symbol：spark、target、growth、people、shield、clock、idea、link。
8. 从 process（路径）、cards（编辑摘要）、orbit（中心星图）、split（对照）、steps（递进阶梯）、signal（强结论海报）中选择恰好三种不同构图。根据内容决定，不要固定组合。
9. 有明显顺序时优先 process/steps；有两类对立信息时优先 split；有强结论或数字时优先 signal；中心主题辐射时优先 orbit。
10. id 使用 item-1、item-2 这样的稳定格式。

仅返回 JSON，不要 Markdown，不要解释，结构如下：
{"spec":{"title":"","conclusion":"","items":[{"id":"item-1","label":"","description":"","value":"","sourceQuote":"","role":"core","symbol":"target"}],"sourceText":""},"suggestedTypes":["signal","split","cards"]}

原文：
${text}`;
}

export function refinePrompt(
  spec: VisualSpec,
  audience: Audience,
  instruction: string,
  selectedItemId?: string | null,
) {
  const scope = selectedItemId
    ? `只修改 id 为 ${selectedItemId} 的信息项；除非指令明确要求，否则保持其他字段不变。`
    : "可以调整整张图的标题、结论和信息项，但必须保留原文事实。";

  return `你是信息图编辑器。根据用户指令修改给定的 VisualSpec。

${audienceGuidance[audience]}
${scope}
所有 sourceQuote 必须仍是 sourceText 中真实存在的原文片段。不要编造数字或事实。
仅返回修改后的 VisualSpec JSON，不要 Markdown，不要解释。

用户指令：${instruction}

VisualSpec：
${JSON.stringify(spec)}`;
}
