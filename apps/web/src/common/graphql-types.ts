import { TypedDocumentNode as DocumentNode } from '@graphql-typed-document-node/core';
export type Maybe<T> = T | null;
export type InputMaybe<T> = Maybe<T>;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
export type MakeEmpty<T extends { [key: string]: unknown }, K extends keyof T> = { [_ in K]?: never };
export type Incremental<T> = T | { [P in keyof T]?: P extends ' $fragmentName' | '__typename' ? T[P] : never };
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: { input: string; output: string; }
  String: { input: string; output: string; }
  Boolean: { input: boolean; output: boolean; }
  Int: { input: number; output: number; }
  Float: { input: number; output: number; }
};

export type CreatePlaylistInput = {
  name: Scalars['String']['input'];
};

export type CreatePlaylistItemInput = {
  playlistID: Scalars['ID']['input'];
  rawUrl: Scalars['String']['input'];
};

export type Me = {
  __typename?: 'Me';
  email: Scalars['String']['output'];
  id: Scalars['ID']['output'];
  initials: Scalars['String']['output'];
  name: Scalars['String']['output'];
  profilePictureUrl?: Maybe<Scalars['String']['output']>;
};

export type MovePlaylistItemInput = {
  beforeID?: InputMaybe<Scalars['ID']['input']>;
  id: Scalars['ID']['input'];
};

export type Mutation = {
  __typename?: 'Mutation';
  createPlaylist: Playlist;
  createPlaylistFromYoutube: Playlist;
  createPlaylistItem: PlaylistItem;
  deletePlaylist?: Maybe<Scalars['Boolean']['output']>;
  deletePlaylistItem: PlaylistItem;
  movePlaylistItem: PlaylistItem;
  updatePlaylist: Playlist;
};


export type MutationCreatePlaylistArgs = {
  input: CreatePlaylistInput;
};


export type MutationCreatePlaylistFromYoutubeArgs = {
  url: Scalars['String']['input'];
};


export type MutationCreatePlaylistItemArgs = {
  input: CreatePlaylistItemInput;
};


export type MutationDeletePlaylistArgs = {
  id: Scalars['ID']['input'];
};


export type MutationDeletePlaylistItemArgs = {
  id: Scalars['ID']['input'];
};


export type MutationMovePlaylistItemArgs = {
  input: MovePlaylistItemInput;
};


export type MutationUpdatePlaylistArgs = {
  input: UpdatePlaylistInput;
};

export type Playlist = {
  __typename?: 'Playlist';
  firstItem?: Maybe<PlaylistItem>;
  id: Scalars['ID']['output'];
  items: Array<PlaylistItem>;
  itemsCount: Scalars['Int']['output'];
  name: Scalars['String']['output'];
  user: User;
};


export type PlaylistFirstItemArgs = {
  shuffleSeed?: InputMaybe<Scalars['String']['input']>;
};


export type PlaylistItemsArgs = {
  shuffleSeed?: InputMaybe<Scalars['String']['input']>;
};

export type PlaylistItem = {
  __typename?: 'PlaylistItem';
  id: Scalars['ID']['output'];
  kind: PlaylistItemKind;
  nextItem?: Maybe<PlaylistItem>;
  playlist: Playlist;
  rank: Scalars['String']['output'];
  rawUrl: Scalars['String']['output'];
  thumbnailUrl: Scalars['String']['output'];
  title: Scalars['String']['output'];
  url: Scalars['String']['output'];
};


export type PlaylistItemNextItemArgs = {
  shuffleSeed?: InputMaybe<Scalars['String']['input']>;
};

export enum PlaylistItemKind {
  Reddit = 'REDDIT',
  TwitchClip = 'TWITCH_CLIP',
  Youtube = 'YOUTUBE'
}

export type Query = {
  __typename?: 'Query';
  me: Me;
  playlist: Playlist;
  playlistItem: PlaylistItem;
  playlists: Array<Playlist>;
  urlInformation?: Maybe<UrlInformation>;
  user: User;
};


export type QueryPlaylistArgs = {
  id: Scalars['ID']['input'];
};


export type QueryPlaylistItemArgs = {
  id: Scalars['ID']['input'];
};


export type QueryUrlInformationArgs = {
  url: Scalars['String']['input'];
};


export type QueryUserArgs = {
  id: Scalars['ID']['input'];
};

export type UpdatePlaylistInput = {
  id: Scalars['ID']['input'];
  name: Scalars['String']['input'];
};

export type UrlInformation = {
  __typename?: 'UrlInformation';
  kind: PlaylistItemKind;
  thumbnailUrl: Scalars['String']['output'];
  title: Scalars['String']['output'];
};

export type User = {
  __typename?: 'User';
  id: Scalars['ID']['output'];
  initials: Scalars['String']['output'];
  name: Scalars['String']['output'];
  playlists: Array<Playlist>;
  profilePictureUrl?: Maybe<Scalars['String']['output']>;
};

export type UserProviderQueryVariables = Exact<{ [key: string]: never; }>;


export type UserProviderQuery = { __typename?: 'Query', me: { __typename?: 'Me', id: string, name: string, initials: string, profilePictureUrl?: string | null } };

export type HomePlaylistsQueryVariables = Exact<{ [key: string]: never; }>;


export type HomePlaylistsQuery = { __typename?: 'Query', playlists: Array<{ __typename?: 'Playlist', id: string, name: string }> };

export type PlaylistItemQueueSidebarQueryVariables = Exact<{
  playlistID: Scalars['ID']['input'];
  shuffleSeed?: InputMaybe<Scalars['String']['input']>;
}>;


export type PlaylistItemQueueSidebarQuery = { __typename?: 'Query', playlist: { __typename?: 'Playlist', id: string, name: string, itemsCount: number, user: { __typename?: 'User', id: string, name: string, initials: string, profilePictureUrl?: string | null }, items: Array<{ __typename?: 'PlaylistItem', id: string, kind: PlaylistItemKind, title: string, thumbnailUrl: string }> } };

export type PlaylistItemViewQueryVariables = Exact<{
  playlistItemID: Scalars['ID']['input'];
  shuffleSeed?: InputMaybe<Scalars['String']['input']>;
}>;


export type PlaylistItemViewQuery = { __typename?: 'Query', playlistItem: { __typename?: 'PlaylistItem', id: string, kind: PlaylistItemKind, title: string, thumbnailUrl: string, url: string, rawUrl: string, playlist: { __typename?: 'Playlist', id: string, name: string }, nextItem?: { __typename?: 'PlaylistItem', id: string } | null } };

export type AddItemUrlInformationQueryVariables = Exact<{
  url: Scalars['String']['input'];
}>;


export type AddItemUrlInformationQuery = { __typename?: 'Query', urlInformation?: { __typename?: 'UrlInformation', kind: PlaylistItemKind, title: string, thumbnailUrl: string } | null };

export type CreatePlaylistItemMutationVariables = Exact<{
  input: CreatePlaylistItemInput;
}>;


export type CreatePlaylistItemMutation = { __typename?: 'Mutation', createPlaylistItem: { __typename?: 'PlaylistItem', id: string } };

export type PlaylistViewQueryVariables = Exact<{
  playlistID: Scalars['ID']['input'];
  shuffleSeed: Scalars['String']['input'];
}>;


export type PlaylistViewQuery = { __typename?: 'Query', playlist: { __typename?: 'Playlist', id: string, name: string, itemsCount: number, user: { __typename?: 'User', id: string, name: string, initials: string, profilePictureUrl?: string | null }, firstItem?: { __typename?: 'PlaylistItem', id: string } | null, shuffleFirstItem?: { __typename?: 'PlaylistItem', id: string } | null, items: Array<{ __typename?: 'PlaylistItem', id: string, rank: string, kind: PlaylistItemKind, title: string, thumbnailUrl: string, rawUrl: string }> } };

export type MovePlaylistItemMutationVariables = Exact<{
  input: MovePlaylistItemInput;
}>;


export type MovePlaylistItemMutation = { __typename?: 'Mutation', movePlaylistItem: { __typename?: 'PlaylistItem', id: string, rank: string, kind: PlaylistItemKind, title: string, thumbnailUrl: string, rawUrl: string, playlist: { __typename?: 'Playlist', id: string, items: Array<{ __typename?: 'PlaylistItem', id: string, rank: string, kind: PlaylistItemKind, title: string, thumbnailUrl: string, rawUrl: string }> } } };

export type DeletePlaylistItemMutationVariables = Exact<{
  id: Scalars['ID']['input'];
}>;


export type DeletePlaylistItemMutation = { __typename?: 'Mutation', deletePlaylistItem: { __typename?: 'PlaylistItem', id: string, rank: string, kind: PlaylistItemKind, title: string, thumbnailUrl: string, rawUrl: string, playlist: { __typename?: 'Playlist', id: string, items: Array<{ __typename?: 'PlaylistItem', id: string, rank: string, kind: PlaylistItemKind, title: string, thumbnailUrl: string, rawUrl: string }> } } };

export type PlaylistItemFragFragment = { __typename?: 'PlaylistItem', id: string, rank: string, kind: PlaylistItemKind, title: string, thumbnailUrl: string, rawUrl: string };

export type UserViewQueryVariables = Exact<{
  userID: Scalars['ID']['input'];
}>;


export type UserViewQuery = { __typename?: 'Query', user: { __typename?: 'User', id: string, name: string, initials: string, profilePictureUrl?: string | null, playlists: Array<{ __typename?: 'Playlist', id: string, name: string, itemsCount: number }> } };

export type CreatePlaylistMutationVariables = Exact<{
  input: CreatePlaylistInput;
}>;


export type CreatePlaylistMutation = { __typename?: 'Mutation', createPlaylist: { __typename?: 'Playlist', id: string, name: string } };

export type CreatePlaylistFromYoutubeMutationVariables = Exact<{
  url: Scalars['String']['input'];
}>;


export type CreatePlaylistFromYoutubeMutation = { __typename?: 'Mutation', createPlaylistFromYoutube: { __typename?: 'Playlist', id: string, name: string } };

export const PlaylistItemFragFragmentDoc = {"kind":"Document","definitions":[{"kind":"FragmentDefinition","name":{"kind":"Name","value":"PlaylistItemFrag"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"PlaylistItem"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"rank"}},{"kind":"Field","name":{"kind":"Name","value":"kind"}},{"kind":"Field","name":{"kind":"Name","value":"title"}},{"kind":"Field","name":{"kind":"Name","value":"thumbnailUrl"}},{"kind":"Field","name":{"kind":"Name","value":"rawUrl"}}]}}]} as unknown as DocumentNode<PlaylistItemFragFragment, unknown>;
export const UserProviderDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"UserProvider"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"me"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"initials"}},{"kind":"Field","name":{"kind":"Name","value":"profilePictureUrl"}}]}}]}}]} as unknown as DocumentNode<UserProviderQuery, UserProviderQueryVariables>;
export const HomePlaylistsDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"HomePlaylists"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"playlists"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}}]}}]}}]} as unknown as DocumentNode<HomePlaylistsQuery, HomePlaylistsQueryVariables>;
export const PlaylistItemQueueSidebarDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"PlaylistItemQueueSidebar"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"playlistID"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"shuffleSeed"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"playlist"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"playlistID"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"itemsCount"}},{"kind":"Field","name":{"kind":"Name","value":"user"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"initials"}},{"kind":"Field","name":{"kind":"Name","value":"profilePictureUrl"}}]}},{"kind":"Field","name":{"kind":"Name","value":"items"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"shuffleSeed"},"value":{"kind":"Variable","name":{"kind":"Name","value":"shuffleSeed"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"kind"}},{"kind":"Field","name":{"kind":"Name","value":"title"}},{"kind":"Field","name":{"kind":"Name","value":"thumbnailUrl"}}]}}]}}]}}]} as unknown as DocumentNode<PlaylistItemQueueSidebarQuery, PlaylistItemQueueSidebarQueryVariables>;
export const PlaylistItemViewDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"PlaylistItemView"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"playlistItemID"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"shuffleSeed"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"playlistItem"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"playlistItemID"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"kind"}},{"kind":"Field","name":{"kind":"Name","value":"title"}},{"kind":"Field","name":{"kind":"Name","value":"thumbnailUrl"}},{"kind":"Field","name":{"kind":"Name","value":"url"}},{"kind":"Field","name":{"kind":"Name","value":"rawUrl"}},{"kind":"Field","name":{"kind":"Name","value":"playlist"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}}]}},{"kind":"Field","name":{"kind":"Name","value":"nextItem"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"shuffleSeed"},"value":{"kind":"Variable","name":{"kind":"Name","value":"shuffleSeed"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}}]}}]}}]}}]} as unknown as DocumentNode<PlaylistItemViewQuery, PlaylistItemViewQueryVariables>;
export const AddItemUrlInformationDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"AddItemUrlInformation"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"url"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"urlInformation"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"url"},"value":{"kind":"Variable","name":{"kind":"Name","value":"url"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"kind"}},{"kind":"Field","name":{"kind":"Name","value":"title"}},{"kind":"Field","name":{"kind":"Name","value":"thumbnailUrl"}}]}}]}}]} as unknown as DocumentNode<AddItemUrlInformationQuery, AddItemUrlInformationQueryVariables>;
export const CreatePlaylistItemDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"CreatePlaylistItem"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"CreatePlaylistItemInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"createPlaylistItem"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}}]}}]}}]} as unknown as DocumentNode<CreatePlaylistItemMutation, CreatePlaylistItemMutationVariables>;
export const PlaylistViewDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"PlaylistView"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"playlistID"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"shuffleSeed"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"playlist"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"playlistID"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"itemsCount"}},{"kind":"Field","name":{"kind":"Name","value":"user"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"initials"}},{"kind":"Field","name":{"kind":"Name","value":"profilePictureUrl"}}]}},{"kind":"Field","name":{"kind":"Name","value":"firstItem"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}}]}},{"kind":"Field","alias":{"kind":"Name","value":"shuffleFirstItem"},"name":{"kind":"Name","value":"firstItem"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"shuffleSeed"},"value":{"kind":"Variable","name":{"kind":"Name","value":"shuffleSeed"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}}]}},{"kind":"Field","name":{"kind":"Name","value":"items"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"rank"}},{"kind":"Field","name":{"kind":"Name","value":"kind"}},{"kind":"Field","name":{"kind":"Name","value":"title"}},{"kind":"Field","name":{"kind":"Name","value":"thumbnailUrl"}},{"kind":"Field","name":{"kind":"Name","value":"rawUrl"}}]}}]}}]}}]} as unknown as DocumentNode<PlaylistViewQuery, PlaylistViewQueryVariables>;
export const MovePlaylistItemDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"MovePlaylistItem"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"MovePlaylistItemInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"movePlaylistItem"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"PlaylistItemFrag"}},{"kind":"Field","name":{"kind":"Name","value":"playlist"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"items"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"PlaylistItemFrag"}}]}}]}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"PlaylistItemFrag"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"PlaylistItem"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"rank"}},{"kind":"Field","name":{"kind":"Name","value":"kind"}},{"kind":"Field","name":{"kind":"Name","value":"title"}},{"kind":"Field","name":{"kind":"Name","value":"thumbnailUrl"}},{"kind":"Field","name":{"kind":"Name","value":"rawUrl"}}]}}]} as unknown as DocumentNode<MovePlaylistItemMutation, MovePlaylistItemMutationVariables>;
export const DeletePlaylistItemDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"DeletePlaylistItem"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"deletePlaylistItem"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"id"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"PlaylistItemFrag"}},{"kind":"Field","name":{"kind":"Name","value":"playlist"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"items"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"PlaylistItemFrag"}}]}}]}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"PlaylistItemFrag"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"PlaylistItem"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"rank"}},{"kind":"Field","name":{"kind":"Name","value":"kind"}},{"kind":"Field","name":{"kind":"Name","value":"title"}},{"kind":"Field","name":{"kind":"Name","value":"thumbnailUrl"}},{"kind":"Field","name":{"kind":"Name","value":"rawUrl"}}]}}]} as unknown as DocumentNode<DeletePlaylistItemMutation, DeletePlaylistItemMutationVariables>;
export const UserViewDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"UserView"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"userID"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"user"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"userID"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"initials"}},{"kind":"Field","name":{"kind":"Name","value":"profilePictureUrl"}},{"kind":"Field","name":{"kind":"Name","value":"playlists"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"itemsCount"}}]}}]}}]}}]} as unknown as DocumentNode<UserViewQuery, UserViewQueryVariables>;
export const CreatePlaylistDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"CreatePlaylist"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"CreatePlaylistInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"createPlaylist"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}}]}}]}}]} as unknown as DocumentNode<CreatePlaylistMutation, CreatePlaylistMutationVariables>;
export const CreatePlaylistFromYoutubeDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"CreatePlaylistFromYoutube"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"url"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"createPlaylistFromYoutube"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"url"},"value":{"kind":"Variable","name":{"kind":"Name","value":"url"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}}]}}]}}]} as unknown as DocumentNode<CreatePlaylistFromYoutubeMutation, CreatePlaylistFromYoutubeMutationVariables>;