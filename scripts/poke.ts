const POKE_API_KEY = process.env.POKE_API_KEY;
const CONTEXT_SUFFIX = `

[this is a programmatic message from a remote hetzner box pertaining to work on the STICK project]

DO NOT ASSUME THE USER HAS SEEN THIS MESSAGE YET. RELAY THIS MESSAGE TO THE USER IN IMESSAGE.

---`;

if (!POKE_API_KEY) {
  throw new Error('POKE_API_KEY not found in environment');
}

export async function sendPoke(message: string): Promise<boolean> {
  const fullMessage = message + CONTEXT_SUFFIX;
  const response = await fetch('https://poke.com/api/v1/inbound-sms/webhook', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${POKE_API_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({message: fullMessage}),
  });

  if (!response.ok) {
    console.error(`Poke failed: ${response.status} ${response.statusText}`);
    return false;
  }

  return true;
}

// CLI usage: bun scripts/poke.ts "Your message here"
if (import.meta.main) {
  const message = process.argv[2];
  if (!message) {
    console.error('Usage: bun scripts/poke.ts <message>');
    process.exit(1);
  }

  const ok = await sendPoke(message);
  process.exit(ok ? 0 : 1);
}
