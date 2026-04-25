import { memo, useEffect, useState } from 'react';
import style from './style.module.scss';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { AppDispatch } from '@src/redux';
import { setData_toastMessage, set_isLoading } from '@src/redux/slice/Post';
import { useLazyGetRegisterPostsQuery } from '@src/redux/query/postRTK';
import { RegisterPostField } from '@src/dataStruct/post';

const RegisterPostList = () => {
    const dispatch = useDispatch<AppDispatch>();
    const navigate = useNavigate();

    const [registerPosts, setRegisterPosts] = useState<RegisterPostField[]>([]);

    const [getRegisterPosts] = useLazyGetRegisterPostsQuery();

    useEffect(() => {}, [getRegisterPosts]);

    return <div className={style.parent}>list</div>;
};

export default memo(RegisterPostList);
