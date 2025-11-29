import { ReactNode } from 'react';

export enum TopicId {
  BLIND_SSRF = 'blind_ssrf',
  CLOUD_METADATA = 'cloud_metadata',
  FILTER_BYPASS = 'filter_bypass',
  DNS_REBINDING = 'dns_rebinding'
}

export interface Topic {
  id: TopicId;
  title: string;
  description: string;
  icon: ReactNode;
  difficulty: 'Easy' | 'Medium' | 'Hard' | 'Expert';
}

export interface ChatMessage {
  role: 'user' | 'model';
  text: string;
  isError?: boolean;
}