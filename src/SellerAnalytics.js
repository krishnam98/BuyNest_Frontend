import React, { useState, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Bar,
  YAxis,
  XAxis,
} from "recharts";
import { TrendingUp, Package, ShoppingCart, DollarSign } from "lucide-react";
import { toast } from "react-toastify";
import Header from "./Header";
import "./SellerAnalytics.css";
import { FaRupeeSign } from "react-icons/fa";

const SellerAnalytics = () => {
  const navigate = useNavigate();
  const [fetching, setFetching] = useState(false);
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/login");
      return;
    }

    const fetchSellerProducts = async () => {
      try {
        setFetching(true);
        const resp = await fetch(
          "http://localhost:8080/api/getSellerProducts",
          {
            method: "GET",
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        if (resp.status === 401) {
          localStorage.removeItem("token");
          toast.error("Logged Out!");
          navigate("/login");
          return;
        }

        if (!resp.ok) throw new Error("Failed to fetch products");

        const respJson = await resp.json();
        setProducts(respJson);
        setFetching(false);
      } catch (error) {
        toast.error("Something went wrong fetching products!");
        setFetching(false);
      }
    };

    const fetchSellerOrders = async () => {
      try {
        const resp = await fetch(
          "http://localhost:8080/order/getSellerOrders",
          {
            method: "GET",
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        if (resp.status === 401) {
          localStorage.removeItem("token");
          toast.error("Logged Out!");
          navigate("/login");
          setFetching(false);
          return;
        }

        if (!resp.ok) throw new Error("Failed to fetch orders");

        const jsonResp = await resp.json();
        setOrders(jsonResp);
        setFetching(false);
      } catch (error) {
        toast.error("Something went wrong fetching orders!");
        setFetching(false);
      }
    };

    fetchSellerProducts();
    fetchSellerOrders();
  }, [navigate]);

  // Calculate analytics data
  const analyticsData = useMemo(() => {
    const categoryStats = {};
    const validProducts = products.filter((p) => !p.deleted);

    // Initialize category stats
    validProducts.forEach((product) => {
      if (!categoryStats[product.category]) {
        categoryStats[product.category] = {
          category: product.category,
          totalProducts: 0,
          totalSales: 0,
          totalRevenue: 0,
          soldQuantity: 0,
          productOrderStats: {},
        };
      }
      categoryStats[product.category].totalProducts += 1;

      // Initialize product order stats
      if (!categoryStats[product.category].productOrderStats[product.name]) {
        categoryStats[product.category].productOrderStats[product.name] = {
          productName: product.name,
          ordersCount: 0,
          quantitySold: 0,
        };
      }
    });

    // Calculate sales data from orders
    orders.forEach((order) => {
      const product = order.productDTO;
      if (product && !product.deleted && categoryStats[product.category]) {
        categoryStats[product.category].totalSales += 1;
        categoryStats[product.category].soldQuantity += order.quantity;
        categoryStats[product.category].totalRevenue +=
          product.price * order.quantity;

        // Update product-specific order stats
        if (categoryStats[product.category].productOrderStats[product.name]) {
          categoryStats[product.category].productOrderStats[
            product.name
          ].ordersCount += 1;
          categoryStats[product.category].productOrderStats[
            product.name
          ].quantitySold += order.quantity;
        }
      }
    });

    return Object.values(categoryStats);
  }, [products, orders]);

  // Prepare individual category pie chart data
  const getCategoryPieData = (categoryData) => {
    const productStats = Object.values(categoryData.productOrderStats);
    const totalOrders = productStats.reduce(
      (sum, product) => sum + product.ordersCount,
      0
    );

    if (totalOrders === 0) {
      return productStats.map((product) => ({
        name: product.productName,
        value: 0,
        percentage: 0,
        ordersCount: 0,
      }));
    }

    return productStats.map((product) => ({
      name: product.productName,
      value: product.ordersCount,
      percentage: ((product.ordersCount / totalOrders) * 100).toFixed(1),
      ordersCount: product.ordersCount,
    }));
  };

  // Colors for charts
  const COLORS = [
    "#0088FE",
    "#00C49F",
    "#FFBB28",
    "#FF8042",
    "#8884D8",
    "#82CA9D",
    "#FFC0CB",
    "#20B2AA",
    "#FF6347",
    "#9370DB",
    "#32CD32",
    "#FFD700",
  ];

  // Custom label function for pie chart
  const renderLabel = ({ cx, cy, midAngle, outerRadius, percent }) => {
    if (percent <= 0) return null;

    const RADIAN = Math.PI / 180;
    const radius = outerRadius + 50;
    const x = cx + radius * Math.cos(-midAngle * RADIAN);
    const y = cy + radius * Math.sin(-midAngle * RADIAN);

    const percentage = (percent * 100).toFixed(0);

    return (
      <g transform={`translate(${x}, ${y}) scale(0.6)`}>
        <text
          x={0}
          y={0}
          fill="#333"
          textAnchor="middle"
          dominantBaseline="central"
          fontSize={14} // base size before scaling
        >
          {percentage}%
        </text>
      </g>
    );
  };

  // Calculate totals for summary cards
  const totalProducts = products.filter((p) => !p.deleted).length;
  const totalOrders = orders.filter((p) => !p.productDTO.deleted).length;
  const totalRevenue = analyticsData.reduce(
    (sum, cat) => sum + cat.totalRevenue,
    0
  );
  const totalQuantitySold = analyticsData.reduce(
    (sum, cat) => sum + cat.soldQuantity,
    0
  );

  if (fetching) {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
        <div className="loading-text">Loading analytics...</div>
      </div>
    );
  }

  if (products.length === 0 && orders.length === 0 && !fetching) {
    return (
      <div className="empty-state">
        <div className="empty-content">
          <Package className="empty-icon" />
          <h2 className="empty-title">No Data Available</h2>
          <p className="empty-description">
            Add products and receive orders to view analytics
          </p>
        </div>
      </div>
    );
  }

  return (
    <>
      <Header />
      <div className="analytics-container">
        <div className="analytics-wrapper">
          <h1 className="analytics-title">Seller Analytics Dashboard</h1>

          {/* Summary Cards */}
          <div className="summary-cards">
            <div className="summary-card">
              <div className="card-content1">
                <Package className="card-icon blue" />
                <div className="card-details">
                  <p className="card-label">Total Products</p>
                  <p className="card-value">{totalProducts}</p>
                </div>
              </div>
            </div>

            <div className="summary-card">
              <div className="card-content1">
                <ShoppingCart className="card-icon green" />
                <div className="card-details">
                  <p className="card-label">Total Orders</p>
                  <p className="card-value">{totalOrders}</p>
                </div>
              </div>
            </div>

            <div className="summary-card">
              <div className="card-content1">
                <FaRupeeSign className="card-icon yellow" />
                <div className="card-details">
                  <p className="card-label">Total Revenue</p>
                  <p className="card-value">₹{totalRevenue.toLocaleString()}</p>
                </div>
              </div>
            </div>

            <div className="summary-card">
              <div className="card-content1">
                <TrendingUp className="card-icon purple" />
                <div className="card-details">
                  <p className="card-label">Items Sold</p>
                  <p className="card-value">{totalQuantitySold}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Individual Category Pie Charts */}
          <div className="category-charts-section">
            <h2 className="section-title">
              Product Order Distribution by Category
            </h2>
            <div className="category-charts-grid">
              {analyticsData.map((categoryData, index) => {
                const pieData = getCategoryPieData(categoryData);
                const hasOrders = pieData.some((item) => item.value > 0);

                return (
                  <div key={index} className="category-chart-card">
                    <h3 className="category-chart-title">
                      {categoryData.category}
                    </h3>
                    <div className="category-chart-stats">
                      <span className="stat-item">
                        Products: {categoryData.totalProducts}
                      </span>
                      <span className="stat-item">
                        Orders: {categoryData.totalSales}
                      </span>
                    </div>

                    {hasOrders ? (
                      <div className="chart-container">
                        <ResponsiveContainer width="100%" height={250}>
                          <PieChart>
                            <Pie
                              data={pieData}
                              cx="50%"
                              cy="50%"
                              labelLine={false}
                              label={renderLabel}
                              outerRadius={80}
                              fill="#8884d8"
                              dataKey="value"
                            >
                              {pieData.map((entry, idx) => (
                                <Cell
                                  key={`cell-${idx}`}
                                  fill={COLORS[idx % COLORS.length]}
                                />
                              ))}
                            </Pie>
                            <Tooltip
                              formatter={(value, name) => [
                                `${value} orders`,
                                name,
                              ]}
                            />
                            <Legend />
                          </PieChart>
                        </ResponsiveContainer>
                      </div>
                    ) : (
                      <div className="no-orders-message">
                        <p>No orders received for this category yet</p>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Detailed Category Table */}
          <div className="chart-card full-width">
            <h2 className="chart-title">Category Analytics Details</h2>
            <div className="table-container">
              <table className="analytics-table">
                <thead>
                  <tr>
                    <th>Category</th>
                    <th>Total Products</th>
                    <th>Orders</th>
                    <th>Quantity Sold</th>
                    <th>Revenue</th>
                    <th>Sales Rate</th>
                  </tr>
                </thead>
                <tbody>
                  {analyticsData.map((category, index) => (
                    <tr key={index}>
                      <td className="category-cell">{category.category}</td>
                      <td>{category.totalProducts}</td>
                      <td>{category.totalSales}</td>
                      <td>{category.soldQuantity}</td>
                      <td>₹{category.totalRevenue.toLocaleString()}</td>
                      <td>
                        {category.totalProducts > 0
                          ? `${(
                              (category.totalSales / category.totalProducts) *
                              100
                            ).toFixed(1)}%`
                          : "0%"}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default SellerAnalytics;
