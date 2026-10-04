# Лабораторна робота №2 — Система управління бібліотекою

Клієнтський застосунок на TypeScript (без фреймворків) для обліку книг і
користувачів бібліотеки: додавання, позичання/повернення книг, пошук,
пагінація, валідація форм і збереження стану в LocalStorage.

## Що реалізовано

- **Класи та інтерфейси**: `Book`/`IBook`, `User`/`IUser` (`src/models`).
- **Generics**: `Library<T extends Identifiable>` (`src/services/Library.ts`) —
  один клас керує і колекцією книг, і колекцією користувачів.
- **Namespace**: `Validation` (`src/utils/validators.ts`) — валідація
  обов'язкових полів, року видання (regex), числового ID, email.
- **Модулі**: код розбитий на `models/`, `services/`, `utils/`, `ui/`, `types/`
  за шарами відповідальності (див. дерево нижче).
- **UI без декларативної розмітки**: `index.html` містить лише
  `<div id="app"></div>`, весь DOM генерується в `src/ui/*` через
  `document.createElement`.
- **Позичання/повернення**: ліміт 3 книги на користувача, модальні вікна
  замість `alert()` (`src/services/NotificationService.ts`,
  `src/ui/components/Modal.ts`).
- **Валідація форм**: обов'язкові поля, регулярка на рік, регулярка на
  числовий ID — з виводом помилок клієнту під полем.
- **LocalStorage**: `Storage<T>` — збереження/завантаження/очищення;
  дані переживають перезавантаження сторінки.
- **Пошук і пагінація**: пошук книг за назвою/автором;
  пагінація по 5 елементів, якщо книг > 40.
- **Видалення** книг і користувачів.
- **ESLint + Prettier**: `.eslintrc.json`, `.prettierrc`, лінтер налаштований
  під TypeScript, правила Prettier узгоджені через `eslint-config-prettier`.
- **Husky pre-commit**: `.husky/pre-commit` запускає ESLint і Mocha-тести
  перед кожним комітом.
- **Юніт-тести (Mocha + Chai)**: `tests/library.test.ts` (5 тестів для
  `Library<T>`), `tests/validation.test.ts` (11 тестів для `Validation`).
  Усі 16 тестів проходять (`npm test`).
- **Webpack**: `webpack.config.js` — entry/output, `ts-loader`, обробка
  `.scss`/`.css`, `devServer` на порту 9000, `html-webpack-plugin`.

Проєкт зібрано і перевірено локально: `npx tsc --noEmit`, `npm run lint`,
`npm test` та `npm run build` виконуються без помилок.

## Встановлення та запуск

```bash
npm install
npm start      # dev-сервер на http://localhost:9000
npm run build  # продакшн-збірка у dist/
npm run lint   # ESLint
npm test       # Mocha + Chai
```

## Структура проєкту

```
lab-app/
├── src/
│   ├── models/            # Book, User + interfaces/ (IBook, IUser)
│   ├── services/           # Library<T>, Storage<T>, NotificationService
│   ├── utils/               # namespace Validation, generateId
│   ├── ui/                  # render.ts + components/ (BookForm, UserForm,
│   │                        #   BookList, UserList, Modal) — весь DOM-код
│   ├── types/               # спільні типи, enum ModalType, APP_CONFIG
│   ├── styles/main.scss
│   └── index.ts             # точка входу
├── tests/                   # library.test.ts, validation.test.ts
├── index.html                # лише <div id="app">
├── webpack.config.js
├── tsconfig.json / tsconfig.eslint.json
├── .eslintrc.json / .prettierrc
├── .husky/pre-commit
└── package.json
```

## Що студенту потрібно доробити самостійно

Ці пункти вимагають дій з вашим особистим GitHub-акаунтом і не можуть бути
виконані автоматично:

1. **Створити власний приватний/публічний GitHub-репозиторій** і залити цей
   код (`git init`, `git remote add origin ...`, `git push`).
2. **Feature branch workflow**: створювати окрему гілку під кожну задачу
   (`feature/library-service`, `feature/validation`, `feature/ui` тощо),
   мержити через Pull Request.
3. **Conventional Commits**: комітити з префіксами `feat:`, `fix:`, `test:`,
   `chore:`, `docs:` і т.д. — `git commit -m "feat: add Library generic
   service"`.
4. **Гілка `vite-migration`**: створити окрему гілку, видалити
   `webpack.config.js` та webpack-залежності, налаштувати `vite.config.ts`
   (dev-сервер, збірка, обробка TS і стилів UI-фреймворку) так, щоб
   застосунок працював ідентично до webpack-версії.
5. **Деплой на GitHub Pages** обох варіантів (або фінальної гілки) —
   `npm run build` + `gh-pages` пакет або GitHub Actions workflow.
6. **Порівняння webpack vs Vite** — після міграції додайте до цього README
   висновок за пунктами: швидкість старту dev-сервера, HMR, час і складність
   налаштування конфігурації, розмір і швидкість продакшн-збірки, зручність
   підключення UI-фреймворку та TS-лоадерів, екосистема плагінів,
   суб'єктивна оцінка зручності для невеликого SPA.
7. `npx husky install` потрібно виконати після `git init`, щоб git-хук
   `.husky/pre-commit` активувався (в цьому середовищі `.git` відсутній,
   тому хук зараз не підключений автоматично).

## Відповіді на контрольні питання (чернетка для звіту)

1. **TypeScript vs JavaScript**: статична типізація ловить помилки на етапі
   компіляції (невірні типи аргументів, відсутні поля), покращує
   автодоповнення в IDE, робить рефакторинг великого коду безпечнішим і
   документує контракти функцій/класів без окремих коментарів.
2. **Клас vs інтерфейс**: клас містить реалізацію (поля + методи) і створює
   екземпляри під час виконання; інтерфейс — лише контракт форми об'єкта, не
   компілюється в JS. Інтерфейс варто використовувати, коли потрібно описати
   форму даних без прив'язки до конкретної реалізації — наприклад, `IBook`
   описує, що має книга, а `Book` та потенційно інший клас (наприклад,
   `EBook`) можуть його по-різному реалізовувати.
3. **Generics**: дозволяють писати клас/функцію, що працює з будь-яким типом,
   зберігаючи типобезпеку. Без generic `Library` довелося б дублювати
   однаковий CRUD-код окремо для `Book[]` і `User[]`, або втратити типізацію,
   звівши все до `any[]`.
4. **Модулі vs namespaces**: ES-модулі (`import`/`export`) — стандартний
   спосіб розділення коду на файли з явними залежностями, підтримується
   бандлерами і tree-shaking. `namespace` групує пов'язаний код всередині
   одного логічного простору імен без окремого файлу-модуля; доречний для
   невеликих наборів чистих допоміжних функцій (як `Validation`), які не
   мають сенсу як окремий клас чи повноцінний модуль.
5. **Модульна структура (`models/services/utils`)**: `models` — чисті дані
   й типи, не знають про UI чи сховище; `services` — бізнес-логіка
   (Library, Storage, сповіщення), не працюють з DOM; `utils` — чисті
   допоміжні функції; `ui` — єдиний шар, що працює з DOM. Такий поділ
   спрощує тестування (сервіси й utils тестуються без браузера) і зменшує
   зв'язність між шарами.
6. **Storage і LocalStorage**: `Storage<T>` серіалізує масив у JSON і
   зберігає під одним ключем через `localStorage.setItem/getItem/removeItem`.
   Обмеження LocalStorage: синхронний API (блокує потік), ліміт ~5-10 МБ на
   домен, зберігає лише рядки, дані видимі й редаговані користувачем через
   DevTools, немає індексів/запитів як у БД.
7. **Позичання/повернення**: `borrow()` встановлює `isBorrowed = true` та
   `borrowedBy = userId`; `returnBook()` скидає обидва поля. У UI кнопка
   змінюється з "Позичити" (синя) на "Повернути" (жовта) залежно від стану
   `isBorrowed`.
8. **Валідація форм**: обов'язкові поля перевіряються через
   `Validation.required`, рік — регуляркою `/^(1[0-9]{3}|20[0-9]{2})$/`, ID
   користувача — `/^[0-9]+$/`. Помилки виводяться під відповідним полем
   червоним текстом, форма не сабмітиться, поки всі поля не валідні.
9. **Ліміт книг**: `user.canBorrow(maxBooks)` перевіряє
   `borrowedBooksCount < maxBooks` (ліміт = 3 у `APP_CONFIG`). Якщо ліміт
   перевищено — модальне вікно з повідомленням, позичання скасовується.
10. **Чому заборонена розмітка в index.html**: щоб студент практикував
    програмну побудову DOM (DOM API), а не готову HTML-структуру; весь
    інтерфейс генерується і оновлюється функціями рендеру в `src/ui`.
11. **webpack.config.js**: `entry` (`src/index.ts`), `output` (шлях і ім'я
    бандла в `dist`), `module.rules` з `ts-loader` для `.ts` і
    css/scss-лоадерами, `devServer` (порт, hot reload), `plugins`
    (`HtmlWebpackPlugin`, `MiniCssExtractPlugin`).
12. **ESLint vs Prettier**: ESLint аналізує код на потенційні помилки й
    порушення стильових/логічних правил (невикористані змінні, заборонені
    конструкції); Prettier — лише форматування (відступи, лапки, крапки з
    комою). `eslint-config-prettier` вимикає стильові правила ESLint, що
    конфліктують із Prettier.
13. **Юніт-тести**: `library.test.ts` перевіряє `add/remove/findById/find` на
    `Library<T>` через fake in-memory `Storage`; `validation.test.ts`
    перевіряє кожну функцію `Validation` на позитивних і негативних
    прикладах (наприклад, `Validation.isYear('2004')` → valid,
    `Validation.isYear('abcd')` → invalid).
14. **Husky pre-commit**: git-хук, що запускає `eslint` і `mocha` перед
    кожним комітом; блокує коміт, якщо лінтер або тести падають — це
    не дає розробнику закомітити код, що ламає збірку чи стиль, ще до
    ревʼю в команді.
15. **webpack vs Vite** — заповнити після виконання міграції на окремій
    гілці `vite-migration` (пункт 6 вище).
