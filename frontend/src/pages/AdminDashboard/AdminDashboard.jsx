import { useEffect, useState } from "react";
import axios from "axios";
import "./Admin.css";

const AdminDashboard = () => {
  const [data, setData] = useState({});

  useEffect(() => {
    axios.get("http://localhost:4000/api/admin/stats")
      .then(res => setData(res.data));
  }, []);

  return (
    <div className="admin">
      <h2>📊 Dashboard</h2>

      <div className="card">
        <h3>Total Orders</h3>
        <p>{data.totalOrders}</p>
      </div>

      <div className="card">
        <h3>Total Revenue</h3>
        <p>₹{data.revenue}</p>
      </div>
    </div>
  );
};

export default AdminDashboard;