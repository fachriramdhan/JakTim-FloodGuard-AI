# 🌊 Jaktim FloodGuard AI

**Sistem Monitoring & Deteksi Dini Banjir Wilayah Jakarta Timur Berbasis AI.**

![Project Status](https://img.shields.io/badge/Status-MVP%20Ready-success?style=for-the-badge)
![License](https://img.shields.io/badge/License-MIT-blue?style=for-the-badge)
![IDCamp](https://img.shields.io/badge/Submission-IDCamp%202025-orange?style=for-the-badge)

> _"Small Apps for Big Preparedness. Stay dry, stay safe."_

---

## 📋 Tentang Proyek

**Jaktim FloodGuard AI** adalah solusi digital untuk kesiapsiagaan bencana yang dirancang khusus untuk memenuhi tantangan **IDCamp 2025**. Aplikasi ini memantau potensi banjir secara _real-time_ di tingkat kelurahan dengan menggunakan data cuaca presisi (Open-Meteo) dan analisis kecerdasan buatan (Google Gemini).

Fokus utama aplikasi ini adalah memberikan informasi yang akurat, cepat, dan dapat ditindaklanjuti (_actionable_) bagi warga Jakarta Timur, dengan pendekatan desain yang _Gen-Z friendly_.

---

## ✨ Fitur Unggulan (Key Features)

### 1. 🤖 SiagaBot (AI Emergency Assistant)

Asisten virtual yang siap menjawab pertanyaan darurat 24/7.

- **Fungsi:** Memberikan panduan evakuasi, tips keselamatan, P3K, dan checklist tas siaga.
- **Teknologi:** Google Gemini 3 Flash Preview.
- **Mengapa Penting?** Mengurangi kepanikan warga dengan memberikan jawaban instan saat akses informasi resmi sulit didapat.

### 2. ⚡ Real-time Early Warning System (Dependency-Aware)

Sistem pendeteksi banjir cerdas yang meniru hidrologi nyata.

- **Inovasi Hulu-Hilir:** Memperhitungkan ketergantungan antar wilayah.
  - _Contoh:_ Status banjir di **Cakung Timur** (Hilir) bergantung pada kondisi di **Penggilingan** (Hulu). Jika Penggilingan aman, Cakung Timur tidak akan berstatus "BANJIR" meskipun hujan deras.
- **Data Presisi:** Menggunakan data curah hujan per jam untuk 65 Kelurahan.

### 3. 📢 One-Click Warning Share

Tombol darurat untuk menyebarkan kartu peringatan dini ke WhatsApp grup keluarga/RT/RW.

- **Impact:** Memastikan informasi menyebar cepat ke warga yang tidak membuka aplikasi (lansia/non-smartphone user).

### 4. 🗺️ Interactive Geo-Map

Visualisasi sebaran titik rawan dengan indikator warna intuitif dan zona monitoring Jakarta Timur.

---

## 🛠️ Tech Stack

Aplikasi ini dibangun menggunakan teknologi web modern untuk performa tinggi dan pengalaman pengguna yang responsif.

| Kategori      | Teknologi                                                                                                                                                                          | Deskripsi                     |
| :------------ | :--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | :---------------------------- |
| **Frontend**  | ![React](https://img.shields.io/badge/React-20232A?style=flat&logo=react&logoColor=61DAFB) ![Vite](https://img.shields.io/badge/Vite-B73BFE?style=flat&logo=vite&logoColor=FFD62E) | UI Library & Build Tool       |
| **Language**  | ![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=flat&logo=typescript&logoColor=white)                                                                           | Strict Typing & Safety        |
| **Styling**   | ![TailwindCSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=flat&logo=tailwind-css&logoColor=white)                                                                      | Utility-first CSS & Dark Mode |
| **AI Engine** | ![Google Gemini](https://img.shields.io/badge/Google%20Gemini-8E75B2?style=flat&logo=googlebard&logoColor=white)                                                                   | GenAI SDK (`@google/genai`)   |
| **Maps**      | ![Leaflet](https://img.shields.io/badge/Leaflet-199900?style=flat&logo=leaflet&logoColor=white)                                                                                    | Interactive Maps              |
| **Data**      | ![Open-Meteo](https://img.shields.io/badge/Open--Meteo-orange?style=flat)                                                                                                          | Weather API (No Key Required) |

---

## 🔄 Alur Sistem (Flowchart)

Berikut adalah diagram alir bagaimana data diproses dari API hingga menjadi status peringatan:

```mermaid
graph TD
    A[User Mengakses Web] --> B{Cek Lokasi GPS}
    B -->|Diizinkan| C[Ambil Cuaca User]
    B -->|Ditolak| D[Gunakan Lokasi Default]

    C & D --> E[Batch Fetch Data Cuaca (65 Kelurahan)]
    E --> F[Hitung Durasi Hujan Berturut-turut]

    F --> G{Cek Logika Banjir}
    G --> H{Cek Dependensi Hulu-Hilir}

    H -->|Hulu Aman| I[Turunkan Status ke WASPADA]
    H -->|Hulu Banjir| J[Gunakan Status Asli (BANJIR/SIAGA)]
    H -->|Tidak Ada Dependensi| J

    I & J --> K[Render Dashboard & Peta]

    K --> L[User Klik 'Analisa AI']
    L --> M[Kirim Data ke Google Gemini]
    M --> N[Tampilkan Saran AI]
```

---

## 📂 Struktur Folder

```bash
/
├── index.html              # Entry point aplikasi
├── src/                    # (Root source code)
│   ├── App.tsx             # Main Logic Controller & State Management
│   ├── constants.ts        # DATABASE: Daftar Kelurahan & Aturan Banjir
│   ├── types.ts            # TypeScript Interfaces
│   ├── utils/
│   │   └── floodLogic.ts   # 🧠 Core Algorithm: Logika penentuan status banjir
│   ├── services/
│   │   ├── weatherService.ts   # API Wrapper untuk Open-Meteo
│   │   └── geminiService.ts    # API Wrapper untuk Google Gemini
│   └── components/
│       ├── Navbar.tsx      # Navigasi & Dark Mode Toggle
│       ├── KelurahanCard.tsx   # Komponen UI Kartu Wilayah
│       ├── MapsView.tsx    # Komponen Peta (Leaflet)
│       └── ChatBot.tsx     # Komponen SiagaBot
├── .env                    # Konfigurasi API Key (Local)
└── package.json            # Daftar Dependensi
```

---

## ⚙️ Logika Deteksi Banjir

Sistem menggunakan status berjenjang:

| Status         | Indikator | Kondisi Pemicu                                       |
| :------------- | :-------- | :--------------------------------------------------- |
| **AMAN** 🟢    | Hijau     | Tidak hujan atau hujan telah berhenti.               |
| **WASPADA** 🟡 | Kuning    | Sedang hujan, durasi < batas kritis.                 |
| **SIAGA** 🟠   | Oranye    | Hujan terus menerus, 1 jam lagi menuju batas kritis. |
| **BANJIR** 🔴  | Merah     | Durasi hujan >= Batas Kritis (`durationThreshold`).  |

**Contoh Kasus Dependensi:**

- **Wilayah:** Cakung Timur (Hilir).
- **Aturan:** Banjir jika hujan >= 2.5 jam **DAN** Penggilingan (Hulu) Banjir.
- **Skenario:** Cakung Timur hujan 3 jam, tapi Penggilingan AMAN.
- **Hasil:** Status Cakung Timur = **WASPADA** (Bukan Banjir).

---

## 🚀 Panduan Instalasi (Getting Started)

Ikuti langkah ini untuk menjalankan proyek di komputer lokal (Localhost).

### Prasyarat

- Node.js (v16+)
- NPM / Yarn
- API Key Google Gemini (Dapatkan gratis di [Google AI Studio](https://aistudio.google.com/))

### 1. Clone Repository

```bash
git clone https://github.com/username-anda/jaktim-floodguard-ai.git
cd jaktim-floodguard-ai
```

### 2. Install Dependensi

```bash
npm install
```

### 3. Konfigurasi API Key

Karena proyek ini berjalan di sisi klien (Client-Side) untuk Hackathon, Anda bisa menyisipkan API Key langsung.

- **Opsi A (Environment Variable - Disarankan):**
  Buat file `.env` di root folder:

  ```env
  API_KEY=masukkan_kunci_rahasia_anda_disini
  ```

  _Note: Pastikan bundler Anda (Vite/Webpack) mendukung inject variable ini._

- **Opsi B (Langsung di Kode - Hanya untuk Demo Lokal):**
  Buka `services/geminiService.ts` dan tempel key Anda pada variabel `const apiKey`.

### 4. Jalankan Aplikasi

```bash
npm start
# atau
npm run dev
```

Buka browser dan akses `http://localhost:3000` (atau port yang muncul di terminal).

---

## 🤝 Kontribusi

Proyek ini terbuka untuk kontribusi!

1.  Fork repository ini.
2.  Buat branch fitur (`git checkout -b fitur-baru`).
3.  Commit perubahan (`git commit -m 'Menambah fitur X'`).
4.  Push ke branch (`git push origin fitur-baru`).
5.  Buat Pull Request.

---

**Dibuat dengan ❤️ oleh [Nama Tim/Anda] untuk IDCamp 2025.**
