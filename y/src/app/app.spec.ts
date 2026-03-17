import { TestBed } from '@angular/core/testing';
import { App } from './app';

describe('App', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [App],
    }).compileComponents();
  });

  it('should create the app', () => {
    const fixture = TestBed.createComponent(App);
    const app = fixture.componentInstance;
    expect(app).toBeTruthy();
  });

  it('should display a fact', async () => {
    const fixture = TestBed.createComponent(App);
    fixture.detectChanges();
    await fixture.whenStable();
    const compiled = fixture.nativeElement as HTMLElement;

    const factText = compiled.querySelector('.fact-text')?.textContent?.trim();

    expect(factText).toBeTruthy();
    expect(factText).toBe(fixture.componentInstance.currentFact.text);
  });

  it('should change displayed fact when clicking "Next fact"', async () => {
    const fixture = TestBed.createComponent(App);
    fixture.detectChanges();
    await fixture.whenStable();

    const compiled = fixture.nativeElement as HTMLElement;
    const nextFactButton = compiled.querySelectorAll('button')[0] as HTMLButtonElement;
    const firstFact = fixture.componentInstance.currentFact.text;

    nextFactButton.click();
    fixture.detectChanges();

    const secondFact = fixture.componentInstance.currentFact.text;
    expect(secondFact).not.toBe(firstFact);
  });

  it('should add current fact to favorites when clicking "Favorite"', async () => {
    const fixture = TestBed.createComponent(App);
    fixture.detectChanges();
    await fixture.whenStable();

    const compiled = fixture.nativeElement as HTMLElement;
    const favoriteButton = compiled.querySelectorAll('button')[1] as HTMLButtonElement;
    const currentFactText = fixture.componentInstance.currentFact.text;

    favoriteButton.click();
    fixture.detectChanges();

    const favoriteItems = compiled.querySelectorAll('li');
    expect(fixture.componentInstance.favorites.length).toBe(1);
    expect(fixture.componentInstance.favorites[0].text).toBe(currentFactText);
    expect(favoriteItems.length).toBe(1);
  });

  it('should not add duplicate favorites', async () => {
    const fixture = TestBed.createComponent(App);
    fixture.detectChanges();
    await fixture.whenStable();

    const compiled = fixture.nativeElement as HTMLElement;
    const favoriteButton = compiled.querySelectorAll('button')[1] as HTMLButtonElement;

    favoriteButton.click();
    favoriteButton.click();
    fixture.detectChanges();

    const favoriteItems = compiled.querySelectorAll('li');
    expect(fixture.componentInstance.favorites.length).toBe(1);
    expect(favoriteItems.length).toBe(1);
  });
});
