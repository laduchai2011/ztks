import React, { FC, useState, useRef, useEffect, useId } from 'react';
import ReactDOM from 'react-dom/client';
import style from './style.module.scss';

import MessageBox from './components/MessageBox';

import { TKSProps, TKS_Init, ToastMessageProps, ToastMessage_Data_Props } from './type';

import { handleCutPXInString } from './utils';

interface CreateElementProps {
    message?: string;
}

interface MyToastMessageProps extends React.HTMLProps<HTMLDivElement> {
    toastMessage?: ToastMessageProps;
    [key: string]: unknown;
}

const ToastMessage: FC<MyToastMessageProps> = ({ toastMessage, className, ...props }) => {
    const id = useRef<string>(`ToastMessage__T: ${useId()}`);

    const toastMessageElement = useRef<HTMLDivElement | null>(null);
    const toastMessageContainerElement = useRef<HTMLDivElement | null>(null);

    const maxMessage_ = useRef<number>(10);

    const [allData, setAllData] = useState<ToastMessage_Data_Props[]>([]);

    const distanceMessageBoxs = 60;

    useEffect(() => {
        const cp_allData: ToastMessage_Data_Props[] = [...allData];
        if (toastMessage?.data) {
            cp_allData.unshift(toastMessage?.data);
            setAllData(cp_allData);

            if (toastMessageContainerElement.current) {
                const messageBoxDivElements_m: HTMLCollectionOf<HTMLDivElement> = toastMessageContainerElement.current
                    .children as HTMLCollectionOf<HTMLDivElement>;
                const messageBoxDivElements = Array.from(messageBoxDivElements_m);

                for (let i: number = 0; i < messageBoxDivElements.length; i++) {
                    const messageBoxElements: HTMLCollectionOf<HTMLDivElement> = messageBoxDivElements[i]
                        .children as HTMLCollectionOf<HTMLDivElement>;
                    if (messageBoxElements[0]) {
                        const pre_top = messageBoxElements[0].style.top;
                        const old_top: number = Number(handleCutPXInString(pre_top));
                        messageBoxElements[0].style.top = `${old_top + distanceMessageBoxs}px`;

                        if (i === maxMessage_.current) {
                            messageBoxElements[0].style.opacity = '0';

                            const messageBoxDivElements_n: HTMLDivElement = messageBoxDivElements[i];

                            const remove_interval = setInterval(() => {
                                messageBoxDivElements_n.remove();
                                clearInterval(remove_interval);
                            }, 1000);
                        }
                    }
                }
                createElement({ message: toastMessage?.data?.message });
            }
        }

        // eslint-disable-next-line
    }, [toastMessage?.data]);

    useEffect(() => {
        if (toastMessage?.config?.max_message) {
            maxMessage_.current = toastMessage?.config?.max_message;
        }
    }, [toastMessage?.config]);

    useEffect(() => {
        if (toastMessage?.config?.id) {
            id.current = toastMessage?.config?.id;
        }
    }, [toastMessage?.config?.id]);

    useEffect(() => {
        if (toastMessage?.event?.onData) {
            const TKS: TKSProps = {
                ...TKS_Init,
                name: toastMessage?.config?.name,
                id: id.current,
                data: {
                    allData: allData,
                },
            };
            toastMessage?.event?.onData(TKS);
        }
    }, [allData, toastMessage]);

    const createElement = (createElement: CreateElementProps): void => {
        const element = React.createElement(MessageBox, {
            type: toastMessage?.data?.type,
            message: createElement.message,
        });
        const newNode = document.createElement('div');
        newNode.style.width = '300px';
        ReactDOM.createRoot(newNode).render(element);
        toastMessageContainerElement.current?.insertBefore(newNode, toastMessageContainerElement.current.firstChild);
    };

    return (
        <div className={`${style.parent} ${className || ''}`} ref={toastMessageElement} id={id.current} {...props}>
            <div ref={toastMessageContainerElement}></div>
        </div>
    );
};

export default React.memo(ToastMessage);
