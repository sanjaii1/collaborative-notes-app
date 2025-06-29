// src/hooks/useSocket.ts
import { useEffect } from "react";
import socket from "../services/socket";

export const useSocket = (
  event: string,
  callback: (...args: any[]) => void
): void => {
  useEffect(() => {
    socket.on(event, callback);

    return () => {
      socket.off(event, callback);
    };
  }, [event, callback]);
};
