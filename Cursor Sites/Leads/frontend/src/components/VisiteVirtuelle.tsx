import { useState } from 'react';
import { Video, X, Maximize2, ExternalLink } from 'lucide-react';

interface VisiteVirtuelleProps {
  matterportId: string;
  titre?: string;
  description?: string;
  className?: string;
}

export default function VisiteVirtuelle({ 
  matterportId, 
  titre = 'Visite virtuelle 360°',
  description = 'Explorez ce bien en visite virtuelle interactive',
  className = '' 
}: VisiteVirtuelleProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);

  const matterportUrl = `https://my.matterport.com/show/?m=${matterportId}&play=1&ts=0`;

  const openFullscreen = () => {
    setIsFullscreen(true);
    setIsOpen(true);
  };

  const closeFullscreen = () => {
    setIsFullscreen(false);
    setIsOpen(false);
  };

  const handleOpen = () => {
    setIsOpen(true);
  };

  return (
    <>
      <div className={`bg-white rounded-xl shadow-md overflow-hidden ${className}`}>
        <div className="relative aspect-video bg-gradient-to-br from-gray-100 to-gray-200">
          {/* Preview avec overlay */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-center p-8">
              <div className="inline-flex items-center justify-center w-20 h-20 bg-blue-600 rounded-full mb-4 shadow-lg">
                <Video className="w-10 h-10 text-white" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">{titre}</h3>
              <p className="text-gray-600 mb-4">{description}</p>
              <div className="flex flex-wrap justify-center gap-3">
                <button
                  onClick={handleOpen}
                  className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-semibold flex items-center gap-2 transition-all"
                >
                  <Video className="w-5 h-5" />
                  Lancer la visite
                </button>
                <a
                  href={matterportUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-6 py-3 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 font-semibold flex items-center gap-2 transition-all"
                >
                  <ExternalLink className="w-5 h-5" />
                  Ouvrir en plein écran
                </a>
              </div>
            </div>
          </div>
          
          {/* Badge "Visite virtuelle disponible" */}
          <div className="absolute top-4 right-4 bg-green-500 text-white px-3 py-1 rounded-full text-sm font-semibold flex items-center gap-2">
            <Video className="w-4 h-4" />
            Visite 360° disponible
          </div>
        </div>
      </div>

      {/* Modal pour la visite virtuelle */}
      {isOpen && (
        <div 
          className={`fixed inset-0 bg-black bg-opacity-90 z-50 flex items-center justify-center p-4 ${
            isFullscreen ? '' : ''
          }`}
          onClick={closeFullscreen}
        >
          <div 
            className={`bg-white rounded-lg shadow-2xl ${
              isFullscreen ? 'w-full h-full' : 'w-full max-w-6xl h-[90vh]'
            }`}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header du modal */}
            <div className="flex items-center justify-between p-4 border-b border-gray-200 bg-gradient-to-r from-blue-600 to-purple-600 text-white">
              <div className="flex items-center gap-3">
                <Video className="w-6 h-6" />
                <div>
                  <h3 className="font-bold text-lg">{titre}</h3>
                  <p className="text-sm text-blue-100">{description}</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={openFullscreen}
                  className="p-2 hover:bg-white hover:bg-opacity-20 rounded-lg transition-colors"
                  title="Plein écran"
                >
                  <Maximize2 className="w-5 h-5" />
                </button>
                <button
                  onClick={closeFullscreen}
                  className="p-2 hover:bg-white hover:bg-opacity-20 rounded-lg transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Iframe Matterport */}
            <div className="relative w-full h-[calc(100%-80px)]">
              <iframe
                src={matterportUrl}
                className="w-full h-full border-0"
                allow="fullscreen; vr"
                allowFullScreen
                title={titre}
              />
            </div>
          </div>
        </div>
      )}
    </>
  );
}
