import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { state_props } from '@src/screen/Team/type';
import { Team_Field } from '@src/data_struct/team';

const initialState: state_props = {
    // team
    new_team: undefined,
};

const Team_Slice = createSlice({
    name: 'Team_Slice',
    initialState,
    reducers: {
        // team
        set__new_team: (state, action: PayloadAction<Team_Field>) => {
            state.new_team = action.payload;
        },
    },
});

export const {
    // team
    set__new_team,
} = Team_Slice.actions;
export default Team_Slice.reducer;
