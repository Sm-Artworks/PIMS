import React, { useState } from 'react';
import { Search, Filter, Plus, Trash2, Edit, AlertTriangle, Clock, Download, Printer } from 'lucide-react';

const InventoryManagement = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterOpen, setFilterOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  
  // Sample medication data
  const medications = [
    { id: 1, name: 'Amoxicillin 500mg', genericName: 'Amoxicillin', category: 'Antibiotics', 
      form: 'Capsule', stock: 145, price: 8.99, expirationDate: '2025-08-15', reorderLevel: 50, isLowStock: false },
    { id: 2, name: 'Metformin 850mg', genericName: 'Metformin', category: 'Antidiabetic', 
      form: 'Tablet', stock: 78, price: 5.49, expirationDate: '2025-04-22', reorderLevel: 30, isLowStock: false },
    { id: 3, name: 'Lisinopril 10mg', genericName: 'Lisinopril', category: 'Antihypertensive', 
      form: 'Tablet', stock: 56, price: 6.75, expirationDate: '2025-04-30', reorderLevel: 40, isLowStock: false },
    { id: 4, name: 'Atorvastatin 20mg', genericName: 'Atorvastatin', category: 'Statins', 
      form: 'Tablet', stock: 15, price: 12.50, expirationDate: '2025-09-10', reorderLevel: 25, isLowStock: true },
    { id: 5, name: 'Hydrochlorothiazide 25mg', genericName: 'Hydrochlorothiazide', category: 'Diuretic', 
      form: 'Tablet', stock: 18, price: 7.29, expirationDate: '2025-07-05', reorderLevel: 30, isLowStock: true },
    { id: 6, name: 'Albuterol Inhaler', genericName: 'Albuterol', category: 'Bronchodilator', 
      form: 'Inhaler', stock: 8, price: 34.99, expirationDate: '2025-11-15', reorderLevel: 20, isLowStock: true },
    { id: 7, name: 'Levothyroxine 50mcg', genericName: 'Levothyroxine', category: 'Thyroid', 
      form: 'Tablet', stock: 112, price: 9.89, expirationDate: '2025-10-30', reorderLevel: 40, isLowStock: false },
    { id: 8, name: 'Omeprazole 20mg', genericName: 'Omeprazole', category: 'Proton Pump Inhibitor', 
      form: 'Capsule', stock: 67, price: 11.25, expirationDate: '2025-06-18', reorderLevel: 30, isLowStock: false },
    { id: 9, name: 'Ibuprofen 400mg', genericName: 'Ibuprofen', category: 'NSAID', 
      form: 'Tablet', stock: 93, price: 4.99, expirationDate: '2025-12-05', reorderLevel: 50, isLowStock: false },
    { id: 10, name: 'Azithromycin 250mg', genericName: 'Azithromycin', category: 'Antibiotics', 
      form: 'Tablet', stock: 32, price: 15.75, expirationDate: '2025-05-20', reorderLevel: 25, isLowStock: false },
    { id: 11, name: 'Fluoxetine 20mg', genericName: 'Fluoxetine', category: 'Antidepressant', 
      form: 'Capsule', stock: 42, price: 12.99, expirationDate: '2025-08-10', reorderLevel: 20, isLowStock: false },
    { id: 12, name: 'Loratadine 10mg', genericName: 'Loratadine', category: 'Antihistamine', 
      form: 'Tablet', stock: 83, price: 6.49, expirationDate: '2025-09-25', reorderLevel: 40, isLowStock: false }
  ];

  // Filter medications based on search term
  const filteredMedications = medications.filter(
    medication =>
      medication.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      medication.genericName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      medication.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Pagination logic
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredMedications.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredMedications.length / itemsPerPage);

  const handleChangePage = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  // Get formatted expiry date with visual warning if within 30 days
  const getExpiryInfo = (dateString) => {
    const expiryDate = new Date(dateString);
    const today = new Date();
    const diffTime = expiryDate - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    const month = expiryDate.toLocaleString('default', { month: 'short' });
    const day = expiryDate.getDate();
    const year = expiryDate.getFullYear();
    const formattedDate = `${month} ${day}, ${year}`;
    
    return {
      date: formattedDate,
      daysLeft: diffDays,
      isExpiringSoon: diffDays <= 30
    };
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-gray-900">Medication Inventory</h1>
          <div className="flex space-x-2">
            <button className="px-4 py-2 bg-indigo-600 text-white rounded-md flex items-center hover:bg-indigo-700">
              <Plus className="h-4 w-4 mr-2" />
              Add Medication
            </button>
          </div>
        </div>

        <div className="bg-white shadow-md rounded-lg overflow-hidden">
          {/* Search and Filter Bar */}
          <div className="p-4 border-b border-gray-200 flex flex-wrap items-center justify-between gap-4">
            <div className="flex-1 min-w-64 relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                placeholder="Search medications..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            
            <div className="flex space-x-2">
              <button className="px-3 py-2 border border-gray-300 rounded-md flex items-center text-gray-700 hover:bg-gray-50">
                <Filter className="h-4 w-4 mr-2" />
                Filter
              </button>
              <button className="px-3 py-2 border border-gray-300 rounded-md flex items-center text-gray-700 hover:bg-gray-50">
                <Download className="h-4 w-4 mr-2" />
                Export
              </button>
              <button className="px-3 py-2 border border-gray-300 rounded-md flex items-center text-gray-700 hover:bg-gray-50">
                <Printer className="h-4 w-4 mr-2" />
                Print
              </button>
            </div>
          </div>

          {/* Inventory Table */}
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Medication
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Category
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Form
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Stock
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Price
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Expiration
                  </th>
                  <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {currentItems.map((medication) => {
                  const expiryInfo = getExpiryInfo(medication.expirationDate);
                  
                  return (
                    <tr key={medication.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div>
                            <div className="text-sm font-medium text-gray-900">{medication.name}</div>
                            <div className="text-sm text-gray-500">{medication.genericName}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">{medication.category}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">{medication.form}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          {medication.isLowStock ? (
                            <span className="flex items-center">
                              <AlertTriangle className="h-4 w-4 text-red-500 mr-1" />
                              <span className="text-sm text-red-600 font-medium">{medication.stock}</span>
                            </span>
                          ) : (
                            <span className="text-sm text-gray-900">{medication.stock}</span>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">${medication.price.toFixed(2)}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          {expiryInfo.isExpiringSoon ? (
                            <span className="flex items-center">
                              <Clock className="h-4 w-4 text-amber-500 mr-1" />
                              <span className="text-sm text-amber-600 font-medium">
                                {expiryInfo.date} ({expiryInfo.daysLeft} days)
                              </span>
                            </span>
                          ) : (
                            <span className="text-sm text-gray-900">{expiryInfo.date}</span>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <div className="flex items-center justify-end space-x-2">
                          <button className="text-indigo-600 hover:text-indigo-900">
                            <Edit className="h-4 w-4" />
                          </button>
                          <button className="text-red-600 hover:text-red-900">
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <div className="px-4 py-3 bg-gray-50 border-t border-gray-200 sm:px-6 flex items-center justify-between">
            <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
              <div>
                <p className="text-sm text-gray-700">
                  Showing <span className="font-medium">{indexOfFirstItem + 1}</span> to{' '}
                  <span className="font-medium">
                    {indexOfLastItem > filteredMedications.length ? filteredMedications.length : indexOfLastItem}
                  </span>{' '}
                  of <span className="font-medium">{filteredMedications.length}</span> results
                </p>
              </div>
              <div>
                <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
                  <button
                    onClick={() => handleChangePage(currentPage - 1)}
                    disabled={currentPage === 1}
                    className={`relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium ${
                      currentPage === 1 ? 'text-gray-300 cursor-not-allowed' : 'text-gray-500 hover:bg-gray-50'
                    }`}
                  >
                    Previous
                  </button>
                  {[...Array(totalPages)].map((_, i) => (
                    <button
                      key={i}
                      onClick={() => handleChangePage(i + 1)}
                      className={`relative inline-flex items-center px-4 py-2 border border-gray-300 bg-white text-sm font-medium ${
                        currentPage === i + 1
                          ? 'z-10 bg-indigo-50 border-indigo-500 text-indigo-600'
                          : 'text-gray-500 hover:bg-gray-50'
                      }`}
                    >
                      {i + 1}
                    </button>
                  ))}
                  <button
                    onClick={() => handleChangePage(currentPage + 1)}
                    disabled={currentPage === totalPages}
                    className={`relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium ${
                      currentPage === totalPages ? 'text-gray-300 cursor-not-allowed' : 'text-gray-500 hover:bg-gray-50'
                    }`}
                  >
                    Next
                  </button>
                </nav>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InventoryManagement;
