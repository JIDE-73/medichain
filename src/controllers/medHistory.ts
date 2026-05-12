import prisma from "../../prisma/prismaClient";
import { Request, Response } from "express";
import { check, validationResult } from "express-validator";
import { medHistory } from "./types";

const createMedHistory = async (req: Request, res: Response) => {
    const { patientId, userId, type, details, date } = req.body as (medHistory & { userId: string });

    await check("patientId").isString().notEmpty().run(req);
    await check("userId").isString().notEmpty().run(req);
    await check("type").isString().notEmpty().run(req);
    await check("details").optional().isString().run(req);
    await check("date").optional().isISO8601().toDate().run(req);

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    try {
        const medic = await prisma.doctor.findUnique({
            where: { userId },
        });
        const patient = await prisma.patient.findUnique({
            where: { id: patientId },
        });

        if (!medic || !patient) {
            return res.status(404).json({ error: "Doctor or patient not found" });
        }

        await prisma.medicalHistory.create({
          data: {
            patientId,
            doctorId: medic.id,
            type,
            details,
            date,
          },
        });

        res.status(201).json({ message: "Medical history record created successfully" });
    } catch (e) {
        console.error(e);
        res.status(500).json({ error: "Internal server error" });
      }
 };

const getMedHistoryBySearch = async (req: Request, res: Response) => {
    const { search } = req.params as { search: string };

    await check("search").isString().notEmpty().run(req);

    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }history;

    try {
        const patient = await prisma.patient.findUnique({
            where: {
                OR: [
                    { id: { contains: search, mode: "insensitive"} },
                    { person: { firstName: { contains: search, mode: "insensitive" } } },
                    { person: { lastName: { contains: search, mode: "insensitive" } } },
                    { person: { gender: { contains: search, mode: "insensitive" } } },
                    { person: { phone: { contains: search, mode: "insensitive" } } },
            ]},
        });

        if (!patient) {
            return res.status(404).json({ error: "Patient not found" });
        }

        const history = await prisma.medicalHistory.findMany({
            where: { id: search },
            include: {
                doctor: true,
                patient: true,
            }
        });
        res.status(200).json({ message: "Medical history records retrieved successfully", data: history });
     } catch (e) { }
 };

const updateMedHistory = async (req: Request, res: Response) => {
    const { id } = req.params as { id: string };
    const { type, details, date } = req.body as Partial<medHistory>;

    await check("id").isString().notEmpty().run(req);
    await check("type").optional().isString().run(req);
    await check("details").optional().isString().run(req);
    await check("date").optional().isISO8601().toDate().run(req);

    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    try {
        const historyRecord = await prisma.medicalHistory.findUnique({
            where: { id },
        });

        if (!historyRecord) {
            return res.status(404).json({ error: "Medical history record not found" });
        }

        await prisma.medicalHistory.update({
            where: { id },
            data: {
                type,
                details,
                date,
            },
        });

        res.status(200).json({ message: "Medical history record updated successfully" });
    } catch (e) {
        console.error(e);
        res.status(500).json({ error: "Internal server error" });
      }
 };

const deleteMedHistory = async (req: Request, res: Response) => {
    const { id } = req.params as { id: string };

    await check("id").isString().notEmpty().run(req);

    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    try {
        const historyRecord = await prisma.medicalHistory.findUnique({
            where: { id },
        });

        if (!historyRecord) {
            return res.status(404).json({ error: "Medical history record not found" });
        }

        await prisma.medicalHistory.delete({
            where: { id },
        });

        res.status(200).json({ message: "Medical history record deleted successfully" });
    } catch (e) {
        console.error(e);
        res.status(500).json({ error: "Internal server error" });
      }
 };

export { createMedHistory, getMedHistoryBySearch, updateMedHistory, deleteMedHistory };