import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { generateStoryContent } from '../services/geminiService';

export const generateStoryBranch = createAsyncThunk(
    'story/generateBranch',
    async ({ prompt, context }, { rejectWithValue }) => {
        try {
            const response = await generateStoryContent(prompt, context);
            return response;
        } catch (error) {
            return rejectWithValue(error.message);
        }
    }
);

const initialState = {
    currentStory: null,
    currentNode: null,
    storyHistory: [],
    isLoading: false,
    error: null,
    availableStories: [
        {
            id: 'space',
            title: 'Space Explorer Mission',
            description: 'Join Captain Luna on an exciting space exploration mission!',
            theme: 'space',
            difficulty: 'beginner',
            estimatedTime: '15-20 minutes',
        }
    ],
};

const storySlice = createSlice({
    name: 'story',
    initialState,
    reducers: {
        startStory: (state, action) => {
            const story = state.availableStories.find(s => s.id === action.payload);
            state.currentStory = story;

            if (action.payload === 'space') {
                state.currentNode = {
                    id: 'start',
                    type: 'story',
                    content: "Welcome aboard the Star Explorer, brave space cadet! I'm Captain Luna, and today we're embarking on a mission to discover new planets. Are you ready for an adventure that's out of this world?",
                    choices: [
                        { id: 'choice1', text: "Yes! Let's blast off!", action: 'launch' },
                        { id: 'choice2', text: "Tell me more about the mission first", action: 'info' }
                    ]
                };
            }

            state.storyHistory = [];
            state.error = null;
        },
        makeChoice: (state, action) => {
            const { choiceId, nodeData } = action.payload;

            state.storyHistory.push({
                node: state.currentNode,
                choice: choiceId,
                timestamp: Date.now()
            });

            state.currentNode = nodeData;
        },
        setStoryNode: (state, action) => {
            state.currentNode = action.payload;
        },
        resetStory: (state) => {
            state.currentStory = null;
            state.currentNode = null;
            state.storyHistory = [];
            state.error = null;
        },
        clearError: (state) => {
            state.error = null;
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(generateStoryBranch.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(generateStoryBranch.fulfilled, (state, action) => {
                state.isLoading = false;
                state.currentNode = action.payload;
            })
            .addCase(generateStoryBranch.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload;
            });
    },
});

export const {
    startStory,
    makeChoice,
    setStoryNode,
    resetStory,
    clearError
} = storySlice.actions;

export default storySlice.reducer;
