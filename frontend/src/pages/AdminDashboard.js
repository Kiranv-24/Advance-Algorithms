import React, { useState, useEffect, useCallback } from 'react';
import { Box, Typography, Paper, Grid, Table, TableBody, TableCell, TableHead, TableRow, Rating, Button } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { productService } from '../services/api';

const AdminDashboard = () => {
  const [stats, setStats] = useState({
    totalProducts: 0,
    totalReviews: 0,
    products: [],
    recentReviews: []
  });

  const navigate = useNavigate();

  const handleViewDetails = (productId) => {
    navigate(`/product/${productId}`);
  };

  const fetchDashboardStats = useCallback(async () => {
    try {
      const productsResponse = await productService.getAllProducts();
      const products = productsResponse.data;

      const reviewsResponse = await fetch('http://localhost:5000/api/reviews', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      const reviewsData = await reviewsResponse.json();

      const productsWithStats = products.map(product => {
        const productReviews = reviewsData.filter(review => review.product_id === product.id);
        const totalRating = productReviews.reduce((sum, review) => sum + review.rating, 0);
        const averageRating = productReviews.length > 0 ? totalRating / productReviews.length : 0;
        
        return {
          ...product,
          reviewCount: productReviews.length,
          averageRating
        };
      });

      setStats({
        totalProducts: products.length,
        totalReviews: reviewsData.length,
        products: productsWithStats,
        recentReviews: reviewsData.sort((a, b) => 
          new Date(b.created_at) - new Date(a.created_at)
        ).slice(0, 10)
      });

    } catch (error) {
      console.error('Error fetching dashboard stats:', error);
    }
  }, []);

  useEffect(() => {
    fetchDashboardStats();
  }, [fetchDashboardStats]);

  return (
    <div className="min-h-screen bg-[#F5F5F5] p-8" style={{ backgroundColor: '#E8E8E8 ' }}>
      <div className="max-w-7xl mx-auto">
      <Typography 
        variant="h3" 
        className="text-[#0056D2] font-bold mb-8 macondo-regular"
        style={{ fontFamily: 'Macondo, serif' }}
        >
        Admin Dashboard
      </Typography>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          <Paper elevation={4} className="bg-gradient-to-br from-[#0056D2] to-[#66C0F4] rounded-xl shadow-xl p-6 text-white hover:scale-105 transition-all duration-300">
            <Typography variant="body2" className="text-white font-semibold mb-2">Total Products</Typography>
            <Typography variant="h4" className="font-bold text-white">{stats.totalProducts}</Typography>
          </Paper>
          <Paper elevation={4} className="bg-gradient-to-br from-[#6BAED6] to-[#0056D2] rounded-xl shadow-xl p-6 text-white hover:scale-105 transition-all duration-300">
            <Typography variant="body2" className="text-white font-semibold mb-2">Total Reviews</Typography>
            <Typography variant="h4" className="font-bold text-white">{stats.totalReviews}</Typography>
          </Paper>
        </div>

        {/* Products Table */}
        <div className="bg-white rounded-xl shadow-xl mb-8 overflow-hidden">
          <div className="p-6 border-b border-gray-100">
            <Typography variant="h6" className="text-[#333333] font-semibold">Product Statistics</Typography>
          </div>
          <div className="overflow-x-auto">
            <Table className="w-full table-auto">
              <TableHead className="bg-[#D3D3D3]">
                <TableRow>
                  <TableCell className="px-6 py-4 text-left text-sm font-semibold text-[#333333]">Product Name</TableCell>
                  <TableCell className="px-6 py-4 text-left text-sm font-semibold text-[#333333]">Reviews</TableCell>
                  <TableCell className="px-6 py-4 text-left text-sm font-semibold text-[#333333]">Rating</TableCell>
                  <TableCell className="px-6 py-4 text-left text-sm font-semibold text-[#333333]">Price</TableCell>
                  <TableCell className="px-6 py-4 text-left text-sm font-semibold text-[#333333]">Action</TableCell>
                </TableRow>
              </TableHead>
              <TableBody className="divide-y divide-gray-200">
                {stats.products.map((product) => (
                  <TableRow key={product.id} className="hover:bg-gray-50 transition-colors duration-200">
                    <TableCell className="px-6 py-4 text-sm text-[#333333]">{product.name}</TableCell>
                    <TableCell className="px-6 py-4 text-sm text-gray-600">{product.reviewCount}</TableCell>
                    <TableCell className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <Rating value={product.averageRating} precision={0.1} readOnly size="small" />
                        <Typography variant="body2" className="text-gray-600">({product.averageRating.toFixed(1)})</Typography>
                      </div>
                    </TableCell>
                    <TableCell className="px-6 py-4 text-sm text-gray-600">₹{product.price}</TableCell>
                    <TableCell className="px-6 py-4">
                    <button
                      onClick={() => handleViewDetails(product.id)}
                      className="bg-white text-[#0056D2] hover:text-white hover:bg-[#1E90FF] px-4 py-2 rounded-lg text-sm font-semibold backdrop-blur-sm transition-all duration-300 border border-gray-200 hover:border-white/40 hover:scale-105"
                    >
                      View Details
                    </button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </div>

        {/* Recent Reviews */}
        <div className="bg-white rounded-xl shadow-xl overflow-hidden">
          <div className="p-6 border-b border-gray-100">
            <Typography variant="h6" className="text-[#333333] font-semibold">Recent Reviews</Typography>
          </div>
          <div className="overflow-x-auto">
            <Table className="w-full table-auto">
              <TableHead className="bg-[#D3D3D3]">
                <TableRow>
                  <TableCell className="px-6 py-4 text-left text-sm font-semibold text-[#333333]">Product</TableCell>
                  <TableCell className="px-6 py-4 text-left text-sm font-semibold text-[#333333]">Rating</TableCell>
                  <TableCell className="px-6 py-4 text-left text-sm font-semibold text-[#333333]">Feedback</TableCell>
                  <TableCell className="px-6 py-4 text-left text-sm font-semibold text-[#333333]">Date</TableCell>
                </TableRow>
              </TableHead>
              <TableBody className="divide-y divide-gray-200">
                {stats.recentReviews.map((review) => (
                  <TableRow key={review.id} className="hover:bg-gray-50 transition-colors duration-200">
                    <TableCell className="px-6 py-4 text-sm text-[#333333]">{review.product_name}</TableCell>
                    <TableCell className="px-6 py-4">
                      <Rating value={review.rating} readOnly size="small" />
                    </TableCell>
                    <TableCell className="px-6 py-4 text-sm text-gray-600">{review.feedback}</TableCell>
                    <TableCell className="px-6 py-4 text-sm text-gray-600">
                      {new Date(review.created_at).toLocaleDateString()}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
