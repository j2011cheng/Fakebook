import {render, fireEvent} from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import '@testing-library/jest-dom';
import {screen} from '@testing-library/react';

import FilterDialogButton from '../FilterDialogButton';

const mockHistoryPush = jest.fn();
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useHistory: () => ({
    push: mockHistoryPush,
  }),
  useLocation: () => ({
    pathname: '/',
    search: '?category=2&type=magic',
  }),
}));

test('Open component', () => {
  render(<FilterDialogButton/>);
  const button = screen.getByRole('button');
  fireEvent.click(button);
  screen.getByRole('button');
});

test('Close component', () => {
  render(<FilterDialogButton/>);
  const open = screen.getByRole('button');
  fireEvent.click(open);
  userEvent.keyboard('{esc}');
});
