
# 🌊 Jaktim FloodGuard AI

## AI-Powered Hyperlocal Flood Early Warning System

![Status](https://img.shields.io/badge/MVP-Production%20Ready-success?style=for-the-badge)
![AI](https://img.shields.io/badge/Powered%20by-Google%20Gemini-blueviolet?style=for-the-badge)
![Region](https://img.shields.io/badge/Region-East%20Jakarta-orange?style=for-the-badge)
![Event](https://img.shields.io/badge/IDCamp-2025-blue?style=for-the-badge)

> *"When floods come fast, information must come faster."*

---

# 🚨 Problem Statement

Jakarta Timur merupakan salah satu wilayah dengan risiko banjir tinggi akibat:

* Curah hujan ekstrem
* Sistem drainase terbatas
* Efek limpasan hulu–hilir
* Minimnya sistem peringatan berbasis kelurahan

Sebagian besar sistem peringatan yang ada:

* ❌ Tidak real-time
* ❌ Tidak spesifik per kelurahan
* ❌ Tidak memperhitungkan dependensi wilayah
* ❌ Tidak menyediakan panduan tindakan langsung

Akibatnya, warga sering terlambat bersiap.

---

# 💡 Our Solution

**Jaktim FloodGuard AI** adalah sistem deteksi dini banjir berbasis AI dengan pendekatan:

* 🌧️ Real-time hourly rainfall monitoring
* 🧠 AI-powered emergency assistant
* 🔁 Dependency-aware hydrology logic
* 📢 One-click community warning
* 🗺️ Interactive geo-visualization

Kami membangun sistem yang tidak hanya memberi tahu bahwa banjir mungkin terjadi —
tetapi juga **apa yang harus dilakukan selanjutnya.**

---

# 🏗️ System Architecture Overview

```
Open-Meteo API  →  Rainfall Processor  →  Flood Logic Engine
                                       ↓
                              Dependency Validator
                                       ↓
                              Status Classification
                                       ↓
                 Dashboard + Map + AI Recommendation Engine
```

---

# 🔥 Core Innovations

## 1️⃣ Dependency-Aware Flood Logic (Hydrology Simulation)

Banjir tidak terjadi secara independen.
Wilayah hilir sangat bergantung pada kondisi wilayah hulu.

### 🧠 Example:

* **Penggilingan (Hulu)**
* **Cakung Timur (Hilir)**

Jika:

* Cakung Timur hujan 3 jam
* Tapi Penggilingan AMAN

➡ Status Cakung Timur = **WASPADA**, bukan BANJIR.

Ini mensimulasikan aliran air nyata dan mencegah false alarm.

---

## 2️⃣ SiagaBot – AI Emergency Assistant

Powered by Google Gemini.

Fungsi:

* Checklist tas siaga
* Langkah evakuasi
* Edukasi keselamatan
* Respons cepat berbasis konteks status wilayah

Contoh:

> "Status SIAGA di Cakung Timur. Apa yang harus saya lakukan?"

AI memberikan:

* Tindakan 1 jam ke depan
* Rekomendasi evakuasi
* Tips keselamatan keluarga

---

## 3️⃣ Hyperlocal Monitoring (65 Kelurahan)

* Curah hujan per jam
* Perhitungan durasi hujan berturut-turut
* Threshold spesifik per wilayah
* Status 4 level (AMAN → BANJIR)

---

## 4️⃣ One-Click WhatsApp Share

Kartu peringatan dapat langsung dibagikan ke:

* Grup keluarga
* RT / RW
* Tetangga sekitar

Karena kesiapsiagaan adalah tanggung jawab bersama.

---

# 📊 Flood Classification System

| Level      | Meaning | Condition                    |
| ---------- | ------- | ---------------------------- |
| 🟢 AMAN    | Safe    | Tidak hujan / hujan berhenti |
| 🟡 WASPADA | Caution | Hujan < threshold            |
| 🟠 SIAGA   | Alert   | 1 jam menuju threshold       |
| 🔴 BANJIR  | Flood   | Rain duration ≥ threshold    |

---

# 🛠️ Tech Stack

### Frontend

* React
* Vite
* TypeScript
* TailwindCSS

### AI

* Google Gemini (GenAI SDK)

### Weather Data

* Open-Meteo API (No API Key required)

### Maps

* Leaflet.js

---

# 🧠 Why This Project Matters

Indonesia membutuhkan:

* Sistem peringatan dini berbasis AI
* Informasi spesifik tingkat kelurahan
* Integrasi data cuaca & edukasi publik
* Akses cepat tanpa login & tanpa ribet

Jaktim FloodGuard AI adalah langkah awal menuju:

> Smart Disaster Preparedness System

---

# 🚀 Getting Started

### 1️⃣ Clone Repository

```bash
git clone https://github.com/username/jaktim-floodguard-ai.git
cd jaktim-floodguard-ai
```

### 2️⃣ Install Dependencies

```bash
npm install
```

### 3️⃣ Setup Environment Variable

Buat file `.env`

```env
VITE_API_KEY=your_gemini_api_key
```

### 4️⃣ Run

```bash
npm run dev
```

---

# 📈 Future Roadmap

* 🔔 Push notification system
* 📱 PWA mode (offline-ready)
* 📊 Historical rainfall analytics
* 🤝 Integration with BPBD data
* 🛰️ IoT water-level sensor integration
* 🧠 Machine learning flood prediction model

---

# 🎯 Target Impact

* Mengurangi kepanikan saat hujan ekstrem
* Meningkatkan kesiapsiagaan warga
* Mempercepat penyebaran informasi
* Mendukung Smart City Jakarta

---

# 👨‍💻 Developed By

**Fachri Ramdhan Al Mubaroq**
