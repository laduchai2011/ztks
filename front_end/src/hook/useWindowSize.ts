import { useEffect, useState } from 'react';

type WindowSize = {
    width: number;
    height: number;
    is_mobile: boolean;
    is_tablet: boolean;
    is_desktop: boolean;
    is_md: boolean;
};

export function useWindowSize(): WindowSize {
    const [size, setSize] = useState<WindowSize>({
        width: typeof window !== 'undefined' ? window.innerWidth : 0,
        height: typeof window !== 'undefined' ? window.innerHeight : 0,
        is_mobile: false,
        is_tablet: false,
        is_desktop: false,
        is_md: false,
    });

    useEffect(() => {
        const update_Size = () => {
            const width = window.innerWidth;
            const height = window.innerHeight;

            setSize({
                width,
                height,
                is_mobile: width < 768,
                is_tablet: width >= 768 && width < 1024,
                is_desktop: width >= 1024,
                is_md: width < 1024,
            });
        };

        update_Size();

        window.addEventListener('resize', update_Size);

        return () => window.removeEventListener('resize', update_Size);
    }, []);

    return size;
}
