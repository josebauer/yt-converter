import type {
  Request,
  Response,
  NextFunction
} from "express";

interface HttpError extends Error {
  status?: number;
  type?: string;
}

export function errorMiddleware(
  error: HttpError,
  req: Request,
  res: Response,
  next: NextFunction
): void {
  if (res.headersSent) {
    next(error);
    return;
  }

  if (
    error.type === "entity.parse.failed"
  ) {
    res.status(400).json({
      success: false,
      message: "JSON inválido."
    });

    return;
  }

  if (
    error.type === "entity.too.large"
  ) {
    res.status(413).json({
      success: false,
      message: "Requisição muito grande."
    });

    return;
  }

  if (
    error.message === "Origem não permitida pelo CORS."
  ) {
    res.status(403).json({
      success: false,
      message: "Origem não permitida."
    });

    return;
  }

  console.error(
    "[Error]",
    req.method,
    req.path,
    error
  );

  res.status(500).json({
    success: false,
    message: "Erro interno do servidor."
  });
}