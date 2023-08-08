import { useState } from 'react';

const ChatSettingButton = () => {
  const [openSetting, setOpenSetting] = useState(false);
  return (
    <div>
      <button onClick={() => setOpenSetting(!openSetting)}>채팅방 추가</button>
      {openSetting ? (
        <div>
          <div>
            <input placeholder="채팅방 이름"></input>
            <button>만들기</button>
          </div>
          <div>{/* 친구 목록 체크박스 있는 형태로 띄워주기 */}</div>
        </div>
      ) : null}
    </div>
  );
};
export default ChatSettingButton;
