"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Key, Eye, EyeOff, Copy, Check } from "lucide-react"

export function GenerateKeys() {
  const [email, setEmail] = useState("")
  const [passphrase, setPassphrase] = useState("")
  const [showPassphrase, setShowPassphrase] = useState(false)
  const [curve, setCurve] = useState("curve25519")
  const [loading, setLoading] = useState(false)
  const [publicKey, setPublicKey] = useState("")
  const [privateKey, setPrivateKey] = useState("")
  const [copiedPublic, setCopiedPublic] = useState(false)
  const [copiedPrivate, setCopiedPrivate] = useState(false)

  const generateKeyPair = async () => {
    if (!email || !passphrase) {
      alert("Please provide both email and passphrase")
      return
    }

    setLoading(true)
    try {
      const openpgp = await import("openpgp")

      const keyOptions: any = {
        userIDs: [{ email }],
        passphrase,
        curve,
      }

      const { privateKey: privKey, publicKey: pubKey } = await openpgp.generateKey(keyOptions)

      setPublicKey(pubKey)
      setPrivateKey(privKey)
    } catch (error) {
      console.error("Error generating keys:", error)
      alert(`Failed to generate keys: ${error instanceof Error ? error.message : "Unknown error"}`)
    } finally {
      setLoading(false)
    }
  }

  const copyToClipboard = async (text: string, type: "public" | "private") => {
    await navigator.clipboard.writeText(text)
    if (type === "public") {
      setCopiedPublic(true)
      setTimeout(() => setCopiedPublic(false), 2000)
    } else {
      setCopiedPrivate(true)
      setTimeout(() => setCopiedPrivate(false), 2000)
    }
  }

  return (
    <div className="space-y-6">
      <h2 className="text-3xl font-semibold text-white">Generate a PGP key pair</h2>

      <div className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="email" className="text-gray-300">
            Email
          </Label>
          <Input
            id="email"
            type="email"
            placeholder="email@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="bg-[#2a2a2a] border-gray-700 text-white placeholder:text-gray-500"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="passphrase" className="text-gray-300">
            Passphrase
          </Label>
          <p className="text-sm text-gray-400">
            There is no way to recover your passphrase so be sure not to forget it.
          </p>
          <div className="relative">
            <Input
              id="passphrase"
              type={showPassphrase ? "text" : "password"}
              placeholder="a-str0ng_p@ssphrast!"
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

        <div className="space-y-2">
          <Label htmlFor="curve" className="text-gray-300">
            Curve Encryption
          </Label>
          <p className="text-sm text-gray-400">
            Choose the type of encryption for your key pair. <em>Brainpool</em> and <em>secp256k1</em> curves are no
            longer supported.{" "}
            <a
              href="https://github.com/openpgpjs/openpgpjs/pull/1395"
              target="_blank"
              rel="noopener noreferrer"
              className="font-bold no-underline hover:underline"
              style={{ color: "#336f9c" }}
            >
              See more
            </a>
          </p>
          <Select value={curve} onValueChange={setCurve}>
            <SelectTrigger className="bg-[#2a2a2a] border-gray-700 text-white">
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="bg-[#2a2a2a] border-gray-700 text-white">
              <SelectItem value="curve25519">Curve25519</SelectItem>
              <SelectItem value="ed25519">Ed25519</SelectItem>
              <SelectItem value="p256">P-256</SelectItem>
              <SelectItem value="p384">P-384</SelectItem>
              <SelectItem value="p521">P-521</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <Button
          onClick={generateKeyPair}
          disabled={loading}
          className="bg-[#336f9c] text-white hover:bg-[#2a5a7d] font-semibold px-8"
        >
          {loading ? "Generating..." : "Generate"}
          <Key className="w-5 h-5 ml-2" />
        </Button>
      </div>

      {publicKey && privateKey && (
        <div className="space-y-6 mt-8 pt-8 border-t border-gray-800">
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label className="text-gray-300 text-lg">Public Key</Label>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => copyToClipboard(publicKey, "public")}
                className="text-gray-400 hover:text-white"
              >
                {copiedPublic ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                <span className="ml-2">{copiedPublic ? "Copied!" : "Copy"}</span>
              </Button>
            </div>
            <Textarea
              value={publicKey}
              readOnly
              className="bg-[#2a2a2a] border-gray-700 text-white font-mono text-sm h-40"
            />
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label className="text-gray-300 text-lg">Private Key</Label>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => copyToClipboard(privateKey, "private")}
                className="text-gray-400 hover:text-white"
              >
                {copiedPrivate ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                <span className="ml-2">{copiedPrivate ? "Copied!" : "Copy"}</span>
              </Button>
            </div>
            <Textarea
              value={privateKey}
              readOnly
              className="bg-[#2a2a2a] border-gray-700 text-white font-mono text-sm h-40"
            />
            <p className="text-sm text-yellow-500">⚠️ Keep your private key secure! Never share it with anyone.</p>
          </div>
        </div>
      )}
    </div>
  )
}
