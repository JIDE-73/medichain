import prsimaClient from "../../prisma/prismaClient";
import bcrypt from "bcrypt";
import { Request, Response } from "express";
import { check, validationResult } from "express-validator";
import { user } from "./types";

const create = async (req: Request, res: Response) => {
  const { email, password } = req.body as user;
  const user = req.user; //para auditorias

  await check("email").isEmail().withMessage("Invalid email").run(req);
  await check("password")
    .isLength({ min: 8 })
    .withMessage("Invalid password")
    .run(req);

  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const h = await bcrypt.hash(password, 16);

    await prsimaClient.user.create({
      data: {
        email,
        password: h,
      },
    });

    res.status(201).send({ message: "User created successfully" });
  } catch (e) {
    res.status(500).send({
      message: "Internal Server Error",
      error: "Something went wrong",
    });
  }
};

const update = async (req: Request, res: Response) => {
  const { email, password, newpassword, newemail } = req.body as user & {
    newpassword: string;
    newemail: string;
  };
  const user = req.user; //para auditorias

  await check("email").isEmail().withMessage("Invalid email").run(req);
  await check("password")
    .isLength({ min: 8 })
    .withMessage("Invalid password")
    .run(req);
  await check("newpassword")
    .isLength({ min: 8 })
    .withMessage("Invalid password")
    .run(req);
  await check("newemail").isEmail().withMessage("Invalid email").run(req);

  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const u = await prsimaClient.user.findFirst({
      where: {
        email,
        password: await bcrypt.hash(password, 16),
      },
    });

    await prsimaClient.user.update({
      where: {
        id: u?.id,
      },
      data: {
        email: newemail ? email : newemail,
        password: await bcrypt.hash(newpassword, 16),
      },
    });

    res.status(200).send({ message: "User updated successfully" });
  } catch (e) {
    res
      .status(500)
      .send({
        message: "Internal Server Error",
        error: "Something went wrong",
      });
  }
};

const deletee = async (req: Request, res: Response) => {
  const { id } = req.params;
  const user = req.user; //para auditorias

  try {
    await prsimaClient.user.delete({
      where: {
        id: id.toString(),
      },
    });

    res.status(200).send({ message: "User deleted successfully" });
  } catch (e) {
    res
      .status(500)
      .send({
        message: "Internal Server Error",
        error: "Something went wrong",
      });
  }
};

const readBySearch = async (req: Request, res: Response) => {
  const { search } = req.params as { search: string };

    try {
        if (search) {
            const users = await prsimaClient.user.findMany({
              where: {
                OR: [{ email: { contains: search, mode: "insensitive" } }],
              },
            });
        res.status(200).send({message: "Users found successfully", users});
        }
         else {
        const users = await prsimaClient.user.findMany();
        res.status(200).send({message: "Users found successfully", users});
      }
  } catch (e) {
    res.status(500).send({ message: "Internal Server Error", error: "Something went wrong",
      });
  }
};

export { create, update, deletee, readBySearch };
