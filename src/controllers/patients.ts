import prismaCLient from "../../prisma/prismaClient";
import { Request, Response } from "express";
import { check, validationResult } from "express-validator";
import { patient } from "./types";

const update = async (req: Request, res: Response) => {
    const { bloodType, address } = req.body as patient;
  const id = req.params.id;
    const user = req.user; //para auditorias y uso de de user.id

    await check("bloodType").optional().notEmpty().withMessage("Invalid blood type").run(req);
    await check("address").optional().notEmpty().withMessage("Invalid address").run(req);

    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      res.status(400).json({ message: "Invalid data" });
    }

    try {
        await prismaCLient.patient.update({
            where: {
                userId: id.toString(),
            },
            data: {
                bloodType,
                address,
            },
        });
        res.status(200).send({ message: "Patient updated successfully" });
    } catch (e) {
        res.status(500).send({ message: "Internal Server Error" });
      }
 };

export { update };