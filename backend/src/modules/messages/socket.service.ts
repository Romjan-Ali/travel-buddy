import { Server } from 'socket.io'
import { messageService } from './message.service'

interface SocketUser {
  userId: string
  socketId: string
}

class SocketService {
  private io: Server | null = null
  private users: SocketUser[] = []

  initialize(server: any) {
    this.io = new Server(server, {
      cors: {
        origin: process.env.CLIENT_URL || 'http://localhost:3000',
        credentials: true,
      },
    })

    this.io.on('connection', (socket) => {
      console.log('User connected:', socket.id)

      // User joins their room
      socket.on('join', (userId: string) => {
        this.users = this.users.filter(u => u.userId !== userId)
        this.users.push({ userId, socketId: socket.id })
        socket.join(`user:${userId}`)
        console.log(`User ${userId} joined room`)
      })

      // Send message
      socket.on('send_message', async (data: {
        receiverId: string
        content: string
        matchId?: string
      }) => {
        try {
          const senderId = this.getUserIdBySocketId(socket.id)
          if (!senderId) return

          const message = await messageService.sendMessage(
            senderId,
            data.receiverId,
            data.content,
            data.matchId
          )

          // Emit to sender
          socket.emit('message_sent', message)

          // Emit to receiver if online
          const receiverSocket = this.getSocketIdByUserId(data.receiverId)
          if (receiverSocket) {
            this.io?.to(receiverSocket).emit('new_message', message)
          }

          // Also emit to both users' rooms
          this.io?.to(`user:${senderId}`).emit('new_message', message)
          this.io?.to(`user:${data.receiverId}`).emit('new_message', message)

        } catch (error) {
          socket.emit('message_error', error)
        }
      })

      // Typing indicator
      socket.on('typing', (data: { receiverId: string; isTyping: boolean }) => {
        const senderId = this.getUserIdBySocketId(socket.id)
        if (!senderId) return

        const receiverSocket = this.getSocketIdByUserId(data.receiverId)
        if (receiverSocket) {
          this.io?.to(receiverSocket).emit('user_typing', {
            userId: senderId,
            isTyping: data.isTyping,
          })
        }
      })

      // Mark as read
      socket.on('mark_as_read', async (data: { messageIds: string[] }) => {
        const userId = this.getUserIdBySocketId(socket.id)
        if (!userId) return

        await messageService.markAsRead(data.messageIds, userId)
        
        // Notify sender that messages were read
        data.messageIds.forEach(async (messageId) => {
          // You would need to fetch the message to get senderId
          // For simplicity, we'll skip this for now
        })
      })

      socket.on('disconnect', () => {
        this.users = this.users.filter(user => user.socketId !== socket.id)
        console.log('User disconnected:', socket.id)
      })
    })
  }

  private getUserIdBySocketId(socketId: string): string | null {
    const user = this.users.find(u => u.socketId === socketId)
    return user?.userId || null
  }

  private getSocketIdByUserId(userId: string): string | null {
    const user = this.users.find(u => u.userId === userId)
    return user?.socketId || null
  }

  emitToUser(userId: string, event: string, data: any) {
    const socketId = this.getSocketIdByUserId(userId)
    if (socketId) {
      this.io?.to(socketId).emit(event, data)
    }
  }
}

export const socketService = new SocketService()