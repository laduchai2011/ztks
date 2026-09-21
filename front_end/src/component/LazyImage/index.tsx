// import { useEffect, useRef, useState, memo } from 'react';
// import style from './style.module.scss';
// import { LazyImageProps } from './type';
// import Skeleton from '../Skeleton';

// const LazyImage = ({ src, alt, className, root }: LazyImageProps) => {
//     const imgRef = useRef<HTMLImageElement | null>(null);
//     const [loaded, setLoaded] = useState(false);
//     const [loading, setLoading] = useState(false);

//     useEffect(() => {
//         if (!imgRef.current) return;

//         const observer = new IntersectionObserver(
//             ([entry]) => {
//                 if (entry.isIntersecting) {
//                     setLoading(true);
//                     observer.disconnect();
//                 }
//             },
//             {
//                 root: root,
//             }
//         );

//         observer.observe(imgRef.current);

//         return () => observer.disconnect();
//     }, [root]);

//     const handleOnLoad = () => {
//         setTimeout(() => {
//             setLoaded(true);
//         }, 3000);
//     };

//     return (
//         <div className={`${style.parent} ${className || ''}`}>
//             {loading && !loaded ? (
//                 <Skeleton />
//             ) : (
//                 <img className={style.image} ref={imgRef} src={src} alt={alt} onLoad={() => handleOnLoad()} />
//             )}
//         </div>
//     );
// };

// export default memo(LazyImage);

import { useEffect, useRef, useState, memo } from 'react';
import style from './style.module.scss';
import { LazyImageProps } from './type';
import Skeleton from '../Skeleton';

const LazyImage = ({ src, alt, className, root }: LazyImageProps) => {
    const imgRef = useRef<HTMLImageElement | null>(null);
    const [loaded, setLoaded] = useState(false);
    const [shouldLoad, setShouldLoad] = useState(false);

    useEffect(() => {
        if (!imgRef.current) return;

        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    setShouldLoad(true);
                    observer.disconnect();
                }
            },
            { root }
        );

        observer.observe(imgRef.current);

        return () => observer.disconnect();
    }, [root]);

    const handleError = (e: React.SyntheticEvent<HTMLImageElement, Event>) => {
        console.log(e);
    };

    return (
        <div className={`${style.parent} ${className || ''}`}>
            {!loaded && <Skeleton />}

            <img
                ref={imgRef}
                src={shouldLoad ? src : undefined}
                alt={alt}
                className={style.image}
                onLoad={() => setLoaded(true)}
                onError={(e) => handleError(e)}
                style={{ opacity: loaded ? 1 : 0 }}
            />
        </div>
    );
};

export default memo(LazyImage);
