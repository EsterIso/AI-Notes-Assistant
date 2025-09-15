import React, { useState } from 'react';
import { 
  FileText, 
  Mic, 
  Upload, 
  Brain, 
  Zap, 
  BookOpen, 
  Target,
  ArrowRight,
  Play,
  Sparkles,
  Clock,
  Users
} from 'lucide-react';
import PublicHeader from '../../components/layout/PublicHeader.jsx';


export default function HomePage() {
  const [hoveredCard, setHoveredCard] = useState(null);

  const features = [
    {
      icon: <FileText className="w-8 h-8" />,
      title: "PDF Upload",
      description: "Upload any PDF document and transform it into structured study materials",
      iconClass: "feature-icon-blue"
    },
    {
      icon: <Mic className="w-8 h-8" />,
      title: "Audio Processing",
      description: "Convert lecture recordings into comprehensive notes and study guides",
      iconClass: "feature-icon-purple"
    },
    {
      icon: <FileText className="w-8 h-8" />,
      title: "Text Analysis",
      description: "Paste any text content and generate personalized learning materials",
      iconClass: "feature-icon-emerald"
    }
  ];

  const outputs = [
    { icon: <BookOpen />, title: "Smart Notes", description: "AI-organized study notes" },
    { icon: <Zap />, title: "Flashcards", description: "Interactive memory cards" },
    { icon: <Target />, title: "Quiz Questions", description: "Test your knowledge" }
  ];

  return (
    <div className="app-container">
      {/* Header */}
      <PublicHeader/>

      {/* Hero Section */}
      <section className="hero">
        <div className="hero-content">
          <div className="hero-badge">
            <Sparkles className="w-4 h-4" />
            <span>Powered by Advanced AI</span>
          </div>
          
          <h1 className="hero-title">
            Transform Any Content Into
            <span className="hero-title-gradient">
              Perfect Study Materials
            </span>
          </h1>
          
          <p className="hero-description">
            Upload PDFs, audio recordings, or text content and let our AI create personalized notes, 
            flashcards, and quiz questions tailored to your learning style.
          </p>

          <div className="hero-buttons">
            <button className="hero-primary-button">
              <span>Start Learning</span>
              <ArrowRight className="w-5 h-5 icon-transition" />
            </button>
            <button className="hero-secondary-button">
              <Play className="w-5 h-5" />
              <span>Watch Demo</span>
            </button>
          </div>
        </div>

        {/* Floating Elements */}
        <div className="floating-element-1"></div>
        <div className="floating-element-2"></div>
      </section>

      {/* Features Section */}
      <section className="features">
        <div className="features-content">
          <div className="section-header">
            <h2 className="section-title">Multiple Input Methods</h2>
            <p className="section-subtitle">Choose how you want to upload your content</p>
          </div>

          <div className="features-grid">
            {features.map((feature, index) => (
              <div
                key={index}
                className="feature-card"
                onMouseEnter={() => setHoveredCard(index)}
                onMouseLeave={() => setHoveredCard(null)}
              >
                <div className={`feature-icon ${feature.iconClass}`}>
                  {feature.icon}
                </div>
                <h3 className="feature-title">{feature.title}</h3>
                <p className="feature-description">{feature.description}</p>
                
                {hoveredCard === index && (
                  <div className="feature-hover-overlay"></div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Output Section */}
      <section className="outputs">
        <div className="outputs-content">
          <div className="section-header">
            <h2 className="section-title">AI-Generated Study Materials</h2>
            <p className="section-subtitle">Get comprehensive learning resources in seconds</p>
          </div>

          <div className="outputs-grid">
            {outputs.map((output, index) => (
              <div key={index} className="output-card">
                <div className="output-header">
                  <div className="output-icon">
                    {output.icon}
                  </div>
                  <h3 className="output-title">{output.title}</h3>
                </div>
                <p className="output-description">{output.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="stats">
        <div className="stats-content">
          <div className="stats-grid">
            <div className="stat-item">
              <div className="stat-number">10k+</div>
              <div className="stat-label">Documents Processed</div>
            </div>
            <div className="stat-item">
              <div className="stat-number">50k+</div>
              <div className="stat-label">Flashcards Created</div>
            </div>
            <div className="stat-item">
              <div className="stat-number">98%</div>
              <div className="stat-label">Accuracy Rate</div>
            </div>
            <div className="stat-item">
              <div className="stat-number">5k+</div>
              <div className="stat-label">Happy Students</div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="cta">
        <div className="cta-content">
          <div className="cta-card">
            <h2 className="cta-title">
              Ready to Revolutionize Your Study Process?
            </h2>
            <p className="cta-description">
              Join thousands of students who have transformed their learning experience with AI-powered study tools.
            </p>
            <button className="cta-button">
              <span>Get Started Free</span>
              <ArrowRight className="w-5 h-5 icon-transition" />
            </button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="footer">
        <div className="footer-content">
          <div className="footer-logo">
            <div className="footer-logo-icon">
              <Brain className="w-5 h-5 text-white" />
            </div>
            <span className="footer-logo-text">StudyAI</span>
          </div>
          <p className="footer-text">
            © 2025 StudyAI. Empowering students with AI-driven learning tools.
          </p>
        </div>
      </footer>
    </div>
  );
}