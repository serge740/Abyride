import {
  WebSocketGateway,
  WebSocketServer,
  SubscribeMessage,
  MessageBody,
  ConnectedSocket,
  OnGatewayConnection,
  OnGatewayDisconnect,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';

@WebSocketGateway({
  cors: {
    origin: process.env.CORS_ORIGIN || 'http://localhost:5173',
    credentials: true,
  },
})
export class AppSocketGateway
  implements OnGatewayConnection, OnGatewayDisconnect
{
  @WebSocketServer()
  server: Server;

  adminSockets = new Map<string, Set<string>>();
  driverSockets = new Map<string, Set<string>>();
  memberSockets = new Map<string, Set<string>>();

  handleConnection(socket: Socket) {
    console.log(`Socket connected: ${socket.id}`);
  }

  handleDisconnect(socket: Socket) {
    this.removeSocketFromMaps(socket.id);
  }

  private removeSocketFromMaps(socketId: string) {
    this.adminSockets.forEach((set, adminId) => {
      if (set.delete(socketId) && set.size === 0) {
        this.adminSockets.delete(adminId);
      }
    });
    this.driverSockets.forEach((set, driverId) => {
      if (set.delete(socketId) && set.size === 0) {
        this.driverSockets.delete(driverId);
      }
    });
    this.memberSockets.forEach((set, memberId) => {
      if (set.delete(socketId) && set.size === 0) {
        this.memberSockets.delete(memberId);
      }
    });
  }

  @SubscribeMessage('registerUser')
  registerUser(
    @MessageBody() data: { id: string; type: 'ADMIN' | 'DRIVER' | 'MEMBER' },
    @ConnectedSocket() socket: Socket,
  ) {
    if (!data?.id || !data?.type) return;

    if (data.type === 'ADMIN') {
      if (!this.adminSockets.has(data.id)) this.adminSockets.set(data.id, new Set());
      this.adminSockets.get(data.id)?.add(socket.id);
    }

    if (data.type === 'DRIVER') {
      if (!this.driverSockets.has(data.id)) this.driverSockets.set(data.id, new Set());
      this.driverSockets.get(data.id)?.add(socket.id);
    }

    if (data.type === 'MEMBER') {
      if (!this.memberSockets.has(data.id)) this.memberSockets.set(data.id, new Set());
      this.memberSockets.get(data.id)?.add(socket.id);
    }

    return { success: true };
  }

  emitToAdmin(adminId: string, event: string, data: any) {
    const sockets = this.adminSockets.get(adminId);
    if (!sockets) return;
    sockets.forEach((socketId) => this.server.to(socketId).emit(event, data));
  }

  emitToDriver(driverId: string, event: string, data: any) {
    const sockets = this.driverSockets.get(driverId);
    if (!sockets) return;
    sockets.forEach((socketId) => this.server.to(socketId).emit(event, data));
  }

  emitToMember(memberId: string, event: string, data: any) {
    const sockets = this.memberSockets.get(memberId);
    if (!sockets) return;
    sockets.forEach((socketId) => this.server.to(socketId).emit(event, data));
  }

  emitToAllAdmins(event: string, data: any) {
    this.adminSockets.forEach((sockets) => {
      sockets.forEach((socketId) => this.server.to(socketId).emit(event, data));
    });
  }

  emitToAllDrivers(event: string, data: any) {
    this.driverSockets.forEach((sockets) => {
      sockets.forEach((socketId) => this.server.to(socketId).emit(event, data));
    });
  }
}
