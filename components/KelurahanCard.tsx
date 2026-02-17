import React from 'react';
import { KelurahanData, ForecastData, FloodStatus, CalculatedFloodStatus } from '../types';
import { Droplets, ShieldCheck, AlertTriangle, Siren, Waves, Share2 } from 'lucide-react';
import { getWeatherDescription } from '../services/weatherService';

interface Props {
  data: KelurahanData;
  forecast: ForecastData[];
  statusData: CalculatedFloodStatus;
  isLoading: boolean;
}

export const KelurahanCard: React.FC<Props> = ({ data, forecast, statusData, isLoading }) => {
  
  let borderColor = "";
  let badgeColor = "";
  let StatusIcon = ShieldCheck;
  let statusText = "";
  let cardBg = "";

  switch (statusData.status) {
    case FloodStatus.BANJIR:
      borderColor = "border-red-500 ring-2 ring-red-500 shadow-[0_0_20px_rgba(239,68,68,0.4)]";
      badgeColor = "bg-red-500 text-white";
      StatusIcon = Waves;
      statusText = "BANJIR";
      cardBg = "bg-red-50/90 dark:bg-red-900/20";
      break;
    case FloodStatus.SIAGA:
      borderColor = "border-orange-500 ring-1 ring-orange-500 shadow-[0_0_15px_rgba(249,115,22,0.3)]";
      badgeColor = "bg-orange-500 text-white";
      StatusIcon = Siren;
      statusText = "SIAGA";
      cardBg = "bg-orange-50/90 dark:bg-orange-900/20";
      break;
    case FloodStatus.WASPADA:
      borderColor = "border-yellow-400 shadow-[0_0_10px_rgba(250,204,21,0.2)]";
      badgeColor = "bg-yellow-400 text-black";
      StatusIcon = AlertTriangle;
      statusText = "WASPADA";
      cardBg = "bg-yellow-50/80 dark:bg-yellow-900/10";
      break;
    case FloodStatus.AMAN:
    default:
      borderColor = "border-gray-200 dark:border-gray-700 hover:border-green-400 dark:hover:border-green-500";
      badgeColor = "bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-400";
      StatusIcon = ShieldCheck;
      statusText = "AMAN";
      cardBg = "bg-white/60 dark:bg-gray-800/60";
      break;
  }

  const handleShare = (e: React.MouseEvent) => {
    e.stopPropagation();
    const text = `⚠️ *PERINGATAN DINI FLOODGUARD* ⚠️\n\nWilayah: *${data.name}* (${data.district})\nStatus: *${statusText}*\nCuaca: ${getWeatherDescription(forecast[0]?.code || 0).label}, ${forecast[0]?.precip}mm\n\nPantau selengkapnya di Jaktim FloodGuard AI.`;
    const url = `https://wa.me/?text=${encodeURIComponent(text)}`;
    window.open(url, '_blank');
  };

  if (isLoading) {
    return (
      <div className="animate-pulse bg-white dark:bg-gray-800 rounded-3xl p-6 h-72"></div>
    );
  }

  return (
    <div className={`glass-card rounded-3xl p-5 transition-all duration-300 hover:scale-[1.02] flex flex-col justify-between ${borderColor} ${cardBg} group relative`}>
      {/* Share Button (Only visible on hover or always on touch) */}
      <button 
        onClick={handleShare}
        className="absolute top-4 right-4 p-2 rounded-full bg-white/50 hover:bg-white dark:bg-black/20 dark:hover:bg-black/50 opacity-0 group-hover:opacity-100 transition-all shadow-sm"
        title="Bagikan Peringatan"
      >
        <Share2 size={16} className="text-gray-700 dark:text-gray-200"/>
      </button>

      {/* Header */}
      <div>
        <div className="flex justify-between items-start mb-3">
          <div>
            <h3 className="font-bold text-lg text-gray-900 dark:text-white leading-tight truncate max-w-[150px]">{data.name}</h3>
            <p className="text-[10px] text-gray-500 dark:text-gray-400 uppercase tracking-wider font-bold">
               {data.district}
            </p>
          </div>
          <div className={`px-2.5 py-1 rounded-lg text-[10px] font-black tracking-widest flex items-center gap-1.5 shadow-sm ${badgeColor}`}>
            <StatusIcon size={12} strokeWidth={3} />
            {statusText}
          </div>
        </div>

        {/* Dynamic Status Message */}
        <div className="mb-4 text-xs font-medium text-gray-600 dark:text-gray-300 bg-white/40 dark:bg-black/20 p-2 rounded-lg border border-white/10">
            {statusData.status === FloodStatus.BANJIR && (
                <span>⚠️ Durasi hujan telah melebihi batas {data.rules.durationThreshold} jam!</span>
            )}
            {statusData.status === FloodStatus.SIAGA && (
                <span>🚨 {data.rules.durationThreshold - statusData.currentRainDuration} jam lagi menuju banjir jika hujan berlanjut.</span>
            )}
            {statusData.status === FloodStatus.WASPADA && (
                <span>🌧️ Sedang hujan ({statusData.currentRainDuration} jam). Pantau terus.</span>
            )}
            {statusData.status === FloodStatus.AMAN && (
                <span className="flex items-center gap-1"><ShieldCheck size={10}/> Tidak ada potensi banjir saat ini.</span>
            )}
            {data.rules.dependency && statusData.status !== FloodStatus.AMAN && (
               <div className="mt-1 pt-1 border-t border-gray-400/20 opacity-80 text-[10px]">
                   *Syarat: {data.rules.dependency} harus banjir.
               </div>
            )}
        </div>
      </div>

      {/* Main Stat - Current Weather */}
      <div className="flex items-center justify-between mb-5">
        <div className="flex items-center gap-3">
            <div className="text-4xl drop-shadow-sm filter">
                {getWeatherDescription(forecast[0]?.code || 0).icon}
            </div>
            <div>
                <div className="text-2xl font-bold dark:text-white tracking-tight">{forecast[0]?.temp}°</div>
                <div className="text-[10px] font-medium text-gray-500 dark:text-gray-400 leading-none">{getWeatherDescription(forecast[0]?.code || 0).label}</div>
            </div>
        </div>
        <div className="text-right">
             <div className="text-[10px] uppercase text-gray-400 mb-0.5">Curah Hujan</div>
             <div className="text-lg font-bold text-blue-500 flex items-center justify-end">
                <Droplets size={12} className="mr-1"/>
                {forecast[0]?.precip} <span className="text-[10px] ml-0.5 text-gray-400">mm</span>
             </div>
        </div>
      </div>

      {/* 5-Hour Forecast Strip */}
      <div className="grid grid-cols-5 gap-1.5">
        {forecast.slice(0, 5).map((f, idx) => (
          <div key={idx} className="flex flex-col items-center justify-center p-1.5 rounded-xl bg-white/40 dark:bg-white/5 border border-white/20 dark:border-white/5">
            <span className="text-[9px] font-bold text-gray-500 dark:text-gray-400">{f.hour}</span>
            <span className="text-lg my-0.5">{getWeatherDescription(f.code).icon}</span>
          </div>
        ))}
      </div>
    </div>
  );
};
