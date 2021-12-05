import {render, waitFor} from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import '@testing-library/jest-dom';
import {screen} from '@testing-library/react';
import {rest} from 'msw';
import {setupServer} from 'msw/node';

import Search from '../Search';

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

test('Enter Search', async () => {
  render(<Search/>);
  const textField = screen.getByPlaceholderText('Search Marketplace');
  userEvent.type(textField, 'search');
  await waitFor(() => expect(mockHistoryPush)
    .toHaveBeenCalledWith('/2?category=2&search=search'));
});
