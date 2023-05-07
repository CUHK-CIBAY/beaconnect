/* eslint-disable no-nested-ternary */
import React, { Suspense, lazy, useEffect, useState } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';

import AUTH from '../config/constants';
import Loading from '../pages/Essentials/Loading/loading';
import Logout from '../pages/Logout/logout';
import LoginCheck from './LoginCheck';

const Login = lazy(() => import('../pages/Login/login.handle'));
const UserProfileCheck = lazy(() => import('./UserProfileCheck'));
const Main = lazy(() => import('../pages/Main/main'));
const Admin = lazy(() => import('../pages/Admin/admin'));

const Router = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [getStatus, setGetStatus] = useState(false);
  const [userProfile, setUserProfile] = useState(false);

  useEffect(() => {
    const tokenString = localStorage.getItem(AUTH.token);
    if (tokenString) {
      const now = new Date();
      const token = JSON.parse(tokenString);
      if (now.getTime() > token.expiry) {
        localStorage.removeItem(AUTH.token);
        window.location.reload();
      } else {
        setTimeout(() => {
          window.location.reload();
        }, token.expiry - now.getTime());
        setIsLoggedIn(true);
      }
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
            path="/admin"
            element={
              <LoginCheck isLoggedIn={isLoggedIn} userRole="ADMIN">
                <Admin />
              </LoginCheck>
            }
          />
          <Route
            path="/logout"
            element={
              <LoginCheck isLoggedIn={isLoggedIn}>
                <Logout setIsLoggedIn={setIsLoggedIn} setGetStatus={setGetStatus} setUserProfile={setUserProfile} />
              </LoginCheck>
            }
          />
          {isLoggedIn && window.atob(JSON.parse(localStorage.getItem(AUTH.token)!).value).split('::')[1] === 'ADMIN' ? (
            <Route path="*" element={<Navigate to="/admin" replace />} />
          ) : (
            <Route path="*" element={<Main isLoggedIn={isLoggedIn} />} />
          )}
        </Routes>
      </Suspense>
    </UserProfileCheck>
  );
};

export default Router;
