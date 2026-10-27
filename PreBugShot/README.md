This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Zgłoszenia błędów

Formularz wysyła zgłoszenia do lokalnego API. Zgłoszenia są zapisywane w pliku `data/bug-reports.json`, razem z opisem i zrzutem ekranu. Panel jest dostępny pod adresem [http://localhost:3000/admin](http://localhost:3000/admin); demo logowania używa nicku `admin` i hasła `admin`.

Panel pozwala wyszukiwać zgłoszenia, filtrować je po statusie i dacie, zmieniać statusy, dodawać komentarze i przeglądać historię. Do zgłoszenia dodawany jest adres strony (bez parametrów z adresu) oraz informacja o przeglądarce. Proste maskowanie ukrywa typowe zapisy haseł i tokenów w opisie oraz komentarzach, a pola hasła i tokenów są zasłaniane na zrzucie.

Na stronie „Moje konto” jest przykładowy formularz logowania. Wpisz fikcyjne dane, otwórz „Zgłoś błąd” i sprawdź podgląd zrzutu: pole hasła powinno być zastąpione napisem `[ukryto]`. Logowanie nie wysyła ani nie zapisuje danych.

To proste rozwiązanie do lokalnego projektu i prezentacji. Plik jest przechowywany na komputerze, na którym działa aplikacja. Logowanie w panelu jest tylko demonstracyjne i API nie ma prawdziwego uwierzytelniania; nie należy używać tego rozwiązania jako zabezpieczonej usługi.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
