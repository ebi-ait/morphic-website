import {Injectable} from "@angular/core";
import {HttpClient} from "@angular/common/http";
import {GridRecord} from "../types/GridRecord";
import {Observable} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class DataService {

  public static dataKey = "json_data";

  constructor(private http: HttpClient) {
  }

  private cache: { [key: string]: GridRecord[] } = {};

  public loadJsonData(): Observable<GridRecord[]> {
    console.log("service fetching data: ");
     return this.http.get<GridRecord[]>("assets/data.json").pipe(
      (data) => {
        data.subscribe( d => this.cacheData(DataService.dataKey, d));
        return data;
      }
    );
  }

  public cacheData(key: string, data: GridRecord[]): void {
    this.cache[key] = data;
  }

  getFromCache(key: string): GridRecord[] {
      return this.cache[key];
  }

  isCached(key: string): boolean {
    return this.cache.hasOwnProperty(key);
  }



}
