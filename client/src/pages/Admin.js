import React, { useState, useEffect } from "react";
import LoginPage from "../components/LoginPage";
import { setToken } from "../utils";
import LoadingScreen from "../components/LoadingScreen";
import Admin from "../components/Admin";

const AdminPage = () => {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const brtJWT = localStorage.getItem("brt-jwt");

  const doSetIsLoading = (loading) => {
    setTimeout(() => {
      setIsLoading(loading);
    }, 500);
  };

  const doSetUser = (newUser) => {
    setUser(newUser);
  };

  useEffect(() => {
    if (brtJWT) {
      setToken(doSetIsLoading, doSetUser);
    } else {
      setIsLoading(false);
    }
  }, []);

  return (
    <div>
      {isLoading && brtJWT ? (
        <LoadingScreen />
      ) : (
        <>
          {user?.accessToken ? (
            <Admin user={user} />
          ) : (
            <LoginPage doSetUser={doSetUser} />
          )}
        </>
      )}
    </div>
  );
};

export default AdminPage;