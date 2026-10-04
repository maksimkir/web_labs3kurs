// Завдання 6.
// Абстрактний батьківський клас Car та 3 похідні класи (марки авто) із super().
// Властивості: public - доступні ззовні (напр. модель), private - лише всередині
// класу (напр. серійний номер двигуна), protected - доступні класу та нащадкам
// (напр. базова інформація про виробника, яку може використати похідний клас).

abstract class Car {
  public brand: string;
  protected productionYear: number;
  private vin: string; // унікальний ідентифікаційний номер, приватний для кожного авто

  constructor(brand: string, productionYear: number, vin: string) {
    this.brand = brand;
    this.productionYear = productionYear;
    this.vin = vin;
  }

  protected getVin(): string {
    return this.vin;
  }

  abstract describe(): void;
}

class Toyota extends Car {
  public model: string;
  private fuelType: string;

  constructor(model: string, productionYear: number, vin: string, fuelType: string) {
    super("Toyota", productionYear, vin);
    this.model = model;
    this.fuelType = fuelType;
  }

  describe(): void {
    console.log(
      `${this.brand} ${this.model}, рік випуску: ${this.productionYear}, паливо: ${this.fuelType}, VIN: ${this.getVin()}`
    );
  }
}

class BMW extends Car {
  public model: string;
  protected enginePower: number; // потужність двигуна (к.с.)

  constructor(model: string, productionYear: number, vin: string, enginePower: number) {
    super("BMW", productionYear, vin);
    this.model = model;
    this.enginePower = enginePower;
  }

  describe(): void {
    console.log(
      `${this.brand} ${this.model}, рік випуску: ${this.productionYear}, потужність: ${this.enginePower} к.с., VIN: ${this.getVin()}`
    );
  }
}

class Tesla extends Car {
  public model: string;
  private batteryCapacityKwh: number;

  constructor(model: string, productionYear: number, vin: string, batteryCapacityKwh: number) {
    super("Tesla", productionYear, vin);
    this.model = model;
    this.batteryCapacityKwh = batteryCapacityKwh;
  }

  describe(): void {
    console.log(
      `${this.brand} ${this.model}, рік випуску: ${this.productionYear}, батарея: ${this.batteryCapacityKwh} кВт·год, VIN: ${this.getVin()}`
    );
  }
}

const cars: Car[] = [
  new Toyota("Corolla", 2021, "TY001", "бензин"),
  new Toyota("Camry", 2023, "TY002", "гібрид"),
  new BMW("X5", 2022, "BM001", 340),
  new BMW("330i", 2020, "BM002", 258),
  new Tesla("Model 3", 2023, "TS001", 60),
  new Tesla("Model Y", 2024, "TS002", 75),
];

for (const car of cars) {
  car.describe();
}

export {};
