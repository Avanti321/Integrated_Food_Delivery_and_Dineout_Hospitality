import axios from "axios";
import "./PaymentButton.css";

const PaymentButton = ({ amount }) => {

  const handlePayment = async () => {
    const { data } = await axios.post(
      "http://localhost:4000/api/payment/create-order",
      { amount }
    );

    const options = {
      key: "YOUR_RAZORPAY_KEY",
      amount: data.amount,
      order_id: data.id,
      handler: function () {
        alert("✅ Payment Successful!");
      }
    };

    const rzp = new window.Razorpay(options);
    rzp.open();
  };

  return (
    <button className="pay-btn" onClick={handlePayment}>
      Pay ₹{amount}
    </button>
  );
};

export default PaymentButton;