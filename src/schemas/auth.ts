
import { z } from 'zod';

// Password validation regex patterns
const hasUpperCase = /[A-Z]/;
const hasLowerCase = /[a-z]/;
const hasNumber = /[0-9]/;
const hasSpecialChar = /[^A-Za-z0-9]/;

// Advanced password validation schema
const passwordSchema = z.string()
  .min(8, 'Password must be at least 8 characters long')
  .refine(value => hasUpperCase.test(value), {
    message: 'Password must contain at least one uppercase letter',
  })
  .refine(value => hasLowerCase.test(value), {
    message: 'Password must contain at least one lowercase letter',
  })
  .refine(value => hasNumber.test(value), {
    message: 'Password must contain at least one number',
  })
  .refine(value => hasSpecialChar.test(value), {
    message: 'Password must contain at least one special character',
  });

export const loginSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters long'),
  rememberMe: z.boolean().optional().default(false),
});

export const phoneLoginSchema = z.object({
  phone: z.string().min(5, 'Please enter a valid phone number'),
  password: z.string().min(6, 'Password must be at least 6 characters long'),
  countryCode: z.string(),
  rememberMe: z.boolean().optional().default(false),
});

export const signupSchema = z.object({
  fullName: z.string().min(2, 'Please enter your full name'),
  email: z.string().email('Please enter a valid email address'),
  password: passwordSchema,
  confirmPassword: z.string(),
  phone: z.string().optional(),
  countryCode: z.string().optional(),
  acceptTerms: z.boolean().refine(value => value === true, {
    message: 'You must accept the terms and conditions',
  }),
}).refine(data => data.password === data.confirmPassword, {
  message: "Passwords do not match",
  path: ["confirmPassword"],
});

export const passwordResetSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
});

export const verifyOtpSchema = z.object({
  otp: z.string().length(6, 'OTP must be 6 digits'),
  phone: z.string().optional(),
  email: z.string().optional(),
});

export type LoginFormValues = z.infer<typeof loginSchema>;
export type PhoneLoginFormValues = z.infer<typeof phoneLoginSchema>;
export type SignupFormValues = z.infer<typeof signupSchema>;
export type PasswordResetFormValues = z.infer<typeof passwordResetSchema>;
export type VerifyOtpFormValues = z.infer<typeof verifyOtpSchema>;
