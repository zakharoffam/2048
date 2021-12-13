import React, { useEffect, useState } from 'react';
import './App.css';
import { GameLogicClass, GameStatuses, Matrix } from "./GameLogic.class";


const Cell = (props: { value: number }) => {
  return (
    <div className={`cell cell-${props.value}`}>
      {props.value > 0 ? props.value : 0}
    </div>
  )
}


function App() {
  const [matrix, updateMatrix] = useState<Matrix>(GameLogicClass.emptyMatrix());
  const [gameStatus, setGameStatus] = useState<GameStatuses>(GameStatuses.IDLE);
  const [step, setStep] = useState<number>(0);

  /**
   * Обработчик события нажатия стрелочных кнопок клавиатуры
   * @param event
   */
  const handlePressKey = (event: KeyboardEvent) => {
    if (gameStatus === GameStatuses.PROCESSING) {
      if (event.key === 'ArrowLeft') {
        updateMatrix(GameLogicClass.left(matrix));
        setStep(step + 1);
      }
      if (event.key === 'ArrowRight') {
        updateMatrix(GameLogicClass.right(matrix));
        setStep(step + 1);
      }
      if (event.key === 'ArrowUp') {
        updateMatrix(GameLogicClass.up(matrix));
        setStep(step + 1);
      }
      if (event.key === 'ArrowDown') {
        updateMatrix(GameLogicClass.down(matrix));
        setStep(step + 1);
      }
    }
  }


  // Отслеживаем нажатия клавиш на клавиатуре
  useEffect(() => {
    window.addEventListener('keydown', handlePressKey);
    return () => window.removeEventListener('keydown', handlePressKey);
  });


  // Проверка статуса игры при каждом изменении матрицы
  useEffect(() => {
    setGameStatus(GameLogicClass.checkState(matrix));
  }, [matrix]);


  return (
    <div className="app">
      <div className="control-panel">
        <button
          className="button-start"
          disabled={gameStatus === GameStatuses.PROCESSING}
          onClick={() => {
            updateMatrix(GameLogicClass.generateRandom(GameLogicClass.emptyMatrix()));
            setGameStatus(GameStatuses.PROCESSING);
          }}
        >
          Старт
        </button>
        <button
          className="button-start"
          disabled={gameStatus !== GameStatuses.PROCESSING}
          onClick={() => {
            updateMatrix(GameLogicClass.generateRandom(GameLogicClass.emptyMatrix()));
            setGameStatus(GameStatuses.PROCESSING);
          }}
        >
          Заново
        </button>
      </div>
      {gameStatus === GameStatuses.WIN && <h3>Победа!</h3>}
      {gameStatus === GameStatuses.END && <h3>Проиграл!</h3>}
      {gameStatus === GameStatuses.PROCESSING && (
        <div>
          <div className="playing-field">
            {matrix?.map((row, index) => (
              <div key={`row-${index}`} className="row">
                {row.map((cell, index) => <Cell key={`cell-${index}`} value={cell} />)}
              </div>
            ))}
          </div>
          <div className="control-panel">
            <p>Шаг №{step}</p>
            <button className="button-direction" onClick={() => updateMatrix(GameLogicClass.up(matrix))}>Up</button>
            <button className="button-direction" onClick={() => updateMatrix(GameLogicClass.down(matrix))}>Down</button>
            <button className="button-direction" onClick={() => updateMatrix(GameLogicClass.left(matrix))}>Left</button>
            <button className="button-direction" onClick={() => updateMatrix(GameLogicClass.right(matrix))}>Right</button>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
