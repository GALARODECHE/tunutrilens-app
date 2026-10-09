import React, { useEffect, useRef, useState } from 'react';
import { Camera, X, RefreshCw, AlertCircle, Sparkles, Check, Image as ImageIcon, Smartphone, Lock, ChevronDown, ChevronUp, FolderOpen, Zap, Flashlight } from 'lucide-react';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onCapture: (dataUrl: string) => void;
  title?: string;
  subtitle?: string;
}

export const LiveCameraModal: React.FC<Props> = ({
  isOpen,
  onClose,
  onCapture,
  title = 'Cámara en Vivo - TuNutriLens',
  subtitle = 'Enfoca tu plato o la etiqueta del producto para un análisis nutricional instantáneo',
}) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const fallbackFileInputRef = useRef<HTMLInputElement>(null);
  const galleryFileInputRef = useRef<HTMLInputElement>(null);

  const [stream, setStream] = useState<MediaStream | null>(null);
  const [facingMode, setFacingMode] = useState<'environment' | 'user'>('environment');
  const [cameraError, setCameraError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [showPermissionGuide, setShowPermissionGuide] = useState<boolean>(false);
  const [hasTorch, setHasTorch] = useState<boolean>(false);
  const [isTorchOn, setIsTorchOn] = useState<boolean>(false);
  const [isCapturing, setIsCapturing] = useState<boolean>(false);
  const [shutterFlash, setShutterFlash] = useState<boolean>(false);

  useEffect(() => {
    if (isOpen) {
      startCamera(facingMode);
    } else {
      stopCamera();
    }

    return () => {
      stopCamera();
    };
  }, [isOpen, facingMode]);

  const stopCamera = () => {
    if (stream) {
      stream.getTracks().forEach((track) => {
        try {
          track.stop();
        } catch (e) {
          console.warn('Error stopping track', e);
        }
      });
      setStream(null);
    }
  };

  const startCamera = async (mode: 'environment' | 'user') => {
    setIsLoading(true);
    setCameraError(null);
    stopCamera();

    try {
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        setCameraError('Tu navegador no permite visor web directo. Pulsa abajo para abrir la cámara de tu teléfono.');
        return;
      }

      // Try environment/back camera first with HD resolution & focus constraints
      let mediaStream: MediaStream | null = null;
      try {
        mediaStream = await navigator.mediaDevices.getUserMedia({
          video: {
            facingMode: { ideal: mode },
            width: { ideal: 1920, min: 1280 },
            height: { ideal: 1080, min: 720 },
            aspectRatio: { ideal: 4 / 3 },
          },
          audio: false,
        });
      } catch (firstErr) {
        // Retry with generic video permission
        try {
          mediaStream = await navigator.mediaDevices.getUserMedia({
            video: { facingMode: { ideal: mode } },
            audio: false,
          });
        } catch {
          mediaStream = await navigator.mediaDevices.getUserMedia({
            video: true,
            audio: false,
          });
        }
      }

      if (mediaStream) {
        setStream(mediaStream);
        if (videoRef.current) {
          videoRef.current.srcObject = mediaStream;
          videoRef.current.muted = true;
          videoRef.current.setAttribute('playsinline', 'true');
          try {
            await videoRef.current.play();
          } catch (playErr) {
            console.warn('Video play error:', playErr);
          }
        }

        // Check for torch capability
        try {
          const track = mediaStream.getVideoTracks()[0];
          const capabilities: any = track.getCapabilities ? track.getCapabilities() : {};
          if (capabilities.torch) {
            setHasTorch(true);
          }
        } catch {
          setHasTorch(false);
        }
      }
    } catch (err: any) {
      console.warn('Error accediendo a la cámara en vivo:', err);
      if (err.name === 'NotAllowedError' || err.name === 'PermissionDeniedError') {
        setCameraError('Permiso de visor no concedido. Puedes pulsar el botón verde abajo para abrir la cámara normal de tu móvil al instante.');
      } else if (err.name === 'NotFoundError' || err.name === 'DevicesNotFoundError') {
        setCameraError('No se encontró ninguna cámara activa. Puedes subir una foto desde tu galería o usar la cámara nativa.');
      } else {
        setCameraError('No se pudo iniciar el visor web. Pulsa el botón abajo para usar la cámara normal de tu móvil.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const toggleTorch = async () => {
    if (!stream) return;
    try {
      const track = stream.getVideoTracks()[0];
      if (track) {
        const nextState = !isTorchOn;
        await (track as any).applyConstraints({
          advanced: [{ torch: nextState }],
        });
        setIsTorchOn(nextState);
      }
    } catch (e) {
      console.warn('Torch error:', e);
    }
  };

  const handleCapture = () => {
    if (!videoRef.current || !canvasRef.current || isCapturing) return;

    setIsCapturing(true);
    setShutterFlash(true);

    try {
      if (navigator.vibrate) {
        navigator.vibrate(50);
      }
    } catch {
      // ignore
    }

    try {
      const video = videoRef.current;
      const canvas = canvasRef.current;

      // Use native video frame resolution (typically 1920x1080 or 1280x720)
      const w = video.videoWidth || 1280;
      const h = video.videoHeight || 720;
      canvas.width = w;
      canvas.height = h;

      const ctx = canvas.getContext('2d', { alpha: false });
      if (ctx) {
        ctx.drawImage(video, 0, 0, w, h);
        const dataUrl = canvas.toDataURL('image/jpeg', 0.88);

        // Immediate cleanup and transition
        setTimeout(() => {
          stopCamera();
          setIsCapturing(false);
          setShutterFlash(false);
          onCapture(dataUrl);
          onClose();
        }, 120);
      } else {
        throw new Error('No canvas context');
      }
    } catch (err) {
      console.warn('Canvas frame capture fallback error:', err);
      stopCamera();
      setIsCapturing(false);
      setShutterFlash(false);
      // If canvas failed, trigger native file capture dialog as fallback
      fallbackFileInputRef.current?.click();
    }
  };

  const handleNativeFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (uploadEvent) => {
        const dataUrl = uploadEvent.target?.result as string;
        stopCamera();
        onCapture(dataUrl);
        onClose();
      };
      reader.readAsDataURL(file);
    }
  };

  const toggleFacingMode = () => {
    setFacingMode((prev) => (prev === 'environment' ? 'user' : 'environment'));
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/95 backdrop-blur-md flex items-center justify-center p-2 sm:p-4 overflow-hidden">
      {/* Hidden native camera capture - positioned offscreen rather than display:none to allow programmatic clicks */}
      <input
        id="livecamera-fallback-camera"
        type="file"
        accept="image/*"
        capture="environment"
        ref={fallbackFileInputRef}
        onChange={handleNativeFileChange}
        className="sr-only"
        style={{ position: 'fixed', top: '-9999px', left: '-9999px', opacity: 0, width: '1px', height: '1px' }}
      />

      {/* Hidden gallery file picker - positioned offscreen */}
      <input
        id="livecamera-fallback-gallery"
        type="file"
        accept="image/*"
        ref={galleryFileInputRef}
        onChange={handleNativeFileChange}
        className="sr-only"
        style={{ position: 'fixed', top: '-9999px', left: '-9999px', opacity: 0, width: '1px', height: '1px' }}
      />

      <div className="bg-slate-900 text-white rounded-3xl border border-slate-800 shadow-2xl w-full max-w-lg overflow-hidden flex flex-col relative animate-in fade-in zoom-in duration-200 max-h-[92vh] sm:max-h-[88vh]">
        {/* Header - Compact */}
        <div className="px-4 py-3 border-b border-slate-800 flex items-center justify-between gap-3 bg-slate-900/95 shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="p-1.5 bg-emerald-600/20 text-emerald-400 rounded-xl border border-emerald-500/30">
              <Camera className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-xs sm:text-sm font-black text-white">{title}</h3>
              <p className="text-[10px] text-slate-400 font-medium line-clamp-1">{subtitle}</p>
            </div>
          </div>

          <button
            onClick={() => {
              stopCamera();
              onClose();
            }}
            className="p-1.5 text-slate-400 hover:text-white bg-slate-800/80 hover:bg-slate-800 rounded-xl transition cursor-pointer"
            aria-label="Cerrar cámara"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Camera Viewport or Error Screen */}
        <div className="relative h-[42vh] sm:h-[48vh] max-h-[340px] min-h-[220px] bg-black flex items-center justify-center overflow-hidden shrink-0">
          {isLoading && (
            <div className="text-center space-y-3 z-10 p-4">
              <div className="w-8 h-8 border-3 border-emerald-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
              <p className="text-xs font-bold text-slate-300">Iniciando cámara...</p>
            </div>
          )}

          {cameraError ? (
            <div className="p-4 sm:p-5 text-center space-y-3 max-w-sm mx-auto z-10 overflow-y-auto max-h-full">
              <div className="w-12 h-12 bg-emerald-500/20 text-emerald-400 rounded-2xl flex items-center justify-center mx-auto border border-emerald-500/30">
                <Camera className="w-6 h-6" />
              </div>
              
              <div className="space-y-1">
                <h4 className="text-sm sm:text-base font-black text-white">Abrir Cámara de tu Móvil</h4>
                <p className="text-[11px] text-slate-300 leading-relaxed">
                  Toca el botón verde para usar la cámara normal de tu teléfono con máxima calidad.
                </p>
              </div>

              {/* Action Buttons for Instant Fallback */}
              <div className="grid grid-cols-1 gap-2 pt-1 text-left">
                <button
                  type="button"
                  onClick={() => fallbackFileInputRef.current?.click()}
                  className="p-3 bg-emerald-600 hover:bg-emerald-500 text-white font-black text-xs rounded-xl shadow-lg transition flex items-center gap-2.5 active:scale-95 cursor-pointer border border-emerald-400/40"
                >
                  <div className="p-1.5 bg-white/20 rounded-lg shrink-0">
                    <Camera className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="font-black text-xs uppercase">ABRIR CÁMARA MÓVIL</div>
                    <div className="text-[9px] font-medium text-emerald-100">Haz la foto directamente</div>
                  </div>
                </button>

                <button
                  type="button"
                  onClick={() => galleryFileInputRef.current?.click()}
                  className="p-3 bg-slate-800 hover:bg-slate-700 text-white font-black text-xs rounded-xl border border-slate-700 transition flex items-center gap-2.5 active:scale-95 cursor-pointer"
                >
                  <div className="p-1.5 bg-emerald-500/20 text-emerald-400 rounded-lg shrink-0">
                    <FolderOpen className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="font-black text-xs uppercase">FOTO DE GALERÍA</div>
                    <div className="text-[9px] font-medium text-slate-300">Seleccionar foto guardada</div>
                  </div>
                </button>
              </div>

              {/* Step-by-step How to enable guide */}
              <div className="bg-slate-800/80 rounded-xl border border-slate-700/80 overflow-hidden text-left">
                <button
                  type="button"
                  onClick={() => setShowPermissionGuide(!showPermissionGuide)}
                  className="w-full p-2.5 flex items-center justify-between text-[11px] font-bold text-amber-300 hover:text-amber-200 transition cursor-pointer"
                >
                  <div className="flex items-center gap-1.5">
                    <Lock className="w-3.5 h-3.5 text-amber-400" />
                    <span>¿Activar visor en vivo? Ver pasos</span>
                  </div>
                  {showPermissionGuide ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
                </button>

                {showPermissionGuide && (
                  <div className="p-3 pt-0 text-[10px] text-slate-300 space-y-1.5 border-t border-slate-700/50">
                    <div className="space-y-0.5">
                      <strong className="text-white block font-semibold">📱 En Google Chrome (Android):</strong>
                      <p className="text-slate-300 pl-1.5">1. Pulsa el icono de los <strong>3 puntos ⋮</strong> o <strong>candado 🔒</strong> arriba.</p>
                      <p className="text-slate-300 pl-1.5">2. Entra en <strong>"Permisos"</strong> ➔ <strong>Cámara</strong> ➔ <strong>"Permitir"</strong>.</p>
                    </div>

                    <div className="space-y-0.5 pt-1 border-t border-slate-700/40">
                      <strong className="text-white block font-semibold">🍎 En Safari (iPhone / iOS):</strong>
                      <p className="text-slate-300 pl-1.5">1. Pulsa el icono <strong>aA</strong> en la barra web.</p>
                      <p className="text-slate-300 pl-1.5">2. Toca en <strong>"Ajustes del sitio web"</strong> ➔ <strong>Cámara</strong> ➔ <strong>"Permitir"</strong>.</p>
                    </div>
                  </div>
                )}
              </div>

              <div className="pt-0.5 flex items-center justify-center">
                <button
                  type="button"
                  onClick={() => startCamera(facingMode)}
                  className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 text-[11px] font-bold rounded-lg transition flex items-center gap-1.5 cursor-pointer"
                >
                  <RefreshCw className="w-3 h-3 text-emerald-400" />
                  <span>Reintentar visor</span>
                </button>
              </div>
            </div>
          ) : (
            <>
              <video
                ref={videoRef}
                autoPlay
                playsInline
                muted
                className="w-full h-full object-cover"
              />

              {/* Shutter Flash Animation */}
              {shutterFlash && (
                <div className="absolute inset-0 bg-white z-20 animate-out fade-out duration-150 pointer-events-none" />
              )}

              {/* Smaller, More Precise Viewfinder overlay target reticle */}
              <div className="absolute inset-0 pointer-events-none flex items-center justify-center p-4">
                <div className="w-44 h-44 sm:w-52 sm:h-52 border-2 border-dashed border-emerald-400/90 rounded-2xl relative shadow-[0_0_40px_rgba(16,185,129,0.35)]">
                  {/* Corner Markers */}
                  <div className="absolute -top-1 -left-1 w-5 h-5 border-t-3 border-l-3 border-emerald-400 rounded-tl-xl"></div>
                  <div className="absolute -top-1 -right-1 w-5 h-5 border-t-3 border-r-3 border-emerald-400 rounded-tr-xl"></div>
                  <div className="absolute -bottom-1 -left-1 w-5 h-5 border-b-3 border-l-3 border-emerald-400 rounded-bl-xl"></div>
                  <div className="absolute -bottom-1 -right-1 w-5 h-5 border-b-3 border-r-3 border-emerald-400 rounded-br-xl"></div>

                  <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 bg-slate-950/90 backdrop-blur-md px-2.5 py-0.5 rounded-full text-[10px] font-black text-emerald-300 border border-emerald-500/40 uppercase tracking-wide whitespace-nowrap shadow-md flex items-center gap-1">
                    <Sparkles className="w-3 h-3 text-emerald-400" />
                    <span>Centra el plato aquí</span>
                  </div>
                </div>

                <div className="absolute bottom-2 inset-x-3 bg-slate-950/80 backdrop-blur-sm rounded-xl py-1 px-2.5 border border-slate-700/60 text-center">
                  <p className="text-[10px] font-semibold text-slate-300 flex items-center justify-center gap-1.5">
                    <span>💡 Foto desde arriba a 45º • Si hay poca luz pulsa Flash</span>
                  </p>
                </div>
              </div>
            </>
          )}

          {/* Hidden Canvas for Frame Capture */}
          <canvas ref={canvasRef} className="hidden" />
        </div>

        {/* Controls Footer - Clean, Highly Visible Green Shutter on Same Screen */}
        <div className="p-3 sm:p-4 bg-slate-900 border-t border-slate-800 space-y-2.5 shrink-0">
          {/* Main Huge Green Capture Button */}
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleCapture}
              disabled={isLoading || !!cameraError || !stream || isCapturing}
              className="flex-1 py-3.5 px-4 bg-emerald-500 hover:bg-emerald-400 disabled:opacity-40 disabled:hover:bg-emerald-500 text-slate-950 font-black text-sm sm:text-base rounded-2xl shadow-lg shadow-emerald-950/60 transition flex items-center justify-center gap-2.5 active:scale-95 border-2 border-emerald-300 cursor-pointer ring-4 ring-emerald-500/20"
            >
              {isCapturing ? (
                <>
                  <RefreshCw className="w-5 h-5 text-slate-950 animate-spin" />
                  <span>PROCESANDO CAPTURA...</span>
                </>
              ) : (
                <>
                  <div className="w-3.5 h-3.5 rounded-full bg-slate-950 animate-ping" />
                  <Camera className="w-5 h-5 text-slate-950" />
                  <span>CAPTURAR FOTO</span>
                </>
              )}
            </button>
          </div>

          {/* Secondary Quick Action Bar (Flip, Flash, Gallery, Close) */}
          <div className="flex items-center justify-between gap-1.5 pt-0.5">
            <div className="flex items-center gap-1.5">
              <button
                type="button"
                onClick={toggleFacingMode}
                disabled={isLoading || !!cameraError}
                className="px-2.5 py-2 bg-slate-800 hover:bg-slate-700 disabled:opacity-30 text-slate-300 hover:text-white rounded-xl border border-slate-700 transition flex items-center gap-1.5 text-[11px] font-bold cursor-pointer"
                title="Girar Cámara"
              >
                <RefreshCw className="w-3.5 h-3.5 text-emerald-400" />
                <span>Girar</span>
              </button>

              {hasTorch && (
                <button
                  type="button"
                  onClick={toggleTorch}
                  className={`px-2.5 py-2 rounded-xl border transition flex items-center gap-1.5 text-[11px] font-bold cursor-pointer ${
                    isTorchOn
                      ? 'bg-amber-500 text-slate-950 border-amber-400'
                      : 'bg-slate-800 hover:bg-slate-700 text-amber-300 border-slate-700'
                  }`}
                  title="Linterna / Flash"
                >
                  <Zap className="w-3.5 h-3.5" />
                  <span>Flash</span>
                </button>
              )}

              <button
                type="button"
                onClick={() => galleryFileInputRef.current?.click()}
                className="px-2.5 py-2 bg-slate-800 hover:bg-slate-700 text-emerald-400 rounded-xl border border-slate-700 transition flex items-center gap-1.5 text-[11px] font-bold cursor-pointer"
                title="Elegir de Galería"
              >
                <FolderOpen className="w-3.5 h-3.5" />
                <span>Galería</span>
              </button>
            </div>

            <button
              type="button"
              onClick={() => {
                stopCamera();
                onClose();
              }}
              className="px-3 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white rounded-xl border border-slate-700 transition text-[11px] font-bold cursor-pointer"
            >
              Cerrar
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

