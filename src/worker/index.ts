/**
 * İzgeTour — Worker giriş noktası (cron scheduler).
 *
 * - Başlangıçta 1 kez çalıştırır (cold start'ta cache dolsun).
 * - Ardından her 6 saatte bir tekrar çeker.
 *
 * Çalıştırma: npm run worker   (tsx src/worker/index.ts)
 * Docker'da ayrı worker container'ı olarak sürekli ayakta kalır.
 */
import cron from 'node-cron';
import { runFetchRoutes } from './fetchRoutes';

// Her 6 saatte bir: dakika 0, saat 0/6/12/18
const CRON_SCHEDULE = process.env.WORKER_CRON || '0 */6 * * *';

let running = false;

async function tick(trigger: string): Promise<void> {
  if (running) {
    console.warn(`[worker] önceki çalışma sürüyor, ${trigger} atlandı.`);
    return;
  }
  running = true;
  const started = Date.now();
  console.log(`[worker] çalışma başladı (${trigger}) — ${new Date().toISOString()}`);
  try {
    await runFetchRoutes();
  } catch (err) {
    console.error('[worker] çalışma hatası:', err);
  } finally {
    running = false;
    console.log(`[worker] çalışma bitti (${trigger}) — ${Date.now() - started}ms`);
  }
}

function main(): void {
  console.log(`[worker] scheduler başlatılıyor. Cron: "${CRON_SCHEDULE}"`);

  if (!cron.validate(CRON_SCHEDULE)) {
    console.error(`[worker] geçersiz cron ifadesi: ${CRON_SCHEDULE}`);
    process.exit(1);
  }

  // Zamanlanmış çalışmalar
  cron.schedule(CRON_SCHEDULE, () => {
    void tick('cron');
  });

  // Cold start: hemen bir kez çalıştır
  void tick('startup');

  // Süreci ayakta tut
  process.on('SIGINT', () => {
    console.log('[worker] SIGINT — kapatılıyor.');
    process.exit(0);
  });
  process.on('SIGTERM', () => {
    console.log('[worker] SIGTERM — kapatılıyor.');
    process.exit(0);
  });
}

main();
