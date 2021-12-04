import {render, fireEvent, waitFor} from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import '@testing-library/jest-dom';
import {screen} from '@testing-library/react';
import {rest} from 'msw';
import {setupServer} from 'msw/node';

import NewListing from '../NewListing';

const URL1 = '/v0/categories';
const URL2 = '/v0/filters';
const URL3 = '/v0/listing';

const server = setupServer(
  rest.get(URL1, (req, res, ctx) => {
    return res(ctx.json([
      {
        id: '1',
        name: 'vehicles'
      }
    ]));
  }),
  rest.get(URL2, (req, res, ctx) => {
    return res(
      ctx.json([
        {
          name: 'price',
          type: 'range',
        },
        {
          name: 'rangefilter',
          type: 'range',
        },
        {
          name: 'emptyrangefilter',
          type: 'range',
        },
        {
          name: 'boolfilter',
          type: 'bool',
        },
        {
          name: 'enumfilter',
          type: 'enum',
          options: ['op1', 'op2'],
        },
      ]),
    );
  }),
  rest.post(URL3, (req, res, ctx) => {
    return res(ctx.status(201));
  }),
);

const mockHistoryPush = jest.fn();
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useHistory: () => ({
    push: mockHistoryPush,
  }),
}));

beforeEach(() => {
  localStorage.removeItem('user');
  localStorage.setItem('user', JSON.stringify({
    owner: {
      name: 'dev',
      id: 'a',
    },
    accessToken: '10',
  }));
})
beforeAll(() => server.listen());
afterEach(() => server.resetHandlers());
afterAll(() => server.close());

test('NewListing Renders', async () => {
  render(<NewListing/>);
  await waitFor(() => screen.getByText('Create'));
});

test('Post Listing', async () => {
  render(<NewListing/>);
  await waitFor(() => screen.getAllByText('Category'));
  const category = await screen.getAllByRole('button')[0];
  fireEvent.mouseDown(category);
  await waitFor(() => screen.getByText('vehicles'));
  let menuItem = screen.getByText('vehicles');
  fireEvent.click(menuItem);
  const name = await screen.getByPlaceholderText('Name');
  userEvent.type(name, 'listing name');
  const price = await screen.getByPlaceholderText('0.00');
  userEvent.type(price, '10.00');
  const rangefilter = await screen.getByPlaceholderText('rangefilter');
  userEvent.type(rangefilter, '2');
  const emptyrangefilter = await screen.getByPlaceholderText('emptyrangefilter');
  userEvent.type(emptyrangefilter, '2{Backspace}');
  const boolfilter = screen.getByRole('checkbox');
  fireEvent.click(boolfilter);
  const enumfilter = screen.getAllByRole('button')[1];
  fireEvent.mouseDown(enumfilter);
  await waitFor(() => screen.getByRole('listbox'));
  menuItem = screen.getByText('op2');
  fireEvent.click(menuItem);
  const desc = await screen.getByPlaceholderText('Description');
  userEvent.type(desc, 'listing description');
  const images = await screen.getAllByRole('textbox')[2];
  userEvent.type(images, 'img1{Enter}img2');
  const create = screen.getByText('Create');
  fireEvent.click(create);
});

test('Cancel Listing', async () => {
  render(<NewListing/>);
  const cancel = screen.getByText('Cancel');
  fireEvent.click(cancel);
  await waitFor(() => expect(mockHistoryPush)
    .toHaveBeenCalledWith('/'));
});

test('Post Bad Listing', async () => {
  server.use(
    rest.post(URL3, (req, res, ctx) => {
      return res(ctx.status(400));
    }),
  );
  jest.spyOn(window, 'alert').mockImplementation(() => {});
  render(<NewListing/>);
  const create = screen.getByText('Create');
  fireEvent.click(create);
  await waitFor(() => expect(alert)
    .toHaveBeenCalledWith('Bad Listing'));
});

test('Post Listing Server Error', async () => {
  server.use(
    rest.post(URL3, (req, res, ctx) => {
      return res(ctx.status(500));
    }),
  );
  jest.spyOn(window, 'alert').mockImplementation(() => {});
  render(<NewListing/>);
  const create = screen.getByText('Create');
  fireEvent.click(create);
  await waitFor(() => expect(alert)
    .toHaveBeenCalledWith('New Listing Server Error'));
});

test('Post Listing Bad Filters', async () => {
  server.use(
    rest.get(URL2, (req, res, ctx) => {
      return res(ctx.status(404));
    }),
  );
  jest.spyOn(window, 'alert').mockImplementation(() => {});
  render(<NewListing/>);
  await waitFor(() => screen.getAllByText('Category'));
  const category = await screen.getAllByRole('button')[0];
  fireEvent.mouseDown(category);
  await waitFor(() => screen.getByText('vehicles'));
  await waitFor(() => expect(alert)
    .toHaveBeenCalledWith('Category does not exist'));
});

test('Post Listing Filters Server Error', async () => {
  server.use(
    rest.get(URL2, (req, res, ctx) => {
      return res(ctx.status(500));
    }),
  );
  jest.spyOn(window, 'alert').mockImplementation(() => {});
  render(<NewListing/>);
  await waitFor(() => screen.getAllByText('Category'));
  const category = await screen.getAllByRole('button')[0];
  fireEvent.mouseDown(category);
  await waitFor(() => screen.getByText('vehicles'));
  await waitFor(() => expect(alert)
    .toHaveBeenCalledWith('Filters Server Error'));
});

test('Post Listing Bad Category', async () => {
  server.use(
    rest.get(URL1, (req, res, ctx) => {
      return res(ctx.status(404));
    }),
  );
  jest.spyOn(window, 'alert').mockImplementation(() => {});
  render(<NewListing/>);
  await waitFor(() => screen.getAllByText('Category'));
  await waitFor(() => expect(alert)
    .toHaveBeenCalledWith('Categories Not Found'));
});

test('Post Listing Category Server Error', async () => {
  server.use(
    rest.get(URL1, (req, res, ctx) => {
      return res(ctx.status(500));
    }),
  );
  jest.spyOn(window, 'alert').mockImplementation(() => {});
  render(<NewListing/>);
  await waitFor(() => screen.getAllByText('Category'));
  await waitFor(() => expect(alert)
    .toHaveBeenCalledWith('Categories Server Error'));
});
