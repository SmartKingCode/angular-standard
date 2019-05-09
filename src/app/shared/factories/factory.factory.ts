import { Resource } from "../models/resource.model";
import { HttpClient } from "@angular/common/http";
import { Adapter } from "../adapters/adapter.adapter";
import { Observable, pipe } from "rxjs";
import { map } from "rxjs/operators";
import { QueryOptions } from "../models/query-options.model";



export class Factory<T extends Resource> {

  constructor(
    private httpClient: HttpClient,
    private url: string,
    private endpoint: string,
    protected adapter: Adapter,
  ) { }

  //CREATE ENTITY
  public create(item: T): Observable<T> {
    return this.httpClient
      .post<T>(`${this.url}/${this.endpoint}`, this.adapter.toJson(item))
      .pipe(map(data => this.adapter.fromJson(data) as T));
  }

  //UPDATE ENTITY 
  public update(item: T): Observable<T> {
    return this.httpClient
      .put<T>(`${this.url}/${this.endpoint}/${item.id}`,
        this.adapter.toJson(item))
      .pipe(map(data => this.adapter.fromJson(data) as T));
  }

  //GET ENTITY BY ID
  read(id: number): Observable<T> {
    return this.httpClient
      .get(`${this.url}/${this.endpoint}/${id}`)
      .pipe(map((data: any) => this.adapter.fromJson(data) as T));
  }

  //GET A LIST OF ENTITY BASED ON QUERY RESULT
  list(queryOptions: QueryOptions): Observable<T[]> {
    return this.httpClient
      .get(`${this.url}/${this.endpoint}?${queryOptions.toQueryString()}`)
      .pipe(map((data: any[]) => this.convertData(data)));
  }

  //DELETE ENTITY BY ID
  delete(id: number) {
    return this.httpClient
      .delete(`${this.url}/${this.endpoint}/${id}`);
  }

  //CONVERT DATA FROM QUERY RESULT TO INTERNAL ENTITY ADAPTER 
  private convertData(data: any): T[] {
    return data.map(item => this.adapter.fromJson(item));
  }
}
