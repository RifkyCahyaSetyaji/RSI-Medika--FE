import React, { useState } from 'react';
import { Eye, Layers, Columns, ZoomIn, ZoomOut, Download, Sparkles, Info } from 'lucide-react';

interface HeatmapViewerProps {
  imageUrl: string;
  heatmapUrl: string | null;
  eye: 'OD' | 'OS';
  patientName?: string;
}

export const HeatmapViewer: React.FC<HeatmapViewerProps> = ({
  imageUrl,
  heatmapUrl,
  eye,
  patientName = 'Pasien',
}) => {
  const [mode, setMode] = useState<'overlay' | 'side-by-side'>('overlay');
  const [opacity, setOpacity] = useState<number>(65); // 0% = original, 100% = heatmap
  const [zoom, setZoom] = useState<number>(1);
  const [showLegend, setShowLegend] = useState<boolean>(true);

  const toggleZoom = () => {
    setZoom((prev) => (prev === 1 ? 1.5 : prev === 1.5 ? 2 : 1));
  };

  const handleDownload = () => {
    const a = document.createElement('a');
    a.href = heatmapUrl || imageUrl;
    a.download = `CAD-ViT_${patientName.replace(/\s+/g, '_')}_${eye}_Heatmap.jpg`;
    a.click();
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200/90 shadow-sm overflow-hidden flex flex-col">
      {/* Top Toolbar */}
      <div className="p-3.5 sm:p-4 bg-slate-50/80 border-b border-slate-200 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <div className="p-2 rounded-lg bg-emerald-600 text-white font-bold text-xs">
            {eye === 'OD' ? 'OD · Mata Kanan' : 'OS · Mata Kiri'}
          </div>
          <span className="text-sm font-semibold text-slate-800">
            Visualisasi Citra Fundus &amp; Grad-CAM ViT
          </span>
        </div>

        {/* Mode Switcher & Controls */}
        <div className="flex items-center gap-2 ml-auto">
          {/* View Mode Toggle */}
          <div className="bg-slate-200/80 p-0.5 rounded-lg flex items-center text-xs font-medium text-slate-600">
            <button
              type="button"
              onClick={() => setMode('overlay')}
              className={`px-3 py-1.5 rounded-md flex items-center gap-1.5 transition-all ${
                mode === 'overlay'
                  ? 'bg-white text-slate-900 shadow-sm font-semibold'
                  : 'hover:text-slate-900'
              }`}
            >
              <Layers className="w-3.5 h-3.5 text-emerald-600" />
              Slider Transparansi
            </button>
            <button
              type="button"
              onClick={() => setMode('side-by-side')}
              className={`px-3 py-1.5 rounded-md flex items-center gap-1.5 transition-all ${
                mode === 'side-by-side'
                  ? 'bg-white text-slate-900 shadow-sm font-semibold'
                  : 'hover:text-slate-900'
              }`}
            >
              <Columns className="w-3.5 h-3.5 text-blue-600" />
              Berdampingan
            </button>
          </div>

          {/* Zoom toggle */}
          <button
            type="button"
            onClick={toggleZoom}
            title={`Zoom (${zoom}x)`}
            className="p-2 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 transition"
          >
            {zoom > 1 ? <ZoomOut className="w-4 h-4 text-emerald-600" /> : <ZoomIn className="w-4 h-4" />}
          </button>

          {/* Download button */}
          <button
            type="button"
            onClick={handleDownload}
            title="Unduh Citra"
            className="p-2 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 transition"
          >
            <Download className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Main Canvas Area */}
      <div className="p-4 sm:p-6 bg-slate-950 flex flex-col items-center justify-center relative min-h-[380px] sm:min-h-[440px] select-none overflow-hidden">
        {mode === 'overlay' ? (
          <div
            className="relative rounded-xl overflow-hidden shadow-2xl transition-transform duration-200 border border-slate-800"
            style={{ transform: `scale(${zoom})`, transformOrigin: 'center center' }}
          >
            {/* Original Fundus Image (Base) */}
            <img
              src={imageUrl}
              alt="Citra Fundus Asli"
              className="max-h-[380px] sm:max-h-[460px] w-auto object-contain block mx-auto"
            />

            {/* Heatmap Layer with Opacity */}
            {heatmapUrl && (
              <img
                src={heatmapUrl}
                alt="Grad-CAM ViT Heatmap"
                className="absolute inset-0 w-full h-full object-contain pointer-events-none transition-opacity duration-150"
                style={{ opacity: opacity / 100 }}
              />
            )}

            {/* Live Indicator overlay badge */}
            <div className="absolute bottom-3 left-3 bg-slate-900/80 backdrop-blur-md border border-slate-700 text-slate-200 text-xs px-2.5 py-1 rounded-md flex items-center gap-1.5 shadow">
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              <span>Heatmap Blend: {opacity}%</span>
            </div>
          </div>
        ) : (
          /* Side by Side Mode */
          <div
            className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full max-w-4xl transition-transform duration-200"
            style={{ transform: `scale(${zoom})`, transformOrigin: 'center center' }}
          >
            <div className="flex flex-col items-center gap-2 bg-slate-900/70 p-3 rounded-xl border border-slate-800">
              <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-300">
                <Eye className="w-3.5 h-3.5 text-emerald-400" />
                Citra Fundus Asli (RGB)
              </div>
              <img
                src={imageUrl}
                alt="Citra Asli"
                className="max-h-[320px] w-auto object-contain rounded-lg"
              />
            </div>
            <div className="flex flex-col items-center gap-2 bg-slate-900/70 p-3 rounded-xl border border-slate-800">
              <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-300">
                <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                Grad-CAM ViT Attention Heatmap
              </div>
              {heatmapUrl ? (
                <img
                  src={heatmapUrl}
                  alt="Grad-CAM Heatmap"
                  className="max-h-[320px] w-auto object-contain rounded-lg"
                />
              ) : (
                <div className="h-[280px] flex items-center justify-center text-slate-500 text-xs">
                  Heatmap belum tersedia
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Opacity Slider Control (in Overlay Mode) */}
      {mode === 'overlay' && (
        <div className="px-5 py-3.5 bg-slate-50 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3 w-full sm:max-w-md">
            <span className="text-xs font-medium text-slate-600 whitespace-nowrap">
              Citra Asli (0%)
            </span>
            <input
              type="range"
              min="0"
              max="100"
              value={opacity}
              onChange={(e) => setOpacity(Number(e.target.value))}
              className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-emerald-600"
            />
            <span className="text-xs font-medium text-slate-600 whitespace-nowrap">
              Heatmap (100%)
            </span>
          </div>

          <div className="flex items-center gap-2 text-xs text-slate-600">
            <button
              type="button"
              onClick={() => setOpacity(0)}
              className="px-2 py-1 bg-white border border-slate-200 rounded hover:bg-slate-100"
            >
              Hanya Asli
            </button>
            <button
              type="button"
              onClick={() => setOpacity(50)}
              className="px-2 py-1 bg-white border border-slate-200 rounded hover:bg-slate-100"
            >
              50% Campur
            </button>
            <button
              type="button"
              onClick={() => setOpacity(100)}
              className="px-2 py-1 bg-white border border-slate-200 rounded hover:bg-slate-100"
            >
              Hanya Heatmap
            </button>
          </div>
        </div>
      )}

      {/* Grad-CAM Clinical Legend */}
      <div className="px-5 py-3 bg-white border-t border-slate-100 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 text-xs text-slate-600">
        <div className="flex items-center gap-2">
          <Info className="w-4 h-4 text-slate-400 flex-shrink-0" />
          <span>
            <strong>Interpretasi Grad-CAM:</strong> Heatmap menyoroti patch citra yang paling memengaruhi keputusan klasifikasi Vision Transformer.
          </span>
        </div>

        {/* Heatmap spectrum bar */}
        <div className="flex items-center gap-2 self-end sm:self-auto">
          <span className="text-[11px] text-slate-500">Normal</span>
          <div className="w-28 h-2.5 rounded-full bg-gradient-to-r from-blue-600 via-teal-400 via-yellow-400 to-red-600 border border-slate-200" />
          <span className="text-[11px] text-red-600 font-bold">Fokus Lesi AI</span>
        </div>
      </div>
    </div>
  );
};
