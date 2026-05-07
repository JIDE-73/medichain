import prismaClient from "../../prisma/prismaClient";
import { Request, Response } from "express";
import { check, validationResult } from "express-validator";
import { doctor } from "./types";

const update = async (req: Request, res: Response) => {
    const { specialty, cedula, address } = req.body as doctor;
  const id = req.params.id;
  const user = req.user; //para auditorias y uso de de user.id

  await check("speciality").optional().notEmpty().withMessage("Invalid speciality").run(req);
  await check("cedula").optional().notEmpty().withMessage("Invalid cedula").run(req);
  await check("address").optional().notEmpty().withMessage("Invalid address").run(req);

  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    res.status(400).json({ message: "Invalid data" });
  }

  try {
    await prismaClient.doctor.update({
      where: {
        userId: id.toString(),
      },
      data: {
        specialty,
        cedula,
        address,
      },
    });

    res.status(200).send({ message: "Doctor updated successfully" });
  } catch (e) {
    res.status(500).send({ message: "Internal Server Error" });
  }
};

const readBySearch = async (req: Request, res: Response) => {
  const { search } = req.params as { search: string };

  try {
    if (search) {
      const doctors = await prismaClient.doctor.findMany({
        where: {
          OR: [
            { id: { contains: search, mode: "insensitive" } },
            { specialty: { contains: search, mode: "insensitive" } },
            { cedula: { contains: search, mode: "insensitive" } },
            { address: { contains: search, mode: "insensitive" } },
          ],
        },
      });
      res.status(200).send({ message: "Doctors found successfully", doctors });
    } else {
    }
  } catch (e) {
    res.status(500).send({ message: "Internal Server Error" });
  }
};

const deletee = async (req: Request, res: Response) => {
  const id = req.params.id;
  const user = req.user; //para auditorias y uso de de user.id
  try {
    await prismaClient.doctor.delete({
      where: {
        userId: id.toString(),
      },
    });
    res.status(200).send({ message: "Doctor deleted successfully" });
  } catch (e) {
    res.status(500).send({ message: "Internal Server Error" });
  }
};

export { update, deletee, readBySearch };
