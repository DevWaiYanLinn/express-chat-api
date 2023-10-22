declare module "socket" {
  export interface ServerToClientEvents {
    users: any;
    user_disconnect: (userId: string) => void;
    user_connect: string;
    session: ({
      userId,
      sessionId,
    }: {
      userId: string;
      sessionId: string;
    }) => void;
    send_message: ({
      conversation,
      from,
      to,
      content,
      messageAt,
    }: {
      _id: string;
      conversation: string;
      from: string;
      to: string;
      content: string;
      messageAt: string;
    }) => void;
  }

  export interface ClientToServerEvents {
    send_message: ({
      conversation,
      from,
      to,
      content,
      messageAt,
    }: {
      conversation: string;
      from: string;
      to: string;
      content: string;
      messageAt: string;
    }) => void;
  }

  export interface InterServerEvents {}

  export interface SocketData {
    userId: string;
  }
}
