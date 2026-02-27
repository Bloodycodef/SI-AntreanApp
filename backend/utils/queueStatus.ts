import { QueueStatus } from "@prisma/client";

const transitions: Record<QueueStatus, readonly QueueStatus[]> = {
  waiting: ["serving", "skipped", "cancelled"],
  serving: ["done", "skipped"],
  done: [],
  skipped: [],
  cancelled: [],
};

export const isValidTransition = (
  current: QueueStatus,
  next: QueueStatus,
): boolean => {
  return transitions[current].includes(next);
};
