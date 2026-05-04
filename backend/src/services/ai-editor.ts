interface AIEditRequest {
  instruction: string;
  content: string;
  apiKey: string;
}

interface AIEditResponse {
  original: string;
  edited: string;
}

export async function editWithAI({ instruction, content, apiKey }: AIEditRequest): Promise<AIEditResponse> {
  const systemPrompt = `You are an expert blog editor. Your task is to edit the provided markdown content based on the user's instruction.
Rules:
1. Return ONLY the edited markdown content - no explanations, no preamble, no "here's the edited version"
2. Preserve all markdown formatting, code blocks, links, and images exactly as they are
3. Only change what the instruction asks you to change
4. Maintain the original voice and style unless the instruction specifically asks to change it
5. Do not add new sections or remove existing sections unless instructed`;

  const response = await fetch("https://api.deepseek.com/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model: "deepseek-chat",
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: `Instruction: ${instruction}\n\nContent to edit:\n\n${content}` },
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
  const edited = data.choices?.[0]?.message?.content;

  if (!edited) {
    throw new Error("DeepSeek returned an empty response");
  }

  return { original: content, edited };
}
