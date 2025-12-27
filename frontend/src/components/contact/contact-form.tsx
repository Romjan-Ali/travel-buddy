'use client'

import { useState } from 'react'
import emailjs from '@emailjs/browser'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Send, LoaderCircle } from 'lucide-react'

const initialMessageData = {
  name: '',
  email: '',
  subject: '',
  message: '',
}

export function ContactForm() {
  const [messageData, setMessageData] = useState(initialMessageData)
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (loading) return

    setLoading(true)

    try {
      await emailjs.send(
        process.env.NEXT_PUBLIC_EMAILJS_SERVICE_ID!,
        process.env.NEXT_PUBLIC_EMAILJS_TEMPLATE_ID!,
        {
          to_name: 'Romjan Ali',
          from_name: messageData.name,
          from_email: messageData.email,
          subject: messageData.subject,
          message: messageData.message,
        },
        {
          publicKey: process.env.NEXT_PUBLIC_EMAILJS_PUBLIC_KEY!,
        }
      )

      toast.success('Message sent successfully 🚀')
      setMessageData(initialMessageData)
    } catch (error) {
      console.error(error)
      toast.error('Failed to send message')
    } finally {
      setLoading(false)
    }
  }

  return (
    <form className="space-y-6" onSubmit={handleSubmit}>
      <div className="grid md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <label htmlFor="name" className="text-sm font-medium">
            Full Name *
          </label>
          <Input
            id="name"
            placeholder="Romjan Ali"
            value={messageData.name}
            onChange={(e) =>
              setMessageData((prev) => ({
                ...prev,
                name: e.target.value,
              }))
            }
            required
          />
        </div>

        <div className="space-y-2">
          <label htmlFor="email" className="text-sm font-medium">
            Email Address *
          </label>
          <Input
            id="email"
            type="email"
            placeholder="romjan@example.com"
            value={messageData.email}
            onChange={(e) =>
              setMessageData((prev) => ({
                ...prev,
                email: e.target.value,
              }))
            }
            required
          />
        </div>
      </div>

      <div className="space-y-2">
        <label htmlFor="subject" className="text-sm font-medium">
          Subject *
        </label>
        <Input
          id="subject"
          placeholder="Project Collaboration"
          value={messageData.subject}
          onChange={(e) =>
            setMessageData((prev) => ({
              ...prev,
              subject: e.target.value,
            }))
          }
          required
        />
      </div>

      <div className="space-y-2">
        <label htmlFor="message" className="text-sm font-medium">
          Message *
        </label>
        <Textarea
          id="message"
          rows={6}
          placeholder="Tell me about your project..."
          value={messageData.message}
          onChange={(e) =>
            setMessageData((prev) => ({
              ...prev,
              message: e.target.value,
            }))
          }
          required
        />
      </div>

      <Button
        type="submit"
        className="w-full"
        disabled={loading}
      >
        {loading ? (
          <LoaderCircle className="h-5 w-5 animate-spin" />
        ) : (
          <>
            <Send className="mr-2 h-4 w-4" />
            Send Message
          </>
        )}
      </Button>
    </form>
  )
}
