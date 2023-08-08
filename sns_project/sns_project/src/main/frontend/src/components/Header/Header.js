import Homeicon from '../Home_Icon/Home_icon';
import PostSearch from '../PostSearch/PostSearch';
import ChatSettingButton from '../ChatSettingButton/ChatSettingButton';
import Alert from '../alert/alert';
const Header = () => {
  return (
    <header>
      <Homeicon />
      <PostSearch />
      <ChatSettingButton />
      <Alert />
    </header>
  );
};

export default Header;
