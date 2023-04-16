import { Component, OnInit } from '@angular/core';
import { Hero } from '../hero';
import { ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';
import { HeroService } from '../hero.service';

@Component({
  selector: 'app-hero-detail',
  templateUrl: './hero-detail.component.html',
  styleUrls: ['./hero-detail.component.css'],
})
export class HeroDetailComponent implements OnInit {
  hero: Hero | undefined;

  constructor(
    private route: ActivatedRoute, //latter - holds info about the route to this instance of HeroDetailComponent. This component is interested in the route's parameters extracted from the URL
    private heroService: HeroService, // latter - gets hero data from remote server, this component uses it to get the hero to display
    private location: Location //latter - Angular service for interacting with the browser. Service lets user navigate back to previous view
  ) {}

  ngOnInit(): void {
    this.getHero();
  }

  getHero(): void {
    const id = Number(this.route.snapshot.paramMap.get('id')); //r.s is static image of route info shortly after component was created. paraMap is dictionary of route parameter values extracted from url. route parameters are always strings
    this.heroService.getHero(id).subscribe((hero) => (this.hero = hero));
  }

  goBack(): void {
    this.location.back();
  }

  save(): void {
    if (this.hero) {
      this.heroService.updateHero(this.hero).subscribe(() => this.goBack());
    }
  }
}
