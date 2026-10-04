// Завдання 3.
// Розрахунок вартості морозива.
// Розміри: маленький стаканчик (10 грн), великий стаканчик (25 грн)
// Начинки (мінімум одна): шоколад (+5 грн), карамель (+6 грн), ягоди (+10 грн)
// Додатково (не обов'язково): маршмелоу (+5 грн)
//
// Дані користувач вводить через prompt. У Node.js браузерного prompt() немає,
// тому використано пакет readline-sync, який реалізує синхронний ввід у консолі
// за тим самим принципом (питання -> відповідь користувача).

import * as readlineSync from "readline-sync";

type IceCreamSize = "маленький" | "великий";
type Topping = "шоколад" | "карамель" | "ягоди";

interface SizePrice {
  [key: string]: number;
}

const sizePrices: SizePrice = {
  маленький: 10,
  великий: 25,
};

const toppingPrices: SizePrice = {
  шоколад: 5,
  карамель: 6,
  ягоди: 10,
};

const MARSHMALLOW_PRICE: number = 5;

function calculateIceCreamPrice(
  size: IceCreamSize,
  toppings: Topping[],
  withMarshmallow: boolean
): number {
  if (toppings.length === 0) {
    throw new Error("Потрібно обрати хоча б одну начинку.");
  }

  let total: number = sizePrices[size];

  for (const topping of toppings) {
    total += toppingPrices[topping];
  }

  if (withMarshmallow) {
    total += MARSHMALLOW_PRICE;
  }

  return total;
}

function askIceCreamOrder(): void {
  console.log("=== Замовлення морозива ===");

  const sizeInput = readlineSync
    .question("Оберіть розмір (маленький/великий): ")
    .trim()
    .toLowerCase() as IceCreamSize;

  const toppingsInput = readlineSync
    .question("Оберіть начинки через кому (шоколад, карамель, ягоди): ")
    .trim()
    .toLowerCase();

  const toppings: Topping[] = toppingsInput
    .split(",")
    .map((t) => t.trim())
    .filter((t) => t.length > 0) as Topping[];

  const marshmallowInput = readlineSync
    .question("Додати маршмелоу? (так/ні): ")
    .trim()
    .toLowerCase();

  const withMarshmallow: boolean = marshmallowInput === "так";

  try {
    const price = calculateIceCreamPrice(sizeInput, toppings, withMarshmallow);
    console.log(`\nВаше морозиво (${sizeInput}, начинки: ${toppings.join(", ")}${withMarshmallow ? ", маршмелоу" : ""}) коштує ${price} грн.`);
  } catch (error) {
    if (error instanceof Error) {
      console.log("Помилка:", error.message);
    }
  }
}

askIceCreamOrder();

export {};
