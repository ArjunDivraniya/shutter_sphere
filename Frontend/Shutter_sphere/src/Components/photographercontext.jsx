import { createContext, useContext, useState } from "react";

const PhotographerContext = createContext();

export const PhotographerProvider = ({ children }) => {
  const [photographers, setPhotographers] = useState([]);

  return (
    <PhotographerContext.Provider value={{ photographers, setPhotographers }}>
      {children}
    </PhotographerContext.Provider>
  );
};

export const usePhotographers = () => useContext(PhotographerContext);
