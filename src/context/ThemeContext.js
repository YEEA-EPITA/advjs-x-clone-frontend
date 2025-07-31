import { createContext, useContext, useState, useEffect } from "react";

// Context
const ThemeContext = createContext();

// Provider component
export const ThemeProvider = ({ children }) => {
    const [theme, setTheme] = useState(() => {
        // Get theme from localStorage or default to dark
        const savedTheme = localStorage.getItem("theme");
        return savedTheme ? savedTheme : "dark";
    });

    useEffect(() => {
        // Save theme to localStorage whenever it changes
        localStorage.setItem("theme", theme);
    }, [theme]);

    const toggleTheme = () => {
        setTheme(prev => (prev === "light" ? "dark" : "light"));
    };

    return (
        <ThemeContext.Provider value={{ theme, toggleTheme }}>
            {children}
        </ThemeContext.Provider>
    );
};

export const useTheme = () => useContext(ThemeContext);