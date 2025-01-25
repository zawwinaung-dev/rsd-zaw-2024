// /components/ThemeSwitch/index.tsx

"use client"

import { SunIcon, MoonIcon } from '@radix-ui/react-icons';
import { useTheme } from 'next-themes';
import { Button } from '../ui/button';



const ThemeSwitch: React.FC = () => {

    const { theme, setTheme } = useTheme();

    const toggleTheme = () => {
        setTheme(theme === "light" ? "dark" : "light");
    };

    const isActive = theme === "light";

    // const switchClasses = `flex items-center justify-center w-6 h-6 text-dark bg-white rounded-full transform ${

    // isActive ? 'translate-x-0' : 'translate-x-6'

    // } transition-transform duration-500 ease-in-out`;

return (

<Button onClick={toggleTheme}>{isActive ? <MoonIcon /> : <SunIcon />}</Button>

)};

export default ThemeSwitch;