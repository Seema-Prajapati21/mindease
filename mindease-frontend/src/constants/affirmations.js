export const AFFIRMATIONS = [
  "You do not have to have everything figured out right now. Just this breath is enough.",
  "Your feelings are valid visitors. You can let them pass through without letting them define you.",
  "Resting before you break is not weakness — it is wisdom.",
  "Gentleness with yourself creates the quiet space healing needs.",
  "You survived every single difficult day that came before today.",
  "Small steps still cover great distances over time.",
  "It is okay if all you did today was simply get through it.",
  "You are allowed to take up space and take your time.",
  "Peace is not the absence of storm, but finding calm within your own ribs.",
  "You don't need to earn kindness; you are deserving of it simply by existing.",
  "Notice the tension you are carrying in your shoulders, and gently let it drop.",
  "Even heavy clouds eventually run out of rain.",
  "Giving yourself permission to pause is an act of deep courage.",
  "Whatever you are carrying today, it is okay to put it down for ten minutes.",
  "Your worth is never tied to your productivity or output.",
  "Be curious about how you feel, rather than critical.",
  "You have an inner resilience that quiet moments can reconnect you to.",
  "Every emotional state has a beginning, a middle, and an end.",
  "There is nothing flawed about feeling overwhelmed by an overwhelming world.",
  "Treat yourself with the same warmth you would offer a cherished friend.",
  "A quiet breath in, a slower breath out. You are safe in this present moment.",
  "Growth often happens invisibly, in the quietest hours.",
  "You are capable of holding both pain and hope at the exact same time.",
  "Boundaries are the distance at which I can love both you and me simultaneously.",
  "One moment at a time. That is all that is ever asked of you.",
  "It takes genuine courage to be honest with yourself about your pain.",
  "You are allowed to say no to demands and yes to your own peace.",
  "Notice what is good right here, right now, however modest it may seem.",
  "Even slow progress is still progress.",
  "You are human, beautifully incomplete, and entirely worth caring for."
];

export const getDailyAffirmation = () => {
  const now = new Date();
  const startOfYear = new Date(now.getFullYear(), 0, 0);
  const diff = now - startOfYear;
  const oneDay = 1000 * 60 * 60 * 24;
  const dayOfYear = Math.floor(diff / oneDay);
  return AFFIRMATIONS[dayOfYear % AFFIRMATIONS.length];
};
