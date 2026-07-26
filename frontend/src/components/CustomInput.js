import React, { useState } from 'react';
import { TextInput, StyleSheet, View, Text } from 'react-native';
import { theme } from '../theme';

export default function CustomInput({ placeholder, value, onChangeText, style, label, ...props }) {
  const [isFocused, setIsFocused] = useState(false);

  return (
    <View style={[styles.container, style]}>
      {label && <Text style={styles.label}>{label}</Text>}
      <TextInput
        style={[
          styles.input,
          isFocused && styles.inputFocused
        ]}
        placeholder={placeholder}
        placeholderTextColor={theme.colors.textMuted}
        value={value}
        onChangeText={onChangeText}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        selectionColor={theme.colors.primary}
        {...props}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginVertical: theme.spacing.sm,
    width: '100%',
  },
  label: {
    fontFamily: theme.typography.fontFamily.bodyBold,
    color: theme.colors.textLight,
    fontSize: theme.typography.sizes.sm,
    marginBottom: theme.spacing.xs,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  input: {
    backgroundColor: theme.colors.surfaceSolid,
    borderWidth: 1.5,
    borderColor: 'rgba(255, 255, 255, 0.1)', 
    borderRadius: theme.borderRadius.md,
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.md,
    fontSize: theme.typography.sizes.md,
    color: theme.colors.textLight,
    fontFamily: theme.typography.fontFamily.body,
  },
  inputFocused: {
    borderColor: theme.colors.primary, // Focus olduğunda Altın Sarısı çerçeve
    backgroundColor: theme.colors.surface, // Focus olduğunda hafif şeffaflık
    shadowColor: theme.colors.primary,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 4,
  }
});
