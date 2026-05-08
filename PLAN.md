# Claude - Copilot Arayüz Köprüsü (Claude-Copilot Bridge)

## 📌 Projenin Amacı
Claude (CLI, arka plan ajanı veya dış bir otomasyon) komutlarının, VS Code içindeki **GitHub Copilot Chat** veya **Copilot Edits (Autopilot)** görsel arayüzünü (UI) dışarıdan programatik olarak tetiklemesini sağlamak. 

Bu sayede Claude, kendi başına terminali veya proje dosyalarını okurken, Copilot'un UI destekli otomatik özellikleri (kod onayı, değişiklik önizleme ekranı vb.) üzerinden iş yaptırabilecektir.

## 🏗️ Mimari Yapı
Projeyi bir **Visual Studio Code Eklentisi (Extension)** olarak geliştireceğiz. Bu eklentinin görevi:
1. **Dinleyici (Listener):** Arka planda mikro bir HTTP veya IPC (Inter-Process Communication / Named Pipe) sunucusu ayağa kaldırarak dış dünyadan (Claude) gelecek komutları dinleyecek.
2. **Tetikleyici (Trigger):** Gelen JSON formatlı (`{"prompt": "...", "mode": "chat"}`) isteği alıp `vscode.commands.executeCommand` veya türevi iç API'lerle VS Code UI'ını harekete geçirecek.
3. **Yakalyıcı (Watcher - Zorlu Kısım):** Copilot arayüzünden gelen sonuçları okuyup tekrar Claude'a JSON cevabı olarak döndürmeye çalışacak (veya sadece tetikleyip bırakarak basit bir asenkron ateşleme yapacak).

## ⚠️ Karşılaşacağımız Zorluklar ve Sınırlar
* **Arayüzü Otomatik Gönderme:** `workbench.action.chat.open` komutu paneli açıp yazıyı (`query` argümanı ile) içine yazabiliyor ama bazen kullanıcıdan fiziksel bir `Enter` bekliyor. Bunu aşmak için iç eklenti manipülasyonları gerekebilir.
* **Cevabı Okumak:** Chat penceresine yazılan cevabı veya "Copilot Edits" modundaki kod değişikliklerini eklenti üzerinden okumak resmi API'lerde çok kısıtlıdır. Dosya sistemini (File System Watcher) izleyerek sonuca ulaşmamız gerekebilir.

## 📅 Proje Aşamaları (Faz Planı)

### Faz 1: VS Code API Araştırması & PoC (Proof of Concept)
- VS Code Chat API (`vscode.chat.*`, `workbench.action.chat.*`) yeteneklerini listelemek.
- Sadece boş bir eklentiyle "Dışarıdan bir metni Copilot Chat'e yazdırabiliyor muyuz?" sorusunu cevaplamak.

### Faz 2: Arka Plan İletişim Sunucusu (IPC/HTTP) Kurulumu
- Localhost'ta (örn: 127.0.0.1:54321) çalışan Express veya Node `http` modülü ayağa kaldırmak.
- POST isteği alıp, VS Code içerisine sinyal yollamak.

### Faz 3: "Enter" ve "Auto-Submit" Probleminin Çözümü
- Copilot komutlarını otomatik olarak onaylayacak ve cevap gelene kadar bekleyecek mekanizmayı kurmak.

### Faz 4: Claude Code (Veya İlgili Bot) İçin Araç (Tool) Yazımı
- Arka planda sunucumuzu tetikleyen Claude CLI `tool` veya `curl` yapılarını oluşturmak ve tam "End-to-End" testi yapmak.
