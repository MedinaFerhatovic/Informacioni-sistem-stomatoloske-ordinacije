# 🦷 Inovativni Sistem za Stomatološke Ordinacije s Mogućnošću Geolokacijske Pretrage (ISSO)

Ovaj projekt je napredni sistem za upravljanje stomatološkim ordinacijama koji omogućava geolokacijsku pretragu i efikasno upravljanje terminima za pacijente, administratore i doktore. Sistem se sastoji od **web aplikacija** za doktore i administratore te **mobilne aplikacije** za pacijente.

## 🚀 Funkcionalnosti

### Web aplikacija (Admin & Doktor)
#### 🔐 Admin funkcionalnosti:
1. Dodavanje, uređivanje i brisanje korisnika (admini, doktori)
2. Dodavanje, uređivanje i brisanje ordinacija

#### 🩺 Doktor funkcionalnosti:
1. Kreiranje, uređivanje i brisanje termina za svoju ordinaciju
2. Postavljanje termina kao dostupni ili nedostupni
3. Upravljanje stomatološkim kartonima pacijenata:
   - Kreiranje i brisanje kartona
   - Dodavanje novih pregleda u postojeće kartone
4. Pregled i upravljanje rezervacijama pacijenata (odbijanje ili odobravanje)

#### 📧 Pristupni podaci za prijavu

- **Admin**
  - Email: `medina@gmail.com`
  - Lozinka: `medina123`

- **Doktor 1**
  - Email: `doktor@gmail.com`
  - Lozinka: `doktor123`

- **Doktor 2**
  - Email: `doktor2@gmail.com`
  - Lozinka: `doktor222`

- **Pacijent 1**
  - Email: `neko@gmail.com`
  - Lozinka: `neko123`

- **Pacijent 2**
  - Email: `rijad@gmail.com`
  - Lozinka: `rijad123`

### Mobilna aplikacija (Pacijent)
#### 👩‍💼 Pacijent funkcionalnosti:
1. Registracija i prijava
2. Pregled svih ordinacija
3. Pretraga ordinacija:
   - Po nazivu
   - Po adresi
   - Po dostupnim terminima (datum i vrijeme)
4. Pretraga ordinacija po trenutnoj lokaciji pacijenta (radijus 5 km, može se proširiti)
5. Rezervacija termina u bilo kojoj ordinaciji sa slobodnim terminima
6. Pregled i otkazivanje rezervacija
7. Pregled i uređivanje profila (promjena lozinke)
8. Pregled stomatološkog kartona iz bilo koje ordinacije

## 🛠️ Tehnologije korištene

- **Baza podataka**: MySQL
- **Backend API**: ASP.NET C#
- **Web aplikacija**: Angular
- **Mobilna aplikacija**: React Native Expo

## ⚙️ Pokretanje projekta

### 1. Baza podataka
- Preuzmite MySQL Workbench 8.0 CE.
- Importujte bazu podataka u vaš MySQL server koristeći pristupne podatke:

  ```bash
  server=vas_server;port=vas_port;user=vas_user;password=vas_password;database=dental_clinic
  ```

- U ASP.NET projektu `Dental_clinic.API`, u fajlu `appsettings.json`, zamijenite pristupne podatke za bazu podataka vašim podacima.
- Također, u projektu `Dental_Clinic.Data`, u folderu `DBContext`, promijenite podatke za konekciju.

### 2. Pokretanje API-ja
- Otvorite projekt `Dental_clinic.API` u **Visual Studio Community 2022**.
- Pokrenite aplikaciju kao **https** za testiranje putem **Swagger UI**.

### 3. Pokretanje web aplikacije
- Otvorite projekt u **Visual Studio Code**.
- U fajlu `\src\app\environments\environment.ts` promijenite `url` kako bi odgovarao vašoj lokalnoj IP adresi, tako da API može funkcionisati.
- Pokrenite sljedeće komande u terminalu:

  ```bash
  npm install
  ng serve
  ```

### 4. Pokretanje mobilne aplikacije
- Otvorite projekt u **Visual Studio Code**.
- U fajlu `\constants\constant.js` promijenite `url` kako bi odgovarao vašoj lokalnoj IP adresi.
- Instalirajte **Expo Go** aplikaciju na vaš mobilni uređaj.
- Pokrenite sljedeće komande u terminalu:

  ```bash
  npm install
  npm start
  ```

- Skenirajte **QR kod** i otvorite mobilnu aplikaciju.
  
  > **Napomena:** Vaš računar i mobilni uređaj moraju biti povezani na istu WiFi mrežu kako bi API funkcionisao.

Naravno! Evo ažurirane strukture projekta s podjelom na grane (branches) prema tvojoj želji:

## 📁 Struktura Projekta

Projekt je organiziran u četiri glavne grane, gdje svaka grana predstavlja ključnu komponentu sistema:

```bash
Dental_clinic/
├── database-branch/                # Grana koja sadrži bazu podataka
│   ├── dental_clinic.sql           # SQL skripta za kreiranje baze podataka
├── api-branch/                     # Grana koja sadrži backend API
│   ├── Dental_clinic.API/          # Backend API za upravljanje podacima
│   │   └── appsettings.json        # Postavke baze podataka
│   ├── Dental_Clinic.Data/         # DBContext i entiteti baze podataka
├── web-app-branch/                 # Grana koja sadrži Angular frontend aplikaciju
│   │   ├── src/                    # Izvorni kod aplikacije
│   │   └── environments/           # Postavke okruženja
│   │       └── environment.ts      # Konfiguracija API konekcije
├── mobile-app-react-native-branch/ # Grana koja sadrži React Native mobilnu aplikaciju
│   │   └── constants/              # Postavke okruženja
│   │       └── constant.js         # Konfiguracija API konekcije
└── main/                           # Glavna grana (main) koja sadrži dokumentaciju
    └── README.md                   # Glavni README fajl za cijeli projekt

```

## 📌 Važni Linkovi
- [ASP.NET Dokumentacija](https://docs.microsoft.com/en-us/aspnet/core/?view=aspnetcore-5.0)
- [Angular Dokumentacija](https://angular.io/docs)
- [React Native Dokumentacija](https://reactnative.dev/docs/getting-started)

## 🤝 Autori
- Medina Ferhatović - [GitHub](https://github.com/MedinaFerhatovic)
