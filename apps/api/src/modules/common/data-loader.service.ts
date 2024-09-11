import DataLoader from "dataloader";
import { Injectable } from "@nestjs/common";

import { User } from "../auth/user/user.model.js";
import { UserService } from "../auth/user/user.service.js";
import { Playlist } from "../watch/playlist/playlist.model.js";
import { PlaylistService } from "../watch/playlist/playlist.service.js";
import { PlaylistItem } from "../watch/playlist-item/playlist-item.model.js";
import { PlaylistItemService } from "../watch/playlist-item/playlist-item.service.js";

export type Loaders = ReturnType<DataLoaderService["generateLoaders"]>;

@Injectable()
export class DataLoaderService {
  constructor(
    private playlistService: PlaylistService,
    private playlistItemService: PlaylistItemService,
    private userService: UserService,
  ) {}

  generateLoaders() {
    return {
      user: this.createUserLoader(),
      playlist: this.createPlaylistLoader(),
      playlistItem: this.createPlaylistItemLoader(),
    };
  }

  private createPlaylistLoader() {
    return new DataLoader<number, Playlist>(async (ids) => {
      const playlists = await this.playlistService.getByIds([...ids]);

      return this.mapKeysToValues(ids, playlists, (playlist) => playlist.id);
    });
  }

  private createPlaylistItemLoader() {
    return new DataLoader<number, PlaylistItem>(async (ids) => {
      const items = await this.playlistItemService.getByIds([...ids]);

      return this.mapKeysToValues(ids, items, (playlistItem) => playlistItem.id);
    });
  }

  private createUserLoader() {
    return new DataLoader<number, User>(async (ids) => {
      const users = await this.userService.getByIds([...ids]);

      return this.mapKeysToValues(ids, users, (user) => user.id);
    });
  }

  private mapKeysToValues<V, K = number>(keys: readonly K[], values: V[], getKey: (value: V) => K) {
    return keys.map((key) => values.find((value) => getKey(value) == key)!);
  }
}
