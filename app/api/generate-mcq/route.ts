import { NextRequest, NextResponse } from "next/server";
import OpenAI from "openai";

export async function POST(req: NextRequest) {
  try {
    if (!process.env.OPENAI_API_KEY) {
      return NextResponse.json({ error: "OPENAI_API_KEY is not configured" }, { status: 500 });
    }
    const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

    const { chapter, subject, difficulty, count } = await req.json();

    if (!chapter || !subject || !difficulty || !count) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const prompt = `Generate ${count} NEET-style MCQs on the chapter "${chapter}" from ${subject}.
Difficulty: ${difficulty}.

Rules:
- Follow the latest NTA NEET exam pattern strictly
- Each question should be unique and not repetitive
- For difficulty "Hard", include Assertion-Reason or tricky distractor questions
- All options must be plausible (avoid obviously wrong distractors)
- Explanations must be concise but scientifically accurate

Return ONLY a valid JSON array (no markdown, no code blocks) with this exact structure:
[
  {
    "id": "unique_id_string",
    "type": "mcq",
    "question": "...",
    "optionA": "...",
    "optionB": "...",
    "optionC": "...",
    "optionD": "...",
    "correctOption": "A|B|C|D",
    "explanation": "...",
    "chapter": "${chapter}",
    "subject": "${subject.toLowerCase()}",
    "difficulty": "${difficulty}"
  }
]`;

    const completion = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [{ role: "user", content: prompt }],
      temperature: 0.7,
      max_tokens: 3000,
    });

    const raw = completion.choices[0]?.message?.content ?? "[]";

    // Safely parse JSON
    const cleaned = raw.replace(/```json|```/g, "").trim();
    const questions = JSON.parse(cleaned);

    return NextResponse.json({ questions }, { status: 200 });
  } catch (error: any) {
    console.error("MCQ generation error:", error);
    return NextResponse.json(
      { error: "Failed to generate MCQs", details: error.message },
      { status: 500 }
    );
  }
}
