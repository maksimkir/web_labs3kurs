// Завдання 2.
// Оголошення змінних різних типів (рядок, число, булевий) з типізацією string, number, boolean, any

const userName: string = "Олена";
const userAge: number = 21;
const isStudent: boolean = true;
let dynamicValue: any = "спочатку рядок";

console.log("--- Прості змінні ---");
console.log("userName:", userName);
console.log("userAge:", userAge);
console.log("isStudent:", isStudent);
console.log("dynamicValue:", dynamicValue);

dynamicValue = 42; // тип any дозволяє змінювати тип значення без помилок
console.log("dynamicValue (після зміни):", dynamicValue);

// Масиви з конкретними типами елементів
const fruitNames: string[] = ["яблуко", "банан", "вишня"];
const luckyNumbers: number[] = [3, 7, 13, 21, 42];

console.log("\n--- Масиви ---");
console.log("fruitNames:", fruitNames);
console.log("luckyNumbers:", luckyNumbers);

export {};
