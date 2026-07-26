export const theme = {
  colors: {
    background: '#0B132B',       // Gece Mavisi / Lacivert
    surface: 'rgba(28, 37, 65, 0.7)', // Açık Lacivert yarı şeffaf (Kartlar için)
    surfaceSolid: '#1C2541',     // Opak açık lacivert
    primary: '#FBBF24',          // Altın Sarısı
    primaryDark: '#D4AF37',      // Koyu Altın Sarısı (Pressed state vb.)
    secondary: '#3B82F6',        // Neon/Elektrik Mavisi
    error: '#EF4444',            // Kırmızı (Yanlış tahmin)
    success: '#10B981',          // Zümrüt Yeşili (Doğru tahmin)
    textLight: '#F3F4F6',        // Ana Metin rengi (Beyazımsı)
    textMuted: '#9CA3AF',        // Soluk metin rengi
  },
  typography: {
    fontFamily: {
      heading: 'Anton_400Regular',
      body: 'RobotoCondensed_400Regular',
      bodyBold: 'RobotoCondensed_700Bold',
    },
    sizes: {
      xs: 12,
      sm: 14,
      md: 16,
      lg: 20,
      xl: 24,
      xxl: 32,
      xxxl: 48,
    }
  },
  spacing: {
    xs: 4,
    sm: 8,
    md: 16,
    lg: 24,
    xl: 32,
    xxl: 48,
  },
  borderRadius: {
    sm: 4,
    md: 8,
    lg: 12,
    xl: 20,
    round: 9999,
  }
};
