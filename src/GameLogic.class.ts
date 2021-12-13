export type Matrix = number[][];
export enum GameStatuses {IDLE, PROCESSING, WIN, END}

export class GameLogicClass {
  /**
   * Чистая матрица
   */
  public static emptyMatrix = (): Matrix => [
    [0, 0, 0, 0],
    [0, 0, 0, 0],
    [0, 0, 0, 0],
    [0, 0, 0, 0],
  ];


  /**
   * Имеет ли матрица определенное значение?
   * @param matrix
   * @param value
   */
  private static hasValue = (matrix: Matrix, value: number): boolean => {
    for (let i = 0; i < matrix.length; i++) {
      for (let j = 0; j < matrix[i].length; j++) {
        if (matrix[i][j] === value) return true;
      }
    }
    return false;
  };


  /**
   * Имеет ли матрица свободные ячейки?
   * @param matrix
   */
  private static isFull = (matrix: Matrix) => {
    return !this.hasValue(matrix, 0);
  };


  /**
   * Получить случайную позицию матрицы
   */
  private static getRandomPosition = (): [number, number] => {
    return [Math.floor(Math.random() * 4), Math.floor(Math.random() * 4)];
  };


  /**
   * Генерация значения 2 в случайной свободной ячейки
   * @param matrix
   */
  public static generateRandom = (matrix: Matrix) => {
    // Если матрица заполнена, вернем ее не генерируя новое значение
    if (this.isFull(matrix)) return matrix;
    // Генерируем случайную позицию в матрице, пока не найдем пустую
    let [x, y] = this.getRandomPosition();
    while (matrix[x][y] !== 0) {
      [x, y] = this.getRandomPosition();
    }
    // TODO: На будущее! Добавить случайную генерацию 2, 4, 8 и т. д. в зависимости от суммы всех значений матрицы
    matrix[x][y] = 2;
    return matrix;
  };


  /**
   * Сжатие матрицы.
   * Смещает все значение не равные 0 влево
   * @param matrix
   */
  private static compress = (matrix: Matrix) => {
    const nextMatrix = this.emptyMatrix();
    for (let i = 0; i < matrix.length; i++) {
      let columnIndex = 0;
      for (let j = 0; j < matrix[i].length; j++) {
        if (matrix[i][j] !== 0) {
          nextMatrix[i][columnIndex] = matrix[i][j];
          columnIndex++;
        }
      }
    }
    return nextMatrix;
  };


  /**
   * Слияние равных значений.
   * Суммирует равные значения в левую сторону и оставляет одну ячейку свободной
   * @param matrix
   */
  private static merge = (matrix: Matrix) => {
    for (let i = 0; i < matrix.length; i++) {
      for (let j = 0; j < matrix[i].length; j++) {
        if (matrix[i][j] !== 0 && matrix[i][j] === matrix[i][j + 1]) {
          matrix[i][j] = matrix[i][j] * 2;
          matrix[i][j + 1] = 0;
        }
      }
    }
    return matrix;
  };


  /**
   * Перемещение всех значений матрицы влево
   * @param matrix
   */
  private static moveLeft = (matrix: Matrix) => {
    // сжатие -> слияние -> сжатие
    return this.compress(this.merge(this.compress(matrix)));
  };


  /**
   * Разворот матрицы на 180 градусов
   * @param matrix
   */
  private static rotateMatrix180Degrees = (matrix: Matrix) => {
    const reverseMatrix = this.emptyMatrix();
    for (let i = 0; i < matrix.length; i++) {
      for (let j = 0; j < matrix[i].length; j++) {
        reverseMatrix[i][j] = matrix[i][matrix[i].length - 1 - j];
      }
    }
    return reverseMatrix;
  };


  /**
   * Перемещение всех значений матрицы вправо
   * @param matrix
   */
  private static moveRight = (matrix: Matrix) => {
    // разворачиваем на 180 -> сдвигаем влево -> разворачиваем обратно
    return this.rotateMatrix180Degrees(this.moveLeft(this.rotateMatrix180Degrees(matrix)));
  };


  /**
   * Разворот матрицы на 90 градусов влево
   * @param matrix
   */
  private static rotateMatrix90DegreesToLeft = (matrix: Matrix) => {
    const rotateMatrix = this.emptyMatrix();
    for (let i = 0; i < matrix.length; i++) {
      for (let j = 0; j < matrix[i].length; j++) {
        rotateMatrix[i][j] = matrix[j][matrix[i].length - 1 - i];
      }
    }
    return rotateMatrix;
  };


  /**
   * Разворот матрицы на 90 градусов вправо
   * @param matrix
   */
  private static rotateMatrix90DegreesToRight = (matrix: Matrix) => {
    const rotateMatrix = this.emptyMatrix();
    for (let i = 0; i < matrix.length; i++) {
      for (let j = 0; j < matrix[i].length; j++) {
        rotateMatrix[i][j] = matrix[matrix[i].length - 1 - j][i];
      }
    }
    return rotateMatrix;
  };


  /**
   * Перемещение всех значений матрицы вверх
   * @param matrix
   */
  private static moveUp = (matrix: Matrix) => {
    const rotate90ToLeft = this.rotateMatrix90DegreesToLeft(matrix);
    const nextMatrix = this.moveLeft(rotate90ToLeft);
    return this.rotateMatrix90DegreesToRight(nextMatrix);
  };


  /**
   * Перемещение всех значений матрицы вниз
   * @param matrix
   */
  private static moveDown = (matrix: Matrix) => {
    const rotate90ToRight = this.rotateMatrix90DegreesToRight(matrix);
    const nextMatrix = this.moveLeft(rotate90ToRight);
    return this.rotateMatrix90DegreesToLeft(nextMatrix);
  };


  /**
   * Проверить набор значения 2048
   * @param matrix
   */
  private static checkWin = (matrix: Matrix) => {
    return this.hasValue(matrix, 2048);
  };


  /**
   * Сравнить две матрицы
   * @param prevMatrix
   * @param nextMatrix
   */
  private static notSame = (prevMatrix: Matrix, nextMatrix: Matrix) => {
    for (let i = 0; i < prevMatrix.length; i++) {
      for (let j = 0; j < prevMatrix[i].length; j++) {
        if (prevMatrix[i][j] !== nextMatrix[i][j]) {
          return true; // не одинаковые
        }
      }
    }
    return false; // одинаковые
  };


  /**
   * Конец игры?
   * @param matrix
   */
  private static isTheEndGame = (matrix: Matrix) => {
    // Сверяем две матрицы, текущую и если ее смести в одну из сторон
    if (this.notSame(matrix, this.moveLeft(matrix))) return false;
    if (this.notSame(matrix, this.moveRight(matrix))) return false;
    if (this.notSame(matrix, this.moveUp(matrix))) return false;
    if (this.notSame(matrix, this.moveRight(matrix))) return false;
    return true;
  };


  /**
   * Проверка состояния игры.
   * Не кончилась ли она или может мы победили?
   */
  public static checkState = (matrix: Matrix): GameStatuses => {
    if (this.checkWin(matrix)) return GameStatuses.WIN;
    if (this.isTheEndGame(matrix)) return GameStatuses.END;
    return GameStatuses.PROCESSING;
  };


  /**
   * Функции действий
   */
  public static left = (matrix: Matrix) => {
    return this.generateRandom(this.moveLeft(matrix));
  };
  public static right = (matrix: Matrix) => {
    return this.generateRandom(this.moveRight(matrix));
  };
  public static up = (matrix: Matrix) => {
    return this.generateRandom(this.moveUp(matrix));
  };
  public static down = (matrix: Matrix) => {
    return this.generateRandom(this.moveDown(matrix));
  };
}
