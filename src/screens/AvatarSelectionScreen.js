import React, { useState } from 'react';
import { SafeAreaView, KeyboardAvoidingView, Platform, View, StyleSheet, ScrollView, TouchableOpacity, Image } from 'react-native';
import { Button, Card, Text, TextInput } from 'react-native-paper';
import { useNavigation, useRoute } from '@react-navigation/native';
import { useDispatch } from 'react-redux';
import { setAvatar, setName, setAge } from '../store/userSlice';
import { theme, spacing, typography } from '../styles/theme';

const AvatarSelectionScreen = () => {
    const navigation = useNavigation();
    const route = useRoute();
    const dispatch = useDispatch();

    const storyType = route.params?.storyType || 'space';
    const [selectedAvatar, setSelectedAvatarState] = useState(null);
    const [userName, setUserName] = useState('');
    const [userAge, setUserAge] = useState('');

    const getAvatars = () => {
        if (storyType === 'space') {
            return [
                {
                    id: 'astronaut1',
                    name: 'Captain Star',
                    image: require('../../assets/Astronaut.png'),
                    description: 'Brave space explorer'
                },
                {
                    id: 'scientist1',
                    name: 'Dr. Galaxy',
                    image: require('../../assets/LabGirl.png'),
                    description: 'Brilliant astrophysicist'
                },
                {
                    id: 'engineer1',
                    name: 'Engineer Nova',
                    image: require('../../assets/Engineer.png'),
                    description: 'Space systems engineer'
                },
                {
                    id: 'pilot1',
                    name: 'Pilot Comet',
                    image: require('../../assets/Pilot.png'),
                    description: 'Skilled space pilot'
                },
            ];
        }
        return [];
    };

    const avatars = getAvatars();

    const getStoryTitle = () => {
        if (storyType === 'space') {
            return 'Create Your Space Explorer';
        } else if (storyType === 'robot') {
            return 'Create Your Robot Engineer';
        }
        return 'Create Your Character';
    };

    const getStoryDescription = () => {
        if (storyType === 'space') {
            return 'Ready to explore the galaxy and discover new worlds?';
        } else if (storyType === 'robot') {
            return 'Ready to fix robots and solve engineering challenges?';
        }
        return 'Ready for your STEM adventure?';
    };

    const handleAvatarSelect = (avatar) => {
        setSelectedAvatarState(avatar);
    };

    const handleContinue = () => {
        if (selectedAvatar && userName.trim() && userAge) {
            dispatch(setAvatar(selectedAvatar));
            dispatch(setName(userName.trim()));
            dispatch(setAge(parseInt(userAge)));
            navigation.navigate('Story', { storyType });
        }
    };

    const isFormValid = selectedAvatar && userName.trim() && userAge && parseInt(userAge) >= 6 && parseInt(userAge) <= 14;

    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: theme.colors.background }}>
            <KeyboardAvoidingView
                style={{ flex: 1 }}
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                keyboardVerticalOffset={80}
            >
                <ScrollView
                    style={styles.container}
                    contentContainerStyle={[styles.scrollContent, { paddingBottom: 200 }]}
                    showsVerticalScrollIndicator={false}
                    keyboardShouldPersistTaps="handled"
                >
                    <View style={styles.content}>
                        <Text style={styles.title}>{getStoryTitle()}</Text>
                        <Text style={styles.subtitle}>{getStoryDescription()}</Text>

                        <View style={styles.section}>
                            <Text style={styles.sectionTitle}>What's your name?</Text>
                            <TextInput
                                label="Your name"
                                value={userName}
                                onChangeText={setUserName}
                                style={styles.textInput}
                                mode="outlined"
                                placeholder="Enter your name"
                            />
                        </View>

                        <View style={styles.section}>
                            <Text style={styles.sectionTitle}>How old are you?</Text>
                            <TextInput
                                label="Your age"
                                value={userAge}
                                onChangeText={setUserAge}
                                style={styles.textInput}
                                mode="outlined"
                                keyboardType="numeric"
                                placeholder="Enter your age"
                            />
                        </View>

                        <View style={styles.section}>
                            <Text style={styles.sectionTitle}>Choose your avatar:</Text>
                            <View style={styles.avatarGrid}>
                                {avatars.map((avatar) => (
                                    <TouchableOpacity
                                        key={avatar.id}
                                        onPress={() => handleAvatarSelect(avatar)}
                                        style={[
                                            styles.avatarCard,
                                            selectedAvatar?.id === avatar.id && styles.selectedAvatar
                                        ]}
                                    >
                                        <Card style={styles.card}>
                                            <Card.Content style={styles.cardContent}>
                                                <Image source={avatar.image} style={styles.avatarImage} />
                                                <Text style={styles.avatarName}>{avatar.name}</Text>
                                                <Text style={styles.avatarDescription}>{avatar.description}</Text>
                                            </Card.Content>
                                        </Card>
                                    </TouchableOpacity>
                                ))}
                            </View>
                        </View>

                        {selectedAvatar && (
                            <Card style={styles.previewCard}>
                                <Card.Content style={styles.previewContent}>
                                    <Text style={styles.previewTitle}>
                                        {storyType === 'space' ? 'Your Space Explorer' : 'Your Robot Engineer'}
                                    </Text>
                                    <View style={styles.previewDetails}>
                                        <Image source={selectedAvatar.image} style={styles.previewImage} />
                                        <View style={styles.previewTextContainer}>
                                            <Text style={styles.previewName}>
                                                {userName || 'Explorer'}
                                            </Text>
                                            <Text style={styles.previewRole}>
                                                Playing as {selectedAvatar.name}
                                            </Text>
                                        </View>
                                    </View>
                                </Card.Content>
                            </Card>
                        )}

                        <Button
                            mode="contained"
                            onPress={handleContinue}
                            disabled={!isFormValid}
                            style={[styles.continueButton, !isFormValid && styles.disabledButton]}
                            contentStyle={styles.buttonContent}
                        >
                            {storyType === 'space' ? 'Begin Space Mission' : 'Start Robot Adventure'}
                        </Button>
                    </View>
                </ScrollView>
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: theme.colors.background,
    },
    scrollContent: {
        flexGrow: 1,
        paddingBottom: 150,
    },
    content: {
        padding: spacing.lg,
    },
    title: {
        ...typography.h2,
        color: theme.colors.primary,
        textAlign: 'center',
        marginBottom: spacing.xl,
    },
    subtitle: {
        ...typography.body,
        color: theme.colors.text,
        textAlign: 'center',
        marginBottom: spacing.xl,
    },
    section: {
        marginBottom: spacing.xl,
    },
    sectionTitle: {
        ...typography.h3,
        color: theme.colors.text,
        marginBottom: spacing.md,
    },
    textInput: {
        backgroundColor: theme.colors.surface,
    },
    avatarGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
    },
    avatarCard: {
        width: '48%',
        marginBottom: spacing.md,
    },
    selectedAvatar: {
        transform: [{ scale: 1.05 }],
    },
    card: {
        elevation: 3,
    },
    cardContent: {
        alignItems: 'center',
        padding: spacing.md,
    },
    avatarEmoji: {
        fontSize: 40,
        marginBottom: spacing.sm,
    },
    avatarImage: {
        width: 60,
        height: 60,
        resizeMode: 'contain',
        marginBottom: spacing.sm,
    },
    avatarName: {
        ...typography.body,
        fontWeight: 'bold',
        color: theme.colors.primary,
        textAlign: 'center',
        marginBottom: spacing.xs,
    },
    avatarDescription: {
        ...typography.caption,
        color: theme.colors.placeholder,
        textAlign: 'center',
    },
    previewCard: {
        backgroundColor: theme.colors.accent,
        marginBottom: spacing.lg,
        elevation: 4,
    },
    previewContent: {
        padding: spacing.md,
    },
    previewTitle: {
        ...typography.body,
        color: 'white',
        textAlign: 'center',
        fontWeight: 'bold',
        marginBottom: spacing.sm,
    },
    previewDetails: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
    },
    previewEmoji: {
        fontSize: 32,
        marginRight: spacing.md,
    },
    previewImage: {
        width: 50,
        height: 50,
        resizeMode: 'contain',
        marginRight: spacing.md,
    },
    previewTextContainer: {
        flex: 1,
        alignItems: 'flex-start',
    },
    previewName: {
        ...typography.body,
        color: 'white',
        fontWeight: 'bold',
        fontSize: 18,
    },
    previewRole: {
        ...typography.caption,
        color: 'rgba(255, 255, 255, 0.9)',
        fontSize: 14,
        marginTop: 2,
    },
    continueButton: {
        backgroundColor: theme.colors.primary,
        marginTop: spacing.lg,
    },
    disabledButton: {
        backgroundColor: theme.colors.placeholder,
    },
    buttonContent: {
        paddingVertical: spacing.sm,
    },
});
export default AvatarSelectionScreen;