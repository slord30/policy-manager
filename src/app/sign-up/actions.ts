'use server';

import { redirect } from 'next/navigation';
import { z } from 'zod';
import bcrypt from 'bcryptjs';
import { neon } from '@neondatabase/serverless';

const sql = neon(process.env.POSTGRES_URL!);

const SignUpSchema = z.object({
  email: z.string().email('Please enter a valid email address.'),
  password: z
    .string()
    .min(6, 'Password must be at least 6 characters.'),
});

export type SignUpState = {
  message: string;
  errors?: {
    email?: string[];
    password?: string[];
  };
};

export async function signUp(
  _previousState: SignUpState,
  formData: FormData,
): Promise<SignUpState> {
  const validatedFields = SignUpSchema.safeParse({
    email: formData.get('email'),
    password: formData.get('password'),
  });

  if (!validatedFields.success) {
    return {
      message: 'Please check your information and try again.',
      errors: validatedFields.error.flatten().fieldErrors,
    };
  }

  const { email, password } = validatedFields.data;

  const existingUser = await sql`
    SELECT id
    FROM broker_accounts
    WHERE email = ${email}
    LIMIT 1
  `;

  if (existingUser.length > 0) {
    return {
      message: 'An account with that email already exists.',
    };
  }

  const passwordHash = await bcrypt.hash(password, 10);

  await sql`
    INSERT INTO broker_accounts (email, password_hash)
    VALUES (${email}, ${passwordHash})
  `;

  redirect('/sign-in');
}