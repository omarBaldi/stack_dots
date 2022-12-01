import React, { useEffect, useRef, useState } from 'react';
import './App.css';

/**
 *
 * @desc As soon as the user clicks anywhere in the window width
 * I want to retrieve the coordinates (x and y) and place a marker
 * in the exact same position clicked.
 *
 * The user will also be able to UNDO/REDO the operations made.
 *
 * If the UNDO button is clicked, the last dot will be removed
 * from the window view. The button will be disabled if there
 * are no more dots to remove.
 *
 * If the REDO button is instead clicked, all of the dots previously
 * removed (following point above) will be drawn again in the exact
 * same position as before. The button will be disabled if there
 * are no more removed dots to insert back again.
 */

type CoordinateType = {
  x: number;
  y: number;
};

function App() {
  const drawingAreaRef = useRef<HTMLDivElement>(null);
  const [coordinates, setCoordinates] = useState<{
    added: CoordinateType[];
    removed: CoordinateType[];
  }>({
    added: [],
    removed: [],
  });

  useEffect(() => {
    const drawCircle = ({ x, y }: MouseEvent) => {
      const newCoordinates = {
        x,
        y,
      };

      setCoordinates((prevCoordinates) => ({
        ...prevCoordinates,
        added: [...prevCoordinates.added, newCoordinates],
      }));
    };

    drawingAreaRef.current?.addEventListener('click', drawCircle);

    return () => {
      drawingAreaRef.current?.removeEventListener('click', drawCircle);
    };
  }, []);

  /**
   * * as soon as the array of coordinates added changes
   * * I know that the user has clicked in the web view
   * * to add a new circle
   */
  useEffect(() => {
    const lastCoordinatesAdded = coordinates.added.at(-1);
    if (typeof lastCoordinatesAdded === 'undefined') return;

    const { x, y } = lastCoordinatesAdded;

    //* if not undefined, then draw a circle element based on those
    const circleElement = document.createElement('div');
    circleElement.className = 'circle__area';
    circleElement.style.top = `${y}px`;
    circleElement.style.left = `${x}px`;

    drawingAreaRef.current?.appendChild(circleElement);
  }, [coordinates.added]);

  return (
    <div className='App'>
      <div
        className='drawing__area'
        ref={drawingAreaRef}
        style={{
          height: '100vh',
          width: '100%',
          border: '1px solid',
          cursor: 'pointer',
        }}
      />
      <div className='circle__area' data-x={100} data-y={100} />
    </div>
  );
}

export default App;
