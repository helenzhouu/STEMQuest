import React from 'react';
import { View, Text, StyleSheet, ImageBackground, TouchableOpacity, Dimensions } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useNavigation } from '@react-navigation/native';
import { theme, spacing, fonts } from '../styles/theme';

const { width, height } = Dimensions.get('window');

export default function StartScreen() {
  const navigation = useNavigation();

  return (
    <View style={styles.container}>
      <ImageBackground
        source={require('../../assets/startscreen.png')}
        style={styles.background}
        resizeMode="cover"
      >
        <LinearGradient
          colors={["rgba(107,70,193,0.2)", "rgba(107,70,193,0.8)", "#1E1B4B"]}
          style={styles.gradient}
        />
        <View style={styles.bottomPanel}>
          <Text style={styles.title}>Discover STEM related stories. Learn and Explore!</Text>
          <View style={styles.underline} />
          <TouchableOpacity style={styles.button} onPress={() => navigation.replace('Home')}>
            <Text style={styles.buttonText}>Discover Now</Text>
          </TouchableOpacity>
        </View>
      </ImageBackground>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  background: {
    flex: 1,
    width: width,
    height: height,
    justifyContent: 'flex-end',
  },
  gradient: {
    ...StyleSheet.absoluteFillObject,
    zIndex: 1,
  },
  bottomPanel: {
    width: '100%',
    backgroundColor: 'rgba(30,27,75,0.95)',
    paddingTop: spacing.xl,
    paddingBottom: spacing.xxl,
    paddingHorizontal: spacing.lg,
    alignItems: 'flex-start',
    zIndex: 2,
  },
  title: {
    color: '#fff',
    fontFamily: fonts.titleBold,
    fontSize: 22,
    marginBottom: spacing.md,
    textAlign: 'left',
    lineHeight: 28,
  },
  underline: {
    width: 40,
    height: 3,
    backgroundColor: theme.colors.primary,
    borderRadius: 2,
    marginBottom: spacing.xl,
  },
  button: {
    marginTop: spacing.xl,
    alignSelf: 'center',
    backgroundColor: '#fff',
    borderRadius: 32,
    paddingVertical: 18,
    paddingHorizontal: 40,
    minWidth: 260,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 4,
  },
  buttonText: {
    color: theme.colors.primary,
    fontFamily: fonts.buttonBold,
    fontSize: 18,
    textAlign: 'center',
  },
});
