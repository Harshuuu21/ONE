'use client';

import { useState } from 'react';
import { ChatService } from '../services/chat.service';
import type { ChatMessage } from '../types';

export function useChat() {
  const [messages, setMessages] = useState<ChatMessage[]>(ChatService.getInitialMessages());
  const [isTyping, setIsTyping] = useState(false);

  const sendMessage = async (text: string) => {
    if (!text.trim()) return;

    const userMsg: ChatMessage = {
      id: Date.now().toString(),
      role: 'user',
      content: text,
      timestamp: 'Now',
    };

    setMessages((prev) => [...prev, userMsg]);
    setIsTyping(true);

    const reply = await ChatService.sendQuery(text);

    setMessages((prev) => [
      ...prev,
      {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: reply,
        timestamp: 'Just now',
      },
    ]);
    setIsTyping(false);
  };

  return {
    messages,
    isTyping,
    sendMessage,
  };
}

