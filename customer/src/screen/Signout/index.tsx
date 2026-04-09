import { useRef, useEffect, useState } from 'react';
import style from './style.module.scss';
import { useNavigate } from 'react-router-dom';
import { SIGNOUT, SIGNIN } from '@src/const/text';
import Loading from '@src/component/Loading';
import { LoadProps, LineCircleLoadProps } from '@src/component/Loading/type';
import { LOAD_COMPONENTS_CONST } from '@src/component/Loading/const';
import { useCustomerSignoutMutation } from '@src/redux/query/customerRTK';
import { route_enum } from '@src/router/type';

const Signout = () => {
    const navigate = useNavigate();
    const myId = sessionStorage.getItem('myId');

    const overlay_element = useRef<HTMLDivElement | null>(null);
    const [isSignouting, setIsSignouting] = useState<boolean>(false);
    const [note, setNote] = useState<string>('');

    const [customerSignout] = useCustomerSignoutMutation();

    useEffect(() => {
        if (myId === null) {
            navigate(route_enum.SIGNIN);
        }
    }, [navigate, myId]);

    useEffect(() => {
        if (!overlay_element.current) return;
        const overlayElement = overlay_element.current;

        if (isSignouting) {
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
    }, [isSignouting]);

    const handleSignout = () => {
        setIsSignouting(true);
        customerSignout()
            .then((res) => {
                const resData = res.data;
                if (resData?.isSuccess) {
                    sessionStorage.removeItem('myId');
                    setNote('');
                    setTimeout(() => {
                        window.location.reload();
                    }, 500);
                } else {
                    setNote('Đăng xuất không thành công !');
                }
            })
            .catch((err) => console.error(err))
            .finally(() => setIsSignouting(false));
    };

    const goToSignin = () => {
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

    return (
        <div className={style.parent}>
            <div className={style.overlay} ref={overlay_element}>
                <Loading className={style.loadding} load={load} />
            </div>
            <div className={style.main}>
                {myId !== null && (
                    <div className={style.btnSignout} onClick={() => handleSignout()}>
                        {SIGNOUT}
                    </div>
                )}
                {myId === null && (
                    <div className={style.btnSignin} onClick={() => goToSignin()}>
                        {SIGNIN}
                    </div>
                )}
                {note.length > 0 && <div className={style.note}>{note}</div>}
            </div>
        </div>
    );
};

export default Signout;
