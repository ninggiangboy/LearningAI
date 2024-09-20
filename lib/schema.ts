import { z } from "zod";

export const generateFormSchema = z.object({
  files: z
    .array(
      z.instanceof(File).refine((file) => file.size < 4 * 1024 * 1024, {
        message: "File size must be less than 4MB",
      })
    )
    .min(1, {
      message: "At least 1 file is required",
    })
    .max(5, {
      message: "Maximum 5 files are allowed",
    }),
  title: z.string().max(160),
  prompt: z.string().max(160).optional(),
  numOfSlides: z.number().min(4).max(20).optional(),
});

export type GenerateFormValues = z.infer<typeof generateFormSchema>;
