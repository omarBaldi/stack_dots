import { useEffect, useRef, useState } from 'react';
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
    const addNewCoordinates = ({ x, y }: MouseEvent) => {
      const newCoordinates = {
        x,
        y,
      };

      setCoordinates((prevCoordinates) => ({
        ...prevCoordinates,
        added: [...prevCoordinates.added, newCoordinates],
      }));
    };

    drawingAreaRef.current?.addEventListener('click', addNewCoordinates);

    return () => {
      /* Cleanup */
      drawingAreaRef.current?.removeEventListener('click', addNewCoordinates);
      setCoordinates({ added: [], removed: [] });
    };
  }, []);

  const createCircleElement = ({
    x,
    y,
  }: {
    x: number;
    y: number;
  }): HTMLDivElement => {
    const circleElement = document.createElement('div');
    circleElement.className = 'circle__area';
    circleElement.style.top = `${y}px`;
    circleElement.style.left = `${x}px`;

    return circleElement;
  };

  /**
   * * as soon as the array of coordinates added changes
   * * I know that the user has clicked in the web view
   * * to add a new circle
   */
  useEffect(() => {
    //* get the last coordinated added in array
    const lastCoordinatesAdded = coordinates.added.at(-1);
    if (typeof lastCoordinatesAdded === 'undefined') return;

    //* if not undefined, then draw a circle element based on those
    const newCircle = createCircleElement({ ...lastCoordinatesAdded });

    drawingAreaRef.current?.appendChild(newCircle);
  }, [coordinates.added]);

  useEffect(() => {
    const circlesElements: Element[] = [
      ...(drawingAreaRef.current?.children ?? []),
    ];
    const lastCircleElement: Element | undefined = circlesElements.at(-1);
    if (typeof lastCircleElement === 'undefined') return;

    //* otherwise remove last element from the DOM
    lastCircleElement.remove();
  }, [coordinates.removed]);

  /**
   *
   * @param {string} action
   * @desc remove_last_added ---> UNDO
   * @desc add_last_removed ---> REDO
   */
  const updateCoordinatesBasedOnAction = ({
    action,
  }: {
    action: 'remove_last_added' | 'add_last_removed';
  }) => {
    setCoordinates((prevCoordinates) => {
      //* using pop method will remove the coordinates
      //* previosuly added without changing the reference
      //* to the array and trigger the "useEffect update"
      const lastCoordinates: CoordinateType | undefined = (
        action === 'remove_last_added'
          ? prevCoordinates.added
          : prevCoordinates.removed
      ).pop();

      if (typeof lastCoordinates === 'undefined') {
        return prevCoordinates;
      }

      return {
        ...prevCoordinates,
        ...(action === 'remove_last_added'
          ? {
              removed: [...prevCoordinates.removed, lastCoordinates],
            }
          : {
              added: [...prevCoordinates.added, lastCoordinates],
            }),
      };
    });
  };

  const removeLastCircleDrawn = (): void => {
    updateCoordinatesBasedOnAction({ action: 'remove_last_added' });
  };

  const addLastRemovedCoordinates = (): void => {
    updateCoordinatesBasedOnAction({ action: 'add_last_removed' });
  };

  //? create button component

  return (
    <div className='App'>
      <div>
        <button
          disabled={coordinates.added.length <= 0}
          onClick={removeLastCircleDrawn}
        >
          Undo
        </button>
        <button
          disabled={coordinates.removed.length <= 0}
          onClick={addLastRemovedCoordinates}
        >
          Redo
        </button>
      </div>
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
