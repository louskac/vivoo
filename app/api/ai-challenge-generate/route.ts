import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { eventTitle, eventCategory, location } = body;

    const apiKey = process.env.OPENAI_API_KEY;

    const sampleChallenges = [
      {
        title: 'Skandování & Oslava Gólu',
        description: 'Zachyť 15s video atmosféry z tribuny při skandování názvu klubu s fanoušky!',
        reward: 100,
        sector: 'Sektor G Fanklub',
        badge: 'ATMOSFÉRA'
      },
      {
        title: 'Týmové Barvy & Šála',
        description: 'Ukaž v 10s videu svůj zápasový outfit, šálu a pozdrav z Malšovické Arény!',
        reward: 80,
        sector: 'Sektor B Hlavní Tribuna',
        badge: 'FANDĚNÍ'
      },
      {
        title: 'Mexická Vlna s Přáteli',
        description: 'Natoč krátké video zapojení do mexické vlny nebo choreografie na stadionu!',
        reward: 120,
        sector: 'Sektor C Východ',
        badge: 'VIRÁLNÍ'
      },
      {
        title: 'Choreografie & Světelná Show',
        description: 'Synchronizuj stroboskop telefonu s rozsvíceným stadionem a natoč 10s záběr!',
        reward: 150,
        sector: 'Sektor D Sever',
        badge: 'STANT'
      }
    ];

    if (!apiKey) {
      // Pick random challenge from samples
      const randomChallenge = sampleChallenges[Math.floor(Math.random() * sampleChallenges.length)];
      return NextResponse.json({
        success: true,
        challenge: {
          ...randomChallenge,
          id: `ai-gen-${Date.now()}`,
          generatedForEvent: eventTitle || 'Východočeské Derby'
        }
      });
    }

    // OpenAI AI generator
    const openAiResponse = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [
          {
            role: 'system',
            content: `Jsi AI generátor unikátních okamžitých výzev pro fanoušky na akci "${eventTitle || 'Derby'}".
Generuj zábavné, bezpečné 10-15s výzvy pro mobilní video, které zvednou atmosféru.`
          },
          {
            role: 'user',
            content: `Vygeneruj 1 novou náhodnou výzvu pro akci "${eventTitle}".
Odpověz ve formátu JSON:
{
  "title": "Stručný název výzvy",
  "description": "Popis co má fanoušek udělat ve videu (1-2 věty)",
  "reward": 100,
  "sector": "Sektor G Fanklub",
  "badge": "ATMOSFÉRA"
}`
          }
        ],
        max_tokens: 250,
        temperature: 0.8,
        response_format: { type: 'json_object' }
      })
    }).then(r => r.json());

    const content = openAiResponse.choices?.[0]?.message?.content;
    const parsed = JSON.parse(content);

    return NextResponse.json({
      success: true,
      challenge: {
        id: `ai-gen-${Date.now()}`,
        title: parsed.title || 'Skandování & Oslava',
        description: parsed.description || 'Zachyť atmosféru z tribuny s fanoušky!',
        reward: parsed.reward || 100,
        sector: parsed.sector || 'Sektor G Fanklub',
        badge: parsed.badge || 'ATMOSFÉRA',
        generatedForEvent: eventTitle || 'Východočeské Derby'
      }
    });

  } catch (error: any) {
    console.error('AI challenge generation failed:', error);
    const fallback = {
      id: `ai-gen-${Date.now()}`,
      title: 'Hlasitý Kotel Fanklubu',
      description: 'Natoč 15s video reakce na akci z tribuny a získej 100 Kč na Express Bar!',
      reward: 100,
      sector: 'Sektor G Fanklub',
      badge: 'ATMOSFÉRA',
      generatedForEvent: 'Východočeské Derby'
    };
    return NextResponse.json({ success: true, challenge: fallback });
  }
}
