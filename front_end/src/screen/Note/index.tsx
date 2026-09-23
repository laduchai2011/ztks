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
import NoteList from './component/NoteList';
import EditNote from './component/EditNote';
import DeleteNoteDialog from './component/DeleteNoteDialog';
import { IoChevronBack } from 'react-icons/io5';
import { select_enum } from '@src/router/type';
import { set__data__toast_message, clear__new_notes } from '@src/redux/slice/Note';
import { route_enum } from '@src/router/type';

const Note = () => {
    const dispatch = useDispatch<AppDispatch>();
    const navigate = useNavigate();
    const my_id = sessionStorage.getItem('myId');

    useEffect(() => {
        if (my_id === null) {
            navigate(route_enum.SIGNIN);
        }
    }, [navigate, my_id]);

    useEffect(() => {
        return () => {
            dispatch(set__data__toast_message({ type: undefined, message: '' }));
            dispatch(clear__new_notes());
        };
    }, [dispatch]);

    const handle_Back = () => {
        navigate(-1);
    };

    return (
        <div className={style.parent}>
            <div className={style.main}>
                <div className={style.header}>
                    <div>{NOTE}</div>
                    <IoChevronBack onClick={() => handle_Back()} size={20} color="white" />
                </div>
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
                <DeleteNoteDialog />
            </div>
        </div>
    );
};

export default Note;
