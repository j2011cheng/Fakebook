import {render, fireEvent, waitFor} from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import '@testing-library/jest-dom';
import {screen} from '@testing-library/react';
import {rest} from 'msw';
import {setupServer} from 'msw/node';

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

// beforeAll(() => server.listen());
// afterEach(() => server.resetHandlers());
// afterAll(() => server.close());

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
