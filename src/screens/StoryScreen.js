import React, { useEffect, useState } from 'react';
import {
    View,
    StyleSheet,
    Text,
    ActivityIndicator
} from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import { startStory } from '../store/storySlice';
import { theme, spacing, typography } from '../styles/theme';

const StoryScreen = () => {
    const dispatch = useDispatch();
    const { user, story } = useSelector((state) => state);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        // need to initialize the story
        // dispatch(startStory('space'));
        setIsLoading(false);
    }, [dispatch]);

    if (isLoading) {
        return (
            <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color={theme.colors.primary} />
                <Text style={styles.loadingText}>Loading your adventure...</Text>
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Story Screen</Text>
            {/* Add story */}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: theme.colors.background,
        justifyContent: 'center',
        alignItems: 'center',
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: theme.colors.background,
    },
    loadingText: {
        ...typography.body,
        color: theme.colors.onBackground,
        marginTop: spacing.md,
    },
    title: {
        ...typography.h2,
        color: theme.colors.onBackground,
        textAlign: 'center',
    },
});

export default StoryScreen;
