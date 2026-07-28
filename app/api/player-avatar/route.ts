import { NextRequest, NextResponse } from 'next/server';

// In-memory cache for resolved player avatar URLs
const avatarCache = new Map<string, string>();

// Known dictionary of FotMob IDs for Czech & international players for instant sub-millisecond lookup
const KNOWN_FOTMOB_IDS: Record<string, number> = {
  // FC Hradec Králové
  'adam zadražil': 1398355,
  'adam zadrazil': 1398355,
  'zadražil': 1398355,
  'mick van buren': 279110,
  'van buren': 279110,
  'buren': 279110,
  'františek čech': 846315,
  'frantisek cech': 846315,
  'čech': 846315,
  'karel uhrinčať': 1382975,
  'uhrinčať': 1382975,
  'filip čihák': 941552,
  'čihák': 941552,
  'vladimír darida': 196311,
  'darida': 196311,
  'samuel dancák': 933789,
  'dancák': 933789,
  'daniel horák': 1132554,
  'horák': 1132554,
  'tom slončík': 1435935,
  'slončík': 1435935,
  'ondřej mihálik': 591775,
  'mihálik': 591775,
  'tomáš wiesner': 865046,
  'wiesner': 865046,

  // FK Pardubice
  'tobias boledovič': 1791353,
  'boledovič': 1791353,
  'vojtěch patrák': 1163500,
  'patrák': 1163500,
  'václav drchal': 924667,
  'drchal': 924667,
  'abdullahi tanko': 1079839,
  'tanko': 1079839,
  'michal hlavatý': 740676,
  'hlavatý': 740676,
  'samuel šimek': 1180771,
  'šimek': 1180771,
  'karel trédl': 1354447,
  'trédl': 1354447,
  'jason noslin': 1379398,
  'noslin': 1379398,
  'ondřej kukučka': 1225873,
  'kukučka': 1225873,
  'eldar šehić': 951807,
  'šehić': 951807,
  'viktor budinský': 319888,
  'budinský': 319888
};

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const rawName = (searchParams.get('name') || searchParams.get('player') || '').trim();

  if (!rawName) {
    return NextResponse.redirect('https://ui-avatars.com/api/?name=Player&background=1e293b&color=fff');
  }

  const cleanKey = rawName.toLowerCase();

  // 1. Check in-memory cache
  if (avatarCache.has(cleanKey)) {
    return NextResponse.redirect(avatarCache.get(cleanKey)!);
  }

  // 2. Check known static ID dictionary
  if (KNOWN_FOTMOB_IDS[cleanKey]) {
    const fotmobId = KNOWN_FOTMOB_IDS[cleanKey];
    const targetUrl = `https://images.fotmob.com/image_resources/playerimages/${fotmobId}.png`;
    avatarCache.set(cleanKey, targetUrl);
    return NextResponse.redirect(targetUrl);
  }

  // Also check single surname matching
  const surnameKey = cleanKey.split(' ').pop() || '';
  if (surnameKey && KNOWN_FOTMOB_IDS[surnameKey]) {
    const fotmobId = KNOWN_FOTMOB_IDS[surnameKey];
    const targetUrl = `https://images.fotmob.com/image_resources/playerimages/${fotmobId}.png`;
    avatarCache.set(cleanKey, targetUrl);
    return NextResponse.redirect(targetUrl);
  }

  // 3. Dynamic lookup via FotMob Search API (works worldwide for any player name)
  try {
    const apiUrl = `https://apigw.fotmob.com/searchapi/suggest?term=${encodeURIComponent(rawName)}&lang=en`;
    const res = await fetch(apiUrl, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
      },
      next: { revalidate: 86400 } // Cache for 24 hours
    });

    if (res.ok) {
      const data = await res.json();
      const options = data.squadMemberSuggest?.[0]?.options || [];
      if (options.length > 0) {
        const fotmobId = options[0]?.payload?.id;
        if (fotmobId) {
          const targetUrl = `https://images.fotmob.com/image_resources/playerimages/${fotmobId}.png`;
          avatarCache.set(cleanKey, targetUrl);
          return NextResponse.redirect(targetUrl);
        }
      }
    }
  } catch (err: any) {
    console.warn(`Failed to resolve FotMob avatar for ${rawName}:`, err?.message || err);
  }

  // 4. Fallback to clean SVG Initial Badge if no photo exists
  const fallbackUrl = `https://ui-avatars.com/api/?name=${encodeURIComponent(rawName)}&background=0f172a&color=38bdf8&bold=true`;
  avatarCache.set(cleanKey, fallbackUrl);
  return NextResponse.redirect(fallbackUrl);
}
