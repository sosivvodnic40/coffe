import type Database from 'better-sqlite3';
import bcrypt from 'bcryptjs';
import { config } from '../config.js';

const MENU_CATEGORIES = [
  {
    id: 'breakfast',
    label: 'Завтраки',
    items: [
      { name: 'Атлантик', desc: 'Яйца, лосось, руккола, крем-сыр, хлеб на выбор', price: '4 200 ₸', amount: 4200 },
      { name: 'Омлет с авокадо', desc: 'Нежный омлет, авокадо, помидоры черри, зелень', price: '2 230 ₸', amount: 2230 },
      { name: 'Омлет со страчателлой', desc: 'Пышный омлет, итальянская страчателла, трюфельное масло', price: '2 950 ₸', amount: 2950 },
      { name: 'Гречка с авокадо', desc: 'Гречневая каша, авокадо, яйцо пашот, соус тахини', price: '2 230 ₸', amount: 2230 },
      { name: 'Скрэмбл со страчателлой', desc: 'Яйца скрэмбл, страчателла, хрустящий бекон, тост', price: '2 950 ₸', amount: 2950 },
      { name: 'Блинны с мясом', desc: 'Тонкие блинчики с начинкой из говядины и грибов', price: '3 200 ₸', amount: 3200 },
      { name: 'Хачапури', desc: 'Классический хачапури по-аджарски с яйцом и сливочным маслом', price: '2 950 ₸', amount: 2950 },
      { name: 'BIG сет Cappuccino', desc: 'Яйца на выбор, бекон, сосиска, тост, салат, сок, кофе', price: '5 950 ₸', amount: 5950 },
    ],
  },
  {
    id: 'salads',
    label: 'Салаты',
    items: [
      { name: 'Цезарь с курицей', desc: 'Романо, куриное филе гриль, пармезан, гренки, соус цезарь', price: '3 950 ₸', amount: 3950 },
      { name: 'Цезарь с креветками', desc: 'Романо, тигровые креветки, пармезан, гренки, соус цезарь', price: '4 550 ₸', amount: 4550 },
      { name: 'Салат с уткой', desc: 'Микс-салат, утиная грудка, клубника, грецкий орех, бальзамик', price: '4 550 ₸', amount: 4550 },
      { name: 'Греческий', desc: 'Огурцы, помидоры, оливки, фета, красный лук, орегано', price: '2 950 ₸', amount: 2950 },
      { name: 'Теплый салат с лососем', desc: 'Слабосолёный лосось, авокадо, руккола, лимонная заправка', price: '4 550 ₸', amount: 4550 },
      { name: 'Теплый салат с курицей', desc: 'Курица гриль, баклажан, болгарский перец, соус песто', price: '3 650 ₸', amount: 3650 },
      { name: 'Хрустящие баклажаны', desc: 'Обжаренные баклажаны, страчателла, томаты, зелень', price: '3 550 ₸', amount: 3550 },
    ],
  },
  {
    id: 'soups',
    label: 'Супы',
    items: [
      { name: 'Окрошка', desc: 'Традиционная окрошка на квасе или кефире, говядина, зелень', price: '2 500 ₸', amount: 2500 },
      { name: 'Борщ по-домашнему', desc: 'Наваристый борщ со свининой, сметана, чесночные пампушки', price: '3 250 ₸', amount: 3250 },
      { name: 'Солянка', desc: 'Мясная солянка с оливками, лимоном и сметаной', price: '3 500 ₸', amount: 3500 },
      { name: 'Куриный суп', desc: 'Домашний куриный бульон, лапша, овощи, зелень', price: '1 950 ₸', amount: 1950 },
      { name: 'Tom Bo', desc: 'Острый тайский суп с говядиной, кокосовым молоком и лемонграссом', price: '4 500 ₸', amount: 4500 },
      { name: 'Холодный свекольный', desc: 'Охлаждённый суп из свёклы, огурец, яйцо, сметана', price: '1 750 ₸', amount: 1750 },
    ],
  },
  {
    id: 'hot',
    label: 'Горячие блюда',
    items: [
      { name: 'Бефстроганов', desc: 'Говядина в сливочно-грибном соусе, картофельное пюре', price: '3 700 ₸', amount: 3700 },
      { name: 'Курица по-тайски', desc: 'Куриное филе в соусе карри, кокосовое молоко, рис жасмин', price: '3 450 ₸', amount: 3450 },
      { name: 'Цыплёнок на открытом огне', desc: 'Цыплёнок табака, зелень, соус наршараб', price: '5 500 ₸', amount: 5500 },
      { name: 'Котлета по-киевски', desc: 'Классическая котлета, сливочное масло с зеленью, пюре', price: '3 950 ₸', amount: 3950 },
      { name: 'Запечённая индейка', desc: 'Индейка с салатом табуле, гранатовый соус, зелень', price: '5 550 ₸', amount: 5550 },
      { name: 'Бараньи рёбрышки', desc: 'Рёбра ягнёнка гриль, маринад тандури, соус из граната', price: '7 500 ₸', amount: 7500 },
      { name: 'Карамелизированный перец', desc: 'Фаршированный перец, томатный соус, сыр, зелень', price: '3 750 ₸', amount: 3750 },
      { name: 'Стейк из свёклы', desc: 'Свёкла гриль, страчателла, грецкий орех, бальзамик', price: '2 155 ₸', amount: 2155 },
    ],
  },
  {
    id: 'steaks',
    label: 'Стейки',
    items: [
      { name: 'Рибай 400г', desc: 'Мраморная говядина Рибай, соус на выбор, гарнир', price: '10 950 ₸', amount: 10950 },
      { name: 'Деревенский 400г', desc: 'Деревенский стейк, травяное масло, картофель по-домашнему', price: '12 450 ₸', amount: 12450 },
      { name: 'Алтайское', desc: 'Нежная говядина из Алтая, томлёная в собственном соку', price: '3 050 ₸', amount: 3050 },
      { name: 'Карбонара', desc: 'Стейк в соусе карбонара, панчетта, пармезан', price: '4 750 ₸', amount: 4750 },
      { name: 'Со страчателлой', desc: 'Стейк, итальянская страчателла, руккола, трюфельное масло', price: '4 150 ₸', amount: 4150 },
      { name: 'С лососем и страчателлой', desc: 'Стейк, слабосолёный лосось, страчателла, каперсы', price: '4 550 ₸', amount: 4550 },
    ],
  },
  {
    id: 'pizza',
    label: 'Пицца',
    items: [
      { name: 'Маргарита', desc: 'Томатный соус Сан-Марцано, моцарелла фиор ди латте, базилик', price: '3 950 ₸', amount: 3950 },
      { name: 'Пепперони', desc: 'Томатный соус, моцарелла, острое пепперони, орегано', price: '4 150 ₸', amount: 4150 },
      { name: 'Четыре сыра', desc: 'Моцарелла, горгонзола, пармезан, страчателла, мёд', price: '4 450 ₸', amount: 4450 },
      { name: 'Карбонара', desc: 'Соус бешамель, панчетта, моцарелла, яйцо, пармезан', price: '4 250 ₸', amount: 4250 },
      { name: 'Со страчателлой', desc: 'Томатный соус, моцарелла, вяленые томаты, страчателла', price: '4 450 ₸', amount: 4450 },
    ],
  },
];

export function seedDatabase(database: Database.Database): void {
  const insertLocation = database.prepare(`
    INSERT INTO locations (id, label, full_address, phone)
    VALUES (@id, @label, @full_address, @phone)
  `);

  insertLocation.run({
    id: 'kabanbay',
    label: 'Кабанбай Батыр',
    full_address: 'пр. Кабанбай Батыр, 5/3',
    phone: '+7 775 218 88 99',
  });

  insertLocation.run({
    id: 'alfarabi',
    label: 'Аль-Фараби',
    full_address: 'проспект Аль-Фараби, 9',
    phone: '+7 702 288 78 91',
  });

  const insertCategory = database.prepare(`
    INSERT INTO menu_categories (id, label, sort_order)
    VALUES (@id, @label, @sort_order)
  `);

  const insertItem = database.prepare(`
    INSERT INTO menu_items (category_id, name, description, price_label, price_amount)
    VALUES (@category_id, @name, @description, @price_label, @price_amount)
  `);

  MENU_CATEGORIES.forEach((category, index) => {
    insertCategory.run({ id: category.id, label: category.label, sort_order: index });
    category.items.forEach((item) => {
      insertItem.run({
        category_id: category.id,
        name: item.name,
        description: item.desc,
        price_label: item.price,
        price_amount: item.amount,
      });
    });
  });

  const passwordHash = bcrypt.hashSync(config.adminPassword, 10);
  database.prepare(`
    INSERT INTO admin_users (email, password_hash)
    VALUES (?, ?)
  `).run(config.adminEmail, passwordHash);

  seedPromotions(database);
}

const PROMOTIONS = [
  {
    title: 'Завтрак всё включено',
    description: 'Кофе + выпечка + яйца по специальной цене с 09:00 до 12:00 каждый день.',
    discount_label: '-15%',
    valid_until: '2026-12-31',
    sort_order: 0,
  },
  {
    title: 'Итальянский вечер',
    description: 'Паста и пицца из нашего меню со скидкой по пятницам после 18:00.',
    discount_label: '-20%',
    valid_until: '2026-09-30',
    sort_order: 1,
  },
  {
    title: 'Сет для двоих',
    description: 'Два основных блюда, десерт и напитки — идеально для романтического ужина.',
    discount_label: '5 900 ₸',
    valid_until: '2026-08-31',
    sort_order: 2,
  },
  {
    title: 'День рождения',
    description: 'Имениннику десерт в подарок при бронировании столика от 4 человек.',
    discount_label: 'Подарок',
    valid_until: '2026-12-31',
    sort_order: 3,
  },
];

export function seedPromotions(database: Database.Database): void {
  const insert = database.prepare(`
    INSERT INTO promotions (title, description, discount_label, valid_until, sort_order)
    VALUES (@title, @description, @discount_label, @valid_until, @sort_order)
  `);

  PROMOTIONS.forEach((promo) => insert.run(promo));
}
