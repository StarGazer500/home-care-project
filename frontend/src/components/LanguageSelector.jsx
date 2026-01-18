import { useState, useRef, useEffect } from 'react';
import { Globe, ChevronDown } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';

function LanguageSelector({ variant = 'default' }) {
  const { language, changeLanguage, languages } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  const currentLanguage = languages.find(l => l.code === language);

  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    }
    // Use click instead of mousedown to avoid closing before button click registers
    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, []);

  const handleSelect = (code) => {
    console.log('Language selected:', code);
    changeLanguage(code);
    setIsOpen(false);
  };

  // Compact variant for navbar
  if (variant === 'compact') {
    return (
      <div className="relative" ref={dropdownRef}>
        <button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          className="flex items-center space-x-1 px-3 py-2 rounded-lg hover:bg-slate-100 transition-colors text-slate-600"
          aria-label="Select language"
        >
          <span className="text-lg">{currentLanguage?.flag}</span>
          <ChevronDown size={14} className={`transition-transform ${isOpen ? 'rotate-180' : ''}`} />
        </button>

        {isOpen && (
          <div className="absolute right-0 mt-2 w-40 bg-white rounded-xl shadow-lg border border-slate-200 py-2 z-50">
            {languages.map((lang) => (
              <button
                type="button"
                key={lang.code}
                onClick={() => handleSelect(lang.code)}
                className={`w-full flex items-center space-x-3 px-4 py-2 text-left hover:bg-slate-50 transition-colors ${
                  language === lang.code ? 'bg-red-50 text-red-600' : 'text-slate-700'
                }`}
              >
                <span className="text-lg">{lang.flag}</span>
                <span className="font-medium">{lang.name}</span>
              </button>
            ))}
          </div>
        )}
      </div>
    );
  }

  // Default full variant
  return (
    <div className="relative" ref={dropdownRef}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center space-x-2 px-4 py-2 rounded-xl border-2 border-slate-200 hover:border-red-300 transition-colors bg-white"
        aria-label="Select language"
      >
        <Globe size={18} className="text-slate-500" />
        <span className="text-lg">{currentLanguage?.flag}</span>
        <span className="font-medium text-slate-700">{currentLanguage?.name}</span>
        <ChevronDown size={16} className={`text-slate-400 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-lg border border-slate-200 py-2 z-50">
          {languages.map((lang) => (
            <button
              type="button"
              key={lang.code}
              onClick={() => handleSelect(lang.code)}
              className={`w-full flex items-center space-x-3 px-4 py-3 text-left hover:bg-slate-50 transition-colors ${
                language === lang.code ? 'bg-red-50 text-red-600' : 'text-slate-700'
              }`}
            >
              <span className="text-xl">{lang.flag}</span>
              <span className="font-medium">{lang.name}</span>
              {language === lang.code && (
                <span className="ml-auto text-red-500">✓</span>
              )}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

export default LanguageSelector;
