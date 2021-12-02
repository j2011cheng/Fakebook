import {render, fireEvent, waitFor, within} from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import '@testing-library/jest-dom';
import {screen} from '@testing-library/react';
import {rest} from 'msw';
import {setupServer} from 'msw/node';

import Filters from '../Filters';

const URL = '/v0/filters';

const server = setupServer(
  rest.get(URL, (req, res, ctx) => {
    return res(
      ctx.json([
        {
          name: 'price',
          type: 'range',
        },
        {
          name: 'electric',
          type: 'bool',
        },
        {
          name: 'os',
          type: 'enum',
          options: ['windows', 'mac'],
        },
        {
          name: 'type',
          type: 'enum',
          options: ['magic', 'normal'],
        },
      ]),
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
    pathname: '/',
    search: '?category=2&type=magic',
  }),
}));

beforeAll(() => server.listen());
afterEach(() => server.resetHandlers());
afterAll(() => server.close());

test('Component renders', async () => {
  render(<Filters/>);
  await waitFor(() => screen.getByText('price:'));
  screen.getByText('electric:');
  screen.getByText('os:');
});

test('Range filter is interactable', async () => {
  render(<Filters/>);
  await waitFor(() => screen.getByText('price:'));
  const entry = screen.getAllByRole('textbox')[0];
  userEvent.type(entry, '2');
  await waitFor(() => expect(mockHistoryPush)
    .toHaveBeenCalledWith('/?category=2&type=magic&MINprice=2'));
});

test('Bool filter is interactable', async () => {
  render(<Filters/>);
  await waitFor(() => screen.getByText('price:'));
  const button = screen.getByRole('checkbox');
  fireEvent.click(button);
  await waitFor(() => expect(mockHistoryPush)
    .toHaveBeenCalledWith('/?category=2&type=magic&electric=true'));
});

test('Enum filter is interactable', async () => {
  render(<Filters/>);
  await waitFor(() => screen.getByText('price:'));
  const menu = screen.getAllByRole('button')[0];
  fireEvent.mouseDown(menu);
  await waitFor(() => screen.getByRole('listbox'));
  const menuItem = screen.getByText('mac');
  fireEvent.click(menuItem);
  await waitFor(() => expect(mockHistoryPush)
    .toHaveBeenCalledWith('/?category=2&type=magic&os=mac'));
});

test('Removing data from component', async () => {
  render(<Filters/>);
  await waitFor(() => screen.getByText('price:'));
  const entry = screen.getAllByRole('textbox')[0];
  userEvent.type(entry, '2');
  await waitFor(() => expect(mockHistoryPush)
    .toHaveBeenCalledWith('/?category=2&type=magic&MINprice=2'));
  userEvent.type(entry, '{backspace}');
  await waitFor(() => expect(mockHistoryPush)
    .toHaveBeenCalledWith('/?category=2&type=magic'));
});

test('Not Found', async () => {
  server.use(
    rest.get(URL, (req, res, ctx) => {
      return res(ctx.status(404));
    }),
  );
  jest.spyOn(window, 'alert').mockImplementation(() => {});
  render(<Filters/>);
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
  render(<Filters/>);
  await waitFor(() => expect(alert)
    .toHaveBeenCalledWith('Filters Server Error'));
});
