# ⚙️ Dokumentasi Teknis - Jaktim FloodGuard AI

Dokumen ini ditujukan untuk pengembang (developer) yang ingin memelihara, mengembangkan, atau memahami arsitektur di balik **Jaktim FloodGuard AI**.

---

## 1. Arsitektur Sistem

Aplikasi ini adalah **Single Page Application (SPA)** yang dibangun menggunakan ekosistem React modern. Aplikasi berjalan sepenuhnya di sisi klien (Client-Side), dengan pemanggilan API eksternal untuk data.

### Tech Stack
*   **Core**: React 19, TypeScript.
*   **Build Tool**: Vite (diasumsikan berdasarkan struktur import ES Modules).
*   **Styling**: Tailwind CSS (Utility-first CSS).
*   **Mapping**: Leaflet JS & React-Leaflet.
*   **Data Fetching**: Native `fetch` API.
*   **AI Integration**: Google GenAI SDK (`@google/genai`).

### Diagram Alir Data
1.  **Inisialisasi (`App.tsx`)**: Mengambil lokasi pengguna (Geolocation API).
2.  **Fetching Loop**:
    *   Mengambil data cuaca pengguna (Open-Meteo).
    *   Mengambil data cuaca *per kecamatan* (Open-Meteo) secara paralel untuk efisiensi.
3.  **Processing (`floodLogic.ts`)**:
    *   Data cuaca mentah (hourly precipitation) dikonversi menjadi "Durasi Hujan Berturut-turut".
    *   Durasi dibandingkan dengan `threshold` di `constants.ts`.
    *   Pengecekan dependensi wilayah (Hulu-Hilir).
4.  **Rendering**:
    *   Data status (`CalculatedFloodStatus`) didistribusikan ke `KelurahanCard` dan `MapsView`.
5.  **AI On-Demand**:
    *   Saat tombol diklik, konteks data dikirim ke Gemini Flash Model untuk summarization.

---

## 2. Struktur Kode

```
/ (Root)
├── index.html              # Entry point HTML & Tailwind Config
├── index.tsx               # React Root Mount
├── App.tsx                 # Main Logic Controller & State Management
├── constants.ts            # "Database" statis lokasi & aturan
├── types.ts                # TypeScript Interfaces/Enums
├── utils/
│   └── floodLogic.ts       # Algoritma inti penentuan status
├── services/
│   ├── weatherService.ts   # Wrapper Open-Meteo API
│   └── geminiService.ts    # Wrapper Google GenAI API
└── components/
    ├── Navbar.tsx
    ├── KelurahanCard.tsx   # UI Unit Dashboard
    └── MapsView.tsx        # UI Unit Peta (Leaflet)
```

---

## 3. Penjelasan Modul Utama

### A. Database Lokasi (`constants.ts`)
Data kelurahan bersifat *hardcoded* untuk performa dan kemudahan simulasi.
Format data:
```typescript
{
  name: "Cipinang Melayu",
  district: "Makasar",
  rules: {
    durationThreshold: 1, // Jam hujan sebelum banjir
    baseRisk: RiskLevel.SANGAT_TINGGI,
    dependency: undefined // Atau string nama kelurahan lain
  },
  lat: -6.2450,
  lon: 106.9050
}
```

### B. Service Cuaca (`weatherService.ts`)
Menggunakan **Open-Meteo Free API**.
*   **Endpoint**: `https://api.open-meteo.com/v1/forecast`
*   **Parameter**:
    *   `hourly`: `precipitation`, `weathercode`, `temperature_2m`
    *   `forecast_days`: `1` (Kita hanya butuh data hari ini untuk performa).
    *   `timezone`: `Asia/Jakarta`.

### C. Logika Banjir (`utils/floodLogic.ts`)
Dua fungsi utama:
1.  `calculateRainDuration`: Melakukan *backward iteration* dari jam sekarang. Jika `precipitation >= 0.5mm`, hitung sebagai jam hujan. Berhenti jika `precipitation < 0.5mm`.
2.  `determineStatus`:
    *   Cek apakah sedang hujan? Jika tidak -> `AMAN`.
    *   Cek dependensi: Jika punya dependensi (misal: "Kampung Melayu"), dan dependensi tersebut TIDAK banjir -> Max status `WASPADA`.
    *   Cek Threshold:
        *   `duration >= threshold` -> `BANJIR`
        *   `duration >= threshold - 1` -> `SIAGA`
        *   Lainnya -> `WASPADA`

---

## 4. Integrasi AI

File: `services/geminiService.ts`
Menggunakan model `gemini-3-flash-preview` atau `gemini-2.5-flash` untuk kecepatan.

*   **Prompt Engineering**: Prompt dibuat dinamis dengan menyuntikkan data cuaca 5 jam ke depan dan aturan lokal kelurahan tersebut.
*   **Instruksi Sistem**: Meminta respons gaya "Gen-Z", santai, dan ringkas.

---

## 5. Menambahkan Wilayah Baru

Untuk menambahkan kelurahan baru, Anda tidak perlu mengubah kode UI. Cukup edit `constants.ts`:

1.  Buka `constants.ts`.
2.  Tambahkan objek baru ke dalam array `KELURAHAN_DATASET`:
    ```typescript
    createKelurahan(
      'Kecamatan Baru',
      'Kelurahan Baru',
      2, // Threshold jam
      RiskLevel.SEDANG,
      -6.xxxx, // Latitude
      106.xxxx, // Longitude
      'Kelurahan Hulu' // Opsional: Dependency
    ),
    ```
3.  Simpan file. Aplikasi akan otomatis merender kartu dan marker peta baru.

---

## 6. Instalasi & Pengembangan Lokal

1.  **Clone Repository**.
2.  **Install Dependencies**:
    ```bash
    npm install
    # Dependensi utama: react, react-dom, leaflet, react-leaflet, lucide-react, @google/genai
    ```
3.  **Setup Environment**:
    Buat file `.env` (atau set variabel environment):
    ```
    API_KEY=YOUR_GOOGLE_GEMINI_API_KEY
    ```
4.  **Run Development Server**:
    ```bash
    npm start 
    # atau `vite dev` tergantung konfigurasi package.json
    ```

---

## 7. Penanganan Error (Error Handling)

*   **Map Crash**: `MapsView.tsx` dilindungi dengan *safety check* untuk koordinat `NaN` dan `try-catch` pada inisialisasi bounds Leaflet.
*   **API Failures**: Jika Open-Meteo down, aplikasi akan menampilkan state loading atau data kosong (perlu penanganan UX lebih lanjut untuk produksi).
*   **AI Limit**: Jika kuota API Key Gemini habis, fungsi `analyzeFloodRiskWithGemini` akan mengembalikan pesan fallback yang aman.
