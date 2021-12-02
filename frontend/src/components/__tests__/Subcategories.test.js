import {render, fireEvent, waitFor} from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import '@testing-library/jest-dom';
import {screen} from '@testing-library/react';
import {rest} from 'msw';
import {setupServer} from 'msw/node';

import Subcategories from '../Subcategories';

const URL = '/v0/category';

const server = setupServer(
  rest.get(URL, (req, res, ctx) => {
    return res(
      ctx.json({subcategories: [
        {
          name: 'Vehicles',
          id: 1,
        },
        {
          name: 'Electronics',
          id: 2,
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
    pathname: '/2'
  }),
}));

beforeAll(() => server.listen());
afterEach(() => server.resetHandlers());
afterAll(() => server.close());

test('List is There', async () => {
  render(<Subcategories/>);
  await waitFor(() => screen.getByText('Vehicles'));
});

test('Button is Clickable', async () => {
  render(<Subcategories/>);
  await waitFor(() => screen.getByText('Vehicles'));
  const button = screen.getByText('Vehicles');
  fireEvent.click(button);
  await waitFor(() => expect(mockHistoryPush).toHaveBeenCalledWith('/1'));
});

test('Not Found', async () => {
  server.use(
    rest.get(URL, (req, res, ctx) => {
      return res(ctx.status(404));
    }),
  );
  jest.spyOn(window, 'alert').mockImplementation(() => {});
  render(<Subcategories/>);
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
  render(<Subcategories/>);
  await waitFor(() => expect(alert)
    .toHaveBeenCalledWith('Subcategories Server Error'));
});
