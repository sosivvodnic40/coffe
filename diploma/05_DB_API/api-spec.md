# Спецификация REST API — Cappuccino

Базовый URL: `http://localhost:3001/api`

## Публичные endpoints

### GET /health
Проверка работоспособности сервера.

**Ответ 200:**
```json
{ "status": "ok", "service": "cappuccino-api", "timestamp": "..." }
```

### GET /menu
Получение меню по категориям.

### GET /locations
Список локаций ресторана.

### GET /promotions
Список активных акций.

### GET /info
Общая информация: бренд, часы работы, статистика, галерея.

### GET /reservations/availability?date=YYYY-MM-DD&locationId=kabanbay&guests=2
Доступные временные слоты для бронирования.

### POST /reservations
Создание брони.

**Тело запроса:**
```json
{
  "locationId": "kabanbay",
  "name": "Иван Иванов",
  "phone": "+77752188899",
  "date": "2026-06-20",
  "time": "12:00",
  "guests": "2",
  "comment": "У окна"
}
```

**Ответ 201:** объект reservation с confirmationCode.

### GET /reservations/lookup/:code
Поиск брони по коду (например CP-KME4WM).

## Административные endpoints (JWT)

Заголовок: `Authorization: Bearer <token>`

### POST /admin/login
```json
{ "email": "admin@cappuccino.kz", "password": "..." }
```

### GET /admin/stats
Статистика: всего броней, ожидающих, подтверждённых сегодня.

### GET /admin/reservations?status=pending
Список броней (фильтр по статусу опционален).

### PATCH /admin/reservations/:id
```json
{ "status": "confirmed" }
```
Статусы: pending, confirmed, cancelled, completed.

## Коды ошибок

| Код | Описание |
|-----|----------|
| 400 | Ошибка валидации |
| 401 | Не авторизован |
| 404 | Не найдено |
| 409 | Нет свободных мест |
| 500 | Внутренняя ошибка |
