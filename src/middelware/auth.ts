import jwt from "jsonwebtoken";
import prisma from "../../prisma/prismaClient.js";
import { Request, Response, NextFunction } from "express";

export const verify = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({
        message: "Token no proporcionado o formato inválido",
        error: "Token no proporcionado o formato inválido",
      });
    }

    const token = authHeader.substring(7);
    try {
      jwt.verify(token, process.env.JWT_SECRET!);
    } catch (e) {
      return res.status(401).json({
        message: "Token inválido o expirado",
        error: "Token inválido o expirado",
      });
    }

    const sesion = await prisma.tokenLog.findUnique({
      where: { token },
      include: { user: true },
    });

    if (!sesion) {
      return res.status(401).json({
        message: "Sesión no encontrada",
        error: "Sesión no encontrada",
      });
    }

    if (sesion.status) {
      return res.status(401).json({
        message: "Sesión revocada",
        error: "Sesión revocada",
      });
    }

    req.user = {
      id: sesion.user.id,
      token: token,
    };

    next();
  } catch (e) {
    return res.status(500).json({
      message: "Error al validar autenticación",
      error: "Error al validar autenticación",
    });
  }
};
