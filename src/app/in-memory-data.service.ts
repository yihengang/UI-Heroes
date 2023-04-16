import { Injectable } from '@angular/core';
import { InMemoryDbService } from 'angular-in-memory-web-api';
import { Hero } from './hero';

@Injectable({
  providedIn: 'root',
})
export class InMemoryDataService implements InMemoryDbService {
  createDb() {
    const heroes = [
      { id: 12, name: 'Pandu' },
      { id: 13, name: 'Yi Heng' },
      { id: 14, name: 'Rajesh' },
      { id: 15, name: 'Vijay' },
      { id: 16, name: 'Rushabh' },
      { id: 17, name: 'Prajwala' },
      { id: 18, name: 'Prerana' },
      // { id: 19, name: 'Magma' },
      // { id: 20, name: 'Tornado' },
    ];
    return { heroes };
  }

  // Overrides the genId method to ensure that a hero always has an id.
  // If the heroes array is empty,
  // the method below returns the initial number (11).
  // if the heroes array is not empty, the method below returns the highest
  // hero id + 1.
  genId(heroes: Hero[]): number {
    return heroes.length > 0
      ? Math.max(...heroes.map((hero) => hero.id)) + 1
      : 11;
  }
}
