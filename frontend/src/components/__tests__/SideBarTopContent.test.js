import {render, fireEvent, waitFor} from '@testing-library/react';
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

test('Components are there', () => {
  render(<SideBarTopContent/>);
});

test('New Listing Button', async () => {
  localStorage.setItem('user', 'user');
  render(<SideBarTopContent/>);
  await waitFor(() => screen.getByText('+ Create New Listing'));
  fireEvent.click(screen.getByText('+ Create New Listing'));
  await waitFor(() =>
    expect(mockHistoryPush).toHaveBeenCalledWith('/newlisting'));
});
