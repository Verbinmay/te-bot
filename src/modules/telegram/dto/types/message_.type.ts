export type Message_ = {
  message_id?: number;
  from?: {
    id?: number;
    is_bot?: boolean;
    first_name?: string;
    username?: string;
  };
  chat?: {
    id?: number;
    first_name?: string;
    username?: string;
  };
  date?: number;
  text?: string;
};
