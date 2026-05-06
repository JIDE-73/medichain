// para hacer uso del id sin necesidad de enviarlo cada vez
declare namespace Express {
  interface Request {
    user?: {
      id: string;
      token: string;
    };
  }
}
