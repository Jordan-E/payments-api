import { z } from "zod";

const RecordSchema = z.object({
  total: z.number(),
  recordType: z.enum(["invoice", "bill", "none"]),
  status: z.enum(["pending", "void", "completed"]),
});

export const RecordsSchema = z.array(RecordSchema);
export type Record = z.infer<typeof RecordSchema>;
export type Records = z.infer<typeof RecordSchema>;
