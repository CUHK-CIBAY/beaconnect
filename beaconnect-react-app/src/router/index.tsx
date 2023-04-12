import React, { Suspense, lazy, useEffect, useState } from 'react';
import { Routes, Route } from 'react-router-dom';

import AUTH from '../config/constants';
import Loading from '../pages/Essentials/Loading/loading';

const Login = lazy(() => import('../pages/Login/login.handle'));
const LoginCheck = lazy(() => import('./LoginCheck'));
const UserProfileCheck = lazy(() => import('./UserProfileCheck'));
const Main = lazy(() => import('../pages/Main/main'));
const Logout = lazy(() => import('../pages/Logout/logout'));
const Admin = lazy(() => import('../pages/Admin/admin'));

const Router = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [getStatus, setGetStatus] = useState(false);
  const [userProfile, setUserProfile] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem(AUTH.token);
    if (token) {
      setIsLoggedIn(true);
    }
  }, []);

  return (
    <UserProfileCheck
      isLoggedIn={isLoggedIn}
      setGetStatus={setGetStatus}
      setUserProfile={setUserProfile}
      getStatus={getStatus}
      userProfile={userProfile}
    >
      <Suspense fallback={<Loading />}>
        <Routes>
          <Route
            path="/register"
            element={<Login loginType="Register" isLoggedIn={isLoggedIn} setIsLoggedIn={setIsLoggedIn} />}
          />
          <Route
            path="/login"
            element={<Login loginType="Login" isLoggedIn={isLoggedIn} setIsLoggedIn={setIsLoggedIn} />}
          />
          <Route
            path="/logout"
            element={
              <LoginCheck isLoggedIn={isLoggedIn}>
                <Logout setIsLoggedIn={setIsLoggedIn} setGetStatus={setGetStatus} setUserProfile={setUserProfile} />
              </LoginCheck>
            }
          />
          <Route path="*" element={<Main isLoggedIn={isLoggedIn} />} />
        </Routes>
      </Suspense>
    </UserProfileCheck>
  );
};

export default Router;
