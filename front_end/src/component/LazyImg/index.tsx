import { useEffect, useRef, useState, memo, forwardRef } from 'react';
import style from './style.module.scss';

interface ComponentProps extends React.HTMLAttributes<HTMLDivElement> {
    srcImg?: string;
    alt?: string;
    root?: Element | Document | null | undefined;
}

const LazyImg = forwardRef<HTMLDivElement, ComponentProps>(({ srcImg, alt, className, root, ...props }, ref) => {
    const parent_element = useRef<HTMLDivElement | null>(null);
    const [inView, setInView] = useState(false);

    useEffect(() => {
        if (!parent_element.current) return;

        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    setInView(true);
                    observer.disconnect();
                }
            },
            {
                root: root ?? null,
            }
        );

        observer.observe(parent_element.current);

        return () => observer.disconnect();
    }, [root]);

    return (
        <div
            className={`${style.parent} ${className || ''}`}
            {...props}
            ref={(el) => {
                parent_element.current = el;
                if (typeof ref === 'function') {
                    ref(el);
                } else if (ref) {
                    (ref as React.RefObject<HTMLDivElement | null>).current = el;
                }
            }}
        >
            {inView && <img className={style.image} src={srcImg} alt={alt} />}
        </div>
    );
});

export default memo(LazyImg);
