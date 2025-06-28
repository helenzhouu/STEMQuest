import React, { useEffect, useState, useRef } from 'react';
import {
    View,
    StyleSheet,
    ScrollView,
    Alert,
    Image,
    Dimensions,
    Animated,
    TouchableOpacity,
    StatusBar
} from 'react-native';
import { Button, Text, ActivityIndicator, Chip } from 'react-native-paper';
import { useSelector, useDispatch } from 'react-redux';
import { startStory, makeChoice, generateStoryBranch } from '../store/storySlice';
import { getStoryNode } from '../services/geminiService';
import { theme, spacing, typography } from '../styles/theme';
import { useRoute, useNavigation } from '@react-navigation/native';
import { LinearGradient } from 'expo-linear-gradient';

const { width, height } = Dimensions.get('window');

const StoryScreen = () => {
    const dispatch = useDispatch();
    const route = useRoute();
    const navigation = useNavigation();
    const { user, story } = useSelector((state) => state);
    const [useAI, setUseAI] = useState(false);
    const [currentImage, setCurrentImage] = useState(null);
    const [isGeneratingStory, setIsGeneratingStory] = useState(false);
    const [isFirstSlide, setIsFirstSlide] = useState(true);

    const fadeAnim = useRef(new Animated.Value(1)).current;
    const slideAnim = useRef(new Animated.Value(0)).current;

    const storyType = route.params?.storyType || 'space';

    useEffect(() => {
        if (!story.currentStory) {
            dispatch(startStory(storyType));
        }
    }, [dispatch, story.currentStory, storyType]);

    useEffect(() => {
        if (
            story.currentNode &&
            storyType === 'space' &&
            story.currentNode.id === 'start'
        ) {
            setCurrentImage(require('../../assets/space_avatar.png'));
            setIsFirstSlide(true);
        } else if (story.currentNode) {
            setIsFirstSlide(false);
            setCurrentImage(require('../../assets/space_background.png'));
        }
    }, [story.currentNode]);

    const performPageTurn = () => {
        Animated.parallel([
            Animated.timing(fadeAnim, {
                toValue: 0,
                duration: 300,
                useNativeDriver: true,
            }),
            Animated.timing(slideAnim, {
                toValue: -50,
                duration: 300,
                useNativeDriver: true,
            })
        ]).start(() => {
            fadeAnim.setValue(1);
            slideAnim.setValue(0);
        });
    };

    const handleChoice = async (choice) => {
        try {
            setIsGeneratingStory(true);

            const minLoadingTime = useAI ? 1500 : 800;
            const startTime = Date.now();

            performPageTurn();
            if (useAI) {
                const context = {
                    userChoice: choice,
                    storyHistory: story.storyHistory,
                    userName: user.name,
                    userAvatar: user.selectedAvatar,
                    currentStory: story.currentStory,
                    storyType: storyType
                };

                const storyTheme = storyType === 'space' ? 'space exploration' : 'robot repair and engineering';
                const prompt = `The user chose: "${choice.text}". Continue the ${storyTheme} story naturally, incorporating this choice and maintaining the educational STEM theme.`;

                dispatch(generateStoryBranch({ prompt, context }));

                const elapsedTime = Date.now() - startTime;
                if (elapsedTime < minLoadingTime) {
                    await new Promise(resolve => setTimeout(resolve, minLoadingTime - elapsedTime));
                }
            } else {
                const nextNode = getStoryNode(choice.action, {
                    userName: user.name,
                    userAvatar: user.selectedAvatar,
                    storyType: storyType
                });

                if (nextNode) {
                    dispatch(makeChoice({ choiceId: choice.id, nodeData: nextNode }));
                } else {
                    const fallbackNode = {
                        id: `fallback_${Date.now()}`,
                        type: 'story',
                        content: `Great choice, ${user.name}! Your adventure as ${user.selectedAvatar?.name} continues. ${storyType === 'space' ? 'The universe is full of mysteries waiting to be discovered!' : 'There are many engineering challenges to solve!'}`,
                        choices: [
                            { id: 'continue', text: 'Continue exploring', action: 'explore' },
                            { id: 'new_mission', text: 'Start a new mission', action: 'restart' }
                        ]
                    };
                    dispatch(makeChoice({ choiceId: choice.id, nodeData: fallbackNode }));
                }

                const elapsedTime = Date.now() - startTime;
                if (elapsedTime < minLoadingTime) {
                    await new Promise(resolve => setTimeout(resolve, minLoadingTime - elapsedTime));
                }
            }

            if (isFirstSlide) {
                setIsFirstSlide(false);
            }

        } catch (error) {
            Alert.alert('Adventure Pause', 'Something went wrong, but your adventure continues! Try again.');
            console.error('Error handling choice:', error);
        } finally {
            setIsGeneratingStory(false);
        }
    };

    const handleRestart = () => {
        const storyName = storyType === 'space' ? 'space mission' : 'robot adventure';
        Alert.alert(
            'New Adventure?',
            `Are you sure you want to start a new ${storyName}?`,
            [
                { text: 'Cancel', style: 'cancel' },
                {
                    text: 'Yes', onPress: () => {
                        dispatch(startStory(storyType));
                        setCurrentImage(null);
                    }
                },
            ]
        );
    };

    const handleGoBack = () => {
        Alert.alert(
            'Leave Adventure?',
            'Are you sure you want to go back to avatar selection? Your current progress will be lost.',
            [
                { text: 'Cancel', style: 'cancel' },
                {
                    text: 'Yes, Go Back',
                    onPress: () => navigation.navigate('AvatarSelection')
                },
            ]
        );
    };

    const toggleAI = () => {
        setUseAI(!useAI);
        Alert.alert(
            'AI Mode ' + (!useAI ? 'Enabled' : 'Disabled'),
            !useAI
                ? 'AI will now generate unique story paths! Make sure to set your EXPO_PUBLIC_GEMINI_API_KEY in your environment.'
                : 'Using predefined story paths.'
        );
    };

    if (!story.currentNode) {
        return (
            <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color={theme.colors.primary} />
                <Text style={styles.loadingText}>
                    {storyType === 'space' ? 'Preparing your space adventure...' : 'Preparing your robot adventure...'}
                </Text>
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <StatusBar barStyle="light-content" />

            {/* Background Image */}
            {currentImage && (
                <Image
                    source={currentImage}
                    style={styles.backgroundImage}
                    resizeMode="cover"
                />
            )}

            {/* Gradient overlay for better text readability */}
            <LinearGradient
                colors={['transparent', 'rgba(0,0,0,0.2)', 'rgba(0,0,0,0.6)']}
                style={styles.gradientOverlay}
            />

            {/* Floating controls in top corners */}
            <View style={styles.floatingControls}>
                <TouchableOpacity onPress={handleGoBack} style={styles.floatingButton}>
                    <Text style={styles.floatingButtonText}>←</Text>
                </TouchableOpacity>
                <View style={styles.rightControls}>
                    <TouchableOpacity onPress={toggleAI} style={styles.floatingButton}>
                        <Text style={styles.floatingButtonText}>
                            {useAI ? '🤖' : '📖'}
                        </Text>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={handleRestart} style={styles.floatingButton}>
                        <Text style={styles.floatingButtonText}>🔄</Text>
                    </TouchableOpacity>
                </View>
            </View>

            {/* Story Content Overlay */}
            <Animated.View
                style={[
                    styles.storyContentContainer,
                    {
                        opacity: fadeAnim,
                        transform: [{ translateX: slideAnim }]
                    }
                ]}
            >
                {story.currentNode.type === 'challenge' && (
                    <View style={styles.challengeBadge}>
                        <Text style={styles.challengeText}>🧩 STEM Challenge</Text>
                    </View>
                )}

                <Text style={styles.storyContent}>
                    {story.currentNode.content}
                </Text>

                {story.currentNode.stemConcept && (
                    <View style={styles.stemCard}>
                        <Text style={styles.stemTitle}>💡 Did you know?</Text>
                        <Text style={styles.stemContent}>{story.currentNode.stemConcept}</Text>
                    </View>
                )}
            </Animated.View>

            {/* Loading indicators */}
            {isGeneratingStory && (
                <View style={styles.loadingOverlay}>
                    <Text style={styles.loadingText}>
                        Generating next adventure
                    </Text>
                </View>
            )}

            {/* Story Choices at Bottom */}
            {story.currentNode.choices && !isGeneratingStory && (
                <View style={styles.choicesContainer}>
                    <Text style={styles.choicesTitle}>What do you choose?</Text>
                    <ScrollView
                        horizontal
                        showsHorizontalScrollIndicator={false}
                        contentContainerStyle={styles.choicesScrollView}
                    >
                        {story.currentNode.choices.map((choice, index) => (
                            <TouchableOpacity
                                key={choice.id}
                                style={[
                                    styles.choiceButton,
                                    { backgroundColor: getChoiceColor(index) }
                                ]}
                                onPress={() => handleChoice(choice)}
                                activeOpacity={0.8}
                            >
                                <Text style={styles.choiceButtonText}>{choice.text}</Text>
                            </TouchableOpacity>
                        ))}
                    </ScrollView>
                </View>
            )}
        </View>
    );
};

const getChoiceColor = (index) => {
    const colors = [
        'rgba(102, 126, 234, 0.9)',
        'rgba(118, 75, 162, 0.9)',
        'rgba(76, 175, 80, 0.9)',
        'rgba(255, 152, 0, 0.9)',
        'rgba(33, 150, 243, 0.9)',
        'rgba(156, 39, 176, 0.9)'
    ];
    return colors[index % colors.length];
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: theme.colors.background,
    },
    backgroundImage: {
        position: 'absolute',
        width: width,
        height: height,
        top: 0,
        left: 0,
    },
    gradientOverlay: {
        position: 'absolute',
        width: width,
        height: height,
        top: 0,
        left: 0,
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: theme.colors.background,
    },
    floatingControls: {
        position: 'absolute',
        top: 100,
        left: 0,
        right: 0,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: spacing.lg,
        zIndex: 100,
    },
    rightControls: {
        flexDirection: 'row',
        gap: spacing.sm,
    },
    floatingButton: {
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        width: 50,
        height: 50,
        borderRadius: 25,
        justifyContent: 'center',
        alignItems: 'center',
        elevation: 5,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
    },
    floatingButtonText: {
        fontSize: 20,
        color: 'white',
    },
    storyContentContainer: {
        flex: 1,
        paddingHorizontal: spacing.lg,
        paddingTop: 160,
        justifyContent: 'center',
        paddingBottom: 150,
    },
    challengeBadge: {
        backgroundColor: 'rgba(255, 193, 7, 0.9)',
        padding: spacing.sm,
        borderRadius: 20,
        marginBottom: spacing.md,
        alignSelf: 'flex-start',
    },
    challengeText: {
        color: 'white',
        fontWeight: 'bold',
        fontSize: 12,
    },
    storyContent: {
        ...typography.h4,
        color: 'white',
        lineHeight: 28,
        textAlign: 'center',
        marginBottom: spacing.lg,
        textShadowColor: 'rgba(0, 0, 0, 0.8)',
        textShadowOffset: { width: 1, height: 1 },
        textShadowRadius: 3,
        backgroundColor: 'rgba(0, 0, 0, 0.3)',
        padding: spacing.lg,
        borderRadius: 15,
    },
    stemCard: {
        backgroundColor: 'rgba(76, 175, 80, 0.8)',
        padding: spacing.md,
        borderRadius: 15,
        marginTop: spacing.md,
    },
    stemTitle: {
        ...typography.body,
        fontWeight: 'bold',
        color: 'white',
        marginBottom: spacing.xs,
        textShadowColor: 'rgba(0, 0, 0, 0.5)',
        textShadowOffset: { width: 1, height: 1 },
        textShadowRadius: 2,
    },
    stemContent: {
        ...typography.caption,
        color: 'white',
        lineHeight: 18,
        textShadowColor: 'rgba(0, 0, 0, 0.5)',
        textShadowOffset: { width: 1, height: 1 },
        textShadowRadius: 2,
    },
    loadingOverlay: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.3)',
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 1000,
    },
    loadingText: {
        color: 'white',
        fontSize: 24,
        fontWeight: 'bold',
        textAlign: 'center',
        textShadowColor: 'rgba(0, 0, 0, 0.8)',
        textShadowOffset: { width: 2, height: 2 },
        textShadowRadius: 4,
    },
    choicesContainer: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.85)',
        paddingTop: spacing.lg,
        paddingHorizontal: spacing.md,
        paddingBottom: 45,
        borderTopLeftRadius: 25,
        borderTopRightRadius: 25,
        minHeight: 150, // Reduced from 180
        maxHeight: 240, // Reduced from 280
        shadowColor: '#000',
        shadowOffset: { width: 0, height: -3 },
        shadowOpacity: 0.3,
        shadowRadius: 4,
        elevation: 8,
    },
    choicesTitle: {
        ...typography.h3,
        color: 'white',
        textAlign: 'center',
        marginBottom: spacing.md,
        fontSize: 18,
        fontWeight: '600',
        textShadowColor: 'rgba(0, 0, 0, 0.8)',
        textShadowOffset: { width: 1, height: 1 },
        textShadowRadius: 3,
    },
    choicesScrollView: {
        paddingHorizontal: spacing.xs,
        paddingVertical: spacing.sm,
        flexGrow: 0,
    },
    choiceButton: {
        paddingVertical: spacing.sm,
        paddingHorizontal: spacing.md,
        borderRadius: 15,
        marginHorizontal: spacing.xs,
        marginVertical: spacing.xs,
        minWidth: 90,
        maxWidth: 160,
        minHeight: 45,
        alignItems: 'center',
        justifyContent: 'center',
        elevation: 5,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.3,
        shadowRadius: 3,
        borderWidth: 1.5,
        borderColor: 'rgba(255, 255, 255, 0.3)',
    },
    choiceButtonText: {
        color: 'white',
        fontSize: 13,
        fontWeight: '700',
        textAlign: 'center',
        lineHeight: 16,
        textShadowColor: 'rgba(0, 0, 0, 0.8)',
        textShadowOffset: { width: 1, height: 1 },
        textShadowRadius: 2,
        fontFamily: 'Fredoka_600SemiBold',
        flexWrap: 'wrap',
    },
});

export default StoryScreen;
