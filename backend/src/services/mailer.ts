import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.GMAIL_USER || "zwiswamuridili990@gmail.com",
    pass: process.env.GMAIL_APP_PASSWORD,
  },
});

export async function sendContactEmail(data: {
  name: string;
  email: string;
  subject: string;
  message: string;
}) {
  if (!process.env.GMAIL_APP_PASSWORD) {
    console.warn("GMAIL_APP_PASSWORD not set — skipping email send");
    return;
  }

  const html = `
    <h2>New Contact Message</h2>
    <p><strong>Name:</strong> ${escapeHtml(data.name)}</p>
    <p><strong>Email:</strong> ${escapeHtml(data.email)}</p>
    <p><strong>Subject:</strong> ${escapeHtml(data.subject)}</p>
    <hr />
    <p>${escapeHtml(data.message).replace(/\n/g, "<br />")}</p>
  `;

  await transporter.sendMail({
    from: `"Blog Contact" <${process.env.GMAIL_USER || "zwiswamuridili990@gmail.com"}>`,
    to: "zwiswamuridili990@gmail.com",
    replyTo: data.email,
    subject: `[Blog] ${data.subject}`,
    html,
  });
}

function escapeHtml(str: string): string {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}
