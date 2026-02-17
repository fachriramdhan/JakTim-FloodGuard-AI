import { GoogleGenAI } from "@google/genai";
import { KelurahanData, ForecastData } from '../types';

const apiKey = process.env.API_KEY; // Access directly

export const analyzeFloodRiskWithGemini = async (
  location: KelurahanData,
  forecast: ForecastData[]
): Promise<string> => {
  if (!apiKey) {
    return "API Key not found for AI analysis.";
  }

  const ai = new GoogleGenAI({ apiKey });
  
  // Prepare concise context
  const weatherSummary = forecast.map(f => 
    `Jam ${f.hour}: ${f.precip}mm hujan (${f.temp}°C)`
  ).join(', ');

  const prompt = `
    Analisa risiko banjir untuk Kelurahan ${location.name}, Kecamatan ${location.district}.
    
    Data Cuaca 5 Jam Kedepan:
    ${weatherSummary}
    
    Aturan Banjir Lokal:
    "Banjir jika hujan >= ${location.rules.durationThreshold} jam. Base Risk: ${location.rules.baseRisk}. Dependency: ${location.rules.dependency || 'None'}."

    Tugas:
    Berikan analisa singkat, padat, dan gaya bahasa Gen-Z (santai tapi informatif) apakah akan banjir atau aman.
    Jangan terlalu formal. Gunakan emoji. Maksimal 3 kalimat.
  `;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
    });
    return response.text || "Gagal menganalisa.";
  } catch (error) {
    console.error("Gemini Error:", error);
    return "AI sedang offline bestie, tapi tetap waspada ya!";
  }
};

export const getChatResponse = async (
    message: string, 
    contextStatus: string
): Promise<string> => {
    if (!apiKey) return "Maaf, sistem AI belum dikonfigurasi.";

    const ai = new GoogleGenAI({ apiKey });
    
    const systemInstruction = `
        Kamu adalah SiagaBot, asisten kesiapsiagaan bencana banjir untuk Jakarta Timur.
        Gaya bicaramu: Membantu, Tenang, Informatif, tapi tetap santai (Gen-Z friendly).
        
        Konteks Situasi Saat Ini:
        ${contextStatus}

        Tugasmu:
        1. Menjawab pertanyaan user seputar persiapan banjir, evakuasi, dan pertolongan pertama.
        2. Jika situasi AMAN, ingatkan untuk tetap menjaga kebersihan saluran air.
        3. Jika situasi BANJIR/SIAGA, berikan instruksi keselamatan yang jelas (matikan listrik, amankan dokumen, evakuasi).
        4. Jawablah dengan ringkas (maksimal 3-4 kalimat).
    `;

    try {
        const response = await ai.models.generateContent({
            model: 'gemini-3-flash-preview',
            contents: message,
            config: {
                systemInstruction: systemInstruction,
            }
        });
        return response.text || "Maaf, saya kurang mengerti.";
    } catch (error) {
        console.error("Chat Error:", error);
        return "Sinyal sedang buruk, utamakan keselamatan diri dulu ya!";
    }
};
