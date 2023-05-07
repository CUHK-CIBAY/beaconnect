import React, { useState } from 'react';
import { useMutation } from '@apollo/client';
import { AiFillPlusCircle } from 'react-icons/ai';
import { FaTelegramPlane } from 'react-icons/fa';
import profileCover from '../../Login/images/cover.jpg';
import {
  UpdateRequiredInfoMutationResult,
  UpdateRequiredInfoMutationVariables,
  UpdateRequiredInfoWithAttachmentMutationVariables,
  updateRequiredInfoQuery,
} from '../../../router/components/profile.query';

const RequiredProfile = ({
  doneRequired,
  setDoneRequired,
  setLoading,
}: {
  doneRequired: boolean;
  // eslint-disable-next-line no-unused-vars
  setDoneRequired: (done: boolean) => void;
  // eslint-disable-next-line no-unused-vars
  setLoading: (loading: boolean) => void;
}) => {
  const [profileIcon, setProfileIcon] = useState<any>(null);

  const [updateInfo] = useMutation<UpdateRequiredInfoMutationResult, UpdateRequiredInfoMutationVariables>(
    updateRequiredInfoQuery,
    {
      onCompleted: (data: UpdateRequiredInfoMutationResult) => {
        if (data.updateInfo.info.nickname) {
          setDoneRequired(true);
          window.history.pushState({}, '', '/');
        }
        setLoading(false);
      },
      onError: () => {
        window.alert('Failed to communicate with server. Please try again later.');
      },
    },
  );

  const [updateInfoWithAttachment] = useMutation<
    UpdateRequiredInfoMutationResult,
    UpdateRequiredInfoWithAttachmentMutationVariables
  >(updateRequiredInfoQuery, {
    onCompleted: (data: UpdateRequiredInfoMutationResult) => {
      if (data.updateInfo.info.nickname) {
        setDoneRequired(true);
        window.history.pushState({}, '', '/');
      }
      setLoading(false);
    },
    onError: () => {
      window.alert('Failed to communicate with server. Please try again later.');
    },
  });

  /* eslint-disable */
  const toBase64 = (file: any) =>
    new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = (error) => reject(error);
    });
  /* eslint-enable */

  const handleRequiredProfileDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    e.currentTarget.classList.add('dragging');
  };

  const handleRequiredProfileDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    e.currentTarget.classList.remove('dragging');
    if (e.dataTransfer?.files[0].type.includes('image') || e.dataTransfer?.files[0].type.includes('video')) {
      setProfileIcon(e.dataTransfer?.files[0]);
    } else {
      // TODO: Fix type checking not working on chrome
      alert('Only image or video file is allowed, or your browser does not support this feature.');
    }
  };

  const handleRequiredProfileDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    e.currentTarget.classList.remove('dragging');
  };

  const FileUpload = () => {
    const fileInput = document.createElement('input');
    fileInput.type = 'file';
    fileInput.accept = 'image/*';
    fileInput.onchange = (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (file) {
        setProfileIcon(file);
      }
    };
    fileInput.click();
  };

  const uploadAttachment = (file: any, nickname: string) => {
    if (file.size > 6_000_000) {
      alert('File size exceed 6MB');
    } else {
      toBase64(file).then((data) => {
        const base64 = data as string;
        base64.indexOf(',');
        const base64Data = base64.substring(base64.indexOf(',') + 1);
        fetch('https://iayeuuhkq5.execute-api.ap-southeast-1.amazonaws.com/Prod/image', {
          method: 'post',
          body: base64Data,
        })
          .then((res) => res.json())
          .then((returnData) => {
            const { key } = returnData as any;
            updateInfoWithAttachment({ variables: { nickname, image: key } });
            localStorage.setItem(
              'user_info',
              JSON.stringify({ ...JSON.parse(localStorage.getItem('user_info')!), image: key }),
            );
          });
      });
    }
  };

  const handleFormSubmit = () => {
    const nickname = document.getElementById('nickname') as HTMLInputElement;
    if (nickname.value) {
      setLoading(true);
      if (!profileIcon) {
        updateInfo({ variables: { nickname: nickname.value } });
      } else {
        uploadAttachment(profileIcon, nickname.value);
      }
    }
  };

  return (
    <div
      className="create-required-profile"
      onDragOver={doneRequired ? () => {} : handleRequiredProfileDragOver}
      onDragLeave={doneRequired ? () => {} : handleRequiredProfileDragLeave}
      onDrop={doneRequired ? () => {} : handleRequiredProfileDrop}
    >
      <h1>
        Welcome
        <span>👋🏻</span>
        <br />
        Getting started...
      </h1>
      <form
        className="create-profile-form"
        onSubmit={(e) => {
          e.preventDefault();
          handleFormSubmit();
        }}
      >
        <div className="create-profile-form-group">
          <div className="create-profile-form-field">
            <div className="create-profile-form-upload-image">
              <div
                className="create-profile-form-upload-image-container"
                onClick={doneRequired ? () => {} : FileUpload}
                onKeyDown={doneRequired ? () => {} : FileUpload}
                role="button"
                tabIndex={0}
              >
                <img src={profileIcon ? URL.createObjectURL(profileIcon) : profileCover} alt="Cover" />
                <div className="create-profile-form-upload-image-button">
                  <AiFillPlusCircle />
                </div>
              </div>
            </div>
          </div>
          <div className="create-profile-form-field with-submit">
            <input type="text" id="nickname" className="create-profile-form-input" placeholder="Nickname" required />
            <div
              className="create-profile-form-submit-button"
              onClick={handleFormSubmit}
              onKeyDown={handleFormSubmit}
              role="button"
              tabIndex={0}
            >
              <FaTelegramPlane />
            </div>
          </div>
        </div>
      </form>
    </div>
  );
};

export default RequiredProfile;
