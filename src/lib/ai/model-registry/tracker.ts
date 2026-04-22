import type { ModelUsageRecord } from './types';
import { loadUsageRecords, saveUsageRecords, addUsageRecord as addRecord } from './storage';
import { nanoid } from 'nanoid';

export class UsageTracker {
  static recordUsage(record: Omit<ModelUsageRecord, 'id'>): ModelUsageRecord {
    const fullRecord: ModelUsageRecord = {
      ...record,
      id: `usage_${nanoid()}`,
    };
    addRecord(fullRecord);
    return fullRecord;
  }

  static getUsageStats(modelId: string, timeRangeHours: number = 24): {
    totalCalls: number;
    successCalls: number;
    failedCalls: number;
    fallbackCalls: number;
    totalTokens: number;
    avgLatencyMs: number;
    successRate: number;
  } {
    const records = loadUsageRecords();
    const cutoff = new Date(Date.now() - timeRangeHours * 60 * 60 * 1000).toISOString();
    const filtered = records.filter(r => r.modelId === modelId && r.timestamp >= cutoff);
    
    const totalCalls = filtered.length;
    const successCalls = filtered.filter(r => r.status === 'success').length;
    const failedCalls = filtered.filter(r => r.status === 'error' || r.status === 'timeout').length;
    const fallbackCalls = filtered.filter(r => r.status === 'fallback').length;
    const totalTokens = filtered.reduce((sum, r) => sum + r.tokensUsed, 0);
    const avgLatencyMs = totalCalls > 0 ? filtered.reduce((sum, r) => sum + r.latencyMs, 0) / totalCalls : 0;
    const successRate = totalCalls > 0 ? successCalls / totalCalls : 0;

    return { totalCalls, successCalls, failedCalls, fallbackCalls, totalTokens, avgLatencyMs, successRate };
  }

  static getFeatureUsage(featureKey: string, timeRangeHours: number = 24): {
    totalCalls: number;
    totalTokens: number;
    modelBreakdown: Record<string, number>;
  } {
    const records = loadUsageRecords();
    const cutoff = new Date(Date.now() - timeRangeHours * 60 * 60 * 1000).toISOString();
    const filtered = records.filter(r => r.featureKey === featureKey && r.timestamp >= cutoff);
    
    const totalCalls = filtered.length;
    const totalTokens = filtered.reduce((sum, r) => sum + r.tokensUsed, 0);
    const modelBreakdown: Record<string, number> = {};
    filtered.forEach(r => {
      modelBreakdown[r.modelId] = (modelBreakdown[r.modelId] || 0) + 1;
    });

    return { totalCalls, totalTokens, modelBreakdown };
  }

  static getTotalTokenUsage(timeRangeHours: number = 24): number {
    const records = loadUsageRecords();
    const cutoff = new Date(Date.now() - timeRangeHours * 60 * 60 * 1000).toISOString();
    return records
      .filter(r => r.timestamp >= cutoff)
      .reduce((sum, r) => sum + r.tokensUsed, 0);
  }

  static getAllRecords(timeRangeHours: number = 24): ModelUsageRecord[] {
    const records = loadUsageRecords();
    const cutoff = new Date(Date.now() - timeRangeHours * 60 * 60 * 1000).toISOString();
    return records.filter(r => r.timestamp >= cutoff);
  }

  static clearRecords(): void {
    saveUsageRecords([]);
  }

  static getSummary(timeRangeHours: number = 24): {
    totalCalls: number;
    totalTokens: number;
    modelStats: Record<string, { calls: number; tokens: number; successRate: number }>;
  } {
    const records = loadUsageRecords();
    const cutoff = new Date(Date.now() - timeRangeHours * 60 * 60 * 1000).toISOString();
    const filtered = records.filter(r => r.timestamp >= cutoff);

    const modelStats: Record<string, { calls: number; tokens: number; successCount: number }> = {};
    filtered.forEach(r => {
      if (!modelStats[r.modelId]) {
        modelStats[r.modelId] = { calls: 0, tokens: 0, successCount: 0 };
      }
      modelStats[r.modelId].calls += 1;
      modelStats[r.modelId].tokens += r.tokensUsed;
      if (r.status === 'success') modelStats[r.modelId].successCount += 1;
    });

    const result: Record<string, { calls: number; tokens: number; successRate: number }> = {};
    Object.entries(modelStats).forEach(([id, stats]) => {
      result[id] = {
        calls: stats.calls,
        tokens: stats.tokens,
        successRate: stats.calls > 0 ? stats.successCount / stats.calls : 0,
      };
    });

    return {
      totalCalls: filtered.length,
      totalTokens: filtered.reduce((sum, r) => sum + r.tokensUsed, 0),
      modelStats: result,
    };
  }
}
