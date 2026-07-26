import React, { useState } from 'react';
import { View, Text, StyleSheet, SafeAreaView, KeyboardAvoidingView, Platform, TouchableWithoutFeedback, Keyboard, ScrollView } from 'react-native';
import PrimaryButton from '../components/PrimaryButton';
import CustomInput from '../components/CustomInput';
import SurfaceCard from '../components/SurfaceCard';
import { theme } from '../theme';

export default function PlayerSetupScreen({ route, navigation }) {
  const mode = route.params?.mode || 'multi';

  const [player1, setPlayer1] = useState('');
  const [player2, setPlayer2] = useState('');

  const handleNext = () => {
    navigation.navigate('Difficulty', { mode, player1, player2 });
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        style={styles.keyboardView}
        behavior="padding"
        keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 100}
      >
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <ScrollView contentContainerStyle={styles.scrollContainer} keyboardShouldPersistTaps="handled">

            <Text style={styles.title}>OYUNCULARI BELİRLE</Text>

            <SurfaceCard style={styles.card}>
              {mode === 'single' ? (
                <CustomInput
                  label="Oyuncu İsmi"
                  placeholder="Örn: Samet"
                  value={player1}
                  onChangeText={setPlayer1}
                />
              ) : (
                <>
                  <CustomInput
                    label="1. Oyuncu"
                    placeholder="Örn: Samet"
                    value={player1}
                    onChangeText={setPlayer1}
                  />
                  <CustomInput
                    label="2. Oyuncu"
                    placeholder="Örn: Furkan"
                    value={player2}
                    onChangeText={setPlayer2}
                  />
                </>
              )}
            </SurfaceCard>

            <View style={styles.buttonContainer}>
              <PrimaryButton
                title="İLERİ"
                onPress={handleNext}
                disabled={mode === 'single' ? !player1.trim() : (!player1.trim() || !player2.trim())}
              />
            </View>

          </ScrollView>
        </TouchableWithoutFeedback>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  keyboardView: {
    flex: 1,
  },
  scrollContainer: {
    flexGrow: 1,
    justifyContent: 'center',
    paddingHorizontal: theme.spacing.lg,
  },
  title: {
    fontFamily: theme.typography.fontFamily.heading,
    fontSize: theme.typography.sizes.xxl,
    color: theme.colors.primary,
    textAlign: 'center',
    marginBottom: theme.spacing.xl,
    letterSpacing: 1.5,
    textShadowColor: 'rgba(0, 0, 0, 0.5)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },
  card: {
    marginBottom: theme.spacing.xl,
    paddingVertical: theme.spacing.xl,
  },
  buttonContainer: {
    width: '100%',
    marginTop: theme.spacing.lg,
  }
});
