import nodemailer from "nodemailer";

export const sendVerificationEmail = async (
  email: string,
  token: string,
): Promise<void> => {
  if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
    throw new Error("Email env belum diset");
  }

  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  const verifyUrl = `${process.env.APP_URL}/auth/verify-email?token=${token}`;

  await transporter.sendMail({
    from: `"Antrean App" <${process.env.EMAIL_USER}>`,
    to: email,
    subject: "Verifikasi Email",
    html: `
      <h3>Verifikasi Email</h3>
      <p>Klik link berikut:</p>
      <a href="${verifyUrl}">${verifyUrl}</a>
      <p>Link berlaku 1 jam</p>
    `,
  });
};
