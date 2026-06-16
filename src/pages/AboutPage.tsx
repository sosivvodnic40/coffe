import { ABOUT_IMAGE, COLORS } from '../data/constants';
import PageTitle from '../components/PageTitle';

export default function AboutPage() {
  return (
    <section className="py-20 px-6">
      <div className="max-w-6xl mx-auto">
        <PageTitle label="О нас" title="Место, куда хочется возвращаться" />
        <div className="grid md:grid-cols-2 gap-16 items-center">
          <div>
            <p className="mb-6" style={{ color: COLORS.muted, lineHeight: 1.9 }}>
              Cappuccino — это кофейня с характером. Два уютных заведения в Астане, где с утра пахнет
              свежей выпечкой и хорошим кофе. Мы любим завтраки — поэтому делаем их весь день.
            </p>
            <p style={{ color: COLORS.muted, lineHeight: 1.9 }}>
              В нашем меню — авторские блюда из свежих продуктов: от классических стейков и пасты до
              тёплых салатов и хачапури. Всё готовится на открытой кухне.
            </p>
            <div className="mt-10 pl-6" style={{ borderLeft: `2px solid ${COLORS.gold}` }}>
              <p style={{ fontFamily: "'Playfair Display', serif", fontSize: '18px', color: COLORS.cream, fontStyle: 'italic' }}>
                «Хорошее утро начинается с хорошего кофе — и мы знаем, как его приготовить»
              </p>
            </div>
          </div>
          <img src={ABOUT_IMAGE} alt="Cappuccino" className="w-full object-cover" style={{ height: '460px' }} />
        </div>
      </div>
    </section>
  );
}
