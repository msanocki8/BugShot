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
    <div className="min-h-screen overflow-hidden bg-background">
      <div className="flex min-h-[31px] items-center justify-center gap-3 bg-forest px-4 py-[6px] text-center text-[9px] tracking-[0.04em] text-[#f5f4ec] max-[680px]:min-h-[29px] max-[680px]:gap-[7px] max-[680px]:text-[8px]">
        <span>Przedmioty tworzone z myślą o codzienności</span>
        <span className="text-[#91a08f]" aria-hidden="true">/</span>
        <span>Darmowa dostawa od 250 zł</span>
      </div>

      <header className="mx-auto flex min-h-[76px] w-[min(100%_-_88px,1440px)] items-center justify-between gap-7 border-b border-line max-[900px]:w-[min(100%_-_48px,1440px)] max-[900px]:gap-[18px] max-[680px]:min-h-[90px] max-[680px]:w-[calc(100%_-_32px)] max-[680px]:flex-wrap max-[680px]:gap-x-3 max-[680px]:gap-y-0 max-[680px]:pt-3">
        <a className="inline-flex flex-none items-baseline gap-[7px] font-serif text-[23px] font-bold tracking-[0.025em] text-forest no-underline max-[680px]:text-[22px]" href="#start" aria-label="Forma Studio, strona główna">
          FORMA<span className="font-sans text-[8px] font-[650] tracking-[0.15em] text-moss">STUDIO</span>
        </a>

        <nav className="flex items-center justify-center gap-[clamp(18px,3vw,43px)] max-[900px]:gap-4 max-[680px]:order-2 max-[680px]:w-full max-[680px]:justify-start max-[680px]:gap-[22px] max-[680px]:overflow-x-auto max-[680px]:pt-3 max-[680px]:pb-[13px] max-[680px]:[scrollbar-width:none] max-[680px]:[&::-webkit-scrollbar]:hidden" aria-label="Kategorie produktów">
          {categories.map((category) => (
            <a className="flex-none text-[10px] text-[#4f5952] no-underline transition-colors duration-150 hover:text-clay max-[680px]:text-[9px]" href={category.href} key={category.label}>
              {category.label}
            </a>
          ))}
        </nav>

        <a className="inline-flex flex-none items-center gap-2 text-[10px] text-[#4f5952] no-underline transition-colors duration-150 hover:text-clay max-[680px]:ml-auto max-[680px]:text-[9px]" href="#nowosci">
          Zobacz kolekcję <ArrowRight size={15} strokeWidth={1.7} />
        </a>
      </header>

      <main id="start">
        <section className="mx-auto grid min-h-[488px] w-[min(100%_-_88px,1440px)] grid-cols-[minmax(280px,0.8fr)_minmax(0,1.2fr)] items-stretch gap-[clamp(34px,6vw,94px)] pt-[35px] pb-[45px] max-[900px]:min-h-[430px] max-[900px]:w-[min(100%_-_48px,1440px)] max-[900px]:grid-cols-[minmax(230px,0.85fr)_minmax(0,1.15fr)] max-[900px]:gap-[30px] max-[680px]:w-[calc(100%_-_32px)] max-[680px]:grid-cols-1 max-[680px]:gap-[22px] max-[680px]:pt-[29px] max-[680px]:pb-8" aria-labelledby="hero-title">
          <div className="flex animate-[enter-soft_550ms_ease-out_both] flex-col items-start justify-center pt-[15px] pb-5 max-[680px]:pt-[5px] max-[680px]:pb-0">
            <p className="m-0 flex items-center gap-[9px] text-[9px] font-[650] tracking-[0.11em] text-[#788274]"><span className="size-[7px] rounded-full bg-clay" /> DOM, KTÓRY MA SWÓJ RYTM</p>
            <h1 className="mt-6 mb-[18px] font-serif text-[56px] leading-[1.03] font-normal text-forest max-[900px]:text-[47px] max-[680px]:mt-[17px] max-[680px]:mb-3 max-[680px]:text-[43px] max-[680px]:leading-[1.02]" id="hero-title">Dobre rzeczy.<br />Na dłużej.</h1>
            <p className="m-0 max-w-[350px] text-[12px] leading-[1.8] text-[#667067] max-[680px]:max-w-[420px] max-[680px]:text-[11px] max-[680px]:leading-[1.75]">
              Przedmioty do domu wybierane spokojnie. Od małych pracowni,
              z dobrych materiałów i z miejscem na codzienne życie.
            </p>
            <a className="mt-[27px] inline-flex items-center gap-[10px] border-b border-[#a9b1a5] pb-[7px] text-[11px] font-semibold text-forest no-underline transition-colors duration-150 hover:text-clay max-[680px]:mt-[18px]" href="#nowosci">
              Poznaj nasze nowości <ArrowRight size={16} strokeWidth={1.8} />
            </a>
            <div className="mt-auto flex items-center gap-[11px] pt-[37px] text-[9px] text-[#828a80] max-[680px]:hidden">
              <span className="font-serif text-[17px] text-clay">01</span>
              <span>Rzeczy z historią, zanim trafią do Twojego domu.</span>
            </div>
          </div>

          <figure className="relative m-0 min-h-[390px] animate-[enter-soft_650ms_80ms_ease-out_both] overflow-hidden bg-[#d7d8cc] max-[900px]:min-h-[350px] max-[680px]:aspect-[1.12] max-[680px]:min-h-0">
            <Image
              alt="Naturalne wnętrze z drewnianymi meblami i miękkim światłem"
              className="object-cover [object-position:center_53%]"
              fill
              loading="eager"
              sizes="(max-width: 760px) 100vw, 58vw"
              src="/images/living-room.jpg"
            />
            <figcaption className="absolute right-0 bottom-0 left-0 flex min-h-9 items-center justify-between gap-[10px] bg-[rgb(35_59_50_/_82%)] px-[13px] text-[8px] tracking-[0.09em] text-[#f8f7ef]">
              <span>PRZESTRZEŃ DO ODETCHNIĘCIA</span>
              <span>KOLEKCJA 04 / 26</span>
            </figcaption>
            <span className="absolute top-[14px] right-[14px] border border-[rgb(255_255_255_/_55%)] px-[9px] py-[7px] text-[8px] tracking-[0.09em] text-white" aria-hidden="true">F—04</span>
          </figure>
        </section>

        <section className="mx-auto w-[min(100%_-_88px,1440px)] border-t border-line pt-7 pb-[65px] max-[900px]:w-[min(100%_-_48px,1440px)] max-[680px]:w-[calc(100%_-_32px)] max-[680px]:pt-[23px] max-[680px]:pb-11" id="nowosci" aria-labelledby="collection-title">
          <div className="mb-[22px] flex items-end justify-between gap-5 max-[680px]:mb-[15px] max-[680px]:flex-col max-[680px]:items-start max-[680px]:gap-[11px]">
            <div>
              <p className="m-0 mb-[9px] flex items-center gap-[9px] text-[9px] font-[650] tracking-[0.11em] text-[#788274] max-[680px]:text-[8px]">WYBRANE DLA CIEBIE <span className="text-[#b7bcb2]">/</span> WIOSNA 2026</p>
              <h2 className="m-0 font-serif text-[26px] leading-normal font-normal text-forest max-[680px]:text-2xl" id="collection-title">Rzeczy, które zostają.</h2>
            </div>
            <a className="inline-flex flex-none items-center gap-[10px] pb-[3px] text-[10px] font-semibold text-forest no-underline transition-colors duration-150 hover:text-clay" href="#ceramika">
              Cała kolekcja <ArrowRight size={15} strokeWidth={1.7} />
            </a>
          </div>

          <div className="grid grid-cols-3 gap-[15px] max-[900px]:gap-[11px] max-[680px]:grid-cols-2 max-[680px]:gap-x-[10px] max-[680px]:gap-y-5">
            {products.map((product) => (
              <article className="group" id={product.category} key={product.name}>
                <div className="relative aspect-[1.16] overflow-hidden bg-[#e5e4da] max-[680px]:aspect-[0.93]">
                  <Image
                    alt={product.alt}
                    className="object-cover transition-transform duration-[400ms] [transition-timing-function:cubic-bezier(0.2,0.7,0.2,1)] group-hover:scale-[1.025]"
                    fill
                    sizes="(max-width: 600px) 50vw, (max-width: 980px) 33vw, 30vw"
                    src={product.image}
                  />
                  <span className="absolute top-[11px] left-[11px] grid size-[27px] place-items-center bg-background font-serif text-[10px] text-forest">{product.number}</span>
                </div>
                <div className="flex justify-between gap-3 px-px pt-3 max-[900px]:flex-col max-[900px]:gap-1 max-[680px]:min-h-[55px] max-[680px]:pt-[9px]">
                  <div>
                    <h3 className="m-0 font-serif text-base leading-normal font-normal text-forest max-[680px]:text-sm">{product.name}</h3>
                    <p className="mt-[5px] mb-0 text-[9px] leading-[1.5] text-[#81877f] max-[680px]:max-w-[175px] max-[680px]:text-[8px]">{product.detail}</p>
                  </div>
                  <span className="flex-none pt-[3px] text-[10px] text-[#535d54] max-[680px]:text-[9px]">{product.price}</span>
                </div>
              </article>
            ))}
          </div>
        </section>
      </main>

      <footer className="flex min-h-[51px] items-center justify-between gap-[18px] bg-forest px-[max(44px,calc((100vw_-_1440px)/2))] text-[8px] tracking-[0.09em] text-[#e6e9df] max-[680px]:min-h-[54px] max-[680px]:flex-col max-[680px]:items-start max-[680px]:justify-center max-[680px]:gap-[5px] max-[680px]:px-4 max-[680px]:py-[10px] max-[680px]:text-[7px]">
        <span>FORMA STUDIO <span className="px-[5px] text-[#9ba795]">/</span> RZECZY DO ŻYCIA</span>
        <span>PROJEKTUJEMY POWOLI, UŻYWAMY DŁUGO</span>
      </footer>

      <button
        aria-label="Zgłoś błąd na stronie"
        className="fixed right-[22px] bottom-[22px] z-10 inline-flex min-h-12 cursor-pointer items-center justify-center gap-[9px] rounded-[5px] border border-[#ac4320] bg-clay px-[15px] text-[11px] font-semibold text-[#fffaf2] shadow-[0_5px_17px_rgb(50_38_29_/_18%)] transition-[background,transform,box-shadow] duration-[160ms] hover:-translate-y-0.5 hover:bg-[#a84330] hover:shadow-[0_8px_20px_rgb(50_38_29_/_23%)] max-[680px]:right-[14px] max-[680px]:bottom-[14px] max-[680px]:min-h-[46px] max-[680px]:px-[13px]"
        title="Zgłoś błąd"
        type="button"
      >
        <Bug aria-hidden="true" size={18} strokeWidth={2} />
        <span>Zgłoś błąd</span>
      </button>
    </div>
  );
}
