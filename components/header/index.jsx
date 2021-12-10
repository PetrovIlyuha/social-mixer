import { Menu, Transition } from '@headlessui/react';
import { Fragment } from 'react';
import Image from 'next/image';
import {
  ChevronDownIcon,
  HeartIcon,
  HomeIcon,
  MenuIcon,
  PaperAirplaneIcon,
  PlusCircleIcon,
  SearchIcon,
  UserGroupIcon,
} from '@heroicons/react/outline';
import { signIn, signOut, useSession } from 'next-auth/react';
import { useRouter } from 'next/router';
import { useRecoilState } from 'recoil';
import { modalState } from '../../atoms/modal.atom';

function classNames(...classes) {
  return classes.filter(Boolean).join(' ');
}
const Header = () => {
  const { data: session } = useSession();
  const router = useRouter();
  const [open, setOpen] = useRecoilState(modalState);
  return (
    <div className='bg-white shadow-md sticky top-0 z-10'>
      <div className='flex h-20 justify-between items-center  max-w-6xl mx-auto'>
        <div
          onClick={() => router.push('/')}
          className='relative h-24 w-44 flex items-center justify-between cursor-pointer ml-4'>
          <div className='relative h-10 w-10 md:h-14 md:w-14 rounded-md'>
            <Image
              src='/static/mix_logo.jpg'
              layout='fill'
              className='rounded-full shadow-sm'
            />
          </div>
          <h2 className='hidden lg:inline-grid font-bold text-xl'>
            SocialMixer
          </h2>
        </div>
        <div className='max-w-sm'>
          <div className='relative p-3'>
            <div className='absolute inset-y-0 pl-3 flex items-center'>
              <SearchIcon className='h-5 w-5 text-gray-400' />
            </div>
            <input
              type='text'
              placeholder='search...'
              className='bg-gray-50 pl-10 h-10 rounded-lg border-blue-200 border-2 shadow-md block w-full focus:ring-blue-300 focus:border-blue-400'
            />
          </div>
        </div>

        <div className='flex mr-4 max-w-sm items-center justify-between space-x-2'>
          <HomeIcon
            onClick={() => router.push('/')}
            className='w-10 sm:w-8 md:w-6 cursor-pointer hover:scale-110 transition-all duration-200 ease-out'
          />
          <MenuIcon className='w-10 sm:w-8 md:w-6  cursor-pointer md:hidden' />
          {session ? (
            <>
              <div className='relative hidden md:inline'>
                <div className='absolute -top-1 -right-2 text-xs w-5 h-5 bg-blue-600 rounded-full flex items-center justify-center text-white animate-pulse'>
                  <div className='mt-1'>3</div>
                </div>
                <PaperAirplaneIcon className='w-6 cursor-pointer hidden md:inline-flex hover:scale-110 transition-all duration-200 ease-out rotate-45' />
              </div>
              <PlusCircleIcon
                onClick={() => setOpen(true)}
                className='w-6 cursor-pointer hidden md:inline-flex hover:scale-110 transition-all duration-200 ease-out'
              />
              <UserGroupIcon className='w-6 cursor-pointer hidden md:inline-flex hover:scale-110 transition-all duration-200 ease-out' />
              <HeartIcon className='w-6 cursor-pointer hidden md:inline-flex hover:scale-110 transition-all duration-200 ease-out' />
              <Menu as='div' className='relative inline-block text-left'>
                <Menu.Button>
                  <div>
                    <img
                      src={session.user.image}
                      className='h-8 rounded-full shadow-md cursor-pointer'
                      alt='user pic'
                    />
                  </div>
                </Menu.Button>

                <Transition
                  as={Fragment}
                  enter='transition ease-out duration-100'
                  enterFrom='transform opacity-0 scale-95'
                  enterTo='transform opacity-100 scale-100'
                  leave='transition ease-in duration-75'
                  leaveFrom='transform opacity-100 scale-100'
                  leaveTo='transform opacity-0 scale-95'>
                  <Menu.Items className='origin-top-right absolute right-0 mt-2 w-56 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 focus:outline-none'>
                    <div className='py-1'>
                      <Menu.Item>
                        {({ active }) => (
                          <a
                            href='#'
                            className={classNames(
                              active
                                ? 'bg-gray-100 text-gray-900'
                                : 'text-gray-700',
                              'block px-4 py-2 text-sm',
                            )}>
                            Account settings
                          </a>
                        )}
                      </Menu.Item>
                      <Menu.Item>
                        {({ active }) => (
                          <p
                            onClick={signOut}
                            className={classNames(
                              active
                                ? 'bg-gray-100 text-gray-900'
                                : 'text-gray-700',
                              'block px-4 py-2 text-sm cursor-pointer',
                            )}>
                            Sign Out
                          </p>
                        )}
                      </Menu.Item>
                    </div>
                  </Menu.Items>
                </Transition>
              </Menu>
            </>
          ) : (
            <button className='mt-1' onClick={signIn}>
              Sign In
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default Header;
