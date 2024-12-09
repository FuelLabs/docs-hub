import dynamic from 'next/dynamic';
const BaseAskCookbook = dynamic(() => import('@cookbookdev/docsbot/react'), {
  ssr: false,
});

/** It's a public API key, so it's safe to expose it here */
const PUBLIC_API_KEY =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiI2NWYwZGRiNTc0YWNiMmU0NWFmOThiYjYiLCJpYXQiOjE3MTAyODQyMTMsImV4cCI6MjAyNTg2MDIxM30.WxJO7NrRekz6OCWb2wa8gZeFEfRfUM48Ks0GKqScVXo';

export const AskCookbook = () => {
  // @ts-ignore
  return <BaseAskCookbook apiKey={PUBLIC_API_KEY} />;
};
