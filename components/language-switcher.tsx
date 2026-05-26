"use client"

import { useState } from "react"
import { Check, Globe } from "lucide-react"
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { useLanguage } from "@/contexts/language-context"

export function LanguageSwitcher() {
  const { language, setLanguage, t } = useLanguage()
  const [open, setOpen] = useState(false)

  return (
    <DropdownMenu open={open} onOpenChange={setOpen}>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="sm" className="h-8 w-8 px-0">
          <Globe className="h-4 w-4" />
          <span className="sr-only">Switch language</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem
          onClick={() => {
            setLanguage("en")
            setOpen(false)
          }}
        >
          <span className="flex items-center">
            {language === "en" && <Check className="mr-2 h-4 w-4" />}
            <span className={language === "en" ? "font-medium" : ""}>{t("language.english")}</span>
          </span>
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={() => {
            setLanguage("ar")
            setOpen(false)
          }}
        >
          <span className="flex items-center">
            {language === "ar" && <Check className="mr-2 h-4 w-4" />}
            <span className={language === "ar" ? "font-medium" : ""}>{t("language.arabic")}</span>
          </span>
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={() => {
            setLanguage("ha")
            setOpen(false)
          }}
        >
          <span className="flex items-center">
            {language === "ha" && <Check className="mr-2 h-4 w-4" />}
            <span className={language === "ha" ? "font-medium" : ""}>{t("language.hausa")}</span>
          </span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
