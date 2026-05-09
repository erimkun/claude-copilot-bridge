# Claude-Copilot Bridge Kullanım Protokolü

Bu dosya, Claude'un (ana orkestratör) VS Code Copilot Chat arayüzünü (UI) tam otomatik (Autopilot) ve izole bir alt-işçi (Subagent) olarak nasıl kullanacağını tanımlar. Claude, Copilot'a görev vermeden önce bu protokolü okumalıdır.

## 1. Sistemin Çalışma Mantığı
VS Code'da yüklü olan "Claude-Copilot Bridge" eklentisi arka planda `127.0.0.1:54321` portundan HTTP istekleri dinler.
Claude, kendi terminal yeteneklerini kullanarak bu port üzerinden Copilot Chat'i tetikler ve iş bitiminde hook aracılığıyla çıkan sonucu okur.

## 2. Uyulması Gereken Kurallar ve Prompt Formatı

### A. Otomatik Onay (Bypass Approvals / Autopilot)
Copilot'un terminal veya dosya düzenleme komutlarında kullanıcıya "Allow/Skip" butonu çıkarmaması için promptların en başına her zaman `/yolo` (veya `/autoApprove`) eklenmelidir.
Prompt dili, kullanıcının isteğine göre Türkçe veya İngilizce olabilir.

### B. Özel Model (LLM) Seçimi
Copilot'un farklı bir model (örn. GPT-4o, Claude 3.5 Sonnet) kullanması isteniyorsa, öncelikle çalışma dizininde (veya .github/prompts altında) bir frontmatter içeren `*.agent.md` dosyası oluşturulmalıdır.
Örnek `uzman.agent.md`:
```markdown
---
name: Uzman
model: ['GPT-4o']
---
Sen bir koda müdahale eden uzmansın.
```
Görev verilirken bu ajan başa etiketlenmelidir: `#Uzman`

### C. İstek Formatı (POST)
Claude, terminalden curl veya PowerShell (Invoke-RestMethod) ile aşağıdaki formatta istek atmalıdır:

```json
{
  "query": "/yolo #<AgentName(Opsiyonel)> Lütfen <hedef_dosya> dosyasını incele ve <su_gorevi> yap."
}
```
**Endpoit:** `POST http://127.0.0.1:54321/ask-copilot`

## 3. Sonucu Okuma ve Bekleme (GET)
Copilot çalışmayı bitirdiğinde, VS Code `Stop` hook'u sayesinde oluşan transcript'i `127.0.0.1:54321/webhook-stop` adresine iletecektir. 
Claude, işi başlattıktan sonra belli aralıklarla veya işin bittiğini tahmin ettiği bir sürenin sonunda şu endpoint'i okumalıdır:

**Endpoint:** `GET http://127.0.0.1:54321/transcript`

Eğer dönen JSON içinde `status: "waiting"` varsa, Copilot henüz işini bitirmemiştir ve Claude biraz daha bekleyip tekrar okumalıdır. Dönen cevapta `transcript` içeriği doluysa, işlem başarıyla tamamlanmış ve Copilot'un ne yaptığı JSON dökümü (array/liste) olarak elde edilmiştir. Claude bu dökümü analiz edip kullanıcıya özet geçmelidir.
