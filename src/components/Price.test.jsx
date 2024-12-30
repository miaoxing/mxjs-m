import Price from './Price';
import {render} from '@testing-library/react';

describe('Price', () => {
  test('basic', () => {
    const {container} = render(<Price>1.1</Price>);
    expect(container).toMatchSnapshot();
  });

  test('int', () => {
    const {container} = render(<Price>12</Price>);
    expect(container).toMatchSnapshot();
  });

  test('float', () => {
    const {container} = render(<Price>{12.2}</Price>);
    expect(container).toMatchSnapshot();
  });
});
