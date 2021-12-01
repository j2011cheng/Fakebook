import {render, fireEvent, waitFor} from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import '@testing-library/jest-dom';
import {screen} from '@testing-library/react';
import {rest} from 'msw';
import {setupServer} from 'msw/node';

import SideBarTopContent from '../SideBarTopContent';

// const URL = '/v0/authenticate';

// const server = setupServer(
//   rest.post(URL, (req, res, ctx) => {
//     return res(
//       ctx.json({key: 'value'}),
//     );
//   }),
// );

test('Components are there', () => {
  render(<SideBarTopContent/>);
  const buttons = screen.getAllByRole('button');
  const textField = screen.getByPlaceholderText('Search Marketplace');
  expect(buttons[0]).toBeDefined();
  expect(buttons[1]).toBeDefined();
  expect(textField).toBeDefined();
})
