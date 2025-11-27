"use client"

import { useState } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { GenerateKeys } from "@/components/generate-keys"
import { EncryptMessage } from "@/components/encrypt-message"
import { DecryptMessage } from "@/components/decrypt-message"
import { Key, Lock, Unlock } from "lucide-react"
import Image from "next/image"

export default function PGPTool() {
  const [activeTab, setActiveTab] = useState("generate")

  return (
    <div className="min-h-screen bg-[#1a1a1a] text-white pb-48">
      {/* Header */}
      <header className="border-b border-gray-800 px-6 py-4">
        <div className="flex items-center justify-between">
          <a
            href="https://pgp-offline.anatole.co"
            className="flex items-center gap-3 no-underline hover:opacity-80 transition-opacity"
          >
            <Image src="/logo.png" alt="PGP Logo" width={48} height={48} className="w-12 h-12 rounded" />
            <h1 className="text-2xl font-mono">
              <span className="text-white">PGP </span>
              <span className="text-[#336f9c] font-bold">Z3R0</span>
            </h1>
          </a>

          <a
            href="https://github.com/hopeugetherpes/pgp.Z3R0"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:opacity-80 transition-opacity"
            title="View on GitHub"
          >
            <Image src="/github-logo.png" alt="GitHub" width={70} height={70} className="w-[70px] h-[70px]" />
          </a>
        </div>
      </header>

      <div className="flex">
        {/* Sidebar */}
        <aside className="w-24 border-r border-gray-800 flex flex-col items-center py-8 gap-6">
          <button
            onClick={() => setActiveTab("generate")}
            className={`p-4 rounded transition-colors ${
              activeTab === "generate" ? "bg-[#336f9c] text-white" : "bg-gray-800 text-white hover:bg-gray-700"
            }`}
            title="Generate Keys"
          >
            <Key className="w-6 h-6" />
          </button>
          <button
            onClick={() => setActiveTab("encrypt")}
            className={`p-4 rounded transition-colors ${
              activeTab === "encrypt" ? "bg-[#336f9c] text-white" : "bg-gray-800 text-white hover:bg-gray-700"
            }`}
            title="Encrypt Message"
          >
            <Lock className="w-6 h-6" />
          </button>
          <button
            onClick={() => setActiveTab("decrypt")}
            className={`p-4 rounded transition-colors ${
              activeTab === "decrypt" ? "bg-[#336f9c] text-white" : "bg-gray-800 text-white hover:bg-gray-700"
            }`}
            title="Decrypt Message"
          >
            <Unlock className="w-6 h-6" />
          </button>
        </aside>

        {/* Main Content */}
        <main className="flex-1 p-8">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full max-w-4xl mx-auto">
            <TabsList className="hidden">
              <TabsTrigger value="generate">Generate</TabsTrigger>
              <TabsTrigger value="encrypt">Encrypt</TabsTrigger>
              <TabsTrigger value="decrypt">Decrypt</TabsTrigger>
            </TabsList>

            <TabsContent value="generate" className="mt-0">
              <GenerateKeys />
            </TabsContent>

            <TabsContent value="encrypt" className="mt-0">
              <EncryptMessage />
            </TabsContent>

            <TabsContent value="decrypt" className="mt-0">
              <DecryptMessage />
            </TabsContent>
          </Tabs>
        </main>
      </div>

      <div className="fixed bottom-20 left-0 right-0 px-6">
        <div className="max-w-5xl mx-auto"></div>
      </div>

      {/* Footer */}
      <footer className="fixed bottom-0 left-0 right-0 border-t border-gray-800 bg-[#1a1a1a] px-6 py-4">
        <div className="flex flex-col items-center justify-center text-sm text-gray-400 gap-1">
          <span>Free and Open Source - Privacy by design</span>
          <span>
            <a
              href="https://creativecommons.org/public-domain/cc0/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-[#336f9c] no-underline hover:underline"
            >
              CC0
            </a>{" "}
            Public Domain - No Copyright Required
          </span>
        </div>
      </footer>
    </div>
  )
}
