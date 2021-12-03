import {render, fireEvent, waitFor} from '@testing-library/react';
import '@testing-library/jest-dom';
import {screen} from '@testing-library/react';
import {rest} from 'msw';
import {setupServer} from 'msw/node';

import Listing from '../Listing';

const URL = '/v0/listing/2';

const server = setupServer(
  rest.get(URL, (req, res, ctx) => {
    return res(
      ctx.json({
        name: 'item',
        owner: {
          name: 'test',
        },
        attributes: {
          price: 1,
          '': 2,
        },
        id: 1,
        images: ['image1','image2'],
      }),
    );
  }),
);

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useLocation: () => ({
    search: '?listing=2',
  }),
}));

beforeAll(() => server.listen());
afterEach(() => server.resetHandlers());
afterAll(() => server.close());

test('Load listing', async () => {
  render(<Listing/>);
  await waitFor(() => screen.getAllByText('item'));
  screen.getByText('test');
  screen.getByText('price: 1');
});

test('Change image', async () => {
  render(<Listing/>);
  await waitFor(() => screen.getByText('2'));
  const button = screen.getByText('2');
  fireEvent.click(button);
});

test('Listing does not exist', async () => {
  server.use(
    rest.get(URL, (req, res, ctx) => {
      return res(ctx.status(404));
    }),
  );
  jest.spyOn(window, 'alert').mockImplementation(() => {});
  render(<Listing/>);
  await waitFor(() => expect(alert)
    .toHaveBeenCalledWith('Listing does not exist'));
});

test('Server Error', async () => {
  server.use(
    rest.get(URL, (req, res, ctx) => {
      return res(ctx.status(500));
    }),
  );
  jest.spyOn(window, 'alert').mockImplementation(() => {});
  render(<Listing/>);
  await waitFor(() => expect(alert)
    .toHaveBeenCalledWith('Listing Server Error'));
});
