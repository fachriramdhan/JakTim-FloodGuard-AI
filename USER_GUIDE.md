# 📖 Panduan Pengguna - Jaktim FloodGuard AI

Selamat datang di **Jaktim FloodGuard AI**, sistem monitoring cuaca dan deteksi banjir cerdas untuk wilayah Jakarta Timur. Dokumen ini akan memandu Anda dalam menggunakan fitur-fitur aplikasi.

---

## 1. Navigasi Utama

Aplikasi terdiri dari dua halaman utama yang dapat diakses melalui **Navbar** di bagian atas layar:

1.  **Dashboard**: Tampilan ringkas berupa kartu-kartu status per wilayah.
2.  **Peta Sebaran (Maps)**: Tampilan geospasial interaktif untuk melihat sebaran titik banjir.
3.  **Toggle Tema**: Ikon Matahari/Bulan di pojok kanan atas untuk mengubah tampilan (Dark Mode / Light Mode).

---

## 2. Dashboard

Halaman Dashboard adalah pusat informasi utama.

### A. Hero Section (Bagian Atas)
*   **Lokasi Anda**: Menampilkan cuaca di lokasi fisik Anda saat ini (berdasarkan GPS browser).
*   **Analisa Banjir AI**: Klik tombol **"Analisa Banjir AI"** (ikon kilat/sparkles). Sistem akan mengirim data cuaca 5 jam ke depan ke Google Gemini AI untuk memberikan analisis risiko singkat dengan bahasa yang mudah dimengerti.
*   **Forecast Panel**: Menampilkan prediksi cuaca per jam (suhu dan ikon cuaca) untuk 5 jam ke depan di lokasi Anda.

### B. Filter Status
Gunakan tombol filter berwarna untuk menyaring tampilan kartu wilayah:
*   **Semua Wilayah**: Menampilkan seluruh data.
*   **BANJIR (Merah)**: Hanya wilayah yang statusnya kritis.
*   **SIAGA (Oranye)**: Wilayah yang mendekati banjir.
*   **WASPADA (Kuning)**: Wilayah yang sedang hujan.

### C. Kartu Wilayah (Card)
Setiap kelurahan ditampilkan dalam satu kartu. Cara membaca kartu:

*   **Label Status (Pojok Kanan Atas)**: Indikator utama (AMAN, WASPADA, SIAGA, BANJIR).
*   **Pesan Dinamis**: Kotak teks di bawah nama wilayah yang menjelaskan *mengapa* status tersebut terjadi (contoh: "Durasi hujan telah melebihi batas 2 jam").
*   **Ikon Cuaca Besar**: Cuaca saat ini di wilayah tersebut.
*   **Curah Hujan**: Angka dalam satuan milimeter (mm). Semakin tinggi, semakin deras hujannya.
*   **Strip Bawah**: Prediksi cuaca 5 jam ke depan khusus untuk kelurahan tersebut.

---

## 3. Peta Sebaran (Maps View)

Halaman ini memberikan visualisasi geografis.

### A. Peta Interaktif
*   **Lingkaran Berwarna**: Merepresentasikan lokasi kelurahan.
    *   🔴 Merah: Banjir
    *   🟠 Oranye: Siaga
    *   🟡 Kuning: Waspada
    *   🟢 Hijau: Aman
*   **Interaksi**: Klik pada lingkaran untuk melihat detail popup (Nama Kelurahan, Kecamatan, Durasi Hujan Saat Ini, dan Batas Banjir).

### B. Sidebar Analitik (Kiri)
*   **Kepercayaan AI**: Skor (0-100%) yang menunjukkan seberapa yakin sistem terhadap datanya berdasarkan konsistensi laporan cuaca.
*   **Faktor Risiko**: Grafik batang yang menunjukkan statistik durasi hujan maksimal dan persentase wilayah terdampak.
*   **Prioritas Penanganan**: Daftar wilayah yang diurutkan berdasarkan tingkat urgensi. Wilayah "BANJIR" akan selalu muncul paling atas.

---

## 4. Memahami Status Banjir

Sistem menggunakan logika berikut untuk menentukan status:

| Status | Warna | Arti | Kondisi |
| :--- | :--- | :--- | :--- |
| **AMAN** | 🟢 Hijau | Kondisi normal | Tidak hujan atau hujan telah berhenti. |
| **WASPADA** | 🟡 Kuning | Hati-hati | Sedang turun hujan, namun durasi belum lama. |
| **SIAGA** | 🟠 Oranye | Persiapan | Hujan terus menerus, tinggal 1 jam lagi menuju batas banjir. |
| **BANJIR** | 🔴 Merah | Bahaya | Durasi hujan telah melebihi batas toleransi wilayah tersebut. |

### Catatan Khusus (Ketergantungan Wilayah)
Beberapa wilayah memiliki aturan khusus.
*Contoh:* **Cakung Timur** bergantung pada **Penggilingan**.
Meskipun di Cakung Timur hujan deras berjam-jam, jika Penggilingan (Hulu) tidak banjir, maka Cakung Timur statusnya maksimal hanya **WASPADA**. Status **BANJIR** di Cakung Timur hanya aktif jika Penggilingan juga Banjir.

---

## 5. Troubleshooting Sederhana

*   **Lokasi Saya Tidak Akurat**: Pastikan GPS/Location Service pada browser Anda aktif dan diizinkan untuk situs ini.
*   **Peta Tidak Muncul**: Periksa koneksi internet Anda (peta membutuhkan akses internet untuk memuat gambar ubin/tiles).
*   **Analisa AI Gagal**: Pastikan API Key Google Gemini valid (hubungi administrator sistem).
