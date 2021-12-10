import MiniProfile from './MiniProfile';
import Posts from './Posts';
import Stories from './Stories';
import Suggestions from './Suggestions';
import { useSession } from 'next-auth/react';
import { motion } from 'framer-motion';

const Feed = () => {
  const { data: session } = useSession();
  return (
    <motion.main
      initial={{ opacity: 0.2, y: 300 }}
      animate={{ opacity: 1, y: 0, transition: { duration: 0.3, delay: 0.09 } }}
      className={`grid grid-cols-1 md:grid-cols-2 md:max-w-3xl xl:grid-cols-3 xl:max-w-6xl mx-auto ${
        !session && '!grid-cols-1 !max-w-3xl'
      }`}>
      <section className='col-span-2'>
        <Stories />
        <Posts />
      </section>
      <section className='hidden md:col-span-1 xl:inline-grid'>
        <div className='fixed'>
          <MiniProfile />
          <Suggestions />
        </div>
      </section>
    </motion.main>
  );
};

export default Feed;
