# PGP Z3R0

**A zero-server, privacy-first PGP tool in your browser.**  
Generate OpenPGP keypairs, encrypt text for recipients, and decrypt messages **fully offline** — no data ever leaves your device.

> **TL;DR:** Everything runs client-side. There are **no** network calls, **no** telemetry, and **no** storage of your keys.

---

## 🔗 Live App


<img width="1106" height="787" alt="Screenshot 2025-10-02 at 15 34 35" src="https://github.com/user-attachments/assets/2d7a5d26-cd6a-478e-b93b-744483f486e9" />

**https://pgp-offline.anatole.co**  
(You can load it once, then go offline for all operations.)

---

## ✨ Features

- **Key generation (PGP keypair)**
  - Create a fresh OpenPGP keypair in your browser
  - Choose key size/curve, user ID, and optional passphrase
- **Encrypt**
  - Encrypt any text to a recipient using **their public key**
- **Decrypt**
  - Decrypt PGP-encrypted messages with **your private key** (and passphrase if set)
- **100% offline**
  - Works without internet access after initial load (or when opened from a local file)
- **No servers, no logs**
  - All crypto and parsing happens locally in your browser sandbox
- **Import / Export**
  - Paste or upload ASCII-armored keys and messages
  - Download your newly generated keys for safekeeping

---

## 🚀 Quick Start

1. Open **[PGP Z3R0](https://pgp-offline.anatole.co)** (optional: then disconnect from the internet).
2. **Generate keys**  
   - Go to **Generate**, choose parameters, and create your keypair.  
   - **Export** and store your private key securely (and its passphrase, if set).
3. **Encrypt a message**  
   - Go to **Encrypt**, paste the **recipient’s public key**, write your message, and click **Encrypt**.  
   - Share the resulting ASCII-armored block with the recipient.
4. **Decrypt a message**  
   - Go to **Decrypt**, import **your private key**, paste the ciphertext, enter your passphrase if needed, and click **Decrypt**.

> ❗️Important: PGP encryption uses the **recipient’s public key** to encrypt. Only the **recipient’s private key** can decrypt.

**Never share your private key.**

---

## 🔐 Security & Privacy Model

| Aspect        | What it means here |
|---------------|--------------------|
| Architecture  | 100% client-side web app; zero back-end infrastructure |
| Network       | App performs **no network requests** after load; use offline for maximum assurance |
| Key handling  | Keys remain in browser memory only for the session unless you export them |
| Storage       | No automatic persistent storage; downloads are explicit user actions |
| Entropy       | Uses the browser’s CSPRNG (`window.crypto.getRandomValues`) for key generation |
| Compatibility | Targets OpenPGP-compatible keys and ASCII-armored messages |

### Threat-model notes

- **Supply chain & integrity.** For highest assurance, clone/build locally and open the files offline (see below).  
- **Device security.** Your browser and OS must be free of malware; a compromised device can exfiltrate keys.  
- **Passphrases.** Use strong, unique passphrases for private keys; store them in a secure password manager.  
- **Backups.** Losing your private key or passphrase means losing access to encrypted data—keep redundant, secure backups.

