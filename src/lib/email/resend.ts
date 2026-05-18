export interface EnrollmentEmailParams {
  to: string;
  name: string;
  courseTitle: string;
}

export async function sendEnrollmentEmail(params: EnrollmentEmailParams): Promise<void> {
  const apiKey = process.env.RESEND_API_KEY;
  const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? "https://suffaitacademy.uz";

  if (!apiKey) {
    console.warn("RESEND_API_KEY not configured — skipping enrollment email");
    return;
  }

  const { Resend } = await import("resend");
  const resend = new Resend(apiKey);

  await resend.emails.send({
    from: "Suffa IT Academy <noreply@suffaitacademy.uz>",
    to: params.to,
    subject: `Доступ к курсу "${params.courseTitle}" открыт`,
    html: `
      <div style="font-family:sans-serif;max-width:600px;margin:0 auto;background:#05070d;color:#e2e8f0;padding:32px;border-radius:12px;">
        <h1 style="color:#22d3ee;margin-top:0;">Suffa IT Academy</h1>
        <p>Здравствуйте, <strong>${params.name}</strong>!</p>
        <p>Ваш платёж принят. Доступ к курсу <strong>"${params.courseTitle}"</strong> активирован.</p>
        <a href="${appUrl}/dashboard"
           style="display:inline-block;margin-top:16px;padding:12px 24px;background:#22d3ee;color:#05070d;border-radius:8px;text-decoration:none;font-weight:700;">
          Перейти в личный кабинет
        </a>
        <p style="margin-top:32px;color:#64748b;font-size:14px;">
          Suffa IT Academy · Ибрат Янгикурган, Бувайдинский район, Ферганская область, Узбекистан<br>
          Тел: +998 50 155 67 00 · <a href="https://t.me/suffaitacademy" style="color:#22d3ee;">Telegram</a>
        </p>
      </div>
    `,
  });
}
