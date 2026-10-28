const pad = (value: number) => String(value).padStart(2, '0');

export const linesToList = (text: string) =>
  text
    .split('\n')
    .map((line) => line.trim())
    .filter(Boolean);

export function linesToSpecs(text: string) {
  const specs: Record<string, string> = {};
  for (const line of linesToList(text)) {
    const index = line.indexOf(':');
    if (index > 0)
      specs[line.slice(0, index).trim()] = line.slice(index + 1).trim();
  }
  return specs;
}

export const specsToLines = (specs: Record<string, string>) =>
  Object.entries(specs)
    .map(([key, value]) => `${key}: ${value}`)
    .join('\n');

export function numberOrUndefined(value: FormDataEntryValue | null) {
  const text = String(value ?? '').trim();
  return text === '' ? undefined : Number(text);
}

export function toLocalInput(iso: string) {
  const date = new Date(iso);
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}T${pad(
    date.getHours(),
  )}:${pad(date.getMinutes())}`;
}

export function fromLocalInput(value: FormDataEntryValue | null) {
  const text = String(value ?? '').trim();
  return text === '' ? undefined : new Date(text).toISOString();
}

export function fieldErrorsOf(
  details: unknown,
): Record<string, string | undefined> {
  const raw =
    (
      details as
        { fieldErrors?: Record<string, string[] | undefined> } | undefined
    )?.fieldErrors ?? {};
  return Object.fromEntries(
    Object.entries(raw).map(([key, messages]) => [key, messages?.[0]]),
  );
}
