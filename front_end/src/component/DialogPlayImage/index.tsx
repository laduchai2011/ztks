import { FC, memo, useMemo, useRef, useEffect, useState } from 'react';
import style from './style.module.scss';
import { IoCloseCircleOutline } from 'react-icons/io5';
import { CLOSE } from '@src/const/text';
import LazyImg from '../LazyImg';
import { options_enum, selectedOptions_type } from './type';

interface ComponentProps extends React.HTMLAttributes<HTMLDivElement> {
    isShow?: boolean;
    data?: string[];
    onClose?: () => void;
}

const DialogPlayImage: FC<ComponentProps> = ({ isShow, data, onClose, className, ...props }) => {
    const parent_element = useRef<HTMLDivElement | null>(null);
    const options_element = useRef<HTMLDivElement | null>(null);
    const myCroll_element = useRef<HTMLDivElement | null>(null);

    // sroll content
    const contentContainer_element = useRef<HTMLDivElement | null>(null);
    const imageContainer_element = useRef<HTMLDivElement | null>(null);
    const imageListContainer_element = useRef<HTMLDivElement | null>(null);

    const [isShow1, setIsShow1] = useState<boolean>(false);

    const [selectedOption, setSelectedOption] = useState<selectedOptions_type>(options_enum.ALL);
    const [selectedImage, setSelectedImage] = useState<string>('');

    useEffect(() => {
        if (data && data.length > 0) {
            setSelectedImage(data[0]);
        }
    }, [data]);

    useEffect(() => {
        if (isShow) {
            setIsShow1(true);
            const setTimeoutShow = setTimeout(() => {
                if (parent_element.current) {
                    parent_element.current.classList.add(style.parent_show_display);
                }
                const timeout = setTimeout(() => {
                    if (parent_element.current) {
                        parent_element.current.classList.add(style.parent_show_opacity);
                    }
                    clearTimeout(timeout);
                }, 50);
                clearTimeout(setTimeoutShow);
            }, 50);
        } else {
            if (parent_element.current) {
                parent_element.current.classList.remove(style.parent_show_opacity);
            }
            const timeout = setTimeout(() => {
                if (parent_element.current) {
                    parent_element.current.classList.remove(style.parent_show_display);
                    clearTimeout(timeout);
                }
            }, 350);
            const setTimeoutShow = setTimeout(() => {
                setIsShow1(false);
                clearTimeout(setTimeoutShow);
            }, 400);
        }
    }, [isShow]);

    useEffect(() => {
        // handle header
        if (!options_element.current) return;
        if (!myCroll_element.current) return;

        const optionsElement = options_element.current;
        const myScrollElement = myCroll_element.current;

        const optionsArray = Object.values(options_enum);
        const selectedOptionNumber = optionsArray.indexOf(selectedOption);
        const target = optionsElement.children[selectedOptionNumber] as HTMLElement;
        const width = target.offsetWidth;
        const left = target.offsetLeft;

        myScrollElement.style.width = `${width}px`;
        myScrollElement.style.left = `${left}px`;

        // handle content
        if (!contentContainer_element.current) return;
        if (!imageContainer_element.current) return;
        if (!imageListContainer_element.current) return;

        const contentContainerElement = contentContainer_element.current;
        const imageContainerElement = imageContainer_element.current;
        const imageListContainerElement = imageListContainer_element.current;

        switch (selectedOption) {
            case options_enum.ALL: {
                contentContainerElement.style.left = '0';
                imageContainerElement.classList.add(style.half);
                imageContainerElement.classList.remove(style.full);
                imageListContainerElement.classList.add(style.half);
                imageListContainerElement.classList.remove(style.full);
                break;
            }
            case options_enum.PLAY: {
                contentContainerElement.style.left = '0';
                imageContainerElement.classList.remove(style.half);
                imageContainerElement.classList.add(style.full);
                imageListContainerElement.classList.remove(style.half);
                imageListContainerElement.classList.add(style.full);
                break;
            }
            case options_enum.LIST: {
                contentContainerElement.style.left = '-100%';
                imageContainerElement.classList.remove(style.half);
                imageContainerElement.classList.add(style.full);
                imageListContainerElement.classList.remove(style.half);
                imageListContainerElement.classList.add(style.full);
                break;
            }
            default: {
                contentContainerElement.style.left = '0';
                imageContainerElement.classList.add(style.half);
                imageContainerElement.classList.remove(style.full);
                imageListContainerElement.classList.add(style.half);
                imageListContainerElement.classList.remove(style.full);
                break;
            }
        }
    }, [selectedOption]);

    const handleSelectedOptionNumber = (selectedOption: selectedOptions_type) => {
        setSelectedOption(selectedOption);
    };

    const handleClose = () => {
        if (onClose) {
            onClose();
        }
    };

    const list_image = useMemo(() => {
        return data?.map((data1, index) => (
            <LazyImg key={index} className={style.video1} srcImg={data1} onClick={() => setSelectedImage(data1)} />
        ));
    }, [data]);

    return (
        <div className={`${style.parent} ${className || ''}`} {...props} ref={parent_element}>
            <div className={style.main}>
                <div className={style.header}>
                    <div className={style.optionContainer}>
                        <div className={style.options} ref={options_element}>
                            <div className={style.option} onClick={() => handleSelectedOptionNumber(options_enum.ALL)}>
                                {options_enum.ALL}
                            </div>
                            <div className={style.option} onClick={() => handleSelectedOptionNumber(options_enum.PLAY)}>
                                {options_enum.PLAY}
                            </div>
                            <div className={style.option} onClick={() => handleSelectedOptionNumber(options_enum.LIST)}>
                                {options_enum.LIST}
                            </div>
                        </div>
                        <div className={style.myCroll} ref={myCroll_element} />
                    </div>
                    <div className={style.iconContainer}>
                        <div className={style.amount}>{data?.length}</div>
                        <IoCloseCircleOutline className={style.closeIcon} onClick={() => handleClose()} title={CLOSE} />
                    </div>
                </div>
                <div className={style.content}>
                    <div className={style.contentContainer} ref={contentContainer_element}>
                        <div className={style.imageContainer} ref={imageContainer_element}>
                            {isShow1 && <LazyImg className={style.image} srcImg={selectedImage} alt="" />}
                        </div>
                        <div className={style.imageListContainer} ref={imageListContainer_element}>
                            {isShow1 && <div className={style.imageList}>{list_image}</div>}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default memo(DialogPlayImage);
