import React from 'react';
import { Link } from 'react-router-dom';
import { Sparkles, Image, FileText, Zap } from 'lucide-react';
import './LandingPage.css';

export default function LandingPage() {
  return (
    <div className="landing">
      <div className="landing-hero">
        <div className="hero-badge">
          <Sparkles size={14} /> AI-Powered Marketing
        </div>
        <h1>
          餐饮AI营销工具
          <span className="gradient-text">FoodAI Marketing</span>
        </h1>
        <p className="hero-subtitle">
          上传食物照片，一键生成 Facebook、小红书文案和精美海报。
          <br />
          Upload food photos, generate marketing copy & posters instantly.
        </p>
        <div className="hero-actions">
          <Link to="/register" className="btn btn-primary btn-lg">
            免费开始 Get Started
          </Link>
          <Link to="/login" className="btn btn-outline btn-lg">
            登录 Login
          </Link>
        </div>
      </div>

      <div className="features">
        <div className="feature-card">
          <div className="feature-icon">
            <Image size={24} />
          </div>
          <h3>Upload Photo</h3>
          <p>上传你的食物照片作为创作素材</p>
        </div>
        <div className="feature-card">
          <div className="feature-icon">
            <FileText size={24} />
          </div>
          <h3>AI Copywriting</h3>
          <p>自动生成中英文 Facebook 和小红书文案</p>
        </div>
        <div className="feature-card">
          <div className="feature-icon">
            <Zap size={24} />
          </div>
          <h3>Poster Generation</h3>
          <p>AI 生成精美营销海报，支持多种风格</p>
        </div>
      </div>
    </div>
  );
}
