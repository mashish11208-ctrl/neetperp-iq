// app/api/generate-mcq/route.ts
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const { subject, chapter, difficulty, count = 10 } = await req.json();

    if (!subject || !chapter) {
      return NextResponse.json(
        { error: "subject and chapter are required" },
        { status: 400 }
      );
    }

    const apiKey = process.env.GROQ_API_KEY;
    if (!apiKey) {
      return NextResponse.json(
        { error: "GROQ_API_KEY not configured" },
        { status: 500 }
      );
    }

    const prompt = `You are an expert NEET UG exam question creator strictly following the NTA NEET UG 2026 syllabus based on NCERT Class 11 & 12 textbooks.

Generate exactly ${count} multiple choice questions for:
- Subject: ${subject}
- Chapter: ${chapter}
- Difficulty: ${difficulty || "Mixed"}

STRICT RULES:
1. Every question MUST be from NCERT Class 11 or 12 content only
2. Include both MCQ and Assertion-Reason types (mix them)
3. For Assertion-Reason, options must ALWAYS be:
   A: Both A and R are true and R is the correct explanation of A
   B: Both A and R are true but R is NOT the correct explanation of A
   C: A is true but R is false
   D: A is false but R is true
4. correctOption must be exactly "A", "B", "C", or "D"
5. No repeated questions
6. Explanation must reference NCERT concepts

Return ONLY valid JSON array, no markdown, no extra text:
[
  {
    "id": "unique_id_here",
    "type": "mcq",
    "question": "question text",
    "optionA": "option A text",
    "optionB": "option B text",
    "optionC": "option C text",
    "optionD": "option D text",
    "correctOption": "A",
    "explanation": "NCERT-based explanation",
    "chapter": "${chapter}",
    "subject": "${subject.toLowerCase()}",
    "difficulty": "${difficulty || "Medium"}"
  }
]`;

    const response = await fetch(
      "https://api.groq.com/openai/v1/chat/completions",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${apiKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: "llama-3.3-70b-versatile",
          messages: [
            {
              role: "system",
              content:
                "You are a NEET exam expert. Always respond with valid JSON only. No markdown. No explanation outside JSON.",
            },
            {
              role: "user",
              content: prompt,
            },
          ],
          temperature: 0.7,
          max_tokens: 4000,
          response_format: { type: "json_object" },
        }),
      }
    );

    if (!response.ok) {
      const err = await response.text();
      console.error("Groq API error:", err);
      return NextResponse.json(
        { error: "AI generation failed", details: err },
        { status: 500 }
      );
    }

    const data = await response.json();
    const rawContent = data.choices?.[0]?.message?.content;

    if (!rawContent) {
      return NextResponse.json(
        { error: "Empty response from AI" },
        { status: 500 }
      );
    }

    // Parse JSON — handle both array and object wrapper
    let questions;
    try {
      const parsed = JSON.parse(rawContent);
      // Groq with json_object mode wraps in object sometimes
      questions = Array.isArray(parsed)
        ? parsed
        : parsed.questions || parsed.data || Object.values(parsed)[0];
    } catch {
      return NextResponse.json(
        { error: "AI returned invalid JSON", raw: rawContent },
        { status: 500 }
      );
    }

    // Sanitize and validate each question
    const validated = questions
      .filter(
        (q: Record<string, string>) =>
          q.question &&
          q.optionA &&
          q.optionB &&
          q.optionC &&
          q.optionD &&
          ["A", "B", "C", "D"].includes(q.correctOption)
      )
      .map((q: Record<string, string>, i: number) => ({
        ...q,
        id: q.id || `ai_${subject}_${Date.now()}_${i}`,
        type: q.type || "mcq",
        subject: subject.toLowerCase(),
        chapter: chapter,
        difficulty: q.difficulty || difficulty || "Medium",
      }));

    if (validated.length === 0) {
      return NextResponse.json(
        { error: "AI returned no valid questions" },
        { status: 500 }
      );
    }

    return NextResponse.json({ questions: validated });
  } catch (error) {
    console.error("Route error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}