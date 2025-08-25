"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Dialog, DialogContent } from "@/components/ui/dialog"
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command"
import { useLanguage } from "@/contexts/language-context"

interface SearchDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function SearchDialog({ open, onOpenChange }: SearchDialogProps) {
  const { t } = useLanguage()
  const router = useRouter()
  const [searchQuery, setSearchQuery] = useState("")

  // Reset search query when dialog opens
  useEffect(() => {
    if (open) {
      setSearchQuery("")
    }
  }, [open])

  const handleSearch = () => {
    if (searchQuery.trim()) {
      router.push(`/search?q=${encodeURIComponent(searchQuery.trim())}`)
      onOpenChange(false)
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleSearch()
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="p-0 gap-0 max-w-3xl">
        <Command className="rounded-lg border shadow-md">
          <CommandInput
            placeholder={t("search.placeholder")}
            value={searchQuery}
            onValueChange={setSearchQuery}
            onKeyDown={handleKeyDown}
            className="h-12"
          />
          <CommandList>
            <CommandEmpty>No results found.</CommandEmpty>
            <CommandGroup heading="Quick Links">
              <CommandItem
                onSelect={() => {
                  router.push("/events")
                  onOpenChange(false)
                }}
              >
                Events
              </CommandItem>
              <CommandItem
                onSelect={() => {
                  router.push("/about/history")
                  onOpenChange(false)
                }}
              >
                History
              </CommandItem>
              <CommandItem
                onSelect={() => {
                  router.push("/donate")
                  onOpenChange(false)
                }}
              >
                Donate
              </CommandItem>
              <CommandItem
                onSelect={() => {
                  router.push("/members")
                  onOpenChange(false)
                }}
              >
                Members Directory
              </CommandItem>
            </CommandGroup>
          </CommandList>
        </Command>
      </DialogContent>
    </Dialog>
  )
}
