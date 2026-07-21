const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type",
  "Content-Type": "application/json; charset=utf-8"
};

export default {
  async fetch(request, env) {
    if (request.method === "OPTIONS") return new Response(null, { headers: corsHeaders });
    const url = new URL(request.url);
    if (request.method !== "POST" || url.pathname !== "/generate-card") {
      return json({ error: "Not found" }, 404);
    }
    if (!env.OPENAI_API_KEY) return json({ error: "OPENAI_API_KEY is not configured" }, 500);

    try {
      const body = await request.json();
      const fa = String(body.fa || "").trim();
      if (!fa) return json({ error: "fa is required" }, 400);

      const category = String(body.category || "Personal / Benutzerdefiniert");
      const categoryFa = String(body.category_fa || "شخصی / سفارشی");
      const context = String(body.context || "").trim();
      const prompt = `Create one professional HSE/occupational-safety Leitner card for a Persian-speaking safety professional in Germany.\nPersian term/concept: ${fa}\nCategory: ${categoryFa} / ${category}\nOptional context: ${context || "none"}\n\nReturn only valid JSON with exactly these string fields:\n- de: precise German technical term used in German occupational safety/construction safety\n- en: precise English equivalent\n- example_de: one realistic, natural German workplace scenario (B2/C1) that demonstrates the exact meaning and use of the term; include a concrete activity, hazard or control measure\n- example_fa: accurate Persian translation of example_de\n- example_de_2: a different German sentence suitable for a report, RAMS review, toolbox talk or safety meeting; it must remain specifically related to the term and must not merely replace the term in a generic template\n- example_fa_2: accurate Persian translation of example_de_2\n- source: short cautious note naming the likely German rule family (e.g. DGUV, ASR, TRBS, TRGS, BG BAU) only when reasonably relevant; never invent a specific rule number. End with \"fachlich prüfen\".\nUse standard German terminology. Return only the base technical term in de and en. Never prepend labels such as Bewertungskriterium, Wirksamkeitskontrolle, Notfallmaßnahme, Übungsszenario, assessment criterion, effectiveness check, emergency measure or drill scenario. Do not add markdown.`;

      const apiResponse = await fetch("https://api.openai.com/v1/responses", {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${env.OPENAI_API_KEY}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          model: env.OPENAI_MODEL || "gpt-5-mini",
          input: prompt
        })
      });

      const data = await apiResponse.json();
      if (!apiResponse.ok) return json({ error: data?.error?.message || "OpenAI API error" }, apiResponse.status);
      const text = extractOutputText(data);
      const parsed = parseJsonObject(text);
      for (const key of ["de", "en", "definition_en", "definition_de", "example_de", "example_fa", "example_de_2", "example_fa_2", "source"]) {
        if (!parsed[key] || typeof parsed[key] !== "string") throw new Error(`Missing field: ${key}`);
      }
      return json(parsed, 200);
    } catch (error) {
      return json({ error: error.message || "Unexpected error" }, 500);
    }
  }
};

function extractOutputText(data) {
  if (typeof data.output_text === "string" && data.output_text.trim()) return data.output_text;
  const parts = [];
  for (const item of data.output || []) {
    for (const content of item.content || []) {
      if (content.type === "output_text" && content.text) parts.push(content.text);
    }
  }
  if (!parts.length) throw new Error("No text returned by model");
  return parts.join("\n");
}

function parseJsonObject(text) {
  const clean = text.trim().replace(/^```(?:json)?\s*/i, "").replace(/\s*```$/, "");
  try { return JSON.parse(clean); } catch (_) {
    const start = clean.indexOf("{");
    const end = clean.lastIndexOf("}");
    if (start >= 0 && end > start) return JSON.parse(clean.slice(start, end + 1));
    throw new Error("Model did not return valid JSON");
  }
}

function json(value, status = 200) {
  return new Response(JSON.stringify(value), { status, headers: corsHeaders });
}
