import { useEffect, useState } from 'react';
import Router from 'next/router';
import useRequest from '../../hooks/use-request';

const OrderShow = ({ order }) => {
  const [timeLeft, setTimeLeft] = useState(0);
  const { doRequest, errors } = useRequest({
    url: '/api/payments',
    method: 'post',
    body: {
      orderId: order.id,
    },
    onSuccess: () => Router.push('/orders'),
  });

  useEffect(() => {
    const findTimeLeft = () => {
      const miliSecondLeft = new Date(order.expiresAt) - new Date();
      setTimeLeft(Math.round(miliSecondLeft / 1000));
    };

    findTimeLeft();
    const timerId = setInterval(findTimeLeft, 1000); // har yek sanie findTimeLeft run mishe, agar baraye findTimeLeft dar jolosh az () estefade mikardim dar vaghe migim ke in time ro farakhani kon va bad result ro bede ke ma inkaro nemikonim chon hamonja natije ro mikhaim

    return () => {
      clearInterval(timerId);
    };
  }, [order]);

  if (timeLeft < 0) {
    return <div>Order Expired</div>;
  }

  return (
    <div>
      Seconds left to order Expires: {timeLeft} seconds
      <button
        onClick={() => doRequest({ token: 'token' })}
        className="btn btn-primary"
      >
        Pay
      </button>
      {errors}
    </div>
  );
};

OrderShow.getInitialProps = async (context, client) => {
  const { orderId } = context.query;
  const { data } = await client.get(`/api/orders/${orderId}`);

  return { order: data }; //be onvane props midim be OrderShow
};

export default OrderShow;
