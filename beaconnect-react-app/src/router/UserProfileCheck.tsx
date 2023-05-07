import React, { useEffect } from 'react';
import { useLazyQuery } from '@apollo/client';
import { getUserProfileQuery } from './components/profile.query';
import { useUserContext } from '../userContext';
import Loading from '../pages/Essentials/Loading/loading';
import CreateProfile from '../pages/CreateProfile/createProfile';

const UserProfileCheck = ({
  isLoggedIn,
  children,
  setGetStatus,
  setUserProfile,
  getStatus,
  userProfile,
}: {
  isLoggedIn: boolean;
  children: React.ReactNode;
  setGetStatus: React.Dispatch<React.SetStateAction<boolean>>;
  setUserProfile: React.Dispatch<React.SetStateAction<boolean>>;
  getStatus: boolean;
  userProfile: boolean;
}) => {
  const { signOut } = useUserContext();
  const [userProfileChecker] = useLazyQuery(getUserProfileQuery, {
    onCompleted: (data) => {
      console.log(data, localStorage, new Date());
      setGetStatus(true);
      if (data?.me?.info?.nickname) setUserProfile(true);
    },
    onError: (error) => {
      if (
        // eslint-disable-next-line operator-linebreak
        error.message === 'Response not successful: Received status code 500'
      ) {
        signOut();
        window.location.reload();
      }
    },
    fetchPolicy: 'network-only',
  });

  useEffect(() => {
    // eslint-disable-next-line no-unused-expressions
    setGetStatus(false);
    setUserProfile(false);
    userProfileChecker();
  }, [isLoggedIn]);

  if (!isLoggedIn) return <>{children}</>;
  if (!getStatus) return <Loading />;
  if (!userProfile) return <CreateProfile setUserProfile={setUserProfile} />;
  return <>{children}</>;
};

export default UserProfileCheck;
