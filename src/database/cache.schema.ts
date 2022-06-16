import { ObjectId } from "https://deno.land/x/mongo@v0.30.0/mod.ts";

export interface CacheSchema {
    _id: ObjectId;
    url: string;
    file_id: string;
}