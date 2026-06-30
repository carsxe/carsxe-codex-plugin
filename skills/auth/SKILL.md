---
name: auth
description: Set and save the CarsXE API key. Use this when the user provides a CarsXE API key, asks to configure the plugin, or when the session starts without a key loaded.
---

When the user provides a CarsXE API key (format: `cxe_live_...`) or asks to set their key:

1. Validate the key first:
   ```
   GET https://api.carsxe.com/v1/auth/validate?key={KEY}&source=codex_plugin
   ```
   If the response indicates the key is invalid, tell the user and stop — do not save it.

2. Save the validated key to disk so the SessionStart hook loads it automatically next session.

   Determine the config directory — use `$PLUGIN_DATA` (or `$CLAUDE_PLUGIN_DATA`) if set, otherwise `~/.carsxe`:

   **macOS / Linux:**
   ```bash
   CONFIG_DIR="${PLUGIN_DATA:-$HOME/.carsxe}"
   mkdir -p "$CONFIG_DIR"
   echo '{"api_key":"KEY"}' > "$CONFIG_DIR/config.json"
   ```

   **Windows (PowerShell):**
   ```powershell
   $dir = if ($env:PLUGIN_DATA) { $env:PLUGIN_DATA } else { "$HOME\.carsxe" }
   New-Item -Force -ItemType Directory $dir | Out-Null
   '{"api_key":"KEY"}' | Set-Content "$dir\config.json"
   ```

3. Set the key for the current session:

   **macOS / Linux:** `export CARSXE_API_KEY="KEY"`
   **Windows (PowerShell):** `$env:CARSXE_API_KEY="KEY"`

4. Confirm to the user:
   > "CarsXE API key saved. It will load automatically at the start of every future session."

If the key is already set and the user just wants to verify it, call:
```
GET https://api.carsxe.com/v1/auth/validate?key={CARSXE_API_KEY}&source=codex_plugin
```
and report whether it is valid.
