import PageTitle from '../components/PageTitle';
import { COLORS, GALLERY_IMAGES } from '../data/constants';

export default function GalleryPage() {
  return (
    <section className="py-20 px-6" style={{ background: COLORS.bgDark }}>
      <div className="max-w-6xl mx-auto">
        <PageTitle label="Галерея" title="Атмосфера кофейни" />
        <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
          {GALLERY_IMAGES.map((src) => (
            <div key={src} className="overflow-hidden" style={{ aspectRatio: '4/3' }}>
              <img
                src={src}
                alt="Cappuccino"
                className="w-full h-full object-cover hover:scale-105 transition-transform duration-700"
                style={{ filter: 'brightness(0.85)' }}
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
