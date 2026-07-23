import pandas as pd
import os
import sys
import io

# Terminaldeki Türkçe/Özel karakterleri yazdırırken çökmemesi için
sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8')

script_dir = os.path.dirname(os.path.abspath(__file__))
input_file = os.path.join(script_dir, '04_Nihai_Oyun_Verisi.csv')
output_file = os.path.join(script_dir, '05_Temiz_Nihai_Oyun_Verisi.csv')

def main():
    print("04_Nihai_Oyun_Verisi.csv okunuyor...")
    df = pd.read_csv(input_file)
    
    baslangic_sayisi = len(df)
    print(f"Filtreleme öncesi toplam oyuncu sayısı: {baslangic_sayisi}")
    
    # 3. YAKLAŞIM: Ligin Maksimum Süresine Oranlama (%25 Filtresi)
    # Oyuncunun oynadığı süre (90s) / Ligin maksimum süresi (Lig_Max_90s) oranı >= 0.25 (Yüzde 25)
    oran = df['90s'] / df['Lig_Max_90s'].replace(0, 1) # Sıfıra bölünmeyi engellemek için
    
    # Oranı 0.25 veya daha büyük olanları filtreleyip yeni dataframe'e alıyoruz
    df_filtrelenmis = df[oran >= 0.25].copy()
    
    kalan_sayisi = len(df_filtrelenmis)
    silinen_sayisi = baslangic_sayisi - kalan_sayisi
    
    print("\n------------------------------------------------------")
    print(f"FILTRELEME SONUCU")
    print("------------------------------------------------------")
    print(f"Silinen 'Hayalet/Yedek' Oyuncu Sayısı : {silinen_sayisi}")
    print(f"Oyun İçin Kalan Aktif Oyuncu Sayısı   : {kalan_sayisi}")
    print("------------------------------------------------------\n")
    
    # Yeni veri setini kaydetme
    print(f"Temizlenmiş nihai dosya kaydediliyor: {output_file}")
    df_filtrelenmis.to_csv(output_file, index=False, encoding='utf-8-sig')
    print("İşlem başarıyla tamamlandı! Oyun veri tabanınız artık tertemiz.")

if __name__ == "__main__":
    main()
