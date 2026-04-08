import { FC, memo, useRef, useEffect } from 'react';
import style from './style.module.scss';

type DivProps = Omit<React.HTMLAttributes<HTMLDivElement>, 'onChange'>;

interface ComponentProps extends DivProps {
    header?: string;
    value?: string;
    onChange?: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
}

const TextareaBasic: FC<ComponentProps> = ({ header, value, onChange, className, ...props }) => {
    const header_element = useRef<HTMLDivElement | null>(null);
    const textarea_element = useRef<HTMLTextAreaElement | null>(null);

    useEffect(() => {
        const headerElement = header_element.current;
        const textareaElement = textarea_element.current;
        if (!headerElement) return;
        if (!textareaElement) return;

        function handlefocus() {
            if (headerElement) {
                headerElement.classList.add(style.forcus);
            }
        }

        function autoRow() {
            if (textareaElement) {
                textareaElement.style.height = 'auto';
                textareaElement.style.height = textareaElement.scrollHeight + 'px';
            }
        }

        textareaElement.addEventListener('focus', handlefocus);
        textareaElement.addEventListener('input', autoRow);

        return () => {
            if (!textareaElement) return;
            textareaElement.removeEventListener('focus', handlefocus);
            textareaElement.removeEventListener('input', handlefocus);
        };
    }, []);

    return (
        <div className={`${style.parent} ${className || ''}`} {...props}>
            <div className={style.header} ref={header_element}>
                <div>{header}</div>
            </div>
            <textarea value={value} ref={textarea_element} onChange={onChange} />
        </div>
    );
};

export default memo(TextareaBasic);
