import React from 'react';

export const onmodechange = (setMode) => {
    setMode((prevMode) => {
        const newMode = !prevMode;
        document.documentElement.classList.toggle('dark-mode', newMode);
        document.body.classList.toggle('dark-mode', newMode);
        return newMode;
    });
};

export default function Handle() {
    return <></>;
}
