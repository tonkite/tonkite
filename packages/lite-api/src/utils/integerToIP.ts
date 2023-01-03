export const integerToIP = (ip: number): string =>
  [(ip >> 24) & 255, (ip >> 16) & 255, (ip >> 8) & 255, ip & 255].join('.');
