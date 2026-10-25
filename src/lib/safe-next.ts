export function safeNext(value?: string) {
  return value && value.startsWith('/') && !value.startsWith('//')
    ? value
    : '/';
}
