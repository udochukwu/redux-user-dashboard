import React from 'react';
import { render, screen, cleanup} from '@testing-library/react';
import { Provider } from 'react-redux';
import { store } from 'app/store';
import { Dashboard } from './dashboard';

describe('Dashboard', () => {
  beforeEach(() => {
    render(
      <Provider store={store}>
        <Dashboard />
      </Provider>
    );
  });
  afterEach(cleanup);

  it('Renders the correct texts while loading', () => {
    expect(screen.getByText(/User List/i)).toBeInTheDocument();
    expect(screen.getByTestId('loading-section')).toBeDefined();
  });

  it('Renders the correct texts after loading', async () => {
		await  new Promise((res) => setTimeout(res, 3000))
    expect(screen.getByText(/User List/i)).toBeInTheDocument();
    expect(screen.queryByTestId('loading-section')).toBeFalsy();
    expect(screen.getByText(/Leanne Graham/i)).toBeInTheDocument();
  });
});
