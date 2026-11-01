export const FAQS = [
  {
    question:
      'What happens if two people reserve the last unit at the same time?',
    answer:
      'Only one reservation succeeds. The stock is decremented in a single database operation that only works if enough units remain, so a unit can never be sold twice. The other person sees a clear sold out message.',
  },
  {
    question: 'How long is my reservation held?',
    answer:
      'Five minutes. A timer on the drop page shows exactly how much time is left.',
  },
  {
    question: 'What if I do not pay in time?',
    answer:
      'The reservation expires and the unit returns to the drop, so someone else can reserve it. You are never charged for an expired reservation.',
  },
  {
    question: 'Can I buy a product outside of a drop?',
    answer:
      "You can browse every product at any time, but checkout is only possible while the product's drop is live and stock remains.",
  },
  {
    question: 'Can I find out when a drop starts?',
    answer:
      'Every upcoming drop shows a countdown. Reminders by email are planned so you will not miss the start.',
  },
];
