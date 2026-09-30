import { memo } from 'react';
import ToastMessage from '@src/component/ToastMessage';
import { useSelector } from 'react-redux';
import { RootState } from '@src/redux';
import { ToastMessage_Data_Props } from '@src/component/ToastMessage/type';

const GlobalToastMessage = () => {
    const message: ToastMessage_Data_Props = useSelector((state: RootState) => state.Global_Slice.toast_message.data);

    return message.type && <ToastMessage toastMessage={{ data: { type: message.type, message: message.message } }} />;
};

export default memo(GlobalToastMessage);
