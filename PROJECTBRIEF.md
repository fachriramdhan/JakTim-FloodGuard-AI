# 🌊 Project Brief: Jaktim FloodGuard AI

**"Small Apps for Big Preparedness: Hyper-local Flood Detection & AI Emergency Assistant"**

---

## 1. Latar Belakang Masalah (The Problem)

Jakarta Timur merupakan salah satu wilayah dengan titik banjir terbanyak di DKI Jakarta. Masalah utama yang dihadapi warga bukanlah kurangnya informasi cuaca secara umum, melainkan:

1.  **Informasi Kurang Spesifik:** Prakiraan cuaca biasanya berskala "Jakarta" atau "Kecamatan", padahal banjir bisa terjadi di satu kelurahan spesifik sementara kelurahan sebelahnya aman.
2.  **Keterlambatan Reaksi:** Warga sering terlambat mengevakuasi barang berharga karena tidak menyadari durasi hujan telah melampaui batas aman drainase lokal.
3.  **Kepanikan saat Darurat:** Saat air naik, akses informasi menjadi chaos. Warga bingung harus menghubungi siapa atau melakukan pertolongan pertama seperti apa.

## 2. Solusi Kami (The Solution)

**Jaktim FloodGuard AI** adalah aplikasi web berbasis Artificial Intelligence (AI) yang menyediakan monitoring banjir hiper-lokal untuk seluruh kelurahan di Jakarta Timur.

Berbeda dengan aplikasi cuaca biasa, sistem kami menggunakan **"Dependency-Aware Logic"**, di mana status siaga suatu wilayah tidak hanya ditentukan oleh hujan di wilayah itu, tetapi juga kondisi di wilayah hulu (kiriman air).

## 3. Fitur Utama (Key Features)

### 🛰️ Real-time Hyper-local Monitoring

Memantau curah hujan dan durasi hujan di 65 kelurahan di Jakarta Timur secara real-time menggunakan API Open-Meteo.

### 🧠 AI-Powered Risk Analysis (Google Gemini)

Menganalisis data meteorologi mentah menjadi narasi yang mudah dipahami warga.

- _Input:_ Data curah hujan 5 jam ke depan + Aturan topografi lokal.
- _Output AI:_ "Hati-hati bestie! Utan Kayu Utara hujan deras > 2 jam, potensi genangan tinggi. Amankan motor!"

### 🤖 SiagaBot (Emergency Assistant)

Chatbot cerdas yang siap 24/7 menjawab pertanyaan kritis dalam situasi darurat, seperti:

- "Apa yang harus disiapkan di tas siaga bencana?"
- "Bagaimana cara mematikan aliran listrik yang aman?"
- "Rute evakuasi terdekat dari Cipinang Melayu?"

### 🔗 One-Click Warning Share

Fitur konektivitas untuk membagikan kartu peringatan dini via WhatsApp ke grup keluarga/RT/RW dengan satu klik, memastikan informasi menyebar cepat bahkan ke mereka yang tidak membuka aplikasi.

## 4. Teknologi & Inovasi (Tech Stack & Innovation)

### Tech Stack

- **Frontend:** React 19, TypeScript, Vite.
- **Styling:** Tailwind CSS (Gen-Z Friendly UI, Dark/Light Mode).
- **Maps:** Leaflet & React-Leaflet (Interactive Geospatial Data).
- **Artificial Intelligence:** Google GenAI SDK (Gemini 2.5 Flash & Gemini 3 Flash).
- **Data Source:** Open-Meteo API (High-resolution weather data).

### Unsur Kebaruan (Innovation)

Kami menerapkan algoritma **Hulu-Hilir Dependency**.

- _Contoh Kasus:_ Kelurahan **Cakung Timur** bergantung pada **Penggilingan**.
- _Logika:_ Meskipun di Cakung Timur hujan deras, jika Penggilingan (Hulu) statusnya AMAN, maka Cakung Timur maksimal hanya WASPADA. Status BANJIR di Cakung Timur hanya aktif jika Penggilingan juga BANJIR. Ini meniru sistem hidrologi nyata.

## 5. Dampak Bagi Masyarakat (Impact)

1.  **Ekonomi:** Memberi waktu bagi warga untuk menyelamatkan aset (kendaraan, elektronik) sebelum air masuk.
2.  **Keselamatan:** SiagaBot memberikan panduan medis dasar dan evakuasi untuk mengurangi risiko korban jiwa.
3.  **Psikologis:** Mengurangi kecemasan warga dengan data yang transparan dan akurat (menghindari hoax banjir).

## 6. Target Pengguna

- Warga pemukiman rawan banjir di Jakarta Timur.
- Pengurus RT/RW untuk pemantauan wilayah.
- Relawan bencana lokal.

---

_Dibuat untuk IDCamp 2025 Developer Challenge: Small Apps for Big Preparedness._
