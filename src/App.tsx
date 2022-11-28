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
function App() {
  return <div className='App'></div>;
}

export default App;
