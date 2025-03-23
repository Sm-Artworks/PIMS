import React, { useState } from 'react';
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Calendar, Clock, Package, AlertTriangle, Pill, DollarSign, ShoppingCart, Users, Activity, Settings } from 'lucide-react';

const PharmacyDashboard = () => {
  // Sample data
  const salesData = [
    { name: 'Jan', sales: 4000 },
    { name: 'Feb', sales: 3000 },
    { name: 'Mar', sales: 5000 },
    { name: 'Apr', sales: 2780 },
    { name: 'May', sales: 1890 },
    { name: 'Jun', sales: 2390 },
  ];

  const expiringMeds = [
    { id: 1, name: 'Amoxicillin 500mg', stock: 145, expires: '15 days' },
    { id: 2, name: 'Metformin 850mg', stock: 78, expires: '22 days' },
    { id: 3, name: 'Lisinopril 10mg', stock: 56, expires: '30 days' },
  ];

  const lowStockMeds = [
    { id: 1, name: 'Atorvastatin 20mg', stock: 15, reorder: 25 },
    { id: 2, name: 'Hydrochlorothiazide', stock: 18, reorder: 30 },
    { id: 3, name: 'Albuterol Inhaler', stock: 8, reorder: 20 },
  ];

  const recentOrders = [
    { id: 'ORD-7829', supplier: 'MedSupply Inc.', status: 'Delivered', date: 'Today' },
    { id: 'ORD-7828', supplier: 'Pharma Wholesale', status: 'Shipped', date: 'Yesterday' },
    { id: 'ORD-7827', supplier: 'Global Meds', status: 'Processing', date: '3 days ago' },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Top Navigation */}
      <div className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <span className="text-indigo-600 text-lg font-semibold">MedTrack Pro</span>
            </div>
            <div className="flex items-center">
              <button className="p-1 rounded-full text-gray-400 hover:text-gray-500 focus:outline-none">
                <Settings size={20} />
              </button>
              <div className="ml-3 relative">
                <div className="flex items-center">
                  <div className="h-8 w-8 rounded-full bg-indigo-500 flex items-center justify-center text-white">
                    PM
                  </div>
                  <span className="ml-2 text-sm font-medium text-gray-700">Pharmacy Manager</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Sidebar */}
      <div className="flex h-screen pt-16">
        <div className="w-64 bg-white shadow-md fixed h-full">
          <nav className="mt-5 px-2">
            <a className="flex items-center px-4 py-3 text-sm font-medium text-indigo-600 bg-indigo-50 rounded-md mb-1">
              <Activity className="mr-3 h-5 w-5" />
              Dashboard
            </a>
            <a className="flex items-center px-4 py-3 text-sm font-medium text-gray-600 hover:bg-gray-50 rounded-md mb-1">
              <Pill className="mr-3 h-5 w-5" />
              Inventory
            </a>
            <a className="flex items-center px-4 py-3 text-sm font-medium text-gray-600 hover:bg-gray-50 rounded-md mb-1">
              <ShoppingCart className="mr-3 h-5 w-5" />
              Transactions
            </a>
            <a className="flex items-center px-4 py-3 text-sm font-medium text-gray-600 hover:bg-gray-50 rounded-md mb-1">
              <Package className="mr-3 h-5 w-5" />
              Orders
            </a>
            <a className="flex items-center px-4 py-3 text-sm font-medium text-gray-600 hover:bg-gray-50 rounded-md mb-1">
              <Users className="mr-3 h-5 w-5" />
              Suppliers
            </a>
            <a className="flex items-center px-4 py-3 text-sm font-medium text-gray-600 hover:bg-gray-50 rounded-md mb-1">
              <DollarSign className="mr-3 h-5 w-5" />
              Reports
            </a>
          </nav>
        </div>

        {/* Main Content */}
        <div className="flex-1 ml-64 p-8">
          <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>

          {/* Stats Overview */}
          <div className="mt-6 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
            <div className="bg-white overflow-hidden shadow rounded-lg">
              <div className="p-5">
                <div className="flex items-center">
                  <div className="flex-shrink-0 bg-indigo-500 rounded-md p-3">
                    <Pill className="h-6 w-6 text-white" />
                  </div>
                  <div className="ml-5">
                    <p className="text-sm font-medium text-gray-500">Total Medications</p>
                    <p className="text-3xl font-semibold text-gray-900">1,284</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white overflow-hidden shadow rounded-lg">
              <div className="p-5">
                <div className="flex items-center">
                  <div className="flex-shrink-0 bg-green-500 rounded-md p-3">
                    <DollarSign className="h-6 w-6 text-white" />
                  </div>
                  <div className="ml-5">
                    <p className="text-sm font-medium text-gray-500">Today's Sales</p>
                    <p className="text-3xl font-semibold text-gray-900">$2,156</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white overflow-hidden shadow rounded-lg">
              <div className="p-5">
                <div className="flex items-center">
                  <div className="flex-shrink-0 bg-yellow-500 rounded-md p-3">
                    <AlertTriangle className="h-6 w-6 text-white" />
                  </div>
                  <div className="ml-5">
                    <p className="text-sm font-medium text-gray-500">Expiring Soon</p>
                    <p className="text-3xl font-semibold text-gray-900">28</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white overflow-hidden shadow rounded-lg">
              <div className="p-5">
                <div className="flex items-center">
                  <div className="flex-shrink-0 bg-red-500 rounded-md p-3">
                    <Package className="h-6 w-6 text-white" />
                  </div>
                  <div className="ml-5">
                    <p className="text-sm font-medium text-gray-500">Low Stock</p>
                    <p className="text-3xl font-semibold text-gray-900">15</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Charts and Tables */}
          <div className="mt-8 grid grid-cols-1 gap-5 sm:grid-cols-2">
            <div className="bg-white overflow-hidden shadow rounded-lg">
              <div className="p-5">
                <h3 className="text-lg leading-6 font-medium text-gray-900">Sales Overview</h3>
                <div className="mt-2 h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      width={500}
                      height={300}
                      data={salesData}
                      margin={{
                        top: 5,
                        right: 30,
                        left: 20,
                        bottom: 5,
                      }}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis />
                      <Tooltip />
                      <Bar dataKey="sales" fill="#4f46e5" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>

            <div className="bg-white overflow-hidden shadow rounded-lg">
              <div className="p-5">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg leading-6 font-medium text-gray-900">Recent Orders</h3>
                  <a className="text-sm font-medium text-indigo-600 hover:text-indigo-500">View all</a>
                </div>
                <div className="mt-4">
                  <div className="flow-root">
                    <ul role="list" className="-my-5 divide-y divide-gray-200">
                      {recentOrders.map((order) => (
                        <li key={order.id} className="py-4">
                          <div className="flex items-center space-x-4">
                            <div className="flex-1 min-w-0">
                              <p className="text-sm font-medium text-gray-900 truncate">{order.id}</p>
                              <p className="text-sm text-gray-500 truncate">{order.supplier}</p>
                            </div>
                            <div className="inline-flex items-center text-base font-semibold">
                              <span className={`px-2 py-1 text-xs rounded-full ${
                                order.status === 'Delivered' ? 'bg-green-100 text-green-800' : 
                                order.status === 'Shipped' ? 'bg-blue-100 text-blue-800' : 
                                'bg-yellow-100 text-yellow-800'
                              }`}>
                                {order.status}
                              </span>
                            </div>
                            <div className="text-sm text-gray-500">{order.date}</div>
                          </div>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-8 grid grid-cols-1 gap-5 sm:grid-cols-2">
            <div className="bg-white overflow-hidden shadow rounded-lg">
              <div className="p-5">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg leading-6 font-medium text-gray-900">Expiring Medications</h3>
                  <a className="text-sm font-medium text-indigo-600 hover:text-indigo-500">View all</a>
                </div>
                <div className="mt-4">
                  <div className="flow-root">
                    <ul role="list" className="-my-5 divide-y divide-gray-200">
                      {expiringMeds.map((med) => (
                        <li key={med.id} className="py-4">
                          <div className="flex items-center space-x-4">
                            <div className="flex-1 min-w-0">
                              <p className="text-sm font-medium text-gray-900 truncate">{med.name}</p>
                              <p className="text-sm text-gray-500 truncate">Stock: {med.stock} units</p>
                            </div>
                            <div className="inline-flex items-center text-sm font-medium text-red-600">
                              Expires in {med.expires}
                            </div>
                          </div>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white overflow-hidden shadow rounded-lg">
              <div className="p-5">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg leading-6 font-medium text-gray-900">Low Stock Medications</h3>
                  <a className="text-sm font-medium text-indigo-600 hover:text-indigo-500">View all</a>
                </div>
                <div className="mt-4">
                  <div className="flow-root">
                    <ul role="list" className="-my-5 divide-y divide-gray-200">
                      {lowStockMeds.map((med) => (
                        <li key={med.id} className="py-4">
                          <div className="flex items-center space-x-4">
                            <div className="flex-1 min-w-0">
                              <p className="text-sm font-medium text-gray-900 truncate">{med.name}</p>
                              <p className="text-sm text-gray-500 truncate">Stock: {med.stock} units</p>
                            </div>
                            <div className="inline-flex items-center text-sm font-medium text-yellow-600">
                              Reorder point: {med.reorder}
                            </div>
                          </div>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PharmacyDashboard;
