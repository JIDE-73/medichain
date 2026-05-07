import prismaClient from "../../prisma/prismaClient";
import { Request, Response } from "express";
import { check, validationResult } from "express-validator";
import { person, doctor, patient } from "./types";

const createWithDoctor = async (req: Request, res: Response) => {
  const { firstName, lastName, birthDate, gender, phone } = req.body as person;
  const { specialty, cedula, address } = req.body as doctor;
  const user = req.user; //para auditorias y uso de de user.id

  await check("firstName").notEmpty().withMessage("Invalid first name").run(req);
  await check("lastName").notEmpty().withMessage("Invalid last name").run(req);
  await check("birthDate").notEmpty().withMessage("Invalid birth date").run(req);
  await check("gender").notEmpty().withMessage("Invalid gender").run(req);
  await check("specialty").notEmpty().withMessage("Invalid specialty").run(req);
  await check("cedula").notEmpty().withMessage("Invalid cedula").run(req);

  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const p = await prismaClient.person.create({
      data: {
        firstName,
        lastName,
        birthDate,
        gender,
        phone,
      },
    });

    const d = await prismaClient.doctor.create({
      data: {
        personId: p.id,
        userId: user.id,
        specialty,
        cedula,
        address,
      },
    });
    res.status(201).send({ message: "Doctor created successfully" });
  } catch (e) {
    res.status(500).send({
      message: "Internal Server Error",
      error: "Something went wrong",
    });
  }
};

const createWithPatient = async (req: Request, res: Response) => {
  const { firstName, lastName, birthDate, gender, phone } = req.body as person;
  const { bloodType, address } = req.body as patient;
  const user = req.user; //para auditorias y uso de de user.id

  await check("firstName").notEmpty().withMessage("Invalid first name").run(req);
  await check("lastName").notEmpty().withMessage("Invalid last name").run(req);
  await check("birthDate").notEmpty().withMessage("Invalid birth date").run(req);
  await check("gender").notEmpty().withMessage("Invalid gender").run(req);
  await check("bloodType").notEmpty().withMessage("Invalid blood type").run(req);

  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    res.status(400).json({ message: "Invalid data" });
  }

  try {
    const p = await prismaClient.person.create({
      data: {
        firstName,
        lastName,
        birthDate,
        gender,
        phone,
      },
    });

    const pa = await prismaClient.patient.create({
      data: {
        personId: p.id,
        userId: user.id,
        bloodType,
        address,
      },
    });

    res.status(201).send({ message: "Patient created successfully" });
  } catch (e) {}
};

const update = async (req: Request, res: Response) => {
    const { firstName, lastName, birthDate, gender, phone } = req.body as person;
      const id = req.params.id;
  const user = req.user; //para auditorias y uso de de user.id

  await check("firstName").notEmpty().withMessage("Invalid first name").run(req);
  await check("lastName").notEmpty().withMessage("Invalid last name").run(req);
  await check("birthDate").notEmpty().withMessage("Invalid birth date").run(req);
  await check("gender").notEmpty().withMessage("Invalid gender").run(req);

  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    res.status(400).json({ message: "Invalid data" });
  }

  try {
    const pa = await prismaClient.patient.findFirst({
      where: {
        userId: id.toString(),
      },
    });
    const d = await prismaClient.doctor.findFirst({
      where: {
        userId: id.toString(),
      },
    });

    if (pa || d) {
      const p = await prismaClient.person.update({
        where: {
          id: pa?.personId || d?.personId,
        },
        data: {
          firstName,
          lastName,
          birthDate,
          gender,
          phone,
        },
      });

      res.status(200).send({ message: "Person updated successfully" });
    } else {
      res.status(404).send({ message: "Person not found" });
    }
  } catch (e) {
    res.status(500).send({ message: "Internal Server Error" });
  }
};

const deletee = async (req: Request, res: Response) => {
    const id = req.params.id;
  const user = req.user; //para auditorias y uso de de user.id

  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    res.status(400).json({ message: "Invalid data" });
  }

  try {
    const pa = await prismaClient.patient.findFirst({
      where: {
        userId: id.toString(),
      },
    });
    const d = await prismaClient.doctor.findFirst({
      where: {
        userId: id.toString(),
      },
    });

    if (pa || d) {
      await prismaClient.person.delete({
        where: {
          id: pa?.personId || d?.personId,
        },
      });

      res.status(200).send({ message: "Person deleted successfully" });
    } else {
      res.status(404).send({ message: "Person not found" });
    }
  } catch (e) {
    res.status(500).send({ message: "Internal Server Error" });
  }
};

const readBySearch = async (req: Request, res: Response) => {
  const { search } = req.params as { search: string };

  try {
    if (search) {
      const persons = await prismaClient.person.findMany({
        where: {
            OR: [
                {id: {contains: search, mode: "insensitive"}},
            { firstName: { contains: search, mode: "insensitive" } },
            { lastName: { contains: search, mode: "insensitive" } },
            { phone: { contains: search, mode: "insensitive" } },
          ],
        },
      });
      res.status(200).send({ message: "Persons found successfully", persons });
    } else {
      const persons = await prismaClient.person.findMany();
      res.status(200).send({ message: "Persons found successfully", persons });
    }
  } catch (e) {
    res.status(500).send({ message: "Internal Server Error" });
  }
};

export { createWithDoctor, createWithPatient, update, deletee, readBySearch };
