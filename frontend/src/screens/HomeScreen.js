import React from 'react';
import { View, Text, StyleSheet, SafeAreaView, ImageBackground } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import CustomButton from '../components/CustomButton';

export default function HomeScreen({ navigation }) {
  return (
    <ImageBackground
      source={require('../../assets/background.png')}
      style={styles.backgroundImage}
      resizeMode="cover"
      blurRadius={0}
    >
      <SafeAreaView style={styles.container}>

        {/* Üst Kısım: Sadece Metin Olarak Yeniden Tasarlanan Başlık */}
        <View style={styles.topSection}>
          <View style={styles.titleContainer}>
            <Ionicons name="football" size={32} color="#FFD700" style={styles.icon} />
            <Text style={styles.title} adjustsFontSizeToFit numberOfLines={1}>İSTATİSTİK ARENASI</Text>
            <Ionicons name="football" size={32} color="#FFD700" style={styles.icon} />
          </View>
        </View>

        {/* Alt Kısım: Menü Butonları */}
        <View style={styles.bottomSection}>
          <CustomButton
            title="TEK OYUNCULU"
            onPress={() => navigation.navigate('PlayerSetup', { mode: 'single' })}
          />
          <CustomButton
            title="ÇİFT OYUNCULU"
            onPress={() => navigation.navigate('PlayerSetup', { mode: 'multi' })}
          />
          <CustomButton
            title="AYARLAR"
            onPress={() => navigation.navigate('Settings')}
          />
        </View>

      </SafeAreaView>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  backgroundImage: {
    flex: 1,
    width: '100%',
    height: '100%',
  },
  container: {
    flex: 1,
  },
  topSection: {
    flex: 0.45,
    justifyContent: 'flex-start',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingTop: 70, // Ekranda stadyumun gökyüzü/çatı kısmına şık bir şekilde oturması için
  },
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    // Eskiden olan tüm o kaba lacivert arka plan kutusunu ve sınır çizgilerini SİLDİK.
    // Başlık artık tamamen bağımsız ve havada (stadyum üzerinde) süzülecek.
  },
  icon: {
    marginHorizontal: 8,
    textShadowColor: 'rgba(0, 0, 0, 1)', // İkonların arka planda kaybolmaması için sert siyah gölge
    textShadowOffset: { width: 2, height: 2 },
    textShadowRadius: 4,
  },
  title: {
    flex: 1,
    fontSize: 34, // Çok daha büyük, heybetli bir oyun başlığı boyutu
    fontWeight: '900', // En kalın, spor temasına uygun font ağırlığı
    color: '#FFD700', // Altın Sarısı (Buton çerçevesi ile bütünlük sağlar)
    letterSpacing: 2,
    textAlign: 'center',
    textShadowColor: 'rgba(0, 0, 0, 1)', // Yazının stadyum üzerinde net okunması için çok koyu bir gölge
    textShadowOffset: { width: 3, height: 3 },
    textShadowRadius: 6,
  },
  bottomSection: {
    flex: 0.55,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingBottom: 40,
  }
});
