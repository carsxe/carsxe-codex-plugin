# CarsXE Vehicle Data APIs

You have access to the full suite of CarsXE vehicle data APIs through this plugin's skills.
Use them whenever a user asks about vehicles, VINs, license plates, vehicle values, history,
recalls (VIN, year/make/model, or batch), YMM options, ownership, liens, OBD codes, vehicle
images, or anything related to vehicle data.

## API Key

Every request requires a CarsXE API key. The `SessionStart` hook loads it automatically from
disk into `CARSXE_API_KEY` at the start of each session.

**First-time setup:** If `CARSXE_API_KEY` is not set at session start, immediately ask the user:

> "To use CarsXE, I need your API key. Get one free at https://api.carsxe.com/dashboard/developer,
> then tell me: 'Set my CarsXE API key to YOUR_KEY'."

Once the user provides the key, invoke the `auth` skill to validate and persist it.
After that, the hook loads it automatically on every future session — the user never needs to set it again.

If `CARSXE_API_KEY` is missing mid-session, prompt the same way before making any API call.

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
| `recalls-ymm`             | `/v1/recalls-ymm`                   | GET    | `year`, `make`, `model`                                                                         |
| `recalls-batch`           | `/v1/recalls-batch/submit`          | POST   | JSON body `vins` and/or `csv` / `csvUrl`; optional `webhookUrl`                                 |
| `recalls-batch`           | `/v1/recalls-batch/status\|results\|download` | GET | `batchId`                                                                                   |
| `international-vin`       | `/v1/international-vin-decoder`      | GET    | `vin`                                                                                           |
| `year-make-model`         | `/v1/ymm`                           | GET    | `year`, `make`, `model`; optional `trim`                                                        |
| `ymm-options`             | `/v1/ymm-options`                   | GET    | optional `dimension`, `year`, `make`, `model`, `trim`                                           |
| `ownership`               | `/v1/ownership/vin\|person\|address\|zip` | GET | VIN / name+address+zip / address+zip / zip; optional `include`                            |
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
- Route recalls by input: VIN → `vehicle-recalls`; year/make/model → `recalls-ymm`; many VINs → `recalls-batch`.
- Route YMM browse vs specs: dropdowns / "what years was X sold" → `ymm-options`; full specs → `year-make-model`.
- Ownership is Enterprise-only and billed per returned record. Do not call `/v1/ownership/phone`. Street `address` is street only.
- CarsXE sometimes returns HTTP 200 with an `error` field in the body — always check it.
