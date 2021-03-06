import useFakeUsers from '../../hooks/useFakeUsers';

const Suggestions = () => {
  const { suggestions } = useFakeUsers(5);
  return (
    <div className='mt-4 ml-10'>
      <div className='flex justify-between text-sm mb-5'>
        <h3 className='text-sm font-bold text-gray-400'>Suggestions for you</h3>
        <button className='text-gray-500 font-semibold'>See All</button>
      </div>
      {suggestions.map(profile => (
        <div
          key={profile.id}
          className='flex items-center justify-between mt-3'>
          <img
            src={profile.avatar}
            className='w-10 h-10 rounded-full border p-[2px]'
            alt='user suggested avatar'
          />
          <div className='flex-1 ml-4'>
            <h2 className='font-semibold text-sm'>{profile.name}</h2>
            <h3 className='text-xs text-gray-500'>
              Works @ {profile.company.name}
            </h3>
          </div>
          <button className='text-sm text-blue-400'>Follow</button>
        </div>
      ))}
    </div>
  );
};

export default Suggestions;
