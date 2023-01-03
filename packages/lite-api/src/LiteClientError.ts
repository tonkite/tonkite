export class LiteClientError extends Error {
  constructor(message: string, readonly code: number) {
    super(message);
  }
}
