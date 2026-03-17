---
name: models
description: Quick reference for all Google AI model IDs, pricing, and free tier limits. Use when user runs /gfc:models or asks about available Google models.
---

# Google for Claude — Model Reference

Display the following reference table. Do not run any commands — just show the information.

## Image Generation

| Model | ID | Free Tier | Cost |
|---|---|---|---|
| Nano Banana (Flash) | `gemini-2.5-flash-image` | 500 RPD, 10 RPM | Free |
| Nano Banana 2 | `gemini-3.1-flash-image-preview` | Limited preview | Free |
| Nano Banana Pro | `gemini-3-pro-image-preview` | ~2-3/day | Free (limited) |
| Imagen 4 Standard | `imagen-4.0-generate-001` | None | $0.04/image |
| Imagen 4 Fast | `imagen-4.0-fast-generate-001` | None | $0.02/image |
| Imagen 4 Ultra | `imagen-4.0-ultra-generate-001` | None | $0.06/image |

## Video Generation

| Model | ID | Free Tier | Cost |
|---|---|---|---|
| Veo 3.1 | `veo-3.1-generate-preview` | None | Paid |
| Veo 3.1 Fast | `veo-3.1-fast-generate-preview` | None | Paid |
| Veo 3 | `veo-3.0-generate-preview` | None | $0.75/sec (with audio) |
| Veo 2 | `veo-2.0-generate-001` | None | Paid |

## Text-to-Speech

| Model | ID | Free Tier | Quality |
|---|---|---|---|
| Flash TTS | `gemini-2.5-flash-preview-tts` | Included in Flash limits | Fast, low-latency |
| Pro TTS | `gemini-2.5-pro-preview-tts` | Included in Pro limits | High-fidelity |

**Voices:** Kore, Puck, Charon, Fenrir, Aoede, Leda, Zephyr (30+ available)

## Music Generation

| Model | ID | Free Tier | Notes |
|---|---|---|---|
| Lyria RealTime | `lyria-realtime-exp` | Experimental | WebSocket, instrumental, BPM control |

## Text / Multimodal (for transcription, search grounding)

| Model | ID | Free Tier |
|---|---|---|
| Gemini 2.5 Flash | `gemini-2.5-flash` | 10 RPM, 250K TPM, 500 RPD |
| Gemini 2.5 Pro | `gemini-2.5-pro` | 5 RPM, 100 RPD |
| Gemini 3 Flash | `gemini-3-flash-preview` | Limited preview |
| Gemini 3.1 Pro | `gemini-3.1-pro-preview` | Limited preview |

## Embeddings

| Model | ID | Free Tier |
|---|---|---|
| Gemini Embedding | `gemini-embedding-001` | Included |

## Search Grounding

- 5,000 free grounded prompts/month via AI Studio playground only
- API usage requires billing — $14/1K queries

## GFC Command → Model Mapping

| Command | Default Model | Override |
|---|---|---|
| `/gfc:image` | gemini-2.5-flash-image | `--pro`, `--imagen` |
| `/gfc:video` | veo-3.1-generate-preview | `--fast` |
| `/gfc:tts` | gemini-2.5-flash-preview-tts | `--pro` |
| `/gfc:music` | lyria-realtime-exp | — |
| `/gfc:search` | gemini-2.5-flash + search tool | — |
| `/gfc:transcribe` | gemini-2.5-flash | — |
