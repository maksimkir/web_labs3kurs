/** Генерує унікальний id на основі поточного часу (мс з епохи) */
export function generateId(): string {
  return Date.now().toString();
}
