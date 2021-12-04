import {render, fireEvent, waitFor} from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import '@testing-library/jest-dom';
import {screen} from '@testing-library/react';
import {rest} from 'msw';
import {setupServer} from 'msw/node';

import Responses from '../Responses';

const URL1 = '/v0/response/2';
const URL2 = '/v0/response/2';

const server = setupServer(
  rest.get(URL1, (req, res, ctx) => {
    return res(
      ctx.json(['message1', 'message2']),
    );
  }),
  rest.post(URL2, (req, res, ctx) => {
    return res(ctx.status(201));
  }),
);

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useLocation: () => ({
    search: '?listing=2',
  }),
}));

beforeEach(() => {
  server.use(
    rest.get(URL1, (req, res, ctx) => {
      return res(
        ctx.json(['message1', 'message2']),
      );
    }),
    rest.post(URL2, (req, res, ctx) => {
      return res(ctx.status(201));
    }),
  );
  localStorage.setItem('user', JSON.stringify({
    owner: {
      name: 'dev',
      id: '2',
    },
    accessToken: '10',
  }));
});
beforeAll(() => server.listen());
afterEach(() => server.resetHandlers());
afterAll(() => server.close());

test('Response is there', async () => {
  render(<Responses/>);
  await waitFor(() => screen.getByText('Respond'));
});

test('Responses no login', async () => {
  localStorage.removeItem('user');
  render(<Responses/>);
});

test('Responses are there', async () => {
  render(<Responses/>);
  await waitFor(() => screen.getByText('message1'));
});

test('Submit Response', async () => {
  render(<Responses/>);
  await waitFor(() => screen.getByText('Respond'));
  const text = screen.getByPlaceholderText('Response');
  const button = screen.getByText('Respond');
  userEvent.type(text, 'Response text');
  fireEvent.click(button);
  await waitFor(() =>
    expect(screen.getByPlaceholderText('Response').value).toBe(''));
});

test('Response Not Found', async () => {
  server.use(
    rest.get(URL1, (req, res, ctx) => {
      return res(ctx.status(404));
    }),
  );
  jest.spyOn(window, 'alert').mockImplementation(() => {});
  render(<Responses/>);
});

test('Response Server Error', async () => {
  server.use(
    rest.get(URL1, (req, res, ctx) => {
      return res(ctx.status(500));
    }),
  );
  jest.spyOn(window, 'alert').mockImplementation(() => {});
  render(<Responses/>);
  await waitFor(() => expect(alert)
    .toHaveBeenCalledWith('Responses Server Error'));
});

test('Submit Response No Login', async () => {
  server.use(
    rest.post(URL1, (req, res, ctx) => {
      return res(ctx.status(401));
    }),
  );
  jest.spyOn(window, 'alert').mockImplementation(() => {});
  render(<Responses/>);
  await waitFor(() => screen.getByText('Respond'));
  const text = screen.getByPlaceholderText('Response');
  const button = screen.getByText('Respond');
  userEvent.type(text, 'Response');
  fireEvent.click(button);
  await waitFor(() => expect(alert)
    .toHaveBeenCalledWith('Login session expired'));
});

test('Submit Response Server Error', async () => {
  server.use(
    rest.post(URL2, (req, res, ctx) => {
      return res(ctx.status(500));
    }),
  );
  jest.spyOn(window, 'alert').mockImplementation(() => {});
  render(<Responses/>);
  await waitFor(() => screen.getByText('Respond'));
  const text = screen.getByPlaceholderText('Response');
  const button = screen.getByText('Respond');
  userEvent.type(text, 'Response');
  fireEvent.click(button);
  await waitFor(() => expect(alert)
    .toHaveBeenCalledWith('New Response Server Error'));
});
