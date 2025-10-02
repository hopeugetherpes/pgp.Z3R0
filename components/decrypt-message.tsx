"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Unlock, Eye, EyeOff, Copy, Check } from "lucide-react"

export function DecryptMessage() {
  const [encryptedMessage, setEncryptedMessage] = useState("")
  const [privateKey, setPrivateKey] = useState("")
  const [passphrase, setPassphrase] = useState("")
  const [showPassphrase, setShowPassphrase] = useState(false)
  const [decryptedMessage, setDecryptedMessage] = useState("")
  const [loading, setLoading] = useState(false)
  const [copied, setCopied] = useState(false)

  const decryptText = async () => {
    if (!encryptedMessage || !privateKey || !passphrase) {
      alert("Please provide encrypted message, private key, and passphrase")
      return
    }

    setLoading(true)
    try {
      const openpgp = await import("openpgp")

      console.log("[v0] Attempting to read private key...")
      const trimmedPrivateKey = privateKey.trim()
      let privKeyArmored = trimmedPrivateKey

      // Try to read the private key as-is first
      let privateKeyObj
      try {
        privateKeyObj = await openpgp.readPrivateKey({ armoredKey: privKeyArmored })
        console.log("[v0] Private key read successfully")
      } catch (error) {
        console.log("[v0] Failed to read as armored key, trying to add armor headers...")
        // If it fails and doesn't have armor headers, add them
        if (
          !trimmedPrivateKey.includes("-----BEGIN PGP PRIVATE KEY BLOCK-----") &&
          !trimmedPrivateKey.includes("-----END PGP PRIVATE KEY BLOCK-----")
        ) {
          privKeyArmored = `-----BEGIN PGP PRIVATE KEY BLOCK-----\n\n${trimmedPrivateKey}\n-----END PGP PRIVATE KEY BLOCK-----`
          privateKeyObj = await openpgp.readPrivateKey({ armoredKey: privKeyArmored })
          console.log("[v0] Private key read successfully after adding armor headers")
        } else {
          throw error
        }
      }

      console.log("[v0] Decrypting private key with passphrase...")
      const privKey = await openpgp.decryptKey({
        privateKey: privateKeyObj,
        passphrase,
      })
      console.log("[v0] Private key decrypted successfully")

      console.log("[v0] Attempting to read encrypted message...")
      const trimmedMessage = encryptedMessage.trim()
      let messageArmored = trimmedMessage

      // Try to read the message as-is first
      let message
      try {
        message = await openpgp.readMessage({
          armoredMessage: messageArmored,
        })
        console.log("[v0] Message read successfully")
      } catch (error) {
        console.log("[v0] Failed to read as armored message, trying to add armor headers...")
        // If it fails and doesn't have armor headers, add them
        if (
          !trimmedMessage.includes("-----BEGIN PGP MESSAGE-----") &&
          !trimmedMessage.includes("-----END PGP MESSAGE-----")
        ) {
          messageArmored = `-----BEGIN PGP MESSAGE-----\n\n${trimmedMessage}\n-----END PGP MESSAGE-----`
          message = await openpgp.readMessage({
            armoredMessage: messageArmored,
          })
          console.log("[v0] Message read successfully after adding armor headers")
        } else {
          throw error
        }
      }

      console.log("[v0] Decrypting message...")
      const { data: decrypted } = await openpgp.decrypt({
        message,
        decryptionKeys: privKey,
      })
      console.log("[v0] Message decrypted successfully")

      setDecryptedMessage(decrypted as string)
    } catch (error) {
      console.error("[v0] Error decrypting message:", error)
      alert(
        `Failed to decrypt message: ${error instanceof Error ? error.message : "Please check your private key and passphrase."}`,
      )
    } finally {
      setLoading(false)
    }
  }

  const copyToClipboard = async () => {
    await navigator.clipboard.writeText(decryptedMessage)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="space-y-6">
      <h2 className="text-3xl font-semibold text-white">Decrypt a message</h2>

      <div className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="encrypted-message" className="text-gray-300">
            Encrypted Message
          </Label>
          <p className="text-sm text-gray-400">Paste the PGP encrypted message you want to decrypt.</p>
          <Textarea
            id="encrypted-message"
            placeholder="-----BEGIN PGP MESSAGE-----&#10;&#10;-----END PGP MESSAGE-----"
            value={encryptedMessage}
            onChange={(e) => setEncryptedMessage(e.target.value)}
            className="bg-[#2a2a2a] border-gray-700 text-white placeholder:text-gray-500 font-mono text-sm h-32"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="private-key" className="text-gray-300">
            Private Key
          </Label>
          <p className="text-sm text-gray-400">Paste your private key to decrypt the message.</p>
          <Textarea
            id="private-key"
            placeholder="-----BEGIN PGP PRIVATE KEY BLOCK-----&#10;&#10;-----END PGP PRIVATE KEY BLOCK-----"
            value={privateKey}
            onChange={(e) => setPrivateKey(e.target.value)}
            className="bg-[#2a2a2a] border-gray-700 text-white placeholder:text-gray-500 font-mono text-sm h-32"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="decrypt-passphrase" className="text-gray-300">
            Passphrase
          </Label>
          <p className="text-sm text-gray-400">Enter the passphrase for your private key.</p>
          <div className="relative">
            <Input
              id="decrypt-passphrase"
              type={showPassphrase ? "text" : "password"}
              placeholder="Your passphrase"
              value={passphrase}
              onChange={(e) => setPassphrase(e.target.value)}
              className="bg-[#2a2a2a] border-gray-700 text-white placeholder:text-gray-500 pr-10"
            />
            <button
              type="button"
              onClick={() => setShowPassphrase(!showPassphrase)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white"
            >
              {showPassphrase ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
            </button>
          </div>
        </div>

        <Button
          onClick={decryptText}
          disabled={loading}
          className="bg-[#336f9c] text-white hover:bg-[#2a5a7d] font-semibold px-8"
        >
          {loading ? "Decrypting..." : "Decrypt"}
          <Unlock className="w-5 h-5 ml-2" />
        </Button>
      </div>

      {decryptedMessage && (
        <div className="space-y-2 mt-8 pt-8 border-t border-gray-800">
          <div className="flex items-center justify-between">
            <Label className="text-gray-300 text-lg">Decrypted Message</Label>
            <Button variant="ghost" size="sm" onClick={copyToClipboard} className="text-gray-400 hover:text-white">
              {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
              <span className="ml-2">{copied ? "Copied!" : "Copy"}</span>
            </Button>
          </div>
          <Textarea value={decryptedMessage} readOnly className="bg-[#2a2a2a] border-gray-700 text-white h-32" />
        </div>
      )}
    </div>
  )
}
