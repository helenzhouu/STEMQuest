// screens/HomeScreen.js
import React from 'react';
import {
    View,
    StyleSheet,
    ScrollView,
    Image,
    TouchableOpacity,
    SafeAreaView,
} from 'react-native';
import { Text } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';
import { spacing, fonts, typography } from '../styles/theme';

const stories = [
    {
        id: 'space',
        title: 'Space Explorers',
        img: require('../../assets/icon.png'), // Temporary placeholder
    },
    {
        id: 'robot',
        title: 'Robo Rescue',
        img: require('../../assets/icon.png'), // Temporary placeholder
    },
    {
        id: 'nature1',
        title: 'Math Wizards',
        img: require('../../assets/icon.png'), // Temporary placeholder
    },
    {
        id: 'nature2',
        title: 'Mystery in the Garden',
        img: require('../../assets/icon.png'), // Temporary placeholder
    },
];

export default function HomeScreen() {
    const navigation = useNavigation();
    const startAdventure = storyType =>
        navigation.navigate('AvatarSelection', { storyType });

    return (
        <SafeAreaView style={styles.root}>
            <ScrollView contentContainerStyle={styles.container}>
                <View style={styles.header}>
                    <Text style={styles.title}>STEM Quest</Text>
                    <Text style={styles.subtitle}>
                        Interactive STEM adventures{'\n'}for curious girls to learn and explore Science, Technology, Engineering, and Math
                    </Text>
                </View>
                <View style={styles.storyWrapper}>
                    <Text style={styles.sectionTitle}>Choose your adventure</Text>

                    <View style={styles.storyGrid}>
                        {stories.map(story => (
                            <TouchableOpacity
                                key={story.id}
                                style={styles.tile}
                                onPress={() => startAdventure(story.id)}
                                activeOpacity={0.8}
                            >
                                <View style={styles.tileImageContainer}>
                                    <Image source={story.img} style={styles.tileImg} />
                                </View>
                                <Text style={styles.tileText}>{story.title}</Text>
                            </TouchableOpacity>
                        ))}
                    </View>
                </View>
            </ScrollView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    root: {
        flex: 1,
        backgroundColor: '#4A1A7A'
    },
    container: {
        flex: 1,
        paddingHorizontal: spacing.lg,
        paddingTop: spacing.xl,
        backgroundColor: 'transparent',
    },

    starsContainer: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        zIndex: 0,
    },
    star: {
        position: 'absolute',
        fontSize: 20,
        color: '#FFFFFF',
        opacity: 0.6,
    },
    star1: { top: '15%', left: '10%', fontSize: 16 },
    star2: { top: '25%', right: '15%', fontSize: 12 },
    star3: { top: '35%', left: '5%', fontSize: 14 },
    star4: { top: '45%', right: '8%', fontSize: 18 },
    star5: { top: '55%', left: '12%', fontSize: 12 },
    star6: { top: '65%', right: '20%', fontSize: 16 },
    star7: { top: '75%', left: '8%', fontSize: 14 },
    star8: { top: '85%', right: '12%', fontSize: 12 },

    header: {
        alignItems: 'center',
        marginTop: spacing.xl,
        marginBottom: spacing.xl * 2,
        zIndex: 1,
    },
    title: {
        fontSize: 48,
        fontFamily: fonts.titleBold,
        color: '#FFFFFF',
        textAlign: 'center',
        marginBottom: spacing.md,
    },
    subtitle: {
        fontSize: 18,
        fontFamily: fonts.body,
        color: '#FFFFFF',
        textAlign: 'center',
        lineHeight: 24,
    },

    storyWrapper: {
        flex: 1,
        marginBottom: spacing.xl,
        zIndex: 1,
    },
    sectionTitle: {
        fontSize: 24,
        fontFamily: fonts.title,
        color: '#FFFFFF',
        textAlign: 'center',
        marginBottom: spacing.xl,
    },
    storyGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
        paddingHorizontal: spacing.md,
    },
    tile: {
        width: '47%',
        aspectRatio: 0.85,
        backgroundColor: '#FFFFFF',
        borderRadius: 20,
        padding: spacing.lg,
        marginBottom: spacing.lg,
        alignItems: 'center',
        justifyContent: 'space-between',
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 4,
        },
        shadowOpacity: 0.2,
        shadowRadius: 8,
        elevation: 8,
    },
    tileImageContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        width: '100%',
    },
    tileImg: {
        width: 80,
        height: 80,
        resizeMode: 'contain',
    },
    tileText: {
        fontSize: 16,
        fontFamily: fonts.button,
        color: '#2D1B69',
        textAlign: 'center',
        lineHeight: 20,
        marginTop: spacing.sm,
    },
});
