import React from 'react';
import { Modal, View, Text, StyleSheet } from 'react-native';
import { theme } from '../theme';
import PrimaryButton from './PrimaryButton';

export default function ErrorModal({ visible, title = 'Hata', message, onClose }) {
  return (
    <Modal
      transparent={true}
      visible={visible}
      animationType="fade"
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <View style={styles.modalCard}>
          <Text style={styles.title}>{title}</Text>
          <Text style={styles.message}>{message}</Text>
          
          <PrimaryButton 
            title="Tamam" 
            onPress={onClose} 
            type="primary" 
            style={styles.button} 
          />
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: theme.spacing.lg,
  },
  modalCard: {
    width: '100%',
    backgroundColor: theme.colors.surfaceSolid,
    borderRadius: theme.borderRadius.xl,
    padding: theme.spacing.xl,
    borderWidth: 1,
    borderColor: theme.colors.error,
    shadowColor: theme.colors.error,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 10,
    alignItems: 'center',
  },
  title: {
    fontFamily: theme.typography.fontFamily.heading,
    fontSize: theme.typography.sizes.xl,
    color: theme.colors.error,
    marginBottom: theme.spacing.md,
    textTransform: 'uppercase',
  },
  message: {
    fontFamily: theme.typography.fontFamily.body,
    fontSize: theme.typography.sizes.md,
    color: theme.colors.textLight,
    textAlign: 'center',
    marginBottom: theme.spacing.lg,
  },
  button: {
    marginTop: theme.spacing.sm,
  }
});
