import https from 'https';
import http from 'http';

interface PageSpeedResponse {
  lighthouseResult?: {
    categories?: {
      performance?: { score: number };
      accessibility?: { score: number };
      'best-practices'?: { score: number };
      seo?: { score: number };
    };
    audits?: {
      'largest-contentful-paint'?: { displayValue: string; score: number };
      'first-contentful-paint'?: { displayValue: string; score: number };
      'speed-index'?: { displayValue: string; score: number };
      'cumulative-layout-shift'?: { displayValue: string; score: number };
      'total-blocking-time'?: { displayValue: string; score: number };
      interactive?: { displayValue: string; score: number };
    };
  };
  loadingExperience?: {
    overall_category?: string;
  };
}

// Helper to fetch ignoring SSL errors and following redirects
const fetchInsecure = (
  url: string,
  redirectCount = 0
): Promise<{ html: string; loadTime: number }> => {
  return new Promise((resolve, reject) => {
    if (redirectCount > 5) return reject(new Error('TOO_MANY_REDIRECTS'));

    const startTime = performance.now();
    const client = url.startsWith('https') ? https : http;

    const req = client.get(
      url,
      {
        rejectUnauthorized: false,
        headers: {
          'User-Agent':
            'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
          Accept:
            'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8'
        }
      },
      (res) => {
        // Handle Redirects
        if (
          res.statusCode &&
          res.statusCode >= 300 &&
          res.statusCode < 400 &&
          res.headers.location
        ) {
          let newUrl = res.headers.location;
          if (!newUrl.startsWith('http')) {
            try {
              newUrl = new URL(newUrl, url).toString();
            } catch (e) {
              return reject(e);
            }
          }
          return fetchInsecure(newUrl, redirectCount + 1)
            .then(resolve)
            .catch(reject);
        }

        let data = '';
        res.on('data', (chunk) => (data += chunk));
        res.on('end', () => {
          const endTime = performance.now();
          resolve({ html: data, loadTime: endTime - startTime });
        });
      }
    );

    req.on('error', reject);
  });
};

export default defineEventHandler(async (event) => {
  const body = await readBody(event);
  const url = body.url;

  if (!url) {
    throw createError({
      statusCode: 400,
      statusMessage: 'URL is required'
    });
  }

  const targetUrl = url.startsWith('http') ? url : `https://${url}`;
  const issues: string[] = [];
  let score = 0;
  let verdict = 'ANALYZING...';

  try {
    // Call Google PageSpeed Insights API (free, no key required for basic usage)
    const apiUrl = `https://www.googleapis.com/pagespeedonline/v5/runPagespeed?url=${encodeURIComponent(
      targetUrl
    )}&category=performance&category=accessibility&category=best-practices&category=seo&strategy=mobile`;

    const pageSpeedResponse = await $fetch<PageSpeedResponse>(apiUrl);

    const categories = pageSpeedResponse.lighthouseResult?.categories;
    const audits = pageSpeedResponse.lighthouseResult?.audits;

    if (!categories) {
      throw new Error('No categories returned');
    }

    // Calculate brutal score from real metrics
    const perfScore = (categories.performance?.score || 0) * 100;
    const a11yScore = (categories.accessibility?.score || 0) * 100;
    const bpScore = (categories['best-practices']?.score || 0) * 100;
    const seoScore = (categories.seo?.score || 0) * 100;

    // Weighted average with performance priority
    score = Math.round(
      perfScore * 0.4 + a11yScore * 0.2 + bpScore * 0.2 + seoScore * 0.2
    );

    // Generate brutal issues based on real data
    if (perfScore < 50) {
      issues.push(`PERFORMANCE: ${Math.round(perfScore)}/100 - EMBARRASSING`);
    } else if (perfScore < 80) {
      issues.push(`PERFORMANCE: ${Math.round(perfScore)}/100 - MEDIOCRE`);
    }

    if (a11yScore < 70) {
      issues.push(
        `ACCESSIBILITY: ${Math.round(a11yScore)}/100 - EXCLUDING USERS`
      );
    }

    if (seoScore < 80) {
      issues.push(`SEO: ${Math.round(seoScore)}/100 - INVISIBLE TO GOOGLE`);
    }

    if (bpScore < 80) {
      issues.push(`BEST PRACTICES: ${Math.round(bpScore)}/100 - AMATEUR HOUR`);
    }

    // Specific audit issues
    if (audits) {
      const lcp = audits['largest-contentful-paint'];
      if (lcp && lcp.score < 0.5) {
        issues.push(`LCP: ${lcp.displayValue} - TOO SLOW`);
      }

      const cls = audits['cumulative-layout-shift'];
      if (cls && cls.score < 0.5) {
        issues.push(`LAYOUT SHIFT: ${cls.displayValue} - JANKY AF`);
      }

      const tbt = audits['total-blocking-time'];
      if (tbt && tbt.score < 0.5) {
        issues.push(`BLOCKING TIME: ${tbt.displayValue} - FROZEN`);
      }
    }

    // Also do HTML analysis for extra brutality (using insecure fetch to handle broken SSL if needed)
    try {
      const { html } = await fetchInsecure(targetUrl);
      const lowerHtml = html.toLowerCase();

      if (lowerHtml.includes('wordpress') || lowerHtml.includes('wp-content')) {
        score -= 10;
        issues.push('WORDPRESS BLOAT DETECTED');
      }
      if (lowerHtml.includes('wix') || lowerHtml.includes('squarespace')) {
        score -= 15;
        issues.push('SITE BUILDER GENERICISM');
      }
      if ((lowerHtml.match(/<div/g) || []).length > 500) {
        score -= 5;
        issues.push('DIV SOUP DETECTED');
      }
    } catch {
      // HTML analysis failed, continue with PageSpeed data
    }

    // Clamp score
    score = Math.max(0, Math.min(100, score));

    // Determine verdict
    if (score < 30) verdict = 'CRITICAL VIBE FAILURE';
    else if (score < 50) verdict = 'NEEDS SERIOUS WORK';
    else if (score < 70) verdict = 'MEDIOCRE AT BEST';
    else if (score < 85) verdict = 'PASSABLE';
    else verdict = 'ACTUALLY DECENT';

    return {
      score,
      verdict,
      issues:
        issues.length > 0
          ? issues.slice(0, 4)
          : [
              'NO OBVIOUS FLAWS (SUSPICIOUS)',
              'TOO CLEAN',
              'IMPOSTER SYNDROME?'
            ],
      cta: score < 60 ? 'YOU NEED ME' : 'LETS COLLABORATE',
      metrics: {
        performance: Math.round(perfScore),
        accessibility: Math.round(a11yScore),
        bestPractices: Math.round(bpScore),
        seo: Math.round(seoScore)
      }
    };
  } catch (error: any) {
    // Fallback to basic HTML analysis if PageSpeed fails
    try {
      const startTime = performance.now();

      const { html, loadTime } = await fetchInsecure(targetUrl);
      const lowerHtml = html.toLowerCase();

      score = 100;

      if (loadTime > 1000) {
        score -= 15;
        issues.push('SERVER IS LAGGING ( > 1s LOAD)');
      }

      if (lowerHtml.includes('wordpress') || lowerHtml.includes('wp-content')) {
        score -= 20;
        issues.push('WORDPRESS BLOAT DETECTED');
      }
      if (lowerHtml.includes('wix') || lowerHtml.includes('squarespace')) {
        score -= 25;
        issues.push('SITE BUILDER GENERICISM');
      }
      if ((lowerHtml.match(/<div/g) || []).length > 500) {
        score -= 10;
        issues.push('DIV SOUP DETECTED');
      }
      if (!lowerHtml.includes('<footer')) {
        score -= 5;
        issues.push('WHERE IS THE FOOTER?');
      }

      // Since fetchInsecure worked but PageSpeed/NormalFetch failed, check if it was likely an SSL issue
      // Only penalize if we suspect it's a security issue, otherwise just warn
      if (
        (error.message && error.message.includes('certificate')) ||
        (error.message && error.message.includes('SSL')) ||
        (error.cause &&
          String(error.cause).toLowerCase().includes('certificate'))
      ) {
        score -= 30;
        issues.push('SECURITY RISK (SSL INVALID?)');
      } else {
        // Just a generic fetch failure (timeout, bot block, etc)
        // Penalize less but warn about stability
        score -= 10;
        issues.push('SITE UNSTABLE / BLOCKS BOTS');
      }

      score = Math.max(0, Math.min(100, score));

      if (score < 30) verdict = 'CRITICAL VIBE FAILURE';
      else if (score < 50) verdict = 'NEEDS REFACTOR';
      else if (score < 80) verdict = 'MEDIOCRE AT BEST';
      else verdict = 'ABSOLUTELY SAVAGE';

      return {
        score,
        verdict,
        issues:
          issues.length > 0
            ? issues.slice(0, 3)
            : [
                'NO OBVIOUS FLAWS (SUSPICIOUS)',
                'TOO CLEAN',
                'IMPOSTER SYNDROME?'
              ],
        cta: score < 50 ? 'YOU NEED ME' : 'LETS COLLABORATE'
      };
    } catch (innerError: any) {
      console.error('Audit Error:', innerError);
      return {
        score: 0,
        verdict: 'CONNECTION FAILED',
        issues: [
          'INVALID URL',
          'SERVER UNREACHABLE',
          innerError.message || 'CHECK YOUR URL'
        ],
        cta: 'TRY AGAIN'
      };
    }
  }
});
