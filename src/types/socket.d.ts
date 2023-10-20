declare module "socket" {
  export interface ServerToClientEvents {
    users: any;
    user_disconnected: any;
    session: ({
      userId,
      sessionId,
    }: {
      userId: string;
      sessionId: string;
    }) => void;
  }

  export interface ClientToServerEvents {}

  export interface InterServerEvents {}

  export interface SocketData {
    userId: string;
    sessionId: string;
  }
}

