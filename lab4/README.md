# vue-lottery-app

Лабораторна робота №4 — лотерея на **Vue 3 + TypeScript + Composition API** (`<script setup>`).
Стилі: **Bootstrap 5 (npm) + SCSS**, імпортуються лише потрібні частини (reboot, forms, buttons, tables, card, modal).

## Запуск

Потрібен Node.js `^22.18` або `>=24.12` (перевір: `node -v`).

```bash
npm install
npm run dev          # http://localhost:5173
npm run lint         # oxlint + ESLint (повний style guide Vue: flat/recommended)
npm run type-check   # vue-tsc
npm run build        # продакшн-збірка
```

## Структура

```
src/
├── components/
│   ├── BaseButton.vue          # 1. Компонент кнопка
│   ├── BaseInput.vue           # 2. Компонент поля вводу (v-model через defineModel)
│   ├── WinnerItem.vue          # 3. Компонент переможця
│   ├── TheWinnersBlock.vue     # 4. Блок списку переможців + кнопка "New winner"
│   ├── ParticipantForm.vue     #    Форма з валідацією (реєстрація І редагування)
│   ├── TheRegisterBlock.vue    # 5. Блок форми реєстрації
│   ├── TheParticipantsBlock.vue# 6. Блок таблиці: сортування, фільтр, модалки
│   ├── BaseModal.vue           # 7. Modal (слоти header/default/footer, Esc, CSS-переходи)
│   ├── SearchBar.vue           # 8. SearchBar (подія filter-by-name, watch + debounce 300 мс)
│   └── BaseIcon.vue            #    SVG-іконки (Bootstrap Icons, MIT)
├── composables/useLottery.ts   # стан: учасники, переможці, дії, localStorage (watch deep)
├── types/participant.ts
├── utils/                      # validation.ts, storage.ts, format.ts, id.ts
├── assets/styles/main.scss     # змінні Bootstrap + вибірковий імпорт + стилі застосунку
├── App.vue
└── main.ts
```

## Вимоги → де реалізовано

| Вимога | Де |
|---|---|
| Репозиторій `vue-lottery-app`, TypeScript, Composition API | весь проєкт, `package.json` |
| Style guide | назви з кількох слів, префікси `Base*`/`The*`, типізовані props/emits, `:key` у `v-for`, `scoped`-стилі; ESLint з `flat/recommended` |
| Bootstrap через npm, SCSS, лише потрібні стилі | `assets/styles/main.scss` |
| Без `alert` | помилки — під полями; підтвердження — `BaseModal` |
| Всі поля обов'язкові; regexp для e-mail і телефону | `utils/validation.ts` |
| `input type="date"`, формат yyyy-mm-dd, дата не в майбутньому | `ParticipantForm.vue`, `validation.ts` |
| Save: додати в таблицю + очистити форму без валідації | `ParticipantForm.vue` (`resetForm`, прапорці `touched`/`dirty`) |
| Унікальність e-mail (без регістру; при редагуванні свій e-mail не дублікат) | `validation.ts` → `isEmailTaken(..., editingId)` |
| Enter відправляє форму (ключовий модифікатор) | `ParticipantForm.vue` — `@keydown.enter.prevent` |
| New winner: ≤ 3, неактивна при 3 / порожньому списку / коли всі вже переможці | `useLottery.ts` → `canDrawWinner` |
| Видалення переможця; видалений учасник зникає з переможців | `useLottery.ts` |
| Збереження в localStorage через `watch` + `deep`, відновлення при старті | `useLottery.ts` |
| Редагування в модалці з формою (валідація, "Оновити дані") | `TheParticipantsBlock.vue` + `ParticipantForm.vue` |
| Видалення з підтвердженням ("Так"/"Ні") | `TheParticipantsBlock.vue` |
| Сортування (ім'я, дата) з іконками; повторний клік змінює напрямок | `TheParticipantsBlock.vue` |
| Пошук: `SearchBar` → `filter-by-name`, debounce 300 мс через `watch` | `SearchBar.vue` |
| Фільтр, потім сортування; вихідний масив не змінюється | `visibleParticipants` (`computed`, сортується копія) |
| Esc закриває модальне вікно | `BaseModal.vue` — `@keydown.esc` |
| Телефон `+380XXXXXXXXX` | `PHONE_PATTERN = /^\+380\d{9}$/` |

## Рішення та нюанси

- **Enter і подвійна відправка.** Якщо повісити `@keydown.enter` на форму без `.prevent`, браузер
  відправить її ще й нативно. Тому `@keydown.enter.prevent="onSubmit"` на `<form>` — єдиний шлях відправки
  з клавіатури, а кнопка Save (`type="submit"`) працює через `@submit.prevent`.
- **Очищення без валідації.** Помилка показується тільки для `touched`-поля. На `blur` поле стає
  `touched` лише якщо користувач його змінював (`dirty`). Тому після Save (особливо через Enter, коли
  фокус лишається в полі) порожня форма не червоніє, коли фокус піде.
- **Дата.** У полі — нативний `input[type=date]` (значення `yyyy-mm-dd`), у таблиці виводиться як
  `dd/mm/yyyy`, як у дизайні.
- **Переможці зберігаються** в localStorage разом з учасниками (за id); при відновленні "осиротілі" id відкидаються.
- **Сортування за іменем** використовує `Intl.Collator(['uk', 'en'])` — коректно для кирилиці й латиниці
  (кирилиця йде першою).
- **Мови інтерфейсу.** Підписи форми й таблиці — англійською, як у дизайні; тексти модалок та кнопки
  "Редагувати дані", "Оновити дані", "Видалити учасника", "Так", "Ні" — українською, як у завданні.
- Колір `$primary` трохи темніший за макет, щоб білий текст на кнопках був читабельнішим.

## Що потрібно зробити самостійно

1. Створити **порожній** репозиторій `vue-lottery-app` на GitHub (без README/.gitignore).
2. Закомітити за Conventional Commits, наприклад:
   ```
   git init
   git add package.json package-lock.json vite.config.ts eslint.config.ts env.d.ts tsconfig.json tsconfig.app.json tsconfig.node.json index.html .gitignore .oxlintrc.json .editorconfig .gitattributes .vscode public
   git commit -m "chore: scaffold Vue 3 project with create-vue (TypeScript, ESLint)"
   git add src/assets
   git commit -m "style: add Bootstrap (selective SCSS imports) and Open Sans via npm"
   git add src/types src/utils
   git commit -m "feat(core): add participant types, validation and storage utils"
   git add src/components/BaseButton.vue src/components/BaseInput.vue src/components/BaseIcon.vue src/components/BaseModal.vue src/components/SearchBar.vue
   git commit -m "feat(ui): add base components (button, input, icon, modal, search bar)"
   git add src/components/ParticipantForm.vue src/components/TheRegisterBlock.vue
   git commit -m "feat(form): add registration form with validation"
   git add src/composables src/components/WinnerItem.vue src/components/TheWinnersBlock.vue
   git commit -m "feat(winners): add winners block, random draw and localStorage persistence"
   git add src/components/TheParticipantsBlock.vue
   git commit -m "feat(table): add participants table with search, sorting, edit and delete modals"
   git add src/App.vue src/main.ts
   git commit -m "feat(app): compose lottery app from components"
   git add README.md
   git commit -m "docs: add README with control questions"
   git branch -M main
   git remote add origin https://github.com/ТВІЙ_ЛОГІН/vue-lottery-app.git
   git push -u origin main
   ```
   (Якщо `git add` скаржиться на якийсь файл зі списку, якого в тебе немає, просто прибери його з команди.)
3. Пройти матеріали зі списку самостійної роботи й прочитати код — на захисті питимуть, чому щось зроблено саме так.

## Відповіді на контрольні питання (чернетка)

**1. Що таке computed і чим відрізняється від методу?**
Це обчислювана властивість: значення, виведене з реактивних даних (`const fullName = computed(() => ...)`).
Результат **кешується**, а метод виконується при кожному виклику (у шаблоні — при кожному перерендері).
У проєкті: `visibleParticipants`, `canDrawWinner`, `errors` у формі.

**2. Як працює кешування?**
Vue запам'ятовує, які реактивні значення прочитав getter. Перерахунок відбувається **лише коли змінилась
одна з цих залежностей** і значення знову потрібне (ліниво). Якщо залежності не змінились — повертається кеш.

**3. Чи можна змінювати computed? Writable computed?**
За замовчуванням ні (read-only). Writable:
```ts
const fullName = computed({
  get: () => `${first.value} ${last.value}`,
  set: (v: string) => { [first.value, last.value] = v.split(' ') },
})
```

**4. Способи оголошення обробників. Inline vs метод?**
`@click="count++"` (inline — короткий вираз) і `@click="onSubmit"` (метод — функція, отримує `event`).
Inline зручний для простих дій (`@click="emit('draw')"`), метод — для логіки, яку треба перевикористати чи протестувати.

**5. Модифікатори подій?**
`.prevent` — `preventDefault()` (`@submit.prevent`), `.stop` — зупиняє спливання, `.once` — обробник спрацює один раз.
Ключові: `.enter`, `.esc` — реакція лише на потрібну клавішу: `@keydown.enter.prevent="onSubmit"`, `@keydown.esc="emit('close')"`.

**6. Як працює `v-model` і чим замінюється для text?**
Це синтаксичний цукор двостороннього зв'язування. Для `<input type="text">`:
`<input :value="name" @input="name = $event.target.value">`. Для компонента: `:modelValue` + `@update:modelValue`.

**7. `v-model` з checkbox, radio, select, textarea?**
`checkbox` — boolean (або масив для групи), `radio` — значення вибраної кнопки, `select` — значення
обраного `option` (з `multiple` — масив), `textarea` — як text: `<textarea v-model="text">` (без `{{ }}` усередині тегу).

**8. Модифікатори `v-model`?**
`.lazy` — синхронізація на `change`, а не на кожен `input`; `.number` — приводить значення до числа;
`.trim` — обрізає пробіли по краях.

**9. Як реалізована валідація без `alert`?**
`validateParticipant` (чиста функція) повертає помилки: обов'язкові поля, `EMAIL_PATTERN`, `PHONE_PATTERN`
(`/^\+380\d{9}$/`), дата не пізніше сьогодні, унікальність e-mail. У `ParticipantForm` вони лежать у `computed errors`
і виводяться під полем: `<p v-if="error">`; поле отримує класи `is-invalid` / `is-valid`.

**10. Як очистити форму без спрацювання валідації?**
Помилка показується лише для `touched`-поля. `resetForm()` одночасно скидає значення, `touched` і `dirty`,
а blur робить поле `touched` лише якщо воно було змінене (`dirty`). Тому порожня форма після Save не підсвічується.

**11. Що таке props і напрямок?**
Параметри, які батько передає дитині: `<UserCard :user="user">`. Дані течуть **вниз** (parent → child).

**12. Чому props не можна змінювати?**
Односторонній потік робить стан передбачуваним: інакше будь-яка дитина могла б непомітно змінити дані батька.
Правильно: взяти локальну копію (`reactive({ ...props.initialValues })`), обчислити значення через `computed`
або повідомити батька подією (`emit`) / використати `defineModel`.

**13. Типізація props?**
`defineProps<{ participants: readonly Participant[]; resetOnSubmit?: boolean }>()`. Обов'язковість — відсутність `?`,
значення за замовчуванням — `withDefaults(defineProps<...>(), { resetOnSubmit: false })`.
Для об'єктів/масивів значення за замовчуванням задається фабрикою.

**14. Як дитина повідомляє батька? Типізація?**
Подією через `emit`. Типізація: `defineEmits<{ remove: [id: string]; draw: [] }>()` →
`emit('remove', winner.id)`. Батько слухає: `@remove="removeWinner"`.

**15. `v-model` на власному компоненті?**
`const model = defineModel<string>({ required: true })` (Vue 3.4+) — у `BaseInput` і далі `v-model="model"` на `<input>`.
Це розгортається у prop `modelValue` та подію `update:modelValue`. Використання: `<BaseInput v-model="values.name" />`.

**16. Слоти. Named vs default. Modal?**
Слот — місце в шаблоні дитини, яке заповнює батько. Default-слот — основний вміст, іменовані
(`<slot name="footer" />`, `<template #footer>`) — окремі зони. `BaseModal` має `header`, default (тіло) і `footer`;
футер рендериться лише якщо переданий (`$slots.footer`). Так одне вікно використовується і для форми, і для підтвердження.

**17. Watchers. watch vs computed?**
`watch` виконує **побічний ефект** при зміні даних (запис у localStorage, debounce, запит). `computed` —
**обчислює значення** без побічних ефектів. Для похідних даних (фільтр, сортування) — `computed`, для дій — `watch`.

**18. `deep`, `immediate`, `watchEffect`?**
`deep: true` — стежить за вкладеними змінами об'єкта/масиву. `immediate: true` — запустити callback одразу.
`watchEffect` сам збирає залежності з усього, що прочитав у callback, і запускається одразу; `watch` — явне джерело
і доступ до старого значення.

**19. Збереження в localStorage через watcher?**
```ts
const participants = ref(loadFromStorage(KEY, isParticipantList, []))  // відновлення при старті
watch(participants, (v) => saveToStorage(KEY, v), { deep: true })      // збереження
```
`deep` потрібен, бо зміни всередині елементів (редагування учасника) інакше не помітні.

**20. Принципи поділу на компоненти? Reusable?**
Один компонент — одна відповідальність; дані вниз (props), події вгору (emit); базові компоненти
(`BaseButton`, `BaseInput`, `BaseModal`) не знають про предметну область. Багаторазовий компонент можна
використати в різних місцях без змін: `ParticipantForm` працює і в блоці реєстрації, і в модалці редагування.

**21. Сортування й фільтрація через computed?**
`filteredParticipants` (computed від `nameQuery`) → `visibleParticipants` (computed від відфільтрованого та `sort`).
Сортується **копія** (`[...filtered].sort(...)`), тож вихідний масив не змінюється, а фільтр і сортування працюють разом.

**22. Options API vs Composition API?**
Options API групує код за типами опцій (`data`, `methods`, `computed`), простий для початку. Composition API
групує код за логікою (стан, обчислення, функції поруч), краще виносить повторювану логіку в composables
(`useLottery`), краще типізується в TypeScript і дає менше шаблонного коду з `<script setup>`.
