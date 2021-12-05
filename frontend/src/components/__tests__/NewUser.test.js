import {render, fireEvent, waitFor} from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import '@testing-library/jest-dom';
import {screen} from '@testing-library/react';
import {rest} from 'msw';
import {setupServer} from 'msw/node';

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

test('Create User with Name, Email, and Password', async () => {
  render(<NewUser/>);
  const name = screen.getByPlaceholderText('Name');
  const button = screen.getByText('Continue');
  userEvent.type(name, 'dev');
  fireEvent.click(button);
  const email = screen.getByPlaceholderText('Email');
  userEvent.type(email, 'new@dev.dev');
  fireEvent.click(button);
  screen.getByPlaceholderText('Phone Number');
  fireEvent.click(button);
  const password = screen.getByPlaceholderText('Password');
  userEvent.type(password, 'dev');
  fireEvent.click(button);
  fireEvent.click(screen.getByText('Sign Up'));
  await waitFor(() => expect(mockHistoryPush).toHaveBeenCalledWith('/'));
});

test('Go Forth and Back', async () => {
  render(<NewUser/>);
  const forth = screen.getByText('Continue');
  fireEvent.click(forth);
  const back = screen.getByText('Back');
  fireEvent.click(back);
  screen.getByPlaceholderText('Email');
});

test('End of ranges', () => {
  render(<NewUser/>);
  let back = screen.getByText('Back');
  fireEvent.click(back);
  let forth = screen.getByText('Continue');
  fireEvent.click(forth);
  forth = screen.getByText('Continue');
  fireEvent.click(forth);
  forth = screen.getByText('Continue');
  fireEvent.click(forth);
  forth = screen.getByText('Continue');
  fireEvent.click(forth);
  forth = screen.getByText('Continue');
  fireEvent.click(forth);
  back = screen.getByText('Back');
  fireEvent.click(back);
})

test('Create User already Exists', async () => {
  server.use(
    rest.post(URL, (req, res, ctx) => {
      return res(ctx.status(409));
    }),
  );
  jest.spyOn(window, 'alert').mockImplementation(() => {});
  render(<NewUser/>);
  const name = screen.getByPlaceholderText('Name');
  const button = screen.getByText('Continue');
  userEvent.type(name, 'dev');
  fireEvent.click(button);
  const email = screen.getByPlaceholderText('Email');
  userEvent.type(email, 'new@dev.dev');
  fireEvent.click(button);
  screen.getByPlaceholderText('Phone Number');
  fireEvent.click(button);
  const password = screen.getByPlaceholderText('Password');
  userEvent.type(password, 'dev');
  fireEvent.click(button);
  fireEvent.click(screen.getByText('Sign Up'));
  await waitFor(() => expect(alert)
    .toHaveBeenCalledWith('User already exists'));
});

test('Create User Invalid Email', async () => {
  server.use(
    rest.post(URL, (req, res, ctx) => {
      return res(ctx.status(400));
    }),
  );
  jest.spyOn(window, 'alert').mockImplementation(() => {});
  render(<NewUser/>);
  const name = screen.getByPlaceholderText('Name');
  const button = screen.getByText('Continue');
  userEvent.type(name, 'dev');
  fireEvent.click(button);
  const email = screen.getByPlaceholderText('Email');
  userEvent.type(email, 'new@dev.dev');
  fireEvent.click(button);
  screen.getByPlaceholderText('Phone Number');
  fireEvent.click(button);
  const password = screen.getByPlaceholderText('Password');
  userEvent.type(password, 'dev');
  fireEvent.click(button);
  fireEvent.click(screen.getByText('Sign Up'));
  await waitFor(() => expect(alert)
    .toHaveBeenCalledWith('Must have a valid email'));
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
  const button = screen.getByText('Continue');
  userEvent.type(name, 'dev');
  fireEvent.click(button);
  const email = screen.getByPlaceholderText('Email');
  userEvent.type(email, 'new@dev.dev');
  fireEvent.click(button);
  screen.getByPlaceholderText('Phone Number');
  fireEvent.click(button);
  const password = screen.getByPlaceholderText('Password');
  userEvent.type(password, 'dev');
  fireEvent.click(button);
  fireEvent.click(screen.getByText('Sign Up'));
  await waitFor(() => expect(alert)
    .toHaveBeenCalledWith('Server Error'));
});

test('Click Login', async () => {
  render(<NewUser/>);
  const button = screen.getByText('Log In');
  fireEvent.click(button);
  await waitFor(() => expect(mockHistoryPush).toHaveBeenCalledWith('/login'));
});
