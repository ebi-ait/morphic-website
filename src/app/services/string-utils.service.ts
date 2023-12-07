import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class StringUtilsService {

  constructor() { }

  public static snakeCaseToTitle(snakedCased: string) : string {
    let title = "";
    snakedCased.split("_").forEach(word => {
      title = title + " " +  word[0].toUpperCase() + word.substring(1).toLowerCase();
    });
    return title.trim();
  }
}
