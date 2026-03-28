import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getHistory, deleteHistoryItem } from '../services/api';
import { Clock, Trash2, ExternalLink, Sparkles } from 'lucide-react';
import toast from 'react-hot-toast';
import './HistoryPage.css';

export default function HistoryPage() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadHistory();
  }, []);

  const loadHistory = async () => {
    try {
      const res = await getHistory();
      setItems(res.data);
    } catch {
      toast.error('Failed to load history');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id, e) => {
    e.preventDefault();
    e.stopPropagation();
    if (!window.confirm('Delete this item?')) return;
    try {
      await deleteHistoryItem(id);
      setItems((prev) => prev.filter((i) => i._id !== id));
      toast.success('Deleted');
    } catch {
      toast.error('Delete failed');
    }
  };

  if (loading) {
    return (
      <div className="page-container">
        <div className="loading-state">
          <div className="spinner" />
        </div>
      </div>
    );
  }

  return (
    <div className="page-container">
      <div className="page-header">
        <h1>History 历史记录</h1>
        <p>View your previously generated marketing content</p>
      </div>

      {items.length === 0 ? (
        <div className="empty-state">
          <Clock size={48} />
          <h3>No history yet</h3>
          <p>Generate your first marketing content to see it here.</p>
          <Link to="/generate" className="btn btn-primary">
            <Sparkles size={16} />
            Start Generating
          </Link>
        </div>
      ) : (
        <div className="history-grid">
          {items.map((item) => (
            <Link
              key={item._id}
              to={`/result/${item._id}`}
              className="history-card"
            >
              <div className="history-card-top">
                {item.imageFile ? (
                  <img
                    src={`http://localhost:5000/uploads/${item.imageFile}`}
                    alt={item.dishName}
                    className="history-thumb"
                  />
                ) : item.posterUrl ? (
                  <img
                    src={item.posterUrl}
                    alt={item.dishName}
                    className="history-thumb"
                  />
                ) : (
                  <div className="history-thumb-placeholder">
                    <Sparkles size={24} />
                  </div>
                )}
              </div>
              <div className="history-card-body">
                <h3>{item.dishName}</h3>
                <div className="history-card-meta">
                  <span className="price-badge-sm">RM {item.price}</span>
                  <span className="style-badge-sm">{item.styleLabel}</span>
                </div>
                <p className="history-date">
                  {new Date(item.createdAt).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'short',
                    day: 'numeric',
                  })}
                </p>
              </div>
              <div className="history-card-actions">
                <span className="view-link">
                  <ExternalLink size={14} /> View
                </span>
                <button
                  className="btn-delete"
                  onClick={(e) => handleDelete(item._id, e)}
                >
                  <Trash2 size={14} />
                </button>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
