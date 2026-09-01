/** Quita espacios, guiones, paréntesis, etc. y devuelve formato E.164 (+17864165121). */
export function normalizePhone(phone: string): string {
  const digits = phone.trim().replace(/\D/g, "");
  if (!digits) return "";
  return `+${digits}`;
}

/** Formato E.164: + seguido de 7–15 dígitos (ITU-T). */
export function isValidPhone(phone: string): boolean {
  return /^\+[1-9]\d{6,14}$/.test(phone);
}

export function parsePhone(phone: string): string | null {
  const normalized = normalizePhone(phone);
  return isValidPhone(normalized) ? normalized : null;
}
