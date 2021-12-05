import {render, fireEvent, waitFor} from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import '@testing-library/jest-dom';
import {screen} from '@testing-library/react';
import {rest} from 'msw';
import {setupServer} from 'msw/node';

import SideBarTopContent from '../SideBarTopContent';

const URL = '/v0/authenticate';

const server = setupServer(
  rest.post(URL, (req, res, ctx) => {
    return res(
      ctx.json({key: 'value'}),
    );
  }),
);

const mockHistoryPush = jest.fn();
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useHistory: () => ({
    push: mockHistoryPush,
  }),
  useLocation: () => ({
    pathname: '/2',
    search: '?category=2',
  }),
}));

beforeAll(() => server.listen());
afterEach(() => server.resetHandlers());
afterAll(() => server.close());

test('Enter search', async () => {
  render(<SideBarTopContent/>);
  const textField = screen.getByPlaceholderText('Search Marketplace');
  userEvent.type(textField, 'search');
  const search = screen.getByRole('button', {name: ''});
  fireEvent.click(search);
  await waitFor(() => expect(mockHistoryPush)
    .toHaveBeenCalledWith('/2?category=2&search=search'));
});

test('Reset search', async () => {
  render(<SideBarTopContent/>);
  const search = screen.getByRole('button', {name: ''});
  fireEvent.click(search);
  await waitFor(() => expect(mockHistoryPush)
    .toHaveBeenCalledWith('/2?category=2'));
});
