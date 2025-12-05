"use server";

export async function checkIsAdmin(email: string) {
  // .env.local lo unna nee email tho compare chesthundi
  if (email === process.env.ADMIN_EMAIL) {
    return true;
  }
  return false;
}