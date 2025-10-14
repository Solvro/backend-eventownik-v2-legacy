import { DateTime } from "luxon";

export function parseToUtc(input: unknown): Date {
  if (input instanceof Date) {
    return DateTime.fromJSDate(input, { zone: "utc" }).toJSDate();
  }

  if (typeof input === "string") {
    const hasOffsetOrZ = /([zZ]|[-+]\d{2}:?\d{2})$/.test(input);
    const dt = hasOffsetOrZ
      ? DateTime.fromISO(input, { setZone: true })
      : DateTime.fromISO(input, { zone: "Europe/Warsaw" });

    if (dt.isValid) {
      return dt.toUTC().toJSDate();
    }
  }

  if (typeof input === "number" && Number.isFinite(input)) {
    return DateTime.fromJSDate(new Date(input), { zone: "utc" }).toJSDate();
  }

  return DateTime.utc().toJSDate();
}

export function serializeWarsawIsoNoOffset(dt: DateTime | null): string | null {
  if (dt === null) {
    return null;
  }
  const iso = dt.setZone("Europe/Warsaw").toISO({ includeOffset: false });
  return iso ?? null;
}
