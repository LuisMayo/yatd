import {
    Collection,
    MongoClient,
  } from "https://deno.land/x/mongo@v0.30.0/mod.ts";
import { CacheSchema } from "./cache.schema.ts";

export class DBCache {
    ///////SINGLETON
    private static handler: DBCache;
    static async getInstance() {
        if (this.handler == null) {
            this.handler = new DBCache();
            await this.handler.init();
        }
        return this.handler;
    }
    /////////////
    private client: MongoClient;
    private collection: Collection<CacheSchema> | undefined;

    constructor() {
        this.client = new MongoClient();
    }
    async init() {
        const URL = Deno.env.get('MONGODB') || '';
        if (URL.length > 0) {
            await this.client.connect(URL);
            this.collection = this.client.database('YATD').collection('cache');
            await this.collection.createIndexes({indexes: [{name: 'url', key: {'url': 1}}]});
        }
    }

    getFromCache(url: string) {
        return this.collection?.findOne({url});
    }

    async putInCache(url: string, fileId: string) {
        const previousRecord = await this.getFromCache(url);
        if (previousRecord == null) {
            await this.collection?.insertOne({url, file_id: fileId});
        }
    }

    removeFromCache(url: string) {
        return this.collection?.deleteOne({url});
    }
}