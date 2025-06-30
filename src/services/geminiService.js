import axios from 'axios';

const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
const GEMINI_API_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent';

export const generateStoryContent = async (prompt, context = {}) => {
    if (!GEMINI_API_KEY) {
        throw new Error('Gemini API key not configured. Please set GEMINI_API_KEY in your environment.');
    }

    try {
        const storyType = context.storyType || 'space';
        const storyTheme = storyType === 'space' ? 'space exploration and astronomy' : 'robot repair and engineering';

        const systemPrompt = `You are an AI storyteller for STEM Quest, an educational app for girls aged 8-12. 
    Create engaging, age-appropriate stories that incorporate STEM concepts naturally. 
    Focus on empowering female representation in STEM roles.
    
    Current story theme: ${storyTheme}
    
    Story Guidelines:
    - Keep language simple and engaging for children
    - Limit story content to EXACTLY 3-4 sentences maximum
    - Include educational STEM concepts naturally
    - Always provide exactly 2 multiple choice options for story progression
    - Keep choice text SHORT - maximum 4-5 words per choice
    - Make choices clear and actionable for young users
    - Maintain a positive, encouraging tone
    - Ensure content is safe and appropriate
    - Focus on problem-solving and curiosity
    - For space stories: include astronomy, physics, and space travel concepts
    - For robot stories: include engineering, programming, and mechanical concepts
    
    Current context: ${JSON.stringify(context)}
    
    IMPORTANT: Respond with ONLY valid JSON. No extra text, no formatting, no code blocks.
    
    Generate a story response in this EXACT JSON format:
    {
      "content": "Story text in 3-4 sentences only",
      "choices": [
        {"id": "choice1", "text": "Short choice (4-5 words max)", "action": "action1"},
        {"id": "choice2", "text": "Short choice (4-5 words max)", "action": "action2"}
      ],
      "stemConcept": "One sentence STEM concept explanation",
      "type": "story"
    }`;

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
                generationConfig: {
                    temperature: 0.5, // Lower temperature for more consistent format
                    topK: 20,
                    topP: 0.8,
                    maxOutputTokens: 500, // Reduced to encourage shorter responses
                },
                safetySettings: [
                    {
                        category: "HARM_CATEGORY_HARASSMENT",
                        threshold: "BLOCK_MEDIUM_AND_ABOVE"
                    },
                    {
                        category: "HARM_CATEGORY_HATE_SPEECH",
                        threshold: "BLOCK_MEDIUM_AND_ABOVE"
                    },
                    {
                        category: "HARM_CATEGORY_SEXUALLY_EXPLICIT",
                        threshold: "BLOCK_MEDIUM_AND_ABOVE"
                    },
                    {
                        category: "HARM_CATEGORY_DANGEROUS_CONTENT",
                        threshold: "BLOCK_MEDIUM_AND_ABOVE"
                    }
                ]
            },
            {
                headers: {
                    'Content-Type': 'application/json',
                },
            }
        );

        const generatedText = response.data.candidates[0].content.parts[0].text;

        let cleanedText = generatedText.trim();

        cleanedText = cleanedText.replace(/```json\s*/g, '');
        cleanedText = cleanedText.replace(/```\s*/g, '');
        cleanedText = cleanedText.replace(/^\s*```[\s\S]*?\n/, '');
        cleanedText = cleanedText.replace(/\n```\s*$/, '');

        const firstBrace = cleanedText.indexOf('{');
        const lastBrace = cleanedText.lastIndexOf('}');

        if (firstBrace !== -1 && lastBrace !== -1 && lastBrace > firstBrace) {
            cleanedText = cleanedText.substring(firstBrace, lastBrace + 1);
        }

        try {
            const parsedContent = JSON.parse(cleanedText);

            if (!parsedContent.content || !parsedContent.choices || !Array.isArray(parsedContent.choices)) {
                throw new Error('Invalid AI response structure');
            }

            const validChoices = parsedContent.choices.map((choice, index) => ({
                id: choice.id || `choice${index + 1}`,
                text: choice.text || `Choice ${index + 1}`,
                action: choice.action || `action${index + 1}`
            }));

            return {
                id: `generated_${Date.now()}`,
                type: parsedContent.type || 'story',
                content: parsedContent.content,
                choices: validChoices,
                stemConcept: parsedContent.stemConcept || 'Keep exploring to learn more!'
            };
        } catch (parseError) {
            console.warn('JSON parsing failed, using fallback:', parseError);
            // backup story 
            return {
                id: `generated_${Date.now()}`,
                type: 'story',
                content: cleanedText.length > 50 ? cleanedText.substring(0, 200) + '...' : cleanedText,
                choices: [
                    { id: 'continue', text: 'Continue adventure', action: 'continue' },
                    { id: 'explore', text: 'Explore more', action: 'explore' }
                ],
                stemConcept: 'Every adventure teaches us something new!'
            };
        }
    } catch (error) {
        console.error('Error generating story content:', error);
        throw new Error('Failed to generate story content. Please try again.');
    }
};

// backup story
export const getStoryNode = (nodeId, context = {}) => {
    const storyType = context.storyType || 'space';

    if (storyType === 'space') {
        return getSpaceStoryNode(nodeId, context);
    } else if (storyType === 'robot') {
        return getRobotStoryNode(nodeId, context);
    }

    return null;
};

const getSpaceStoryNode = (nodeId, context = {}) => {
    const storyNodes = {
        launch: {
            id: 'launch',
            type: 'story',
            content: "3... 2... 1... BLAST OFF! 🚀 The Star Explorer rockets into space with a tremendous roar. As we leave Earth's atmosphere, you see the beautiful blue planet getting smaller below us. Suddenly, our ship's computer beeps with an important message!",
            choices: [
                { id: 'check_message', text: 'Check the computer message', action: 'computer_message' },
                { id: 'look_outside', text: 'Look out the window at space', action: 'space_view' }
            ],
            stemConcept: 'Rocket propulsion works by Newton\'s third law - for every action, there\'s an equal and opposite reaction!'
        },
        info: {
            id: 'info',
            type: 'story',
            content: "Great question! Our mission is to explore the Kepler system and search for planets that might support life. We'll use our special telescopes and scientific instruments to study different worlds. As a space cadet, you'll help me make important decisions about our journey!",
            choices: [
                { id: 'ready_launch', text: 'I\'m ready! Let\'s launch!', action: 'launch' },
                { id: 'learn_tools', text: 'Tell me about our scientific tools', action: 'tools_info' }
            ],
            stemConcept: 'Astronomers use telescopes to study distant objects in space and learn about their composition and properties.'
        },
        computer_message: {
            id: 'computer_message',
            type: 'challenge',
            content: "The computer shows a navigation puzzle! We need to calculate our trajectory to reach the Kepler system. The distance is 1,200 light-years, and our ship travels at 0.1 light-years per year. How long will our journey take?",
            choices: [
                { id: 'answer_12000', text: '12,000 years', action: 'correct_math' },
                { id: 'answer_120', text: '120 years', action: 'incorrect_math' },
                { id: 'answer_1200', text: '1,200 years', action: 'incorrect_math' }
            ],
            stemConcept: 'Division helps us solve real problems! Distance ÷ Speed = Time'
        },
        space_view: {
            id: 'space_view',
            type: 'story',
            content: "Wow! The view is breathtaking! You see countless stars twinkling like diamonds, colorful nebulae swirling in the distance, and what looks like a planet with beautiful rings around it. This must be Saturn! Captain Luna points to different constellations and explains how astronauts use stars for navigation.",
            choices: [
                { id: 'study_saturn', text: 'Learn more about Saturn', action: 'saturn_info' },
                { id: 'check_instruments', text: 'Use our scientific instruments', action: 'instruments' }
            ],
            stemConcept: 'Stars have been used for navigation for thousands of years because they appear in predictable patterns!'
        },
        correct_math: {
            id: 'correct_math',
            type: 'story',
            content: "Excellent work, space cadet! 🎉 You solved it perfectly! 1,200 ÷ 0.1 = 12,000 years. Captain Luna is impressed with your math skills. 'With calculations like that, you'll make a great space navigator!' she says. Our ship's computer confirms the trajectory and we're ready for the next phase of our mission.",
            choices: [
                { id: 'next_mission', text: 'Continue to the next mission phase', action: 'planet_discovery' },
                { id: 'learn_more_math', text: 'Learn about space mathematics', action: 'space_math' }
            ],
            stemConcept: 'Mathematics is essential for space travel - from calculating distances to planning fuel consumption!'
        },
        incorrect_math: {
            id: 'incorrect_math',
            type: 'story',
            content: "Not quite right, but that's okay! Learning is part of every space mission. Captain Luna explains: 'Remember, we divide the distance by the speed: 1,200 ÷ 0.1 = 12,000 years. Don't worry, in real space travel we go much faster!' Let's try another challenge.",
            choices: [
                { id: 'try_again', text: 'Try another math problem', action: 'math_practice' },
                { id: 'continue_story', text: 'Continue the adventure', action: 'planet_discovery' }
            ],
            stemConcept: 'Making mistakes is how we learn! Every astronaut practices math problems before their missions.'
        },
        tools_info: {
            id: 'tools_info',
            type: 'story',
            content: "Great question! Our spaceship has amazing scientific tools: a powerful telescope to see distant galaxies, spectrometers to analyze what planets are made of, and computer systems that can process huge amounts of data. We also have communication equipment to talk to Earth!",
            choices: [
                { id: 'use_telescope', text: 'Use the telescope first', action: 'telescope_discovery' },
                { id: 'ready_launch', text: 'I\'m ready to launch now!', action: 'launch' }
            ],
            stemConcept: 'Scientists use specialized tools to make discoveries that would be impossible with just our eyes!'
        }
    };

    return storyNodes[nodeId] || null;
};