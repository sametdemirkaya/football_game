import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';

export default function CustomButton({ title, onPress, style, textStyle }) {
  const displayTitle = title.replace('\n', ' ');

  return (
    <TouchableOpacity
      style={[styles.buttonContainer, style]}
      onPress={onPress}
      activeOpacity={0.8}
    >
      <View style={styles.imageWrapper} pointerEvents="none">
        <Image
          source={require('../../assets/button.png')}
          style={styles.buttonImage}
          resizeMode="contain"
        />
      </View>
      <Text style={[styles.text, textStyle]} adjustsFontSizeToFit numberOfLines={1}>{displayTitle}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  buttonContainer: {
    width: '85%',
    height: 60,
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: 12,
    overflow: 'visible',
  },
  imageWrapper: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: -1,
  },
  buttonImage: {
    width: '100%',
    height: 600,
  },
  text: {
    color: '#FFFFFF',
    fontSize: 20,
    fontWeight: 'bold',
    letterSpacing: 1,
    textTransform: 'uppercase',
    textShadowColor: 'rgba(0, 0, 0, 0.7)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
    textAlign: 'center',
    paddingHorizontal: 15,
    marginBottom: 18, // Yazının aşağıda kalma sorununu çözmek için çok daha belirgin şekilde yukarı itildi
  }
});
