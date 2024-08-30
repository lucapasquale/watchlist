/* eslint-disable */
import * as types from './graphql';
import { TypedDocumentNode as DocumentNode } from '@graphql-typed-document-node/core';

/**
 * Map of all GraphQL operations in the project.
 *
 * This map has several performance disadvantages:
 * 1. It is not tree-shakeable, so it will include all operations in the project.
 * 2. It is not minifiable, so the string of a GraphQL query will be multiple times inside the bundle.
 * 3. It does not support dead code elimination, so it will add unused operations.
 *
 * Therefore it is highly recommended to use the babel or swc plugin for production.
 */
const documents = {
    "\n  mutation CreatePlaylist($input: CreatePlaylistInput!) {\n    createPlaylist(input: $input) {\n      id\n      name\n    }\n  }\n": types.CreatePlaylistDocument,
    "\n  mutation CreatePlaylistFromYoutube($url: String!) {\n    createPlaylistFromYoutube(url: $url) {\n      id\n      name\n    }\n  }\n": types.CreatePlaylistFromYoutubeDocument,
    "\n  query HomePlaylists {\n    playlists {\n      id\n      name\n    }\n  }\n": types.HomePlaylistsDocument,
    "\n  mutation CreatePlaylistItem($input: CreatePlaylistItemInput!) {\n    createPlaylistItem(input: $input) {\n      id\n      kind\n      title\n      thumbnailUrl\n      rawUrl\n    }\n  }\n": types.CreatePlaylistItemDocument,
    "\n  mutation DeletePlaylistItem($id: ID!) {\n    deletePlaylistItem(id: $id)\n  }\n": types.DeletePlaylistItemDocument,
    "\n  query EditPlaylistItems($playlistID: ID!) {\n    playlist(id: $playlistID) {\n      id\n      name\n\n      items {\n        id\n        kind\n        title\n        thumbnailUrl\n        rawUrl\n      }\n    }\n  }\n": types.EditPlaylistItemsDocument,
    "\n  mutation MovePlaylistItem($input: MovePlaylistItemInput!) {\n    movePlaylistItem(input: $input) {\n      id\n    }\n  }\n": types.MovePlaylistItemDocument,
    "\n  query PlaylistItemQueueSidebar($playlistID: ID!) {\n    playlist(id: $playlistID) {\n      id\n      name\n\n      items {\n        id\n        kind\n        title\n        thumbnailUrl\n      }\n    }\n  }\n": types.PlaylistItemQueueSidebarDocument,
    "\n  query PlaylistItemView($playlistItemID: ID!, $shuffleSeed: String) {\n    playlistItem(id: $playlistItemID) {\n      id\n      kind\n      title\n      thumbnailUrl\n      url\n      rawUrl\n\n      nextItem(shuffleSeed: $shuffleSeed) {\n        id\n      }\n    }\n  }\n": types.PlaylistItemViewDocument,
    "\n  query PlaylistView($playlistID: ID!, $shuffleSeed: String!) {\n    playlist(id: $playlistID) {\n      id\n      name\n\n      firstItem {\n        id\n      }\n      shuffleFirstItem: firstItem(shuffleSeed: $shuffleSeed) {\n        id\n      }\n    }\n  }\n": types.PlaylistViewDocument,
};

/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 *
 *
 * @example
 * ```ts
 * const query = gql(`query GetUser($id: ID!) { user(id: $id) { name } }`);
 * ```
 *
 * The query argument is unknown!
 * Please regenerate the types.
 */
export function gql(source: string): unknown;

/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "\n  mutation CreatePlaylist($input: CreatePlaylistInput!) {\n    createPlaylist(input: $input) {\n      id\n      name\n    }\n  }\n"): (typeof documents)["\n  mutation CreatePlaylist($input: CreatePlaylistInput!) {\n    createPlaylist(input: $input) {\n      id\n      name\n    }\n  }\n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "\n  mutation CreatePlaylistFromYoutube($url: String!) {\n    createPlaylistFromYoutube(url: $url) {\n      id\n      name\n    }\n  }\n"): (typeof documents)["\n  mutation CreatePlaylistFromYoutube($url: String!) {\n    createPlaylistFromYoutube(url: $url) {\n      id\n      name\n    }\n  }\n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "\n  query HomePlaylists {\n    playlists {\n      id\n      name\n    }\n  }\n"): (typeof documents)["\n  query HomePlaylists {\n    playlists {\n      id\n      name\n    }\n  }\n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "\n  mutation CreatePlaylistItem($input: CreatePlaylistItemInput!) {\n    createPlaylistItem(input: $input) {\n      id\n      kind\n      title\n      thumbnailUrl\n      rawUrl\n    }\n  }\n"): (typeof documents)["\n  mutation CreatePlaylistItem($input: CreatePlaylistItemInput!) {\n    createPlaylistItem(input: $input) {\n      id\n      kind\n      title\n      thumbnailUrl\n      rawUrl\n    }\n  }\n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "\n  mutation DeletePlaylistItem($id: ID!) {\n    deletePlaylistItem(id: $id)\n  }\n"): (typeof documents)["\n  mutation DeletePlaylistItem($id: ID!) {\n    deletePlaylistItem(id: $id)\n  }\n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "\n  query EditPlaylistItems($playlistID: ID!) {\n    playlist(id: $playlistID) {\n      id\n      name\n\n      items {\n        id\n        kind\n        title\n        thumbnailUrl\n        rawUrl\n      }\n    }\n  }\n"): (typeof documents)["\n  query EditPlaylistItems($playlistID: ID!) {\n    playlist(id: $playlistID) {\n      id\n      name\n\n      items {\n        id\n        kind\n        title\n        thumbnailUrl\n        rawUrl\n      }\n    }\n  }\n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "\n  mutation MovePlaylistItem($input: MovePlaylistItemInput!) {\n    movePlaylistItem(input: $input) {\n      id\n    }\n  }\n"): (typeof documents)["\n  mutation MovePlaylistItem($input: MovePlaylistItemInput!) {\n    movePlaylistItem(input: $input) {\n      id\n    }\n  }\n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "\n  query PlaylistItemQueueSidebar($playlistID: ID!) {\n    playlist(id: $playlistID) {\n      id\n      name\n\n      items {\n        id\n        kind\n        title\n        thumbnailUrl\n      }\n    }\n  }\n"): (typeof documents)["\n  query PlaylistItemQueueSidebar($playlistID: ID!) {\n    playlist(id: $playlistID) {\n      id\n      name\n\n      items {\n        id\n        kind\n        title\n        thumbnailUrl\n      }\n    }\n  }\n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "\n  query PlaylistItemView($playlistItemID: ID!, $shuffleSeed: String) {\n    playlistItem(id: $playlistItemID) {\n      id\n      kind\n      title\n      thumbnailUrl\n      url\n      rawUrl\n\n      nextItem(shuffleSeed: $shuffleSeed) {\n        id\n      }\n    }\n  }\n"): (typeof documents)["\n  query PlaylistItemView($playlistItemID: ID!, $shuffleSeed: String) {\n    playlistItem(id: $playlistItemID) {\n      id\n      kind\n      title\n      thumbnailUrl\n      url\n      rawUrl\n\n      nextItem(shuffleSeed: $shuffleSeed) {\n        id\n      }\n    }\n  }\n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "\n  query PlaylistView($playlistID: ID!, $shuffleSeed: String!) {\n    playlist(id: $playlistID) {\n      id\n      name\n\n      firstItem {\n        id\n      }\n      shuffleFirstItem: firstItem(shuffleSeed: $shuffleSeed) {\n        id\n      }\n    }\n  }\n"): (typeof documents)["\n  query PlaylistView($playlistID: ID!, $shuffleSeed: String!) {\n    playlist(id: $playlistID) {\n      id\n      name\n\n      firstItem {\n        id\n      }\n      shuffleFirstItem: firstItem(shuffleSeed: $shuffleSeed) {\n        id\n      }\n    }\n  }\n"];

export function gql(source: string) {
  return (documents as any)[source] ?? {};
}

export type DocumentType<TDocumentNode extends DocumentNode<any, any>> = TDocumentNode extends DocumentNode<  infer TType,  any>  ? TType  : never;