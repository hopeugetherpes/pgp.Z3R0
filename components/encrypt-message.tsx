"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Lock, Copy, Check } from "lucide-react"

export function EncryptMessage() {
  const [message, setMessage] = useState("")
  const [publicKey, setPublicKey] = useState("")
  const [encryptedMessage, setEncryptedMessage] = useState("")
  const [loading, setLoading] = useState(false)
  const [copied, setCopied] = useState(false)

  const encryptText = async () => {
    if (!message || !publicKey) {
      alert("Please provide both message and public key")
      return
    }

    setLoading(true)
    try {
      const openpgp = await import("openpgp")

      const trimmedKey = publicKey.trim()

      // OpenPGP.js can handle both armored and non-armored keys
      console.log("[v0] Attempting to read public key...")
      let pubKey

      try {
        // Try reading as armored key first
        pubKey = await openpgp.readKey({ armoredKey: trimmedKey })
      } catch (armoredError) {
        console.log("[v0] Failed to read as armored key, trying to add armor headers...")

        // If it fails and doesn't have armor headers, try adding them
        if (!trimmedKey.includes("BEGIN PGP PUBLIC KEY")) {
          const armoredKey = `-----BEGIN PGP PUBLIC KEY BLOCK-----\n\n${trimmedKey}\n-----END PGP PUBLIC KEY BLOCK-----`
          try {
            pubKey = await openpgp.readKey({ armoredKey })
          } catch (wrappedError) {
            throw new Error(
              "Invalid public key format. Please ensure you're using a valid PGP public key in armored format (starting with -----BEGIN PGP PUBLIC KEY BLOCK-----).",
            )
          }
        } else {
          throw armoredError
        }
      }

      console.log("[v0] Public key read successfully")

      console.log("[v0] Creating message...")
      const messageObj = await openpgp.createMessage({ text: message })
      console.log("[v0] Message created successfully")

      console.log("[v0] Encrypting message...")
      const encrypted = await openpgp.encrypt({
        message: messageObj,
        encryptionKeys: pubKey,
      })
      console.log("[v0] Message encrypted successfully")

      setEncryptedMessage(encrypted as string)
    } catch (error) {
      console.error("[v0] Error encrypting message:", error)
      alert(
        `Failed to encrypt message: ${error instanceof Error ? error.message : "Please check your public key format."}`,
      )
    } finally {
      setLoading(false)
    }
  }

  const copyToClipboard = async () => {
    await navigator.clipboard.writeText(encryptedMessage)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="space-y-6">
      <h2 className="text-3xl font-semibold text-white">Encrypt a message</h2>

      <div className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="public-key" className="text-gray-300">
            Public Key
          </Label>
          <p className="text-sm text-gray-400">Paste the recipient's public key to encrypt the message.</p>
          <Textarea
            id="public-key"
            placeholder="-----BEGIN PGP PUBLIC KEY BLOCK-----&#10;&#10;-----END PGP PUBLIC KEY BLOCK-----"
            value={publicKey}
            onChange={(e) => setPublicKey(e.target.value)}
            className="bg-[#2a2a2a] border-gray-700 text-white placeholder:text-gray-500 font-mono text-sm h-32"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="message" className="text-gray-300">
            Message
          </Label>
          <p className="text-sm text-gray-400">Enter the message you want to encrypt.</p>
          <Textarea
            id="message"
            placeholder="Your secret message here..."
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            className="bg-[#2a2a2a] border-gray-700 text-white placeholder:text-gray-500 h-32"
          />
        </div>

        <Button
          onClick={encryptText}
          disabled={loading}
          className="bg-[#336f9c] text-white hover:bg-[#2a5a7d] font-semibold px-8"
        >
          {loading ? "Encrypting..." : "Encrypt"}
          <Lock className="w-5 h-5 ml-2" />
        </Button>
      </div>

      {encryptedMessage && (
        <div className="space-y-2 mt-8 pt-8 border-t border-gray-800">
          <div className="flex items-center justify-between">
            <Label className="text-gray-300 text-lg">Encrypted Message</Label>
            <Button variant="ghost" size="sm" onClick={copyToClipboard} className="text-gray-400 hover:text-white">
              {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
              <span className="ml-2">{copied ? "Copied!" : "Copy"}</span>
            </Button>
          </div>
          <Textarea
            value={encryptedMessage}
            readOnly
            className="bg-[#2a2a2a] border-gray-700 text-white font-mono text-sm h-64"
          />
        </div>
      )}
    </div>
  )
}
