# CAN-İZİ MOBiL - Arama Kurtarma Uygulaması

Bu uygulama, afet bölgelerinde mağdurların acil durum sinyallerini göndermesi ve kurtarıcıların radar ile önceliklendirmesi için tasarlanmıştır.

## Kurulum

1. Node.js kurulu olduğundan emin olun (v16+).
2. Proje klasörüne gidin: `cd "CAN-İZİ MOBiL"`
3. Dependencies yükleyin: `npm install`
4. Server için: `cd server && npm install`

## Çalıştırma

### Mobil Uygulama
- `npx react-native run-android` (Android emulator veya cihaz için)
- Uygulamada "ACİL DURUM" butonuna basın, sinyal gönderilir.

### API Server
- `cd server && npm start`
- Server http://localhost:3000'de çalışır.
- Masaüstü radar uygulamanız bu API'den sinyalleri çekebilir.

## APK Build
1. Android Studio kurun.
2. `npx react-native build-android --variant=release`
3. APK: `android/app/build/outputs/apk/release/app-release.apk`
4. Redmi Note Pro G'ye USB ile bağlayıp yükleyin (ADB ile).

## Bağlantı
- Mobil app, hotspot IP'sine (ör. 192.168.1.100:3000) bağlanır.
- Server, sinyalleri loglar ve masaüstü app'e iletir.

Not: MAC adresi ve batarya için gerçek kütüphaneler ekleyin (react-native-device-info, react-native-get-mac-address).