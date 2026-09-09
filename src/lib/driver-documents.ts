/**
 * Catálogo de documentos del conductor.
 *
 * Fuente única para el formulario de /conductor y para /api/driver/documents,
 * que antes tenían dos listas paralelas que había que mantener a mano.
 *
 * IMPORTANTE — los `key` no son libres: son los `doc_key` que ya viven en la
 * tabla `driver_documents` de Supabase, escritos por la app móvil y el backend
 * de app.urbont.com. Por eso algunos no coinciden con su etiqueta (`tncPermit`
 * se muestra como "Chauffeur License", `corpFiles` como "Corporation
 * Certificate"): renombrarlos dejaría huérfanos los documentos ya subidos.
 *
 * Sólo `businessTaxes` y `backgroundCheck` son claves nuevas, sin filas previas.
 * `defensiveDriving` existe en producción pero ya no se pide.
 */

export const DOC_CATEGORIES = [
  "Personal Identity",
  "Vehicle Documents",
  "Professional Credentials",
  "Legal & Compliance",
] as const;

export type DocCategory = (typeof DOC_CATEGORIES)[number];

export interface DocDef {
  /** `doc_key` en driver_documents. No cambiar sin migrar los datos. */
  key: string;
  label: string;
  hint: string;
  category: DocCategory;
}

export const DOCS_DEF: readonly DocDef[] = [
  { key: "license",             label: "Driver's License",                   hint: "Front & back, clearly visible",              category: "Personal Identity" },
  { key: "photo",               label: "Profile Photo",                      hint: "Professional headshot, no sunglasses",       category: "Personal Identity" },
  { key: "bgCheck",             label: "Background Check Consent",           hint: "Signed authorization form",                  category: "Personal Identity" },
  { key: "registration",        label: "Vehicle Registration",               hint: "Proof of ownership, must match vehicle",     category: "Vehicle Documents" },
  { key: "insurance",           label: "Auto Insurance Identification Card", hint: "Current card, FL state minimum",             category: "Vehicle Documents" },
  { key: "commercialInsurance", label: "Commercial Auto Insurance",          hint: "Required for TNC operations in FL",          category: "Vehicle Documents" },
  { key: "inspection",          label: "Vehicle Inspection",                 hint: "Annual safety inspection certificate",       category: "Vehicle Documents" },
  { key: "airportPermit",       label: "Miami-Dade Airport Permit",          hint: "Required to pick up at MIA",                 category: "Vehicle Documents" },
  { key: "portPermit",          label: "Port of Miami Permit",               hint: "Required to pick up at PortMiami",           category: "Vehicle Documents" },
  { key: "limoPermit",          label: "Miami-Dade Limousine Sticker",       hint: "Current county limousine decal",             category: "Vehicle Documents" },
  { key: "tncPermit",           label: "Chauffeur License",                  hint: "Miami-Dade County, current",                 category: "Professional Credentials" },
  { key: "w9",                  label: "Tax Form W-9",                       hint: "Required for IRS reporting",                 category: "Legal & Compliance" },
  { key: "businessTaxes",       label: "Local Business Taxes",               hint: "Most recent business tax return",            category: "Legal & Compliance" },
  { key: "corpFiles",           label: "Corporation Certificate",            hint: "Certificate of incorporation",               category: "Legal & Compliance" },
  { key: "taxId",               label: "Corporation Tax ID",                 hint: "EIN confirmation letter from the IRS",       category: "Legal & Compliance" },
  { key: "drugTest",            label: "Drug Test Results",                  hint: "FMCSA 10-panel test, within 30 days",        category: "Legal & Compliance" },
  { key: "backgroundCheck",     label: "Background Check",                   hint: "Completed report from an approved provider", category: "Legal & Compliance" },
] as const;

const DOC_KEYS = new Set(DOCS_DEF.map((d) => d.key));

/** Bucket público donde ya viven los documentos existentes. */
export const DOCS_BUCKET = "chauffeur-docs";

export function isDocKey(value: unknown): value is string {
  return typeof value === "string" && DOC_KEYS.has(value);
}

export const DOC_KEY_LIST = DOCS_DEF.map((d) => d.key);
