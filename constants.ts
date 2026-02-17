import { KelurahanData, RiskLevel } from './types';

// Helper to create data with explicit coordinates
const createKelurahan = (
  district: string,
  name: string,
  hours: number,
  risk: RiskLevel,
  lat: number,
  lon: number,
  dependency?: string
): KelurahanData => ({
  name,
  district,
  rules: { durationThreshold: hours, baseRisk: risk, dependency },
  lat,
  lon,
});

export const KELURAHAN_DATASET: KelurahanData[] = [
  // --- KECAMATAN MATRAMAN ---
  createKelurahan('Matraman', 'Utan Kayu Utara', 2, RiskLevel.SEDANG, -6.1956, 106.8711),
  createKelurahan('Matraman', 'Utan Kayu Selatan', 2, RiskLevel.SEDANG, -6.1998, 106.8685, 'Utan Kayu Utara'),
  createKelurahan('Matraman', 'Palmeriam', 1.5, RiskLevel.TINGGI, -6.2055, 106.8580),
  createKelurahan('Matraman', 'Kebon Manggis', 1.5, RiskLevel.TINGGI, -6.2120, 106.8550),
  createKelurahan('Matraman', 'Pisangan Baru', 2, RiskLevel.SEDANG, -6.2105, 106.8690),
  createKelurahan('Matraman', 'Kayu Manis', 1.5, RiskLevel.TINGGI, -6.2030, 106.8620),

  // --- KECAMATAN PULO GADUNG ---
  createKelurahan('Pulo Gadung', 'Kayu Putih', 2.5, RiskLevel.RENDAH, -6.1780, 106.8850),
  createKelurahan('Pulo Gadung', 'Rawamangun', 2, RiskLevel.SEDANG, -6.1945, 106.8860),
  createKelurahan('Pulo Gadung', 'Jati', 1.5, RiskLevel.TINGGI, -6.1910, 106.8960),
  createKelurahan('Pulo Gadung', 'Pisangan Timur', 2, RiskLevel.SEDANG, -6.2100, 106.8850),
  createKelurahan('Pulo Gadung', 'Cipinang', 1.5, RiskLevel.TINGGI, -6.2140, 106.8920),
  createKelurahan('Pulo Gadung', 'Rawasari', 2, RiskLevel.SEDANG, -6.1890, 106.8740),
  createKelurahan('Pulo Gadung', 'Pulogadung', 2, RiskLevel.SEDANG, -6.1850, 106.9050),

  // --- KECAMATAN CAKUNG ---
  createKelurahan('Cakung', 'Cakung Barat', 2, RiskLevel.TINGGI, -6.1700, 106.9400),
  createKelurahan('Cakung', 'Cakung Timur', 2.5, RiskLevel.TINGGI, -6.1750, 106.9550, 'Penggilingan'),
  createKelurahan('Cakung', 'Penggilingan', 1.5, RiskLevel.TINGGI, -6.2050, 106.9350),
  createKelurahan('Cakung', 'Pulogebang', 3, RiskLevel.SEDANG, -6.2150, 106.9500, 'Cakung Barat'),
  createKelurahan('Cakung', 'Ujung Menteng', 2, RiskLevel.SEDANG, -6.1780, 106.9650),
  createKelurahan('Cakung', 'Rawa Terate', 2, RiskLevel.TINGGI, -6.1880, 106.9200, 'Penggilingan'),
  createKelurahan('Cakung', 'Jatinegara Kaum', 2, RiskLevel.SEDANG, -6.1980, 106.9100),

  // --- KECAMATAN JATINEGARA ---
  createKelurahan('Jatinegara', 'Kampung Melayu', 1, RiskLevel.SANGAT_TINGGI, -6.2260, 106.8640),
  createKelurahan('Jatinegara', 'Bali Mester', 2, RiskLevel.SEDANG, -6.2200, 106.8680, 'Kampung Melayu'),
  createKelurahan('Jatinegara', 'Bidara Cina', 1.5, RiskLevel.TINGGI, -6.2350, 106.8660, 'Kampung Melayu'),
  createKelurahan('Jatinegara', 'Cipinang Cempedak', 2, RiskLevel.SEDANG, -6.2300, 106.8750),
  createKelurahan('Jatinegara', 'Cipinang Besar Utara', 1, RiskLevel.TINGGI, -6.2250, 106.8850),
  createKelurahan('Jatinegara', 'Cipinang Besar Selatan', 1, RiskLevel.TINGGI, -6.2350, 106.8880, 'Cipinang Besar Utara'),
  createKelurahan('Jatinegara', 'Cipinang Muara', 1.5, RiskLevel.TINGGI, -6.2280, 106.8980),
  createKelurahan('Jatinegara', 'Rawa Bunga', 2, RiskLevel.SEDANG, -6.2180, 106.8720),
  createKelurahan('Jatinegara', 'Cipinang Melayu', 1, RiskLevel.SANGAT_TINGGI, -6.2450, 106.9050),

  // --- KECAMATAN DUREN SAWIT ---
  createKelurahan('Duren Sawit', 'Duren Sawit', 2, RiskLevel.SEDANG, -6.2300, 106.9100),
  createKelurahan('Duren Sawit', 'Pondok Bambu', 2, RiskLevel.SEDANG, -6.2350, 106.9050),
  createKelurahan('Duren Sawit', 'Klender', 1.5, RiskLevel.TINGGI, -6.2200, 106.9000),
  createKelurahan('Duren Sawit', 'Pondok Kopi', 1.5, RiskLevel.TINGGI, -6.2250, 106.9400, 'Cipinang Melayu'),
  createKelurahan('Duren Sawit', 'Malaka Jaya', 2.5, RiskLevel.RENDAH, -6.2280, 106.9300),
  createKelurahan('Duren Sawit', 'Malaka Sari', 2, RiskLevel.SEDANG, -6.2320, 106.9250),
  createKelurahan('Duren Sawit', 'Pondok Kelapa', 2, RiskLevel.SEDANG, -6.2450, 106.9350),

  // --- KECAMATAN KRAMAT JATI ---
  createKelurahan('Kramat Jati', 'Cawang', 1, RiskLevel.SANGAT_TINGGI, -6.2480, 106.8650),
  createKelurahan('Kramat Jati', 'Cililitan', 1, RiskLevel.SANGAT_TINGGI, -6.2620, 106.8650),
  createKelurahan('Kramat Jati', 'Balekambang', 1.5, RiskLevel.TINGGI, -6.2750, 106.8550, 'Cawang'),
  createKelurahan('Kramat Jati', 'Batu Ampar', 2, RiskLevel.SEDANG, -6.2780, 106.8620),
  createKelurahan('Kramat Jati', 'Tengah', 2, RiskLevel.SEDANG, -6.2850, 106.8700),
  createKelurahan('Kramat Jati', 'Dukuh', 2, RiskLevel.SEDANG, -6.2900, 106.8800),
  createKelurahan('Kramat Jati', 'Kampung Tengah', 1.5, RiskLevel.TINGGI, -6.2820, 106.8650),

  // --- KECAMATAN PASAR REBO ---
  createKelurahan('Pasar Rebo', 'Cijantung', 2, RiskLevel.SEDANG, -6.3150, 106.8580),
  createKelurahan('Pasar Rebo', 'Baru', 2, RiskLevel.SEDANG, -6.3200, 106.8500),
  createKelurahan('Pasar Rebo', 'Gedong', 1.5, RiskLevel.TINGGI, -6.2950, 106.8600),
  createKelurahan('Pasar Rebo', 'Kalisari', 1.5, RiskLevel.TINGGI, -6.3300, 106.8600, 'Gedong'),
  createKelurahan('Pasar Rebo', 'Pekayon', 2, RiskLevel.SEDANG, -6.3250, 106.8680),

  // --- KECAMATAN MAKASAR ---
  createKelurahan('Makasar', 'Makasar', 2, RiskLevel.SEDANG, -6.2800, 106.8850),
  createKelurahan('Makasar', 'Halim Perdana Kusuma', 2, RiskLevel.SEDANG, -6.2650, 106.8850),
  // Cipinang Melayu (Makasar) - duplicate name handled by distinct coordinate and label
  createKelurahan('Makasar', 'Cipinang Melayu (Mks)', 1, RiskLevel.SANGAT_TINGGI, -6.2500, 106.8900), 
  createKelurahan('Makasar', 'Kebon Pala', 1.5, RiskLevel.TINGGI, -6.2550, 106.8750, 'Cipinang Melayu'),

  // --- KECAMATAN CIRACAS ---
  createKelurahan('Ciracas', 'Ciracas', 2, RiskLevel.SEDANG, -6.3350, 106.8750),
  createKelurahan('Ciracas', 'Cibubur', 2.5, RiskLevel.RENDAH, -6.3500, 106.8850),
  createKelurahan('Ciracas', 'Kelapa Dua Wetan', 2, RiskLevel.SEDANG, -6.3300, 106.8900),
  createKelurahan('Ciracas', 'Rambutan', 1.5, RiskLevel.TINGGI, -6.3150, 106.8800),

  // --- KECAMATAN CIPAYUNG ---
  createKelurahan('Cipayung', 'Cipayung', 2, RiskLevel.SEDANG, -6.3050, 106.9050),
  createKelurahan('Cipayung', 'Bambu Apus', 2, RiskLevel.SEDANG, -6.3000, 106.9150),
  createKelurahan('Cipayung', 'Setu', 2.5, RiskLevel.RENDAH, -6.3150, 106.9150),
  createKelurahan('Cipayung', 'Lubang Buaya', 2, RiskLevel.SEDANG, -6.2900, 106.9100),
  createKelurahan('Cipayung', 'Munjul', 2, RiskLevel.SEDANG, -6.3500, 106.9000),
  createKelurahan('Cipayung', 'Pondok Ranggon', 2, RiskLevel.SEDANG, -6.3450, 106.9200),
  createKelurahan('Cipayung', 'Ceger', 2, RiskLevel.SEDANG, -6.3050, 106.8950),
  createKelurahan('Cipayung', 'Cilangkap', 2.5, RiskLevel.RENDAH, -6.3300, 106.9100),
  createKelurahan('Cipayung', 'Cipayung Jaya', 2, RiskLevel.SEDANG, -6.3350, 106.9250),
];
