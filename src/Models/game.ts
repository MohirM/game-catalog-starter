import { Collection } from "mongodb";

export type Game = {
  name: string;
  slug: string;
  price: number;
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
      cover: game.cover_url,
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
}
