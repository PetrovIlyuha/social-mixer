import { ArrowCircleUpIcon } from '@heroicons/react/solid';

const ScrollTopButton = ({ visible, scrollToTop }) => {
  return (
    visible && (
      <ArrowCircleUpIcon
        color='gray'
        className='fixed right-1 bottom-1 sm:right-4 sm:bottom-4  p-3 w-14 sm:w-16 animate-pulse cursor-pointer'
        onClick={scrollToTop}
      />
    )
  );
};

export default ScrollTopButton;
