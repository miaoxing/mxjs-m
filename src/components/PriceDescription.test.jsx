import PriceDescription from './PriceDescription';
import {render, waitFor, fireEvent} from '@testing-library/react';

describe('PriceDescription', () => {
  test('click', async () => {
    const {queryByText, findByText, getByText} = render(<PriceDescription/>);

    const linePrice = queryByText('划线价格：');
    expect(linePrice).toBeNull();

    const title = await findByText('商品价格说明');

    fireEvent.click(title);
    await waitFor(() => {
      expect(getByText('划线价格：')).not.toBeNull();
    });

    fireEvent.click(title);
    await waitFor(() => {
      expect(queryByText('划线价格：')).toBeNull();
    });
  });
});
