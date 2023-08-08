import { useState } from 'react';
const Alert = () => {
  const [openAlertList, setOpenAlertList] = useState(false);
  return (
    <div>
      <button onClick={() => setOpenAlertList(!openAlertList)}>알림</button>
      {openAlertList
        ? {
            /* 태그된 글이 생성되었을때 알림창 보내기
    잘몰라서 찾아봐야함 */
          }
        : null}
    </div>
  );
};
export default Alert;
