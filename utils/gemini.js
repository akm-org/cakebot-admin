const { GoogleGenerativeAI } = require('@google/generative-ai');
let model;
function getModel() {
  if (!model) {
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    model = genAI.getGenerativeModel({
      model: 'gemini-1.5-flash',
      generationConfig: { responseMimeType: 'application/json', temperature: 0.2 },
    });
  }
  return model;
}

const PROMPT = `You are a Discord moderation classifier. Given a user message, classify it.
Return STRICT JSON only:
{"toxic":bool,"spam":bool,"hate":bool,"scamLink":bool,"severity":"low|medium|high","action":"none|warn|mute|ban","reason":"short reason"}
Guidelines:
- "low" = mildly rude → action "none" or "warn"
- "medium" = clear toxicity/spam → "warn" or "mute"
- "high" = hate speech / scam / threats → "mute" or "ban"
Message:`;

async function classify(content) {
  try {
    const r = await getModel().generateContent(PROMPT + '\n' + JSON.stringify(content).slice(0, 2000));
    const txt = r.response.text();
    return JSON.parse(txt);
  } catch (e) {
    console.error('[gemini] classify failed', e.message);
    return { toxic:false, spam:false, hate:false, scamLink:false, severity:'low', action:'none', reason:'classifier_error' };
  }
}
module.exports = { classify };
