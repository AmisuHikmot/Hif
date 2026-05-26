"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { useToast } from "@/components/ui/use-toast"
import { createClient } from "@/lib/supabase/client"
import { CheckCircle, Trash2, Loader2 } from "lucide-react"

interface NotificationActionsProps {
  userId: string
  hasNotifications: boolean
}

export default function NotificationActions({ userId, hasNotifications }: NotificationActionsProps) {
  const { toast } = useToast()
  const router = useRouter()
  const [isMarkingRead, setIsMarkingRead] = useState(false)
  const [isClearing, setIsClearing] = useState(false)

  const handleMarkAllRead = async () => {
    setIsMarkingRead(true)
    try {
      const supabase = createClient()
      const { error } = await supabase
        .from("notifications")
        .update({ is_read: true })
        .eq("user_id", userId)
        .eq("is_read", false)

      if (error) throw error

      toast({
        title: "All notifications marked as read",
      })
      router.refresh()
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to mark notifications as read.",
        variant: "destructive",
      })
    } finally {
      setIsMarkingRead(false)
    }
  }

  const handleClearAll = async () => {
    setIsClearing(true)
    try {
      const supabase = createClient()
      const { error } = await supabase.from("notifications").delete().eq("user_id", userId)

      if (error) throw error

      toast({
        title: "All notifications cleared",
      })
      router.refresh()
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to clear notifications.",
        variant: "destructive",
      })
    } finally {
      setIsClearing(false)
    }
  }

  if (!hasNotifications) return null

  return (
    <div className="flex gap-2">
      <Button variant="outline" className="bg-transparent" onClick={handleMarkAllRead} disabled={isMarkingRead}>
        {isMarkingRead ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <CheckCircle className="mr-2 h-4 w-4" />}
        Mark All Read
      </Button>
      <Button
        variant="outline"
        className="text-destructive hover:text-destructive bg-transparent"
        onClick={handleClearAll}
        disabled={isClearing}
      >
        {isClearing ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Trash2 className="mr-2 h-4 w-4" />}
        Clear All
      </Button>
    </div>
  )
}
