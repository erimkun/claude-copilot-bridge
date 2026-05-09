---
name: copilot-subagent
description: Workflow to delegate coding tasks, bulk refactors, or specialized edits to GitHub Copilot Chat through the local bridge extension.
---

# Copilot Subagent Workflow

Use this skill when you need to delegate coding tasks, bulk refactors, or specialized edits to GitHub Copilot Chat through the local bridge extension. This allows you to work in parallel with Copilot or have Copilot utilize its own edit tools on the codebase.

## 1. Pre-flight Check: Ensure Hooks Exist!
Because you might be operating in a new workspace that doesn't have the required hook configuration to send Copilot's transcript back to the bridge, **you MUST check if the hooks exist first**.

Check for the existence of:
- `.github/hooks/hooks.json`
- `.github/hooks/on-stop.js`

If they DO NOT exist in the current workspace, **create them immediately** before dispatching your task to Copilot:

**File:** `.github/hooks/hooks.json`
```json
{
  "hooks": {
    "Stop": [
      {
        "type": "command",
        "command": "node .github/hooks/on-stop.js"
      }
    ]
  }
}
```

**File:** `.github/hooks/on-stop.js`
```javascript
const fs = require('fs');
const http = require('http');

let input = '';
process.stdin.on('data', chunk => { input += chunk; });
process.stdin.on('end', () => {
    try {
        const payload = JSON.parse(input);
        if (payload.transcript_path && fs.existsSync(payload.transcript_path)) {
            const transcriptRaw = fs.readFileSync(payload.transcript_path, 'utf8');
            const lines = transcriptRaw.split('\n').filter(line => line.trim().length > 0);
            const transcriptData = lines.map(line => {
                try { return JSON.parse(line); } catch (e) { return { error: 'Parse Error', raw: line }; }
            });
            const postData = JSON.stringify({ sessionId: payload.session_id, transcript: transcriptData });
            const req = http.request({
                hostname: '127.0.0.1', port: 54321, path: '/webhook-stop', method: 'POST',
                headers: { 'Content-Type': 'application/json', 'Content-Length': Buffer.byteLength(postData) }
            }, (res) => {
                console.log(JSON.stringify({ continue: true })); process.exit(0);
            });
            req.on('error', (e) => {
                console.log(JSON.stringify({ continue: true, systemMessage: e.message })); process.exit(0);
            });
            req.write(postData); req.end();
            return;
        }
    } catch (e) {}
    console.log(JSON.stringify({ continue: true })); process.exit(0);
});
```

## 2. Workspace Targeting Rules (Critical)

The bridge sends prompts to the Copilot Chat panel of the VS Code window where the bridge extension is running. This is not always the same as your terminal `cwd`.

Because of that, a prompt like "create in project root" may write into a different repository if another VS Code window is the active Copilot host.

Use these rules:

- Always prefer absolute paths for file-create or file-edit requests when location must be exact.
- Add `"newSession": true` to reduce context bleed from previous turns.
- If result location is important, ask Copilot to echo the full file path it wrote.
- After completion, verify on disk with a local check (`Test-Path`, `Get-Item`, `Get-Content`).

Safe dispatch example (note: `/yolo` must be at the very beginning of the prompt):

```powershell
Invoke-RestMethod -Uri "http://localhost:54321/ask-copilot" -Method Post -Body '{"query":"/yolo Create file at C:\\Users\\erden.aydogdu\\Desktop\\mbs-arcgisfree\\HelloWorld.md and write hello world. Use file edit tools. Reply SUBAGENT_FINISHED.","newSession":true}' -ContentType "application/json"
```

## 3. Dispatching the Task
Tell Copilot exactly what to do. Use explicit file paths. Instruct Copilot to use its file edit tools. End with a success token so you know when it's done.

```powershell
$body = @{ query = "Modify src/components/Button.tsx to add a disabled prop. Use your file edit tools. Reply exactly with 'DONE_COPILOT' when finished." } | ConvertTo-Json
Invoke-RestMethod -Uri "http://localhost:54321/ask-copilot" -Method Post -Body $body -ContentType "application/json"
```

## 4. Polling for the Transcript
Copilot takes time to write code. Sleep for 45-60 seconds before checking, then poll if necessary.

```powershell
Invoke-RestMethod -Uri "http://localhost:54321/transcript" -Method Get | ConvertTo-Json
```
*If it returns `{"status": "waiting"}`, sleep for another 10 seconds and try again.*

## 5. Evaluate Output
Once the transcript array is returned, parse the objects where `"type": "assistant.message"`. Check the `"content"` property to ensure Copilot succeeded and didn't fall into an error loop.
