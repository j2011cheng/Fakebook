import {render, fireEvent, waitFor} from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import '@testing-library/jest-dom';
import {screen} from '@testing-library/react';
import {rest} from 'msw';
import {setupServer} from 'msw/node';

import ListingList from '../ListingList';

const URL = '/v0/listings';

const server = setupServer(
  rest.get(URL, (req, res, ctx) => {
    return res(
      ctx.json([{
        name: 'item',
        price: 1,
        id: 1,
        image: '',
      }]),
    );
  }),
);

// https://stackoverflow.com/questions/58524183/
// how-to-mock-history-push-with-the-new-react-router-hooks-using-jest/59451956
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

test('ImageList is there', async () => {
  jest.mock('react-router-dom', () => ({
    ...jest.requireActual('react-router-dom'),
    useHistory: () => ({
      push: mockHistoryPush,
    }),
    useLocation: () => ({
      pathname: '/2',
      search: '',
    }),
  }));
  render(<ListingList/>);
  screen.getByRole('list');
  await waitFor(() => screen.getByText('item'));
});

test('Image is clickable', async () => {
  render(<ListingList/>);
  await waitFor(() => screen.getByRole('button'));
  const button = screen.getByRole('button');
  fireEvent.click(button);
  await waitFor(() => {
    expect(mockHistoryPush).toHaveBeenCalledWith('/listing/1');
  });
});

test('Category does not exist', async () => {
  server.use(
    rest.get(URL, (req, res, ctx) => {
      return res(ctx.status(404));
    }),
  );
  jest.spyOn(window, 'alert').mockImplementation(() => {});
  render(<ListingList/>);
  await waitFor(() => expect(alert)
    .toHaveBeenCalledWith('Category does not exist'));
});

test('Server Error', async () => {
  server.use(
    rest.get(URL, (req, res, ctx) => {
      return res(ctx.status(500));
    }),
  );
  jest.spyOn(window, 'alert').mockImplementation(() => {});
  render(<ListingList/>);
  await waitFor(() => expect(alert)
    .toHaveBeenCalledWith('Listings Server Error'));
});
