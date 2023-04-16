import { Component, OnInit } from '@angular/core';
import { Hero } from '../hero';
import { HeroService } from '../hero.service';

@Component({
  selector: 'app-heroes',
  templateUrl: './heroes.component.html',
  styleUrls: ['./heroes.component.css'],
})
export class HeroesComponent implements OnInit {
  heroes: Hero[] = [];

  constructor(
    //latter is the service class created, former defines a private heroService property and identifies it as a HeroService injection site
    private heroService: HeroService
  ) {}

  //calling getHeroes() inside the ngOnInit lifecycle hook and let Angular call ngOnInit() at an appropriate after constructing a HeroesComponent instance
  ngOnInit(): void {
    this.getHeroes();
  }

  //asynchronous, waiting for Observable to emit the array of heroes, no matter how long taken, subscribe() method passes emitted array to the callback which sets to component's hero property.
  getHeroes(): void {
    this.heroService.getHeroes().subscribe((heroes) => (this.heroes = heroes));
  }

  add(name: string): void {
    //creating object
    name = name.trim();
    if (!name) {
      return;
    }
    //subscribe callback receives the new hero and pushes it into hero list for display
    this.heroService.addHero({ name } as Hero).subscribe((hero) => {
      this.heroes.push(hero);
    });
  }

  delete(hero: Hero): void {
    this.heroes = this.heroes.filter((h) => h !== hero);
    // nothing for component to do with the Observable returned BUT IT MUST SUBSCRIBE ANYWAY
    //If you neglect to subscribe(), the service can't send the delete request to the server. As a rule, an Observable does nothing until something subscribes.
    this.heroService.deleteHero(hero.id).subscribe();
  }
}
