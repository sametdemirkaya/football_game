import React from 'react';
import { TouchableOpacity, Text, StyleSheet } from 'react-native';
import * as Haptics from 'expo-haptics';
import { theme } from '../theme';

export default function PrimaryButton({ title, onPress, style, textStyle, type = 'primary', disabled = false }) {
  const handlePress = () => {
    if (disabled) return;
    
    // Haptic feedback for premium feel
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    
    if (onPress) {
      onPress();
    }
  };

  const getBackgroundColor = () => {
    if (disabled) return theme.colors.surfaceSolid;
    if (type === 'secondary') return theme.colors.surface;
    if (type === 'danger') return theme.colors.error;
    if (type === 'info') return theme.colors.secondary; // Mavi renk
    return theme.colors.primary;
  };

  const getTextColor = () => {
    if (disabled) return theme.colors.textMuted;
    if (type === 'primary') return theme.colors.background; // Koyu renk yazı sadece sarı butonda
    return theme.colors.textLight; // Diğer tüm butonlarda açık renk yazı
  };

  return (
    <TouchableOpacity
      style={[
        styles.button,
        { backgroundColor: getBackgroundColor() },
        style
      ]}
      onPress={handlePress}
      activeOpacity={0.7}
      disabled={disabled}
    >
      <Text style={[
        styles.text,
        { color: getTextColor() },
        textStyle
      ]}>
        {title}
      </Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    width: '100%',
    height: 56,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: theme.borderRadius.lg,
    marginVertical: theme.spacing.sm,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 5,
  },
  text: {
    fontFamily: theme.typography.fontFamily.heading,
    fontSize: theme.typography.sizes.lg,
    textTransform: 'uppercase',
    letterSpacing: 1,
  }
});
