import { FC, memo, useRef, useEffect, useState } from 'react';
import style from './style.module.scss';
import { avatarnull } from '@src/utility/string';
import { handleSrcImage } from '@src/utility/string';
import { Account_Field } from '@src/data_struct/account';
import {
    useLazy_get_Check_In_Outs_With_Date_Query,
    useLazy_get_Check_In_Out_Inspect_With_Fk_Query,
} from '@src/redux/query/check_in_out_RTK';
import { useLazy_get_Account_With_Id_Query } from '@src/redux/query/account_RTK';
import { Check_In_Out_Enum, Check_In_Out_Field, Check_In_Out_Inspect_Field } from '@src/data_struct/check_in_out';
import { Get_Check_In_Outs_With_Date_Body_Field } from '@src/data_struct/check_in_out/body';
import OneCheck from './component/OneCheck';

const OneCheckMember: FC<{ index: number; account: Account_Field; day: string }> = ({ index, account, day }) => {
    const checkContainer_element = useRef<HTMLDivElement | null>(null);
    const [show_img, set__show_img] = useState<boolean>(false);

    const [count_in, set__count_in] = useState<number>(0);
    const [count_out, set__count_out] = useState<number>(0);
    const [check_in_outs, set__check_in_outs] = useState<Check_In_Out_Field[]>([]);
    const [count_in_inspect, set__count_in_inspect] = useState<number>(0);
    const [count_out_inspect, set__count_out_inspect] = useState<number>(0);
    const [inspect_text, set__inspect_text] = useState<string>('Chưa duyệt');
    const [check_in_out_inspects, set__check_in_out_inspects] = useState<Check_In_Out_Inspect_Field[]>([]);
    const [inspect_accounts, set__inspect_accounts] = useState<Account_Field[]>([]);

    const [get_Check_In_Outs_With_Date] = useLazy_get_Check_In_Outs_With_Date_Query();
    const [get_Check_In_Out_Inspect_With_Fk] = useLazy_get_Check_In_Out_Inspect_With_Fk_Query();
    const [get_Account_With_Id] = useLazy_get_Account_With_Id_Query();

    useEffect(() => {
        if (!checkContainer_element.current) return;
        const checkContainerElement = checkContainer_element.current;
        if (show_img) {
            checkContainerElement.classList.add(style.show);
        } else {
            checkContainerElement.classList.remove(style.show);
        }
    }, [show_img]);

    const handle_See_Check = () => {
        set__show_img(!show_img);
    };

    useEffect(() => {
        async function get_Check() {
            let _check_in_ounts: Check_In_Out_Field[] = [];
            const body_in: Get_Check_In_Outs_With_Date_Body_Field = {
                type: Check_In_Out_Enum.IN,
                date: day,
                account_id: account.id,
            };
            const body_out: Get_Check_In_Outs_With_Date_Body_Field = {
                type: Check_In_Out_Enum.OUT,
                date: day,
                account_id: account.id,
            };

            try {
                const results = await Promise.all([
                    get_Check_In_Outs_With_Date(body_in),
                    get_Check_In_Outs_With_Date(body_out),
                ]);

                const res1_data = results[0].data;
                const res2_data = results[1].data;

                if (res1_data?.is_success && res1_data.data) {
                    _check_in_ounts = _check_in_ounts.concat(res1_data.data);
                    set__count_in(res1_data.data.length);
                }

                if (res2_data?.is_success && res2_data.data) {
                    _check_in_ounts = _check_in_ounts.concat(res2_data.data);
                    set__count_out(res2_data.data.length);
                }

                _check_in_ounts.sort((a, b) => new Date(b.create_time).getTime() - new Date(a.create_time).getTime());

                set__check_in_outs(_check_in_ounts);
            } catch (error) {
                console.error(error);
            }
        }
        get_Check();
    }, [get_Check_In_Outs_With_Date, account.id, day]);

    useEffect(() => {
        let _count_in_inspect: number = 0;
        let _count_out_inspect: number = 0;
        const _check_in_out_inspects: Check_In_Out_Inspect_Field[] = [];

        async function get_Check_In_Out_Inspect() {
            try {
                for (let i: number = 0; i < check_in_outs.length; i++) {
                    const result = await get_Check_In_Out_Inspect_With_Fk({ check_in_out_id: check_in_outs[i].id });
                    const res_data = result.data;
                    if (res_data?.is_success && res_data.data) {
                        _check_in_out_inspects.push(res_data.data);
                        switch (check_in_outs[i].type) {
                            case Check_In_Out_Enum.IN:
                                _count_in_inspect = _count_in_inspect + 1;
                                break;

                            case Check_In_Out_Enum.OUT:
                                _count_out_inspect = _count_out_inspect + 1;
                                break;

                            default:
                                console.log('Không xác định');
                                break;
                        }
                    }
                }
            } catch (error) {
                console.error(error);
            } finally {
                set__count_in_inspect(_count_in_inspect);
                set__count_out_inspect(_count_out_inspect);
                _check_in_out_inspects.sort(
                    (a, b) => new Date(b.create_time).getTime() - new Date(a.create_time).getTime()
                );
                set__check_in_out_inspects(_check_in_out_inspects);
            }
        }
        get_Check_In_Out_Inspect();
    }, [check_in_outs, get_Check_In_Out_Inspect_With_Fk]);

    useEffect(() => {
        async function get_Inspect_User() {
            const _inspect_account: Account_Field[] = [];
            try {
                for (let i: number = 0; i < check_in_out_inspects.length; i++) {
                    const result = await get_Account_With_Id({ id: check_in_out_inspects[i].account_id });
                    const res_data = result.data;
                    if (res_data?.is_success && res_data.data) {
                        _inspect_account.push(res_data.data);
                    }
                }
            } catch (error) {
                console.error(error);
            } finally {
                set__inspect_accounts(_inspect_account);
            }
        }
        get_Inspect_User();
    }, [check_in_out_inspects, get_Account_With_Id]);

    useEffect(() => {
        if (count_in === count_in_inspect && count_out === count_out_inspect) {
            set__inspect_text('Đã duyệt');
        } else if (count_in_inspect === 0 && count_out_inspect === 0) {
            set__inspect_text('Chưa duyệt');
        } else {
            set__inspect_text('Duyệt 1 phần');
        }
    }, [count_in, count_out, count_in_inspect, count_out_inspect]);

    const handle_Inspect_Color = () => {
        if (
            count_in_inspect !== 0 &&
            count_out_inspect !== 0 &&
            count_in === count_in_inspect &&
            count_out === count_out_inspect
        ) {
            for (let i: number = 0; i < check_in_out_inspects.length; i++) {
                if (check_in_out_inspects[i].is_pass === false) {
                    return style.notPass;
                }
            }
            return style.pass;
        }

        return style.notPass;
    };

    const list_check = check_in_outs.map((item, index) => {
        return <OneCheck key={index} data={item} />;
    });

    const list_inspect_account = inspect_accounts.map((item, index) => {
        return <span className={style.inspectAccount} key={index}>{`${item.first_name} ${item.last_name}`}</span>;
    });

    return (
        <div className={`${style.parent} ${handle_Inspect_Color()}`}>
            <div>
                <div className={style.index}>{index + 1}</div>
                <div className={style.avatar}>
                    <img src={account?.avatar ? handleSrcImage(account.avatar) : avatarnull} alt="avatar" />
                </div>
                <div className={style.name}>{`${account.first_name} ${account.last_name}`}</div>
                <div className={style.in}>{`in (${count_in_inspect}/${count_in})`}</div>
                <div className={style.out}>{`out (${count_out_inspect}/${count_out})`}</div>
                <div className={style.inspect}>{inspect_text}</div>
                <div className={style.inspectUser}>
                    {inspect_accounts.length > 0 ? (
                        <div className={style.inspectAccounts}>{list_inspect_account}</div>
                    ) : (
                        <div>Chưa có</div>
                    )}
                </div>
                <div className={style.seeCheck} onClick={() => handle_See_Check()}>
                    Xem
                </div>
            </div>
            <div ref={checkContainer_element}>{list_check}</div>
        </div>
    );
};

export default memo(OneCheckMember);
