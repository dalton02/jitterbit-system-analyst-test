export class HttpError extends Error {
  status: number = 500;
}
export class NotFoundError extends HttpError {
  status = 404;
  constructor(message = "Resource not found") {
    super(message);
    this.name = "NotFoundError";
  }
}

export class BadRequestError extends HttpError {
  status = 400;
  constructor(message: string) {
    super(message);
    this.name = "BadRequestError";
  }
}

export class ConflictError extends HttpError {
  status = 409;
  constructor(message: string) {
    super(message);
    this.name = "ConflictError";
  }
}

export class UnauthorizedError extends HttpError {
  status = 401;
  constructor(message = "Unauthorized") {
    super(message);
    this.name = "UnauthorizedError";
  }
}
