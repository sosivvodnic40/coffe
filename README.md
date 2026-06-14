# Cappuccino — сайт ресторана итальянской кухни

Дипломный проект: веб-система ресторана **Cappuccino** (г. Астана) с клиентской частью, серверным API, базой данных и панелью администратора.

**Студент:** Новик Илья Витальевич, группа ИС-23-19б  
**Специальность:** 06130100 «Программное обеспечение»

## Возможности

- Информация о заведении, меню, акциях, галерее, контактах
- Онлайн-бронирование столов с кодом подтверждения
- REST API + SQLite
- Панель администратора: `/admin`
- Автоматизированные тесты API

## Технологии

| Слой | Стек |
|------|------|
| Frontend | React 18, TypeScript, Vite, Tailwind CSS |
| Backend | Node.js, Express, TypeScript |
| БД | SQLite (better-sqlite3) |
| Безопасность | JWT, bcrypt, Helmet, CORS, rate limit, Zod |

## Быстрый старт

```bash
npm install
cp .env.example .env
npm run dev
```

- Сайт: http://localhost:5173  
- API: http://localhost:3001/api/health  
- Админ: http://localhost:5173/admin  

### Учётные данные администратора (по умолчанию)

- Email: `admin@cappuccino.kz`
- Пароль: `Cappuccino2025!`

## Production

```bash
npm run build
npm start
```

Сайт и API доступны на http://localhost:3001

## Тестирование

```bash
npm test
```

## Структура проекта

```
├── src/                 # React frontend
├── server/src/          # Express backend
├── server/tests/        # Автотесты API
├── data/                # SQLite база (создаётся автоматически)
├── diploma/             # Материалы для дипломного архива
└── dist/                # Сборка frontend
```

## Документация

- `diploma/01_PZ/poyasnitelnaya-zapiska.md` — пояснительная записка (черновик)
- `diploma/02_Presentation/slides.md` — презентация к защите
- `diploma/03_Schemes/` — схемы архитектуры и БД
- `diploma/05_DB_API/api-spec.md` — спецификация API
- `diploma/05_DB_API/db-schema.md` — схема БД
- `diploma/06_Testing/test-protocol.md` — протокол тестирования
- `diploma/07_UI_Docs_Economics/user-guide.md` — инструкция пользователя
- `diploma/07_UI_Docs_Economics/admin-guide.md` — инструкция администратора

## Дипломный архив

```powershell
powershell -ExecutionPolicy Bypass -File scripts/create-diploma-archive.ps1
```

Создаёт `ДП_ИС-23-19б_Новик_Cappuccino_2026.zip`

## GitHub

https://github.com/sosivvodnic40/coffe
