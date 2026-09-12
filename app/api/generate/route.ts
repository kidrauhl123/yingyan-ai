import { NextResponse } from "next/server";
import { callDeepSeek } from "@/lib/deepseek";
import { generationPrompt } from "@/lib/prompts";
import { assertSourceQuotes, generateRequestSchema, generatedResponseSchema } from "@/lib/schema";

export const runtime = "nodejs";

export async function POST(request: Request) {
  try {
    const body = generateRequestSchema.parse(await request.json());
    const result = await callDeepSeek([
      { role: "system", content: "你只输出严格有效的 JSON。" },
      { role: "user", content: generationPrompt(body.text, body.audience) },
    ]);
    result.spec.sourceText = body.text;
    const parsed = generatedResponseSchema.parse(result);
    assertSourceQuotes(parsed.spec);
    return NextResponse.json(parsed);
  } catch (error) {
    const message = error instanceof Error ? error.message : "生成失败";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
