
import { z } from 'zod';

export const loginSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters long'),
});

export const phoneLoginSchema = z.object({
  phone: z.string().min(5, 'Please enter a valid phone number'),
  password: z.string().min(6, 'Password must be at least 6 characters long'),
  countryCode: z.string(),
});

export const signupSchema = z.object({
  fullName: z.string().min(2, 'Please enter your full name'),
  email: z.string().email('Please enter a valid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters long'),
  confirmPassword: z.string(),
  phone: z.string().optional(),
  countryCode: z.string().optional(),
}).refine(data => data.password === data.confirmPassword, {
  message: "Passwords do not match",
  path: ["confirmPassword"],
});

export const passwordResetSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
});

export type LoginFormValues = z.infer<typeof loginSchema>;
export type PhoneLoginFormValues = z.infer<typeof phoneLoginSchema>;
export type SignupFormValues = z.infer<typeof signupSchema>;
export type PasswordResetFormValues = z.infer<typeof passwordResetSchema>;
