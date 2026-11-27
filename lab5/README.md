# vue-lottery-app — лабораторна робота №5

**Тема:** керування маршрутами з використанням vue-router.
Лотерея з лаби №4 тепер працює з REST API [DummyJSON](https://dummyjson.com): учасники завантажуються з
`/users`, доступ до них — лише після JWT-авторизації. Доступ до даних винесено в шар репозиторіїв (Repository).

Стек: **Vue 3 + TypeScript + Composition API**, **Vue Router 4**, **Pinia**, **VeeValidate + zod**,
**Bootstrap 5 (лише потрібні стилі) + SCSS**, ESLint + oxlint.

## Запуск

Потрібен Node.js `^22.18` або `>=24.12`.

```bash
cp .env.example .env   # адреса API та інші налаштування середовища
npm install
npm run dev            # http://localhost:5173
npm run lint           # oxlint + ESLint (style guide Vue: flat/recommended)
npm run build          # type-check + продакшн-збірка
npm run deploy         # збірка й публікація dist/ у гілку gh-pages
```

Тестовий акаунт DummyJSON: `emilys` / `emilyspass` (інші — у відповіді `GET /users`).

## Маршрути

| Шлях | Сторінка | meta |
|---|---|---|
| `/` | `HomeView` — опис проєкту, технології, посилання на GitHub | `title` |
| `/about` | `AboutView` — ПІБ, Technical skills, GitHub | `title` |
| `/users?page=2&q=john&sort=age&order=desc` | `UsersView` — переможці, форма створення, таблиця з пагінацією, пошуком і сортуванням | `requiresAuth` |
| `/users/:id` | `UserDetailsView` — повна інформація (`props: true`) | `requiresAuth` (успадковується) |
| `/users/:id/edit` | `UserEditView` — вкладений маршрут у `<RouterView>` сторінки учасника | `requiresAuth` (успадковується) |
| `/login` | `LoginView` в `AuthLayout` | `layout: 'auth'`, `guestOnly` |
| `/:pathMatch(.*)*` | `NotFoundView` — 404 з посиланням на головну | `title` |

Усі сторінки завантажуються ліниво (`component: () => import(...)`) — кожна в окремому чанку.
Використовується `createWebHashHistory()`: GitHub Pages не вміє віддавати `index.html` для довільних шляхів.

## Вимоги → де реалізовано

| Вимога | Де |
|---|---|
| vue-router | `src/router/index.ts` |
| `<AppHeader>`, `<AppNavigation>` (Home, About author, Users, Login; активний пункт), `<AppLogo>` | `src/components/layout/` — `active-class` у `RouterLink` |
| Home / About / 404 | `src/views/HomeView.vue`, `AboutView.vue`, `NotFoundView.vue` |
| Ліниве завантаження сторінок | `src/router/index.ts` |
| Узагальнені інтерфейси `Readable`, `Creatable`, `Editable`, `Deletable` (+ `Searchable`) | `src/services/interfaces.ts` |
| Тип `User` за схемою DummyJSON, `CreateUserDto`, `UpdateUserDto` | `src/types/user.ts` |
| `UserService`, `AuthService` | `src/services/user.service.ts`, `auth.service.ts` |
| Фабрика `ServiceProvider` | `src/services/service-provider.ts` |
| HTTP-клієнт з базовою адресою з `VITE_API_URL` | `src/api/http-client.ts`; `.env.example`, `.env` у `.gitignore` |
| Таблиця з DummyJSON Users, пагінація `limit`/`skip`, пошук, стан у query-параметрах | `src/views/UsersView.vue`, `src/composables/useUsersQuery.ts` |
| Динамічний маршрут `/users/:id`, `props: true` | `src/router/index.ts`, `UserDetailsView.vue` |
| Вкладений маршрут `/users/:id/edit` | `UserDetailsView.vue` (`<RouterView v-slot>`), `UserEditView.vue` |
| Поля форм: firstName, lastName, email, username, password, age, gender, phone | `src/components/users/UserForm.vue` |
| Локальний стан після імітованих POST/PUT/DELETE | `src/stores/users.ts` → `applyLocalChanges` |
| Логін через `POST /auth/login`; токени в Pinia і localStorage; `/auth/me` з `Authorization: Bearer`; Login ↔ Logout | `src/stores/auth.ts`, `LoginView.vue`, `AppNavigation.vue`, `main.ts` |
| Guard з `meta.requiresAuth`, `?redirect=`, авторизований з `/login` → `/users` | `src/router/guards.ts` |
| Стани loading / error; помилка авторизації у формі | `UsersView.vue`, `UserDetailsView.vue`, `LoginView.vue`, `UserForm.vue` |
| VeeValidate + zod: обов'язкові поля, email, мінімальна довжина пароля | `src/validation/schemas.ts` |
| Заголовок вкладки через `meta.title` і `router.afterEach` | `src/router/index.ts` |
| Автоматичне оновлення `accessToken` через `POST /auth/refresh` при 401 | `src/api/http-client.ts` + `src/plugins/auth-interceptor.ts` |
| Layouts через `meta.layout` | `src/App.vue`, `src/layouts/DefaultLayout.vue`, `AuthLayout.vue` |
| Деплой на gh-pages | `npm run deploy` (`base: './'` у `vite.config.ts`) |

## Патерн Repository

```
UsersView.vue / stores/users.ts            ← клієнтський код: лише методи репозиторію
        │
ServiceProvider.users / .auth              ← фабрика, одна точка отримання сервісів
        │
UserService / AuthService                  ← реалізують Readable, Searchable, Creatable, Editable, Deletable
        │
api/http-client.ts                         ← fetch, VITE_API_URL, заголовки, помилки, interceptor 401
        │
DummyJSON REST API
```

Компоненти не знають ні про `fetch`, ні про URL. Щоб замінити джерело даних (інший API, localStorage, фейк
для тестів), достатньо нової реалізації інтерфейсів і `ServiceProvider.override({ users: new FakeUserService() })`.

## Рішення та нюанси

- **DummyJSON лише імітує зміни.** `POST /users/add` щоразу повертає `id = 209`, тому стор робить id унікальним.
  Створені, оновлені й видалені користувачі зберігаються в сторі (і в localStorage) та накладаються на кожну
  сторінку з API — після дії список одразу актуальний без перезавантаження.
- **Оновлення токена.** Якщо кілька запитів одночасно отримали 401, усі чекають на одне оновлення токена
  (`pendingRefresh`), після чого запит повторюється один раз. Якщо refreshToken теж недійсний — вихід і
  перехід на `/login?redirect=...`.
- **`?redirect=`** приймає лише внутрішні шляхи (`safeRedirect`), щоб посилання не вело на сторонній сайт.
- **Застарілі відповіді.** При швидкому перемиканні сторінок відповідь на старий запит ігнорується (`requestId`).
- **Переможці** обираються серед учасників поточної сторінки (до трьох), видалений учасник зникає й з переможців.

## Відповіді на контрольні запитання

**1. Що таке патерн репозиторій і для чого він використовується?**
Патерн, що відокремлює логіку доступу до даних від решти застосунку. Клієнтський код викликає методи
репозиторію (`getAll`, `getById`, `create`, …) і не знає, звідки беруться дані. У проєкті — `UserService`, `AuthService`.

**2. Які компоненти включаються в реалізацію патерну?**
Модель (`types/user.ts`), інтерфейси-контракти (`services/interfaces.ts`), HTTP-клієнт (`api/http-client.ts`),
репозиторій (`UserService`), фабрика (`ServiceProvider`) і клієнтський код (стор, компоненти).

**3. Яка роль моделі?**
Описує форму даних (`User`, `CreateUserDto`, `UpdateUserDto`) — це контракт між API, репозиторієм і UI,
який перевіряє TypeScript.

**4. Як патерн допомагає відокремити доступ до даних від бізнес-логіки?**
Мережа, URL і формат відповіді — лише в сервісах і HTTP-клієнті. Бізнес-логіка (стор `users`: локальні зміни,
вибір переможців) працює з методами інтерфейсу. Зміна API зачіпає тільки сервіс.

**5. Як патерн сприяє тестованості?**
Код залежить від інтерфейсу, тож реальний сервіс легко замінити фейком
(`ServiceProvider.override(...)`) — тести не ходять у мережу.

**6. Які переваги дає патерн?**
Розділення відповідальностей, тестованість, повторне використання, абстракція джерел даних, легке розширення
без змін клієнтського коду, менше дублювання й помилок.

**7. Що таке Vue Router і для чого він використовується?**
Офіційна бібліотека маршрутизації Vue: зіставляє URL з компонентами й перемикає сторінки SPA без
перезавантаження. Підтримує параметри, вкладені маршрути, guard-и, lazy loading.

**8. Як оголошуються маршрути?**
Масивом `RouteRecordRaw` (`path`, `name`, `component`, `props`, `meta`, `children`), який передається в
`createRouter({ history, routes })`, після чого `app.use(router)`.

**9. Чим відрізняються RouterLink і RouterView?**
`RouterLink` — посилання для навігації без перезавантаження (з класами активного пункту).
`RouterView` — місце, куди рендериться компонент поточного маршруту.

**10. Як передати параметри маршруту в компонент?**
`props: true` — параметр `:id` приходить як prop `id` (`defineProps<{ id: string }>()`). Інший спосіб —
`useRoute().params.id`, але тоді компонент прив'язаний до роутера.

**11. Як створити вкладені маршрути?**
Полем `children` батьківського маршруту; дочірній компонент рендериться в `<RouterView>` батьківського.
У проєкті: `/users/:id` → `children: [{ path: 'edit' }]`.

**12. Як працюють навігаційні guard-и?**
Функції, що виконуються до (`beforeEach`, `beforeEnter`) або після (`afterEach`) переходу. Повернення
`true`/`undefined` дозволяє перехід, `false` скасовує, маршрут — перенаправляє. У проєкті `checkAccess`
пускає на `/users` лише авторизованих, а з `/login` перенаправляє авторизованих на `/users`.

**13. Для чого використовується поле `meta`?**
Для довільних даних маршруту, які читають guard-и й компоненти: `requiresAuth`, `guestOnly`, `title`,
`layout`. `to.meta` об'єднує meta всіх збігів, тому вкладені маршрути успадковують `requiresAuth`.

**14. Як організувати структуру Layouts?**
Компоненти-обгортки зі слотом (`DefaultLayout` з шапкою, `AuthLayout` для логіну). `App.vue` обирає layout за
`route.meta.layout`: `<component :is="layout"><RouterView /></component>`.

**15. Що таке JWT і з яких частин він складається? Де безпечніше зберігати і які ризики має localStorage?**
JSON Web Token — підписаний токен `header.payload.signature` (Base64URL): алгоритм, дані (id, термін дії `exp`)
і підпис сервера. Найбезпечніше — `httpOnly`, `Secure`, `SameSite` cookie, недоступна з JavaScript.
`localStorage` читає будь-який скрипт на сторінці, тому при XSS токен можна викрасти; він також живе до явного видалення.

**16. Чим відрізняються accessToken та refreshToken?**
`accessToken` — короткоживучий, передається в `Authorization: Bearer` до захищених ендпоінтів.
`refreshToken` — довгоживучий, лише для отримання нового `accessToken` через `/auth/refresh`
(у проєкті — автоматично при відповіді 401).

**17. Чому query-параметри краще підходять для пагінації та пошуку, ніж локальний стан компонента?**
Стан у URL: посиланням можна поділитися, він переживає перезавантаження, працюють кнопки «Назад/Вперед».
Локальний стан губиться при перезавантаженні чи переході.

**18. Чому після `DELETE /users/:id` на DummyJSON користувач залишається в списку, і як це виправити?**
DummyJSON лише імітує видалення: відповідає успіхом, але дані не змінює, тож наступний `GET` знову повертає
користувача. Рішення — після успішної відповіді оновити локальний стан: стор `users` пам'ятає `deletedIds`
(а також `created` і `updated`) і накладає їх на кожну сторінку з API.
