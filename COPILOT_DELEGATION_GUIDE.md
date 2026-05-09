# Copilot Subagent Delegation Guide (Claude ↔ Copilot Bridge)

This document serves as the standard protocol and reference guide for an AI Agent (like Claude) to securely delegate tasks to **GitHub Copilot Chat** using the local HTTP Bridge Extension. 

By applying these concepts, Claude can dispatch complex, repetitive, or parallel coding tasks to Copilot as a "Subagent" and retrieve the results asynchronously safely.

---

## 1. Environment Prerequisites

For the subagent mechanism to work on a specific operational codebase (e.g., `mbs-arcgisfree`), the following conditions must be met:
1. **Bridge Extension Installed:** The VS Code instance that has the target workspace open MUST have the `claude-copilot-bridge` extension running.
2. **Hook System Present:** The target workspace MUST contain the following VS Code hook files:
   - `.github/hooks/hooks.json`: Maps the `Stop` event to the script.
   - `.github/hooks/on-stop.js`: A Node.js script that parses the `.jsonl` transcript and posts it back to the bridge.

## 2. Bridge API Endpoints (Port `54321`)

The bridge exposes simple REST JSON endpoints on `http://localhost:54321` to communicate with the Copilot side pane.

### A. Dispatching a Task (`POST /ask-copilot`)
To send Copilot a command, make a POST request. The `query` property is the exact prompt Copilot will receive and act upon in the active workspace.

**Example (PowerShell):**
```powershell
$body = @{ query = "/yolo Please analyze src/main.js and fix any linting errors. Use your file edit tools. Reply with 'TASK_COMPLETE' when done." } | ConvertTo-Json
Invoke-RestMethod -Uri "http://localhost:54321/ask-copilot" -Method Post -Body $body -ContentType "application/json"
```

### B. Retrieving the Results (`GET /transcript`)
Because Copilot generates results streaming in the background, you must wait a designated period (e.g., `10 - 30 seconds` based on complexity) and then pull the transcript.

**Example:**
```powershell
# Wait for Copilot to execute tools and generate text
Start-Sleep -Seconds 20

# Check the transcript
$response = Invoke-RestMethod -Uri "http://localhost:54321/transcript" -Method Get
```
If the event hook hasn't fired yet, it returns: `{"status": "waiting"}`. Once complete, it returns an array of messages under `value`.

## 3. Subagent Prompting Guidelines

When asking Copilot to perform tasks, you should format your instructions so Copilot handles them completely without human intervention.
*   **Exact Targets:** Provide relative or absolute file paths so Copilot does not have to guess. (e.g., `Modify /src/features/map/Layers.tsx`).
*   **Action Oriented:** Say `"Edit the file to include X"` rather than `"How do I include X?"`. Copilot must be explicitly told to apply changes.
*   **Bypassing Tool Blocks:** (If terminal action is necessary) Remind Copilot to use `/yolo` or inform the user to activate `autoApprove` if it intends to run shell scripts.
*   **Language:** Write the prompt in the user's requested language (Turkish or English).
*   **Success Tokens:** Explicitly end your prompt by declaring a completion token:
    > *"When you have finished making all edits, output the exact phrase 'SUBAGENT_FINISHED'."*
    This lets Claude verify through the transcript that Copilot didn't stop typing midway due to an error.

**Prompt examples:**
- English: `/yolo Please update src/api/client.ts to add retry logic. Reply SUBAGENT_FINISHED.`
- Turkish: `/yolo Lütfen src/api/client.ts dosyasina tekrar deneme (retry) mantigi ekle. SUBAGENT_FINISHED yaz.`

**Alternative to `/yolo`:**
If your environment uses `autoApprove`, you can use it as the first token instead:
`/autoApprove Please update src/api/client.ts to add retry logic. Reply SUBAGENT_FINISHED.`

## 4. End-to-End Workflow for Claude
1. **Define the Goal:** Formulate the string query for the objective.
2. **Dispatch:** Use `run_in_terminal` to send `Invoke-RestMethod` to `/ask-copilot`.
3. **Wait:** Use `Start-Sleep` or a background loop.
4. **Fetch:** Use `Invoke-RestMethod` to `/transcript`.
5. **Verify:** Parse the JSON result, locate the `"assistant.message"` blocks in the array, and read `"content"`.
6. **Iterate:** If Copilot failed or asked a follow-up question, dispatch a new prompt answering its question.