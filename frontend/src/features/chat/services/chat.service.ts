import type { ChatMessage } from '../types';

export class ChatService {
  static getInitialMessages(): ChatMessage[] {
    return [
      {
        id: '1',
        role: 'assistant',
        content: "Good day! I'm ONE, your ambient financial partner. How can I assist you with your decisions today? You can ask about your goals, safe-to-spend limits, or upcoming trips.",
        timestamp: 'Just now',
      },
    ];
  }

  static async sendQuery(query: string): Promise<string> {
    await new Promise((r) => setTimeout(r, 600));
    const text = query.toLowerCase();
    if (text.includes('dining') || text.includes('spend')) {
      return "Based on your recurring subscriptions and planned bills for this cycle, you have $185 in safe discretionary spend for dining this weekend without dipping into your emergency buffer.";
    } else if (text.includes('tokyo') || text.includes('trip') || text.includes('japan')) {
      return "You're 54% funded for Tokyo and currently 3 weeks ahead of schedule. At your current pace of $420/month, you'll hit your full $3,800 target by April with room for flight upgrades.";
    } else if (text.includes('lend') || text.includes('community')) {
      return "Yes! You have sufficient liquidity, and backing Daniel's tool purchase ($170) would keep you well within your community allocation while earning 4 reputation points.";
    }
    return "I've reviewed your latest data. Your cash reserves are strong, you're currently 9% under your target burn rate, and your trajectory remains positive. Would you like me to model how this impacts your savings goals?";
  }
}

