import {act} from 'react-dom/test-utils';

/**
 * @param {number} width
 */
function setWidth(width) {
  global.innerWidth = width;
  act(() => {
    global.dispatchEvent(new Event('resize'));
  });
}
/**
 */
export function setNarrow() {
  setWidth(550);
}
