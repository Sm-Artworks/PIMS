import React, { useState, useEffect } from 'react';
import { Search, Filter, Plus, Trash2, Edit, AlertTriangle, Clock, Download, Printer } from 'lucide-react';
import { medicationsAPI } from '../services/api';
import { useToast } from '../hooks/useToast';

const InventoryManagement = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterOpen, setFilterOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  const [medications, setMedications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { showToast } = useToast();
  
  // Fetch medications from API
  useEffect(() => {
    const fetchMedications = async () => {
      try {
        setLoading(true);
        const data = await medicationsAPI.getAll();
        setMedications(data);
        setError(null);
      } catch (err) {
        console.error('Error fetching medications:', err);
        setError('Failed to load medications. Please try again.');
        showToast({
          type: 'error',
          title: 'Error',
          message: 'Failed to load medications'
        });
      } finally {
        setLoading(false);
      }
    };
    
    fetchMedications();
  }, []);
  
  // Handle medication deletion
  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this medication?')) {
      try {
        await medicationsAPI.delete(id);
        setMedications(medications.filter(med => med._id !== id));
        showToast({
          type: 'success',
          title: 'Deleted',
          message: 'Medication deleted successfully'
        });
      } catch (err) {
        console.error('Error deleting medication:', err);
        showToast({
          type: 'error',
          title: 'Error',
          message: 'Failed to delete medication'
        });
      }
    }
  };

  // Filter medications based on search term
  const filteredMedications = medications.filter(
    medication =>
      medication.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (medication.genericName && medication.genericName.toLowerCase().includes(searchTerm.toLowerCase())) ||
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
    