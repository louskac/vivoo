import { NextRequest, NextResponse } from 'next/server';

// In-memory cache for resolved team logo URLs
const logoCache = new Map<string, string>();

// Known dictionary of FotMob Team IDs for instant sub-millisecond lookups
const KNOWN_TEAM_LOGOS: Record<string, number> = {
  // Czech Chance Liga (1. Liga)
  'fc hradec králové': 1712,
  'fc hradec kralove': 1712,
  'hradec králové': 1712,
  'hradec kralove': 1712,
  'hradec': 1712,
  'fchk': 1712,

  'fk pardubice': 2406,
  'pardubice': 2406,
  'fkp': 2406,

  'ac sparta praha': 2150,
  'sparta praha': 2150,
  'sparta': 2150,

  'sk slavia praha': 7787,
  'slavia praha': 7787,
  'slavia': 7787,

  'fc viktoria plzeň': 2152,
  'viktoria plzen': 2152,
  'plzeň': 2152,
  'plzen': 2152,

  'fc slovan liberec': 7756,
  'liberec': 7756,

  'fk jablonec': 7758,
  'jablonec': 7758,

  'fc baník ostrava': 7755,
  'baník ostrava': 7755,
  'ostrava': 7755,

  'sk sigma olomouc': 7759,
  'olomouc': 7759,

  'bohemians 1905': 7757,
  'bohemians': 7757,

  'fk teplice': 7760,
  'teplice': 7760,

  'fc zlín': 7761,
  'zlín': 7761,

  'mfk karviná': 9385,
  'karviná': 9385,

  'fk mladá boleslav': 7762,
  'mladá boleslav': 7762,

  'slovácko': 7763,
  'dukla praha': 7764,

  // Top International Clubs
  'real madrid': 8633,
  'barcelona': 8634,
  'manchester city': 8456,
  'arsenal': 9825,
  'liverpool': 8650,
  'bayern münchen': 9823,
  'paris saint-germain': 9847,
  'psg': 9847
};

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const rawName = (searchParams.get('team') || searchParams.get('name') || '').trim();

  if (!rawName) {
    return NextResponse.redirect('https://images.fotmob.com/image_resources/logo/teamlogo/1712.png');
  }

  const cleanKey = rawName.toLowerCase();

  // 1. Check in-memory cache
  if (logoCache.has(cleanKey)) {
    return NextResponse.redirect(logoCache.get(cleanKey)!);
  }

  // 2. Check known static ID dictionary
  if (KNOWN_TEAM_LOGOS[cleanKey]) {
    const teamId = KNOWN_TEAM_LOGOS[cleanKey];
    const targetUrl = `https://images.fotmob.com/image_resources/logo/teamlogo/${teamId}.png`;
    logoCache.set(cleanKey, targetUrl);
    return NextResponse.redirect(targetUrl);
  }

  // Check fuzzy key match
  for (const [key, id] of Object.entries(KNOWN_TEAM_LOGOS)) {
    if (cleanKey.includes(key) || key.includes(cleanKey)) {
      const targetUrl = `https://images.fotmob.com/image_resources/logo/teamlogo/${id}.png`;
      logoCache.set(cleanKey, targetUrl);
      return NextResponse.redirect(targetUrl);
    }
  }

  // 3. Dynamic lookup via FotMob Search API
  try {
    const apiUrl = `https://apigw.fotmob.com/searchapi/suggest?term=${encodeURIComponent(rawName)}&lang=en`;
    const res = await fetch(apiUrl, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36'
      },
      next: { revalidate: 86400 } // Cache for 24h
    });

    if (res.ok) {
      const data = await res.json();
      const teamId = data.teamSuggest?.[0]?.options?.[0]?.payload?.id ||
                     data.matchSuggest?.[0]?.options?.[0]?.payload?.homeTeamId;
      if (teamId) {
        const targetUrl = `https://images.fotmob.com/image_resources/logo/teamlogo/${teamId}.png`;
        logoCache.set(cleanKey, targetUrl);
        return NextResponse.redirect(targetUrl);
      }
    }
  } catch (err: any) {
    console.warn(`Failed to resolve FotMob team logo for ${rawName}:`, err?.message || err);
  }

  // 4. Fallback to clean SVG badge
  const fallbackUrl = `https://ui-avatars.com/api/?name=${encodeURIComponent(rawName)}&background=1e293b&color=fff&bold=true`;
  logoCache.set(cleanKey, fallbackUrl);
  return NextResponse.redirect(fallbackUrl);
}
