// Завдання 7.
// Абстрактний клас Employee, класи Developer та Manager, інтерфейс Payable.

interface Payable {
  pay(): void;
}

abstract class Employee {
  protected name: string;
  protected age: number;
  protected salary: number;

  constructor(name: string, age: number, salary: number) {
    this.name = name;
    this.age = age;
    this.salary = salary;
  }

  abstract getAnnualBonus(): number;
}

class Developer extends Employee implements Payable {
  private programmingLanguage: string;

  constructor(name: string, age: number, salary: number, programmingLanguage: string) {
    super(name, age, salary);
    this.programmingLanguage = programmingLanguage;
  }

  getAnnualBonus(): number {
    return this.salary * 12 * 0.1;
  }

  pay(): void {
    console.log(
      `Виплата розробнику ${this.name} (${this.programmingLanguage}): ${this.salary} грн.`
    );
  }
}

class Manager extends Employee implements Payable {
  private teamSize: number;

  constructor(name: string, age: number, salary: number, teamSize: number) {
    super(name, age, salary);
    this.teamSize = teamSize;
  }

  getAnnualBonus(): number {
    return this.salary * 12 * 0.2;
  }

  pay(): void {
    console.log(
      `Виплата менеджеру ${this.name} (команда: ${this.teamSize} осіб): ${this.salary} грн.`
    );
  }
}

const employees: Employee[] = [
  new Developer("Іван Коваль", 28, 35000, "TypeScript"),
  new Developer("Марія Бондар", 25, 32000, "Python"),
  new Manager("Олег Шевченко", 35, 45000, 8),
];

let totalAnnualBonus: number = 0;

for (const employee of employees) {
  totalAnnualBonus += employee.getAnnualBonus();
  if ("pay" in employee) {
    (employee as unknown as Payable).pay();
  }
}

console.log("Загальна річна сума бонусів для всіх співробітників:", totalAnnualBonus.toFixed(2), "грн.");

export {};
