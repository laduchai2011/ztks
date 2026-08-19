import { useEffect } from 'react';
import style from './style.module.scss';
import ToolBar from '@src/screen/ToolBar';
import Filter from './component/Filter';
import Overview from './component/Overview';

const DashBoard = () => {
    return (
        <div className={style.parent}>
            <div className={style.main}>
                <ToolBar />
                <div className={style.main1}>
                    <Filter />
                    <Overview />
                </div>
                <div className={style.main2}>
                    <Filter />
                </div>
            </div>
            <div>
                {/* <MyToastMessage />
                <MyLoading /> */}
            </div>
        </div>
    );
};

export default DashBoard;
