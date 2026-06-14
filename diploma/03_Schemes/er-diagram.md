# ER-диаграмма базы данных

## Диаграмма «сущность — связь»

```mermaid
erDiagram
    locations ||--o{ reservations : "принимает"
    menu_categories ||--o{ menu_items : "содержит"

    locations {
        TEXT id PK
        TEXT label
        TEXT full_address
        TEXT phone
        INTEGER is_active
    }

    menu_categories {
        TEXT id PK
        TEXT label
        INTEGER sort_order
    }

    menu_items {
        INTEGER id PK
        TEXT category_id FK
        TEXT name
        TEXT description
        TEXT price_label
        INTEGER price_amount
        INTEGER is_available
    }

    reservations {
        INTEGER id PK
        TEXT confirmation_code UK
        TEXT location_id FK
        TEXT guest_name
        TEXT guest_phone
        TEXT reservation_date
        TEXT reservation_time
        INTEGER guests_count
        TEXT comment
        TEXT status
        TEXT created_at
        TEXT updated_at
    }

    promotions {
        INTEGER id PK
        TEXT title
        TEXT description
        TEXT discount_label
        TEXT valid_until
        INTEGER is_active
        INTEGER sort_order
    }

    admin_users {
        INTEGER id PK
        TEXT email UK
        TEXT password_hash
        TEXT created_at
    }
```

## Статусы бронирования

| status | Описание |
|--------|----------|
| pending | Ожидает подтверждения |
| confirmed | Подтверждена администратором |
| cancelled | Отменена |
| completed | Завершена (гость посетил) |

## Индексы

- `idx_reservations_date_time` — быстрый поиск занятости слотов
- `idx_reservations_status` — фильтрация в админ-панели
