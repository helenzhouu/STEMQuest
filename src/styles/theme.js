import { DefaultTheme } from 'react-native-paper';

export const fonts = {
    title: 'Fredoka_400Regular',
    titleBold: 'Fredoka_600SemiBold',
    body: 'Nunito_400Regular',
    bodyBold: 'Nunito_700Bold',
    button: 'Baloo2_500Medium',
    buttonBold: 'Baloo2_700Bold',
};

export const theme = {
    ...DefaultTheme,
    colors: {
        ...DefaultTheme.colors,
        primary: '#6B46C1',
        accent: '#EC4899',
        background: '#F8FAFC',
        surface: '#FFFFFF',
        text: '#1F2937',
        placeholder: '#6B7280',
        backdrop: 'rgba(0, 0, 0, 0.5)',
        space: '#1E1B4B',
        star: '#FCD34D',
        planet: '#10B981',
        rocket: '#EF4444',
        success: '#10B981',
        warning: '#F59E0B',
        error: '#EF4444',
    },
    fonts: {
        ...DefaultTheme.fonts,
        regular: {
            fontFamily: 'System',
            fontWeight: '400',
        },
        medium: {
            fontFamily: 'System',
            fontWeight: '500',
        },
        bold: {
            fontFamily: 'System',
            fontWeight: '700',
        },
    },
    roundness: 12,
};

export const spacing = {
    xs: 4,
    sm: 8,
    md: 16,
    lg: 24,
    xl: 32,
    xxl: 48,
};

export const typography = {
    h1: {
        fontSize: 32,
        fontFamily: fonts.title,
        fontWeight: 'normal',
        lineHeight: 40,
    },
    h2: {
        fontSize: 24,
        fontFamily: fonts.title,
        fontWeight: 'normal',
        lineHeight: 32,
    },
    h3: {
        fontSize: 20,
        fontFamily: fonts.title,
        fontWeight: 'normal',
        lineHeight: 28,
    },
    body: {
        fontSize: 16,
        fontFamily: fonts.body,
        fontWeight: 'normal',
        lineHeight: 24,
    },
    bodyBold: {
        fontSize: 16,
        fontFamily: fonts.bodyBold,
        fontWeight: 'normal',
        lineHeight: 24,
    },
    button: {
        fontSize: 16,
        fontFamily: fonts.button,
        fontWeight: 'normal',
        lineHeight: 20,
    },
    caption: {
        fontSize: 14,
        fontFamily: fonts.body,
        fontWeight: 'normal',
        lineHeight: 20,
    },
};
