# Study Planner — лабораторна робота №11

**Тема:** React Router 8, форми, валідація та автентифікація.

Продовження Study Planner з лабораторної №10 (REST API, repository, AbortController). Додано
багатосторінкову навігацію, Login з React Hook Form + Zod, Auth Context, protected routes,
авторизовані CRUD-дії та спільний `TaskFormDialog`.

**Варіант — непарний → Data Mode** (`createBrowserRouter` + `RouterProvider` + protected `loader`).

Стек: React 19 + TypeScript, React Router 8, React Hook Form, Zod, Vite, `fetch`, SCSS + BEM, ESLint.
Node.js ≥ 22.22.

## Запуск

```bash
cp .env.example .env   # VITE_API_URL=https://dummyjson.com
npm install
npm run dev            # http://localhost:5173
npm run lint
npm run build
```

Тестовий акаунт DummyJSON: `emilys` / `emilyspass` (роль `admin`).

## Маршрути

| Шлях | Що | Захист |
| --- | --- | --- |
| `/` | redirect на `/tasks` | — |
| `/tasks` | список; query params `status`, `priority`, `page` | перегляд — усім |
| `/tasks/:taskId` | деталі (route param), редагування й видалення | перегляд — усім, дії — після входу |
| `/login` | форма входу (`?redirectTo=` — куди повернутись) | авторизованого перенаправляє далі |
| `/profile` | профіль і Logout | `loader: requireUser` |
| `/admin` | список користувачів | `loader: adminLoader` (роль `admin`) |
| `*` | 404 | — |

Конфігурація — `src/routes/router.tsx`, loader-и — `src/routes/loaders.ts`.

```ts
export const router = createBrowserRouter([
  {
    path: '/', Component: AppLayout, loader: rootLoader, shouldRevalidate: () => false,
    HydrateFallback, ErrorBoundary: RouteErrorPage,
    children: [{ ErrorBoundary: RouteErrorPage, children: [
      { index: true, loader: () => redirect('/tasks') },
      { path: 'tasks', children: [
        { index: true, Component: TasksPage },
        { path: ':taskId', Component: TaskDetailsPage },
      ] },
      { path: 'login', loader: loginLoader, Component: LoginPage },
      { path: 'profile', loader: requireUser, lazy: () => import('../pages/ProfilePage')... },
      { path: 'admin', loader: adminLoader, lazy: ... },
      { path: '*', Component: NotFoundPage },
    ] }],
  },
])
```

`RouterProvider` імпортується з `react-router/dom`, решта API — з `react-router`.

## Структура

```
src/
├── api/
│   ├── httpClient.ts        # fetch, VITE_API_URL, Authorization: Bearer, 401 → refresh → повтор
│   └── errors.ts            # ApiError, normalizeError, getErrorMessage
├── auth/
│   ├── session.ts           # сесія поза React: login, logout, restore, refresh; читають loader-и й AuthContext
│   └── redirect.ts          # loginPath(redirectTo), safeRedirect (захист від open redirect)
├── repositories/            # taskRepository, authRepository (/auth/*), userRepository (/users)
├── context/                 # AuthContext, ThemeContext, ToastContext
├── hooks/                   # useAuth, useRequireAuth, useTaskFilters, useTaskList, useTaskDetails, ...
├── layouts/AppLayout.tsx    # Header + навігація + <Outlet />
├── pages/                   # TasksPage, TaskDetailsPage, LoginPage, ProfilePage, AdminPage, NotFoundPage, RouteErrorPage
├── components/              # TaskFormDialog, TaskList, TaskItem, Header, Pagination, StatusMessage, ...
├── schemas/                 # authSchema.ts (loginSchema), taskSchema.ts
├── routes/                  # router.tsx, loaders.ts
├── types/                   # Task, User, DTO
└── main.tsx                 # ThemeProvider → ToastProvider → AuthProvider → RouterProvider
```

Кожен компонент і сторінка мають свій `.scss` поруч, класи за BEM. Глобальні стилі — лише змінні,
reset, `body` і спільні блоки `button`, `field`.

## Як влаштовано

**Сесія й AuthContext.** `auth/session.ts` — звичайний модуль поза React: зберігає користувача й
токени, має `login`, `logout`, `restore`, `subscribe`. Loader-и Data Mode не можуть викликати hooks,
тому читають сесію напряму. `AuthProvider` підписується на неї через `useSyncExternalStore` і
надає компонентам `user`, `accessToken`, `isAuthenticated`, `isAdmin`, `login`, `logout`.

**Login-flow.** `POST /auth/login` → `accessToken` і `refreshToken` → `GET /auth/me` з
`Authorization: Bearer <token>` → користувач (з роллю). Після входу — повернення на `redirectTo`.

**Protected route.** `requireUser` чекає відновлення сесії; якщо користувача немає —
`throw redirect('/login?redirectTo=/profile')`. Після logout loader знову не пропускає на `/profile`.

**Authorization header.** Формується лише в `httpClient` (`buildHeaders`) для запитів з
`auth: true`. Якщо токена немає — запит не відправляється (`ApiError('unauthorized')`).
На 401 httpClient один раз викликає refresh і повторює запит.

**Authorization CRUD.** Перегляд доступний усім. Створення, перемикання completed, редагування й
видалення проходять через `useRequireAuth()`: гість переходить на `/login?redirectTo=...`, а не
просто не бачить кнопок. Додатково repository викликає захищені операції з `auth: true`.

**Query params.** `useTaskFilters` читає й пише `status`, `priority`, `page` через
`useSearchParams`. URL — єдине джерело правди для фільтрів: після F5 і за посиланням стан той самий.
Пошук за назвою — тимчасовий локальний стан введення (debounce), у URL не пишеться.

**TaskFormDialog.** Один компонент для `create` (кнопка «+» на `/tasks`) і `edit` («Редагувати» на
`/tasks/:taskId`): props `open`, `mode`, `task`, `onClose`, `onSubmit`. React Hook Form + `zodResolver(taskSchema)`,
під час відправки — «Збереження…» і заблокована кнопка, помилка сервера — під формою. Нативний
`<dialog>.showModal()`: заголовок через `aria-labelledby`, фокус на полі «Назва», закриття через
Escape, «×» і «Скасувати». Після успіху dialog закривається, дані оновлюються без перезавантаження, toast.

**Task: createdBy і createdAt.** Є в domain-моделі. DummyJSON їх не повертає: `createdBy` для
завдань з API — «Користувач #userId», для створених у застосунку — username; `createdAt` —
**client-owned metadata** (позначено в `types/task.ts`): для завдань з API — «Невідомо», для
створених — момент створення.

**Обмеження DummyJSON.** POST/PATCH/DELETE лише симулюються — repository запам’ятовує успішні
зміни в пам’яті (див. README лаби №10). Після F5 вони зникають.

## Додаткові завдання

- [x] повернення на попередній маршрут після входу (`?redirectTo=`);
- [ ] реєстрація — не реалізовано (DummyJSON лише симулює `POST /users/add`);
- [x] окремий `NotFoundPage` для 404 (і для `/tasks/abc`);
- [x] nested routes (`tasks` → index і `:taskId`, layout з `<Outlet />`);
- [x] роль `admin` і маршрут `/admin` з `requireAdmin`;
- [x] lazy loading для `/profile` і `/admin` (окремі chunks у build);
- [x] відновлення сесії після перезавантаження (`rootLoader` → `session.restore()`);
- [x] refresh token flow (401 → `POST /auth/refresh` → повтор запиту).

## Відповіді на контрольні запитання

**1. Що таке SPA і як React Router допомагає реалізувати навігацію?**
Single Page Application — одна HTML-сторінка, а вміст змінює JavaScript без перезавантаження.
React Router зіставляє URL з компонентами, змінює адресу через History API (`Link`, `navigate`) і
рендерить потрібну сторінку без запиту нового HTML.

**2. Чим route params відрізняються від query params?**
Route params — частина шляху, що ідентифікує ресурс: `/tasks/42` → `taskId = '42'` (`useParams`).
Query params — необов’язкові налаштування відображення після `?`: `?status=completed&priority=high`
(`useSearchParams`).

**3. Для чого URL можна розглядати як частину стану застосунку?**
URL зберігає, що саме бачить користувач (сторінка, фільтр, номер сторінки). Такий стан
переживає F5, ним можна поділитися посиланням, працюють кнопки «Назад/Вперед».

**4. Чим Declarative Mode відрізняється від Data Mode?**
Declarative — маршрути описуються JSX (`<Routes><Route/></Routes>`), дані завантажують самі
компоненти. Data Mode — маршрути описуються об’єктами в `createBrowserRouter`, з’являються
`loader`, `action`, `errorElement`, `lazy`: дані й перевірки виконуються до рендеру сторінки.

**5. Які основні API використовуються в Declarative Mode?**
`BrowserRouter`, `Routes`, `Route`, `Link`/`NavLink`, `Navigate`, `Outlet`, hooks `useParams`,
`useSearchParams`, `useNavigate`, `useLocation`.

**6. Які основні API використовуються в Data Mode?**
`createBrowserRouter`, `RouterProvider` (з `react-router/dom`), `loader`, `action`, `redirect`,
`ErrorBoundary`/`errorElement`, `lazy`, `useLoaderData`, `useNavigation`, `useRouteError`, а також ті самі
`Link`, `Outlet`, `useParams`, `useSearchParams`.

**7. Як працює protected route у declarative підході?**
Компонент-обгортка читає auth-стан з контексту: якщо користувача немає — повертає
`<Navigate to="/login" replace state={{ from: location }} />`, інакше — `children` або `<Outlet />`.

**8. Як працює protected route через loader у Data Mode?**
Перед рендером маршруту React Router викликає `loader`. `requireUser` перевіряє сесію і, якщо
її немає, кидає `redirect('/login?redirectTo=...')` — компонент сторінки навіть не рендериться.

**9. Чому loader не повинен напряму використовувати React hooks?**
Loader — звичайна async-функція, яку викликає роутер поза рендером компонента. Hooks працюють
лише під час рендеру React-компонента. Тому loader читає дані з модулів (тут — `session`), а не з
`useContext`.

**10. Що таке nested routes і layout?**
Nested routes — дочірні маршрути всередині батьківського (`tasks` → `''` і `:taskId`). Layout —
батьківський маршрут зі спільною розміткою (Header, навігація) і `<Outlet />`, куди рендериться
дочірня сторінка.

**11. Що таке authentication і чим вона відрізняється від authorization?**
Authentication — перевірка, хто користувач (вхід за username/password). Authorization — що йому
дозволено (гість лише переглядає, авторизований змінює завдання, admin бачить `/admin`).

**12. Що таке token?**
Рядок, який сервер видає після входу і який клієнт додає до запитів як доказ автентифікації
(`Authorization: Bearer <accessToken>`). `accessToken` короткоживучий, `refreshToken` — для отримання нового.

**13. Чому Authorization header зручніше централізувати в API client?**
Логіка в одному місці: компоненти й repository не дублюють заголовок, не забудуть його додати,
а refresh при 401 і заміна схеми авторизації змінюються в одному файлі.

**14. Що має містити Auth Context?**
Поточного користувача, `accessToken` або ознаку сесії, `isAuthenticated` (тут ще `isAdmin`) і дії
`login`, `logout`.

**15. Чому автентифікацію не варто реалізовувати окремо в кожному компоненті?**
Буде дублювання й розсинхронізація: різні компоненти по-різному перевірятимуть сесію, після
logout якийсь забуде оновитися. Спільний контекст і сесія дають одне джерело правди.

**16. Що таке schema validation і для чого використовується Zod?**
Опис правил даних однією схемою (типи, обов’язковість, довжина) замість ручних `if`. Zod перевіряє
дані за схемою, повертає зрозумілі помилки й виводить TypeScript-тип (`z.infer`).

**17. Як React Hook Form взаємодіє із Zod?**
Через `resolver: zodResolver(schema)`: під час submit (і після першої спроби — при зміні) RHF
передає значення в Zod, а помилки потрапляють у `formState.errors` для кожного поля. `handleSubmit`
викликає обробник лише з валідними даними.

**18. Які ризики пов’язані зі зберіганням token у localStorage?**
localStorage доступний будь-якому JavaScript на сторінці: при XSS-вразливості токен можна
викрасти. Він не має терміну життя й не очищується автоматично. Безпечніше — httpOnly cookie і
короткоживучий accessToken; тут localStorage використано свідомо для навчального відновлення сесії.

**19. Для чого потрібен redirect на Login у protected route?**
Щоб неавторизований користувач не побачив закриту сторінку, а одразу отримав спосіб увійти; з
`redirectTo` після входу він повертається туди, куди йшов.
