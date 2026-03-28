import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { generateContent } from '../services/api';
import { Upload, Sparkles, X, ChefHat, DollarSign } from 'lucide-react';
import toast from 'react-hot-toast';
import './GeneratePage.css';

const STYLES = [
  { id: 'thai', label: '泰式风格', emoji: '🌴', desc: 'Tropical & Vibrant' },
  { id: 'premium', label: '高级风格', emoji: '✨', desc: 'Elegant & Luxury' },
  { id: 'street', label: '烟火气', emoji: '🔥', desc: 'Street Food Vibes' },
];

export default function GeneratePage() {
  const [dishName, setDishName] = useState('');
  const [price, setPrice] = useState('');
  const [style, setStyle] = useState('thai');
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const fileRef = useRef();
  const navigate = useNavigate();

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(file);
      setPreview(URL.createObjectURL(file));
    }
  };

  const removeImage = () => {
    setImage(null);
    setPreview(null);
    if (fileRef.current) fileRef.current.value = '';
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!dishName || !price) {
      toast.error('Please fill in dish name and price');
      return;
    }

    setLoading(true);
    const formData = new FormData();
    formData.append('dishName', dishName);
    formData.append('price', price);
    formData.append('style', style);
    if (image) formData.append('image', image);

    try {
      const res = await generateContent(formData);
      toast.success('Content generated!');
      navigate(`/result/${res.data.id}`);
    } catch (err) {
      toast.error(err.response?.data?.error || 'Generation failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page-container">
      <div className="page-header">
        <h1>Generate Marketing Content</h1>
        <p>生成营销内容 - Fill in your dish details and let AI do the magic</p>
      </div>

      <form onSubmit={handleSubmit} className="generate-form">
        <div className="form-grid">
          {/* Left: Image Upload */}
          <div className="upload-section">
            <label className="upload-label">Food Photo 食物照片</label>
            <div
              className={`upload-zone ${preview ? 'has-preview' : ''}`}
              onClick={() => fileRef.current?.click()}
            >
              {preview ? (
                <>
                  <img src={preview} alt="Preview" className="upload-preview" />
                  <button
                    type="button"
                    className="remove-image"
                    onClick={(e) => { e.stopPropagation(); removeImage(); }}
                  >
                    <X size={16} />
                  </button>
                </>
              ) : (
                <div className="upload-placeholder">
                  <Upload size={32} />
                  <span>Click to upload</span>
                  <span className="upload-hint">JPG, PNG up to 10MB</span>
                </div>
              )}
            </div>
            <input
              ref={fileRef}
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              hidden
            />
          </div>

          {/* Right: Form Fields */}
          <div className="fields-section">
            <div className="form-group">
              <label>
                <ChefHat size={14} />
                Dish Name 菜名
              </label>
              <input
                type="text"
                value={dishName}
                onChange={(e) => setDishName(e.target.value)}
                placeholder="e.g. 泰式冬阴功 Tom Yum Kung"
                required
              />
            </div>

            <div className="form-group">
              <label>
                <DollarSign size={14} />
                Price 价格 (RM)
              </label>
              <input
                type="number"
                step="0.01"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                placeholder="e.g. 18.90"
                required
              />
            </div>

            <div className="form-group">
              <label>Style 风格</label>
              <div className="style-grid">
                {STYLES.map((s) => (
                  <button
                    key={s.id}
                    type="button"
                    className={`style-card ${style === s.id ? 'selected' : ''}`}
                    onClick={() => setStyle(s.id)}
                  >
                    <span className="style-emoji">{s.emoji}</span>
                    <span className="style-label">{s.label}</span>
                    <span className="style-desc">{s.desc}</span>
                  </button>
                ))}
              </div>
            </div>

            <button
              type="submit"
              className="btn btn-primary btn-full btn-generate"
              disabled={loading}
            >
              {loading ? (
                <>
                  <div className="spinner-sm" />
                  Generating... AI 生成中...
                </>
              ) : (
                <>
                  <Sparkles size={18} />
                  Generate Content 生成内容
                </>
              )}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}
