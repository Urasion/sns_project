import { useGetFriendList } from "../../hook/useGetFriendList";
import Loading from "../Common/Loading/Loading";
import "./ProfileFriend.css";
import { RootState } from "../../redux";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

interface childProps {
  userId: number;
}

const ProfileFriend = ({ userId }: childProps) => {
  const isdarkmode = useSelector((state: RootState) => state.darkmodeSlice.isDarkmode);
  const { friendlistData } = useGetFriendList(userId);
  const navigate = useNavigate();
  const navigateProfile = (username: string) => {
    friendlistData.refetch();
    navigate(`/profile?username=${username}`);
  };

  return (
    <div className="profile_user_friend_container">
      <div className={`profile_user_friendList ${isdarkmode && "darkmode"}`}>
        {friendlistData.isLoading ? (
          <Loading />
        ) : friendlistData.data?.result.length === 0 ? (
          <div className="notification_container">
            <p className="notification">등록된 친구가 없습니다.</p>
          </div>
        ) : (
          friendlistData.data?.result.map((el) => (
            <div
              className={`profile_user_friend ${isdarkmode && "darkmode"}`}
              onClick={() => navigateProfile(el.member.username)}
              key={el.id}
            >
              <img
                alt={`${el.member.name} profile`}
                src={el.member.imgurl}
                className="profile_img"
              />
              <p className="friend_name">{el.member.name}</p>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default ProfileFriend;