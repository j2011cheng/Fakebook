import {render, waitFor} from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import '@testing-library/jest-dom';
import {screen} from '@testing-library/react';

import Distance from '../Distance';

const mockGeolocation = {
  watchPosition: () => {},
};
navigator.geolocation = mockGeolocation;
const mockHistoryPush = jest.fn();
const mockLocation = {
  pathname: '/',
  search: '',
};
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useHistory: () => ({
    push: mockHistoryPush,
  }),
  useLocation: () => (mockLocation),
}));

beforeEach(() => {
  mockLocation.search = '';
});

test('Render Distance', () => {
  render(<Distance/>);
});

test('Enter Distance', async () => {
  jest.spyOn(navigator.geolocation, 'watchPosition')
    .mockImplementation((a, b, c) => {
      a({
        coords: {
          latitude: 51.1,
          longitude: 45.3,
        }});
      return 1;
    });
  render(<Distance/>);
  const entry = screen.getByRole('textbox');
  userEvent.type(entry, '1');
  await waitFor(() => expect(navigator.geolocation.watchPosition)
    .toHaveBeenCalledTimes(1));
  await waitFor(() => expect(mockHistoryPush)
    .toHaveBeenCalledWith('/?distance=1&lat=51.1&long=45.3'));
});

test('Error', async () => {
  jest.spyOn(console, 'warn').mockImplementation(() => {});
  jest.spyOn(navigator.geolocation, 'watchPosition')
    .mockImplementation((a, b, c) => {
      b({code: 1, message: 'err'});
      return 1;
    });
  render(<Distance/>);
  const entry = screen.getByRole('textbox');
  userEvent.type(entry, '1');
  await waitFor(() => expect(console.warn)
    .toHaveBeenCalledWith('Location error (1): err'));
});

test('Remove Distance', async () => {
  render(<Distance/>);
  const entry = screen.getByRole('textbox');
  userEvent.type(entry, '1');
  userEvent.type(entry, '{backspace}');
  await waitFor(() => expect(mockHistoryPush)
    .toHaveBeenCalledWith('/?'));
});

test('Focus, unfocus, focus', () => {
  jest.spyOn(navigator.geolocation, 'watchPosition')
    .mockImplementation((a, b, c) => {
      a({
        coords: {
          latitude: 51.1,
          longitude: 45.3,
        }});
      return 1;
    });
  render(<Distance/>);
  const entry = screen.getByRole('textbox');
  entry.focus();
  entry.blur();
  entry.focus();
});

test('Default location', async () => {
  mockLocation.search = '?lat=1&long=2';
  jest.spyOn(navigator.geolocation, 'watchPosition')
    .mockImplementation((a, b, c) => {
      a({
        coords: {
          latitude: 51.1,
          longitude: 45.3,
        }});
      return 1;
    });
  render(<Distance/>);
  const entry = screen.getByRole('textbox');
  entry.focus();
});
