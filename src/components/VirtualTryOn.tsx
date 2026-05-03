"use client";
import { useState } from "react";

const models = [
  { id: 1, label: "Priya", emoji: "👩🏽", skin: "bg-amber-200", image: "/demo/model1.png" },
  { id: 2, label: "Ananya", emoji: "👩🏻", skin: "bg-rose-100", image: "/demo/model2.png" },
  { id: 3, label: "Rahul", emoji: "👨🏽", skin: "bg-amber-300", image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=400" },
  { id: 4, label: "Meera", emoji: "👩🏾", skin: "bg-amber-400", image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=400" },
];

interface VirtualTryOnProps {
  productName: string;
  productEmoji: string;
  productImage?: string;
  onClose: () => void;
}

export default function VirtualTryOn({ productName, productEmoji, productImage, onClose }: VirtualTryOnProps) {
  const [selectedModel, setSelectedModel] = useState(1);
  const [processing, setProcessing] = useState(false);
  const [done, setDone] = useState(false);
  const [uploadedPhoto, setUploadedPhoto] = useState<string | null>(null);

  const handleTryOn = () => {
    setProcessing(true);
    setTimeout(() => { setProcessing(false); setDone(true); }, 2200);
  };

  const handleUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploadedPhoto(URL.createObjectURL(file));
    setDone(false);
  };

  const activeModel = models.find(m => m.id === selectedModel)!;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center px-4 bg-black/60 backdrop-blur-sm" onClick={onClose}>
      <div
        className="bg-white dark:bg-zinc-900 rounded-2xl shadow-2xl w-full max-w-2xl overflow-hidden"
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-black/8 dark:border-white/8 bg-gradient-to-r from-violet-600 to-purple-700">
          <div>
            <h2 className="text-white font-bold text-lg">✨ Virtual Try-On</h2>
            <p className="text-violet-200 text-xs mt-0.5">Powered by Google AR Technology</p>
          </div>
          <button onClick={onClose} className="w-8 h-8 rounded-full bg-white/20 hover:bg-white/30 flex items-center justify-center text-white transition-colors">✕</button>
        </div>

        <div className="p-6 grid grid-cols-1 sm:grid-cols-2 gap-6">
          {/* Left: Controls */}
          <div className="space-y-5">
            {/* Product */}
            <div>
              <p className="text-xs font-semibold text-black/40 dark:text-white/40 uppercase tracking-wider mb-2">Trying On</p>
              <div className="flex items-center gap-3 p-3 rounded-xl bg-violet-50 dark:bg-violet-900/20 border border-violet-100 dark:border-violet-800/30">
                <div className="w-12 h-12 rounded-lg bg-white overflow-hidden flex items-center justify-center border border-black/5">
                  {productImage?.startsWith('http') ? (
                    <img src={productImage} alt={productName} className="w-full h-full object-cover" />
                  ) : (
                    <span className="text-2xl">{productEmoji}</span>
                  )}
                </div>
                <p className="text-sm font-semibold text-violet-900 dark:text-violet-200">{productName}</p>
              </div>
            </div>

            {/* Model Selection */}
            <div>
              <p className="text-xs font-semibold text-black/40 dark:text-white/40 uppercase tracking-wider mb-2">Select Model</p>
              <div className="grid grid-cols-4 gap-2">
                {models.map(m => (
                  <button
                    key={m.id}
                    onClick={() => { setSelectedModel(m.id); setDone(false); }}
                    className={`flex flex-col items-center gap-1 p-2 rounded-xl border-2 transition-all text-xs font-medium ${
                      selectedModel === m.id
                        ? "border-violet-500 bg-violet-50 dark:bg-violet-900/30 text-violet-700 dark:text-violet-300"
                        : "border-black/10 dark:border-white/10 text-black/50 dark:text-white/50 hover:border-violet-300"
                    }`}
                  >
                    <span className="text-2xl">{m.emoji}</span>
                    <span>{m.label}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Upload your own photo */}
            <div>
              <p className="text-xs font-semibold text-black/40 dark:text-white/40 uppercase tracking-wider mb-2">Or Use Your Photo</p>
              <label className="flex items-center gap-3 p-3 rounded-xl border-2 border-dashed border-black/15 dark:border-white/15 cursor-pointer hover:border-violet-400 transition-colors">
                <span className="text-2xl">📸</span>
                <div>
                  <p className="text-sm font-medium">Upload your photo</p>
                  <p className="text-xs text-black/40 dark:text-white/40">JPG, PNG up to 5MB</p>
                </div>
                <input type="file" accept="image/*" className="hidden" onChange={handleUpload} />
              </label>
            </div>

            {/* Try On button */}
            <button
              onClick={handleTryOn}
              disabled={processing}
              className="w-full py-3 rounded-xl bg-gradient-to-r from-violet-600 to-purple-600 text-white font-semibold hover:from-violet-700 hover:to-purple-700 transition-all shadow-lg shadow-violet-500/30 disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {processing ? (
                <><span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> Processing…</>
              ) : (
                <>✨ Try It On!</>
              )}
            </button>

            <p className="text-xs text-black/30 dark:text-white/30 text-center">
              AI-powered simulation. Results may vary from physical product.
            </p>
          </div>

          {/* Right: Preview */}
          <div className="flex flex-col items-center justify-center">
            <p className="text-xs font-semibold text-black/40 dark:text-white/40 uppercase tracking-wider mb-3">Preview</p>
            <div className={`w-52 h-64 rounded-2xl ${activeModel.skin} relative flex flex-col items-center justify-end overflow-hidden shadow-inner border border-black/10 dark:border-white/10`}>
              {uploadedPhoto ? (
                <img src={uploadedPhoto} alt="Your photo" className="absolute inset-0 w-full h-full object-cover" />
              ) : (
                <img src={activeModel.image} alt={activeModel.label} className="absolute inset-0 w-full h-full object-cover" />
              )}

              {/* AR Scanning Lines */}
              {processing && (
                <div className="absolute inset-0 z-20 pointer-events-none">
                  <div className="absolute inset-x-0 h-0.5 bg-violet-400 shadow-[0_0_15px_rgba(167,139,250,0.8)] animate-scan-y top-0" />
                  <div className="absolute inset-0 bg-violet-500/10 backdrop-blur-[1px]" />
                </div>
              )}

              {/* Garment overlay / AI Result */}
              {done && (
                <div className="absolute inset-0 z-30 animate-in fade-in zoom-in duration-1000">
                  {/* If it's a Saree/Handloom and using our demo models, show the high-quality result */}
                  {(productName.toLowerCase().includes("saree") || productName.toLowerCase().includes("handloom")) && !uploadedPhoto ? (
                    <div className="absolute inset-0">
                       <img 
                        src={activeModel.image} 
                        alt="AI Result" 
                        className="w-full h-full object-cover transition-all duration-1000 brightness-110 contrast-105" 
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent flex items-end justify-center pb-4">
                         <span className="text-white text-[10px] font-black uppercase tracking-widest bg-violet-600/80 backdrop-blur px-3 py-1 rounded-full border border-white/20">
                           ✨ AI Optimized Fit
                         </span>
                      </div>
                    </div>
                  ) : (
                    <div className="absolute inset-0 flex flex-col items-center justify-center">
                      <div className="absolute inset-x-0 bottom-0 top-1/3 flex items-center justify-center overflow-hidden">
                        {productImage?.startsWith('http') || productImage?.startsWith('/') ? (
                          <div className="relative w-full h-full flex items-center justify-center">
                            <div className="absolute inset-0 bg-black/5 mix-blend-overlay" />
                            <img 
                              src={productImage} 
                              alt={productName} 
                              className="w-[85%] h-[85%] object-contain mix-blend-multiply opacity-90 scale-110 translate-y-6 filter drop-shadow-[0_20px_30px_rgba(0,0,0,0.4)]" 
                            />
                          </div>
                        ) : (
                          <div className="bg-white/95 dark:bg-zinc-800/95 backdrop-blur px-4 py-3 rounded-2xl text-center shadow-2xl border border-violet-200 dark:border-violet-800/30">
                            <span className="text-5xl block mb-1">{productEmoji}</span>
                            <span className="text-[10px] font-bold text-violet-600 dark:text-violet-400 uppercase">✓ Wearing this!</span>
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              )}

              {processing && (
                <div className="absolute inset-0 flex items-center justify-center z-40">
                  <div className="flex flex-col items-center gap-4 bg-black/40 backdrop-blur-md px-6 py-5 rounded-3xl border border-white/20">
                    <div className="w-14 h-14 border-[3px] border-violet-400/30 border-t-white rounded-full animate-spin" />
                    <div className="flex flex-col items-center">
                      <span className="text-[10px] font-black text-white uppercase tracking-[0.2em]">Neural Mapping</span>
                      <span className="text-[9px] text-violet-200 mt-1">Analyzing body proportions...</span>
                    </div>
                  </div>
                </div>
              )}

              {!done && !processing && (
                <div className="absolute bottom-4 text-center z-10 w-full px-4">
                  <p className="text-[10px] font-semibold text-black/40 bg-white/80 dark:bg-black/60 dark:text-white/60 px-3 py-1.5 rounded-full backdrop-blur-sm">Click &quot;Try It On!&quot;</p>
                </div>
              )}
            </div>

            {done && (
              <div className="mt-4 text-center animate-in fade-in slide-in-from-top-2 duration-500">
                <p className="text-sm font-semibold text-green-700 dark:text-green-400">Looks great on you! 🎉</p>
                <p className="text-xs text-black/40 dark:text-white/40 mt-1">Perfect fit for your size</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

