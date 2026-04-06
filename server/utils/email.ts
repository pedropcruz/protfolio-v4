import { Resend } from 'resend';

interface EstimateEmailData {
  name: string;
  email: string;
  projectType: string;
  velocity: string;
  services: string[];
  problem: string;
  currentSolution?: string;
  expectedOutcome: string;
  budgetRange?: string;
  monthlyHours?: string;
  locale: string;
  utmSource?: string;
  utmMedium?: string;
  utmCampaign?: string;
  estimate: {
    invoiceId: string;
    date: string;
    totalCostMin: number;
    totalCostMax: number;
    totalHoursMin: number;
    totalHoursMax: number;
    hourlyRateMin?: number;
    hourlyRateMax?: number;
    feasibility: string;
    breakdown: Array<{ item: string; hoursMin: number; hoursMax: number; costMin: number; costMax: number }>;
    expressSurcharge: boolean;
    message: string;
  };
}

function getResend(): Resend {
  const config = useRuntimeConfig();
  return new Resend(config.resendApiKey);
}

export async function sendClientReceipt(data: EstimateEmailData): Promise<void> {
  const resend = getResend();
  const isPt = data.locale === 'pt';
  const { estimate } = data;

  const isRetainer = data.projectType === 'retainer';
  const taxLabel = isPt ? 'IVA (23%)' : 'VAT (23% — Portuguese tax rate)';

  const breakdownRows = estimate.breakdown.map(item =>
    `<tr>
      <td style="padding:8px 0;border-bottom:1px solid #333;color:#e8e8e8;font-size:13px">${item.item}</td>
      <td style="padding:8px 0;border-bottom:1px solid #333;color:#999;font-size:13px;text-align:right">${item.hoursMin === item.hoursMax ? `${item.hoursMin}h` : `${item.hoursMin}-${item.hoursMax}h`}</td>
      <td style="padding:8px 0;border-bottom:1px solid #333;color:#999;font-size:13px;text-align:right">&euro;${item.costMin.toLocaleString()}${item.costMin !== item.costMax ? ` - &euro;${item.costMax.toLocaleString()}` : ''}</td>
    </tr>`
  ).join('');

  const totalDisplay = isRetainer && estimate.hourlyRateMin
    ? `&euro;${estimate.hourlyRateMin}/h - &euro;${estimate.hourlyRateMax}/h + ${taxLabel}`
    : `&euro;${estimate.totalCostMin.toLocaleString()} - &euro;${estimate.totalCostMax.toLocaleString()} + ${taxLabel}`;

  const periodLabel = isRetainer
    ? (isPt ? 'EST. MENSAL' : 'EST. MONTHLY')
    : (isPt ? 'EST. TOTAL' : 'EST. TOTAL');

  const subject = isPt
    ? `Estimativa de Projeto — ${estimate.invoiceId}`
    : `Project Estimate — ${estimate.invoiceId}`;

  const disclaimer = isPt
    ? 'Estimativa gerada algoritmicamente. Valores indicativos sujeitos a validacao numa conversa com o Pedro. Precos acrescidos de IVA (23%). Valida por 7 dias.'
    : 'Algorithmically generated estimate. Indicative values subject to validation in a conversation with Pedro. Prices subject to VAT (23% — Portuguese tax rate). Valid for 7 days.';

  const contactMsg = isPt
    ? 'O Pedro ira entrar em contacto consigo brevemente.'
    : 'Pedro will get in touch with you shortly.';

  const html = `
    <div style="background:#111;color:#e8e8e8;font-family:'Space Mono',monospace;max-width:600px;margin:0 auto;padding:32px">
      <div style="border:1px solid #333;padding:24px;border-radius:8px;background:#1a1a1a">
        <div style="display:flex;justify-content:space-between;border-bottom:1px solid #333;padding-bottom:16px;margin-bottom:16px">
          <span style="color:#999;font-size:12px">INVOICE_ID: ${estimate.invoiceId}</span>
          <span style="color:#999;font-size:12px">DATE: ${estimate.date}</span>
        </div>

        <div style="margin-bottom:16px;padding:12px;background:#111;border:1px solid #333;border-radius:4px">
          <span style="color:#999;font-size:11px">FEASIBILITY:</span>
          <span style="background:#d4a843;color:#000;padding:2px 8px;border-radius:12px;font-size:11px;font-weight:bold;margin-left:8px">${estimate.feasibility}</span>
        </div>

        <table style="width:100%;border-collapse:collapse;margin-bottom:24px">
          <thead>
            <tr>
              <th style="text-align:left;padding:8px 0;border-bottom:2px solid #333;color:#999;font-size:11px">ITEM</th>
              <th style="text-align:right;padding:8px 0;border-bottom:2px solid #333;color:#999;font-size:11px">HOURS</th>
              <th style="text-align:right;padding:8px 0;border-bottom:2px solid #333;color:#999;font-size:11px">COST</th>
            </tr>
          </thead>
          <tbody>${breakdownRows}</tbody>
        </table>

        <div style="border-top:2px solid #333;padding-top:16px;text-align:right">
          <div style="color:#999;font-size:11px;margin-bottom:4px">${periodLabel}</div>
          <div style="background:#d4a843;color:#000;display:inline-block;padding:8px 16px;border-radius:8px;font-size:24px;font-weight:bold">${totalDisplay}</div>
          <div style="color:#999;font-size:11px;margin-top:4px">~${estimate.totalHoursMin}${estimate.totalHoursMin !== estimate.totalHoursMax ? `-${estimate.totalHoursMax}` : ''} ${isPt ? 'HORAS' : 'HOURS'}${isRetainer ? (isPt ? ' / MES' : ' / MO') : ''}</div>
        </div>

        <div style="margin-top:24px;padding:12px;background:#111;border:1px solid #333;border-radius:4px;font-size:10px;color:#666">
          * ${disclaimer}
        </div>

        <div style="margin-top:24px;text-align:center">
          <p style="color:#d4a843;font-size:13px;font-weight:bold">${contactMsg}</p>
          <a href="mailto:me@pedropcruz.pt" style="color:#d4a843;font-size:12px">me@pedropcruz.pt</a>
        </div>
      </div>
    </div>
  `;

  try {
    await resend.emails.send({
      from: 'Pedro Cruz <me@pedropcruz.pt>',
      to: data.email,
      subject,
      html
    });
  }
  catch (err) {
    console.error('[Email] Failed to send client receipt:', err);
  }
}

export async function sendPedroNotification(data: EstimateEmailData): Promise<void> {
  const resend = getResend();
  const { estimate } = data;

  const html = `
    <div style="font-family:monospace;max-width:600px;margin:0 auto;padding:16px">
      <h2 style="color:#d4a843">New Lead — ${estimate.invoiceId}</h2>

      <table style="width:100%;border-collapse:collapse">
        <tr><td style="padding:4px 8px;font-weight:bold">Name</td><td style="padding:4px 8px">${data.name}</td></tr>
        <tr><td style="padding:4px 8px;font-weight:bold">Email</td><td style="padding:4px 8px"><a href="mailto:${data.email}">${data.email}</a></td></tr>
        <tr><td style="padding:4px 8px;font-weight:bold">Type</td><td style="padding:4px 8px">${data.projectType.toUpperCase()}</td></tr>
        <tr><td style="padding:4px 8px;font-weight:bold">Velocity</td><td style="padding:4px 8px">${data.velocity.toUpperCase()}</td></tr>
        <tr><td style="padding:4px 8px;font-weight:bold">Services</td><td style="padding:4px 8px">${data.services.join(', ')}</td></tr>
        <tr><td style="padding:4px 8px;font-weight:bold">Locale</td><td style="padding:4px 8px">${data.locale.toUpperCase()}</td></tr>
        <tr><td style="padding:4px 8px;font-weight:bold">Budget Range</td><td style="padding:4px 8px">${data.budgetRange || 'N/A'}</td></tr>
        <tr><td style="padding:4px 8px;font-weight:bold">Monthly Hours</td><td style="padding:4px 8px">${data.monthlyHours || 'N/A'}</td></tr>
      </table>

      <h3>Problem</h3>
      <p>${data.problem}</p>

      <h3>Current Solution</h3>
      <p>${data.currentSolution || 'None'}</p>

      <h3>Expected Outcome</h3>
      <p>${data.expectedOutcome}</p>

      <h3>Estimate Generated</h3>
      <p><strong>&euro;${estimate.totalCostMin.toLocaleString()} - &euro;${estimate.totalCostMax.toLocaleString()} + IVA</strong></p>
      <p>Feasibility: ${estimate.feasibility}</p>
      <p>Hours: ${estimate.totalHoursMin}-${estimate.totalHoursMax}h</p>
      ${estimate.hourlyRateMin ? `<p>Hourly: &euro;${estimate.hourlyRateMin}-&euro;${estimate.hourlyRateMax}/h</p>` : ''}

      <h3>UTM</h3>
      <p>Source: ${data.utmSource || '-'} | Medium: ${data.utmMedium || '-'} | Campaign: ${data.utmCampaign || '-'}</p>
    </div>
  `;

  try {
    await resend.emails.send({
      from: 'Estimator <me@pedropcruz.pt>',
      to: 'me@pedropcruz.pt',
      subject: `🎯 New Lead: ${data.name} — ${data.projectType.toUpperCase()} — €${estimate.totalCostMin.toLocaleString()}-€${estimate.totalCostMax.toLocaleString()}`,
      html
    });
  }
  catch (err) {
    console.error('[Email] Failed to send Pedro notification:', err);
  }
}
