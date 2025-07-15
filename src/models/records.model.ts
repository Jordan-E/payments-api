import { z } from "zod";

export const RecordSchema = z.object({
  total: z.number(),
  recordType: z.enum(["invoice", "bill", "none"]),
  status: z.enum(["pending", "void", "completed"]),
});
