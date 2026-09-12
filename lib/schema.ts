import { z } from "zod";

export const audienceSchema = z.enum(["leader", "client", "student", "social"]);
export type Audience = z.infer<typeof audienceSchema>;

export const visualItemSchema = z.object({
  id: z.string(),
  label: z.string().min(1).max(24),
  description: z.string().min(1).max(80),
  value: z.string().max(24).optional().default(""),
  sourceQuote: z.string().min(1).max(160),
  role: z.enum(["core", "evidence", "action", "context"]).default("context"),
  symbol: z.enum(["spark", "target", "growth", "people", "shield", "clock", "idea", "link"]).default("spark"),
});

export const visualSpecSchema = z.object({
  title: z.string().min(1).max(36),
  conclusion: z.string().min(1).max(80),
  items: z.array(visualItemSchema).min(3).max(7),
  sourceText: z.string().default(""),
});

export const visualTypeSchema = z.enum(["process", "cards", "orbit", "split", "steps", "signal"]);

export type VisualItem = z.infer<typeof visualItemSchema>;
export type VisualSpec = z.infer<typeof visualSpecSchema>;
export type VisualType = z.infer<typeof visualTypeSchema>;

export const generatedResponseSchema = z.object({
  spec: visualSpecSchema,
  suggestedTypes: z.array(visualTypeSchema).length(3),
});

export const generateRequestSchema = z.object({
  text: z.string().min(20).max(12000),
  audience: audienceSchema,
});

export const refineRequestSchema = z.object({
  instruction: z.string().min(2).max(500),
  audience: audienceSchema,
  spec: visualSpecSchema,
  selectedItemId: z.string().nullable().optional(),
});

export function assertSourceQuotes(spec: VisualSpec) {
  for (const item of spec.items) {
    if (!spec.sourceText.includes(item.sourceQuote)) {
      throw new Error(`“${item.label}”的原文依据未通过校验，请重新生成`);
    }
  }
  return spec;
}
