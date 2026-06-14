# Схема базы данных SQLite

Файл: `data/cappuccino.db`

## ER-описание

```
locations (1) ──< (N) reservations
menu_categories (1) ──< (N) menu_items
admin_users — отдельная таблица администраторов
promotions — акции ресторана
```

## Таблицы

### locations
| Поле | Тип | Описание |
|------|-----|----------|
| id | TEXT PK | kabanbay, alfarabi |
| label | TEXT | Краткое название |
| full_address | TEXT | Полный адрес |
| phone | TEXT | Телефон |
| is_active | INTEGER | 1 = активна |

### menu_categories
| Поле | Тип | Описание |
|------|-----|----------|
| id | TEXT PK | breakfast, salads, ... |
| label | TEXT | Название категории |
| sort_order | INTEGER | Порядок сортировки |

### menu_items
| Поле | Тип | Описание |
|------|-----|----------|
| id | INTEGER PK | |
| category_id | TEXT FK | |
| name | TEXT | Название блюда |
| description | TEXT | Описание |
| price_label | TEXT | «4 200 ₸» |
| price_amount | INTEGER | Цена в тенге |
| is_available | INTEGER | Доступность |

### reservations
| Поле | Тип | Описание |
|------|-----|----------|
| id | INTEGER PK | |
| confirmation_code | TEXT UNIQUE | CP-XXXXXX |
| location_id | TEXT FK | |
| guest_name | TEXT | |
| guest_phone | TEXT | |
| reservation_date | TEXT | YYYY-MM-DD |
| reservation_time | TEXT | HH:MM |
| guests_count | INTEGER | |
| comment | TEXT | |
| status | TEXT | pending/confirmed/cancelled/completed |
| created_at | TEXT | |
| updated_at | TEXT | |

### promotions
| Поле | Тип | Описание |
|------|-----|----------|
| id | INTEGER PK | |
| title | TEXT | Название акции |
| description | TEXT | Описание |
| discount_label | TEXT | «-15%» |
| valid_until | TEXT | Дата окончания |
| is_active | INTEGER | |
| sort_order | INTEGER | |

### admin_users
| Поле | Тип | Описание |
|------|-----|----------|
| id | INTEGER PK | |
| email | TEXT UNIQUE | |
| password_hash | TEXT | bcrypt |
| created_at | TEXT | |

## Индексы

- idx_reservations_date_time (reservation_date, reservation_time, location_id)
- idx_reservations_status (status)
