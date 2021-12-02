import {render, fireEvent, waitFor} from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import '@testing-library/jest-dom';
import {screen} from '@testing-library/react';
import {rest} from 'msw';
import {setupServer} from 'msw/node';
import {setNarrow} from './common';

import NewUser from '../NewUser';

const URL = '/v0/newuser';

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
  render(<NewUser/>);
  const name = screen.getByPlaceholderText('Name');
  const email = screen.getByPlaceholderText('Email');
  const phone = screen.getByPlaceholderText('Phone Number');
  const password = screen.getByPlaceholderText('Password');
  const button = screen.getByRole('button');
});

test('Mobile Test', async () => {
  render(<NewUser/>);
  setNarrow();
  const name = screen.getByPlaceholderText('Name');
  const email = screen.getByPlaceholderText('Email');
  const phone = screen.getByPlaceholderText('Phone Number');
  const password = screen.getByPlaceholderText('Password');
  const button = screen.getByRole('button');
});

test('Create User with Name, Email, and Password', async () => {
  render(<NewUser/>);
  const name = screen.getByPlaceholderText('Name');
  const email = screen.getByPlaceholderText('Email');
  const phone = screen.getByPlaceholderText('Phone Number');
  const password = screen.getByPlaceholderText('Password');
  const button = screen.getByRole('button');
  userEvent.type(name, 'dev');
  userEvent.type(email, 'new@dev.dev');
  userEvent.type(password, 'dev');
  fireEvent.click(button);
  await waitFor(() => expect(mockHistoryPush).toHaveBeenCalledWith('/'));
});

test('Create User already Exists', async () => {
  server.use(
    rest.post(URL, (req, res, ctx) => {
      return res(ctx.status(409));
    }),
  );
  jest.spyOn(window, 'alert').mockImplementation(() => {});
  render(<NewUser/>);
  const name = screen.getByPlaceholderText('Name');
  const email = screen.getByPlaceholderText('Email');
  const phone = screen.getByPlaceholderText('Phone Number');
  const password = screen.getByPlaceholderText('Password');
  const button = screen.getByRole('button');
  userEvent.type(name, 'dev');
  userEvent.type(email, 'dev@dev.dev');
  userEvent.type(password, 'dev');
  fireEvent.click(button);
  await waitFor(() => expect(alert)
    .toHaveBeenCalledWith('User already exists'));
});

test('New User Server Error', async () => {
  server.use(
    rest.post(URL, (req, res, ctx) => {
      return res(ctx.status(500));
    }),
  );
  jest.spyOn(window, 'alert').mockImplementation(() => {});
  render(<NewUser/>);
  const name = screen.getByPlaceholderText('Name');
  const email = screen.getByPlaceholderText('Email');
  const phone = screen.getByPlaceholderText('Phone Number');
  const password = screen.getByPlaceholderText('Password');
  const button = screen.getByRole('button');
  userEvent.type(name, 'dev');
  userEvent.type(email, 'new@dev.dev');
  userEvent.type(password, 'dev');
  fireEvent.click(button);
  await waitFor(() => expect(alert)
    .toHaveBeenCalledWith('Server Error'));
});

test('Click Login', async () => {
  render(<NewUser/>);
  const button = screen.queryByRole('link');
  fireEvent.click(button);
  await waitFor(() => expect(mockHistoryPush).toHaveBeenCalledWith('/login'));
});
