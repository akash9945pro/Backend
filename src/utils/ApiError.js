class ApiError extends Error {
    constructor(
      statusCode,
      message = "something went wrong",
      error = [],
      stack = ""
    ) {
      super(message);
      this.statusCode = statusCode;
      this.data = null;
      this.success = false;
      this.errors = error; 
      if (stack) {
        this.stack = stack;
      } else {
        Error.captureStackTrace(this, ApiError); 
      }
    }
  }
  
  export { ApiError };