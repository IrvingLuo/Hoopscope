const prod = process.env.NODE_ENV !== 'development';
export const base = prod ? '/mp2' : '';