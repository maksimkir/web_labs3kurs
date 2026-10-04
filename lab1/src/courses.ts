// Завдання 8.
// Інтерфейс Course, клас OnlineCourse, клас CourseManager.

interface Course {
  title: string;
  durationHours: number;
  students: string[];
}

class OnlineCourse implements Course {
  title: string;
  durationHours: number;
  students: string[];

  constructor(title: string, durationHours: number) {
    this.title = title;
    this.durationHours = durationHours;
    this.students = [];
  }

  registerStudent(student: string): void {
    if (this.isStudentRegistered(student)) {
      console.log(`${student} вже зареєстрований на курс "${this.title}".`);
      return;
    }
    this.students.push(student);
  }

  isStudentRegistered(student: string): boolean {
    return this.students.includes(student);
  }
}

class CourseManager {
  private courses: Course[] = [];

  addCourse(course: Course): void {
    this.courses.push(course);
  }

  removeCourse(courseName: string): void {
    this.courses = this.courses.filter((course) => course.title !== courseName);
  }

  findCourse(courseName: string): Course | undefined {
    return this.courses.find((course) => course.title === courseName);
  }

  printAllCourses(): void {
    for (const course of this.courses) {
      console.log(
        `Курс: "${course.title}" (${course.durationHours} год.) — студенти: ${
          course.students.length > 0 ? course.students.join(", ") : "немає зареєстрованих"
        }`
      );
    }
  }
}

const tsCourse = new OnlineCourse("TypeScript з нуля", 20);
const jsCourse = new OnlineCourse("JavaScript Advanced", 30);
const uiCourse = new OnlineCourse("UI/UX дизайн", 15);

const manager = new CourseManager();
manager.addCourse(tsCourse);
manager.addCourse(jsCourse);
manager.addCourse(uiCourse);

tsCourse.registerStudent("Андрій");
tsCourse.registerStudent("Оксана");
jsCourse.registerStudent("Андрій");
uiCourse.registerStudent("Тетяна");

console.log("Список курсів:");
manager.printAllCourses();

console.log("\nПошук курсу 'JavaScript Advanced':", manager.findCourse("JavaScript Advanced"));

manager.removeCourse("UI/UX дизайн");
console.log("\nПісля видалення курсу 'UI/UX дизайн':");
manager.printAllCourses();

export {};
