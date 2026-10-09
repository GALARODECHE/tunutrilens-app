import React, { Component, ErrorInfo, ReactNode } from 'react';
import { RefreshCw, AlertTriangle } from 'lucide-react';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null,
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Uncaught application error:', error, errorInfo);
  }

  public handleReset = () => {
    try {
      localStorage.clear();
      sessionStorage.clear();
    } catch (e) {
      console.error(e);
    }
    this.setState({ hasError: false, error: null });
    try {
      window.location.reload();
    } catch {
      // In case iframe restricts reload
    }
  };

  public handleRetry = () => {
    this.setState({ hasError: false, error: null });
  };

  public render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-slate-900 text-white flex flex-col items-center justify-center p-6 text-center animate-in fade-in">
          <div className="p-4 bg-red-950/60 rounded-full border border-red-500/50 mb-4">
            <AlertTriangle className="w-10 h-10 text-amber-400" />
          </div>
          <h1 className="text-2xl font-black mb-2">Se ha recuperado la aplicación</h1>
          <p className="text-slate-300 text-sm max-w-md mb-4">
            Ocurrió un error temporal al cargar los datos en memoria. Pulsa para reanudar la aplicación limpiamente.
          </p>

          {this.state.error?.message && (
            <div className="mb-6 p-3 bg-slate-800/80 rounded-xl border border-slate-700 max-w-md text-left text-xs text-rose-300 font-mono break-all">
              <span className="text-slate-400 block text-[10px] uppercase font-bold mb-1">Detalle del error:</span>
              {this.state.error.message}
            </div>
          )}

          <div className="flex flex-col sm:flex-row gap-3">
            <button
              onClick={this.handleRetry}
              className="px-6 py-3 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-2xl shadow-lg flex items-center justify-center gap-2 transition cursor-pointer active:scale-98"
            >
              <RefreshCw className="w-5 h-5" />
              <span>Reintentar ahora</span>
            </button>
            <button
              onClick={this.handleReset}
              className="px-6 py-3 bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold rounded-2xl border border-slate-600 flex items-center justify-center gap-2 transition cursor-pointer active:scale-98"
            >
              <span>Recargar y Limpiar Memoria</span>
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
