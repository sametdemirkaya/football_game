import React from 'react';
import { View, StyleSheet } from 'react-native';
import { theme } from '../theme';

export default function SurfaceCard({ children, style }) {
  return (
    <View style={[styles.card, style]}>
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: theme.colors.surface,
    borderRadius: theme.borderRadius.lg,
    padding: theme.spacing.lg,
    marginVertical: theme.spacing.sm,
    // Hafif beyazımsı bir sınır ile glass/premium hissiyatı artırılır
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.05)',
    // Gölgelendirme (Shadow)
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 8, // Android shadow
  }
});
