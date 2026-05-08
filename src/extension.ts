import * as vscode from 'vscode';
import * as http from 'http';

let server: http.Server | undefined;
let latestChatTranscript: any = null; // Bellekteki son sohbet dökümünü tutacak

async function openInFreshChat(query: string) {
    // Sohbeti silmek yerine yeni bir sohbet acmayi dene.
    const newChatCommands = [
        'workbench.action.chat.open',
        'workbench.action.chat.newChat',
        'workbench.action.chat.new',
        'workbench.action.chat.newSession',
        'workbench.action.chat.startNew',
        'chat.newSession',
        'github.copilot.chat.newSession',
        'github.copilot.chat.startNewSession'
    ];

    for (const commandId of newChatCommands) {
        try {
            if (commandId === 'workbench.action.chat.open') {
                await vscode.commands.executeCommand(commandId);
            } else {
                await vscode.commands.executeCommand(commandId);
            }
            await new Promise(resolve => setTimeout(resolve, 700));
            await vscode.commands.executeCommand('workbench.action.chat.open', { query });
            return;
        } catch {
            // Sonraki alternatif komutu dene
        }
    }

    // Yeni sohbet komutlari mevcut degilse mevcut sohbette yazmaya devam et.
    await vscode.commands.executeCommand('workbench.action.chat.open', { query });
}

export function activate(context: vscode.ExtensionContext) {
    console.log('Claude-Copilot Bridge is now active!');

    // Manuel başlatma komutu
    let disposable = vscode.commands.registerCommand('claude-copilot-bridge.start', () => {
        startServer();
        vscode.window.showInformationMessage('Claude-Copilot Bridge HTTP Sunucusu Başlatıldı! (Port: 54321)');
    });
    context.subscriptions.push(disposable);

    // Eklenti aktifleştiğinde otomatik başlat
    startServer();
}

function startServer() {
    if (server) return; // Zaten açıksa tekrar açma

    server = http.createServer((req, res) => {
        // CORS ayarları (Dışarıdan veya farklı scriptlerden kolayca curl atabilmek için)
        res.setHeader('Access-Control-Allow-Origin', '*');
        res.setHeader('Access-Control-Allow-Methods', 'POST, GET, OPTIONS');
        res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

        if (req.method === 'OPTIONS') {
            res.writeHead(204);
            res.end();
            return;
        }

        if (req.method === 'POST' && req.url === '/ask-copilot') {
            let body = '';
            req.on('data', chunk => {
                body += chunk.toString();
            });
            req.on('end', () => {
                try {
                    const payload = JSON.parse(body);
                    const query = payload.query || payload.prompt;
                    
                    if (query) {
                        // Eğer yepyeni bir sohbet isteniyorsa önce temizleme komutu gönder
                        // Reset transcript before a new query
                        latestChatTranscript = null;

                        if (payload.newSession) {
                            void openInFreshChat(query);
                        } else {
                            vscode.commands.executeCommand('workbench.action.chat.open', { query });
                        }
                        
                        res.writeHead(200, { 'Content-Type': 'application/json' });
                        res.end(JSON.stringify({ 
                            status: 'success', 
                            message: 'Komut Copilot Chat arayüzüne gönderildi.',
                            receivedQuery: query
                        }));
                    } else {
                        res.writeHead(400, { 'Content-Type': 'application/json' });
                        res.end(JSON.stringify({ status: 'error', message: 'Payload içinde "query" veya "prompt" keyi bulunamadı.' }));
                    }
                } catch (e) {
                    res.writeHead(500, { 'Content-Type': 'application/json' });
                    res.end(JSON.stringify({ status: 'error', message: 'Geçersiz JSON formatı.' }));
                }
            });
        } else if (req.method === 'POST' && req.url === '/webhook-stop') {
            let body = '';
            req.on('data', chunk => { body += chunk.toString(); });
            req.on('end', () => {
                try {
                    const payload = JSON.parse(body);
                    latestChatTranscript = payload.transcript; // Hafizaya kaydet
                    
                    res.writeHead(200, { 'Content-Type': 'application/json' });
                    res.end(JSON.stringify({ status: 'success', message: 'Transcript alindi.' }));
                } catch (e) {
                    res.writeHead(500, { 'Content-Type': 'application/json' });
                    res.end(JSON.stringify({ status: 'error' }));
                }
            });
        } else if (req.method === 'GET' && req.url === '/transcript') {
            // Claude'un (benim) son transcripti okuyacagi yer
            res.writeHead(200, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify(latestChatTranscript || { status: 'waiting', message: 'HenuZ bir chat bittigine dair hook gelmedi.' }));
        } else {
            res.writeHead(404, { 'Content-Type': 'text/plain' });
            res.end('Not Found - API: POST /ask-copilot, POST /webhook-stop, GET /transcript');
        }
    });

    server.listen(54321, '127.0.0.1', () => {
        console.log('Bridge server running on http://127.0.0.1:54321');
    });
}

export function deactivate() {
    if (server) {
        server.close();
    }
}
