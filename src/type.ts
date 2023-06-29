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
export type Message_Inline = {
  update_id?: number;
  callback_query?: {
    id?: string;
    from?: {
      id?: number;
      is_bot?: false;
      first_name?: string;
      username?: string;
      language_code?: string;
    };
    message?: {
      message_id?: number;
      from?: any;
      chat?: any;
      date?: number;
      sticker?: any;
      reply_markup?: any;
    };
    chat_instance?: string;
    data?: string;
  };
};
