// // /components/ThemeSwitch/index.tsx

// "use client"

// import { SunIcon, MoonIcon } from '@radix-ui/react-icons';
// import { useTheme } from 'next-themes';
// import { Button } from '../ui/button';



// const ThemeSwitch: React.FC = () => {

//     const { theme, setTheme } = useTheme();

//     const toggleTheme = () => {
//         setTheme(theme === "light" ? "dark" : "light");
//     };

//     const isActive = theme === "light";

//     // const switchClasses = `flex items-center justify-center w-6 h-6 text-dark bg-white rounded-full transform ${

//     // isActive ? 'translate-x-0' : 'translate-x-6'

//     // } transition-transform duration-500 ease-in-out`;

// return (

// <Button onClick={toggleTheme}>{isActive ? <MoonIcon /> : <SunIcon />}</Button>

// )};

// export default ThemeSwitch;

"use client";

import { SunIcon, MoonIcon } from "@radix-ui/react-icons";
import { useTheme } from "next-themes";
import { Button } from "../ui/button";
import { useEffect, useState } from "react";

const ThemeSwitch: React.FC = () => {
  const { theme, setTheme, resolvedTheme } = useTheme(); // resolvedTheme handles system theme
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true); // Ensures component renders only on the client
  }, []);

  if (!mounted) return null; // Avoid rendering during SSR

  const toggleTheme = () => {
    setTheme(resolvedTheme === "light" ? "dark" : "light");
  };

  const isLightTheme = resolvedTheme === "light";

  return (
    <Button onClick={toggleTheme}>
      {isLightTheme ? <MoonIcon /> : <SunIcon />}
    </Button>
  );
};

export default ThemeSwitch;
