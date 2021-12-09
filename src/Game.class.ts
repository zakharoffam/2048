export class Game {
  readonly userName: string;
  readonly score: number; // Набранные очки

  readonly space = [
    [0, 0, 0, 0],
    [0, 0, 0, 0],
    [0, 0, 0, 0],
    [0, 0, 0, 0],
  ];


  constructor(userName: string) {
    this.userName = userName;
    this.score = 0;

    const vertical = Math.floor(Math.random() * 5);
    const horizon = Math.floor(Math.random() * 5);
    this.space[horizon][vertical] = 2
  }


  startGame() {
    const vertical = Math.floor(Math.random() * 5);
    const horizon = Math.floor(Math.random() * 5);
    this.space[horizon][vertical] = 2
  }


  currentState() {
    return this.space;
  }


  up() {

  }


  down() {

  }


  left() {

  }


  right() {

  }



}
