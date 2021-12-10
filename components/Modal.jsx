import { Dialog, Transition } from '@headlessui/react';
import { CameraIcon } from '@heroicons/react/outline';
import { Fragment, useRef, useState, useEffect } from 'react';
import { useRecoilState } from 'recoil';
import { modalState } from '../atoms/modal.atom';
import { db, storage } from '../firebase';
import {
  addDoc,
  collection,
  doc,
  serverTimestamp,
  updateDoc,
} from '@firebase/firestore';
import { useSession } from 'next-auth/react';
import { ref, getDownloadURL, uploadString } from '@firebase/storage';

const Modal = () => {
  const { data: session } = useSession();
  const [open, setOpen] = useRecoilState(modalState);
  const [postImageFile, setPostImageFile] = useState(null);
  const [caption, setCaption] = useState('');
  const [errors, setErrors] = useState({ image: '', caption: '' });
  const [loading, setLoading] = useState(false);
  const filePickerRef = useRef(null);

  const closeModal = () => {
    setOpen(false);
    setErrors({ image: '', caption: '' });
    setPostImageFile(null);
    setCaption('');
  };

  const addImageToPost = e => {
    const reader = new FileReader();
    if (e.target.files[0]) {
      reader.readAsDataURL(e.target.files[0]);
    }

    reader.onload = e => {
      setPostImageFile(e.target.result);
      setErrors({ ...errors, image: '' });
    };
  };

  const checkCaptionAndSet = e => {
    setCaption(e.target.value);
    if (caption.length) {
      setErrors({ ...errors, caption: '' });
    } else {
      setErrors({ ...errors, caption: 'Please enter some caption!' });
    }
  };

  const uploadPost = async () => {
    let errorsCheck = { image: '', caption: '' };
    if (postImageFile === null) {
      setErrors({ ...errors, image: 'Please, select an Image!' });
      errorsCheck.image = 'Please, NO!';
    }
    if (!caption.length) {
      setErrors({ ...errors, caption: 'Please enter some caption!' });
      errorsCheck.caption = 'Please, NO!';
    }
    if (loading) {
      return;
    }

    if (Object.values(errorsCheck).every(v => v === '')) {
      console.log('should save post');
      setLoading(true);
      const postRef = await addDoc(collection(db, 'posts'), {
        username: session?.user?.username,
        caption,
        profileImg: session?.user?.image,
        timestamp: serverTimestamp(),
      });

      const imageRef = ref(storage, `posts/${postRef.id}/image`);
      console.log({ imageRef });
      if (imageRef) {
        await uploadString(imageRef, postImageFile, 'data_url').then(
          async snapshot => {
            const downloadURL = await getDownloadURL(imageRef);
            await updateDoc(doc(db, 'posts', postRef.id), {
              image: downloadURL,
            });
          },
        );
        setLoading(false);
        setOpen(false);
        setPostImageFile(null);
        setCaption('');
      }
    }
  };

  useEffect(() => {
    return () => {
      setLoading(false);
    };
  }, []);

  return (
    <Transition.Root show={open} as={Fragment}>
      <Dialog
        as='div'
        className='fixed z-10 inset-0 overflow-y-auto'
        onClose={closeModal}>
        <div className='flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0'>
          <Transition.Child
            as={Fragment}
            enter='ease-out duration-300'
            enterFrom='opacity-0'
            enterTo='opacity-100'
            leave='ease-in duration-200'
            leaveFrom='opacity-100'
            leaveTo='opacity-0'>
            <Dialog.Overlay className='fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity' />
          </Transition.Child>

          {/* This element is to trick the browser into centering the modal contents. */}
          <span
            className='hidden sm:inline-block sm:align-middle sm:h-screen'
            aria-hidden='true'>
            &#8203;
          </span>
          <Transition.Child
            as={Fragment}
            enter='ease-out duration-300'
            enterFrom='opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95'
            enterTo='opacity-100 translate-y-0 sm:scale-100'
            leave='ease-in duration-200'
            leaveFrom='opacity-100 translate-y-0 sm:scale-100'
            leaveTo='opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95'>
            <div className='inline-block align-bottom bg-white rounded-lg px-4 pt-5 pb-4 text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-sm sm:w-full sm:p-6'>
              <div>
                {postImageFile ? (
                  <img
                    className='border-2 ring-offset-2 border-blue-400 rounded-md shadow-md'
                    src={postImageFile}
                    onClick={() => setPostImageFile(null)}
                  />
                ) : (
                  <div
                    className='mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-blue-800 cursor-pointer'
                    onClick={() => filePickerRef.current.click()}>
                    <CameraIcon
                      className='w-6 h-6 text-blue-100 animate-pulse'
                      aria-hidden='true'
                    />
                  </div>
                )}
                {errors.image && (
                  <div className='bg-red-200 text-sm text-center text-gray-600 mt-2 px-8 py-2 rounded-sm shadow-sm'>
                    {errors.image}
                  </div>
                )}
                <div className='mt-3 text-center sm:mt-5'>
                  <Dialog.Title
                    as='h3'
                    className='text-lg leading-6 font-medium text-gray-800'>
                    Upload A Photo
                  </Dialog.Title>
                  <div>
                    <input
                      type='file'
                      hidden
                      ref={filePickerRef}
                      onChange={addImageToPost}
                    />
                  </div>
                  {errors.caption && (
                    <div className='bg-red-200 text-sm leading-6 text-gray-600 px-8 py-2 mt-2 rounded-sm shadow-sm'>
                      {errors.caption}
                    </div>
                  )}
                </div>
                <div className='mt-2'>
                  <input
                    type='text'
                    className='border-none focus:ring-0 w-full text-left'
                    placeholder='Please enter a caption...'
                    onChange={checkCaptionAndSet}
                  />
                </div>
                <div className='mt-5 sm:mt-6'>
                  <button
                    type='button'
                    className='inline-flex justify-center w-full rounded-md border border-transparent shadow-sm px-4 py-2 bg-green-600 text-base font-medium text-white hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:text-sm'
                    onClick={uploadPost}>
                    Upload Post
                  </button>
                </div>
              </div>
            </div>
          </Transition.Child>
        </div>
      </Dialog>
    </Transition.Root>
  );
};

export default Modal;
