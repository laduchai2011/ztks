import { useRef, useEffect, useState } from 'react';
import style from './style.module.scss';
import { useNavigate } from 'react-router-dom';
import { SIGNOUT, SIGNIN } from '@src/const/text';
import Loading from '@src/component/Loading';
import { LoadProps, LineCircleLoadProps } from '@src/component/Loading/type';
import { LOAD_COMPONENTS_CONST } from '@src/component/Loading/const';
import { use_signout_Mutation } from '@src/redux/query/account_RTK';
import { route_enum } from '@src/router/type';
import { handleSrcImage } from '@src/utility/string';

const Signout = () => {
    const navigate = useNavigate();
    const my_id = sessionStorage.getItem('myId');

    const overlay_element = useRef<HTMLDivElement | null>(null);
    const [is_signouting, set__is_signouting] = useState<boolean>(false);
    const [note, set__note] = useState<string>('');

    const [signout] = use_signout_Mutation();

    useEffect(() => {
        if (my_id === null) {
            navigate(route_enum.SIGNIN);
        }
    }, [navigate, my_id]);

    useEffect(() => {
        if (!overlay_element.current) return;
        const overlayElement = overlay_element.current;

        if (is_signouting) {
            overlayElement.classList.add(style.display);
            const timeout1 = setTimeout(() => {
                overlayElement.classList.add(style.opacity);
                clearTimeout(timeout1);
            }, 50);
        } else {
            overlayElement.classList.remove(style.opacity);
            const timeout2 = setTimeout(() => {
                overlayElement.classList.remove(style.display);
                clearTimeout(timeout2);
            }, 550);
        }
    }, [is_signouting]);

    const handle_Signout = () => {
        set__is_signouting(true);
        signout()
            .then((res) => {
                const res_data = res.data;
                if (res_data?.is_success) {
                    sessionStorage.removeItem('myId');
                    navigate(route_enum.HOME);
                    set__note('');
                } else {
                    set__note('Đăng xuất không thành công !');
                }
            })
            .catch((err) => console.error(err))
            .finally(() => set__is_signouting(false));
    };

    const go_To_Signin = () => {
        navigate(route_enum.SIGNIN);
    };

    const lineCircleLoad: LineCircleLoadProps = {
        lineSize: 3,
        lineBackgroundColor: 'blue',
        circleSize: 50,
    };

    const load: LoadProps = {
        type: LOAD_COMPONENTS_CONST.LOADING_TYPE.LINE_CIRCLE,
        infor: lineCircleLoad,
    };

    const handle_Back = () => {
        navigate(-1);
    };

    return (
        <div className={style.parent}>
            <div className={style.overlay} ref={overlay_element}>
                <Loading className={style.loadding} load={load} />
            </div>
            <div className={style.main}>
                <div>
                    <div>
                        <img src={handleSrcImage('logo.jpg')} alt="logo" />
                    </div>
                    <div>
                        <img
                            src="https://media.tenor.com/cvXdKcHF6-wAAAAM/%E3%81%95%E3%82%88%E3%81%AA%E3%82%89-%E3%83%90%E3%82%A4%E3%83%90%E3%82%A4.gif"
                            alt=""
                        />
                    </div>
                    <div className={style.text}>Quay lại sớm nhé !!!</div>
                    <div className={style.backBtn} onClick={() => handle_Back()}>
                        Quay lại
                    </div>
                    {my_id !== null && (
                        <div className={style.btnSignout} onClick={() => handle_Signout()}>
                            {SIGNOUT}
                        </div>
                    )}
                    {my_id === null && (
                        <div className={style.btnSignin} onClick={() => go_To_Signin()}>
                            {SIGNIN}
                        </div>
                    )}
                    {note.length > 0 && <div className={style.note}>{note}</div>}
                </div>
            </div>
        </div>
    );
};

export default Signout;
