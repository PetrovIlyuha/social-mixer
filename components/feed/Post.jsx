import {
  BookmarkIcon,
  ChatIcon,
  DotsHorizontalIcon,
  EmojiHappyIcon,
  HeartIcon,
  PaperAirplaneIcon,
} from '@heroicons/react/outline';
import { HeartIcon as HeartSmashed } from '@heroicons/react/solid';
import { useRef, useEffect, useState } from 'react';
import Moment from 'react-moment';
import {
  addDoc,
  collection,
  query,
  serverTimestamp,
  onSnapshot,
  orderBy,
  setDoc,
  doc,
  deleteDoc,
} from '@firebase/firestore';
import { db } from '../../firebase';
import { useSession } from 'next-auth/react';

const Post = ({ post, postId }) => {
  const postRef = useRef(null);
  const { data: session } = useSession();
  const [visible, setVisible] = useState(false);
  const [comments, setComments] = useState([]);
  const [singleComment, setSingleComment] = useState('');
  const [likes, setLikes] = useState([]);
  const [hasLiked, setHasLiked] = useState(false);

  useEffect(
    () =>
      onSnapshot(
        query(
          collection(db, 'posts', postId, 'comments'),
          orderBy('timestamp', 'desc'),
        ),
        snapshot => setComments(snapshot.docs),
      ),
    [db, postId],
  );

  useEffect(
    () =>
      onSnapshot(collection(db, 'posts', postId, 'likes'), snapshot =>
        setLikes(snapshot.docs),
      ),
    [db, postId],
  );

  useEffect(() => {
    if (session) {
      setHasLiked(
        likes.findIndex(
          like => like.data().username === session.user.username,
        ) !== -1,
      );
    }
  }, [likes]);

  const toggleLikePost = async () => {
    if (session) {
      if (hasLiked) {
        await deleteDoc(
          doc(db, 'posts', postId, 'likes', session.user.username),
        );
      } else {
        await setDoc(doc(db, 'posts', postId, 'likes', session.user.username), {
          username: session.user.username,
        });
      }
    }
  };

  const addComment = async e => {
    e.preventDefault();
    const newComment = singleComment;
    setSingleComment('');
    await addDoc(collection(db, 'posts', postId, 'comments'), {
      comment: newComment,
      username: session.user.username,
      userImage: session.user.image,
      timestamp: serverTimestamp(),
    });
  };
  const onObserveCallback = entries => {
    const [entry] = entries;
    if (entry.isIntersecting) {
      setVisible(true);
    } else {
      setVisible(false);
    }
  };

  const observerOptions = {
    root: null,
    rootMargin: '0px',
    threshold: 0.2,
  };

  useEffect(() => {
    let itemRef = postRef.current;
    const observer = new IntersectionObserver(
      onObserveCallback,
      observerOptions,
    );
    if (itemRef) observer.observe(itemRef);
    return () => {
      if (itemRef) observer.unobserve(itemRef);
    };
  }, [observerOptions]);

  return (
    <div
      className='bg-white my-7 boder rounded-sm shadow-sm'
      style={{ opacity: visible ? 1 : 0, transition: 'all 0.5s ease-in' }}
      ref={postRef}>
      <div className='flex items-center p-5'>
        <img
          src={post.profileImg}
          alt={post.username}
          className='rounded-full h-12 w-12 object-contain border p-1 mr-3'
        />
        <p className='flex-1 font-bold'>{post.username}</p>
        <DotsHorizontalIcon className='h-4' />
      </div>
      <img
        src={post.image}
        alt={post.username}
        className='w-full object-cover'
      />
      <div className='flex justify-between px-4 py-4'>
        <div className='flex space-x-4'>
          {hasLiked ? (
            <HeartSmashed
              onClick={toggleLikePost}
              className='w-5 sm:w-6 md:w-8 cursor-pointer hover:scale-110 transition-all duration-200 ease-out text-red-500'
            />
          ) : (
            <HeartIcon
              onClick={toggleLikePost}
              className='w-5 sm:w-6 md:w-8 cursor-pointer hover:scale-110 transition-all duration-200 ease-out'
            />
          )}
          <ChatIcon className='w-5 sm:w-6 md:w-8 cursor-pointer hover:scale-110 transition-all duration-200 ease-out' />
          <PaperAirplaneIcon className='w-5 sm:w-6 md:w-6 cursor-pointer hover:scale-110 transition-all duration-200 ease-out' />
          <div
            className={`${
              likes.length === 0 && 'hidden'
            } ml-4 flex items-center justify-between text-sm text-gray-700 font-bold`}>
            Liked by:{` `}
            {likes.slice(0, 1).map((like, idx) => (
              <>
                <span className='font-semibold text-gray-500 ml-1' key={idx}>
                  {like.data().username}
                </span>
                {likes.length > 1 && (
                  <span className='ml-3'>and {likes.length - 1} more...</span>
                )}
              </>
            ))}
          </div>
        </div>
        <BookmarkIcon className='w-5 sm:w-6 md:w-8 cursor-pointer hover:scale-110 transition-all duration-200 ease-out' />
      </div>
      <p className='p-5 truncate'>
        <span className='mr-2 font-semibold'>{post.username}</span>
        {post.caption}
      </p>

      {comments.length > 0 && (
        <div>
          <div className='ml-10 h-20 overflow-y-scroll scrollbar-thumb-black scrollbar-thin'>
            {comments.map(comment => (
              <div
                key={comment.id}
                className='flex items-center space-x-2 mb-3'>
                <img
                  src={comment.data().userImage}
                  alt='user comment pic'
                  className='h-8 rounded-full'
                />
                <p className='text-sm flex-1'>
                  <span className='font-bold'>{comment.data().username}</span>{' '}
                  {comment.data().comment}
                </p>
                <Moment className='pr-5 text-xs' fromNow>
                  {comment.data().timestamp?.toDate()}
                </Moment>
              </div>
            ))}
          </div>
        </div>
      )}
      {session && (
        <form className='flex items-center p-4' onSubmit={addComment}>
          <EmojiHappyIcon className='h-7' />
          <input
            type='text'
            placeholder='Add a comment...'
            className='border-none flex-1 focus:ring-0'
            value={singleComment}
            onChange={e => setSingleComment(e.target.value)}
          />
          <button
            type='submit'
            disabled={!singleComment.trim()}
            className='font-semibold text-blue-400'>
            Post
          </button>
        </form>
      )}
    </div>
  );
};

export default Post;
