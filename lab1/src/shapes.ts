// Завдання 5.
// Інтерфейс Shape з обчисленням площі та периметру.
// Класи Circle, Rectangle, Triangle реалізують Shape та мають метод scale().

interface Shape {
  getArea(): number;
  getPerimeter(): number;
  scale(factor: number): void;
}

class Circle implements Shape {
  private radius: number;

  constructor(radius: number) {
    this.radius = radius;
  }

  getArea(): number {
    return Math.PI * this.radius ** 2;
  }

  getPerimeter(): number {
    return 2 * Math.PI * this.radius;
  }

  scale(factor: number): void {
    this.radius *= factor;
  }
}

class Rectangle implements Shape {
  private width: number;
  private height: number;

  constructor(width: number, height: number) {
    this.width = width;
    this.height = height;
  }

  getArea(): number {
    return this.width * this.height;
  }

  getPerimeter(): number {
    return 2 * (this.width + this.height);
  }

  scale(factor: number): void {
    this.width *= factor;
    this.height *= factor;
  }
}

class Triangle implements Shape {
  // трикутник заданий трьома сторонами
  private sideA: number;
  private sideB: number;
  private sideC: number;

  constructor(sideA: number, sideB: number, sideC: number) {
    this.sideA = sideA;
    this.sideB = sideB;
    this.sideC = sideC;
  }

  getPerimeter(): number {
    return this.sideA + this.sideB + this.sideC;
  }

  getArea(): number {
    // формула Герона
    const s = this.getPerimeter() / 2;
    return Math.sqrt(s * (s - this.sideA) * (s - this.sideB) * (s - this.sideC));
  }

  scale(factor: number): void {
    this.sideA *= factor;
    this.sideB *= factor;
    this.sideC *= factor;
  }
}

const shapes: Shape[] = [
  new Circle(5),
  new Rectangle(4, 6),
  new Triangle(3, 4, 5),
];

shapes[0].scale(2); // збільшуємо коло вдвічі, для демонстрації методу scale()

let totalArea: number = 0;
let totalPerimeter: number = 0;

for (const shape of shapes) {
  totalArea += shape.getArea();
  totalPerimeter += shape.getPerimeter();
}

console.log("Загальна площа всіх фігур:", totalArea.toFixed(2));
console.log("Загальний периметр всіх фігур:", totalPerimeter.toFixed(2));

export {};
