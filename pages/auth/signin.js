import { motion } from 'framer-motion';
import { getProviders, signIn } from 'next-auth/react';
import Header from '../../components/header';
import styles from './signin.module.css';

const SignIn = ({ providers }) => {
  return (
    <>
      <Header />
      <motion.div
        initial={{ opacity: 0, scale: 0 }}
        animate={{
          opacity: 1,
          scale: 1,
          transition: { duration: 0.3, delay: 0.1 },
        }}
        className={styles.container_center}>
        <div className={styles.card}>
          <img
            src='/static/mix_logo.jpg'
            style={{ width: '80px', borderRadius: '50%' }}
            alt=''
          />
          <p className={styles.welcomeMessage}>Welcome To Social Mixer</p>
          <div>
            {Object.values(providers).map(provider => (
              <div key={provider.name}>
                <button
                  className={styles.loginButton}
                  onClick={() => signIn(provider.id, { callbackUrl: '/' })}>
                  Sign in With {provider.name}
                </button>
              </div>
            ))}
          </div>
        </div>
      </motion.div>
    </>
  );
};

export async function getServerSideProps(ctx) {
  const providers = await getProviders();

  return { props: { providers } };
}

export default SignIn;
