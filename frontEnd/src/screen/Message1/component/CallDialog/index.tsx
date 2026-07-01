import { memo, useEffect, useRef, useState } from 'react';
import style from './style.module.scss';
// import { useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '@src/redux';
import Infor from './component/Infor';
import RequestConsent from './component/RequestConsent';
import Call from './component/Call';
import { IoMdClose } from 'react-icons/io';
import { AGREE, EXIT, CLOSE } from '@src/const/text';
import { MySip } from '../../call';
import { setIsShow_callDialog } from '@src/redux/slice/MessageV1';
import {
    useLazyGetMccInfoQuery,
    useLazyCheckConsentQuery,
    useRequestConsentMutation,
    useOutboundMutation,
} from '@src/redux/query/callRTK';
import { ZaloAppField, ZaloOaField } from '@src/dataStruct/zalo';

const CallDialog = () => {
    const dispatch = useDispatch<AppDispatch>();
    const parent_element = useRef<HTMLDivElement | null>(null);
    const zaloApp: ZaloAppField | undefined = useSelector((state: RootState) => state.AppSlice.zaloApp);
    const zaloOa: ZaloOaField | undefined = useSelector((state: RootState) => state.MessageV1Slice.zaloOa);
    const isShow: boolean = useSelector((state: RootState) => state.MessageV1Slice.callDialog.isShow);
    const uid: string = useSelector((state: RootState) => state.MessageV1Slice.uid);

    const [agentCode, setAgentCode] = useState<string>('');
    const [agentPassword, setAgentPassword] = useState<string>('taokosao201195');
    const [isRequestConsent, setIsRequestConsent] = useState<boolean>(false);
    const [isRinging, setIsRinging] = useState<boolean>(false);

    const [checkConsent] = useLazyCheckConsentQuery();
    const [requestConsent] = useRequestConsentMutation();
    const [getMccInfo] = useLazyGetMccInfoQuery();
    const [outbound] = useOutboundMutation();

    useEffect(() => {
        if (!parent_element.current) return;
        const parentElement = parent_element.current;

        if (isShow) {
            parentElement.classList.add(style.display);
            const timeout2 = setTimeout(() => {
                parentElement.classList.add(style.opacity);
                clearTimeout(timeout2);
            }, 50);
        } else {
            parentElement.classList.remove(style.opacity);

            const timeout2 = setTimeout(() => {
                parentElement.classList.remove(style.display);
                clearTimeout(timeout2);
            }, 550);
        }
    }, [isShow]);

    useEffect(() => {}, []);

    const handleClose = () => {
        dispatch(setIsShow_callDialog(false));
    };

    const handleOpenRequestConsent = () => {
        // if (!zaloApp) return;
        // if (!zaloOa) return;
        // requestConsent({
        //     phone: '84869628195',
        //     call_type: CallTypeEnum.AUDIO,
        //     reason_code: 101,
        //     zaloApp: zaloApp,
        //     zaloOa: zaloOa,
        //     accountId: -1,
        // })
        //     .then((res) => {
        //         console.log(res);
        //     })
        //     .catch((err) => {
        //         console.error(err);
        //     });
    };

    const handleGetAgent = () => {
        if (!zaloApp) return;
        if (!zaloOa) return;

        getMccInfo({
            zaloApp: zaloApp,
            zaloOa: zaloOa,
            accountId: -1,
        })
            .then((res) => {
                console.log(res);
            })
            .catch((err) => {
                console.error(err);
            });
    };

    const handleOutbound = () => {
        if (!zaloApp) return;
        if (!zaloOa) return;

        // outbound({
        //     phone: '84789860854',
        //     call_type: CallTypeEnum.AUDIO,
        //     reason_code: 101,
        //     zaloApp: zaloApp,
        //     zaloOa: zaloOa,
        //     accountId: -1,
        // })
        //     .then((res) => {
        //         console.log(res);
        //     })
        //     .catch((err) => {
        //         console.error(err);
        //     });
    };

    const handleCallUid = async () => {
        const mySip = new MySip(agentCode, agentPassword);
        mySip.createUserAgent();
        mySip.createRegisterer();
        await mySip.connectSip();
        await mySip.callUid(`99${uid}`);
        // await mySip.callUid(`990789860854`);
        // callUid('995324785107455488962');
        // callUid('998721866515278588973');
    };

    return (
        <div className={style.parent} ref={parent_element}>
            <div className={style.main}>
                <div className={style.closeContainer}>
                    <IoMdClose onClick={() => handleClose()} size={25} title={CLOSE} />
                </div>
                <div className={style.contentContainer}>
                    <div className={style.header}>Cuộc gọi</div>
                    {/* <div className={style.content}>
                        <div>Bạn chưa có quyền gọi tới người dùng này</div>
                        <div onClick={() => handleOpenRequestConsent()}>Gửi yêu cầu cấp quyền gọi</div>
                    </div> */}
                    <Infor isRinging={isRinging} setIsRequestConsent={setIsRequestConsent} />
                    <RequestConsent isShow={isRequestConsent} setIsShow={setIsRequestConsent} />
                    <Call setIsRinging={setIsRinging} />
                    {/* <div>
                        <input
                            value={agentCode}
                            onChange={(e) => setAgentCode(e.target.value)}
                            placeholder="agentcode"
                        />
                    </div> */}
                    {/* <button onClick={() => handleRequestConsent()}>Xin cấp quyền gọi</button>
                    <button onClick={() => handleGetAgent()}>Lấy agent</button>
                    <button onClick={() => handleOutbound()}>Tạo link cuộc gọi</button>
                    <button onClick={() => handleCallUid()}>CallUid</button> */}
                </div>
            </div>
        </div>
    );
};

export default memo(CallDialog);
