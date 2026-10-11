# Лабораторна робота №3 — Vue 3: компоненти, шаблони, директиви

Застосунок «Користувачі» на **Vue 3 + TypeScript + Composition API (`<script setup>`)**,
створений через `create-vue` (Vite, ESLint). Картка користувача зроблена за макетом
`user-card.png` з умови.

## Запуск

Потрібен Node.js `^22.18` або `>=24.12` (перевір: `node -v`).

```bash
npm install
npm run dev          # http://localhost:5173
npm run type-check   # vue-tsc
npm run lint         # oxlint + ESLint
npm run build        # продакшн-збірка у dist/
```

## Структура

```
public/
├── users/            # зображення користувачів (1.svg … 10.svg)
└── tutorial/         # скріншоти step-1.png … (завдання 1 — робиш сам)
src/
├── components/
│   ├── Users.vue     # список, toolbar: фільтри, сортування, скидання, порожній стан
│   ├── UserCard.vue  # картка одного юзера (props: user)
│   └── AppIcon.vue   # базовий компонент SVG-іконок
├── data/
│   ├── users.json    # 10 користувачів (gender, name, location, email, phone, picture, dob, hobbies, details)
│   └── users.ts      # типізований експорт users: User[]
├── types/user.ts     # інтерфейси User, UserName, UserLocation…, типи фільтрів
├── utils/            # getAgeGroup, formatDob, getHobbyTone
├── assets/main.css   # глобальні змінні кольорів і базові стилі
├── App.vue
└── main.ts
```

## Вимоги → де реалізовано

| Вимога | Де |
|---|---|
| Users.vue імпортується в App.vue | `App.vue`, `components/Users.vue` |
| Дані з user.json: gender, name, location, email, phone, picture, dob | `data/users.json`, `UserCard.vue` |
| Стилі картки | `<style scoped>` у `UserCard.vue` |
| `v-if`: вік лише якщо > 18 | `UserCard.vue` — `v-if="age > 18"` (два місця) |
| `hobbies` + `v-for` | `UserCard.vue` — `v-for="hobby in user.hobbies" :key="hobby"` |
| Колір картки за віком, об'єктний `:class` | `UserCard.vue` — `:class="{ 'user-card--minor': … }"` (minor <18, young 18–30, adult 31–50, senior >50) |
| `details` + `v-show` | `UserCard.vue` — кнопка «About me» перемикає `v-show="isDetailsOpen"` |
| 10 користувачів, `v-for` | `Users.vue` |
| Фото: `v-bind:src`, динамічний `alt` | `UserCard.vue` — `:src="user.picture"`, `:alt="`${first} ${last}`"` |
| «Список юзерів пустий» | `Users.vue` — `v-if="visibleUsers.length === 0"` |
| Фільтр Всі / Чоловіки / Жінки | `Users.vue` — `genderFilter` |
| Фільтр Всі / 18+ | `Users.vue` — `ageFilter` |
| Сортування Ім'я ↑↓ / Вік ↑↓ без втрати фільтрів | `Users.vue` — `visibleUsers` (`computed`: спершу `filter`, потім `sort` копії масиву) |
| Очистити все | `Users.vue` — `resetAll()` |

Примітки:
- Вік показується за умовою `> 18` (як у завданні), а фільтр «18 +» бере `>= 18`.
  Тому юзерка Mia (рівно 18) потрапляє у фільтр, але вік на картці не показується.
- Назва `Users.vue` задана умовою, а правило style guide `multi-word-component-names`
  вимагає кілька слів. Тому в `eslint.config.ts` для `Users` зроблено явний виняток.
- Решта компонентів названа за style guide: `UserCard`, `AppIcon` (базовий компонент з префіксом `App`).

## Що потрібно зробити самостійно

1. **Tutorial (завдання 1):** пройти https://ua.vuejs.org/tutorial/#step-1 (Composition API, SFC) і
   зберегти скріншоти кожного кроку як `step-1.png`, `step-2.png` … у `public/tutorial/`.
2. **Фото (завдання 5):** зараз у `public/users/` лежать SVG-заглушки. Заміни їх реальними фото
   (наприклад, з `https://randomuser.me/api/portraits/…`), поклади у `public/users/` і онови поле
   `picture` у `src/data/users.json` (розширення `.svg` → `.jpg`).
3. **Репозиторій і коміти:** створи окремий репозиторій на GitHub і коміть за Conventional Commits.
   Приклад послідовності:
   ```
   chore: scaffold Vue 3 project with create-vue (TypeScript, ESLint)
   docs(tutorial): add Vue tutorial screenshots
   feat(types): add User types and users dataset
   feat(users): add UserCard component with styles
   feat(users): add age v-if, hobbies v-for, age-group :class and details v-show
   feat(users): add users list with photos and empty state
   feat(users): add gender and age filters
   feat(users): add sorting and reset button
   docs: add README with answers to control questions
   ```

## Відповіді на контрольні питання (чернетка)

1. **Компонент** — самодостатній блок UI (шаблон + логіка + стилі), який можна перевикористовувати.
   Застосунок — це дерево компонентів; так код ділиться на невеликі зрозумілі частини
   (тут `App` → `Users` → `UserCard` → `AppIcon`).
2. **SFC (Single File Component)** — файл `.vue`, що об'єднує в одному місці `<template>`,
   `<script>` (у нас `<script setup lang="ts">`) і `<style>` (у нас `scoped`).
3. **Шаблон** — HTML-подібна розмітка компонента. У ньому можна використовувати інтерполяцію
   `{{ }}`, директиви (`v-if`, `v-for`, `v-bind`, `v-on`…), JS-вирази, виклики методів і
   обчислюваних значень, інші компоненти.
4. **HTML vs шаблон Vue** — шаблон Vue компілюється у render-функції; він реактивний
   (оновлюється при зміні даних), має інтерполяцію, директиви та компоненти. Звичайний HTML статичний.
5. **Директиви** — спеціальні атрибути з префіксом `v-`, що додають шаблону реактивну поведінку.
   Синтаксис: `v-name:аргумент.модифікатор="вираз"`, напр. `v-on:click.prevent="save"`.
6. **`v-bind`** прив'язує атрибут або проп до виразу: `<img :src="user.picture" :alt="user.name.first">`.
7. **`v-bind:src` vs `:src`** — різниці немає: `:` — скорочений запис `v-bind:`.
8. **`v-if`** додає/видаляє елемент із DOM залежно від умови. `v-else-if` — додаткова умова в
   ланцюжку, `v-else` — гілка за замовчуванням. **`v-show`** лише перемикає CSS `display: none`;
   елемент завжди в DOM. `v-if` дорожчий при частому перемиканні, `v-show` — при початковому рендері;
   `v-show` не підтримує `<template>` і `v-else`.
9. **`v-for`** рендерить список: `v-for="user in users" :key="user.id"`. `:key` має бути унікальним
   і стабільним (id, а не індекс), щоб Vue правильно переміщував вузли при сортуванні/фільтрації.
   `v-if` і `v-for` не слід ставити на один елемент.
10. **Реактивність** — Vue відстежує залежності між станом (`ref`, `reactive`) і шаблоном. Коли
    значення змінюється, оновлюються тільки ті частини DOM, які від нього залежать. У нас зміна
    `genderFilter`/`sortKey` автоматично перераховує `computed` `visibleUsers` і перемальовує список.
