const fs = require('fs');
const http = require('http');

let input = '';
process.stdin.on('data', chunk => {
    input += chunk;
});

process.stdin.on('end', () => {
    try {
        const payload = JSON.parse(input);
        
        if (payload.transcript_path && fs.existsSync(payload.transcript_path)) {
            const transcriptRaw = fs.readFileSync(payload.transcript_path, 'utf8');
            const lines = transcriptRaw.split('\n').filter(line => line.trim().length > 0);
            const transcriptData = lines.map(line => {
                try {
                    return JSON.parse(line);
                } catch (e) {
                    return { error: 'Parse Error', raw: line };
                }
            });

            // Yerel kopru sunucusuna kopyasini yolla
            const postData = JSON.stringify({
                sessionId: payload.session_id,
                transcript: transcriptData
            });

            const req = http.request({
                hostname: '127.0.0.1',
                port: 54321,
                path: '/webhook-stop',
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Content-Length': Buffer.byteLength(postData)
                }
            }, (res) => {
                // Hook islemini basariyla sonlandir
                console.log(JSON.stringify({ continue: true }));
                process.exit(0);
            });

            req.on('error', (e) => {
                // Sunucu kapalisa bile devam et
                console.log(JSON.stringify({ continue: true, systemMessage: "Hook iletim hatasi: " + e.message }));
                process.exit(0);
            });

            req.write(postData);
            req.end();
            return; // Wait for response
        }
    } catch (e) {
        // Hata olsa bile Copilot'a engelleme yapmamak icin basarili cikis don
    }
    
    console.log(JSON.stringify({ continue: true }));
    process.exit(0);
});
