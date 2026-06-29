# CarsXE Vehicle Data APIs

You have access to the full suite of CarsXE vehicle data APIs through this plugin's skills.
Use them whenever a user asks about vehicles, VINs, license plates, vehicle values, history,
recalls, liens, OBD codes, vehicle images, or anything related to vehicle data.

## API Key

Every request requires a CarsXE API key, read from the `CARSXE_API_KEY` environment variable.

Get a key from https://api.carsxe.com/dashboard/developer, then set it before launching Codex:

- **macOS / Linux (bash/zsh):** `export CARSXE_API_KEY="cxe_live_YOUR_KEY"`
- **Windows (PowerShell):** `$env:CARSXE_API_KEY="cxe_live_YOUR_KEY"`
- **Persist it** by exporting `CARSXE_API_KEY` in your shell profile, or add it under `[shell_environment_policy]`
  / a project `.env` so Codex sessions inherit it.

If `CARSXE_API_KEY` is missing or empty, tell the user to set it as shown above before retrying.

## Base URL & Required Params

**Base URL:** `https://api.carsxe.com`

Append these to **every** request: `key=$CARSXE_API_KEY` and `source=codex_plugin`.

## API Map

| Skill                     | Endpoint                            | Method | Key Parameters                                                                                 |
| ------------------------- | ----------------------------------- | ------ | ---------------------------------------------------------------------------------------------- |
| `vehicle-specs`           | `/specs`                            | GET    | `vin`; optional `deepdata`, `disableIntVINDecoding`                                            |
| `plate-decoder`           | `/v2/platedecoder`                  | GET    | `plate`, `country` (required), `state`                                                          |
| `market-value`            | `/v2/marketvalue`                   | GET    | `vin`; optional `state`, `mileage`, `condition`                                                |
| `vehicle-history`         | `/history`                          | GET    | `vin`                                                                                           |
| `vehicle-images`          | `/images`                           | GET    | `make`, `model`; optional `year`, `trim`, `color`, `angle`, `photoType`, `size`, `transparent` |
| `vehicle-recalls`         | `/v1/recalls`                       | GET    | `vin`                                                                                           |
| `international-vin`       | `/v1/international-vin-decoder`      | GET    | `vin`                                                                                           |
| `year-make-model`         | `/v1/ymm`                           | GET    | `year`, `make`, `model`; optional `trim`                                                        |
| `obd-decoder`             | `/obdcodesdecoder`                  | GET    | `code`                                                                                          |
| `vin-ocr`                 | `/v1/vinocr`                        | POST   | JSON body `{"image": "<URL>"}`                                                                  |
| `plate-image-recognition` | `/platerecognition`                 | POST   | JSON body `{"image": "<URL>"}`                                                                  |

## Guidelines

- Always present API results in a clean, organized format.
- For VIN-based lookups, validate that the VIN is 17 alphanumeric characters (excluding I, O, Q).
- Highlight any red flags in history or lien/theft reports prominently (salvage title, accidents,
  odometer rollback, active liens, theft records).
- When decoding OBD codes, include severity context (immediate attention vs. can wait).
- For image-based skills (VIN OCR, plate recognition), offer to follow up with a decode after extraction.
- Chain skills when helpful — e.g. decode a plate to a VIN, then run recalls + lien/theft on that VIN.
- CarsXE sometimes returns HTTP 200 with an `error` field in the body — always check it.
