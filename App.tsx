import React, { useEffect, useState, useMemo } from 'react';
import { Navbar } from './components/Navbar';
import { KelurahanCard } from './components/KelurahanCard';
import { MapsView } from './components/MapsView'; 
import { ChatBot } from './components/ChatBot'; // Import ChatBot
import { KELURAHAN_DATASET } from './constants';
import { fetchWeather, getWeatherDescription } from './services/weatherService';
import { analyzeFloodRiskWithGemini } from './services/geminiService';
import { calculateRainDuration, determineStatus } from './utils/floodLogic';
import { ForecastData, KelurahanData, WeatherResponse, FloodStatus, CalculatedFloodStatus } from './types';
import { MapPin, Sparkles, Wind, Thermometer, Droplets, Clock, Filter, ShieldCheck, Siren, Waves, AlertTriangle } from 'lucide-react';

const App: React.FC = () => {
  // Navigation State
  const [activePage, setActivePage] = useState<'dashboard' | 'maps'>('dashboard');

  // Data State
  const [userLocation, setUserLocation] = useState<{ lat: number; lon: number } | null>(null);
  const [currentWeather, setCurrentWeather] = useState<WeatherResponse | null>(null);
  const [userForecast, setUserForecast] = useState<ForecastData[]>([]);
  const [districtForecasts, setDistrictForecasts] = useState<Record<string, ForecastData[]>>({});
  const [kelurahanStatuses, setKelurahanStatuses] = useState<Record<string, CalculatedFloodStatus>>({});
  
  const [loading, setLoading] = useState(true);
  const [aiAnalysis, setAiAnalysis] = useState<string>('');
  const [aiLoading, setAiLoading] = useState(false);
  
  // Dashboard Filters
  const [activeDistrictFilter, setActiveDistrictFilter] = useState<string>('All');
  const [activeStatusFilter, setActiveStatusFilter] = useState<FloodStatus | 'ALL'>('ALL');

  // 1. Get User Location
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserLocation({
            lat: position.coords.latitude,
            lon: position.coords.longitude,
          });
        },
        () => {
          setUserLocation({ lat: -6.225, lon: 106.900 });
        }
      );
    } else {
      setUserLocation({ lat: -6.225, lon: 106.900 });
    }
  }, []);

  // 2. Fetch Data & Calculate Logic
  useEffect(() => {
    if (!userLocation) return;

    const fetchData = async () => {
      setLoading(true);
      try {
        // A. User Weather
        const userData = await fetchWeather(userLocation.lat, userLocation.lon);
        setCurrentWeather(userData);
        
        // Process User Forecast
        const now = new Date();
        const currentHour = now.getHours();
        const userStartIndex = userData.hourly.time.findIndex(t => new Date(t).getHours() === currentHour);
        const userActualStart = userStartIndex === -1 ? 0 : userStartIndex;
        
        const myNext5Hours: ForecastData[] = [];
        for (let i = 0; i < 5; i++) {
            const idx = userActualStart + i;
            if (userData.hourly.time[idx]) {
                const d = new Date(userData.hourly.time[idx]);
                myNext5Hours.push({
                    hour: `${d.getHours()}:00`,
                    temp: userData.hourly.temperature_2m[idx],
                    precip: userData.hourly.precipitation[idx],
                    code: userData.hourly.weathercode[idx],
                    humidity: userData.hourly.relativehumidity_2m[idx],
                    feelsLike: userData.hourly.apparent_temperature[idx]
                });
            }
        }
        setUserForecast(myNext5Hours);

        // B. Fetch Weather for Districts & Calculate Flood Status
        const uniqueDistricts = Array.from(new Set(KELURAHAN_DATASET.map(k => k.district)));
        const forecasts: Record<string, ForecastData[]> = {};
        const districtRawWeather: Record<string, WeatherResponse> = {}; 

        // Parallel Fetch
        await Promise.all(uniqueDistricts.map(async (district) => {
          const rep = KELURAHAN_DATASET.find(k => k.district === district);
          if (rep) {
            const w = await fetchWeather(rep.lat, rep.lon);
            districtRawWeather[district] = w;

            const distStartIndex = w.hourly.time.findIndex(t => new Date(t).getHours() === currentHour);
            const distActualStart = distStartIndex === -1 ? 0 : distStartIndex;
            
            const next5Hours: ForecastData[] = [];
            for (let i = 0; i < 5; i++) {
                const idx = distActualStart + i;
                if (w.hourly.time[idx]) {
                    const d = new Date(w.hourly.time[idx]);
                    next5Hours.push({
                        hour: `${d.getHours()}:00`,
                        temp: w.hourly.temperature_2m[idx],
                        precip: w.hourly.precipitation[idx],
                        code: w.hourly.weathercode[idx]
                    });
                }
            }
            forecasts[district] = next5Hours;
          }
        }));
        setDistrictForecasts(forecasts);

        // C. Calculate Status logic
        const tempStatuses: Record<string, CalculatedFloodStatus> = {};
        const getRawData = (district: string) => {
            const w = districtRawWeather[district];
            if (!w) return { duration: 0, isRaining: false };
            const idx = w.hourly.time.findIndex(t => new Date(t).getHours() === currentHour);
            const actualIdx = idx === -1 ? 0 : idx;
            const duration = calculateRainDuration(w.hourly, actualIdx);
            const isRaining = w.hourly.precipitation[actualIdx] >= 0.5;
            return { duration, isRaining };
        };

        // Pass 1
        KELURAHAN_DATASET.forEach(k => {
            const { duration, isRaining } = getRawData(k.district);
            tempStatuses[k.name] = {
                status: determineStatus(duration, isRaining, k.rules),
                currentRainDuration: duration,
                isRainingNow: isRaining,
                dependencyMet: true 
            };
        });

        // Pass 2 (Dependencies)
        KELURAHAN_DATASET.forEach(k => {
            if (k.rules.dependency) {
                const depName = k.rules.dependency;
                const depStatus = tempStatuses[depName]?.status;
                const { duration, isRaining } = getRawData(k.district);
                const finalStatus = determineStatus(duration, isRaining, k.rules, depStatus);
                
                tempStatuses[k.name] = {
                    ...tempStatuses[k.name],
                    status: finalStatus,
                    dependencyMet: depStatus === FloodStatus.BANJIR
                };
            }
        });

        setKelurahanStatuses(tempStatuses);

      } catch (err) {
        console.error("Failed to load data", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
    const interval = setInterval(fetchData, 600000); // 10 mins
    return () => clearInterval(interval);

  }, [userLocation]);

  const handleAnalyze = async () => {
    if (!currentWeather || !userLocation) return;
    setAiLoading(true);
    const myLocData: KelurahanData = {
        name: "Lokasi Anda",
        district: "Jakarta Timur",
        lat: userLocation.lat,
        lon: userLocation.lon,
        rules: { durationThreshold: 2, baseRisk: "Sedang" as any }
    };
    const result = await analyzeFloodRiskWithGemini(myLocData, userForecast);
    setAiAnalysis(result);
    setAiLoading(false);
  };

  // Filter Logic (Only used in Dashboard)
  const filteredKelurahans = useMemo(() => {
    let result = KELURAHAN_DATASET;
    if (activeDistrictFilter !== 'All') {
      result = result.filter(k => k.district === activeDistrictFilter);
    }
    if (activeStatusFilter !== 'ALL') {
      result = result.filter(k => {
        const status = kelurahanStatuses[k.name]?.status;
        return status === activeStatusFilter;
      });
    }
    const priority = {
        [FloodStatus.BANJIR]: 0,
        [FloodStatus.SIAGA]: 1,
        [FloodStatus.WASPADA]: 2,
        [FloodStatus.AMAN]: 3
    };
    return result.sort((a, b) => {
        const statusA = kelurahanStatuses[a.name]?.status || FloodStatus.AMAN;
        const statusB = kelurahanStatuses[b.name]?.status || FloodStatus.AMAN;
        return priority[statusA] - priority[statusB];
    });
  }, [activeDistrictFilter, activeStatusFilter, kelurahanStatuses]);

  const uniqueDistricts = ['All', ...Array.from(new Set(KELURAHAN_DATASET.map(k => k.district)))];
  const currentDetails = userForecast.length > 0 ? userForecast[0] : null;

  const counts = useMemo(() => {
    const c = { [FloodStatus.BANJIR]: 0, [FloodStatus.SIAGA]: 0, [FloodStatus.WASPADA]: 0, [FloodStatus.AMAN]: 0 };
    Object.values(kelurahanStatuses).forEach(s => {
        if(c[s.status] !== undefined) c[s.status]++;
    });
    return c;
  }, [kelurahanStatuses]);

  // Construct status summary string for ChatBot context
  const statusContext = useMemo(() => {
    const banjirAreas = Object.keys(kelurahanStatuses).filter(k => kelurahanStatuses[k].status === FloodStatus.BANJIR);
    if (banjirAreas.length > 0) return `Saat ini sedang BANJIR di: ${banjirAreas.join(', ')}.`;
    const siagaAreas = Object.keys(kelurahanStatuses).filter(k => kelurahanStatuses[k].status === FloodStatus.SIAGA);
    if (siagaAreas.length > 0) return `Saat ini status SIAGA di: ${siagaAreas.join(', ')}.`;
    return "Situasi di Jakarta Timur terpantau AMAN secara umum, namun tetap waspada.";
  }, [kelurahanStatuses]);

  return (
    <div className="min-h-screen pb-0 bg-gray-50 dark:bg-genz-dark transition-colors duration-500 flex flex-col">
      <Navbar currentPage={activePage} onNavigate={setActivePage} />

      {/* CONDITIONAL RENDERING */}
      {activePage === 'maps' ? (
        <MapsView 
            dataset={KELURAHAN_DATASET}
            kelurahanStatuses={kelurahanStatuses}
            isLoading={loading}
        />
      ) : (
        /* DASHBOARD CONTENT */
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 pb-20 w-full flex-1">
            
            {/* HERO */}
            <div className="mb-10 relative overflow-hidden rounded-[2.5rem] bg-gradient-to-br from-[#6366f1] via-[#8b5cf6] to-[#ec4899] dark:from-[#312e81] dark:via-[#5b21b6] dark:to-[#831843] shadow-2xl p-6 md:p-10 text-white ring-1 ring-white/20">
                <div className="absolute top-0 right-0 -mr-20 -mt-20 opacity-20 animate-pulse">
                    <CloudRainIcon size={400} />
                </div>
                <div className="relative z-10">
                    <div className="flex flex-col lg:flex-row gap-8 lg:items-stretch">
                        <div className="flex-1 flex flex-col justify-center">
                            <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-md px-4 py-1.5 rounded-full border border-white/10 w-fit mb-4 shadow-lg">
                                <MapPin size={16} className="text-yellow-300 animate-bounce" />
                                <span className="text-sm font-semibold tracking-wide">Lokasi Kamu Sekarang</span>
                            </div>

                            {loading || !currentWeather ? (
                                <div className="animate-pulse space-y-4">
                                    <div className="h-16 w-3/4 bg-white/20 rounded-2xl"></div>
                                    <div className="h-8 w-1/2 bg-white/20 rounded-xl"></div>
                                </div>
                            ) : (
                                <>
                                    <div className="flex items-center gap-4 mb-2">
                                        <span className="text-7xl md:text-8xl font-bold tracking-tighter drop-shadow-lg">
                                            {currentWeather.current_weather?.temperature}°
                                        </span>
                                        <div className="text-6xl md:text-7xl drop-shadow-md animate-pulse">
                                            {getWeatherDescription(currentWeather.current_weather?.weathercode || 0).icon}
                                        </div>
                                    </div>
                                    <h1 className="text-3xl md:text-4xl font-bold mb-2">
                                        {getWeatherDescription(currentWeather.current_weather?.weathercode || 0).label}
                                    </h1>
                                    <p className="text-white/80 text-lg font-medium mb-6 flex items-center gap-2">
                                    <Thermometer size={18} /> Feels like {currentDetails?.feelsLike}°C
                                    </p>

                                    <div className="flex flex-col sm:flex-row gap-4 mt-auto">
                                        <button 
                                            onClick={handleAnalyze}
                                            disabled={aiLoading}
                                            className="group relative flex items-center justify-center gap-2 bg-white text-purple-600 px-6 py-3.5 rounded-2xl font-bold hover:bg-yellow-300 hover:text-purple-900 transition-all disabled:opacity-50 shadow-[0_0_20px_rgba(255,255,255,0.3)] active:scale-95"
                                        >
                                            {aiLoading ? <span className="animate-spin text-xl">✨</span> : <Sparkles size={20} />}
                                            {aiLoading ? 'Thinking...' : 'Analisa Banjir AI'}
                                        </button>
                                    </div>
                                </>
                            )}
                            {aiAnalysis && (
                                <div className="mt-6 bg-black/20 backdrop-blur-md rounded-2xl p-4 border border-white/10 animate-fade-in-up">
                                    <p className="text-white/95 leading-relaxed font-medium text-sm md:text-base">{aiAnalysis}</p>
                                </div>
                            )}
                        </div>

                        <div className="lg:w-[450px] flex flex-col gap-4">
                            <div className="grid grid-cols-2 gap-3">
                                <div className="bg-white/10 backdrop-blur-md border border-white/20 p-4 rounded-2xl flex flex-col items-center justify-center gap-1">
                                    <Wind className="mb-1 opacity-70" size={24} />
                                    <span className="text-2xl font-bold">{currentWeather?.current_weather?.windspeed}</span>
                                    <span className="text-xs opacity-70 uppercase tracking-widest">km/h Wind</span>
                                </div>
                                <div className="bg-white/10 backdrop-blur-md border border-white/20 p-4 rounded-2xl flex flex-col items-center justify-center gap-1">
                                    <Droplets className="mb-1 opacity-70" size={24} />
                                    <span className="text-2xl font-bold">{currentDetails?.humidity}%</span>
                                    <span className="text-xs opacity-70 uppercase tracking-widest">Humidity</span>
                                </div>
                            </div>
                            <div className="bg-black/20 backdrop-blur-xl border border-white/10 rounded-3xl p-5 flex-1 flex flex-col">
                                <div className="flex items-center justify-between mb-4 border-b border-white/10 pb-2">
                                    <h3 className="font-bold text-lg flex items-center gap-2"><Clock size={18} /> Forecast (5 Jam)</h3>
                                </div>
                                <div className="grid grid-cols-5 gap-2 h-full">
                                    {loading ? [1,2,3,4,5].map(i => <div key={i} className="bg-white/5 rounded-xl animate-pulse h-full"></div>) : userForecast.slice(0, 5).map((f, idx) => (
                                        <div key={idx} className="flex flex-col items-center justify-between p-2 rounded-2xl bg-gradient-to-b from-white/10 to-transparent border border-white/5">
                                            <span className="text-xs font-medium opacity-80">{f.hour}</span>
                                            <div className="text-2xl my-1">{getWeatherDescription(f.code).icon}</div>
                                            <div className="flex flex-col items-center">
                                                <span className="text-sm font-bold">{Math.round(f.temp)}°</span>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* STATUS FILTERS */}
            <div className="mb-8">
                <h2 className="text-xl font-bold mb-4 flex items-center gap-2 dark:text-white">
                    <Filter size={20} className="text-genz-purple"/> Filter Status Banjir
                </h2>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                    <StatusButton 
                        active={activeStatusFilter === 'ALL'} 
                        onClick={() => setActiveStatusFilter('ALL')}
                        label="Semua Wilayah"
                        count={KELURAHAN_DATASET.length}
                        colorClass="bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300"
                    />
                    <StatusButton 
                        active={activeStatusFilter === FloodStatus.BANJIR} 
                        onClick={() => setActiveStatusFilter(FloodStatus.BANJIR)}
                        label="BANJIR"
                        count={counts[FloodStatus.BANJIR]}
                        colorClass="bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400"
                        icon={<Waves size={16}/>}
                    />
                    <StatusButton 
                        active={activeStatusFilter === FloodStatus.SIAGA} 
                        onClick={() => setActiveStatusFilter(FloodStatus.SIAGA)}
                        label="SIAGA"
                        count={counts[FloodStatus.SIAGA]}
                        colorClass="bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400"
                        icon={<Siren size={16}/>}
                    />
                    <StatusButton 
                        active={activeStatusFilter === FloodStatus.WASPADA} 
                        onClick={() => setActiveStatusFilter(FloodStatus.WASPADA)}
                        label="WASPADA"
                        count={counts[FloodStatus.WASPADA]}
                        colorClass="bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400"
                        icon={<AlertTriangle size={16}/>}
                    />
                </div>
            </div>

            {/* DISTRICT FILTERS */}
            <div className="flex items-center gap-3 overflow-x-auto pb-6 scrollbar-hide mb-2">
                <span className="text-gray-400 font-medium text-sm pl-2 shrink-0 uppercase tracking-wider">Kecamatan:</span>
                {uniqueDistricts.map(district => (
                    <button
                        key={district}
                        onClick={() => setActiveDistrictFilter(district)}
                        className={`whitespace-nowrap px-4 py-2 rounded-xl text-xs font-bold transition-all border ${
                            activeDistrictFilter === district 
                            ? 'bg-genz-purple text-white shadow-md border-transparent' 
                            : 'bg-white dark:bg-gray-800 text-gray-500 dark:text-gray-400 border-gray-200 dark:border-gray-700'
                        }`}
                    >
                        {district}
                    </button>
                ))}
            </div>

            {/* GRID CONTENT */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {filteredKelurahans.map((kelurahan) => (
                    <KelurahanCard
                        key={`${kelurahan.district}-${kelurahan.name}`}
                        data={kelurahan}
                        forecast={districtForecasts[kelurahan.district] || []}
                        statusData={kelurahanStatuses[kelurahan.name] || { status: FloodStatus.AMAN, currentRainDuration: 0, isRainingNow: false, dependencyMet: true }}
                        isLoading={loading}
                    />
                ))}
            </div>
            
            {!loading && filteredKelurahans.length === 0 && (
                <div className="flex flex-col items-center justify-center py-20 text-gray-500 dark:text-gray-400">
                    <ShieldCheck size={48} className="mb-4 opacity-50" />
                    <p>Tidak ada wilayah dengan status ini.</p>
                </div>
            )}
        </main>
      )}

      {/* Floating Chat Bot */}
      <ChatBot globalStatusContext={statusContext} />

    </div>
  );
};

// Sub-component for Status Buttons
const StatusButton = ({ active, onClick, label, count, colorClass, icon }: any) => (
    <button
        onClick={onClick}
        className={`flex items-center justify-between px-4 py-3 rounded-2xl transition-all border-2 ${
            active 
            ? 'border-current scale-[1.02] shadow-sm ring-2 ring-offset-2 ring-offset-gray-50 dark:ring-offset-genz-dark ' + colorClass 
            : 'border-transparent opacity-70 hover:opacity-100 bg-white dark:bg-gray-800'
        }`}
    >
        <div className="flex items-center gap-2 font-bold">
            {icon}
            {label}
        </div>
        <span className="bg-white/50 dark:bg-black/20 px-2 py-0.5 rounded-md text-xs font-black">
            {count}
        </span>
    </button>
);

const CloudRainIcon = ({ size }: { size: number }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="0.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M4 14.899A7 7 0 1 1 15.71 8h1.79a4.5 4.5 0 0 1 2.5 8.242" />
        <path d="M16 14v6" /><path d="M8 14v6" /><path d="M12 16v6" />
    </svg>
);

export default App;
