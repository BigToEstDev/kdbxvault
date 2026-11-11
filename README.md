# pass-web

Сайт приложения — статический, Astro + Tailwind CSS + TypeScript. Репозиторий закрытый; само приложение и ядро —
открытые.

## Требования

- Node.js 26 (`.nvmrc`), npm.

## Команды

| Команда                           | Что делает                                                      |
| --------------------------------- | --------------------------------------------------------------- |
| `npm install`                     | установить зависимости (версии закреплены, `package-lock.json`) |
| `npm run dev`                     | dev-сервер, `http://localhost:4321`                             |
| `npm run build`                   | сборка в статику — `dist/`                                      |
| `npm run preview`                 | открыть собранный `dist/`                                       |
| `npm run check`                   | проверка типов (`astro check`)                                  |
| `npm run lint`                    | ESLint (TS, Astro, доступность)                                 |
| `npm run format` / `format:check` | Prettier: исправить / проверить                                 |
| `npm run verify`                  | всё перед коммитом: check, lint, format:check, build            |

## Структура

- `src/pages/` — страницы (маршрут = путь файла).
- `src/styles/global.css` — Tailwind.
- `public/` — файлы как есть (иконки).

## Переменные

URL и прочие настройки — в `.env` (образец — `.env.example`), не в коде.
