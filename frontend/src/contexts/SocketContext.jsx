import { createContext, useContext, useEffect, useRef, useState, useCallback } from 'react';
import { io } from 'socket.io-client';

const SocketContext = createContext(null);

export const SocketProvider = ({ children }) => {
  const url = import.meta.env.VITE_API_URL || 'http://localhost:3000';
  const socketRef = useRef(null);
  const [isConnected, setIsConnected] = useState(false);

  const initializeSocket = useCallback(() => {
    const socket = io(url, {
      autoConnect: true,
      reconnection: true,
      reconnectionDelay: 1000,
      reconnectionDelayMax: 5000,
      reconnectionAttempts: 5,
      timeout: 20000,
      withCredentials: true,
    });
    socketRef.current = socket;

    socket.on('connect', () => setIsConnected(true));
    socket.on('disconnect', () => setIsConnected(false));
    socket.on('connect_error', () => setIsConnected(false));

    return socket;
  }, [url]);

  const emit = useCallback((event, data) => {
    if (socketRef.current?.connected) socketRef.current.emit(event, data);
  }, []);

  const on = useCallback((event, handler) => {
    if (!socketRef.current) return;
    socketRef.current.on(event, handler);
    return () => socketRef.current?.off(event, handler);
  }, []);

  useEffect(() => {
    const socket = initializeSocket();
    return () => socket.disconnect();
  }, [initializeSocket]);

  return (
    <SocketContext.Provider value={{ socket: socketRef.current, isConnected, emit, on }}>
      {children}
    </SocketContext.Provider>
  );
};

export const useSocket = () => {
  const context = useContext(SocketContext);
  if (!context) throw new Error('useSocket must be used within a SocketProvider');
  return context;
};

export const useSocketEvent = (event, handler, dependencies = []) => {
  const { on, socket } = useSocket();

  useEffect(() => {
    if (!event || !handler) return;
    const cleanup = on(event, handler);
    return cleanup;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [event, socket, on, ...dependencies]);
};
