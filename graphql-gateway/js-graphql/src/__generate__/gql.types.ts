export type Maybe<T> = T | null;
export type InputMaybe<T> = Maybe<T>;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: string;
  String: string;
  Boolean: boolean;
  Int: number;
  Float: number;
};

export type Bit = {
  __typename?: 'Bit';
  content: Scalars['String'];
  /** Date format in ISO8601 */
  createAt: Scalars['String'];
  id: Scalars['ID'];
  likeGivers?: Maybe<Array<User>>;
  totalLike?: Maybe<Scalars['Int']>;
};

export type FindUserInput = {
  email?: InputMaybe<Scalars['String']>;
  id?: InputMaybe<Scalars['ID']>;
  username?: InputMaybe<Scalars['String']>;
};

export enum Gender {
  Female = 'FEMALE',
  Hidden = 'HIDDEN',
  Male = 'MALE',
  Other = 'OTHER',
}

export type Query = {
  __typename?: 'Query';
  bit?: Maybe<Bit>;
  bits?: Maybe<Array<Bit>>;
  findUser?: Maybe<User>;
  /** Simple check about gateway connectivity, return OK */
  healthcheck: Scalars['String'];
  /** Get current User */
  me?: Maybe<User>;
  user?: Maybe<User>;
  users?: Maybe<Array<User>>;
};

export type QueryFindUserArgs = {
  input?: InputMaybe<FindUserInput>;
};

export type User = {
  __typename?: 'User';
  bits?: Maybe<Array<Bit>>;
  email: Scalars['String'];
  following?: Maybe<Array<User>>;
  id: Scalars['ID'];
  info?: Maybe<UserInfo>;
  /** User custom name, can duplicate */
  nickname?: Maybe<Scalars['String']>;
  /** Hashed password */
  password: Scalars['String'];
  /** Use for login and identify, unique */
  username: Scalars['String'];
};

export type UserInfo = {
  __typename?: 'UserInfo';
  gender?: Maybe<Gender>;
};