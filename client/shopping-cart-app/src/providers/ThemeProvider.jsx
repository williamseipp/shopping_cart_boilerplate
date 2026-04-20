import React from 'react';

export const ThemeContext = React.createContext();

export const ThemeProvider = ({ children }) => {
  const [theme, setTheme] = React.useState("light");

  const handleColorChange = (colorTheme) => setTheme(colorTheme);

  return (
    <ThemeContext.Provider value={{ theme, handleColorChange }}>
      {children}
    </ThemeContext.Provider>
  );
};

// this app has a current theme
// any child component can read or change it
