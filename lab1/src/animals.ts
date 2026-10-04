// Завдання 4.
// Інтерфейс, що описує поведінку тварини (властивості, способи пересування).
// Опціональними зроблено ті властивості/методи, які притаманні не всім тваринам
// (наприклад, не всі тварини вміють літати чи плавати).

interface Animal {
  name: string;
  age: number;
  legsCount?: number; // опціонально: не у всіх тварин є ноги (риби)
  walk?(): void; // не всі тварини ходять
  fly?(): void; // не всі тварини літають
  swim?(): void; // не всі тварини плавають
  makeSound(): void; // звук видає майже кожна тварина
}

class Cat implements Animal {
  name: string;
  age: number;
  legsCount: number = 4;

  constructor(name: string, age: number) {
    this.name = name;
    this.age = age;
  }

  walk(): void {
    console.log(`${this.name} тихо йде на чотирьох лапах.`);
  }

  makeSound(): void {
    console.log(`${this.name} каже: Няв!`);
  }
}

class Bird implements Animal {
  name: string;
  age: number;
  legsCount: number = 2;

  constructor(name: string, age: number) {
    this.name = name;
    this.age = age;
  }

  walk(): void {
    console.log(`${this.name} стрибає по землі.`);
  }

  fly(): void {
    console.log(`${this.name} летить у небі.`);
  }

  makeSound(): void {
    console.log(`${this.name} каже: Цвірінь!`);
  }
}

class Fish implements Animal {
  name: string;
  age: number;

  constructor(name: string, age: number) {
    this.name = name;
    this.age = age;
  }

  swim(): void {
    console.log(`${this.name} пливе у воді.`);
  }

  makeSound(): void {
    console.log(`${this.name} мовчить, бо живе під водою.`);
  }
}

const animals: Animal[] = [
  new Cat("Мурчик", 3),
  new Bird("Кеша", 1),
  new Fish("Немо", 2),
];

for (const animal of animals) {
  animal.makeSound();
  animal.walk?.();
  animal.fly?.();
  animal.swim?.();
  console.log("---");
}

export {};
