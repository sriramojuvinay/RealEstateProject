import React, { useEffect, useState } from "react";
import { getPaymentHistory } from "../services/api";
import api from "../services/api";
import "./PaymentHistoryModal.css";

const PaymentHistoryModal = ({ agreementId, onClose }) => {
  const [payments, setPayments] = useState([]);

  useEffect(() => {
  const fetchPayments = async () => {
    const data = await getPaymentHistory(agreementId);
    setPayments(data);
  };

  fetchPayments();
}, [agreementId]);

  const fetchPayments = async () => {
    const data = await getPaymentHistory(agreementId);
    setPayments(data);
  };

  const markPaid = async (id) => {
    await api.post(`/rentpayment/pay/${id}`);
    fetchPayments();
  };

  return (
    <div className="modal-overlay">
      <div className="modal">
        <h3>Payment History</h3>

        <table>
          <thead>
            <tr>
              <th>Month</th>
              <th>Status</th>
              <th>Amount</th>
              <th>Action</th>
            </tr>
          </thead>

          <tbody>
            {payments.map((p) => (
              <tr key={p.id}>
                <td>{p.month}/{p.year}</td>

                <td>
                  <span className={p.isPaid ? "paid" : "pending"}>
                    {p.isPaid ? "Paid" : "Pending"}
                  </span>
                </td>

                <td>₹{p.amount}</td>

                <td>
                  {!p.isPaid && (
                    <button onClick={() => markPaid(p.id)}>
                      Mark Paid
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        <button className="close-btn" onClick={onClose}>
          Close
        </button>
      </div>
    </div>
  );
};

export default PaymentHistoryModal;