import { memo, useState, useEffect } from 'react';
import style from './style.module.scss';
import { useSelector, useDispatch } from 'react-redux';
import { RootState, AppDispatch } from '@src/redux';
import { SEE_MORE } from '@src/const/text';
import { CiSearch } from 'react-icons/ci';
import OneService from './component/OneService';
import { useLazy_get_Agents_Query } from '@src/redux/query/agent_RTK';
import { Agent_Field } from '@src/data_struct/agent';
import { set__is_loading, set__data__toast_message } from '@src/redux/slice/Manage_Agent';
import { messageType_enum } from '@src/component/ToastMessage/type';

const ServiceList = () => {
    const dispatch = useDispatch<AppDispatch>();
    const new_agents: Agent_Field[] = useSelector((state: RootState) => state.Manage_Agent_Slice.new_agents);

    const [agents, set__agents] = useState<Agent_Field[]>([]);
    const [has_more, set__has_more] = useState<boolean>(true);
    const [page, set__page] = useState<number>(1);
    const [search_input, set__search_input] = useState<string>('');
    const [is_search, set__is_search] = useState<boolean>(true);
    const size = 10;

    const [get_Agents] = useLazy_get_Agents_Query();

    useEffect(() => {
        if (new_agents.length === 0) return;
        set__agents((prev) => [new_agents[new_agents.length - 1], ...prev]);
    }, [new_agents]);

    useEffect(() => {
        if (!is_search) return;
        const search_input_t = search_input.trim();
        dispatch(set__is_loading(true));
        get_Agents({
            page: 1,
            size: size,
            offset: 0,
            agent_account_id: search_input_t.length > 0 ? search_input_t : '',
            account_id: '',
        })
            .then((res) => {
                const res_data = res.data;
                if (res_data?.is_success && res_data.data) {
                    set__agents(res_data.data.items);
                    set__page(2);
                    set__has_more(res_data.data.items.length === size);
                }
            })
            .catch((err) => {
                console.error(err);
                dispatch(
                    set__data__toast_message({
                        type: messageType_enum.ERROR,
                        message: 'Đã có lỗi xảy ra !',
                    })
                );
            })
            .finally(() => {
                dispatch(set__is_loading(false));
                set__is_search(false);
            });
    }, [dispatch, get_Agents, is_search, search_input]);

    const handle_See_More = () => {
        if (!has_more) return;
        const search_input_t = search_input.trim();
        dispatch(set__is_loading(true));
        get_Agents({
            page: page,
            size: size,
            offset: 0,
            agent_account_id: search_input_t.length > 0 ? search_input_t : '',
            account_id: '',
        })
            .then((res) => {
                const res_data = res.data;
                if (res_data?.is_success && res_data.data) {
                    set__agents((prev) => [...prev, ...(res_data.data?.items || [])]);
                    set__page((pre) => pre + 1);
                    set__has_more(res_data.data.items.length === size);
                }
            })
            .catch((err) => {
                console.error(err);
                dispatch(
                    set__data__toast_message({
                        type: messageType_enum.ERROR,
                        message: 'Đã có lỗi xảy ra !',
                    })
                );
            })
            .finally(() => dispatch(set__is_loading(false)));
    };

    const handle_Search_Input = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        set__search_input(value);
    };

    const handle_Search = () => {
        set__is_search(true);
    };

    const list_service = agents.map((item, index) => {
        return <OneService data={item} key={item.id} index={index} />;
    });

    return (
        <div className={style.parent}>
            <div className={style.search}>
                <div>
                    <input value={search_input} onChange={(e) => handle_Search_Input(e)} placeholder="Id thành viên" />
                    <CiSearch onClick={() => handle_Search()} size={25} />
                </div>
            </div>
            <div>{list_service}</div>
            {has_more && (
                <div className={style.seeMore}>
                    <div onClick={() => handle_See_More()}>{SEE_MORE}</div>
                </div>
            )}
        </div>
    );
};

export default memo(ServiceList);
