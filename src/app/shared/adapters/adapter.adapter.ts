import { Resource } from '../models/resource.model';

export interface Adapter {
    fromJson(json: any): Resource;
    toJson(resource: Resource): any;
}