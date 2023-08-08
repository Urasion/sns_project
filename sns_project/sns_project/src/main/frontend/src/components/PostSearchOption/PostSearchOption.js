import { useState } from 'react';

const PostSearchOption = () => {
  //todo: option은 redux로 관리해야 할 필요가 있음
  const [option, setOption] = useState('글제목');
  const [openDropdown, setOpenDropdown] = useState(false);
  const PostSearchOptions = ['글제목', '작성자', '태그'];
  const handleOption = (e) => {
    setOption(e.target.innerText);
    setOpenDropdown(false);
  };
  return (
    <div>
      <button onClick={() => setOpenDropdown(!openDropdown)}>{option}</button>
      {openDropdown ? (
        <div>
          {PostSearchOptions.map((el, idx) => (
            <button key={idx} onClick={(e) => handleOption(e)}>
              {el}
            </button>
          ))}
        </div>
      ) : null}
    </div>
  );
};
export default PostSearchOption;
