// Завдання 2 (продовження).
// Функція, яка приймає рядок і число, з параметром за замовчуванням для числа.

function describeItem(itemName: string, quantity: number = 1): string {
  return `${itemName} — кількість: ${quantity} шт.`;
}

console.log(describeItem("Зошит", 5));
console.log(describeItem("Ручка")); // quantity не передано, використовується значення за замовчуванням (1)

export {};
