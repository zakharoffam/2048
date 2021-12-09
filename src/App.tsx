import React, { useEffect, useState } from 'react';
import './App.css';


function App() {
  type Matrix = number[][];

  /**
   * Чистая матрица
   */
  const emptyMatrix = (): Matrix => [
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
  const hasValue = (matrix: Matrix, value: number): boolean => {
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
  const hasFreeCell = (matrix: Matrix) => {
    return hasValue(matrix, 0);
  };


  /**
   * Получить случайную позицию матрицы
   */
  const getRandomPosition = (): [number, number] => {
    return [Math.floor(Math.random() * 4), Math.floor(Math.random() * 4)];
  };


  /**
   * Генерация значения 2 в случайной свободной ячейки
   * @param matrix
   */
  const generateRandom = (matrix: Matrix) => {
    // Если матрица заполнена, вернем ее не генерируя новое значение
    if (!hasFreeCell(matrix)) return matrix;
    // Генерируем случайную позицию в матрице, пока не найдем пустую
    let [x, y] = getRandomPosition();
    while (matrix[x][y] !== 0) {
      [x, y] = getRandomPosition();
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
  const compress = (matrix: Matrix) => {
    const newMatrix = emptyMatrix();
    for (let i = 0; i < matrix.length; i++) {
      let columnIndex = 0;
      for (let j = 0; j < matrix[i].length; j++) {
        if (matrix[i][j] !== 0) {
          newMatrix[i][columnIndex] = matrix[i][j];
          columnIndex++;
        }
      }
    }
    return newMatrix;
  };


  /**
   * Слияние равных значений.
   * Суммирует равные значения в левую сторону и оставляет одну ячейку свободной
   * @param matrix
   */
  const merge = (matrix: Matrix) => {
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
  const moveLeft = (matrix: Matrix) => {
    // сжатие -> слияние -> сжатие
    return compress(merge(compress(matrix)));
  };


  /**
   * Разворот матрицы на 180 градусов
   * @param matrix
   */
  const rotateMatrix180Degrees = (matrix: Matrix) => {
    const reverseMatrix = emptyMatrix();
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
  const moveRight = (matrix: Matrix) => {
    // разворачиваем на 180 -> сдвигаем влево -> разворачиваем обратно
    return rotateMatrix180Degrees(moveLeft(rotateMatrix180Degrees(matrix)));
  };


  /**
   * Разворот матрицы на 90 градусов влево
   * @param matrix
   */
  const rotateMatrix90DegreesToLeft = (matrix: Matrix) => {
    const rotateMatrix = emptyMatrix();
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
  const rotateMatrix90DegreesToRight = (matrix: Matrix) => {
    const rotateMatrix = emptyMatrix();
    for (let i = 0; i < matrix.length; i++) {
      for (let j = 0; j < matrix[i].length; j++) {
        rotateMatrix[i][j] = matrix[matrix[i].length - 1 - j][j];
      }
    }
    return rotateMatrix;
  };


  /**
   * Перемещение всех значений матрицы вверх
   * @param matrix
   */
  const moveUp = (matrix: Matrix) => {
    // разворачиваем на 90 градусов влево -> сдвигаем влево -> разворачиваем на 90 градусов вправо
    return rotateMatrix90DegreesToRight(moveLeft(rotateMatrix90DegreesToLeft(matrix)));
  };


  /**
   * Перемещение всех значений матрицы вниз
   * @param matrix
   */
  const moveDown = (matrix: Matrix) => {
    // разворачиваем на 90 градусов вправо -> сдвигаем влево -> разворачиваем на 90 градусов влево
    return rotateMatrix90DegreesToLeft(moveLeft(rotateMatrix90DegreesToRight(matrix)));
  };


  /**
   * Проверить набор значения 2048
   * @param matrix
   */
  const checkWin = (matrix: Matrix) => {
    return hasValue(matrix, 2048);
  };


  /**
   * Сравнить две матрицы
   * @param prevMatrix
   * @param nextMatrix
   */
  const notSame = (prevMatrix: Matrix, nextMatrix: Matrix) => {
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
  const isTheEndGame = (matrix: Matrix) => {
    // Сверяем две матрицы, текущую и если ее смести в одну из сторон
    if (notSame(matrix, moveLeft(matrix))) return false;
    if (notSame(matrix, moveRight(matrix))) return false;
    if (notSame(matrix, moveUp(matrix))) return false;
    if (notSame(matrix, moveRight(matrix))) return false;
    return true;
  };


  /**
   * Проверка состояния игры.
   * Не кончилась ли она или может мы победили?
   */
  const checkState = (matrix: Matrix) => {
    if (checkWin(matrix)) console.log('Win');
    if (isTheEndGame(matrix)) console.log('End');
  };



  const [matrix, setMatrix] = useState<Matrix>(generateRandom(emptyMatrix()));


  /**
   * Функции действий
   */
  const left = (matrix: Matrix) => {
    console.log('left');
    const newMatrix = moveLeft(matrix);
    checkState(newMatrix);
    return generateRandom(newMatrix);
  };
  const right = (matrix: Matrix) => {
    console.log('right');
    const newMatrix = moveRight(matrix);
    checkState(newMatrix);
    return generateRandom(newMatrix);
  };
  const up = (matrix: Matrix) => {
    console.log('up');
    const newMatrix = moveUp(matrix);
    checkState(newMatrix);
    return generateRandom(newMatrix);
  };
  const down = (matrix: Matrix) => {
    console.log('down');
    const newMatrix = moveDown(matrix);
    checkState(newMatrix);
    return generateRandom(newMatrix);
  };


  /**
   * Обработчик события нажатия стрелочных кнопок клавиатуры
   * @param event
   */
  const handlePressKey = (event: KeyboardEvent) => {
    if (event.key === 'ArrowLeft') setMatrix(left(matrix));
    if (event.key === 'ArrowRight') setMatrix(right(matrix));
    if (event.key === 'ArrowUp') setMatrix(up(matrix));
    if (event.key === 'ArrowDown') setMatrix(down(matrix));
  }


  useEffect(() => {
    // TODO: В будущем повесить на элемент DOM
    window.addEventListener('keydown', handlePressKey);
    return () => window.removeEventListener('keydown', handlePressKey);
  });


  return (
    <div className="app">
      <div className="control-panel">
        <button
          className="button-start"
          // disabled={!gameEnd}
          // onClick={handleStart}
        >
          Старт
        </button>
      </div>
        <div className="playing-field">
          {matrix.map((row, index) => (
            <div key={'row-' + index} className="row">
              {row.map((cell, index) => {
                const style = cell > 0
                  ? 'cell-2 cell'
                  : 'cell'
                return (
                  <div key={'cell-' + index} className={style}>
                    {cell}
                  </div>
                )
              })}
            </div>
          ))}
        </div>
      <div className="control-panel">
        <button className="button-direction" onClick={() => setMatrix(up(matrix))}>Up</button>
        <button className="button-direction" onClick={() => setMatrix(down(matrix))}>Down</button>
        <button className="button-direction" onClick={() => setMatrix(left(matrix))}>Left</button>
        <button className="button-direction" onClick={() => setMatrix(right(matrix))}>Right</button>
      </div>
    </div>
  );
}

export default App;
