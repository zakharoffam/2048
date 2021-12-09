import React, { useEffect, useState } from 'react';
import './App.css';
import { GameStatuses, Logical, Matrix } from "./Logical.class";


function App() {
  const action = new Logical();
  const [matrix, updateMatrix] = useState<Matrix>(action.emptyMatrix());
  const [gameStatus, setGameStatus] = useState<GameStatuses>(GameStatuses.IDLE);

  /**
   * Обработчик события нажатия стрелочных кнопок клавиатуры
   * @param event
   */
  const handlePressKey = (event: KeyboardEvent) => {
    if (gameStatus === GameStatuses.PROCESSING) {
      if (event.key === 'ArrowLeft') updateMatrix(action.left(matrix));
      if (event.key === 'ArrowRight') updateMatrix(action.right(matrix));
      if (event.key === 'ArrowUp') updateMatrix(action.up(matrix));
      if (event.key === 'ArrowDown') updateMatrix(action.down(matrix));
    }
  }


  useEffect(() => {
    // TODO: В будущем повесить на элемент DOM
    window.addEventListener('keydown', handlePressKey);
    return () => window.removeEventListener('keydown', handlePressKey);
  });


  useEffect(() => {
    setGameStatus(action.checkState(matrix));
  }, [matrix]);


  return (
    <div className="app">
      <div className="control-panel">
        <button
          className="button-start"
          disabled={gameStatus === GameStatuses.PROCESSING}
          onClick={() => {
            updateMatrix(action.generateRandom(action.emptyMatrix()));
            setGameStatus(GameStatuses.PROCESSING);
          }}
        >
          Старт
        </button>
        <button
          className="button-start"
          disabled={gameStatus !== GameStatuses.PROCESSING}
          onClick={() => {
            updateMatrix(action.generateRandom(action.emptyMatrix()));
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
            <button className="button-direction" onClick={() => updateMatrix(action.up(matrix))}>Up</button>
            <button className="button-direction" onClick={() => updateMatrix(action.down(matrix))}>Down</button>
            <button className="button-direction" onClick={() => updateMatrix(action.left(matrix))}>Left</button>
            <button className="button-direction" onClick={() => updateMatrix(action.right(matrix))}>Right</button>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
