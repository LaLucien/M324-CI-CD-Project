import { Component } from '@angular/core';
import { FunFact } from './fact.model';

@Component({
  selector: 'app-root',
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  facts: FunFact[] = [
    { id: 1, text: 'Bananas are berries, but strawberries are not.' },
    { id: 2, text: 'Octopuses have three hearts and blue blood.' },
    { id: 3, text: 'Honey never spoils — jars found in tombs are still edible.' },
    { id: 4, text: 'Sharks existed before trees.' },
    { id: 5, text: 'A group of flamingos is called a “flamboyance.”' },
    { id: 6, text: 'Wombat poop is cube-shaped.' },
    { id: 7, text: 'Sloths can hold their breath longer than dolphins.' },
    { id: 8, text: 'There are more fake flamingos in the world than real ones.' },
    { id: 9, text: 'Turtles can breathe through their butts.' },
    { id: 10, text: 'Cows have best friends and get stressed when separated.' },
    { id: 11, text: 'A day on Venus is longer than a year on Venus.' },
    { id: 12, text: 'Penguins propose to their partners with pebbles.' },
    { id: 13, text: 'You can hear a blue whale’s heartbeat from 3 km away.' },
    { id: 14, text: 'The inventor of the Pringles can is buried in one.' },
    { id: 15, text: 'Humans glow in the dark (but our eyes can’t see it).' }
  ];

  currentFact: FunFact = this.facts[0];
  favorites: FunFact[] = [];

  constructor() {
    this.showNextFact();
  }

  get favoritesCount(): number {
    return this.favorites.length;
  }

  showNextFact(): void {
    if (this.facts.length === 1) {
      this.currentFact = this.facts[0];
      return;
    }

    let nextFact = this.currentFact;
    while (nextFact.id === this.currentFact.id) {
      const randomIndex = Math.floor(Math.random() * this.facts.length);
      nextFact = this.facts[randomIndex];
    }

    this.currentFact = nextFact;
  }

  addFavorite(): void {
    const exists = this.favorites.some((fact) => fact.id === this.currentFact.id);
    if (!exists) {
      this.favorites = [...this.favorites, this.currentFact];
    }
  }
}
