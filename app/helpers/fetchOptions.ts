export const post = (data: unknown) => ({
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  data,
});
