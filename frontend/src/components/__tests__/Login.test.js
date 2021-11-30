import {render, fireEvent} from '@testing-library/react';
import userEvent from '@testing-library/user-event'
import '@testing-library/jest-dom';
import {screen, waitFor} from '@testing-library/react';
import {rest} from 'msw'
import {setupServer} from 'msw/node'

import Login from '../Login';

const URL = '/v0/login'

const server = setupServer(
  rest.get(URL, (req, res, ctx) => {
    return res(ctx.json({message: 'Hello CSE183'}))
  }),
)

beforeAll(() => server.listen());
afterEach(() => server.resetHandlers());
afterAll(() => server.close());

test('Correct Accessibility', () => {
  render(<Login />);
  const email = screen.getByPlaceholderText('Email', {exact: false});
  const password = screen.getByPlaceholderText('Password', {exact: false});
  const button = screen.getByRole('button');
  expect(email).toHaveProperty('placeholder', 'Email or Phone Number');
  expect(password).toHaveProperty('placeholder', 'Password');
  expect(button).toHaveAttribute('disabled');
});

test('Login with Email and password', () => {
  render(<Login />);
  const email = screen.queryByPlaceholderText('Email', {exact: false});
  const password = screen.queryByPlaceholderText('Password', {exact: false});
  const button = screen.queryByRole('button');
  userEvent.type(email, 'dev@dev.dev');
  userEvent.type(password, 'dev');
  fireEvent.click(button);
});
