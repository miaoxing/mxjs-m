import {Text} from '@fower/taro';
import PropTypes from 'prop-types';

const Price = ({children}) => {
  const price = children.toString();
  const [integer, decimal] = price.split('.');

  return (
    <Text textLg primary500>
      <Text textXs>￥</Text>
      {integer}
      {!!decimal && <Text textXs>.{decimal}</Text>}
    </Text>
  );
};

Price.propTypes = {
  children: PropTypes.oneOfType([PropTypes.string, PropTypes.number, PropTypes.object]),
};

export default Price;
