class HttpError extends Error {
  public code: number;
  constructor(message: string, errorCode: number) {
    super(message);
    this.code = errorCode;

    // restore broken prototype chain
    // const currentProto = new.target.prototype;
    // Object.setPrototypeOf(this, currentProto);
  }
}

export default HttpError;
