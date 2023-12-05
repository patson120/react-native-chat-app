import {configureStore, createSlice } from "@reduxjs/toolkit";

export const userSlice = createSlice({
    name: "user",
    initialState: {
        user: {
            _id: null,
            avatar: null,
            email: null,
            friends: [],
            username: null
        },
        correspondant: {
            avatar: null,
            chatroomId: null,
            username: null
        }
    },
    reducers: {
        updateUser: (state, action) => {
            // { type: "todo/updateUser", payload: "Aller faire les courses"}
            state = {
                ...state,
                user: {...action.payload}
            };
            return state;
        },
        updateCorrespondant: (state, action) => {
            // { type: "todo/updateUser", payload: "Aller faire les courses"}
            state = {
                ...state,
                correspondant: {...action.payload}
            };
            return state;
        },
    }
});

export const selectUser = state => state.user.user;
export const selectCorrespondant = state => state.user.correspondant;

export const { updateUser, updateCorrespondant } = userSlice.actions;

export const store = configureStore({
    reducer: {
        user: userSlice.reducer,
    }
})