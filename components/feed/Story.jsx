import React from 'react';

const Story = ({ profile, self }) => {
  return (
    <div>
      <img
        className='h-14 w-14 rounded-full p-[1.5px] border-green-500
                  border-2 object-contain cursor-pointer
                  hover:scale-110 transition transform duration-200 ease-out'
        src={self ? profile.image : profile.avatar}
        alt='user story avatar'
      />
      <p className='text-sx w-14 truncate text-center'>{profile.username}</p>
    </div>
  );
};

export default Story;
