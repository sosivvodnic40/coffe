ЭЛЕКТРОННЫЙ АРХИВ ДИПЛОМНОГО ПРОЕКТА
=====================================

Имя архива: ДП_ИС-23-19б_Новик_Cappuccino_2026.zip

Студент: Новик Илья Витальевич
Группа: ИС-23-19б
Тема: Сайт ресторана итальянской кухни «Cappuccino»

СОСТАВ АРХИВА
-------------
01_PZ/              — пояснительная записка (MD → перенести в Word/PDF)
02_Presentation/    — презентация (slides.md → PowerPoint)
03_Schemes/         — архитектура, ER, диаграмма бронирования
04_Code/            — исходный код проекта
05_DB_API/          — спецификация API и схема БД
06_Testing/         — протокол тестирования + npm test
07_UI_Docs_Economics/ — инструкции и экономика
08_Screenshots/     — скриншоты интерфейса (добавить PNG)

СБОРКА АРХИВА
-------------
powershell -ExecutionPolicy Bypass -File scripts/create-diploma-archive.ps1

ПОРЯДОК ПРОВЕРКИ
----------------
1. Установить Node.js 18+
2. Распаковать 04_Code/ или клонировать репозиторий
3. Выполнить:
   npm install
   cp .env.example .env
   npm run dev
4. Открыть http://localhost:5173 — главная страница сайта
5. Проверить разделы: О нас, Меню, Акции, Галерея, Резервация, Контакты
6. Создать тестовую бронь через форму
7. Проверить бронь по коду CP-XXXXXX
8. Открыть http://localhost:5173/admin — панель администратора
9. Войти: admin@cappuccino.kz / Cappuccino2025!
10. Проверить список броней и смену статуса
11. Запустить автотесты: npm test
12. Production-режим: npm run build && npm start → http://localhost:3001

ОСТАЛОСЬ ДО 100%
-----------------
- Перенести 01_PZ/poyasnitelnaya-zapiska.md в Word по шаблону колледжа
- Сделать slides.pptx из 02_Presentation/slides.md
- Добавить скриншоты в 08_Screenshots/ (см. README там)

API HEALTH CHECK
----------------
GET http://localhost:3001/api/health

КОНТАКТЫ РАЗРАБОТЧИКА
---------------------
Колледж: ГКП на ПХВ «ASTANA POLYTECHNIC»
Специальность: 06130100 «Программное обеспечение»
