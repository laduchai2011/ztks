import { useEffect, useState } from 'react';
import style from './style.module.scss';
import { useNavigate } from 'react-router-dom';
import { WALLET } from '@src/const/text';
import { route_enum } from '@src/router/type';
import Overview from './component/Overview';

const Wallet = () => {
    const navigate = useNavigate();
    const myId = sessionStorage.getItem('myId');

    const [selectedType, setSelectedType] = useState(1);

    useEffect(() => {
        if (myId === null) {
            navigate(route_enum.SIGNIN);
        }
    }, [navigate, myId]);

    const handleSlectedClass = (type: number) => {
        if (type === selectedType) {
            return style.selected;
        }
    };

    const handleSelectedType = (type: number) => {
        setSelectedType(type);
    };

    return (
        <div className={style.parent}>
            <div className={style.main}>
                <div className={style.header}>{WALLET}</div>
                <div className={style.contentContainer}>
                    <div className={style.types}>
                        <div
                            className={handleSlectedClass(1)}
                            onClick={() => handleSelectedType(1)}
                        >{`${WALLET} 1`}</div>
                        <div
                            className={handleSlectedClass(2)}
                            onClick={() => handleSelectedType(2)}
                        >{`${WALLET} 2`}</div>
                    </div>
                    <Overview />
                </div>
            </div>
        </div>
    );
};

export default Wallet;
