const WORDS_PER_MINUTE = 225;

export const estimateReadingMinutes = (text: string): number => {
  if (!text) return 1;
  const words = text.trim().split(/\s+/).length;
  return Math.max(1, Math.round(words / WORDS_PER_MINUTE));
};

