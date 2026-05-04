interface AIEditRequest {
  instruction: string;
  title?: string;
  excerpt?: string;
  coverImage?: string;
  content: string;
  apiKey: string;
}

interface AIEditResponse {
  original: {
    title?: string;
    excerpt?: string;
    coverImage?: string;
    content: string;
  };
  edited: {
    title?: string;
    excerpt?: string;
    coverImage?: string;
    content: string;
  };
}

export async function editWithAI(req: AIEditRequest): Promise<AIEditResponse> {
  const systemPrompt = `You are an expert blog editor. Your task is to edit the provided blog post based on the user's instruction.

The user will provide a JSON object with these fields:
- "title": current post title (optional)
- "excerpt": current excerpt/summary (optional)
- "coverImage": current cover image URL (optional)
- "content": the full markdown content

Rules:
1. You MUST return a single JSON object with the SAME structure: { "title": "...", "excerpt": "...", "coverImage": "...", "content": "..." }
2. For fields the user didn't ask you to change, return them EXACTLY as provided
3. If the user asks for a cover image, suggest a relevant Unsplash image URL like "https://images.unsplash.com/photo-..." (you can invent a plausible Unsplash photo ID — use IDs like photo-1551434678, photo-1527474305, photo-1551288049, photo-1504639725, photo-1454165806, photo-1498050108)
4. Preserve all markdown formatting, code blocks, links, and images in the content
5. Only change what the instruction asks you to change
6. Return ONLY the JSON object — no explanations, no preamble, no markdown fences
7. Make sure your response is valid JSON that can be parsed with JSON.parse()`;

  const postData = JSON.stringify({
    title: req.title || "",
    excerpt: req.excerpt || "",
    coverImage: req.coverImage || "",
    content: req.content,
  });

  const response = await fetch("https://api.deepseek.com/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${req.apiKey}`,
    },
    body: JSON.stringify({
      model: "deepseek-chat",
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: `Instruction: ${req.instruction}\n\nPost:\n${postData}` },
      ],
      temperature: 0.7,
      max_tokens: 8192,
    }),
    signal: AbortSignal.timeout(60000),
  });

  if (!response.ok) {
    const errorBody = await response.text().catch(() => "Unknown error");
    throw new Error(`DeepSeek API error (${response.status}): ${errorBody}`);
  }

  const data = await response.json() as any;
  const raw = data.choices?.[0]?.message?.content;

  if (!raw) {
    throw new Error("DeepSeek returned an empty response");
  }

  // Parse JSON response — handle markdown code fences if the AI adds them
  let jsonStr = raw.trim();
  if (jsonStr.startsWith("```")) {
    jsonStr = jsonStr.replace(/^```(?:json)?\s*\n?/, "").replace(/\n?```\s*$/, "");
  }

  const edited = JSON.parse(jsonStr);

  return {
    original: {
      title: req.title,
      excerpt: req.excerpt,
      coverImage: req.coverImage,
      content: req.content,
    },
    edited: {
      title: edited.title || req.title,
      excerpt: edited.excerpt || req.excerpt,
      coverImage: edited.coverImage || req.coverImage,
      content: edited.content || req.content,
    },
  };
}
