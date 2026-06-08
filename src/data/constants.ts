import type { LucideIcon } from 'lucide-react';
import { Coffee, Star, UtensilsCrossed, Users } from 'lucide-react';

export const COLORS = {
  bg: '#1e0f06',
  bgDark: '#170c04',
  bgCard: '#2c1a0c',
  bgFooter: '#110904',
  gold: '#c9a84c',
  cream: '#f2e8d9',
  muted: '#9a8470',
  border: 'rgba(201,168,76,0.18)',
} as const;

export const CONTACT = {
  instagram: '@cappuccino_astana',
  phones: ['+7 775 218 88 99', '+7 702 288 78 91'],
  addresses: [
    { label: 'Кабанбай Батыр', full: 'пр. Кабанбай Батыр, 5/3' },
    { label: 'Аль-Фараби', full: 'проспект Аль-Фараби, 9' },
  ],
  hours: {
    weekdays: '09:00 – 23:00',
    weekend: '10:00 – 00:00',
  },
};

export const NAV_LINKS = [
  { label: 'О нас', href: '#about' },
  { label: 'Меню', href: '#menu' },
  { label: 'Галерея', href: '#gallery' },
  { label: 'Резервация', href: '#reservation' },
  { label: 'Контакты', href: '#contact' },
];

export type MenuItem = { name: string; desc: string; price: string };
export type MenuCategory = { id: string; label: string; items: MenuItem[] };

export const MENU_CATEGORIES: MenuCategory[] = [
  {
    id: 'breakfast',
    label: 'Завтраки',
    items: [
      { name: 'Атлантик', desc: 'Яйца, лосось, руккола, крем-сыр, хлеб на выбор', price: '4 200 ₸' },
      { name: 'Омлет с авокадо', desc: 'Нежный омлет, авокадо, помидоры черри, зелень', price: '2 230 ₸' },
      { name: 'Омлет со страчателлой', desc: 'Пышный омлет, итальянская страчателла, трюфельное масло', price: '2 950 ₸' },
      { name: 'Гречка с авокадо', desc: 'Гречневая каша, авокадо, яйцо пашот, соус тахини', price: '2 230 ₸' },
      { name: 'Скрэмбл со страчателлой', desc: 'Яйца скрэмбл, страчателла, хрустящий бекон, тост', price: '2 950 ₸' },
      { name: 'Блинны с мясом', desc: 'Тонкие блинчики с начинкой из говядины и грибов', price: '3 200 ₸' },
      { name: 'Хачапури', desc: 'Классический хачапури по-аджарски с яйцом и сливочным маслом', price: '2 950 ₸' },
      { name: 'BIG сет Cappuccino', desc: 'Яйца на выбор, бекон, сосиска, тост, салат, сок, кофе', price: '5 950 ₸' },
    ],
  },
  {
    id: 'salads',
    label: 'Салаты',
    items: [
      { name: 'Цезарь с курицей', desc: 'Романо, куриное филе гриль, пармезан, гренки, соус цезарь', price: '3 950 ₸' },
      { name: 'Цезарь с креветками', desc: 'Романо, тигровые креветки, пармезан, гренки, соус цезарь', price: '4 550 ₸' },
      { name: 'Салат с уткой', desc: 'Микс-салат, утиная грудка, клубника, грецкий орех, бальзамик', price: '4 550 ₸' },
      { name: 'Греческий', desc: 'Огурцы, помидоры, оливки, фета, красный лук, орегано', price: '2 950 ₸' },
      { name: 'Теплый салат с лососем', desc: 'Слабосолёный лосось, авокадо, руккола, лимонная заправка', price: '4 550 ₸' },
      { name: 'Теплый салат с курицей', desc: 'Курица гриль, баклажан, болгарский перец, соус песто', price: '3 650 ₸' },
      { name: 'Хрустящие баклажаны', desc: 'Обжаренные баклажаны, страчателла, томаты, зелень', price: '3 550 ₸' },
    ],
  },
  {
    id: 'soups',
    label: 'Супы',
    items: [
      { name: 'Окрошка', desc: 'Традиционная окрошка на квасе или кефире, говядина, зелень', price: '2 500 ₸' },
      { name: 'Борщ по-домашнему', desc: 'Наваристый борщ со свининой, сметана, чесночные пампушки', price: '3 250 ₸' },
      { name: 'Солянка', desc: 'Мясная солянка с оливками, лимоном и сметаной', price: '3 500 ₸' },
      { name: 'Куриный суп', desc: 'Домашний куриный бульон, лапша, овощи, зелень', price: '1 950 ₸' },
      { name: 'Tom Bo', desc: 'Острый тайский суп с говядиной, кокосовым молоком и лемонграссом', price: '4 500 ₸' },
      { name: 'Холодный свекольный', desc: 'Охлаждённый суп из свёклы, огурец, яйцо, сметана', price: '1 750 ₸' },
    ],
  },
  {
    id: 'hot',
    label: 'Горячие блюда',
    items: [
      { name: 'Бефстроганов', desc: 'Говядина в сливочно-грибном соусе, картофельное пюре', price: '3 700 ₸' },
      { name: 'Курица по-тайски', desc: 'Куриное филе в соусе карри, кокосовое молоко, рис жасмин', price: '3 450 ₸' },
      { name: 'Цыплёнок на открытом огне', desc: 'Цыплёнок табака, зелень, соус наршараб', price: '5 500 ₸' },
      { name: 'Котлета по-киевски', desc: 'Классическая котлета, сливочное масло с зеленью, пюре', price: '3 950 ₸' },
      { name: 'Запечённая индейка', desc: 'Индейка с салатом табуле, гранатовый соус, зелень', price: '5 550 ₸' },
      { name: 'Бараньи рёбрышки', desc: 'Рёбра ягнёнка гриль, маринад тандури, соус из граната', price: '7 500 ₸' },
      { name: 'Карамелизированный перец', desc: 'Фаршированный перец, томатный соус, сыр, зелень', price: '3 750 ₸' },
      { name: 'Стейк из свёклы', desc: 'Свёкла гриль, страчателла, грецкий орех, бальзамик', price: '2 155 ₸' },
    ],
  },
  {
    id: 'steaks',
    label: 'Стейки',
    items: [
      { name: 'Рибай 400г', desc: 'Мраморная говядина Рибай, соус на выбор, гарнир', price: '10 950 ₸' },
      { name: 'Деревенский 400г', desc: 'Деревенский стейк, травяное масло, картофель по-домашнему', price: '12 450 ₸' },
      { name: 'Алтайское', desc: 'Нежная говядина из Алтая, томлёная в собственном соку', price: '3 050 ₸' },
      { name: 'Карбонара', desc: 'Стейк в соусе карбонара, панчетта, пармезан', price: '4 750 ₸' },
      { name: 'Со страчателлой', desc: 'Стейк, итальянская страчателла, руккола, трюфельное масло', price: '4 150 ₸' },
      { name: 'С лососем и страчателлой', desc: 'Стейк, слабосолёный лосось, страчателла, каперсы', price: '4 550 ₸' },
    ],
  },
  {
    id: 'pizza',
    label: 'Пицца',
    items: [
      { name: 'Маргарита', desc: 'Томатный соус Сан-Марцано, моцарелла фиор ди латте, базилик', price: '3 950 ₸' },
      { name: 'Пепперони', desc: 'Томатный соус, моцарелла, острое пепперони, орегано', price: '4 150 ₸' },
      { name: 'Четыре сыра', desc: 'Моцарелла, горгонзола, пармезан, страчателла, мёд', price: '4 450 ₸' },
      { name: 'Карбонара', desc: 'Соус бешамель, панчетта, моцарелла, яйцо, пармезан', price: '4 250 ₸' },
      { name: 'Со страчателлой', desc: 'Томатный соус, моцарелла, вяленые томаты, страчателла', price: '4 450 ₸' },
    ],
  },
];

export const GALLERY_IMAGES = [
  'https://images.unsplash.com/photo-1414235791060-d1e220ecdfc5?w=700&h=520&fit=crop&auto=format',
  'https://images.unsplash.com/photo-1555396273-b63fa82d7802?w=700&h=520&fit=crop&auto=format',
  'https://images.unsplash.com/photo-1424847651672-bf20a4b0982b?w=700&h=520&fit=crop&auto=format',
  'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=700&h=520&fit=crop&auto=format',
  'https://images.unsplash.com/photo-1476224203421-74177f19a496?w=700&h=520&fit=crop&auto=format',
  'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=700&h=520&fit=crop&auto=format',
];

export const HERO_IMAGE =
  'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=1800&h=1200&fit=crop&auto=format';

export const ABOUT_IMAGE =
  'https://images.unsplash.com/photo-1555396273-b63fa82d7802?w=700&h=560&fit=crop&auto=format';

export const STATS: { icon: LucideIcon; value: string; label: string }[] = [
  { icon: Star, value: '4.8', label: 'рейтинг в 2ГИС' },
  { icon: UtensilsCrossed, value: '100+', label: 'позиций в меню' },
  { icon: Users, value: '2', label: 'уютных локации' },
  { icon: Coffee, value: 'с 2013', label: 'создаём атмосферу' },
];

export type ReservationForm = {
  name: string;
  phone: string;
  date: string;
  time: string;
  guests: string;
  comment: string;
};

export const INITIAL_FORM: ReservationForm = {
  name: '',
  phone: '',
  date: '',
  time: '',
  guests: '2',
  comment: '',
};
