import { useEffect, useState } from 'react';
import faker from 'faker';

const useFakeUsers = count => {
  const [suggestions, setSuggestions] = useState([]);
  useEffect(() => {
    const suggestions = [...Array(count)].map((_, idx) => ({
      ...faker.helpers.contextualCard(),
      avatar: `/static/user${(idx + 1) % 8}.jpg`,
      id: idx,
    }));
    setSuggestions(suggestions);
  }, []);

  return { suggestions };
};

export default useFakeUsers;
