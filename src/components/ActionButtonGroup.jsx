import {ButtonGroup} from '@mxjs/m-button';
import FooterBar from '@mxjs/m-footer-bar';
import ButtonTheme from '@mxjs/m-button/ButtonTheme';
import PropTypes from 'prop-types';
import {Ret} from 'miaoxing';

/**
 * 商品操作按钮组
 */
const ActionButtonGroup = ({ret, action, onClick}) => {
  const {createCart, createOrder} = ret;
  const isSuc = Ret.isSuc(ret);

  const shortMessage = createCart.shortMessage || createOrder.shortMessage;

  const showCart = Ret.isSuc(createCart) && action !== 'createOrder';
  const showOrder = Ret.isSuc(createOrder) && action !== 'createCart';

  // 更新购物车暂无逻辑，直接展示即可
  if (action === 'updateCart') {
    return (
      <ButtonTheme>
        <FooterBar.Button variant="primary" onClick={onClick.bind(this, 'updateCart')}>
          确 定
        </FooterBar.Button>
      </ButtonTheme>
    );
  }

  return (
    <ButtonTheme>
      {isSuc && (
        <ButtonGroup>
          {showCart && (<FooterBar.Button variant="secondary" onClick={onClick.bind(this, 'createCart')}>
            加入购物车
          </FooterBar.Button>)}
          {showOrder && (<FooterBar.Button variant="primary" onClick={onClick.bind(this, 'createOrder')}>
            立即购买
          </FooterBar.Button>)}
        </ButtonGroup>
      )}
      {!isSuc && (
        <FooterBar.Button variant="primary" disabled>{shortMessage}</FooterBar.Button>
      )}
    </ButtonTheme>
  );
};

ActionButtonGroup.propTypes = {
  ret: PropTypes.object.isRequired,
  action: PropTypes.string,
  onClick: PropTypes.func,
};

export default ActionButtonGroup;
