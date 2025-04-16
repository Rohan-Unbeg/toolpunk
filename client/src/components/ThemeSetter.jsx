import { useEffect } from "react";

const ThemeSetter = () => {
    useEffect(() => {
        const theme = getComputedStyle(document.documentElement)
            .getPropertyValue("--theme")
            .trim()
            .replace(/"/g, "");
        document.documentElement.setAttribute("data-theme", theme);
    }, []);

    return null;
};

export default ThemeSetter;
