import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    selectedAvatar: null,
    age: null,
    name: '',
    progress: {
        currentStoryId: null,
        completedStories: [],
        badges: [],
    },
};

const userSlice = createSlice({
    name: 'user',
    initialState,
    reducers: {
        setAvatar: (state, action) => {
            state.selectedAvatar = action.payload;
        },
        setAge: (state, action) => {
            state.age = action.payload;
        },
        setName: (state, action) => {
            state.name = action.payload;
        },
        setCurrentStory: (state, action) => {
            state.progress.currentStoryId = action.payload;
        },
        completeStory: (state, action) => {
            const storyId = action.payload;
            if (!state.progress.completedStories.includes(storyId)) {
                state.progress.completedStories.push(storyId);
            }
        },
        addBadge: (state, action) => {
            const badge = action.payload;
            if (!state.progress.badges.includes(badge)) {
                state.progress.badges.push(badge);
            }
        },
        resetUser: (state) => {
            return initialState;
        },
    },
});

export const {
    setAvatar,
    setAge,
    setName,
    setCurrentStory,
    completeStory,
    addBadge,
    resetUser
} = userSlice.actions;

export default userSlice.reducer;
