import { createContext, useState, useEffect } from "react";

export const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {
    const [isDarkMode, setIsDarkMode] = useState(
        localStorage.getItem("theme") === "dark"
    );

    useEffect(() => {
        document.documentElement.classList.toggle("dark", isDarkMode);
        localStorage.setItem("theme", isDarkMode ? "dark" : "light");
      }, [isDarkMode]);
    
      const toggleDarkMode = () => setIsDarkMode(!isDarkMode);

      return (
        <ThemeContext.Provider value={{isDarkMode,toggleDarkMode}}>
            {children}
        </ThemeContext.Provider>
      )
};
