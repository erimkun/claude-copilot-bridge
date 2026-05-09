# Claude Copilot Bridge

[![GitHub Sponsors](https://img.shields.io/badge/Sponsor-erimkun-DB61A2?style=for-the-badge&logo=githubsponsors&logoColor=white)](https://github.com/sponsors/erimkun)
[![GitHub](https://img.shields.io/badge/GitHub-erimkun-181717?style=for-the-badge&logo=github&logoColor=white)](https://github.com/erimkun)
[![LinkedIn](https://img.shields.io/badge/LinkedIn-Erden%20Erim%20Aydo%C4%9Fdu-0A66C2?style=for-the-badge&logo=linkedin&logoColor=white)](https://www.linkedin.com/in/erden-erim-aydoğdu)

**English** | [Türkçe](#türkçe)

Claude Copilot Bridge is a powerful, local VS Code extension that connects your terminal-based AI agents (like Claude Code) directly to GitHub Copilot Chat inside VS Code. 

It acts as a local HTTP bridge (`127.0.0.1:54321`), allowing Claude to delegate tasks to Copilot autonomously. 

## 🔒 100% Local & Secure (Bring Your Own Account)
- **No Central Server:** The bridge runs entirely on your own machine. Data never leaves your local environment.
- **Your Own Accounts:** When you send a request via Claude Code, it triggers the GitHub Copilot extension installed on *your* VS Code, using *your* active GitHub Copilot subscription.
- **Isolated:** If another developer installs this extension, it runs on standard localhost for them, using their own GitHub Copilot and Claude accounts.

## 🚀 How It Works
1. **VS Code Extension:** Starts a local listening server on port `54321`.
2. **Claude Code Skill:** You instruct Claude to "delegate this task to Copilot" using our skill.
3. **Execution:** Claude sends an HTTP POST request to the bridge. The bridge opens Copilot Chat and types the prompt. Copilot does the heavy lifting, and the result is sent back to Claude!

## 📦 Installation & Usage
1. **Install the Extension:** Install `Claude Copilot Bridge` from the VS Code Marketplace in the VS Code window where you want Copilot to operate.
2. **Add the Skill to Claude Code:** In the terminal where you use Claude Code, simply run the following command to easily install the skill:
   ```bash
   npx skills add erimkun/claude-copilot-bridge
   ```
3. **Enjoy:** Start delegating tasks to Copilot!

**Prompt examples:**

**1. What you should say to Claude (Initial Request):**
- *"Hey Claude, use the Claude Copilot Bridge to assign Copilot as a subagent and ask it to refactor src/utils/date.ts."*

**2. What Claude actually sends to Copilot (Under the hood):**
- `/yolo Please refactor src/utils/date.ts and remove unused imports. Reply SUBAGENT_FINISHED.`

---

# Türkçe

**Claude Copilot Bridge**, terminal tabanlı yapay zeka ajanlarınızı (örneğin Claude Code), doğrudan VS Code içindeki GitHub Copilot Chat'e bağlayan güçlü ve yerel bir VS Code eklentisidir.

Yerel bir HTTP köprüsü (`127.0.0.1:54321`) olarak çalışır ve Claude'un karmaşık görevleri otonom olarak Copilot'a devretmesini sağlar.

## 🔒 %100 Yerel ve Güvenli (Kendi Hesaplarınızı Kullanın)
- **Merkezi Sunucu Yoktur:** Köprü tamamen kendi bilgisayarınızın içinde (localhost) çalışır.
- **Kendi Hesaplarınız:** Claude üzerinden bir istek attığınızda, arka planda *kendi* VS Code'unuzdaki ve *kendi* para verip aldığınız GitHub Copilot aboneliğiniz kullanılır.
- **İzole:** Bu eklentiyi başka bir yazılımcı kurduğunda sistem onun bilgisayarında onun hesaplarıyla çalışır. Hiçbir veri paylaşımı olmaz.

## 🚀 Nasıl Çalışır?
1. **VS Code Eklentisi:** Arka planda `54321` portundan dinleme yapan bir sunucu başlatır.
2. **Claude Code Yeteneği (Skill):** Claude'a "bu işi Copilot'a devret" dersiniz.
3. **Çalışma Anı:** Claude, köprüye bir HTTP POST isteği atar. Köprü de Copilot Chat'i açıp otomatik olarak kod yazdırır. Copilot işlemi bitirince sonuç tekrar Claude'a iletilir.

## 📦 Kurulum ve Kullanım
1. **Eklentiyi Kurun:** Copilot'un çalışacağı VS Code penceresine `Claude Copilot Bridge` eklentisini kurun.
2. **Yeteneği Claude Code'a Ekleyin:** Claude Code kullandığınız terminalde kopyalanabilir şu komutu çalıştırarak yeteneği kolayca kurabilirsiniz:
   ```bash
   npx skills add erimkun/claude-copilot-bridge
   ```
3. **Tadını Çıkarın:** Görevleri asistanlarınıza devretmeye başlayın!

**Prompt örnekleri:**

**1. Sizin Claude'a vereceğiniz komut (İlk İstek):**
- *"Hey Claude, Claude Copilot Bridge ile Copilot'u subagent olarak ata ve src/utils/date.ts dosyasını refactor etmesini söyle."*

**2. Claude'un Copilot'a ilettiği komut (Arka planda çalışan):**
- `/yolo Lütfen src/utils/date.ts dosyasını refactor et ve kullanılmayan importları sil. SUBAGENT_FINISHED yaz.`

