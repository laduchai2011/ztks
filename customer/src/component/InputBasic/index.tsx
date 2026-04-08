import { FC, memo, useRef, useEffect } from 'react';
import style from './style.module.scss';

interface ComponentProps extends React.HTMLAttributes<HTMLDivElement> {
    header?: string;
    value?: string | number;
    onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const InputBasic: FC<ComponentProps> = ({ header, value, onChange, className, ...props }) => {
    const header_element = useRef<HTMLDivElement | null>(null);
    const input_element = useRef<HTMLInputElement | null>(null);

    useEffect(() => {
        const headerElement = header_element.current;
        const inputElement = input_element.current;
        if (!headerElement) return;
        if (!inputElement) return;

        function handlefocus() {
            if (headerElement) {
                headerElement.classList.add(style.forcus);
            }
        }

        inputElement.addEventListener('focus', handlefocus);

        return () => {
            if (!inputElement) return;
            inputElement.removeEventListener('focus', handlefocus);
        };
    }, []);

    return (
        <div className={`${style.parent} ${className || ''}`} {...props}>
            <div className={style.header} ref={header_element}>
                <div>{header}</div>
            </div>
            <input value={value} ref={input_element} onChange={onChange} />
        </div>
    );
};

export default memo(InputBasic);
