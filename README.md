# Claude Copilot Bridge

[![Buy Me A Coffee](https://img.shields.io/badge/Buy%20Me%20A%20Coffee-Support%20Project-FFDD00?style=for-the-badge&logo=buy-me-a-coffee&logoColor=black)](https://www.buymeacoffee.com/YOUR_USERNAME_HERE)
[![GitHub](https://img.shields.io/badge/GitHub-erimkun-181717?style=for-the-badge&logo=github&logoColor=white)](https://github.com/erimkun)
[![LinkedIn](https://img.shields.io/badge/LinkedIn-Erden%20Erim%20Aydo%C4%9Fdu-0A66C2?style=for-the-badge&logo=linkedin&logoColor=white)](https://www.linkedin.com/in/erden-erim-aydoğdu)

<div align="center">
  <picture>
    <source media="(prefers-color-scheme: dark)" srcset="https://raw.githubusercontent.com/erimkun/claude-copilot-bridge/output/github-snake-dark.svg">
    <source media="(prefers-color-scheme: light)" srcset="https://raw.githubusercontent.com/erimkun/claude-copilot-bridge/output/github-snake.svg">
    <img alt="github contribution grid snake animation" src="https://raw.githubusercontent.com/erimkun/claude-copilot-bridge/output/github-snake.svg">
  </picture>
</div>

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
1. **Install the Extension:** Install `Claude Copilot Bridge` from the VS Code Marketplace.
2. **Add the Skill to Claude Code:** In your terminal, run:
   ```bash
   npx skills add <YOUR-GITHUB-REPO>@copilot-subagent
   ```
3. **Enjoy:** Ask Claude: *"Hey Claude, ask Copilot to refactor this file."*

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
1. **Eklentiyi Kurun:** VS Code Marketplace üzerinden `Claude Copilot Bridge` eklentisini indirin.
2. **Yetenekleri Claude Code'a Ekleyin:** Terminalinizi açın ve şunu yazın:
   ```bash
   npx skills add <SİZİN-GITHUB-REPONUZ>@copilot-subagent
   ```
3. **Tadını Çıkarın:** Claude'a şu komutu verin: *"Hey Claude, şu dosyayı Copilot'a refactor ettir."*

