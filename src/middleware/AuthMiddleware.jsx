import { useNavigate } from "react-router-dom";
import Layout from "../layouts/Layout";
import { useEffect } from "react";
import Cookies from "js-cookie";

export default function AuthMiddleware({ children }) {
  const navigate = useNavigate();

  // const renewAccessToken = async () => {
  //   try {
  //     const response = await renewAccessTokenApi();

  //     if (response.status === 200) {
  //       localStorage.setItem('accessToken', hdlResData(response, 'accessToken'));
  //     }
  //   } catch (error) {
  //     console.error('Failed to renew access token: ', error);
  //   };
  // };

  useEffect(() => {
    async function checkAuth() {
      try {
        const getAccessToken = () => Cookies.get("auth_token");
        if (!getAccessToken) {
          navigate("/login");
        }
      } catch (error) {
        console.error("Failed to check auth: ", error);
      }
    }
    checkAuth();
  }, []);

  return <Layout>{children}</Layout>;
}
