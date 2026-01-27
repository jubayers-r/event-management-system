import { z } from "zod";

export const createEventFormSchema = z.object({
  name: z.string().min(5, "Event name must be at least 5 characters"),

  date_time: z.coerce.date({
    error: () => ({ message: "Invalid date-time format" }),
  }),

  location: z.string().min(5, "Location is required"),

  people_capacity: z
    .number()
    .int()
    .positive("Capacity must be a positive number"),

  joining_fee: z.number().min(0, "Joining fee cannot be negative"),
});

export const updateEventFormSchema = z.object({

  name: z.string().optional(),

  date_time: z.coerce
    .date()
    .optional(),

  location: z.string().optional(),

  people_capacity: z.number().int().optional(),

  joining_fee: z.number().optional(),
});

export type EventFormValues = z.infer<typeof createEventFormSchema>;

export type UpdateEventFormValues = z.infer<typeof updateEventFormSchema>;
