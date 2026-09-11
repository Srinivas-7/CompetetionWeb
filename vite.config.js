import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import fs from 'fs';

function vercelApiDevPlugin() {
  return {
    name: 'vercel-api-dev-middleware',
    configureServer(server) {
      server.middlewares.use(async (req, res, next) => {
        if (!req.url || !req.url.startsWith('/api/')) {
          return next();
        }

        const url = new URL(req.url, `http://${req.headers.host || 'localhost:3000'}`);
        const pathname = url.pathname;
        const apiName = pathname.replace(/^\/api\//, '').split('/')[0];

        const candidateFile = path.resolve(process.cwd(), 'api', `${apiName}.ts`);
        const candidateJsFile = path.resolve(process.cwd(), 'api', `${apiName}.js`);
        
        const targetPath = fs.existsSync(candidateFile) 
          ? candidateFile 
          : (fs.existsSync(candidateJsFile) ? candidateJsFile : null);

        if (!targetPath) {
          return next();
        }

        try {
          // Parse request body for methods with payload
          let rawBody = '';
          if (['POST', 'PUT', 'PATCH', 'DELETE'].includes(req.method)) {
            rawBody = await new Promise((resolve, reject) => {
              let accumulated = '';
              req.on('data', chunk => { accumulated += chunk; });
              req.on('end', () => resolve(accumulated));
              req.on('error', reject);
            });
          }

          req.query = Object.fromEntries(url.searchParams.entries());
          if (rawBody) {
            try {
              req.body = JSON.parse(rawBody);
            } catch {
              req.body = rawBody;
            }
          } else {
            req.body = req.body || {};
          }

          // Augment response helpers for Vercel / Express compatibility
          if (!res.status) {
            res.status = function(code) {
              res.statusCode = code;
              return res;
            };
          }

          if (!res.json) {
            res.json = function(data) {
              res.setHeader('Content-Type', 'application/json');
              res.end(JSON.stringify(data));
              return res;
            };
          }

          if (!res.send) {
            res.send = function(data) {
              res.end(data);
              return res;
            };
          }

          const mod = await server.ssrLoadModule(targetPath);
          const handler = mod.default || mod;

          if (typeof handler === 'function') {
            await handler(req, res);
            return;
          } else {
            res.statusCode = 500;
            res.setHeader('Content-Type', 'application/json');
            res.end(JSON.stringify({ success: false, error: 'HANDLER_NOT_A_FUNCTION' }));
            return;
          }
        } catch (err) {
          console.error(`[Vite API Middleware Error] Error processing ${req.url}:`, err);
          if (!res.headersSent) {
            res.statusCode = 500;
            res.setHeader('Content-Type', 'application/json');
            res.end(JSON.stringify({
              success: false,
              error: 'INTERNAL_SERVER_ERROR',
              message: err?.message || String(err)
            }));
          }
        }
      });
    }
  };
}

// Prevent local dev process crash on ADC lookup if service account credentials are not in local env
if (typeof process !== 'undefined') {
  process.on('unhandledRejection', (reason) => {
    if (reason && typeof reason === 'object' && reason.message && (
      reason.message.includes('NO_ADC_FOUND') ||
      reason.message.includes('Could not load the default credentials')
    )) {
      // Graceful local dev warning without terminating Vite process
      console.warn('[Vite API Dev Notice] Local Firebase Admin running without service account key. Endpoint fallback active.');
      return;
    }
    console.warn('[Vite Dev Process Warning] Unhandled Rejection:', reason);
  });
}

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  // Load environment variables (including server-side without VITE_ prefix) into process.env
  const env = loadEnv(mode, process.cwd(), '');
  Object.assign(process.env, env);

  return {
    plugins: [react(), vercelApiDevPlugin()],
    server: {
      port: 3000,
      open: false,
      host: true,
      headers: {
        'Cross-Origin-Opener-Policy': 'same-origin-allow-popups',
      }
    },
    build: {
      outDir: 'dist',
      sourcemap: false
    }
  };
});
