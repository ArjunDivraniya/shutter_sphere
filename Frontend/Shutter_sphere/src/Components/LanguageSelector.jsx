import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';

const LanguageSelector = () => {
    const { i18n } = useTranslation();
    const [isOpen, setIsOpen] = useState(false);

    const changeLanguage = (lng) => {
        i18n.changeLanguage(lng);
        localStorage.setItem('lng', lng);
        document.documentElement.dir = lng === 'ar' ? 'rtl' : 'ltr';
        setIsOpen(false);
    };

    // Language options with flags and native names
    const languages = [
        { code: 'en', name: 'English', flag: '🇺🇸' },
        { code: 'hi', name: 'हिन्दी', flag: '🇮🇳' },
        { code: 'gu', name: 'ગુજરાતી', flag: '🇮🇳' },
        { code: 'es', name: 'Español', flag: '🇪🇸' },
        { code: 'ar', name: 'العربية', flag: '🇸🇦' },
    ];

    // Find current language
    const currentLanguage = languages.find(lang => lang.code === i18n.language) || languages[0];

    return (
        <div className="relative">
            {/* Custom dropdown trigger button */}
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-white bg-[#111827] hover:text-yellow-500 focus:outline-none transition-all duration-200"
                aria-haspopup="listbox"
                aria-expanded={isOpen}
            >
                <span className="material-symbols-outlined">
                    g_translate
                </span>        <span className="mr-1">{currentLanguage.flag}</span>
                <span>{currentLanguage.name}</span>
                <svg className={`w-4 h-4 ml-1 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
                </svg>
            </button>

            {/* Dropdown menu */}
            {isOpen && (
                <div className="absolute z-10 mt-1 w-full bg-[#111827] rounded-md shadow-lg max-h-60 overflow-auto focus:outline-none">
                    <ul className="py-1" role="listbox">
                        {languages.map((lang) => (
                            <li
                                key={lang.code}
                                onClick={() => changeLanguage(lang.code)}
                                className={`cursor-pointer px-4 py-2 flex items-center gap-2 text-white hover:text-yellow-500 ${lang.code === i18n.language ? ' text-yellow-500' : 'text-white'}`}
                                role="option"
                                aria-selected={lang.code === i18n.language}
                            >
                                <span className="text-base">{lang.flag}</span>
                                <span>{lang.name}</span>
                            </li>
                        ))}
                    </ul>
                </div>
            )}
        </div>
    );
};

export default LanguageSelector;