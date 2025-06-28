import axios from 'axios';

const GEMINI_API_KEY = process.env.EXPO_PUBLIC_GEMINI_API_KEY;
const GEMINI_API_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent';

export const generateStoryContent = async (prompt, context = {}) => {
    if (!GEMINI_API_KEY) {
        throw new Error('Gemini API key not configured. Please set EXPO_PUBLIC_GEMINI_API_KEY in your environment.');
    }

    try {
        const storyType = context.storyType || 'space';

        const systemPrompt = `You are an AI storyteller for STEM Quest. Create engaging stories for school-aged girls.`;

        const response = await axios.post(
            `${GEMINI_API_URL}?key=${GEMINI_API_KEY}`,
            {
                contents: [
                    {
                        parts: [
                            {
                                text: `${systemPrompt}\n\nUser prompt: ${prompt}`
                            }
                        ]
                    }
                ],
            },
            {
                headers: {
                    'Content-Type': 'application/json',
                },
            }
        );

        const generatedText = response.data.candidates[0].content.parts[0].text;

        return {
            id: `generated_${Date.now()}`,
            type: 'story',
            content: generatedText,
            choices: [
                { id: 'continue', text: 'Continue', action: 'continue' }
            ]
        };

    } catch (error) {
        console.error('Error generating story content:', error);
        throw new Error('Failed to generate story content. Please try again.');
    }
};

// backup story incase gemini fails
export const getStoryNode = (nodeId, context = {}) => {
    return null;
};
