import dayjs from "dayjs";
import { z } from "zod";

export const dateFromArraySchema = z.number().transform((v) => dayjs(v * 1000))