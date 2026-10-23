import type { Visit } from '../state/model';
import { formatDistance } from './geo';

export const checkLabel = (v: Pick<Visit, 'check' | 'distanceM'>) =>
  v.check === 'gps'
    ? `位置確認済み${v.distanceM !== undefined ? `（${formatDistance(v.distanceM)}）` : ''}`
    : v.check === 'demo'
      ? 'デモ・模擬位置'
      : '位置未確認';
