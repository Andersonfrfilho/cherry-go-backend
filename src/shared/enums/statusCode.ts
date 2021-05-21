enum HttpErrorCodes {
  FORBIDDEN = 403,
  CONFLICT = 409,
  TOO_MANY_REQUESTS = 429,
  UNAUTHORIZED = 401,
  BAD_REQUEST = 400,
  INTERNAL_SERVER_ERROR = 500,
}

enum HttpSuccessCode {
  OK = 200,
}

export { HttpErrorCodes, HttpSuccessCode };
