import { useState } from 'react';
import PostSearchOption from '../PostSearchOption/PostSearchOption';

const PostSearch = () => {
  const [searchword, setSearchword] = useState('');

  return (
    <div>
      <PostSearchOption />
      <input
        className="Post_Search"
        value={searchword}
        onChange={(e) => setSearchword(e.target.value)}
      ></input>
      <button>검색</button>
    </div>
  );
};

export default PostSearch;
