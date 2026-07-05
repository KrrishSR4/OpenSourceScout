import client from 'prom-client';

// Create a custom Prometheus Registry
export const register = new client.Registry();

// Enable the collection of default Node.js runtime metrics (CPU, Memory, etc.)
client.collectDefaultMetrics({ register });

// 1. Request Counter
export const httpRequestsTotal = new client.Counter({
  name: 'http_requests_total',
  help: 'Total number of HTTP requests',
  labelNames: ['method', 'route', 'status_code'],
});
register.registerMetric(httpRequestsTotal);

// 2. Response Time Histogram
export const httpRequestDurationMs = new client.Histogram({
  name: 'http_request_duration_ms',
  help: 'Duration of HTTP requests in milliseconds',
  labelNames: ['method', 'route', 'status_code'],
  buckets: [5, 10, 25, 50, 100, 250, 500, 1000, 2500, 5000, 10000],
});
register.registerMetric(httpRequestDurationMs);

// 3. Error Counter
export const httpErrorsTotal = new client.Counter({
  name: 'http_errors_total',
  help: 'Total number of HTTP errors (status code >= 400)',
  labelNames: ['method', 'route', 'status_code'],
});
register.registerMetric(httpErrorsTotal);

// 4. Cache Metrics
export const cacheHitsTotal = new client.Counter({
  name: 'cache_hits_total',
  help: 'Total number of cache hits in Upstash Redis',
});
register.registerMetric(cacheHitsTotal);

export const cacheMissesTotal = new client.Counter({
  name: 'cache_misses_total',
  help: 'Total number of cache misses in Upstash Redis',
});
register.registerMetric(cacheMissesTotal);

// 5. GitHub API Metrics
export const githubRequestsTotal = new client.Counter({
  name: 'github_requests_total',
  help: 'Total number of outgoing GitHub API requests',
  labelNames: ['url', 'method'],
});
register.registerMetric(githubRequestsTotal);

export const githubErrorsTotal = new client.Counter({
  name: 'github_errors_total',
  help: 'Total number of outgoing GitHub API errors',
  labelNames: ['url', 'method', 'error'],
});
register.registerMetric(githubErrorsTotal);
