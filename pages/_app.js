import { SessionProvider } from 'next-auth/react';
import 'tailwindcss/tailwind.css';
import '../public/global.css';
import '../components/shared/loading-dots.css';
import { RecoilRoot } from 'recoil';

function MyApp({ Component, pageProps: { session, ...pageProps } }) {
  return (
    <SessionProvider session={session}>
      <RecoilRoot>
        <Component {...pageProps} />
      </RecoilRoot>
    </SessionProvider>
  );
}

export default MyApp;
