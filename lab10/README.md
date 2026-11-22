# Study Planner — лабораторна робота №10

**Тема:** React та REST API: API layer, Repository Pattern, асинхронні операції та CRUD.

Продовження Study Planner з лабораторних №8–9. Локальне джерело даних (reducer + localStorage)
замінено на REST API [DummyJSON Todos](https://dummyjson.com/docs/todos). UI відокремлено від HTTP:
компоненти → hooks → `taskRepository` → `httpClient` → `fetch`.

Стек: React 19 + TypeScript, Vite, `fetch` + `AbortController`, SCSS + BEM, ESLint. Node.js ≥ 22.22.

## Запуск

```bash
cp .env.example .env   # VITE_API_URL=https://dummyjson.com
npm install
npm run dev            # http://localhost:5173
npm run lint
npm run build
```

`.env` не комітиться (див. `.gitignore`), у репозиторії лише `.env.example`.

## Структура

```
src/
├── api/
│   ├── httpClient.ts        # fetch, URL з VITE_API_URL, response.ok, JSON, AbortSignal
│   └── errors.ts            # ApiError + централізована нормалізація помилок
├── repositories/
│   └── taskRepository.ts    # getPage, getById, create, update, delete; mapping ApiTodo ↔ Task
├── reducers/
│   └── taskListReducer.ts   # server state списку: loading / success / error + оновлення після mutation
├── hooks/
│   ├── useTaskList.ts       # завантаження сторінки зі скасуванням, CRUD, optimistic toggle
│   ├── useTaskDetails.ts    # GET за id зі скасуванням (локальний state)
│   ├── useDebouncedValue.ts # debounce для пошуку
│   ├── useLocalStorage.ts   # лише UI-стан (фільтр, тема)
│   ├── useToast.ts / useToasts.ts / useTheme.ts
├── context/                 # ToastContext, ThemeContext (client/UI state)
├── pages/
│   └── StudyPlannerPage.tsx # сторінка: UI-стан (page, filter, search, selected) + server state з хука
├── components/              # TaskForm, TaskList, TaskItem, TaskDetails, Pagination, StatusMessage, ...
├── types/                   # Task (domain), ApiTodo / TodosResponse (DTO), AsyncStatus, Toast
├── App.tsx
└── main.tsx
```

Кожен компонент має власний `.scss` поруч, класи за BEM (`task-item__title`, `status-message--error`).
Глобальні стилі (`styles/index.scss`) — лише змінні теми, reset, `body` і спільні блоки `button`, `field`.

## Шари

| Шар | Знає про | Не знає про |
| --- | --- | --- |
| `httpClient` | `fetch`, базовий URL, статуси, JSON | Task, DummyJSON |
| `taskRepository` | endpoint-и `/todos`, DTO `ApiTodo`, mapping у `Task` | React |
| hooks (`useTaskList`, `useTaskDetails`) | `taskRepository`, стани запиту, `AbortController` | URL, `fetch` |
| компоненти | `Task`, callback-и | HTTP взагалі |

### Endpoint-и

| Метод | Endpoint | Метод repository |
| --- | --- | --- |
| GET | `/todos?limit=10&skip=0` | `getPage({ page, pageSize, signal })` |
| GET | `/todos/:id` | `getById(id, signal)` |
| POST | `/todos/add` | `create(task)` |
| PATCH | `/todos/:id` | `update(id, changes)` |
| DELETE | `/todos/:id` | `delete(id)` |

### Mapping і обмеження DummyJSON

`ApiTodo { id, todo, completed, userId }` → `Task { id, title, description, completed, priority, category }`.
Полів `description`, `priority`, `category` в API немає — це client-only metadata (за замовчуванням
`''`, `medium`, `Загальне`). У запити потрапляють лише поля контракту (`todo`, `completed`).

DummyJSON лише симулює POST/PATCH/DELETE. Тому:

- після успішної mutation хук оновлює server state через reducer (`taskCreated`, `taskUpdated`,
  `taskRemoved`) — без повторного GET;
- repository запам'ятовує в пам'яті результати успішних змін і накладає їх на наступні відповіді
  сервера, щоб після переходу між сторінками зміни не «зникали»;
- створене завдання сервер не зберігає (GET/PATCH `/todos/:id` для нього повернуть 404), тож для
  нього repository працює з локальною копією; DummyJSON для кожного нового todo повертає той самий
  id, тому repository робить його унікальним. Нові завдання показуються на початку першої сторінки.

## Асинхронні стани

`StatusMessage` має окремі варіанти: `loading` (`Loading...` зі спінером), `error` (повідомлення +
кнопка **«Спробувати ще»**), `empty` (`Завдань не знайдено.`), `success` (inline після створення).
Під час переходу на іншу сторінку попередні дані лишаються приглушеними (`task-list--stale`).
Помилки mutation-операцій — inline у формі або toast; `alert` не використовується.

## Скасування запитів

```ts
useEffect(() => {
  const controller = new AbortController()
  taskRepository
    .getPage({ page, pageSize, signal: controller.signal })
    .then(...)
    .catch((error) => {
      if (isAbortError(error)) return // скасування — не помилка для користувача
      dispatch({ type: 'fetchError', error: getErrorMessage(error) })
    })
  return () => controller.abort()     // нова сторінка / retry / unmount скасовує попередній GET
}, [page, pageSize, reloadKey])
```

Так само працює `useTaskDetails` (закриття вікна деталей скасовує запит). Кнопки пагінації не
блокуються під час завантаження, тож швидкий перехід 1 → 2 → 3 скасовує запит сторінки 2
(видно в DevTools → Network як `(canceled)`).

## Server state і client/UI state

- **Server state** — `tasks`, `total`, `status`, `error` у `useTaskList` (одне джерело правди, без
  копій у Context чи localStorage); деталі — локальний state `TaskDetails`.
- **Client/UI state** — `page`, `filter` (зберігається в localStorage), `search`, `selectedTaskId`,
  стан форми, режим картки (перегляд / редагування / підтвердження видалення), тема, toasts.

З №9 збережено те, що корисне: `ThemeContext`, toasts через Context, `useLocalStorage` (для UI-стану),
reducer-підхід (тепер для server state списку). `TaskContext` із завданнями прибрано — server state
не потрібно дублювати.

## CRUD в інтерфейсі

- **Створення** — форма зліва → `create()`; після успіху форма очищується, з'являється inline
  «Завдання створено» і toast, список оновлюється.
- **Деталі** — клік на назву → модальне вікно, дані через `getById(id)`; закриття ×, кліком поза
  вікном або Escape.
- **Completed** — кнопка «Виконано / Повернути» (optimistic update з відкатом при помилці).
- **Редагування** — «Редагувати» → форма в картці (назва, опис, категорія, пріоритет) → `update()`.
- **Видалення** — «Видалити» → inline-підтвердження «Так, видалити / Ні» → `delete()`.

## Додаткові завдання

- [x] пошук із debounce (400 мс; фільтрує поточну сторінку — DummyJSON не має пошуку по todos);
- [x] optimistic update для `completed`;
- [ ] Axios instance — свідомо обрано `fetch` (вимога 11 дозволяє вибір);
- [x] централізована нормалізація помилок (`api/errors.ts`: `ApiError`, `normalizeError`, `getErrorMessage`).

## Відповіді на контрольні запитання

**1. Що таке REST API?**
Стиль побудови HTTP API, де дані — це ресурси з адресами (`/todos`, `/todos/5`), а дії над ними
задаються HTTP-методами. Сервер не зберігає стан клієнта між запитами, дані зазвичай передаються в JSON.

**2. Чим GET, POST, PUT/PATCH та DELETE відрізняються один від одного?**
GET — читання, без зміни даних. POST — створення нового ресурсу. PUT — заміна ресурсу цілком,
PATCH — часткове оновлення. DELETE — видалення. GET, PUT і DELETE ідемпотентні, POST — ні.

**3. Чому API-логіку доцільно винести з React-компонентів?**
Компоненти відповідають за відображення. Якщо в них немає URL і `fetch`, їх простіше читати й
тестувати, а зміна API (інший endpoint, Axios замість fetch) торкається одного модуля, а не всіх компонентів.

**4. Що таке Repository Pattern?**
Шар між бізнес-логікою і джерелом даних, який надає колекційні методи (`getById`, `create`, `delete`)
і приховує, звідки й у якому форматі беруться дані.

**5. Яку відповідальність має repository у цій лабораторній?**
Знає endpoint-и DummyJSON, формує запити, перетворює `ApiTodo` ↔ `Task`, зберігає client-only
metadata і компенсує симуляцію mutation-операцій навчальним API.

**6. Чим API client відрізняється від repository?**
API client (`httpClient`) — загальний транспорт: URL, метод, заголовки, перевірка статусу, JSON.
Він нічого не знає про Task. Repository — предметний шар над ним: знає ресурс, endpoint-и й моделі.

**7. Які стани потрібно врахувати для асинхронного запиту?**
Loading, success, error (з можливістю повтору) і empty — успішна відповідь без даних. Також
скасування запиту, яке не повинно показуватися як помилка.

**8. Що таке server state і чим він відрізняється від client/UI state?**
Server state — дані, власником яких є сервер (список завдань); локально лише їх копія, яка може
застаріти. Client/UI state належить інтерфейсу: поточна сторінка, фільтр, відкрите вікно, текст у формі.

**9. Чому не варто дублювати server state у localStorage без потреби?**
З'являються два джерела правди, які розходяться: застарілі дані з localStorage перекривають
актуальні з сервера, і незрозуміло, яким вірити.

**10. Для чого потрібен AbortController?**
Щоб скасувати запит, результат якого вже не потрібен (змінилася сторінка, закрито вікно,
компонент зник). Його `signal` передається у `fetch`, `abort()` перериває запит.

**11. Що станеться, якщо компонент завершить існування під час виконання запиту?**
Без скасування відповідь усе одно прийде, і код спробує оновити стан уже неіснуючого компонента
або, що гірше, застаріла відповідь перезапише свіжішу (race condition). Cleanup із `controller.abort()`
обриває запит, а `AbortError` ігнорується.

**12. Чим fetch відрізняється від Axios?**
`fetch` вбудований у браузер, не кидає помилку на статуси 4xx/5xx (потрібно перевіряти `response.ok`),
JSON треба розбирати вручну. Axios — бібліотека: сам кидає помилку на невдалий статус, автоматично
серіалізує JSON, має interceptors та instance з базовим URL.

**13. Що таке optimistic update?**
Оновлення UI одразу, до відповіді сервера, з припущенням, що запит вдасться. Якщо ні — стан
відкочується, а користувач бачить повідомлення про помилку (тут — перемикання completed).

**14. Чому після успішного POST не обов'язково виконувати повне перезавантаження сторінки?**
Сервер повертає створений об'єкт, тож його можна просто додати в локальний стан. Це швидше, не
скидає UI-стан і не робить зайвий запит. (Для DummyJSON це ще й єдиний варіант — він не зберігає зміни.)

**15. Як правильно обробити HTTP-помилку?**
Перевірити `response.ok`, на невдалий статус кинути типізовану помилку зі статусом і текстом із тіла,
нормалізувати мережеві помилки й скасування в одному місці, показати користувачу зрозуміле
повідомлення з можливістю повторити, а скасування не показувати взагалі.
