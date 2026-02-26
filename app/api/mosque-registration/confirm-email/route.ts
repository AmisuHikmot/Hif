// app/api/mosque-registration/confirm-email/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

// ─── Types ────────────────────────────────────────────────────────────────────
interface EmailTarget {
  email: string;
  name:  string;
  role:  string;
}

interface Female {
  full_name:     string;
  age:           string;
  phone:         string;
  is_competitor: boolean; // true for index 0 (the quiz competitor)
}

interface RequestBody {
  targets:       EmailTarget[];
  mosque_name:   string;
  reg_code:      string;
  contact_name:  string;
  contact_phone: string;
  ustaz_name:    string;  // Ustaz 1
  ustaz2_name?:  string;  // Ustaz 2
  competitors:   Female[]; // 6 females
  state:         string;
}

// ─── Email HTML builder ───────────────────────────────────────────────────────
function buildEmailHtml({
  recipientName,
  recipientRole,
  mosque_name,
  reg_code,
  contact_name,
  contact_phone,
  ustaz_name,
  ustaz2_name,
  females,
  state,
}: {
  recipientName: string;
  recipientRole: string;
  mosque_name:   string;
  reg_code:      string;
  contact_name:  string;
  contact_phone: string;
  ustaz_name:    string;
  ustaz2_name:   string;
  females:       Female[];
  state:         string;
}): string {

  const competitor = females.find(f => f.is_competitor) ?? females[0];
  const supporters = females.filter(f => !f.is_competitor);

  // Competitor row — highlighted gold
  const competitorRow = `
    <tr style="background:rgba(212,175,55,0.08);">
      <td style="padding:10px 12px;border-bottom:1px solid #1e3a5f;color:#94a3b8;font-size:13px;">1</td>
      <td style="padding:10px 12px;border-bottom:1px solid #1e3a5f;font-size:13px;">
        <span style="color:#fde68a;font-weight:700;">${competitor.full_name}</span>
        <span style="display:inline-block;margin-left:6px;padding:1px 8px;border-radius:99px;
          font-size:10px;font-weight:700;background:#d4af3722;color:#d4af37;
          border:1px solid #d4af3740;vertical-align:middle;">
          COMPETITOR
        </span>
      </td>
      <td style="padding:10px 12px;border-bottom:1px solid #1e3a5f;color:#e2e8f0;font-size:13px;">${competitor.age}</td>
      <td style="padding:10px 12px;border-bottom:1px solid #1e3a5f;color:#e2e8f0;font-size:13px;">${competitor.phone || '—'}</td>
    </tr>`;

  // Supporting members rows
  const supporterRows = supporters.map((f, i) => `
    <tr>
      <td style="padding:8px 12px;border-bottom:1px solid #1e3a5f;color:#94a3b8;font-size:13px;">${i + 2}</td>
      <td style="padding:8px 12px;border-bottom:1px solid #1e3a5f;color:#e2e8f0;font-size:13px;">${f.full_name}</td>
      <td style="padding:8px 12px;border-bottom:1px solid #1e3a5f;color:#e2e8f0;font-size:13px;">${f.age}</td>
      <td style="padding:8px 12px;border-bottom:1px solid #1e3a5f;color:#e2e8f0;font-size:13px;">${f.phone || '—'}</td>
    </tr>`).join('');

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Registration Confirmed — Hamduk Islamic Foundation</title>
</head>
<body style="margin:0;padding:0;background:#060d1a;font-family:Georgia,serif;">
<div style="max-width:600px;margin:0 auto;padding:32px 16px;">

  <!-- HEADER -->
  <div style="text-align:center;padding:40px 24px;background:linear-gradient(145deg,#0f1e35,#0c1520);
    border-radius:16px 16px 0 0;border:1px solid #d4af3730;border-bottom:none;">
    <div style="font-size:40px;margin-bottom:8px;">🕌</div>
    <div style="height:3px;background:linear-gradient(90deg,transparent,#d4af37,transparent);
      margin-bottom:24px;border-radius:99px;"></div>
    <p style="color:#d4af3799;font-size:11px;font-weight:700;letter-spacing:0.15em;
      text-transform:uppercase;margin:0 0 8px;">Hamduk Islamic Foundation</p>
    <h1 style="color:#e2e8f0;font-size:26px;font-weight:700;margin:0 0 6px;">
      Registration Confirmed ✅
    </h1>
    <p style="color:#d4af37;font-size:14px;margin:0;">Baarakallahu Feekum! 🌙</p>
    <div style="height:1px;background:linear-gradient(90deg,transparent,#d4af3744,transparent);margin-top:24px;"></div>
  </div>

  <!-- BODY -->
  <div style="background:linear-gradient(145deg,#0f1e35,#0c1520);border:1px solid #d4af3730;
    border-top:none;border-bottom:none;padding:0 24px 28px;">

    <!-- Greeting -->
    <p style="color:#e2e8f0;font-size:15px;margin:24px 0 8px;">
      As-salamu alaykum, <strong>${recipientName}</strong>
    </p>
    <p style="color:#94a3b8;font-size:14px;line-height:1.7;margin:0 0 24px;">
      This email confirms that you (<em>${recipientRole}</em>) have been included in the registration of
      <strong style="color:#d4af37;">${mosque_name}</strong> for the
      <strong style="color:#e2e8f0;">Hamduk Islamic Foundation Knowledge Quiz Programme</strong>.
    </p>

    <!-- Registration code -->
    <div style="background:#d4af3710;border:1px solid #d4af3740;border-radius:12px;
      padding:20px;text-align:center;margin-bottom:28px;">
      <p style="color:#94a3b8;font-size:11px;font-weight:700;letter-spacing:0.15em;
        text-transform:uppercase;margin:0 0 8px;">Registration Code</p>
      <p style="color:#d4af37;font-size:28px;font-weight:700;letter-spacing:0.18em;
        margin:0 0 8px;font-family:monospace;">${reg_code}</p>
      <p style="color:#94a3b8;font-size:12px;margin:0;">
        Keep this code safe. Use it when contacting us about your registration.
      </p>
    </div>

    <!-- Summary table -->
    <p style="color:#d4af37;font-size:11px;font-weight:700;letter-spacing:0.15em;
      text-transform:uppercase;margin:0 0 12px;">📋 Registration Summary</p>
    <table style="width:100%;border-collapse:collapse;margin-bottom:28px;">
      <tbody>
        ${[
          ['Mosque Name',   mosque_name],
          ['State',         state],
          ['Contact Person',contact_name],
          ['Contact Phone', contact_phone],
          ['Ustaz (1st)',   ustaz_name],
          ['Ustaz (2nd)',   ustaz2_name || '—'],
        ].map(([label, value]) => `
        <tr>
          <td style="padding:8px 0;border-bottom:1px solid #1e3a5f;color:#94a3b8;
            font-size:13px;width:40%;">${label}</td>
          <td style="padding:8px 0;border-bottom:1px solid #1e3a5f;color:#e2e8f0;
            font-size:13px;font-weight:600;">${value}</td>
        </tr>`).join('')}
      </tbody>
    </table>

    <!-- Females table -->
    <p style="color:#d4af37;font-size:11px;font-weight:700;letter-spacing:0.15em;
      text-transform:uppercase;margin:0 0 8px;">🧕 Female Participants (6)</p>

    <!-- Legend -->
    <p style="color:#94a3b8;font-size:12px;margin:0 0 10px;">
      <span style="display:inline-block;padding:1px 7px;border-radius:99px;
        background:#d4af3722;color:#d4af37;border:1px solid #d4af3740;
        font-weight:700;font-size:10px;margin-right:4px;">COMPETITOR</span>
      answers questions on stage &nbsp;|&nbsp; Others = supporting members (non-competing)
    </p>

    <table style="width:100%;border-collapse:collapse;margin-bottom:28px;
      background:#0c1520;border-radius:10px;overflow:hidden;">
      <thead>
        <tr style="background:#1e3a5f;">
          <th style="padding:10px 12px;text-align:left;color:#d4af37;font-size:11px;
            font-weight:700;letter-spacing:0.1em;text-transform:uppercase;">#</th>
          <th style="padding:10px 12px;text-align:left;color:#d4af37;font-size:11px;
            font-weight:700;letter-spacing:0.1em;text-transform:uppercase;">Name</th>
          <th style="padding:10px 12px;text-align:left;color:#d4af37;font-size:11px;
            font-weight:700;letter-spacing:0.1em;text-transform:uppercase;">Age</th>
          <th style="padding:10px 12px;text-align:left;color:#d4af37;font-size:11px;
            font-weight:700;letter-spacing:0.1em;text-transform:uppercase;">Phone</th>
        </tr>
      </thead>
      <tbody>
        ${competitorRow}
        ${supporterRows}
      </tbody>
    </table>

    <!-- What happens next -->
    <p style="color:#d4af37;font-size:11px;font-weight:700;letter-spacing:0.15em;
      text-transform:uppercase;margin:0 0 12px;">📅 What Happens Next</p>
    <ol style="color:#94a3b8;font-size:14px;line-height:1.8;padding-left:18px;margin:0 0 24px;">
      <li>Our team will review your registration within <strong style="color:#e2e8f0;">48 hours</strong>.</li>
      <li>You will be contacted on the phone numbers provided.</li>
      <li>Programme details, venue and time will be communicated upon confirmation.</li>
      <li>All <strong style="color:#e2e8f0;">8 participants</strong> (6 females + 2 Ustaz) must be present on the day.</li>
    </ol>

    <!-- Contact note -->
    <div style="background:#d4af3708;border:1px solid #d4af3720;border-radius:10px;padding:16px;">
      <p style="color:#94a3b8;font-size:13px;line-height:1.6;margin:0;">
        If you have any questions, please contact us quoting your registration code
        <strong style="color:#d4af37;"> ${reg_code}</strong>.
        We look forward to seeing your team! 🌙
      </p>
    </div>
  </div>

  <!-- FOOTER -->
  <div style="background:linear-gradient(145deg,#0c1520,#060d1a);border:1px solid #d4af3730;
    border-top:none;border-radius:0 0 16px 16px;padding:20px 24px;text-align:center;">
    <div style="height:1px;background:linear-gradient(90deg,transparent,#d4af3744,transparent);
      margin-bottom:16px;"></div>
    <p style="color:#d4af3766;font-size:12px;margin:0 0 4px;">
      🌙 Hamduk Islamic Foundation · Knowledge Quiz Programme
    </p>
    <p style="color:#475569;font-size:11px;margin:0;">
      This is an automated confirmation email. Please do not reply directly to this message.
    </p>
  </div>

</div>
</body>
</html>`;
}

// ─── POST handler ─────────────────────────────────────────────────────────────
export async function POST(req: NextRequest) {
  try {
    const body: RequestBody = await req.json();

    const {
      targets,
      mosque_name,
      reg_code,
      contact_name,
      contact_phone,
      ustaz_name,
      ustaz2_name = '',
      competitors,
      state,
    } = body;

    if (!targets || targets.length === 0) {
      return NextResponse.json({ message: 'No email targets provided' }, { status: 200 });
    }

    // Normalise female array — handle both old format (no is_competitor) and new format
    const females: Female[] = (competitors ?? []).map((f: any, i: number) => ({
      full_name:     f.full_name     ?? '',
      age:           f.age           ?? '',
      phone:         f.phone         ?? '',
      is_competitor: f.is_competitor !== undefined ? f.is_competitor : i === 0,
    }));

    // Send a personalised email to every recipient independently
    const results = await Promise.allSettled(
      targets.map(({ email, name, role }) =>
        resend.emails.send({
          from:    'Hamduk Islamic Foundation <hif@hamduk.com.ng>',
          to:      [email],
          subject: `✅ Registration Confirmed — ${mosque_name} | Code: ${reg_code}`,
          html:    buildEmailHtml({
            recipientName: name,
            recipientRole: role,
            mosque_name,
            reg_code,
            contact_name,
            contact_phone,
            ustaz_name,
            ustaz2_name,
            females,
            state,
          }),
        })
      )
    );

    const sent   = results.filter(r => r.status === 'fulfilled').length;
    const failed = results.filter(r => r.status === 'rejected').length;

    // Log failures but never crash — email errors must NEVER block the success screen
    results.forEach((r, i) => {
      if (r.status === 'rejected') {
        console.error(`[resend] Failed for ${targets[i]?.email}:`, (r as PromiseRejectedResult).reason);
      }
    });

    console.log(`[resend] ${reg_code} — sent: ${sent}, failed: ${failed}`);

    return NextResponse.json({ sent, failed, reg_code }, { status: 200 });

  } catch (err) {
    console.error('[confirm-email] Unexpected error:', err);
    // Always return 200 — the registration is already saved to Supabase at this point
    return NextResponse.json({ error: 'Email sending failed', sent: 0, failed: 0 }, { status: 200 });
  }
}
