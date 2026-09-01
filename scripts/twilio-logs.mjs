#!/usr/bin/env node
/**
 * Lista los últimos SMS enviados desde la cuenta Twilio configurada en .env.local
 * Uso: npm run twilio:logs
 */

import { readFileSync, existsSync } from "fs";
import { resolve, dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const envPath = resolve(__dirname, "../.env.local");

function loadEnvFile(path) {
  if (!existsSync(path)) return;
  for (const line of readFileSync(path, "utf8").split("\n")) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) continue;
    const eq = trimmed.indexOf("=");
    if (eq === -1) continue;
    const key = trimmed.slice(0, eq).trim();
    let val = trimmed.slice(eq + 1).trim();
    if ((val.startsWith('"') && val.endsWith('"')) || (val.startsWith("'") && val.endsWith("'"))) {
      val = val.slice(1, -1);
    }
    if (!process.env[key]) process.env[key] = val;
  }
}

function maskPhone(p) {
  if (!p || p.length < 6) return p ?? "";
  return `${p.slice(0, 3)}***${p.slice(-4)}`;
}

loadEnvFile(envPath);

const sid = process.env.TWILIO_ACCOUNT_SID?.trim();
const token = process.env.TWILIO_AUTH_TOKEN?.trim();
const from = process.env.TWILIO_PHONE_NUMBER?.trim();

if (!sid || !token) {
  console.error("❌ Faltan TWILIO_ACCOUNT_SID o TWILIO_AUTH_TOKEN en .env.local");
  process.exit(1);
}

const limit = Number(process.env.TWILIO_LOG_LIMIT ?? 15);
const url = `https://api.twilio.com/2010-04-01/Accounts/${sid}/Messages.json?PageSize=${limit}`;
const creds = Buffer.from(`${sid}:${token}`).toString("base64");

const res = await fetch(url, {
  headers: { Authorization: `Basic ${creds}` },
});

const data = await res.json();

if (!res.ok) {
  console.error("❌ Twilio API error:", data.message ?? res.status);
  process.exit(1);
}

const messages = data.messages ?? [];

console.log(`\n📱 Últimos ${messages.length} mensajes Twilio (from: ${maskPhone(from)})\n`);

if (messages.length === 0) {
  console.log("   (ninguno — Twilio no tiene SMS recientes en esta cuenta)\n");
  process.exit(0);
}

for (const m of messages) {
  const when = m.date_sent ?? m.date_created ?? "?";
  const status = m.status ?? "?";
  const err = m.error_message ? ` | error: ${m.error_code} ${m.error_message}` : "";
  const body = (m.body ?? "").replace(/\d{6}/, "******");
  console.log(`  ${when}`);
  console.log(`    ${maskPhone(m.from)} → ${maskPhone(m.to)}`);
  console.log(`    status: ${status}${err}`);
  console.log(`    sid: ${m.sid}`);
  console.log(`    body: ${body.slice(0, 80)}${body.length > 80 ? "…" : ""}`);
  console.log();
}

const failed = messages.filter((m) => ["failed", "undelivered", "canceled"].includes(m.status));
if (failed.length) {
  console.log(`⚠️  ${failed.length} mensaje(s) con fallo de entrega — revisa Geo Permissions y números verificados (trial).\n`);
}
