require('dotenv').config();
const { InfluxDB, Point } = require('@influxdata/influxdb-client');

// Initialize a fresh client specifically for this heavy batch job
const client = new InfluxDB({ url: 'http://localhost:8086', token: process.env.INFLUX_TOKEN });
const writeApi = client.getWriteApi(process.env.INFLUX_ORG, process.env.INFLUX_BUCKET, 'ms');

const DAYS_TO_GENERATE = 7;
const now = Date.now();
const startTime = now - (DAYS_TO_GENERATE * 24 * 60 * 60 * 1000);

let pointCount = 0;

console.log("Initiating Chaos Generator: Synthesizing 7 days of telemetry...");

// Loop through every single minute of the last 7 days
for (let currentMs = startTime; currentMs < now; currentMs += 60000) { 
    const date = new Date(currentMs);
    const hour = date.getHours();

    // 1. THE MATH: Simulate a natural daily server load using a Sine Wave
    // Peaks around noon, dips during the night
    const timeOfDayFactor = Math.sin((hour / 24) * Math.PI * 2 - (Math.PI / 2)) * 0.5 + 0.5;

    // 2. THE NOISE: Add Gaussian-style randomness so the Neural Network has to work for it
    const noise = (Math.random() * 0.2) - 0.1;

    let responseTime = Math.max(50, 100 * timeOfDayFactor + (100 * noise));
    
    // 3. THE ANOMALIES: 0.5% chance of a massive system failure
    let isAnomaly = Math.random() < 0.005; 

    if (isAnomaly) {
        // Latency spikes violently to 1000ms - 2500ms
        responseTime = Math.random() * 1500 + 1000; 
    }

    // --- Generate the Metric ---
    const metricPoint = new Point('metrics')
        .tag('service', 'payment-api')
        .tag('name', 'response_time')
        .tag('environment', 'production')
        .tag('unit', 'ms')
        .floatField('value', responseTime)
        .timestamp(date); // We explicitly backdate it here!

    writeApi.writePoint(metricPoint);

    // --- Generate the Log ---
    let level = 'info';
    let msg = 'User transaction processed successfully';

    if (isAnomaly) {
        // If the server is spiking, force a critical error log
        level = 'error';
        msg = 'FATAL: Database connection pool exhausted';
    } else {
        // Standard 90/8/2 distribution
        const rand = Math.random();
        if (rand > 0.98) {
            level = 'error';
            msg = 'Payment gateway timeout';
        } else if (rand > 0.90) {
            level = 'warn';
            msg = 'High memory usage detected';
        }
    }

    const logPoint = new Point('logs')
        .tag('service', 'payment-api')
        .tag('level', level)
        .tag('environment', 'production')
        .stringField('message', msg)
        .timestamp(date);

    writeApi.writePoint(logPoint);
    pointCount += 2;

    if (pointCount % 5000 === 0) {
        console.log(`Generated ${pointCount} data points...`);
    }
}

// Flush all 20,000+ points to the database in a massive batch
writeApi.close().then(() => {
    console.log(`\nSUCCESS: ${pointCount} historical logs and metrics injected into InfluxDB.`);
    console.log("The dataset is primed for the Autoencoder.");
}).catch(err => {
    console.error("Failed to inject data:", err);
});