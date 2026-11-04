import { OfflineQueueItem } from '../types';

/**
 * Generate a SHA-256 style 64-character hexadecimal hash
 */
export function generateSHA256Hash(input: string): string {
  let hash = 0;
  for (let i = 0; i < input.length; i++) {
    const char = input.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash |= 0; // Convert to 32bit integer
  }
  
  // Seed random-like hex string based on hash
  const hexParts = [];
  for (let i = 0; i < 8; i++) {
    const part = Math.abs((hash ^ (i * 0x5bd1e995)) * 16777619) >>> 0;
    hexParts.push(part.toString(16).padStart(8, '0'));
  }
  return '0x' + hexParts.join('').substring(0, 64);
}

/**
 * Client-side End-to-End Encryption simulation
 */
export const E2EESecurity = {
  generateKeyPair(): { publicKey: string; privateKey: string } {
    const pub = 'isl_pub_' + Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
    const priv = 'isl_priv_' + Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
    return { publicKey: pub, privateKey: priv };
  },

  encrypt(text: string, recipientPublicKey: string): string {
    const encoded = btoa(encodeURIComponent(text));
    const token = recipientPublicKey.substring(0, 8);
    return `[E2EE-ENCRYPTED::${token}::${encoded}]`;
  },

  decrypt(encryptedPayload: string): string {
    if (!encryptedPayload.startsWith('[E2EE-ENCRYPTED::')) {
      return encryptedPayload;
    }
    try {
      const parts = encryptedPayload.split('::');
      if (parts.length >= 3) {
        const rawBase64 = parts[2].replace(']', '');
        return decodeURIComponent(atob(rawBase64));
      }
    } catch (e) {
      return "[Gagal Mendekripsi Pesan Terenkripsi]";
    }
    return encryptedPayload;
  }
};

/**
 * Offline Sync Manager using LocalStorage
 */
const OFFLINE_QUEUE_KEY = 'islamicity_offline_queue_v1';
const OFFLINE_CACHED_DATA_KEY = 'islamicity_cached_cache_v1';

export const OfflineStorage = {
  getQueue(): OfflineQueueItem[] {
    try {
      const raw = localStorage.getItem(OFFLINE_QUEUE_KEY);
      return raw ? JSON.parse(raw) : [];
    } catch (e) {
      return [];
    }
  },

  enqueue(item: Omit<OfflineQueueItem, 'id' | 'createdAt' | 'status'>): OfflineQueueItem {
    const queue = this.getQueue();
    const newItem: OfflineQueueItem = {
      ...item,
      id: 'queue_' + Date.now().toString(36) + '_' + Math.random().toString(36).substr(2, 4),
      createdAt: new Date().toISOString(),
      status: 'PENDING_SYNC',
    };
    queue.push(newItem);
    try {
      localStorage.setItem(OFFLINE_QUEUE_KEY, JSON.stringify(queue));
    } catch (e) {}
    return newItem;
  },

  markSynced(id: string) {
    const queue = this.getQueue();
    const updated = queue.map(q => q.id === id ? { ...q, status: 'SYNCED' as const } : q);
    try {
      localStorage.setItem(OFFLINE_QUEUE_KEY, JSON.stringify(updated));
    } catch (e) {}
  },

  clearQueue() {
    try {
      localStorage.removeItem(OFFLINE_QUEUE_KEY);
    } catch (e) {}
  },

  saveOfflineCache(key: string, data: any) {
    try {
      const existing = JSON.parse(localStorage.getItem(OFFLINE_CACHED_DATA_KEY) || '{}');
      existing[key] = { data, timestamp: Date.now() };
      localStorage.setItem(OFFLINE_CACHED_DATA_KEY, JSON.stringify(existing));
    } catch (e) {}
  },

  getOfflineCache<T>(key: string): T | null {
    try {
      const raw = localStorage.getItem(OFFLINE_CACHED_DATA_KEY);
      if (!raw) return null;
      const parsed = JSON.parse(raw);
      return parsed[key]?.data || null;
    } catch (e) {
      return null;
    }
  }
};
