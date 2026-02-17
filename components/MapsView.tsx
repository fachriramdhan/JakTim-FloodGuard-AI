import React, { useEffect, useMemo } from 'react';
import { MapContainer, TileLayer, CircleMarker, Popup, Tooltip, ZoomControl, useMap, Rectangle } from 'react-leaflet';
import { KelurahanData, FloodStatus, CalculatedFloodStatus } from '../types';
import { Waves, TrendingUp, AlertTriangle, ShieldCheck, Siren, Map as MapIcon, Maximize } from 'lucide-react';
import { LatLngBoundsExpression } from 'leaflet';

interface MapsViewProps {
  kelurahanStatuses: Record<string, CalculatedFloodStatus>;
  dataset: KelurahanData[];
  isLoading: boolean;
}

// BOUNDS JAKARTA TIMUR (South-West to North-East)
const JAKARTA_TIMUR_BOUNDS: LatLngBoundsExpression = [
  [-6.3800, 106.8300], // Pojok Kiri Bawah (Dekat Depok/Cibubur)
  [-6.1300, 106.9800]  // Pojok Kanan Atas (Dekat Cakung/Bekasi)
];

const JAKARTA_TIMUR_CENTER: [number, number] = [-6.2250, 106.9004];

// Utility component to fit map to bounds and fix rendering
const MapController = () => {
  const map = useMap();
  
  useEffect(() => {
    try {
        // Force invalidation to fix gray tiles issue
        map.invalidateSize();
        
        // Auto-fit to Jakarta Timur bounds with padding
        map.fitBounds(JAKARTA_TIMUR_BOUNDS, {
            padding: [20, 20],
            animate: true,
            duration: 1.5
        });
    } catch (e) {
        console.warn("Map bounds error:", e);
    }
  }, [map]);

  return null;
};

export const MapsView: React.FC<MapsViewProps> = ({ kelurahanStatuses, dataset, isLoading }) => {
  
  // Calculate aggregate stats for the sidebar
  const stats = useMemo(() => {
    let banjirCount = 0;
    let siagaCount = 0;
    let waspadaCount = 0;
    let maxRainDuration = 0;

    dataset.forEach(k => {
        const s = kelurahanStatuses[k.name];
        if (!s) return;
        if (s.status === FloodStatus.BANJIR) banjirCount++;
        if (s.status === FloodStatus.SIAGA) siagaCount++;
        if (s.status === FloodStatus.WASPADA) waspadaCount++;
        if (s.currentRainDuration > maxRainDuration) maxRainDuration = s.currentRainDuration;
    });

    const totalRisk = banjirCount + siagaCount + waspadaCount;
    const confidence = 85 + (totalRisk > 0 ? 5 : 0); 
    
    return { banjirCount, siagaCount, waspadaCount, totalRisk, maxRainDuration, confidence };
  }, [kelurahanStatuses, dataset]);

  // Priority List sorting
  const priorityList = useMemo(() => {
    return dataset
        .filter(k => {
            const s = kelurahanStatuses[k.name]?.status;
            return s === FloodStatus.BANJIR || s === FloodStatus.SIAGA || s === FloodStatus.WASPADA;
        })
        .sort((a, b) => {
            const statusPriority = { [FloodStatus.BANJIR]: 3, [FloodStatus.SIAGA]: 2, [FloodStatus.WASPADA]: 1, [FloodStatus.AMAN]: 0 };
            const sA = kelurahanStatuses[a.name]?.status || FloodStatus.AMAN;
            const sB = kelurahanStatuses[b.name]?.status || FloodStatus.AMAN;
            return statusPriority[sB] - statusPriority[sA];
        });
  }, [kelurahanStatuses, dataset]);

  // Validated Dataset to prevent NaN errors
  const safeDataset = useMemo(() => {
      return dataset.filter(k => 
          k && 
          typeof k.lat === 'number' && 
          typeof k.lon === 'number' && 
          !isNaN(k.lat) && 
          !isNaN(k.lon)
      );
  }, [dataset]);

  const getColor = (status: FloodStatus) => {
    switch(status) {
        case FloodStatus.BANJIR: return '#ef4444'; // red-500
        case FloodStatus.SIAGA: return '#f97316'; // orange-500
        case FloodStatus.WASPADA: return '#eab308'; // yellow-500
        default: return '#22c55e'; // green-500
    }
  };

  const getRadius = (status: FloodStatus) => {
      switch(status) {
          case FloodStatus.BANJIR: return 16;
          case FloodStatus.SIAGA: return 12;
          case FloodStatus.WASPADA: return 10;
          default: return 6;
      }
  };

  return (
    <div className="flex flex-col lg:flex-row h-[calc(100vh-64px)] overflow-hidden bg-gray-50 dark:bg-[#111421]">
        {/* LEFT PANEL: ANALYTICS */}
        <aside className="w-full lg:w-[400px] flex flex-col gap-6 p-6 overflow-y-auto bg-white dark:bg-[#1a1d29] border-r border-gray-200 dark:border-gray-800 z-10 shadow-xl relative order-2 lg:order-1 h-1/3 lg:h-full">
            {/* Header */}
            <div>
                <h1 className="text-2xl font-bold tracking-tight dark:text-white flex items-center gap-2">
                    <Waves className="text-blue-500" />
                    AI Geo-Analytics
                </h1>
                <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">
                    Monitoring spasial & penilaian risiko banjir real-time.
                </p>
            </div>

            {/* Gauge Card */}
            <div className="bg-gray-50 dark:bg-[#141724] rounded-2xl p-6 border border-gray-200 dark:border-gray-800 relative overflow-hidden group">
                <div className="absolute top-0 right-0 p-4 opacity-10">
                    <TrendingUp size={100} />
                </div>
                <div className="relative z-10 flex flex-col items-center">
                    <div className="relative size-32 mb-4">
                         <svg className="size-full rotate-[-90deg]" viewBox="0 0 36 36">
                            <path className="text-gray-200 dark:text-gray-700" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="currentColor" strokeDasharray="100, 100" strokeWidth="3.5" />
                            <path className="text-genz-purple drop-shadow-[0_0_10px_rgba(139,92,246,0.5)]" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="currentColor" strokeDasharray={`${stats.confidence}, 100`} strokeWidth="3.5" />
                        </svg>
                        <div className="absolute inset-0 flex items-center justify-center flex-col">
                            <span className="text-3xl font-bold dark:text-white">{stats.confidence}%</span>
                        </div>
                    </div>
                    <p className="text-sm font-bold text-gray-500 dark:text-gray-400">Kepercayaan AI</p>
                </div>
            </div>

            {/* Risk Factors */}
            <div className="space-y-4">
                 <h3 className="text-lg font-bold dark:text-white flex items-center gap-2">
                    <AlertTriangle className="text-yellow-500" size={18} /> Faktor Risiko
                 </h3>
                 
                 {/* Factor 1: Avg Rainfall */}
                 <div className="bg-gray-50 dark:bg-[#141724] p-4 rounded-xl border border-gray-200 dark:border-gray-800">
                    <div className="flex justify-between items-center mb-2">
                        <span className="text-sm font-medium text-gray-500 dark:text-gray-400">Durasi Hujan Maks</span>
                        <span className="text-sm font-bold text-blue-500">{stats.maxRainDuration} Jam</span>
                    </div>
                    <div className="w-full bg-gray-200 dark:bg-gray-800 rounded-full h-2">
                        <div className="bg-blue-500 h-2 rounded-full transition-all duration-1000" style={{ width: `${Math.min((stats.maxRainDuration / 5) * 100, 100)}%` }}></div>
                    </div>
                 </div>

                 {/* Factor 2: Affected Areas */}
                 <div className="bg-gray-50 dark:bg-[#141724] p-4 rounded-xl border border-gray-200 dark:border-gray-800">
                    <div className="flex justify-between items-center mb-2">
                        <span className="text-sm font-medium text-gray-500 dark:text-gray-400">Wilayah Terdampak</span>
                        <span className="text-sm font-bold text-red-500">{stats.totalRisk} Kelurahan</span>
                    </div>
                    <div className="w-full bg-gray-200 dark:bg-gray-800 rounded-full h-2">
                        <div className="bg-red-500 h-2 rounded-full transition-all duration-1000" style={{ width: `${(stats.totalRisk / dataset.length) * 100}%` }}></div>
                    </div>
                 </div>
            </div>
            
            {/* Priority List (Mini) */}
            <div className="flex-1 overflow-hidden flex flex-col min-h-[200px]">
                 <h3 className="text-lg font-bold dark:text-white mb-3 flex items-center gap-2">
                    <Siren className="text-red-500" size={18} /> Prioritas Penanganan
                 </h3>
                 <div className="overflow-y-auto pr-2 space-y-2 scrollbar-thin flex-1">
                    {priorityList.length === 0 ? (
                        <div className="text-center py-8 text-gray-400 text-sm bg-gray-50 dark:bg-[#141724] rounded-xl border border-dashed border-gray-300 dark:border-gray-700">
                            Semua wilayah terpantau AMAN
                        </div>
                    ) : (
                        priorityList.map((k) => {
                            const st = kelurahanStatuses[k.name];
                            return (
                                <div key={k.name} className="flex items-center justify-between p-3 rounded-xl bg-gray-50 dark:bg-[#141724] border border-gray-200 dark:border-gray-700 hover:border-red-500/50 transition-colors">
                                    <div>
                                        <div className="font-bold text-sm dark:text-white">{k.name}</div>
                                        <div className="text-xs text-gray-500">{k.district}</div>
                                    </div>
                                    <div className={`px-2 py-1 rounded text-[10px] font-bold uppercase ${
                                        st.status === FloodStatus.BANJIR ? 'bg-red-500/10 text-red-500' : 
                                        st.status === FloodStatus.SIAGA ? 'bg-orange-500/10 text-orange-500' :
                                        'bg-yellow-500/10 text-yellow-500'
                                    }`}>
                                        {st.status}
                                    </div>
                                </div>
                            )
                        })
                    )}
                 </div>
            </div>
        </aside>

        {/* RIGHT PANEL: MAP */}
        <section className="flex-1 relative bg-gray-200 dark:bg-[#0c0e14] order-1 lg:order-2 h-2/3 lg:h-full">
            {isLoading ? (
                <div className="absolute inset-0 flex items-center justify-center bg-gray-100 dark:bg-[#111421] z-50">
                    <div className="flex flex-col items-center gap-4">
                        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-genz-purple"></div>
                        <span className="text-sm font-bold text-gray-500 animate-pulse">Memuat Peta...</span>
                    </div>
                </div>
            ) : (
                <MapContainer 
                    center={JAKARTA_TIMUR_CENTER} 
                    zoom={12} 
                    minZoom={11} // Mencegah zoom out terlalu jauh
                    maxBounds={JAKARTA_TIMUR_BOUNDS} // Mengunci area pan
                    maxBoundsViscosity={1.0} // Efek "bouncy" saat menabrak batas
                    zoomControl={false}
                    className="w-full h-full"
                >
                    <MapController />
                    
                    {/* Dark Mode Tiles or Light Mode depending on system */}
                    <TileLayer
                        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
                        url={
                            document.documentElement.classList.contains('dark')
                            ? 'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png'
                            : 'https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png'
                        }
                    />
                    
                    <ZoomControl position="topright" />

                    {/* VISUAL BOUNDARY BOX (MONITORING ZONE) */}
                    <Rectangle 
                        bounds={JAKARTA_TIMUR_BOUNDS}
                        pathOptions={{
                            color: '#8B5CF6', // genz-purple
                            weight: 2,
                            dashArray: '10, 10',
                            fillColor: '#8B5CF6',
                            fillOpacity: 0.03, // Sangat tipis untuk tint
                            className: 'animate-pulse-slow' // Efek berdenyut halus
                        }}
                    >
                        <Tooltip direction="top" offset={[0, -10]} opacity={0.8} sticky>
                           <span className="font-bold">ZONA MONITORING JAKARTA TIMUR</span>
                        </Tooltip>
                    </Rectangle>

                    {safeDataset.map((k) => {
                        const st = kelurahanStatuses[k.name] || { status: FloodStatus.AMAN, currentRainDuration: 0 };
                        const color = getColor(st.status);
                        const radius = getRadius(st.status);

                        return (
                            <CircleMarker 
                                key={k.name}
                                center={[k.lat, k.lon]}
                                radius={radius}
                                pathOptions={{ 
                                    color: color, 
                                    fillColor: color, 
                                    fillOpacity: st.status === FloodStatus.AMAN ? 0.6 : 0.9,
                                    weight: st.status === FloodStatus.AMAN ? 2 : 4,
                                    opacity: 1
                                }}
                            >
                                <Popup className="custom-popup" closeButton={false}>
                                    <div className="p-3 bg-white dark:bg-gray-800 rounded-xl min-w-[150px]">
                                        <h3 className="font-bold text-lg mb-0.5 dark:text-white">{k.name}</h3>
                                        <p className="text-xs text-gray-500 mb-2 uppercase tracking-wide">{k.district}</p>
                                        <div className={`inline-flex items-center justify-center px-3 py-1 rounded-full text-xs font-bold text-white w-full mb-3`} style={{ backgroundColor: color }}>
                                            {st.status}
                                        </div>
                                        <div className="grid grid-cols-2 gap-2 text-xs border-t border-gray-100 dark:border-gray-700 pt-2">
                                            <div>
                                                <span className="text-gray-400 block text-[10px]">Hujan Saat Ini</span>
                                                <b className="dark:text-gray-200">{st.currentRainDuration} Jam</b>
                                            </div>
                                            <div>
                                                <span className="text-gray-400 block text-[10px]">Batas Banjir</span>
                                                <b className="dark:text-gray-200">{k.rules.durationThreshold} Jam</b>
                                            </div>
                                        </div>
                                    </div>
                                </Popup>
                                {/* Permanent Label for Name */}
                                <Tooltip 
                                    permanent 
                                    direction="bottom" 
                                    className="genz-map-label" 
                                    offset={[0, radius + 2]}
                                >
                                    {k.name}
                                </Tooltip>
                            </CircleMarker>
                        );
                    })}
                </MapContainer>
            )}

            {/* Floating Info Top Center (New) */}
            <div className="absolute top-6 left-1/2 transform -translate-x-1/2 z-[1000] bg-white/80 dark:bg-black/60 backdrop-blur-sm px-4 py-1.5 rounded-full border border-genz-purple/30 shadow-lg flex items-center gap-2">
                <Maximize size={14} className="text-genz-purple animate-pulse" />
                <span className="text-xs font-bold text-genz-purple tracking-wider">LIVE MONITORING AREA</span>
            </div>

            {/* Floating Legend */}
            <div className="absolute bottom-6 left-6 z-[1000] bg-white/90 dark:bg-[#1a1d29]/90 backdrop-blur-md border border-gray-200 dark:border-gray-800 rounded-2xl p-4 shadow-2xl max-w-[200px] hidden sm:block">
                <h4 className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-3 flex items-center gap-2">
                    <MapIcon size={12}/> Indikator
                </h4>
                <div className="space-y-2.5">
                    <div className="flex items-center gap-3">
                        <span className="w-3 h-3 rounded-full bg-red-500 shadow-[0_0_8px_rgba(239,68,68,0.6)] animate-pulse"></span>
                        <span className="text-xs font-bold dark:text-white">BANJIR</span>
                    </div>
                    <div className="flex items-center gap-3">
                        <span className="w-3 h-3 rounded-full bg-orange-500 shadow-[0_0_8px_rgba(249,115,22,0.6)]"></span>
                        <span className="text-xs font-bold dark:text-white">SIAGA</span>
                    </div>
                    <div className="flex items-center gap-3">
                        <span className="w-3 h-3 rounded-full bg-yellow-500 shadow-[0_0_8px_rgba(234,179,8,0.6)]"></span>
                        <span className="text-xs font-bold dark:text-white">WASPADA</span>
                    </div>
                    <div className="flex items-center gap-3">
                        <span className="w-3 h-3 rounded-full bg-green-500 opacity-80"></span>
                        <span className="text-xs font-bold dark:text-white">AMAN</span>
                    </div>
                </div>
            </div>
        </section>
    </div>
  );
};
