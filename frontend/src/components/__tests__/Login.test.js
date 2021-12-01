import {render, fireEvent, waitFor} from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import '@testing-library/jest-dom';
import {screen} from '@testing-library/react'; // , waitFor
import {rest} from 'msw';
import {setupServer} from 'msw/node';

import Login from '../Login';

const URL = '/v0/authenticate';

const server = setupServer(
  rest.post(URL, (req, res, ctx) => {
    return res(
      ctx.json({key: 'value'}),
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
}));

beforeAll(() => server.listen());
afterEach(() => server.resetHandlers());
afterAll(() => server.close());

test('Correct Accessibility', () => {
  render(<Login/>);
  const email = screen.getByPlaceholderText('Email or Phone Number');
  const password = screen.getByPlaceholderText('Password');
  const button = screen.getByRole('button');
});

test('Login with Email and Password', async () => {
  render(<Login/>);
  const email = screen.queryByPlaceholderText('Email or Phone Number');
  const password = screen.queryByPlaceholderText('Password');
  const button = screen.queryByRole('button');
  userEvent.type(email, 'dev@dev.dev');
  userEvent.type(password, 'dev');
  fireEvent.click(button);
  await waitFor(() => expect(mockHistoryPush).toHaveBeenCalledWith('/'));
});

test('Login with Email and Bad Password', async () => {
  server.use(
    rest.post(URL, (req, res, ctx) => {
      return res(ctx.status(401));
    }),
  );
  jest.spyOn(window, 'alert').mockImplementation(() => {});
  render(<Login/>);
  const email = screen.queryByPlaceholderText('Email or Phone Number');
  const password = screen.queryByPlaceholderText('Password');
  const button = screen.queryByRole('button');
  userEvent.type(email, 'dev@dev.dev');
  userEvent.type(password, 'd');
  fireEvent.click(button);
  await waitFor(() => expect(alert)
    .toHaveBeenCalledWith('Invalid login credentials'));
});

test('Login Server Error', async () => {
  server.use(
    rest.post(URL, (req, res, ctx) => {
      return res(ctx.status(500));
    }),
  );
  jest.spyOn(window, 'alert').mockImplementation(() => {});
  render(<Login/>);
  const email = screen.queryByPlaceholderText('Email or Phone Number');
  const password = screen.queryByPlaceholderText('Password');
  const button = screen.queryByRole('button');
  userEvent.type(email, 'dev@dev.dev');
  userEvent.type(password, 'd');
  fireEvent.click(button);
  await waitFor(() => expect(alert)
    .toHaveBeenCalledWith('Server Error'));
});

test('Click New User', async () => {
  render(<Login/>);
  const button = screen.queryByRole('link');
  fireEvent.click(button);
  await waitFor(() => expect(mockHistoryPush).toHaveBeenCalledWith('/newuser'));
})
