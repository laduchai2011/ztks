import { useEffect } from 'react';
import style from './style.module.scss';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { AppDispatch } from '@src/redux';
import { NOTE } from '@src/const/text';
import MyLoading from './component/MyLoading';
import MyToastMessage from './component/MyToastMessage';
import Header from '@src/screen/Header';
import CreateNote from './component/CreateNote';
import OaList from './component/OaList';
import NoteList from './component/NoteList';
import EditNote from './component/EditNote';
import { select_enum } from '@src/router/type';
import { setData_toastMessage, clear_newNotes } from '@src/redux/slice/Note';
import { route_enum } from '@src/router/type';

const Note = () => {
    const dispatch = useDispatch<AppDispatch>();
    const navigate = useNavigate();
    const myId = sessionStorage.getItem('myId');

    useEffect(() => {
        if (myId === null) {
            navigate(route_enum.SIGNIN);
        }
    }, [navigate, myId]);

    useEffect(() => {
        return () => {
            dispatch(setData_toastMessage({ type: undefined, message: '' }));
            dispatch(clear_newNotes());
        };
    }, [dispatch]);

    return (
        <div className={style.parent}>
            <div className={style.main}>
                <div className={style.header}>{NOTE}</div>
                <OaList />
                <CreateNote />
                <NoteList />
                <div className={style.headerTab}>
                    <Header selected={select_enum.NOTE} />
                </div>
            </div>
            <div>
                <MyToastMessage />
                <MyLoading />
                <EditNote />
            </div>
        </div>
    );
};

export default Note;
