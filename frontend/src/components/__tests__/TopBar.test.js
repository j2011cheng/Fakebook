import {render, fireEvent, waitFor} from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import '@testing-library/jest-dom';
import {screen} from '@testing-library/react';
import {rest} from 'msw';
import {setupServer} from 'msw/node';
import {setNarrow} from './common.js';

import TopBar from '../TopBar';

const URL = '/v0/authenticate';

const server = setupServer(
  rest.post(URL, (req, res, ctx) => {
    return res(
      ctx.json({owner: {id: 'value'}}),
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
    search: '?',
    pathname: '/',
  }),
}));

beforeEach(() => localStorage.removeItem('user'));
beforeAll(() => server.listen());
afterEach(() => server.resetHandlers());
afterAll(() => server.close());

test('Correct Accessibility', async () => {
  render(<TopBar/>);
  await waitFor(() => screen.getByRole('button'));
  screen.getByPlaceholderText('Email or Phone Number');
  screen.getByPlaceholderText('Password');
  screen.getByRole('button');
});

test('TopBar with Email and Password', async () => {
  render(<TopBar/>);
  await waitFor(() => screen.getByRole('button'));
  const email = screen.getByPlaceholderText('Email or Phone Number');
  const password = screen.getByPlaceholderText('Password');
  const button = screen.getByRole('button');
  userEvent.type(email, 'dev@dev.dev');
  userEvent.type(password, 'dev');
  fireEvent.click(button);
  await waitFor(() => expect(mockHistoryPush).toHaveBeenCalledWith('/'));
  fireEvent.click(screen.getByText('Log Out'));
});

test('TopBar with Email and Bad Password', async () => {
  server.use(
    rest.post(URL, (req, res, ctx) => {
      return res(ctx.status(401));
    }),
  );
  jest.spyOn(window, 'alert').mockImplementation(() => {});
  render(<TopBar/>);
  await waitFor(() => screen.getByRole('button'));
  const email = screen.getByPlaceholderText('Email or Phone Number');
  const password = screen.getByPlaceholderText('Password');
  const button = screen.getByRole('button');
  userEvent.type(email, 'dev@dev.dev');
  userEvent.type(password, 'd');
  fireEvent.click(button);
  await waitFor(() => expect(alert)
    .toHaveBeenCalledWith('Invalid login credentials'));
});

test('TopBar Server Error', async () => {
  server.use(
    rest.post(URL, (req, res, ctx) => {
      return res(ctx.status(500));
    }),
  );
  jest.spyOn(window, 'alert').mockImplementation(() => {});
  render(<TopBar/>);
  await waitFor(() => screen.getByRole('button'));
  const email = screen.getByPlaceholderText('Email or Phone Number');
  const password = screen.getByPlaceholderText('Password');
  const button = screen.getByRole('button');
  userEvent.type(email, 'dev@dev.dev');
  userEvent.type(password, 'd');
  fireEvent.click(button);
  await waitFor(() => expect(alert)
    .toHaveBeenCalledWith('Server Error'));
});

test('TopBar Empty Form', async () => {
  render(<TopBar/>);
  await waitFor(() => screen.getByRole('button'));
  const button = screen.getByRole('button');
  fireEvent.click(button);
  await waitFor(() => expect(mockHistoryPush).toHaveBeenCalledWith('/login'));
});

test('TopBar My Listings', async () => {
  render(<TopBar/>);
  await waitFor(() => screen.getByRole('button'));
  const email = screen.getByPlaceholderText('Email or Phone Number');
  const password = screen.getByPlaceholderText('Password');
  const button = screen.getByRole('button');
  userEvent.type(email, 'dev@dev.dev');
  userEvent.type(password, 'dev');
  fireEvent.click(button);
  await waitFor(() => screen.getByText('My Listings'));
  const id = JSON.parse(localStorage.getItem('user')).owner.id;
  fireEvent.click(screen.getByText('My Listings'));
  await waitFor(() => expect(mockHistoryPush)
    .toHaveBeenCalledWith(`/?owner=${id}`));
});

test('TopBar Desktop Create Listing', async () => {
  localStorage.removeItem('user');
  localStorage.setItem('user', JSON.stringify({
    owner: {
      name: 'dev',
      id: 'a',
    },
    accessToken: '10',
  }));
  render(<TopBar/>);
  const newlisting = await waitFor(() =>
    screen.getByText('+ Create New Listing'));
  fireEvent.click(newlisting);
  await waitFor(() => expect(mockHistoryPush)
    .toHaveBeenCalledWith(`/newlisting`));
});

test('TopBar Mobile Menu', async () => {
  render(<TopBar/>);
  setNarrow();
  await waitFor(() => screen.getByRole('button'));
  const button = screen.getByRole('button');
  fireEvent.click(button);
  await waitFor(() => screen.getByText('Log In'));
  userEvent.type(button, '{esc}');
});

test('TopBar Mobile Log In', async () => {
  render(<TopBar/>);
  setNarrow();
  await waitFor(() => screen.getByRole('button'));
  const button = screen.getByRole('button');
  fireEvent.click(button);
  const login = await waitFor(() => screen.getByText('Log In'));
  fireEvent.click(login);
  await waitFor(() => expect(mockHistoryPush)
    .toHaveBeenCalledWith(`/login`));
});

test('TopBar Mobile Create Listing', async () => {
  localStorage.removeItem('user');
  localStorage.setItem('user', JSON.stringify({
    owner: {
      name: 'dev',
      id: 'a',
    },
    accessToken: '10',
  }));
  render(<TopBar/>);
  setNarrow();
  await waitFor(() => screen.getByRole('button'));
  const button = screen.getByRole('button');
  fireEvent.click(button);
  const newlisting = await waitFor(() =>
    screen.getByText('Create New Listing'));
  fireEvent.click(newlisting);
  await waitFor(() => expect(mockHistoryPush)
    .toHaveBeenCalledWith(`/newlisting`));
});

