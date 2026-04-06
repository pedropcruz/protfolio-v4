interface LeadNotification {
  name: string;
  email: string;
  projectType: string;
  velocity: string;
  services: string[];
  totalCostMin: number;
  totalCostMax: number;
  locale: string;
  utmSource?: string;
}

export async function notifyDiscord(lead: LeadNotification): Promise<void> {
  const config = useRuntimeConfig();
  if (!config.discordWebhookUrl) return;

  const embed = {
    title: '🎯 New Lead',
    color: 0xD4A843,
    fields: [
      { name: 'Name', value: lead.name, inline: true },
      { name: 'Email', value: lead.email, inline: true },
      { name: 'Type', value: lead.projectType.toUpperCase(), inline: true },
      { name: 'Velocity', value: lead.velocity.toUpperCase(), inline: true },
      { name: 'Services', value: lead.services.join(', '), inline: false },
      { name: 'Estimate', value: `€${lead.totalCostMin.toLocaleString()} - €${lead.totalCostMax.toLocaleString()} + IVA`, inline: true },
      { name: 'Locale', value: lead.locale.toUpperCase(), inline: true }
    ],
    timestamp: new Date().toISOString()
  };

  if (lead.utmSource) {
    embed.fields.push({ name: 'UTM Source', value: lead.utmSource, inline: true });
  }

  try {
    await $fetch(config.discordWebhookUrl, {
      method: 'POST',
      body: { embeds: [embed] }
    });
  }
  catch (err) {
    console.error('[Discord] Failed to send notification:', err);
  }
}

export async function notifyDiscordError(error: string, context?: string): Promise<void> {
  const config = useRuntimeConfig();
  if (!config.discordWebhookUrl) return;

  try {
    await $fetch(config.discordWebhookUrl, {
      method: 'POST',
      body: {
        embeds: [{
          title: '⚠️ Estimator Error',
          color: 0xFF0000,
          description: error,
          fields: context ? [{ name: 'Context', value: context }] : [],
          timestamp: new Date().toISOString()
        }]
      }
    });
  }
  catch {
    console.error('[Discord] Failed to send error notification');
  }
}
