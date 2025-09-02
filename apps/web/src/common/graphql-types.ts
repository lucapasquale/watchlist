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
  DateTime: { input: any; output: any; }
};

export type CreatePlaylistInput = {
  name: Scalars['String']['input'];
};

export type CreatePlaylistItemInput = {
  endTimeSeconds?: InputMaybe<Scalars['Int']['input']>;
  href: Scalars['String']['input'];
  playlistID: Scalars['ID']['input'];
  startTimeSeconds?: InputMaybe<Scalars['Int']['input']>;
};

export type ImportPlaylistInput = {
  href: Scalars['String']['input'];
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
  createPlaylistItem: PlaylistItem;
  deletePlaylist: Playlist;
  deletePlaylistItem: PlaylistItem;
  importPlaylist: Playlist;
  movePlaylistItem: PlaylistItem;
  updatePlaylist: Playlist;
};


export type MutationCreatePlaylistArgs = {
  input: CreatePlaylistInput;
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


export type MutationImportPlaylistArgs = {
  input: ImportPlaylistInput;
};


export type MutationMovePlaylistItemArgs = {
  input: MovePlaylistItemInput;
};


export type MutationUpdatePlaylistArgs = {
  input: UpdatePlaylistInput;
};

export type Playlist = {
  __typename?: 'Playlist';
  createdAt: Scalars['DateTime']['output'];
  firstItem?: Maybe<PlaylistItem>;
  href?: Maybe<Scalars['String']['output']>;
  id: Scalars['ID']['output'];
  items: Array<PlaylistItem>;
  itemsCount: Scalars['Int']['output'];
  itemsKind: Array<PlaylistItemKind>;
  name: Scalars['String']['output'];
  newItemsPosition: PlaylistNewItemsPosition;
  updatedAt: Scalars['DateTime']['output'];
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
  durationSeconds?: Maybe<Scalars['Int']['output']>;
  embedUrl: Scalars['String']['output'];
  href: Scalars['String']['output'];
  id: Scalars['ID']['output'];
  kind: PlaylistItemKind;
  nextItem?: Maybe<PlaylistItem>;
  originalPosterName: Scalars['String']['output'];
  playlist: Playlist;
  rank: Scalars['String']['output'];
  thumbnailUrl: Scalars['String']['output'];
  title: Scalars['String']['output'];
};


export type PlaylistItemNextItemArgs = {
  shuffleSeed?: InputMaybe<Scalars['String']['input']>;
};

export enum PlaylistItemKind {
  InstagramReel = 'INSTAGRAM_REEL',
  KickClip = 'KICK_CLIP',
  Reddit = 'REDDIT',
  Tiktok = 'TIKTOK',
  TwitchClip = 'TWITCH_CLIP',
  X = 'X',
  Youtube = 'YOUTUBE'
}

export enum PlaylistNewItemsPosition {
  Bottom = 'BOTTOM',
  Top = 'TOP'
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
  input: UrlInformationInput;
};


export type QueryUserArgs = {
  id: Scalars['ID']['input'];
};

export type UpdatePlaylistInput = {
  id: Scalars['ID']['input'];
  name?: InputMaybe<Scalars['String']['input']>;
  newItemsPosition?: InputMaybe<PlaylistNewItemsPosition>;
};

export type UrlInformation = {
  __typename?: 'UrlInformation';
  durationSeconds?: Maybe<Scalars['Int']['output']>;
  embedUrl: Scalars['String']['output'];
  kind: PlaylistItemKind;
  thumbnailUrl: Scalars['String']['output'];
  title: Scalars['String']['output'];
};

export type UrlInformationInput = {
  endTimeSeconds?: InputMaybe<Scalars['Int']['input']>;
  href: Scalars['String']['input'];
  startTimeSeconds?: InputMaybe<Scalars['Int']['input']>;
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


export type UserProviderQuery = { __typename?: 'Query', me: { __typename?: 'Me', id: string, name: string, email: string, initials: string, profilePictureUrl?: string | null } };

export type HomeHeroPlaylistsQueryVariables = Exact<{ [key: string]: never; }>;


export type HomeHeroPlaylistsQuery = { __typename?: 'Query', playlists: Array<{ __typename?: 'Playlist', id: string, name: string, itemsKind: Array<PlaylistItemKind>, itemsCount: number, user: { __typename?: 'User', id: string, name: string, initials: string, profilePictureUrl?: string | null }, firstItem?: { __typename?: 'PlaylistItem', id: string } | null }> };

export type PlaylistItemViewQueryVariables = Exact<{
  playlistItemID: Scalars['ID']['input'];
  shuffleSeed?: InputMaybe<Scalars['String']['input']>;
}>;


export type PlaylistItemViewQuery = { __typename?: 'Query', playlistItem: { __typename?: 'PlaylistItem', id: string, kind: PlaylistItemKind, title: string, thumbnailUrl: string, embedUrl: string, href: string, originalPosterName: string, durationSeconds?: number | null, playlist: { __typename?: 'Playlist', id: string, name: string, itemsCount: number, user: { __typename?: 'User', id: string, name: string, initials: string, profilePictureUrl?: string | null }, items: Array<{ __typename?: 'PlaylistItem', id: string, kind: PlaylistItemKind, title: string, thumbnailUrl: string, durationSeconds?: number | null }> }, nextItem?: { __typename?: 'PlaylistItem', id: string } | null } };

export type AddItemUrlInformationQueryVariables = Exact<{
  input: UrlInformationInput;
}>;


export type AddItemUrlInformationQuery = { __typename?: 'Query', urlInformation?: { __typename?: 'UrlInformation', kind: PlaylistItemKind, title: string, thumbnailUrl: string, embedUrl: string, durationSeconds?: number | null } | null };

export type CreatePlaylistItemMutationVariables = Exact<{
  input: CreatePlaylistItemInput;
}>;


export type CreatePlaylistItemMutation = { __typename?: 'Mutation', createPlaylistItem: { __typename?: 'PlaylistItem', id: string } };

export type PlaylistViewQueryVariables = Exact<{
  playlistID: Scalars['ID']['input'];
  shuffleSeed?: InputMaybe<Scalars['String']['input']>;
}>;


export type PlaylistViewQuery = { __typename?: 'Query', playlist: { __typename?: 'Playlist', id: string, name: string, href?: string | null, newItemsPosition: PlaylistNewItemsPosition, itemsCount: number, createdAt: any, user: { __typename?: 'User', id: string, name: string, initials: string, profilePictureUrl?: string | null }, firstItem?: { __typename?: 'PlaylistItem', id: string } | null, shuffleFirstItem?: { __typename?: 'PlaylistItem', id: string } | null, items: Array<{ __typename?: 'PlaylistItem', id: string, rank: string, kind: PlaylistItemKind, title: string, thumbnailUrl: string, durationSeconds?: number | null, href: string, originalPosterName: string }> } };

export type PlaylistPlayPageQueryVariables = Exact<{
  playlistID: Scalars['ID']['input'];
  shuffleSeed?: InputMaybe<Scalars['String']['input']>;
}>;


export type PlaylistPlayPageQuery = { __typename?: 'Query', playlist: { __typename?: 'Playlist', id: string, firstItem?: { __typename?: 'PlaylistItem', id: string } | null, shuffleFirstItem?: { __typename?: 'PlaylistItem', id: string } | null } };

export type UpdatePlaylistMutationVariables = Exact<{
  input: UpdatePlaylistInput;
}>;


export type UpdatePlaylistMutation = { __typename?: 'Mutation', updatePlaylist: { __typename?: 'Playlist', id: string, name: string, newItemsPosition: PlaylistNewItemsPosition } };

export type MovePlaylistItemMutationVariables = Exact<{
  input: MovePlaylistItemInput;
}>;


export type MovePlaylistItemMutation = { __typename?: 'Mutation', movePlaylistItem: { __typename?: 'PlaylistItem', id: string, rank: string, kind: PlaylistItemKind, title: string, thumbnailUrl: string, durationSeconds?: number | null, href: string, originalPosterName: string, playlist: { __typename?: 'Playlist', id: string, firstItem?: { __typename?: 'PlaylistItem', id: string, rank: string, kind: PlaylistItemKind, title: string, thumbnailUrl: string, durationSeconds?: number | null, href: string, originalPosterName: string, nextItem?: { __typename?: 'PlaylistItem', id: string } | null } | null, items: Array<{ __typename?: 'PlaylistItem', id: string, rank: string, kind: PlaylistItemKind, title: string, thumbnailUrl: string, durationSeconds?: number | null, href: string, originalPosterName: string, nextItem?: { __typename?: 'PlaylistItem', id: string } | null }> }, nextItem?: { __typename?: 'PlaylistItem', id: string } | null } };

export type DeletePlaylistItemMutationVariables = Exact<{
  id: Scalars['ID']['input'];
}>;


export type DeletePlaylistItemMutation = { __typename?: 'Mutation', deletePlaylistItem: { __typename?: 'PlaylistItem', id: string, rank: string, kind: PlaylistItemKind, title: string, thumbnailUrl: string, durationSeconds?: number | null, href: string, originalPosterName: string, playlist: { __typename?: 'Playlist', id: string, firstItem?: { __typename?: 'PlaylistItem', id: string, rank: string, kind: PlaylistItemKind, title: string, thumbnailUrl: string, durationSeconds?: number | null, href: string, originalPosterName: string, nextItem?: { __typename?: 'PlaylistItem', id: string } | null } | null, items: Array<{ __typename?: 'PlaylistItem', id: string, rank: string, kind: PlaylistItemKind, title: string, thumbnailUrl: string, durationSeconds?: number | null, href: string, originalPosterName: string, nextItem?: { __typename?: 'PlaylistItem', id: string } | null }> }, nextItem?: { __typename?: 'PlaylistItem', id: string } | null } };

export type PlaylistItemFragFragment = { __typename?: 'PlaylistItem', id: string, rank: string, kind: PlaylistItemKind, title: string, thumbnailUrl: string, durationSeconds?: number | null, href: string, originalPosterName: string, nextItem?: { __typename?: 'PlaylistItem', id: string } | null };

export type CreatePlaylistMutationVariables = Exact<{
  input: CreatePlaylistInput;
}>;


export type CreatePlaylistMutation = { __typename?: 'Mutation', createPlaylist: { __typename?: 'Playlist', id: string, name: string, newItemsPosition: PlaylistNewItemsPosition } };

export type ImportPlaylistMutationVariables = Exact<{
  input: ImportPlaylistInput;
}>;


export type ImportPlaylistMutation = { __typename?: 'Mutation', importPlaylist: { __typename?: 'Playlist', id: string, name: string, newItemsPosition: PlaylistNewItemsPosition } };

export type UserViewQueryVariables = Exact<{
  userID: Scalars['ID']['input'];
}>;


export type UserViewQuery = { __typename?: 'Query', user: { __typename?: 'User', id: string, name: string, initials: string, profilePictureUrl?: string | null, playlists: Array<{ __typename?: 'Playlist', id: string, name: string, itemsCount: number }> } };

export type UserPlaylistsQueryVariables = Exact<{
  userID: Scalars['ID']['input'];
}>;


export type UserPlaylistsQuery = { __typename?: 'Query', user: { __typename?: 'User', id: string, playlists: Array<{ __typename?: 'Playlist', id: string, name: string, itemsCount: number }> } };

export type DeletePlaylistMutationVariables = Exact<{
  id: Scalars['ID']['input'];
}>;


export type DeletePlaylistMutation = { __typename?: 'Mutation', deletePlaylist: { __typename?: 'Playlist', id: string } };

export const PlaylistItemFragFragmentDoc = {"kind":"Document","definitions":[{"kind":"FragmentDefinition","name":{"kind":"Name","value":"PlaylistItemFrag"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"PlaylistItem"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"rank"}},{"kind":"Field","name":{"kind":"Name","value":"kind"}},{"kind":"Field","name":{"kind":"Name","value":"title"}},{"kind":"Field","name":{"kind":"Name","value":"thumbnailUrl"}},{"kind":"Field","name":{"kind":"Name","value":"durationSeconds"}},{"kind":"Field","name":{"kind":"Name","value":"href"}},{"kind":"Field","name":{"kind":"Name","value":"originalPosterName"}},{"kind":"Field","name":{"kind":"Name","value":"nextItem"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"shuffleSeed"},"value":{"kind":"NullValue"}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}}]}}]}}]} as unknown as DocumentNode<PlaylistItemFragFragment, unknown>;
export const UserProviderDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"UserProvider"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"me"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"email"}},{"kind":"Field","name":{"kind":"Name","value":"initials"}},{"kind":"Field","name":{"kind":"Name","value":"profilePictureUrl"}}]}}]}}]} as unknown as DocumentNode<UserProviderQuery, UserProviderQueryVariables>;
export const HomeHeroPlaylistsDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"HomeHeroPlaylists"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"playlists"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"itemsKind"}},{"kind":"Field","name":{"kind":"Name","value":"itemsCount"}},{"kind":"Field","name":{"kind":"Name","value":"user"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"initials"}},{"kind":"Field","name":{"kind":"Name","value":"profilePictureUrl"}}]}},{"kind":"Field","name":{"kind":"Name","value":"firstItem"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"shuffleSeed"},"value":{"kind":"NullValue"}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}}]}}]}}]}}]} as unknown as DocumentNode<HomeHeroPlaylistsQuery, HomeHeroPlaylistsQueryVariables>;
export const PlaylistItemViewDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"PlaylistItemView"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"playlistItemID"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"shuffleSeed"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"playlistItem"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"playlistItemID"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"kind"}},{"kind":"Field","name":{"kind":"Name","value":"title"}},{"kind":"Field","name":{"kind":"Name","value":"thumbnailUrl"}},{"kind":"Field","name":{"kind":"Name","value":"embedUrl"}},{"kind":"Field","name":{"kind":"Name","value":"href"}},{"kind":"Field","name":{"kind":"Name","value":"originalPosterName"}},{"kind":"Field","name":{"kind":"Name","value":"durationSeconds"}},{"kind":"Field","name":{"kind":"Name","value":"playlist"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"itemsCount"}},{"kind":"Field","name":{"kind":"Name","value":"user"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"initials"}},{"kind":"Field","name":{"kind":"Name","value":"profilePictureUrl"}}]}},{"kind":"Field","name":{"kind":"Name","value":"items"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"shuffleSeed"},"value":{"kind":"Variable","name":{"kind":"Name","value":"shuffleSeed"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"kind"}},{"kind":"Field","name":{"kind":"Name","value":"title"}},{"kind":"Field","name":{"kind":"Name","value":"thumbnailUrl"}},{"kind":"Field","name":{"kind":"Name","value":"durationSeconds"}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"nextItem"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"shuffleSeed"},"value":{"kind":"Variable","name":{"kind":"Name","value":"shuffleSeed"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}}]}}]}}]}}]} as unknown as DocumentNode<PlaylistItemViewQuery, PlaylistItemViewQueryVariables>;
export const AddItemUrlInformationDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"AddItemUrlInformation"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"UrlInformationInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"urlInformation"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"kind"}},{"kind":"Field","name":{"kind":"Name","value":"title"}},{"kind":"Field","name":{"kind":"Name","value":"thumbnailUrl"}},{"kind":"Field","name":{"kind":"Name","value":"embedUrl"}},{"kind":"Field","name":{"kind":"Name","value":"durationSeconds"}}]}}]}}]} as unknown as DocumentNode<AddItemUrlInformationQuery, AddItemUrlInformationQueryVariables>;
export const CreatePlaylistItemDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"CreatePlaylistItem"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"CreatePlaylistItemInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"createPlaylistItem"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}}]}}]}}]} as unknown as DocumentNode<CreatePlaylistItemMutation, CreatePlaylistItemMutationVariables>;
export const PlaylistViewDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"PlaylistView"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"playlistID"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"shuffleSeed"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"playlist"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"playlistID"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"href"}},{"kind":"Field","name":{"kind":"Name","value":"newItemsPosition"}},{"kind":"Field","name":{"kind":"Name","value":"itemsCount"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"user"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"initials"}},{"kind":"Field","name":{"kind":"Name","value":"profilePictureUrl"}}]}},{"kind":"Field","name":{"kind":"Name","value":"firstItem"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"shuffleSeed"},"value":{"kind":"NullValue"}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}}]}},{"kind":"Field","alias":{"kind":"Name","value":"shuffleFirstItem"},"name":{"kind":"Name","value":"firstItem"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"shuffleSeed"},"value":{"kind":"Variable","name":{"kind":"Name","value":"shuffleSeed"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}}]}},{"kind":"Field","name":{"kind":"Name","value":"items"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"rank"}},{"kind":"Field","name":{"kind":"Name","value":"kind"}},{"kind":"Field","name":{"kind":"Name","value":"title"}},{"kind":"Field","name":{"kind":"Name","value":"thumbnailUrl"}},{"kind":"Field","name":{"kind":"Name","value":"durationSeconds"}},{"kind":"Field","name":{"kind":"Name","value":"href"}},{"kind":"Field","name":{"kind":"Name","value":"originalPosterName"}}]}}]}}]}}]} as unknown as DocumentNode<PlaylistViewQuery, PlaylistViewQueryVariables>;
export const PlaylistPlayPageDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"PlaylistPlayPage"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"playlistID"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"shuffleSeed"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"playlist"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"playlistID"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"firstItem"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"shuffleSeed"},"value":{"kind":"NullValue"}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}}]}},{"kind":"Field","alias":{"kind":"Name","value":"shuffleFirstItem"},"name":{"kind":"Name","value":"firstItem"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"shuffleSeed"},"value":{"kind":"Variable","name":{"kind":"Name","value":"shuffleSeed"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}}]}}]}}]}}]} as unknown as DocumentNode<PlaylistPlayPageQuery, PlaylistPlayPageQueryVariables>;
export const UpdatePlaylistDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"UpdatePlaylist"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"UpdatePlaylistInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"updatePlaylist"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"newItemsPosition"}}]}}]}}]} as unknown as DocumentNode<UpdatePlaylistMutation, UpdatePlaylistMutationVariables>;
export const MovePlaylistItemDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"MovePlaylistItem"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"MovePlaylistItemInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"movePlaylistItem"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"PlaylistItemFrag"}},{"kind":"Field","name":{"kind":"Name","value":"playlist"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"firstItem"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"PlaylistItemFrag"}}]}},{"kind":"Field","name":{"kind":"Name","value":"items"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"shuffleSeed"},"value":{"kind":"NullValue"}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"PlaylistItemFrag"}}]}}]}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"PlaylistItemFrag"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"PlaylistItem"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"rank"}},{"kind":"Field","name":{"kind":"Name","value":"kind"}},{"kind":"Field","name":{"kind":"Name","value":"title"}},{"kind":"Field","name":{"kind":"Name","value":"thumbnailUrl"}},{"kind":"Field","name":{"kind":"Name","value":"durationSeconds"}},{"kind":"Field","name":{"kind":"Name","value":"href"}},{"kind":"Field","name":{"kind":"Name","value":"originalPosterName"}},{"kind":"Field","name":{"kind":"Name","value":"nextItem"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"shuffleSeed"},"value":{"kind":"NullValue"}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}}]}}]}}]} as unknown as DocumentNode<MovePlaylistItemMutation, MovePlaylistItemMutationVariables>;
export const DeletePlaylistItemDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"DeletePlaylistItem"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"deletePlaylistItem"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"id"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"PlaylistItemFrag"}},{"kind":"Field","name":{"kind":"Name","value":"playlist"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"firstItem"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"PlaylistItemFrag"}}]}},{"kind":"Field","name":{"kind":"Name","value":"items"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"shuffleSeed"},"value":{"kind":"NullValue"}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"PlaylistItemFrag"}}]}}]}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"PlaylistItemFrag"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"PlaylistItem"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"rank"}},{"kind":"Field","name":{"kind":"Name","value":"kind"}},{"kind":"Field","name":{"kind":"Name","value":"title"}},{"kind":"Field","name":{"kind":"Name","value":"thumbnailUrl"}},{"kind":"Field","name":{"kind":"Name","value":"durationSeconds"}},{"kind":"Field","name":{"kind":"Name","value":"href"}},{"kind":"Field","name":{"kind":"Name","value":"originalPosterName"}},{"kind":"Field","name":{"kind":"Name","value":"nextItem"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"shuffleSeed"},"value":{"kind":"NullValue"}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}}]}}]}}]} as unknown as DocumentNode<DeletePlaylistItemMutation, DeletePlaylistItemMutationVariables>;
export const CreatePlaylistDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"CreatePlaylist"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"CreatePlaylistInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"createPlaylist"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"newItemsPosition"}}]}}]}}]} as unknown as DocumentNode<CreatePlaylistMutation, CreatePlaylistMutationVariables>;
export const ImportPlaylistDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"ImportPlaylist"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ImportPlaylistInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"importPlaylist"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"newItemsPosition"}}]}}]}}]} as unknown as DocumentNode<ImportPlaylistMutation, ImportPlaylistMutationVariables>;
export const UserViewDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"UserView"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"userID"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"user"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"userID"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"initials"}},{"kind":"Field","name":{"kind":"Name","value":"profilePictureUrl"}},{"kind":"Field","name":{"kind":"Name","value":"playlists"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"itemsCount"}}]}}]}}]}}]} as unknown as DocumentNode<UserViewQuery, UserViewQueryVariables>;
export const UserPlaylistsDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"UserPlaylists"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"userID"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"user"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"userID"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"playlists"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"itemsCount"}}]}}]}}]}}]} as unknown as DocumentNode<UserPlaylistsQuery, UserPlaylistsQueryVariables>;
export const DeletePlaylistDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"DeletePlaylist"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"deletePlaylist"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"id"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}}]}}]}}]} as unknown as DocumentNode<DeletePlaylistMutation, DeletePlaylistMutationVariables>;