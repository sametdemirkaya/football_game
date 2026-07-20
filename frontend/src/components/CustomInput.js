import React, { useState } from 'react';
import { TextInput, StyleSheet, View } from 'react-native';

export default function CustomInput({ placeholder, value, onChangeText, style, ...props }) {
  const [isFocused, setIsFocused] = useState(false);

  return (
    <View style={style}>
      <TextInput
        style={[
          styles.input,
          isFocused && styles.inputFocused
        ]}
        placeholder={placeholder}
        placeholderTextColor="#9CA3AF"
        value={value}
        onChangeText={onChangeText}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        {...props}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  input: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1.5,
    borderColor: '#E5E7EB', // Açık gri sınır çizgisi
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontSize: 16,
    color: '#1F2937', // Koyu gri metin rengi
  },
  inputFocused: {
    borderColor: '#1E3A8A', // Odaklanıldığında şık lacivert vurgu
    shadowColor: '#1E3A8A',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  }
});
