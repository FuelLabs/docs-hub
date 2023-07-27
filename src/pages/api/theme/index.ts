// Import dependencies
import { serialize, parse } from 'cookie';
import type { NextApiRequest, NextApiResponse } from 'next';

// Constants for the cookie
const THEME_COOKIE = 'theme';
const MAX_AGE = 60 * 60 * 24 * 7; // 1 week

// Helper functions
function setCookie(
  res: NextApiResponse,
  name: string,
  value: string,
  maxAge: number = MAX_AGE
) {
  const cookie = serialize(name, value, {
    maxAge,
    expires: new Date(Date.now() + maxAge * 1000),
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    path: '/',
    sameSite: 'lax',
  });

  res.setHeader('Set-Cookie', cookie);
}

function removeCookie(res: NextApiResponse, name: string) {
  const cookie = serialize(name, '', {
    maxAge: -1,
    path: '/',
  });

  res.setHeader('Set-Cookie', cookie);
}

function parseCookies(req: NextApiRequest) {
  if (req.cookies) return req.cookies;
  const cookie = req.headers && req.headers.cookie;
  return parse(cookie || '');
}

// The API handler
export default function handler(req: NextApiRequest, res: NextApiResponse) {
  const { theme } = req.query;
  const cookies = parseCookies(req);

  switch (req.method) {
    case 'GET':
      res.status(200).json({ theme: cookies[THEME_COOKIE] || 'default' });
      break;
    case 'POST':
      if (typeof theme === 'string') {
        setCookie(res, THEME_COOKIE, theme);
        res.status(200).json({ theme });
      } else {
        res.status(400).json({ error: 'Missing theme in request body' });
      }
      break;
    case 'DELETE':
      removeCookie(res, THEME_COOKIE);
      res.status(200).json({ theme: 'default' });
      break;
    default:
      res.setHeader('Allow', ['GET', 'POST', 'DELETE']);
      res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
