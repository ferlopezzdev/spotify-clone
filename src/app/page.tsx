'use client'
import { LoginButton } from '@/components/login-button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertTriangle, Play, Heart, ListMusic, Radio } from 'lucide-react';

export default function HomePage() {
  return (
    <div className="h-screen bg-gradient-to-br from-black  via-slate-900 to-emerald-900 relative overflow-hidden">
      {/* Enhanced Background decorations */}
      <div className="absolute inset-0">
        {/* Main organic floating lights */}
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-green-500/15 rounded-full blur-3xl animate-[gentledrift_12s_ease-in-out_infinite]"></div>
        <div className="absolute bottom-1/4 right-1/4 w-[32rem] h-[32rem] bg-purple-500/12 rounded-full blur-3xl animate-[slowfloat_16s_ease-in-out_infinite] opacity-80"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-pink-500/8 rounded-full blur-3xl animate-[softdrift_14s_ease-in-out_infinite]"></div>
        
        {/* Subtle wandering lights */}
        <div className="absolute top-10 right-10 w-32 h-32 bg-cyan-400/10 rounded-full blur-2xl animate-[smoothglide_18s_ease-in-out_infinite]"></div>
        <div className="absolute bottom-20 left-10 w-40 h-40 bg-yellow-400/6 rounded-full blur-2xl animate-[gentlewander_20s_ease-in-out_infinite]"></div>
        
        {/* Breathing ambient layers */}
        <div className="absolute inset-0 bg-gradient-to-tr from-green-500/3 via-transparent to-purple-500/3 animate-[breathe_9s_ease-in-out_infinite]"></div>
        <div className="absolute inset-0 bg-gradient-to-bl from-transparent via-pink-500/2 to-transparent animate-[breathe_11s_ease-in-out_infinite]"></div>
        
        {/* Soft noise texture */}
        <div className="absolute inset-0 bg-black/10 bg-[radial-gradient(circle_at_center,transparent_0%,rgba(0,0,0,0.05)_100%)] opacity-30"></div>
      </div>
      
      {/* Custom natural animations */}
      <style jsx>{`
        @keyframes gentledrift {
          0%, 100% { transform: translateY(0px) translateX(0px); }
          25% { transform: translateY(-8px) translateX(3px); }
          50% { transform: translateY(2px) translateX(-5px); }
          75% { transform: translateY(-3px) translateX(2px); }
        }
        
        @keyframes slowfloat {
          0%, 100% { transform: translateY(0px) translateX(0px); }
          33% { transform: translateY(-6px) translateX(4px); }
          66% { transform: translateY(3px) translateX(-6px); }
        }
        
        @keyframes softdrift {
          0%, 100% { transform: translate(-50%, -50%) translateY(0px) translateX(0px); }
          50% { transform: translate(-50%, -50%) translateY(-4px) translateX(3px); }
        }
        
        @keyframes smoothglide {
          0%, 100% { transform: translateY(0px) translateX(0px); }
          25% { transform: translateY(-5px) translateX(8px); }
          50% { transform: translateY(-2px) translateX(-3px); }
          75% { transform: translateY(3px) translateX(5px); }
        }
        
        @keyframes gentlewander {
          0%, 100% { transform: translateY(0px) translateX(0px); }
          50% { transform: translateY(-7px) translateX(4px); }
        }
        
        @keyframes breathe {
          0%, 100% { opacity: 0.3; }
          50% { opacity: 0.5; }
        }
      `}</style>
      
      <main className="relative flex h-screen items-center justify-center p-4">
        <div className="w-full max-w-md space-y-6">
          {/* Logo Section */}
          <div className="text-center mb-8">
            <div className="flex items-center justify-center mb-4">
              <div className="w-16 h-16 bg-gradient-to-br from-green-400 via-green-500 to-emerald-600 rounded-full flex items-center justify-center shadow-2xl shadow-green-500/40">
                <svg 
                  className="w-10 h-10 text-black drop-shadow-sm" 
                  fill="currentColor" 
                  viewBox="0 0 24 24"
                >
                  <path d="M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.66 0 12 0zm5.521 17.34c-.24.359-.66.48-1.021.24-2.82-1.74-6.36-2.101-10.561-1.141-.418.122-.779-.179-.899-.539-.12-.421.18-.78.54-.9 4.56-1.021 8.52-.6 11.64 1.32.42.18.479.659.301 1.02zm1.44-3.3c-.301.42-.841.6-1.262.3-3.239-1.98-8.159-2.58-11.939-1.38-.479.12-1.02-.12-1.14-.6-.12-.48.12-1.021.6-1.141C9.6 9.9 15 10.561 18.72 12.84c.361.181.48.78.241 1.2zm.12-3.36C15.24 8.4 8.82 8.16 5.16 9.301c-.6.179-1.2-.181-1.38-.721-.18-.601.18-1.2.72-1.381 4.26-1.26 11.28-1.02 15.721 1.621.539.3.719 1.02.42 1.56-.299.421-1.02.599-1.559.3z"/>
                </svg>
              </div>
            </div>
            <h1 className="text-4xl md:text-5xl font-black text-white mb-2 tracking-tight bg-gradient-to-r from-white via-green-100 to-purple-100 bg-clip-text  drop-shadow-2xl">
              Mini - Spotify
            </h1>
            <p className="text-lg text-gray-300 font-light bg-gradient-to-r from-gray-300 to-gray-400 bg-clip-text">
              Conecta. Escucha. Descubre.
            </p>
          </div>

          {/* Login Card */}
          <Card className="bg-black/70 border-gray-600/30 backdrop-blur-2xl shadow-2xl shadow-purple-500/10 ring-1 ring-white/5">
            <CardContent className="p-6 space-y-4">
              <LoginButton />
              
              {/* Important Notice */}
              <Alert className="bg-gradient-to-r from-gray-800/60 to-gray-900/60 border-gray-600/50 backdrop-blur-sm">
                <AlertTriangle className="h-4 w-4 text-white drop-shadow-sm"  color='orange'/>
                <AlertDescription className="text-gray-200 text-sm">
                  <span className="font-semibold text-white block mb-1 drop-shadow-sm">
                    Cuenta de Spotify requerida
                  </span>
                  Necesitas una cuenta activa de Spotify.
                </AlertDescription>
              </Alert>

              {/* What you get - Enhanced */}
              <div className="grid grid-cols-2 gap-3 text-xs text-gray-200">
                <div className="flex items-center gap-2 p-2 rounded-lg bg-gradient-to-r from-gray-800/30 to-gray-900/20 backdrop-blur-sm">
                  <ListMusic className="w-3 h-3 text-green-400 flex-shrink-0 drop-shadow-sm" />
                  <span>Tu biblioteca</span>
                </div>
                <div className="flex items-center gap-2 p-2 rounded-lg bg-gradient-to-r from-gray-800/30 to-gray-900/20 backdrop-blur-sm">
                  <Heart className="w-3 h-3 text-pink-400 flex-shrink-0 drop-shadow-sm" />
                  <span>Playlists favoritas</span>
                </div>
                <div className="flex items-center gap-2 p-2 rounded-lg bg-gradient-to-r from-gray-800/30 to-gray-900/20 backdrop-blur-sm">
                  <Play className="w-3 h-3 text-purple-400 flex-shrink-0 drop-shadow-sm" />
                  <span>Control total</span>
                </div>
                <div className="flex items-center gap-2 p-2 rounded-lg bg-gradient-to-r from-gray-800/30 to-gray-900/20 backdrop-blur-sm">
                  <Radio className="w-3 h-3 text-cyan-400 flex-shrink-0 drop-shadow-sm" />
                  <span>Recomendaciones</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}