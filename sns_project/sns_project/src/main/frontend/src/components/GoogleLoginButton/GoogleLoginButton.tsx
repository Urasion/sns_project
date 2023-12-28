// import { useGoogleLogin } from "@react-oauth/google";
import Button from "../Common/Button/Button";

const GoogleLoginButton = () => {
  // const googleLogin = useGoogleLogin({
  //   scope: "email profile",
  //   onSuccess: async ({ code }) => {
  //     const res = await defaultInstance.post(`login/oauth2/code/google`, {
  //       code,
  //     });
  //     console.log(res.data);
  //     console.log(res);
  //   },
  //   onError: (error) => {
  //     console.log(error);
  //   },
  //   flow: "auth-code",
  //   ux_mode: "redirect",
  //   redirect_uri: `${process.env.REACT_APP_API_URL}/login/oauth2/code/google`,
  // });
  // const test = () => {
  //   defaultInstance.post(`/oauth2/authorization/google`, {});
  // };
  const googlelogin = async () => {
    location.href = `${process.env.REACT_APP_API_URL}/oauth2/authorization/google?redirect_uri=http://snsprojectbucket.s3-website.ap-northeast-2.amazonaws.com/oauth`;
  };
  return (
    <>
      <Button type="button" text="구글 로그인" design="black" onClick={googlelogin} />
    </>
  );
};

export default GoogleLoginButton;
