import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export default function TacticBoard() {
  return (
    <View style={styles.container}>
      <View style={styles.board}>
        <Text style={styles.text}>Taktik Tahtası Alanı</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  board: {
    width: '100%',
    height: 300,
    backgroundColor: '#166534', // Koyu yeşil (Saha yeşili)
    borderRadius: 16,
    borderWidth: 2,
    borderColor: '#FFFFFF', // Saha çizgilerini andıran beyaz sınır
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  text: {
    color: '#FFFFFF',
    fontSize: 20,
    fontWeight: 'bold',
    opacity: 0.8, // Yer tutucu görünümü vermek için hafif saydam
  }
});
