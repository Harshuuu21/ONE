import type { Conversation, LendingRequest } from '@/types';

export type CommunityTab = 'feed' | 'lending' | 'leaderboard';

export interface PeerDiscussion extends Conversation {
  likes?: number;
  commentsCount?: number;
}

export type { Conversation, LendingRequest };

