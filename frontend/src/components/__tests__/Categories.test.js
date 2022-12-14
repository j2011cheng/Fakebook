import {render, fireEvent, waitFor} from '@testing-library/react';
import '@testing-library/jest-dom';
import {screen} from '@testing-library/react';
import {rest} from 'msw';
import {setupServer} from 'msw/node';

import Categories from '../Categories';

const URL = '/v0/category';

const server = setupServer(
  rest.get(URL, (req, res, ctx) => {
    return res(
      ctx.json({subcategories: [
        {
          name: 'Vehicles',
          id: '1',
        },
        {
          name: 'Electronics',
          id: '2',
        },
      ]}),
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
    search: '?category=2',
  }),
}));

beforeAll(() => server.listen());
afterEach(() => server.resetHandlers());
afterAll(() => server.close());

test('List is There', async () => {
  render(<Categories/>);
  await waitFor(() => screen.getByText('Vehicles'));
});

test('Button is Clickable', async () => {
  render(<Categories/>);
  await waitFor(() => screen.getByText('Vehicles'));
  const button = screen.getByText('Vehicles');
  fireEvent.click(button);
  await waitFor(() => expect(mockHistoryPush)
    .toHaveBeenCalledWith('/?category=1'));
});

test('Not Found', async () => {
  server.use(
    rest.get(URL, (req, res, ctx) => {
      return res(ctx.status(404));
    }),
  );
  jest.spyOn(window, 'alert').mockImplementation(() => {});
  render(<Categories/>);
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
  render(<Categories/>);
  await waitFor(() => expect(alert)
    .toHaveBeenCalledWith('Categories Server Error'));
});

test('Click category then click back', async () => {
  render(<Categories/>);
  await waitFor(() => screen.getByText('Electronics'));
  const button = screen.getByText('Electronics');
  fireEvent.click(button);
  await waitFor(() => expect(mockHistoryPush)
    .toHaveBeenCalledWith('/?'));
});
