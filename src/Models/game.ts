import { Collection } from "mongodb";

export type Game = {
  name: string;
  slug: string;
  price: number;
  platform: string;
  [key: string]: any;
};
export type Platform = {
  name: string;
  platform_logo_url: string;
  slug: string;
  [key: string]: any;
};

export class GameModel {
  private collection: Collection;

  constructor(collection: Collection) {
    this.collection = collection;
  }

  private fullGameToGame(game: Game) {
    return {
      name: game.name,
      slug: game.slug,
      price: game.price,
      cover: game.cover,
      platform: game.platform,
    };
  }

  getAll(): Promise<Game[]> {
    return this.collection
      .find({})
      .toArray()
      .then((games) => games.map(this.fullGameToGame));
  }

  findBySlug(slug: string): Promise<Game | null> {
    return this.collection.findOne({
      slug: slug,
    });
  }

  getPlatforms(): Promise<Platform[]> {
    return this.collection
      .find({})
      .toArray()
      .then((games) => {
        const platforms: Platform[] = [];
        games.forEach((game) => {
          const platform = platforms.find(
            (platform) => platform.slug === game.platform.slug
          );
          if (!platform) {
            platforms.push(game.platform);
          }
        });
        return platforms.map((platform) => ({
          name: platform.name,
          platform_logo_url: platform.platform_logo_url,
          slug: platform.slug,
        }));
      });
  }

  findByPlatform(platform_slug: string): Promise<Game[]> {
    return this.collection
      .find({ "platform.slug": platform_slug })
      .toArray()
      .then((games) => games.map(this.fullGameToGame));
  }
  getSearch(pattern: string): Promise<Game[]> {
    return this.collection
      .find({ name: { $regex: `${pattern}`, $options: "i" } })
      .toArray()
      .then((games) => games.map(this.fullGameToGame));
  }
  getPlatformsSearch(pattern: string): Promise<Platform[]> {
    return this.collection
      .find({ "platform.name": { $regex: `${pattern}`, $options: "i" } })
      .toArray()
      .then((games) => {
        const platforms: Platform[] = [];
        games.forEach((game) => {
          const platform = platforms.find(
            (platform) => platform.slug === game.platform.slug
          );
          if (!platform) {
            platforms.push(game.platform);
          }
        });
        return platforms.map((platform) => ({
          name: platform.name,
          platform_logo_url: platform.platform_logo_url,
          slug: platform.slug,
        }));
      });
  }
}
