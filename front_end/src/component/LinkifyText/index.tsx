import { FC } from 'react';
import style from './style.module.scss';

interface Props {
    text: string;
}

// Regex đơn giản để detect URL
const urlRegex = /(https?:\/\/[^\s]+)/g;

const LinkifyText: FC<Props> = ({ text }) => {
    // Tách text thành mảng gồm text bình thường và link
    const parts = text.split(urlRegex);

    return (
        <div className={style.parent}>
            {parts.map((part, index) => {
                // Nếu phần tử khớp regex thì render <a>
                if (part.match(urlRegex)) {
                    return (
                        <a key={index} href={part} target="_blank" rel="noopener noreferrer" style={{ color: 'blue' }}>
                            {part}
                        </a>
                    );
                }
                // Nếu không phải link thì render bình thường
                return <span key={index}>{part}</span>;
            })}
        </div>
    );
};

export default LinkifyText;
