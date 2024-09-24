# 🦷 Inovativni Sistem za Stomatološke Ordinacije s Mogućnošću Geolokacijske Pretrage (ISSO)

![Dental Clinic](https://img.icons8.com/fluency/48/000000/dental-checkup.png)

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
  server=localhost;port=3306;user=root;password=root;database=dental_clinic
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

## 📁 Struktura Projekta

```bash
Dental_clinic/
├── Dental_clinic.API/              # Backend API za upravljanje podacima
│   ├── Controllers/                # API kontroleri
│   ├── Models/                     # Modeli podataka
│   ├── Services/                   # Servisi za poslovnu logiku
│   └── appsettings.json            # Postavke baze podataka
├── Dental_Clinic.Data/             # DBContext i entiteti baze podataka
├── WebApp/                         # Angular frontend za admina i doktore
│   ├── src/                        # Izvorni kod aplikacije
│   └── environments/environment.ts # Konfiguracija API konekcije
├── MobileApp/                      # React Native aplikacija za pacijente
│   ├── src/                        # Izvorni kod aplikacije
│   └── constants/constant.js       # Konfiguracija API konekcije
└── README.md                       # Ovaj fajl
```

## 📌 Važni Linkovi
- [ASP.NET Dokumentacija](https://docs.microsoft.com/en-us/aspnet/core/?view=aspnetcore-5.0)
- [Angular Dokumentacija](https://angular.io/docs)
- [React Native Dokumentacija](https://reactnative.dev/docs/getting-started)

## 📜 Licenca
Ovaj projekt je pod [MIT licencom](LICENSE).

## 🤝 Autori
- Medina Ferhatović - [GitHub](https://github.com/medina-ferhatovic)
