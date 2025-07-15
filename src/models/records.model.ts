import { z } from "zod";

const RecordSchema = z.object({
  total: z
    .number()
    // Round total to two decimal places.
    // From https://stackoverflow.com/questions/59480096/how-to-round-to-2-decimal-places-with-typescript
    .transform((val) => parseFloat((Math.round(val * 100) / 100).toFixed(2))),
  recordType: z.enum(["invoice", "bill", "none"]),
  status: z.enum(["pending", "void", "completed"]),
});

export const RecordsSchema = z.array(RecordSchema);

export type Record = z.infer<typeof RecordSchema>;
export type Records = z.infer<typeof RecordSchema>;

export const RecordTypeSchema = z.enum(["invoice", "bill", "none"]);
export const StatusSchema = z.enum(["pending", "void", "completed"]);
