import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { challengeDescription, frames, eventTitle } = body;

    if (!challengeDescription || !frames || !Array.isArray(frames) || frames.length === 0) {
      return NextResponse.json({
        success: true,
        passed: false,
        score: 15,
        creativity: 1,
        authenticity: 1,
        effort: 1,
        explanation: 'Ve videu nebyly nalezeny žádné snímky z fotoaparátu.',
        confidence: 0.9,
        framesAnalyzed: 0
      });
    }

    const apiKey = process.env.GEMINI_API_KEY || "AIzaSyCxICEfUJmKxohk-fQfRhOT2mah7xvWr-k";

    // Filter valid base64 frame strings
    const validFrames = frames.filter(
      (f) => typeof f === 'string' && f.length > 500 && !f.startsWith('sample')
    );

    if (validFrames.length === 0) {
      return NextResponse.json({
        success: true,
        passed: false,
        score: 20,
        creativity: 2,
        authenticity: 2,
        effort: 2,
        explanation: 'Ve videu nebyla detekována požadovaná aktivita pro výzvu (video je prázdné nebo tmavé).',
        confidence: 0.95,
        framesAnalyzed: 0
      });
    }

    // Limit to max 8 frames for optimal latency and accuracy
    const selectedFrames = validFrames.length > 8
      ? validFrames.filter((_, i) => i % Math.floor(validFrames.length / 8) === 0).slice(0, 8)
      : validFrames;

    console.log(`🤖 Sending ${selectedFrames.length} real video frames to Gemini 2.5 Flash Vision API...`);

    const promptText = `Jsi přísný i povzbudivý AI porotce v aplikaci ViVoo hodnotící, zda uživatel ve videu správně a s energií splnil výzvu "${challengeDescription}" na akci "${eventTitle || 'Východočeské Derby'}".

Instrukce k hodnocení:
1. Prohlédni si všechny chronologické snímky z videa uživatele z kamery.
2. Pokud uživatel ve videu pouze pasivně sedí nebo hledí do kamery bez jakéhokoliv skandování, fandění, předvedení dresu/šály nebo splnění zadané aktivity -> Vyhodnoť jako NESPLNĚNO (completed: false, score: 0-35).
3. Pokud uživatel aktivně plní výzvu (fandí, skanduje, má šálu/rekvizitu, slaví gól) -> Vyhodnoť jako SPLNĚNO (completed: true, score: 65-100).

Odpověz VÝHRADNĚ ve formátu JSON:
{
  "score": [číslo 0-100],
  "explanation": "[2-3 věty v češtině vysvětlující vaše přesné hodnocení]",
  "completed": [true nebo false],
  "creativity": [číslo 0-10],
  "authenticity": [číslo 0-10],
  "effort": [číslo 0-10]
}`;

    const geminiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`;

    const geminiRes = await fetch(geminiUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [
          {
            role: 'user',
            parts: [
              { text: promptText },
              ...selectedFrames.map((base64: string) => ({
                inline_data: {
                  mime_type: 'image/jpeg',
                  data: base64
                }
              }))
            ]
          }
        ],
        generationConfig: {
          temperature: 0.2,
          responseMimeType: 'application/json'
        }
      })
    });

    if (!geminiRes.ok) {
      const errText = await geminiRes.text();
      console.error('Gemini API Error:', errText);
      throw new Error(`Gemini API call failed with status ${geminiRes.status}`);
    }

    const geminiData = await geminiRes.json();
    const responseText = geminiData.candidates?.[0]?.content?.parts?.[0]?.text;

    if (!responseText) {
      throw new Error('No content returned from Gemini Vision API.');
    }

    const parsed = JSON.parse(responseText);
    const score = Math.max(0, Math.min(100, parsed.score || 0));
    const passed = Boolean(parsed.completed && score >= 50);

    console.log('✅ Gemini 2.5 Flash Evaluation:', {
      score,
      passed,
      explanation: parsed.explanation
    });

    return NextResponse.json({
      success: true,
      passed,
      score,
      creativity: parsed.creativity || Math.round(score / 10),
      authenticity: parsed.authenticity || Math.round(score / 10),
      effort: parsed.effort || Math.round(score / 10),
      explanation: parsed.explanation || 'Vyhodnocení Gemini AI dokončeno.',
      confidence: score / 100,
      framesAnalyzed: selectedFrames.length,
      isMock: false
    });
  } catch (error: any) {
    console.error('💥 AI challenge check error:', error);
    return NextResponse.json({
      success: false,
      passed: false,
      score: 0,
      creativity: 0,
      authenticity: 0,
      effort: 0,
      explanation: `Chyba při komunikaci s Gemini AI: ${error?.message || 'Neznámá chyba'}`,
      confidence: 0,
      framesAnalyzed: 0
    });
  }
}
