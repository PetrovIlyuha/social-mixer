import { useState, useEffect } from 'react';
import axios from 'axios';

import Post from './Post';
import { collection, onSnapshot, orderBy, query } from '@firebase/firestore';
import { db } from '../../firebase';

const Posts = () => {
  const [posts, setPosts] = useState([]);

  useEffect(
    () =>
      onSnapshot(
        query(collection(db, 'posts'), orderBy('timestamp', 'desc')),
        snapshot => setPosts(snapshot.docs),
      ),
    [db],
  );

  return (
    <div>
      {posts.map(post => (
        <Post key={post.id} post={post.data()} postId={post.id} />
      ))}
    </div>
  );
};

export default Posts;
