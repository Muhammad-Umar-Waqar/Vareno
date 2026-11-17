import { site } from '../data/site';

export const launchAt = new Date(site.launchISO);

export function isReleased(now = new Date()) {
  return now.getTime() >= launchAt.getTime();
}

export function remaining(now = new Date()) {
  const ms = launchAt.getTime() - now.getTime();
  if (ms <= 0) {
    return { done: true, days: 0, hours: 0, minutes: 0, seconds: 0 };
  }
  const total = Math.floor(ms / 1000);
  return {
    done: false,
    days: Math.floor(total / 86400),
    hours: Math.floor((total % 86400) / 3600),
    minutes: Math.floor((total % 3600) / 60),
    seconds: total % 60,
  };
}

function unit(count: number, word: string) {
  return `${count} ${word}${count === 1 ? '' : 's'}`;
}

export function remainingLabel(now = new Date()) {
  const left = remaining(now);
  if (left.done) return 'Out now';
  return `${unit(left.days, 'day')}, ${unit(left.hours, 'hour')}, ${unit(left.minutes, 'minute')}`;
}
