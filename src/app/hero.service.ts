import { Injectable } from '@angular/core';
import { Hero } from './hero';
import { HEROES } from './mock-heroes';
import { Observable, of } from 'rxjs';
import { MessageService } from './message.service';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { catchError, map, tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class HeroService {
  constructor(
    private http: HttpClient, //injecting httpClient into the constructor in a private property called http
    private messageService: MessageService
  ) {}

  //Log a HeroService message with the MessageService
  private log(message: string) {
    this.messageService.add(`HeroService: ${message}`);
  }

  //api is the 'base' - resource to which requests are made. heroes is 'collectionName - heroes data object in the -in-memory-data-service.ts
  private heroesURL = 'api/heroes'; //url to web api

  //GET heroes from the server
  getHeroes(): Observable<Hero[]> {
    //HttpClient.get() returns the body of the response as an untyped JSON object by default. We specify the optional type specified, <Hero[]>. Server's data API determines shape of JSON data. Ours returns hero data as an array
    //to catch errors, we 'pipe' the Observable result from the get method through an RxJS catchError() operator, this operator intercepts a failed Observable and passes error to error handling function
    //following handleError() method reports the error and returns an innocuous result so that app keeps working
    return this.http.get<Hero[]>(this.heroesURL).pipe(
      //tap method enabilities ability to look into the observable values(doesn't access them), doing something with those values and passing them along
      tap((_) => this.log('fetched heroes')),
      catchError(this.handleError<Hero[]>('getHeroes', []))
    );
  }

  // GET hero by id. Will 404 if id not found, will reuturn an Observable<Hero>, which is an observable of Hero objects rather than observable of Hero arrays
  getHero(id: number): Observable<Hero> {
    const url = `${this.heroesURL}/${id}`;
    return this.http.get<Hero>(url).pipe(
      tap((_) => this.log(`fetched hero id=${id}`)),
      catchError(this.handleError<Hero>(`getHero id=${id}`))
    );
  }

  //PUT: update the hero on the serve
  updateHero(hero: Hero): Observable<any> {
    // the heroes web API expects a special header in HTTP save requests. That header is in the httpOptions constant defined in this file
    return this.http.put(this.heroesURL, hero, this.httpOptions).pipe(
      tap((_) => this.log(`updated hero id=${hero.id}`)),
      catchError(this.handleError<any>('updateHero'))
    );
  }

  httpOptions = {
    headers: new HttpHeaders({ 'Content=Type': 'application/json' }),
  };

  //POST, adding a new hero to the server
  //addHero() differs from updateHero in that it expects server to create an id for the new hero, which it returns in the Observable<Hero> to the caller
  addHero(hero: Hero): Observable<Hero> {
    return this.http.post<Hero>(this.heroesURL, hero, this.httpOptions).pipe(
      tap((newHero: Hero) => this.log(`added hero w/ id={newHero.id}`)),
      catchError(this.handleError<Hero>('addHero'))
    );
  }

  /** DELETE: delete the hero from the server */
  deleteHero(id: number): Observable<Hero> {
    const url = `${this.heroesURL}/${id}`;

    //notice we don't send data as we do with put and post, but still send httpOptions
    return this.http.delete<Hero>(url, this.httpOptions).pipe(
      tap((_) => this.log(`deleted hero id=${id}`)),
      catchError(this.handleError<Hero>('deleteHero'))
    );
  }

  /* GET heroes whose name contains search term */
  searchHeroes(term: string): Observable<Hero[]> {
    if (!term.trim()) {
      // if not search term, return empty hero array.
      return of([]);
    }
    return this.http.get<Hero[]>(`${this.heroesURL}/?name=${term}`).pipe(
      tap((x) =>
        x.length
          ? this.log(`found heroes matching "${term}"`)
          : this.log(`no heroes matching "${term}"`)
      ),
      catchError(this.handleError<Hero[]>('searchHeroes', []))
    );
  }

  private handleError<T>(operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {
      //TODO: send the error to remote logging infrastructure
      console.error(error); //log to console instead

      //TODO: better job of transforming error for user consumption (friendly message)
      this.log(`${operation} failed: ${error.message}`);

      //Let the app keep running by returning an empty result
      return of(result as T);
    };
  }
}
