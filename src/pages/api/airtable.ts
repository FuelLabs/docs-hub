import airtable from 'airtable';
import type { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === 'POST') {
    try {
      const { helpful, feedback, email } = req.body;

      airtable.configure({
        endpointUrl: 'https://api.airtable.com',
        apiKey: process.env.AIRTABLE_API_KEY,
      });
      const base = airtable.base('appSeuqKIBvc0BON5');

      base('General User Survey').create([
        {
          fields: {
            'Helpful?': '👍 Yes',
          },
        },
      ]);

      res.status(200).json({ success: true });
    } catch (error) {
      console.error('Error sending data to Airtable:', error);
      res.status(500).json({ success: false });
    }
  } else {
    res.status(405).end();
  }
}
