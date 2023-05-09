export const calculateProgress = (completed: number, total: number) => {
  return ((completed ?? 0) / (total ?? 0)) * 100;
};
