# 🌊 Jaktim FloodGuard AI

**AI-Based Flood Monitoring & Early Warning System for East Jakarta**

![Project Status](https://img.shields.io/badge/Status-MVP%20Ready-success?style=for-the-badge)
![License](https://img.shields.io/badge/License-MIT-blue?style=for-the-badge)
![IDCamp](https://img.shields.io/badge/Submission-IDCamp%202025-orange?style=for-the-badge)

> *“Small Apps for Big Preparedness. Stay dry, stay safe.”*

---

## 📌 Project Overview

**Jaktim FloodGuard AI** adalah sistem monitoring dan deteksi dini banjir berbasis kecerdasan buatan yang dirancang khusus untuk wilayah **Jakarta Timur**.

Aplikasi ini dikembangkan untuk menjawab tantangan **IDCamp 2025**, dengan fokus pada:

* Monitoring curah hujan per jam
* Analisis potensi banjir berbasis aturan wilayah
* Sistem dependensi hulu–hilir (hydrology-aware logic)
* Asisten AI tanggap darurat
* Desain modern dan *Gen-Z friendly*

Sistem ini bertujuan memberikan informasi yang:

* ✅ Cepat
* ✅ Akurat
* ✅ Mudah dipahami
* ✅ Actionable (bisa langsung ditindaklanjuti)

---

# ✨ Key Features

## 1️⃣ 🤖 SiagaBot – AI Emergency Assistant

Asisten virtual 24/7 berbasis AI untuk membantu warga saat situasi darurat.

**Fungsi utama:**

* Panduan evakuasi banjir
* Checklist tas siaga
* Tips keselamatan keluarga
* Pertolongan pertama (P3K)
* Edukasi kesiapsiagaan

**Teknologi:**

* Google Gemini 3 Flash Preview
* SDK: `@google/genai`

**Manfaat:**
Mengurangi kepanikan warga dengan memberikan jawaban instan saat akses informasi resmi terbatas.

---

## 2️⃣ ⚡ Real-Time Early Warning System (Dependency-Aware)

Sistem deteksi banjir cerdas yang meniru pola hidrologi nyata.

### 🔁 Inovasi Hulu–Hilir

Sistem memperhitungkan keterkaitan antar wilayah.

**Contoh:**

* **Cakung Timur (Hilir)** bergantung pada kondisi **Penggilingan (Hulu)**.
* Jika Penggilingan aman → Cakung Timur tidak bisa berstatus BANJIR.
* Jika Penggilingan banjir → status hilir mengikuti logika asli.

### 📊 Data Presisi

* Curah hujan per jam
* Monitoring 65 kelurahan Jakarta Timur
* Perhitungan durasi hujan berturut-turut

---

## 3️⃣ 📢 One-Click Warning Share

Tombol darurat untuk membagikan kartu peringatan banjir ke:

* Grup WhatsApp keluarga
* RT/RW
* Tetangga sekitar

**Impact:**
Informasi tetap tersebar meskipun warga tidak membuka aplikasi.

---

## 4️⃣ 🗺️ Interactive Geo Map

Peta interaktif berbasis Leaflet dengan:

* Indikator warna status wilayah
* Visualisasi titik rawan
* Monitoring seluruh Jakarta Timur
* Tampilan responsif (mobile-friendly)

---

# 🛠️ Tech Stack

Aplikasi ini dibangun menggunakan modern web stack untuk performa tinggi dan UX optimal.

| Layer       | Technology    | Purpose                           |
| ----------- | ------------- | --------------------------------- |
| Frontend    | React + Vite  | UI Library & Fast Build Tool      |
| Language    | TypeScript    | Strict typing & safety            |
| Styling     | TailwindCSS   | Utility-first styling & dark mode |
| AI Engine   | Google Gemini | AI Response & Analysis            |
| Maps        | Leaflet       | Interactive Map Visualization     |
| Weather API | Open-Meteo    | Real-time Weather Data            |

---

# 🔄 System Flow

Berikut alur pemrosesan data hingga menjadi status peringatan:

```mermaid
graph TD
    A[User Access Web] --> B{Check GPS}
    B -->|Allowed| C[Fetch User Weather]
    B -->|Denied| D[Use Default Location]

    C & D --> E[Batch Fetch Weather (65 Kelurahan)]
    E --> F[Calculate Rain Duration]

    F --> G{Check Flood Rule}
    G --> H{Check Upstream Dependency}

    H -->|Upstream Safe| I[Downgrade to WASPADA]
    H -->|Upstream Flood| J[Use Original Status]
    H -->|No Dependency| J

    I & J --> K[Render Dashboard & Map]

    K --> L[User Click AI Analysis]
    L --> M[Send Data to Gemini]
    M --> N[Display AI Recommendation]
```

---

# 📂 Project Structure

```
/
├── index.html
├── src/
│   ├── App.tsx
│   ├── constants.ts
│   ├── types.ts
│   ├── utils/
│   │   └── floodLogic.ts
│   ├── services/
│   │   ├── weatherService.ts
│   │   └── geminiService.ts
│   └── components/
│       ├── Navbar.tsx
│       ├── KelurahanCard.tsx
│       ├── MapsView.tsx
│       └── ChatBot.tsx
├── .env
└── package.json
```

---

# ⚙️ Flood Detection Logic

Sistem menggunakan 4 level status:

| Status     | Warna  | Kondisi                          |
| ---------- | ------ | -------------------------------- |
| 🟢 AMAN    | Hijau  | Tidak hujan / hujan berhenti     |
| 🟡 WASPADA | Kuning | Hujan < batas kritis             |
| 🟠 SIAGA   | Oranye | 1 jam menuju batas kritis        |
| 🔴 BANJIR  | Merah  | Durasi hujan ≥ durationThreshold |

---

## 📌 Contoh Kasus Dependensi

**Wilayah:** Cakung Timur
**Aturan:** Banjir jika hujan ≥ 2.5 jam DAN Penggilingan banjir

**Skenario:**

* Cakung Timur hujan 3 jam
* Penggilingan AMAN

**Hasil Akhir:**
Status = 🟡 WASPADA (bukan BANJIR)

Karena dependensi hulu belum terpenuhi.

---

# 🚀 Getting Started

## 📌 Prerequisites

* Node.js v16+
* NPM atau Yarn
* API Key Google Gemini (Gratis via Google AI Studio)

---

## 1️⃣ Clone Repository

```bash
git clone https://github.com/username-anda/jaktim-floodguard-ai.git
cd jaktim-floodguard-ai
```

---

## 2️⃣ Install Dependencies

```bash
npm install
```

---

## 3️⃣ Setup Environment Variable

Buat file `.env` di root project:

```env
VITE_API_KEY=your_google_gemini_api_key
```

> Pastikan menggunakan prefix `VITE_` agar terbaca oleh Vite.

---

## 4️⃣ Run Development Server

```bash
npm run dev
```

Buka browser:

```
http://localhost:5173
```

(atau port yang muncul di terminal)

---

# 🤝 Contributing

Kontribusi sangat terbuka!

1. Fork repository
2. Buat branch baru (`git checkout -b feature/nama-fitur`)
3. Commit perubahan (`git commit -m "Add: fitur baru"`)
4. Push (`git push origin feature/nama-fitur`)
5. Buat Pull Request

---

# 📄 License

MIT License

---

# ❤️ Credits

Dikembangkan untuk **IDCamp 2025**
oleh **Fachri Ramdhan Al Mubaroq**

---
