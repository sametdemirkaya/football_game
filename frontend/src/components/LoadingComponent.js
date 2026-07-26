import React from 'react';
import { View, ActivityIndicator, StyleSheet, Text } from 'react-native';
import { theme } from '../theme';

export default function LoadingComponent({ message = 'Yükleniyor...', fullScreen = false }) {
  return (
    <View style={[styles.container, fullScreen && styles.fullScreen]}>
      <ActivityIndicator size="large" color={theme.colors.primary} />
      {message ? <Text style={styles.text}>{message}</Text> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
    padding: theme.spacing.lg,
  },
  fullScreen: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  text: {
    marginTop: theme.spacing.md,
    color: theme.colors.textMuted,
    fontFamily: theme.typography.fontFamily.body,
    fontSize: theme.typography.sizes.md,
  }
});
