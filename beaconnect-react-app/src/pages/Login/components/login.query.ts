import { gql } from '@apollo/client';

export type LoginMutationVariables = {
  email: string | null;
  username: string | null;
  password: string;
};

export type LoginMutationResult = {
  login: {
    token: string;
    me: {
      id: string;
      role: string;
      info: {
        nickname: string;
        image: string;
      };
    };
  };
};

export type RegisterMutationVariables = {
  email: string;
  password: string;
  username: string;
};

export type RegisterMutationResult = {
  register: {
    id: string;
  };
};

export const loginQuery = gql`
  mutation Login($email: String, $username: String, $password: String!) {
    login(input: { email: $email, username: $username, password: $password }) {
      token
      me {
        id
        role
        info {
          nickname
          image
        }
      }
    }
  }
`;

export const registerQuery = gql`
  mutation Register($email: String!, $username: String!, $password: String!) {
    register(input: { email: $email, username: $username, password: $password }) {
      id
    }
  }
`;
