import { useEffect } from 'react';
import style from './style.module.scss';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { AppDispatch } from '@src/redux';
import ToolBar from './component/ToolBar';
import Content from './component/Content';

const DashBoard = () => {
    return (
        <div className={style.parent}>
            <div className={style.main}>
                <ToolBar />
                <Content />
            </div>
            <div>
                {/* <MyToastMessage />
                <MyLoading /> */}
            </div>
        </div>
    );
};

export default DashBoard;
