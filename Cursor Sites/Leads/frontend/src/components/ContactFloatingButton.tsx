import { useState } from 'react';
import { Mail, X, MessageCircle } from 'lucide-react';
import ContactForm from './ContactForm';

interface ContactFloatingButtonProps {
  variant?: 'floating' | 'header';
}

export default function ContactFloatingButton({ variant = 'floating' }: ContactFloatingButtonProps) {
  const [isOpen, setIsOpen] = useState(false);

  if (variant === 'header') {
    return (
      <>
        <button
          onClick={() => setIsOpen(true)}
          className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:from-blue-700 hover:to-purple-700 font-semibold shadow-lg hover:shadow-xl transition-all"
          aria-label="Nous contacter"
        >
          <Mail className="w-5 h-5" />
          <span className="hidden xl:inline">Nous contacter</span>
        </button>

        {/* Modal de contact */}
        {isOpen && (
          <div 
            className="fixed inset-0 bg-black bg-opacity-50 z-[100] flex items-center justify-center p-4"
            onClick={() => setIsOpen(false)}
          >
            <div 
              className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="sticky top-0 bg-gradient-to-r from-blue-600 to-purple-600 text-white p-6 rounded-t-2xl flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="bg-white bg-opacity-20 rounded-full p-2">
                    <Mail className="w-6 h-6" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold">Contactez-nous</h2>
                    <p className="text-blue-100 text-sm">Nous vous répondrons rapidement</p>
                  </div>
                </div>
                <button
                  onClick={() => setIsOpen(false)}
                  className="text-white hover:bg-white hover:bg-opacity-20 rounded-full p-2 transition-colors"
                  aria-label="Fermer"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>
              
              <div className="p-6">
                <ContactForm
                  typeDemande="CONTACT_GENERAL"
                  onSuccess={() => {
                    setIsOpen(false);
                    alert('Votre message a été envoyé avec succès ! Nous vous répondrons dans les plus brefs délais.');
                  }}
                />
              </div>
            </div>
          </div>
        )}
      </>
    );
  }

  return (
    <>
      {/* Bouton flottant */}
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 z-50 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-full shadow-2xl hover:shadow-3xl p-4 md:p-5 transition-all hover:scale-110 group animate-bounce"
        aria-label="Nous contacter"
      >
        <div className="relative">
          <MessageCircle className="w-6 h-6 md:w-7 md:h-7" />
          <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full border-2 border-white animate-pulse"></span>
        </div>
        <span className="absolute right-full mr-3 top-1/2 -translate-y-1/2 bg-gray-900 text-white text-sm font-semibold px-3 py-2 rounded-lg whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none shadow-lg">
          Nous contacter
        </span>
      </button>

      {/* Modal de contact */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-[100] flex items-center justify-center p-4"
          onClick={() => setIsOpen(false)}
        >
          <div 
            className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="sticky top-0 bg-gradient-to-r from-blue-600 to-purple-600 text-white p-6 rounded-t-2xl flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="bg-white bg-opacity-20 rounded-full p-2">
                  <Mail className="w-6 h-6" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold">Contactez-nous</h2>
                  <p className="text-blue-100 text-sm">Nous vous répondrons rapidement</p>
                </div>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="text-white hover:bg-white hover:bg-opacity-20 rounded-full p-2 transition-colors"
                aria-label="Fermer"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
            
            <div className="p-6">
              <ContactForm
                typeDemande="CONTACT_GENERAL"
                onSuccess={() => {
                  setIsOpen(false);
                  alert('Votre message a été envoyé avec succès ! Nous vous répondrons dans les plus brefs délais.');
                }}
              />
            </div>
          </div>
        </div>
      )}
    </>
  );
}
