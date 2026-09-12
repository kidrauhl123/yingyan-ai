import { NextResponse } from "next/server";
import { callDeepSeek } from "@/lib/deepseek";
import { refinePrompt } from "@/lib/prompts";
import { assertSourceQuotes, refineRequestSchema, visualSpecSchema } from "@/lib/schema";

export const runtime = "nodejs";

export async function POST(request: Request) {
  try {
    const body = refineRequestSchema.parse(await request.json());
    const result = await callDeepSeek([
      { role: "system", content: "你只输出严格有效的 JSON。" },
      {
        role: "user",
        content: refinePrompt(body.spec, body.audience, body.instruction, body.selectedItemId),
      },
    ]);
    result.sourceText = body.spec.sourceText;
    const parsed = visualSpecSchema.parse(result);
    assertSourceQuotes(parsed);
    return NextResponse.json({ spec: parsed });
  } catch (error) {
    const message = error instanceof Error ? error.message : "修改失败";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
