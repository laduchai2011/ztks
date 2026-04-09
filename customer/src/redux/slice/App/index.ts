import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { state_props } from '@src/App/type';
import { CustomerField } from '@src/dataStruct/customer';

const initialState: state_props = {
    customer: undefined,
};

const AppSlice = createSlice({
    name: 'AppSlice',
    initialState,
    reducers: {
        set_customer: (state, action: PayloadAction<CustomerField>) => {
            state.customer = action.payload;
        },
    },
});

export const { set_customer } = AppSlice.actions;
export default AppSlice.reducer;
