import { z } from "zod";

export const generateSlidesFormSchema = z.object({
  files: z
    .array(
      z
        .instanceof(File)
        .refine((file) => file.size < 2 * 1024 * 1024, {
          message: "File size must be less than 4MB",
        })
        .refine(
          (file) => {
            const allowedTypes = [
              "image/",
              "application/pdf",
              "audio/",
              "text/plain",
            ];
            return allowedTypes.some((type) => file.type.startsWith(type));
          },
          {
            message: "File type must be an image, PDF, or audio",
          }
        )
    )
    .min(1, {
      message: "At least 1 file is required",
    })
    .max(3, {
      message: "Maximum 3 files are allowed",
    }),
  title: z.string().max(160),
  prompt: z.string().max(200).optional(),
  numOfSlides: z.number().min(4).max(40).optional(),
});

export type GenerateSlidesFormValues = z.infer<typeof generateSlidesFormSchema>;

export const generateQuizFormSchema = z.object({
  files: z
    .array(
      z.instanceof(File).refine((file) => file.size < 2 * 1024 * 1024, {
        message: "File size must be less than 4MB",
      })
    )
    .min(1, {
      message: "At least 1 file is required",
    })
    .max(3, {
      message: "Maximum 3 files are allowed",
    }),
  title: z.string().max(160),
  prompt: z.string().max(160).optional(),
  typeOfQuiz: z.enum(["multiple_choice", "true_false", "both"]),
  numOfQuiz: z.number().min(10).max(100).optional(),
});

export type GenerateQuizFormValues = z.infer<typeof generateQuizFormSchema>;
