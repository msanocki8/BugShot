import Image from "next/image";
import { ArrowRight, Bug } from "lucide-react";

const categories = [
  { label: "Nowości", href: "#nowosci" },
  { label: "Ceramika", href: "#ceramika" },
  { label: "Oświetlenie", href: "#oswietlenie" },
  { label: "Tekstylia", href: "#tekstylia" },
];

const products = [
  {
    name: "Wazon Runo",
    detail: "Ceramika szkliwiona · ręczne wykończenie",
    price: "189 zł",
    image: "/images/ceramics.jpg",
    alt: "Ręcznie wykonane naczynia ceramiczne w ciepłych odcieniach",
    category: "ceramika",
    number: "01",
  },
  {
    name: "Lampa Nami",
    detail: "Oprawa z naturalnego rattanu",
    price: "649 zł",
    image: "/images/pendant-lamp.jpg",
    alt: "Rattanowa lampa wisząca o miękkim, naturalnym świetle",
    category: "oswietlenie",
    number: "02",
  },
  {
    name: "Miejsce do bycia",
    detail: "Kolekcja salonowa · edycja wiosenna",
    price: "od 1 290 zł",
    image: "/images/living-room.jpg",
    alt: "Jasny salon z naturalnymi materiałami i spokojną paletą kolorów",
    category: "tekstylia",
    number: "03",
  },
];

export default function Home() {
  return (
    <div className="storefront">
      <div className="announcement-bar">
        <span>Przedmioty tworzone z myślą o codzienności</span>
        <span className="announcement-divider" aria-hidden="true">/</span>
        <span>Darmowa dostawa od 250 zł</span>
      </div>

      <header className="site-header">
        <a className="wordmark" href="#start" aria-label="Forma Studio, strona główna">
          FORMA<span>STUDIO</span>
        </a>

        <nav className="main-nav" aria-label="Kategorie produktów">
          {categories.map((category) => (
            <a href={category.href} key={category.label}>
              {category.label}
            </a>
          ))}
        </nav>

        <a className="header-note" href="#nowosci">
          Zobacz kolekcję <ArrowRight size={15} strokeWidth={1.7} />
        </a>
      </header>

      <main id="start">
        <section className="hero" aria-labelledby="hero-title">
          <div className="hero-copy">
            <p className="eyebrow"><span /> DOM, KTÓRY MA SWÓJ RYTM</p>
            <h1 id="hero-title">Dobre rzeczy.<br />Na dłużej.</h1>
            <p className="hero-description">
              Przedmioty do domu wybierane spokojnie. Od małych pracowni,
              z dobrych materiałów i z miejscem na codzienne życie.
            </p>
            <a className="hero-link" href="#nowosci">
              Poznaj nasze nowości <ArrowRight size={16} strokeWidth={1.8} />
            </a>
            <div className="hero-footnote">
              <span className="footnote-number">01</span>
              <span>Rzeczy z historią, zanim trafią do Twojego domu.</span>
            </div>
          </div>

          <figure className="hero-image-wrap">
            <Image
              alt="Naturalne wnętrze z drewnianymi meblami i miękkim światłem"
              className="hero-image"
              fill
              loading="eager"
              sizes="(max-width: 760px) 100vw, 58vw"
              src="/images/living-room.jpg"
            />
            <figcaption className="image-caption">
              <span>PRZESTRZEŃ DO ODETCHNIĘCIA</span>
              <span>KOLEKCJA 04 / 26</span>
            </figcaption>
            <span className="image-index" aria-hidden="true">F—04</span>
          </figure>
        </section>

        <section className="collection" id="nowosci" aria-labelledby="collection-title">
          <div className="collection-heading">
            <div>
              <p className="eyebrow">WYBRANE DLA CIEBIE <span className="eyebrow-slash">/</span> WIOSNA 2026</p>
              <h2 id="collection-title">Rzeczy, które zostają.</h2>
            </div>
            <a className="collection-link" href="#ceramika">
              Cała kolekcja <ArrowRight size={15} strokeWidth={1.7} />
            </a>
          </div>

          <div className="product-grid">
            {products.map((product) => (
              <article className="product" id={product.category} key={product.name}>
                <div className="product-image-wrap">
                  <Image
                    alt={product.alt}
                    className="product-image"
                    fill
                    sizes="(max-width: 600px) 50vw, (max-width: 980px) 33vw, 30vw"
                    src={product.image}
                  />
                  <span className="product-number">{product.number}</span>
                </div>
                <div className="product-info">
                  <div>
                    <h3>{product.name}</h3>
                    <p>{product.detail}</p>
                  </div>
                  <span className="product-price">{product.price}</span>
                </div>
              </article>
            ))}
          </div>
        </section>
      </main>

      <footer className="site-footer">
        <span>FORMA STUDIO <span className="footer-divider">/</span> RZECZY DO ŻYCIA</span>
        <span>PROJEKTUJEMY POWOLI, UŻYWAMY DŁUGO</span>
      </footer>

      <button
        aria-label="Zgłoś błąd na stronie"
        className="bugshot-trigger"
        title="Zgłoś błąd"
        type="button"
      >
        <Bug aria-hidden="true" size={18} strokeWidth={2} />
        <span>Zgłoś błąd</span>
      </button>
    </div>
  );
}
