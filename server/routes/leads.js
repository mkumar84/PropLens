import { Router } from 'express';
import { Resend } from 'resend';
import { createClient } from '@supabase/supabase-js';

const router  = Router();
const resend  = new Resend(process.env.RESEND_API_KEY);
const supabase = createClient(
  process.env.SUPABASE_URL || '',
  process.env.SUPABASE_SERVICE_KEY || ''
);

const AGENT_EMAIL = 'mahesh@propertylens.ca'; // TODO: MAHESH TO PROVIDE

function buildAgentEmail(lead) {
  return `
    <h2>New ${lead.type} lead — PropertyLens</h2>
    <p><strong>Name:</strong> ${lead.name || 'not provided'}</p>
    <p><strong>Email:</strong> ${lead.email}</p>
    ${lead.phone ? `<p><strong>Phone:</strong> ${lead.phone}</p>` : ''}
    ${lead.propertyAddress ? `<p><strong>Property:</strong> ${lead.propertyAddress}</p>` : ''}
    ${lead.budget ? `<p><strong>Budget:</strong> ${lead.budget}</p>` : ''}
    ${lead.timeline ? `<p><strong>Timeline:</strong> ${lead.timeline}</p>` : ''}
    ${lead.message ? `<p><strong>Message:</strong> ${lead.message}</p>` : ''}
    ${lead.brief ? `<p><strong>Brief:</strong> ${lead.brief}</p>` : ''}
    ${lead.preferredTime ? `<p><strong>Preferred Time:</strong> ${lead.preferredTime}</p>` : ''}
    ${lead.conversation ? `<hr><h3>Conversation history</h3><pre style="font-size:12px;background:#f5f5f5;padding:12px;border-radius:8px;">${JSON.stringify(lead.conversation, null, 2)}</pre>` : ''}
    <hr>
    <p style="color:#888;font-size:12px;">Submitted ${new Date().toLocaleString('en-CA', { timeZone: 'America/Toronto' })} ET via PropertyLens</p>
  `;
}

router.post('/', async (req, res) => {
  const lead = req.body;

  if (!lead.email) return res.status(400).json({ error: 'email required' });

  try {
    // Save to Supabase
    await supabase.from('leads').insert({
      type:             lead.type || 'general',
      name:             lead.name || null,
      email:            lead.email,
      phone:            lead.phone || null,
      property_address: lead.propertyAddress || null,
      message:          lead.message || lead.brief || null,
      conversation:     lead.conversation || null,
    });

    // Notify agent
    await resend.emails.send({
      from:    'PropertyLens <noreply@propertylens.ca>',
      to:      AGENT_EMAIL,
      subject: `New ${lead.type || 'lead'} — ${lead.name || lead.email}${lead.propertyAddress ? ` · ${lead.propertyAddress}` : ''}`,
      html:    buildAgentEmail(lead),
    });

    // CMA / alert: send report to user
    if (lead.type === 'cma' || lead.type === 'alert') {
      await resend.emails.send({
        from:    'Mahesh at PropertyLens <mahesh@propertylens.ca>',
        to:      lead.email,
        subject: lead.type === 'cma'
          ? `Your CMA report${lead.propertyAddress ? ` — ${lead.propertyAddress}` : ''}`
          : 'Your saved search — PropertyLens',
        html: `
          <p>Hi ${lead.name || 'there'},</p>
          <p>${lead.type === 'cma'
            ? "I'll have your full CMA report ready shortly. I'll follow up personally if I spot anything worth flagging."
            : "Your search is saved. I'll be in touch as soon as matching properties hit the market."
          }</p>
          <p>— Mahesh Kumar<br>PropertyLens · <a href="https://propertylens.ca">propertylens.ca</a></p>
        `,
      });
    }

    res.json({ ok: true });
  } catch (err) {
    console.error('Lead error:', err);
    res.status(500).json({ error: 'Failed to save lead' });
  }
});

export default router;
