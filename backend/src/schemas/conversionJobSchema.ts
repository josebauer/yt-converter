import { z } from "zod";

export const conversionJobSchema = z.object({
  id: z.uuid()
});