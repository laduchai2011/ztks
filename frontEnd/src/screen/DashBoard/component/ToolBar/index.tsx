import { useEffect } from 'react';
import style from './style.module.scss';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { AppDispatch } from '@src/redux';

const ToolBar = () => {
    return <div className={style.parent}>ToolBar</div>;
};

export default ToolBar;
