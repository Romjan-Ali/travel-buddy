// frontend/components/messages/quick-chat.tsx
'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogTrigger } from '@/components/ui/dialog'
import { ChatWindow } from './chat-window'
import { MessageSquare, X } from 'lucide-react'

interface QuickChatProps {
  otherUser: {
    id: string
    profile?: {
      fullName: string
      profileImage?: string | null
    }
  }
  matchId?: string
  triggerText?: string
  variant?: 'default' | 'outline' | 'ghost'
  size?: 'default' | 'sm' | 'lg' | 'icon'
}

export function QuickChat({ 
  otherUser, 
  matchId, 
  triggerText = 'Message',
  variant = 'default',
  size = 'default'
}: QuickChatProps) {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant={variant} size={size} className="gap-2">
          <MessageSquare className="h-4 w-4" />
          {triggerText}
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-4xl h-[80vh] p-0">
        <div className="relative h-full">
          <Button
            variant="ghost"
            size="icon"
            className="absolute right-4 top-4 z-50"
            onClick={() => setIsOpen(false)}
          >
            <X className="h-4 w-4" />
          </Button>
          <ChatWindow 
            otherUser={otherUser} 
            matchId={matchId}
            onClose={() => setIsOpen(false)}
          />
        </div>
      </DialogContent>
    </Dialog>
  )
}