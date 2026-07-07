/**
 * İzgeTour — FlareSolverr istemcisi.
 *
 * Cloudflare korumalı endpoint'leri (Skiplagged) FlareSolverr üzerinden çeker.
 * FlareSolverr sayfayı gerçek tarayıcıda açar, challenge'ı çözer ve HTML döndürür.
 *
 * Skiplagged JSON yanıtı FlareSolverr tarafından <pre>...</pre> içinde,
 * HTML-entity-encoded (&quot; vb.) olarak döner. Bu yüzden:
 *   solution.response → <pre>(.*?)</pre> ayıkla → entity decode → JSON.parse
 */

const FLARESOLVERR_URL = process.env.FLARESOLVERR_URL || 'http://localhost:8191/v1';

interface FlareSolverrResponse {
  status: string;
  message?: string;
  solution?: {
    url: string;
    status: number;
    response: string; // HTML gövdesi
  };
}

// ─── HTML entity decode (JSON içeriği için yeterli minimal set) ──────────────
function decodeHtmlEntities(input: string): string {
  return input
    .replace(/&quot;/g, '"')
    .replace(/&#34;/g, '"')
    .replace(/&#039;/g, "'")
    .replace(/&#39;/g, "'")
    .replace(/&apos;/g, "'")
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&#x2F;/g, '/')
    .replace(/&nbsp;/g, ' ')
    // &amp; en sona: diğer entity'lerin çift-decode olmasını önler
    .replace(/&amp;/g, '&');
}

// ─── <pre> içeriğini ayıkla; yoksa ham response'u dene ──────────────────────
function extractJsonPayload(html: string): string {
  const preMatch = html.match(/<pre[^>]*>([\s\S]*?)<\/pre>/i);
  const candidate = preMatch ? preMatch[1] : html;
  return decodeHtmlEntities(candidate).trim();
}

/**
 * FlareSolverr üzerinden verilen URL'in HAM HTML gövdesini döndürür.
 * (JSON parse etmez; HTML kazıyan sağlayıcılar için — ör. Google Flights.)
 * @throws FlareSolverr erişilemezse veya challenge çözülemezse.
 */
export async function fetchHtmlViaFlareSolverr(
  url: string,
  maxTimeout = 60000,
): Promise<string> {
  let res: Response;
  try {
    res = await fetch(FLARESOLVERR_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ cmd: 'request.get', url, maxTimeout }),
      signal: AbortSignal.timeout(maxTimeout + 15000),
      cache: 'no-store',
    });
  } catch (err) {
    throw new Error(`FlareSolverr'a ulaşılamadı (${FLARESOLVERR_URL}): ${String(err)}`);
  }

  if (!res.ok) {
    throw new Error(`FlareSolverr HTTP hatası: ${res.status} ${res.statusText}`);
  }

  const data: FlareSolverrResponse = await res.json();

  if (data.status !== 'ok' || !data.solution) {
    throw new Error(`FlareSolverr çözüm başarısız: ${data.message ?? data.status}`);
  }

  if (data.solution.status >= 400) {
    throw new Error(`Hedef endpoint hatası: HTTP ${data.solution.status}`);
  }

  return data.solution.response;
}

/**
 * FlareSolverr üzerinden verilen URL'i GET ile çeker ve JSON olarak parse eder.
 * @throws FlareSolverr erişilemezse, challenge çözülemezse veya JSON parse edilemezse.
 */
export async function fetchViaFlareSolverr<T = unknown>(
  url: string,
  maxTimeout = 45000,
): Promise<T> {
  const response = await fetchHtmlViaFlareSolverr(url, maxTimeout);
  const payload = extractJsonPayload(response);

  try {
    return JSON.parse(payload) as T;
  } catch {
    // Parse başarısızsa ilk 200 karakteri hata mesajına koy (debug için)
    throw new Error(
      `FlareSolverr yanıtı JSON'a çevrilemedi. İçerik başı: ${payload.slice(0, 200)}`,
    );
  }
}
