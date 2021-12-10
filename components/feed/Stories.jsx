import Story from './Story';
import useFakeUsers from '../../hooks/useFakeUsers';
import { useSession } from 'next-auth/react';

const Stories = () => {
  const { suggestions } = useFakeUsers(20);
  const { data: session } = useSession();
  return (
    <div className='flex space-x-2 p-6 bg-white mt-8 border-gray-200 border rounded-md overflow-x-scroll scrollbar-thin scrollbar-thumb-black'>
      {session && <Story profile={session?.user} self={true} />}
      {suggestions.map(profile => (
        <Story key={profile.id} profile={profile} />
      ))}
    </div>
  );
};

export default Stories;
