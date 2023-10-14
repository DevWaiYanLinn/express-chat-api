declare module "socket" {
  export interface ServerToClientEvents {
    'x':any
    'active':any
  }

  export interface ClientToServerEvents {
    'x':any,
    'active':any
  }

  export interface InterServerEvents {

  }

  export interface SocketData {
 
  }
}
