import {render} from '@testing-library/react';
import '@testing-library/jest-dom';
import {screen} from '@testing-library/react';

import {setNarrow, setWide} from './common.js';
import {getOnlyVisible} from './common.js';
import SideBar from '../SideBar';

const mockHistoryPush = jest.fn();
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useHistory: () => ({
    push: mockHistoryPush,
  }),
  useLocation: () => ({
    search: '?category=2',
  }),
}));

test('Correct Accessibility', () => {
  render(<SideBar/>);
  screen.getByPlaceholderText('Search Marketplace');
  // getOnlyVisible('+ Create New Listing');
  getOnlyVisible('Categories');
});

test('Set mobile view', () => {
  render(<SideBar/>);
  setNarrow();
  screen.getByPlaceholderText('Search Marketplace');
  // getOnlyVisible('+ Create New Listing');
  getOnlyVisible('Categories');
});

test('Set mobile view then desktop view', () => {
  render(<SideBar/>);
  setNarrow();
  setWide();
  screen.getByPlaceholderText('Search Marketplace');
  // getOnlyVisible('+ Create New Listing');
  getOnlyVisible('Categories');
});

// expect(screen.queryByText('+ Create New Listing')).not.toBeDefined();
//   getClickable('+ Create New Listing');
