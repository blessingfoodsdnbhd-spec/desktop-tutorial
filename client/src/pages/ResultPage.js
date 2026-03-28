import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getHistoryItem } from '../services/api';
import { Copy, Check, ArrowLeft, Image, FileText } from 'lucide-react';
import toast from 'react-hot-toast';
import './ResultPage.css';

function CopyBlock({ title, content, lang }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(content);
    setCopied(true);
    toast.success('Copied!');
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="copy-block">
      <div className="copy-header">
        <div className="copy-title">
          <FileText size={16} />
          <span>{title}</span>
          {lang && <span className="copy-lang">{lang}</span>}
        </div>
        <button onClick={handleCopy} className="btn-copy">
          {copied ? <Check size={14} /> : <Copy size={14} />}
          {copied ? 'Copied' : 'Copy'}
        </button>
      </div>
      <div className="copy-content">{content}</div>
    </div>
  );
}

export default function ResultPage() {
  const { id } = useParams();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getHistoryItem(id)
      .then((res) => setData(res.data))
      .catch(() => toast.error('Failed to load result'))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) {
    return (
      <div className="page-container">
        <div className="loading-state">
          <div className="spinner" />
          <p>Loading result...</p>
        </div>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="page-container">
        <p>Result not found.</p>
        <Link to="/generate">Go back</Link>
      </div>
    );
  }

  return (
    <div className="page-container">
      <Link to="/history" className="back-link">
        <ArrowLeft size={16} /> Back to History
      </Link>

      <div className="result-header">
        <div>
          <h1>{data.dishName}</h1>
          <div className="result-meta">
            <span className="price-badge">RM {data.price}</span>
            <span className="style-badge">{data.styleLabel}</span>
            <span className="date-badge">
              {new Date(data.createdAt).toLocaleDateString()}
            </span>
          </div>
        </div>
      </div>

      <div className="result-grid">
        {/* Copy sections */}
        <div className="result-copies">
          {data.generatedText?.facebook_en && (
            <CopyBlock
              title="Facebook Post"
              lang="EN"
              content={data.generatedText.facebook_en}
            />
          )}
          {data.generatedText?.facebook_zh && (
            <CopyBlock
              title="Facebook Post"
              lang="中文"
              content={data.generatedText.facebook_zh}
            />
          )}
          {data.generatedText?.xiaohongshu && (
            <CopyBlock
              title="小红书 Xiaohongshu"
              lang="小红书"
              content={data.generatedText.xiaohongshu}
            />
          )}
        </div>

        {/* Poster section */}
        <div className="result-poster">
          <div className="poster-card">
            <div className="copy-header">
              <div className="copy-title">
                <Image size={16} />
                <span>AI Generated Poster</span>
              </div>
            </div>
            {data.posterUrl ? (
              <img src={data.posterUrl} alt="Generated poster" className="poster-image" />
            ) : (
              <div className="poster-placeholder">
                <Image size={48} />
                <p>Poster generation unavailable</p>
              </div>
            )}
          </div>

          {data.imageFile && (
            <div className="poster-card">
              <div className="copy-header">
                <div className="copy-title">
                  <Image size={16} />
                  <span>Original Photo</span>
                </div>
              </div>
              <img
                src={`http://localhost:5000/uploads/${data.imageFile}`}
                alt="Original"
                className="poster-image"
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
