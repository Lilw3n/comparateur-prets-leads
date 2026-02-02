import { Calendar, Clock, Wrench } from 'lucide-react';

export default function DevBanner() {
  const now = new Date();
  const formattedDate = now.toLocaleDateString('fr-FR', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
  const formattedTime = now.toLocaleTimeString('fr-FR', {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit'
  });

  return (
    <div className="bg-gradient-to-r from-yellow-400 via-orange-500 to-red-500 text-white py-3 px-4 shadow-lg sticky top-0 z-40">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-center gap-3 text-sm md:text-base">
        <div className="flex items-center gap-2">
          <Wrench className="w-5 h-5 animate-spin" style={{ animationDuration: '3s' }} />
          <span className="font-bold">🚧 Site en cours de développement 🚧</span>
        </div>
        <div className="hidden md:block text-white opacity-70">|</div>
        <div className="flex items-center gap-2">
          <Calendar className="w-4 h-4" />
          <span className="font-medium">Dernière mise à jour : {formattedDate}</span>
        </div>
        <div className="hidden md:block text-white opacity-70">|</div>
        <div className="flex items-center gap-2">
          <Clock className="w-4 h-4" />
          <span className="font-medium">{formattedTime}</span>
        </div>
      </div>
    </div>
  );
}
