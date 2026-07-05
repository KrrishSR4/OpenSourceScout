# Monitoring Configurations

This directory contains observability and SRE monitoring configurations for the OpenSource Scout backend.

---

## 1. How to Test Endpoints Locally

Start the backend server in development mode:
```bash
cd server
npm run dev
```

You can verify the following endpoints:

* **Liveness Check**: `http://localhost:5000/live`
  - Returns `200 OK` showing that the Node process is running.
* **Readiness Check**: `http://localhost:5000/ready`
  - Returns `200 OK` (READY) if both Database (Prisma) and Cache (Redis) connections are UP. Otherwise returns `503 Service Unavailable` with details of failed checks.
* **Health Check**: `http://localhost:5000/health`
  - Returns overall system health (API, DB, Redis, CPU, memory, uptime).
* **Prometheus Metrics**: `http://localhost:5000/metrics`
  - Serves raw metrics data parsed by `prom-client` (e.g., `http_requests_total`, `github_requests_total`, `cache_hits_total`, garbage collection stats, memory metrics).

---

## 2. Setting Up Prometheus (Local Scraping)

To scrape these metrics into Prometheus:

1. Download and install [Prometheus](https://prometheus.io/download/).
2. Add the backend endpoint as a scrape target in your `prometheus.yml`:
   ```yaml
   scrape_configs:
     - job_name: 'opensource-scout-backend'
       scrape_interval: 5s
       metrics_path: '/metrics'
       static_configs:
         - targets: ['localhost:5000']
   ```
3. Start Prometheus:
   ```bash
   ./prometheus --config.file=prometheus.yml
   ```

---

## 3. Setting Up Grafana Dashboard

To visualize the metrics:

1. Run [Grafana](https://grafana.com/) locally (default port is `3000`).
2. Go to **Connections > Data Sources** and add **Prometheus** as a data source pointing to your Prometheus server (usually `http://localhost:9090`).
3. Go to **Dashboards > New > Import**.
4. Upload or copy-paste the contents of [`monitoring/grafana/dashboard.json`](file:///k:/OpenSourceScout/monitoring/grafana/dashboard.json).
5. Select the Prometheus data source and click **Import**.

This dashboard will display:
* **HTTP Request Volume (Rate)**: Rate of request volume split by method and route path.
* **HTTP Error Rate (%)**: Error rate percentage (HTTP status >= 400).
* **Average Request Latency (ms)**: Average request latency.
* **Cache Hit Ratio (%)**: Cache hit vs miss performance from Redis.

