import Image from "next/image";
import { ArrowRight, UserRound } from "lucide-react";
import BugReportWidget from "@/components/widget/BugReportWidget";

const categories = [
  ["Nowości", "#nowosci"],
  ["Ceramika", "#ceramika"],
  ["Oświetlenie", "#oswietlenie"],
  ["Tekstylia", "#tekstylia"],
];

const products = [
  {
    name: "Wazon Runo",
    detail: "Ceramika szkliwiona · ręczne wykończenie",
    price: "189 zł",
    image: "/images/ceramics.jpg",
    alt: "Ceramiczne naczynia",
    category: "ceramika",
  },
  {
    name: "Lampa Nami",
    detail: "Oprawa z naturalnego rattanu",
    price: "649 zł",
    image: "/images/pendant-lamp.jpg",
    alt: "Lampa wisząca z rattanu",
    category: "oswietlenie",
  },
  {
    name: "Miejsce do bycia",
    detail: "Kolekcja salonowa",
    price: "od 1 290 zł",
    image: "/images/living-room.jpg",
    alt: "Jasny salon",
    category: "tekstylia",
  },
];

export default function Home() {
  return (
    <div className="min-h-screen">
      <div className="bg-green-900 px-4 py-2 text-center text-xs text-white">
        Przedmioty do domu · Darmowa dostawa od 250 zł
      </div>

      <header className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-5 border-b border-stone-200 px-5 py-5">
        <a className="text-xl font-bold tracking-wide text-green-950" href="#start">
          FORMA <span className="text-xs font-normal">STUDIO</span>
        </a>
        <nav className="flex gap-5 text-sm text-stone-700" aria-label="Kategorie produktów">
          {categories.map(([label, href]) => <a className="hover:text-green-800" href={href} key={label}>{label}</a>)}
        </nav>
        <div className="flex items-center gap-5">
          <a className="flex items-center gap-2 text-sm text-stone-700 hover:text-green-800" href="/konto">
            <UserRound size={15} /> Moje konto
          </a>
          <a className="flex items-center gap-2 text-sm text-stone-700 hover:text-green-800" href="#nowosci">
            Zobacz kolekcję <ArrowRight size={15} />
          </a>
        </div>
      </header>

      <main id="start" className="mx-auto max-w-6xl px-5">
        <section className="grid gap-8 py-10 md:grid-cols-2 md:items-center md:py-16">
          <div>
            <p className="text-xs uppercase tracking-widest text-stone-500">Dom, który ma swój rytm</p>
            <h1 className="my-5 font-serif text-5xl leading-tight text-green-950 md:text-6xl">
              Dobre rzeczy.<br />Na dłużej.
            </h1>
            <p className="max-w-md text-sm leading-7 text-stone-600">
              Przedmioty do domu wybierane spokojnie. Od małych pracowni,
              z dobrych materiałów i z miejscem na codzienne życie.
            </p>
            <a className="mt-6 inline-flex items-center gap-2 border-b border-stone-400 pb-2 text-sm text-green-950" href="#nowosci">
              Poznaj nasze nowości <ArrowRight size={16} />
            </a>
          </div>
          <div className="relative aspect-[1.2] overflow-hidden bg-stone-200">
            <Image
              alt="Naturalne wnętrze"
              className="object-cover"
              fill
              priority
              sizes="(max-width: 768px) 100vw, 50vw"
              src="/images/living-room.jpg"
            />
          </div>
        </section>

        <section id="nowosci" className="border-t border-stone-200 py-8">
          <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
            <div>
              <p className="text-xs uppercase tracking-widest text-stone-500">Wybrane dla Ciebie · Wiosna 2026</p>
              <h2 className="mt-2 font-serif text-3xl text-green-950">Rzeczy, które zostają.</h2>
            </div>
            <a className="flex items-center gap-2 text-sm text-green-900" href="#ceramika">
              Cała kolekcja <ArrowRight size={15} />
            </a>
          </div>

          <div className="grid grid-cols-2 gap-5 md:grid-cols-3">
            {products.map((product) => (
              <article id={product.category} key={product.name}>
                <div className="relative aspect-square overflow-hidden bg-stone-200">
                  <Image alt={product.alt} className="object-cover" fill sizes="(max-width: 768px) 50vw, 33vw" src={product.image} />
                </div>
                <div className="flex flex-wrap justify-between gap-2 py-3">
                  <div>
                    <h3 className="font-serif text-lg text-green-950">{product.name}</h3>
                    <p className="mt-1 text-xs text-stone-500">{product.detail}</p>
                  </div>
                  <span className="text-sm text-stone-700">{product.price}</span>
                </div>
              </article>
            ))}
          </div>
        </section>
      </main>

      <footer className="mt-8 flex flex-wrap justify-between gap-2 bg-green-900 px-5 py-5 text-xs text-white">
        <span>FORMA STUDIO · RZECZY DO ŻYCIA</span>
        <span>Projektujemy powoli, używamy długo</span>
      </footer>

      <BugReportWidget />
    </div>
  );
}
