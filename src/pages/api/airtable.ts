import airtable from 'airtable';
import type { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  if (req.method === 'POST') {
    try {
      const { helpful, feedback, email } = req.body;
      const url = req.headers.referer;
      airtable.configure({
        endpointUrl: 'https://api.airtable.com',
        apiKey: process.env.AIRTABLE_API_KEY,
      });
      const base = airtable.base('appSeuqKIBvc0BON5');

      const isHelpful = helpful === 'true' ? '👍 Yes' : '👎 No';

      const records = await base('General User Survey').create([
        {
          fields: {
            URL: url,
            'Helpful?': isHelpful,
            Feedback: feedback,
            Email: email,
          },
        },
      ]);
      if (records.length === 1) {
        res.status(200).json({ success: true });
      } else {
        res.status(500).json({ success: false });
      }
    } catch (error) {
      console.error('Error sending data to Airtable:', error);
      res.status(500).json({ success: false });
    }
  } else {
    res.status(405).end();
  }
}
