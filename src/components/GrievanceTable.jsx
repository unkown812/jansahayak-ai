import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Search, Filter, ArrowUpDown, ChevronLeft, ChevronRight, X } from 'lucide-react';

export default function GrievanceTable({ onSelectGrievance, selectedGrievanceId }) {
  const {
    grievances,
    
    selectedSector,
    setSelectedSector,
    selectedUrgency,
    setSelectedUrgency,
    searchQuery,
    setSearchQuery
  } = useApp();

  const [currentPage, setCurrentPage] = useState(1);
  const [sortField, setSortField] = useState('timestamp');
  const [sortDirection, setSortDirection] = useState('desc'); // 'asc' or 'desc'
  
  const itemsPerPage = 8;

  // Clear all filters
  const handleClearFilters = () => {
        setSelectedSector('All');
    setSelectedUrgency('All');
    setSearchQuery('');
    setCurrentPage(1);
  };

  // Check if any filter is active
  const isFilterActive =  selectedSector !== 'All' || selectedUrgency !== 'All' || searchQuery !== '';

  // Sort handler
  const handleSort = (field) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('desc');
    }
    setCurrentPage(1);
  };

  // Filter Grievances
  const filteredGrievances = grievances.filter((g) => {
        if (selectedSector !== 'All' && g.sector !== selectedSector) return false;
    if (selectedUrgency !== 'All' && g.urgency !== selectedUrgency) return false;
    if (searchQuery.trim() !== '') {
      const query = searchQuery.toLowerCase();
      const matchTitle = g.title.toLowerCase().includes(query);
      const matchDesc = g.description.toLowerCase().includes(query);
      const matchReporter = g.reporter.toLowerCase().includes(query);
      const matchId = g.id.toLowerCase().includes(query);
      return matchTitle || matchDesc || matchReporter || matchId;
    }
    return true;
  });

  // Sort Grievances
  const sortedGrievances = [...filteredGrievances].sort((a, b) => {
    let fieldA = a[sortField];
    let fieldB = b[sortField];

    if (sortField === 'timestamp') {
      fieldA = new Date(a.timestamp).getTime();
      fieldB = new Date(b.timestamp).getTime();
    }

    if (sortField === 'urgency') {
      const weight = { 'Critical': 3, 'Medium': 2, 'Low': 1 };
      fieldA = weight[a.urgency] || 0;
      fieldB = weight[b.urgency] || 0;
    }

    if (fieldA < fieldB) return sortDirection === 'asc' ? -1 : 1;
    if (fieldA > fieldB) return sortDirection === 'asc' ? 1 : -1;
    return 0;
  });

  // Pagination calculations
  const totalItems = sortedGrievances.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage) || 1;
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedGrievances = sortedGrievances.slice(startIndex, startIndex + itemsPerPage);

  const getUrgencyBadge = (urgency) => {
    switch (urgency) {
      case 'Critical': return 'badge-danger';
      case 'Medium': return 'badge-warning';
      case 'Low': return 'badge-success';
      default: return 'badge-info';
    }
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'Pending': return 'badge-danger';
      case 'Investigating': return 'badge-info';
      case 'Work Order Created': return 'badge-warning';
      case 'Resolved': return 'badge-success';
      default: return 'badge-info';
    }
  };

  return (
    <div className="glass-panel" style={{
      padding: '20px',
      backgroundColor: 'var(--bg-secondary)',
      border: '1px solid var(--border-color)',
      display: 'flex',
      flexDirection: 'column',
      gap: '16px'
    }}>
      {/* Search & Filtering Row */}
      <div style={{
        display: 'flex',
        flexWrap: 'wrap',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: '12px'
      }}>
        {/* Search Input */}
        <div style={{ position: 'relative', flexGrow: 1, minWidth: '200px' }}>
          <Search size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-tertiary)' }} />
          <input
            type="text"
            className="form-input"
            style={{ paddingLeft: '36px' }}
            placeholder="Search tickets by ID, title, or citizen name..."
            value={searchQuery}
            onChange={(e) => { setSearchQuery(e.target.value); setCurrentPage(1); }}
          />
        </div>

        {/* Filter selectors */}
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', alignItems: 'center', flexGrow: 1, width: '100%' }}>


          {/* Sector filter */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '4px', flex: '1 1 140px' }}>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-tertiary)' }}>Sector:</span>
            <select
              className="form-select"
              style={{ padding: '6px 10px', fontSize: '0.75rem', width: '100%' }}
              value={selectedSector}
              onChange={(e) => { setSelectedSector(e.target.value); setCurrentPage(1); }}
            >
              <option value="All">All Sectors</option>
              <option>Infrastructure</option>
              <option>Water Supply</option>
              <option>Sanitation</option>
              <option>Public Health</option>
              <option>Heritage & Tourism</option>
              <option>Transport</option>
            </select>
          </div>

          {/* Severity filter */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '4px', flex: '1 1 140px' }}>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-tertiary)' }}>Severity:</span>
            <select
              className="form-select"
              style={{ padding: '6px 10px', fontSize: '0.75rem', width: '100%' }}
              value={selectedUrgency}
              onChange={(e) => { setSelectedUrgency(e.target.value); setCurrentPage(1); }}
            >
              <option value="All">All Severity</option>
              <option>Low</option>
              <option>Medium</option>
              <option>Critical</option>
            </select>
          </div>

          {/* Clear Filters Button */}
          {isFilterActive && (
            <button
              onClick={handleClearFilters}
              className="btn"
              style={{
                padding: '6px 10px',
                fontSize: '0.75rem',
                backgroundColor: 'var(--bg-tertiary)',
                color: 'var(--text-secondary)',
                display: 'flex',
                alignItems: 'center',
                gap: '4px',
                flex: '0 0 auto'
              }}
            >
              <X size={12} />
              Clear
            </button>
          )}
        </div>
      </div>

      {/* Table Data */}
      <div style={{ overflowX: 'auto', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-md)' }}>
        <table style={{
          width: '100%',
          borderCollapse: 'collapse',
          textAlign: 'left',
          fontSize: '0.85rem'
        }}>
          <thead>
            <tr style={{ background: 'var(--bg-tertiary)', borderBottom: '1px solid var(--border-color)' }}>
              <th onClick={() => handleSort('id')} style={{ padding: '12px 16px', cursor: 'pointer', color: 'var(--text-secondary)', fontWeight: '600' }}>
                ID <ArrowUpDown size={12} style={{ display: 'inline', marginLeft: '4px' }} />
              </th>

              <th className="hide-mobile" style={{ padding: '12px 16px', color: 'var(--text-secondary)', fontWeight: '600' }}>Reporter</th>
              <th className="hide-mobile" style={{ padding: '12px 16px', color: 'var(--text-secondary)', fontWeight: '600' }}>Sector</th>
              <th style={{ padding: '12px 16px', color: 'var(--text-secondary)', fontWeight: '600' }}>Title</th>
              <th onClick={() => handleSort('urgency')} style={{ padding: '12px 16px', cursor: 'pointer', color: 'var(--text-secondary)', fontWeight: '600' }}>
                Severity <ArrowUpDown size={12} style={{ display: 'inline', marginLeft: '4px' }} />
              </th>
              <th style={{ padding: '12px 16px', color: 'var(--text-secondary)', fontWeight: '600' }}>Status</th>
            </tr>
          </thead>
          <tbody>
            {paginatedGrievances.length > 0 ? (
              paginatedGrievances.map((item) => {
                const isSelected = selectedGrievanceId === item.id;
                const isCritical = item.urgency === 'Critical' && item.status !== 'Resolved';
                
                return (
                  <tr
                    key={item.id}
                    onClick={() => onSelectGrievance(item)}
                    style={{
                      borderBottom: '1px solid var(--border-color)',
                      cursor: 'pointer',
                      background: isSelected ? 'var(--accent-glow)' : 'transparent',
                      borderLeft: isCritical ? '3px solid var(--danger)' : '3px solid transparent',
                      transition: 'background-color 0.15s ease'
                    }}
                    className="table-row-hover"
                  >
                    <td style={{ padding: '14px 16px', fontWeight: 'bold' }}>{item.id}</td>
                    
                    <td className="hide-mobile" style={{ padding: '14px 16px' }}>{item.reporter}</td>
                    <td className="hide-mobile" style={{ padding: '14px 16px', color: 'var(--text-secondary)' }}>{item.sector}</td>
                    <td style={{ padding: '14px 16px', fontWeight: '500', maxWidth: '220px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                      {item.title}
                    </td>
                    <td style={{ padding: '14px 16px' }}>
                      <span className={`badge ${getUrgencyBadge(item.urgency)}`}>
                        {item.urgency}
                      </span>
                    </td>
                    <td style={{ padding: '14px 16px' }}>
                      <span className={`badge ${getStatusBadge(item.status)}`}>
                        {item.status}
                      </span>
                    </td>
                  </tr>
                );
              })
            ) : (
              <tr>
                <td colSpan="6" style={{ padding: '32px 16px', textAlign: 'center', color: 'var(--text-tertiary)' }}>
                  No grievances found matching the current search filters.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination Row */}
      {totalPages > 1 && (
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid var(--border-color)', paddingTop: '16px' }}>
          <span style={{ fontSize: '0.75rem', color: 'var(--text-tertiary)' }}>
            Showing {startIndex + 1} to {Math.min(startIndex + itemsPerPage, totalItems)} of {totalItems} items
          </span>

          <div style={{ display: 'flex', gap: '6px', alignItems: 'center' }}>
            <button
              onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
              disabled={currentPage === 1}
              className="btn btn-icon"
              style={{ opacity: currentPage === 1 ? 0.5 : 1, padding: '4px', cursor: currentPage === 1 ? 'not-allowed' : 'pointer' }}
            >
              <ChevronLeft size={16} />
            </button>
            
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((pageNum) => (
              <button
                key={pageNum}
                onClick={() => setCurrentPage(pageNum)}
                className="btn"
                style={{
                  padding: '4px 10px',
                  fontSize: '0.75rem',
                  borderRadius: 'var(--radius-sm)',
                  backgroundColor: currentPage === pageNum ? 'var(--accent)' : 'transparent',
                  color: currentPage === pageNum ? 'var(--accent-text)' : 'var(--text-primary)',
                  borderColor: currentPage === pageNum ? 'var(--accent)' : 'transparent',
                  fontWeight: 'bold',
                  boxShadow: 'none'
                }}
              >
                {pageNum}
              </button>
            ))}

            <button
              onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
              disabled={currentPage === totalPages}
              className="btn btn-icon"
              style={{ opacity: currentPage === totalPages ? 0.5 : 1, padding: '4px', cursor: currentPage === totalPages ? 'not-allowed' : 'pointer' }}
            >
              <ChevronRight size={16} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
