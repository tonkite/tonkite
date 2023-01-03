import crc from 'crc-32';

export function crc32(value: string) {
  return crc.str(value.trim().replace(/[()]/g, ''));
}
