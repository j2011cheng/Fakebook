import {render, fireEvent, waitFor} from '@testing-library/react';
import '@testing-library/jest-dom';
import {screen} from '@testing-library/react';
import {rest} from 'msw';
import {setupServer} from 'msw/node';

import Listing from '../Listing';

const URL1 = '/v0/listing/2';
const URL2 = '/v0/response/2';
const URL3 = '/v0/response/2';

const server = setupServer(
  rest.get(URL1, (req, res, ctx) => {
    return res(
      ctx.json({
        name: 'item',
        owner: {
          name: 'test',
          id: '1',
        },
        attributes: {
          'price': 1,
          '': 2,
        },
        id: '1',
        images: ['image1', 'image2'],
      }),
    );
  }),
  rest.get(URL2, (req, res, ctx) => {
    return res(
      ctx.json(['message1', 'message2']),
    );
  }),
  rest.post(URL3, (req, res, ctx) => {
    return res(ctx.status(201));
  }),
);

const mockHistoryPush = jest.fn();
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useLocation: () => ({
    search: '?listing=2',
  }),
  useHistory: () => ({
    push: mockHistoryPush,
  }),
}));

beforeEach(() => {
  server.use(
    rest.get(URL1, (req, res, ctx) => {
      return res(
        ctx.json({
          name: 'item',
          owner: {
            name: 'test',
            id: '1',
          },
          attributes: {
            'price': 1,
            '': 2,
          },
          id: '1',
          images: ['image1', 'image2'],
        }),
      );
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

test('Load listing', async () => {
  localStorage.removeItem('user');
  render(<Listing/>);
  await waitFor(() => screen.getAllByText('item'));
  screen.getByText('test');
  screen.getByText('price: 1');
});

test('Image Error', async () => {
  render(<Listing/>);
  await waitFor(() => screen.getAllByText('item'));
  const img = screen.getByRole('img');
  expect(img).toBeDefined();
  fireEvent(img, new Event('error'));
});

test('Change image', async () => {
  render(<Listing/>);
  await waitFor(() => screen.getByText('2'));
  const button = screen.getByText('2');
  fireEvent.click(button);
});

test('Listing does not exist', async () => {
  server.use(
    rest.get(URL1, (req, res, ctx) => {
      return res(ctx.status(404));
    }),
  );
  jest.spyOn(window, 'alert').mockImplementation(() => {});
  render(<Listing/>);
  await waitFor(() => expect(alert)
    .toHaveBeenCalledWith('Listing does not exist'));
});

test('Listing Server Error', async () => {
  server.use(
    rest.get(URL1, (req, res, ctx) => {
      return res(ctx.status(500));
    }),
  );
  jest.spyOn(window, 'alert').mockImplementation(() => {});
  render(<Listing/>);
  await waitFor(() => expect(alert)
    .toHaveBeenCalledWith('Listing Server Error'));
});

test('Close Listing', async () => {
  render(<Listing/>);
  await waitFor(() => screen.getByLabelText('close'));
  const button = screen.getByLabelText('close');
  fireEvent.click(button);
});
