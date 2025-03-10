import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import "./index.css"
import i18n from "./i18n"; // ✅ Import i18n
import { I18nextProvider } from "react-i18next";
import App from './App.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
<I18nextProvider i18n={i18n}> {/* ✅ Wrap the entire app */}
    <App />
  </I18nextProvider>  
  </StrictMode>,
)

