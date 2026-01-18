import { useState, useEffect, useRef } from 'react';
import { Heart, Home, Stethoscope, Sparkles, Phone, Mail, MapPin, ChevronRight, Check, Menu, X, Users, Clock, Shield, Award, Star, Calendar, MessageSquare } from 'lucide-react';
import { Link } from 'react-router-dom';
import { api } from '../services/api';
import LanguageSelector from '../components/LanguageSelector';
import { useLanguage } from '../contexts/LanguageContext';

function HomePage() {
  const { t } = useLanguage();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [activeService, setActiveService] = useState(null);
  const [scrolled, setScrolled] = useState(false);
  const [isVisible, setIsVisible] = useState({});
  const [showFloatingButton, setShowFloatingButton] = useState(false);
  const observerRef = useRef(null);

  // Contact form state
  const [contactForm, setContactForm] = useState({
    full_name: '',
    email: '',
    phone: '',
    service_needed: 'Home Care Services',
    message: ''
  });
  const [formStatus, setFormStatus] = useState({ type: '', message: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Feedback form state
  const [feedbackForm, setFeedbackForm] = useState({
    full_name: '',
    email: '',
    rating: 5,
    service_type: 'Home Care Services',
    message: ''
  });
  const [feedbackStatus, setFeedbackStatus] = useState({ type: '', message: '' });
  const [isSubmittingFeedback, setIsSubmittingFeedback] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
      // Show floating button after scrolling down 300px on mobile
      setShowFloatingButton(window.scrollY > 300);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    observerRef.current = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsVisible(prev => ({ ...prev, [entry.target.id]: true }));
          }
        });
      },
      { threshold: 0.1 }
    );

    document.querySelectorAll('[data-animate]').forEach((el) => {
      if (observerRef.current) observerRef.current.observe(el);
    });

    return () => {
      if (observerRef.current) observerRef.current.disconnect();
    };
  }, []);

  const handleContactFormChange = (e) => {
    const { name, value } = e.target;
    setContactForm(prev => ({ ...prev, [name]: value }));
    // Clear status message when user starts typing
    if (formStatus.message) setFormStatus({ type: '', message: '' });
  };

  const handleContactFormSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setFormStatus({ type: '', message: '' });

    try {
      await api.clientContacts.create(contactForm);
      setFormStatus({
        type: 'success',
        message: 'Thank you for contacting us! We will get back to you soon.'
      });
      // Reset form
      setContactForm({
        full_name: '',
        email: '',
        phone: '',
        service_needed: 'Home Care Services',
        message: ''
      });
    } catch (error) {
      setFormStatus({
        type: 'error',
        message: error.message || 'Failed to send message. Please try again.'
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleFeedbackFormChange = (e) => {
    const { name, value } = e.target;
    setFeedbackForm(prev => ({ ...prev, [name]: name === 'rating' ? parseInt(value) : value }));
    if (feedbackStatus.message) setFeedbackStatus({ type: '', message: '' });
  };

  const handleFeedbackFormSubmit = async (e) => {
    e.preventDefault();
    setIsSubmittingFeedback(true);
    setFeedbackStatus({ type: '', message: '' });

    try {
      await api.feedbacks.create(feedbackForm);
      setFeedbackStatus({
        type: 'success',
        message: t('feedback.success')
      });
      setFeedbackForm({
        full_name: '',
        email: '',
        rating: 5,
        service_type: 'Home Care Services',
        message: ''
      });
    } catch (error) {
      setFeedbackStatus({
        type: 'error',
        message: error.message || t('feedback.error')
      });
    } finally {
      setIsSubmittingFeedback(false);
    }
  };

  const getServices = () => [
    {
      id: 'home-care',
      icon: Home,
      title: t('services.homeCare'),
      subtitle: t('services.homeCareSubtitle') || 'Daily living assistance',
      description: t('services.homeCareDesc'),
      features: [t('services.feature1') || 'Personal hygiene assistance', t('services.feature2') || 'Meal preparation', t('services.feature3') || 'Mobility support', t('services.feature4') || 'Medication reminders'],
      price: `${t('services.from')} €32/${t('services.hour')}`,
      color: 'bg-cyan-50 border-cyan-200'
    },
    {
      id: 'nursing',
      icon: Stethoscope,
      title: t('services.nursing'),
      subtitle: t('services.nursingSubtitle') || 'Professional medical care',
      description: t('services.nursingDesc'),
      features: [t('services.nursingFeature1') || 'Wound care', t('services.nursingFeature2') || 'Injections & medications', t('services.nursingFeature3') || 'Health monitoring', t('services.nursingFeature4') || 'Post-surgery care'],
      price: `${t('services.from')} €59/${t('services.hour')}`,
      color: 'bg-red-50 border-red-200'
    },
    {
      id: 'cleaning',
      icon: Sparkles,
      title: t('services.cleaning'),
      subtitle: t('services.cleaningSubtitle') || 'Professional housekeeping',
      description: t('services.cleaningDesc'),
      features: [t('services.cleaningFeature1') || 'Regular cleaning', t('services.cleaningFeature2') || 'Deep cleaning', t('services.cleaningFeature3') || 'Window washing', t('services.cleaningFeature4') || 'Moving assistance'],
      price: `${t('services.from')} €37.82/${t('services.hour')}`,
      color: 'bg-blue-50 border-blue-200'
    },
    {
      id: 'palliative',
      icon: Heart,
      title: t('services.palliative'),
      subtitle: t('services.palliativeSubtitle') || 'Compassionate end-of-life care',
      description: t('services.palliativeDesc'),
      features: [t('services.palliativeFeature1') || '24/7 care options', t('services.palliativeFeature2') || 'Pain management', t('services.palliativeFeature3') || 'Emotional support', t('services.palliativeFeature4') || 'Family counseling'],
      price: t('services.customPricing') || 'Custom pricing',
      color: 'bg-rose-50 border-rose-200'
    }
  ];

  const getStats = () => [
    { icon: Users, value: '2,500+', label: t('hero.happyClients') },
    { icon: Award, value: '15+', label: t('hero.yearsExperience') },
    { icon: Clock, value: '24/7', label: t('hero.availability') },
    { icon: Shield, value: '100%', label: t('hero.licensedStaff') }
  ];

  const services = getServices();
  const stats = getStats();

  const getTestimonials = () => [
    {
      name: 'Maria Korhonen',
      role: t('testimonials.familyMember'),
      text: t('testimonials.testimonial1'),
      rating: 5
    },
    {
      name: 'Jukka Virtanen',
      role: t('testimonials.client'),
      text: t('testimonials.testimonial2'),
      rating: 5
    },
    {
      name: 'Anna Nieminen',
      role: t('testimonials.client'),
      text: t('testimonials.testimonial3'),
      rating: 5
    }
  ];

  const testimonials = getTestimonials();

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800">
      {/* Navigation */}
      <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${scrolled ? 'bg-white/95 backdrop-blur-sm shadow-sm' : 'bg-transparent'}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            <Link to="/" className="flex items-center space-x-3 hover:opacity-80 transition-opacity cursor-pointer">
              <div className="w-14 h-14 rounded-full flex items-center justify-center overflow-hidden bg-white shadow-lg border-2 border-slate-200">
                <img
                  src="/logo.jpeg"
                  alt="Bridge Hoito Oy Logo"
                  className="w-full h-full object-cover scale-110"
                />
              </div>
              <div>
                <h1 className="font-display text-2xl font-bold text-navy-900" style={{color: '#1e3a5f'}}>Bridge Hoito Oy</h1>
                <p className="text-xs text-cyan-600">Home Healthcare Services</p>
              </div>
            </Link>

            {/* Desktop Menu */}
            <div className="hidden md:flex items-center space-x-6">
              <a href="#services" className="text-navy-900 hover:text-red-500 transition-colors font-medium" style={{color: '#1e3a5f'}}>{t('nav.services')}</a>
              <a href="#about" className="text-navy-900 hover:text-red-500 transition-colors font-medium" style={{color: '#1e3a5f'}}>{t('nav.about')}</a>
              <a href="#pricing" className="text-navy-900 hover:text-red-500 transition-colors font-medium" style={{color: '#1e3a5f'}}>{t('nav.pricing')}</a>
              <Link to="/appointments" className="flex items-center space-x-2 text-navy-900 hover:text-red-500 transition-colors font-medium" style={{color: '#1e3a5f'}}>
                <Calendar size={18} />
                <span>{t('nav.book')}</span>
              </Link>
              <Link to="/login" className="text-navy-900 hover:text-red-500 transition-colors font-medium" style={{color: '#1e3a5f'}}>
                {t('nav.login')}
              </Link>
              <Link to="/register" className="bg-gradient-to-r from-red-500 to-pink-500 text-white px-6 py-2.5 rounded-full hover:shadow-lg transition-all font-medium">
                {t('nav.signup')}
              </Link>
              <LanguageSelector variant="compact" />
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="md:hidden p-2 rounded-lg hover:bg-slate-100 transition-colors"
            >
              {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden bg-white border-t border-slate-200">
            <div className="px-4 py-6 space-y-4">
              <a href="#services" className="block text-navy-900 hover:text-red-500 transition-colors font-medium" style={{color: '#1e3a5f'}}>{t('nav.services')}</a>
              <a href="#about" className="block text-navy-900 hover:text-red-500 transition-colors font-medium" style={{color: '#1e3a5f'}}>{t('nav.about')}</a>
              <a href="#pricing" className="block text-navy-900 hover:text-red-500 transition-colors font-medium" style={{color: '#1e3a5f'}}>{t('nav.pricing')}</a>
              <Link to="/appointments" className="flex items-center space-x-2 text-navy-900 hover:text-red-500 transition-colors font-medium" style={{color: '#1e3a5f'}}>
                <Calendar size={18} />
                <span>{t('hero.bookAppointment')}</span>
              </Link>
              <Link to="/login" className="block text-navy-900 hover:text-red-500 transition-colors font-medium" style={{color: '#1e3a5f'}}>
                {t('nav.login')}
              </Link>
              <Link to="/register" className="block bg-gradient-to-r from-red-500 to-pink-500 text-white px-6 py-3 rounded-full text-center font-medium">
                {t('nav.signup')}
              </Link>
              <div className="pt-4 border-t border-slate-200">
                <LanguageSelector variant="compact" />
              </div>
            </div>
          </div>
        )}
      </nav>

      {/* Hero Section */}
      <section className="relative pt-32 pb-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-slate-100 to-white">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-8">
              <div className="space-y-6">
               
                <h1 className="font-display text-5xl sm:text-6xl lg:text-7xl font-bold leading-tight" style={{color: '#1e3a5f'}}>
                  {t('hero.title1')}
                  <br />
                  <span className="text-red-500">{t('hero.title2')}</span>
                </h1>
                <p className="text-xl text-slate-600 leading-relaxed">
                  {t('hero.subtitle')}
                </p>
              </div>

              <div className="flex flex-wrap gap-4">
                <a
                  href="#services"
                  className="px-8 py-4 bg-gradient-to-r from-red-500 to-pink-500 text-white rounded-full hover:shadow-xl transition-all font-semibold inline-flex items-center space-x-2"
                >
                  <span>{t('hero.ourServices')}</span>
                  <ChevronRight size={20} />
                </a>
                <a
                  href="#contact"
                  className="px-8 py-4 border-2 border-red-500 text-red-500 rounded-full hover:bg-red-500 hover:text-white transition-all font-semibold"
                >
                  {t('hero.getInTouch')}
                </a>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 pt-8 border-t-2 border-slate-200">
                {stats.map((stat, idx) => (
                  <div key={idx} className="text-center">
                    <div className="inline-flex items-center justify-center w-12 h-12 bg-gradient-to-br from-cyan-400 to-cyan-500 rounded-full mb-2 text-white shadow-lg">
                      <stat.icon size={24} />
                    </div>
                    <div className="font-display text-3xl font-bold" style={{color: '#1e3a5f'}}>{stat.value}</div>
                    <div className="text-sm text-slate-600">{stat.label}</div>
                  </div>
                ))}
              </div>
            </div>

            <div className="relative">
              <div className="relative z-10 rounded-3xl overflow-hidden shadow-2xl">
                <img
                  src="https://images.unsplash.com/photo-1576765608535-5f04d1e3f289?w=800&h=1000&fit=crop"
                  alt="Healthcare professional"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="absolute -bottom-6 -right-6 w-48 h-48 bg-red-200 rounded-full -z-10 blur-2xl opacity-60" />
              <div className="absolute -top-6 -left-6 w-32 h-32 bg-cyan-200 rounded-full -z-10 blur-2xl opacity-60" />
            </div>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section id="services" className="py-20 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="font-display text-4xl sm:text-5xl font-bold mb-4" style={{color: '#1e3a5f'}}>
              {t('services.title')}
            </h2>
            <p className="text-xl text-slate-600">
              {t('services.subtitle')}
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {services.map((service, idx) => (
              <div
                key={service.id}
                className={`${service.color} border-2 rounded-3xl p-8 hover:shadow-xl transition-all duration-300 cursor-pointer`}
                onClick={() => setActiveService(activeService === service.id ? null : service.id)}
              >
                <div className="flex items-start space-x-4 mb-6">
                  <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center shadow-md flex-shrink-0">
                    <service.icon size={32} className="text-red-500" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-display text-2xl font-bold mb-1" style={{color: '#1e3a5f'}}>{service.title}</h3>
                    <p className="text-sm text-slate-600">{service.subtitle}</p>
                  </div>
                </div>
                <p className="text-slate-700 leading-relaxed mb-4">{service.description}</p>

                {activeService === service.id && (
                  <div className="space-y-3 pt-4 border-t-2 border-white">
                    {service.features.map((feature, fIdx) => (
                      <div key={fIdx} className="flex items-center space-x-2 text-sm">
                        <Check size={16} className="text-red-500 flex-shrink-0" />
                        <span className="text-slate-700">{feature}</span>
                      </div>
                    ))}
                    <div className="mt-4 px-4 py-3 bg-white rounded-xl text-center font-bold text-red-500 shadow-sm">
                      {service.price}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* About/Values Section */}
      <section id="about" className="py-20 px-4 sm:px-6 lg:px-8 bg-slate-50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="font-display text-4xl sm:text-5xl font-bold mb-4" style={{color: '#1e3a5f'}}>
              {t('about.whyChooseUs')}
            </h2>
            <p className="text-xl text-slate-600">
              {t('about.commitment')}
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-white rounded-3xl p-8 shadow-sm">
              <div className="w-16 h-16 bg-gradient-to-br from-red-500 to-pink-500 rounded-2xl flex items-center justify-center mb-6 shadow-lg">
                <Heart className="text-white" size={32} />
              </div>
              <h3 className="font-display text-2xl font-bold mb-3" style={{color: '#1e3a5f'}}>{t('about.compassionateCare')}</h3>
              <p className="text-slate-600 leading-relaxed">
                {t('about.compassionateCareDesc')}
              </p>
            </div>

            <div className="bg-white rounded-3xl p-8 shadow-sm">
              <div className="w-16 h-16 bg-gradient-to-br from-yellow-500 to-amber-500 rounded-2xl flex items-center justify-center mb-6 shadow-lg">
                <Shield className="text-white" size={32} />
              </div>
              <h3 className="font-display text-2xl font-bold mb-3" style={{color: '#1e3a5f'}}>{t('about.licensedProfessionals')}</h3>
              <p className="text-slate-600 leading-relaxed">
                {t('about.licensedProfessionalsDesc')}
              </p>
            </div>

            <div className="bg-white rounded-3xl p-8 shadow-sm">
              <div className="w-16 h-16 bg-gradient-to-br from-cyan-400 to-cyan-500 rounded-2xl flex items-center justify-center mb-6 shadow-lg">
                <Clock className="text-white" size={32} />
              </div>
              <h3 className="font-display text-2xl font-bold mb-3" style={{color: '#1e3a5f'}}>{t('about.alwaysAvailable')}</h3>
              <p className="text-slate-600 leading-relaxed">
                {t('about.alwaysAvailableDesc')}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="py-20 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="font-display text-4xl sm:text-5xl font-bold mb-4" style={{color: '#1e3a5f'}}>
              {t('pricing.title')} <span className="text-red-500">{t('pricing.titleHighlight')}</span>
            </h2>
            <p className="text-xl text-slate-600">
              {t('pricing.subtitle')}
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {/* Home Care */}
            <div className="bg-cyan-50 border-2 border-cyan-200 rounded-3xl p-8">
              <div className="flex items-center space-x-3 mb-6">
                <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center shadow-sm">
                  <Home className="text-cyan-600" size={24} />
                </div>
                <div>
                  <h3 className="font-display text-2xl font-bold" style={{color: '#1e3a5f'}}>{t('pricing.homeCare')}</h3>
                  <p className="text-sm text-slate-600">{t('pricing.homeCareSubtitle')}</p>
                </div>
              </div>
              <div className="mb-6">
                <div className="font-display text-4xl font-bold text-red-500 mb-2">€32<span className="text-xl text-slate-600">{t('pricing.perHour')}</span></div>
                <p className="text-sm text-slate-600">{t('pricing.homeCareRate')}</p>
              </div>
              <ul className="space-y-3 text-sm text-slate-700">
                <li className="flex items-start"><Check size={16} className="text-red-500 mr-2 mt-0.5 flex-shrink-0" />{t('pricing.homeCareFeature1')}</li>
                <li className="flex items-start"><Check size={16} className="text-red-500 mr-2 mt-0.5 flex-shrink-0" />{t('pricing.homeCareFeature2')}</li>
                <li className="flex items-start"><Check size={16} className="text-red-500 mr-2 mt-0.5 flex-shrink-0" />{t('pricing.homeCareFeature3')}</li>
              </ul>
            </div>

            {/* Nursing */}
            <div className="bg-red-50 border-2 border-red-200 rounded-3xl p-8">
              <div className="flex items-center space-x-3 mb-6">
                <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center shadow-sm">
                  <Stethoscope className="text-red-500" size={24} />
                </div>
                <div>
                  <h3 className="font-display text-2xl font-bold" style={{color: '#1e3a5f'}}>{t('pricing.nursing')}</h3>
                  <p className="text-sm text-slate-600">{t('pricing.nursingSubtitle')}</p>
                </div>
              </div>
              <div className="mb-6">
                <div className="font-display text-4xl font-bold text-red-500 mb-2">€59<span className="text-xl text-slate-600">{t('pricing.perHour')}</span></div>
                <p className="text-sm text-slate-600">{t('pricing.nursingRate')}</p>
              </div>
              <ul className="space-y-3 text-sm text-slate-700">
                <li className="flex items-start"><Check size={16} className="text-red-500 mr-2 mt-0.5 flex-shrink-0" />{t('pricing.nursingFeature1')}</li>
                <li className="flex items-start"><Check size={16} className="text-red-500 mr-2 mt-0.5 flex-shrink-0" />{t('pricing.nursingFeature2')}</li>
                <li className="flex items-start"><Check size={16} className="text-red-500 mr-2 mt-0.5 flex-shrink-0" />{t('pricing.nursingFeature3')}</li>
              </ul>
            </div>

            {/* Cleaning */}
            <div className="bg-blue-50 border-2 border-blue-200 rounded-3xl p-8">
              <div className="flex items-center space-x-3 mb-6">
                <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center shadow-sm">
                  <Sparkles className="text-blue-600" size={24} />
                </div>
                <div>
                  <h3 className="font-display text-2xl font-bold" style={{color: '#1e3a5f'}}>{t('pricing.cleaning')}</h3>
                  <p className="text-sm text-slate-600">{t('pricing.cleaningSubtitle')}</p>
                </div>
              </div>
              <div className="mb-6">
                <div className="font-display text-4xl font-bold text-red-500 mb-2">€37.82<span className="text-xl text-slate-600">{t('pricing.perHour')}</span></div>
                <p className="text-sm text-slate-600">{t('pricing.cleaningRate')}</p>
              </div>
              <ul className="space-y-3 text-sm text-slate-700">
                <li className="flex items-start"><Check size={16} className="text-red-500 mr-2 mt-0.5 flex-shrink-0" />{t('pricing.cleaningFeature1')}</li>
                <li className="flex items-start"><Check size={16} className="text-red-500 mr-2 mt-0.5 flex-shrink-0" />{t('pricing.cleaningFeature2')}</li>
                <li className="flex items-start"><Check size={16} className="text-red-500 mr-2 mt-0.5 flex-shrink-0" />{t('pricing.cleaningFeature3')}</li>
              </ul>
            </div>

            {/* Palliative */}
            <div className="bg-rose-50 border-2 border-rose-200 rounded-3xl p-8">
              <div className="flex items-center space-x-3 mb-6">
                <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center shadow-sm">
                  <Heart className="text-red-500" size={24} />
                </div>
                <div>
                  <h3 className="font-display text-2xl font-bold" style={{color: '#1e3a5f'}}>{t('pricing.palliative')}</h3>
                  <p className="text-sm text-slate-600">{t('pricing.palliativeSubtitle')}</p>
                </div>
              </div>
              <div className="mb-6">
                <div className="font-display text-3xl font-bold text-red-500 mb-2">{t('pricing.customQuote')}</div>
                <p className="text-sm text-slate-600">{t('pricing.palliativeRate')}</p>
              </div>
              <ul className="space-y-3 text-sm text-slate-700">
                <li className="flex items-start"><Check size={16} className="text-red-500 mr-2 mt-0.5 flex-shrink-0" />{t('pricing.palliativeFeature1')}</li>
                <li className="flex items-start"><Check size={16} className="text-red-500 mr-2 mt-0.5 flex-shrink-0" />{t('pricing.palliativeFeature2')}</li>
                <li className="flex items-start"><Check size={16} className="text-red-500 mr-2 mt-0.5 flex-shrink-0" />{t('pricing.palliativeFeature3')}</li>
              </ul>
            </div>
          </div>

          {/* Additional Info */}
          <div className="mt-12 bg-slate-50 rounded-3xl p-8">
            <div className="grid md:grid-cols-3 gap-6 text-center">
              <div>
                <div className="text-2xl mb-2">✓</div>
                <h4 className="font-bold mb-2" style={{color: '#1e3a5f'}}>{t('pricing.serviceVouchers')}</h4>
                <p className="text-sm text-slate-600">{t('pricing.serviceVouchersDesc')}</p>
              </div>
              <div>
                <div className="text-2xl mb-2">✓</div>
                <h4 className="font-bold mb-2" style={{color: '#1e3a5f'}}>{t('pricing.flexiblePlans')}</h4>
                <p className="text-sm text-slate-600">{t('pricing.flexiblePlansDesc')}</p>
              </div>
              <div>
                <div className="text-2xl mb-2">✓</div>
                <h4 className="font-bold mb-2" style={{color: '#1e3a5f'}}>{t('pricing.noHiddenFees')}</h4>
                <p className="text-sm text-slate-600">{t('pricing.noHiddenFeesDesc')}</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section id="testimonials" className="py-20 px-4 sm:px-6 lg:px-8 bg-slate-50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="font-display text-4xl sm:text-5xl font-bold mb-4" style={{color: '#1e3a5f'}}>
              {t('testimonials.title')} <span className="text-red-500">{t('testimonials.titleHighlight')}</span>
            </h2>
            <p className="text-xl text-slate-600">
              {t('testimonials.subtitle')}
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, idx) => (
              <div key={idx} className="bg-white rounded-3xl p-8 shadow-sm">
                <div className="flex space-x-1 mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} size={20} className="text-yellow-400 fill-yellow-400" />
                  ))}
                </div>
                <p className="text-slate-700 leading-relaxed mb-6 italic">"{testimonial.text}"</p>
                <div className="border-t-2 border-slate-100 pt-4">
                  <div className="font-bold" style={{color: '#1e3a5f'}}>{testimonial.name}</div>
                  <div className="text-sm text-slate-600">{testimonial.role}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Feedback Section */}
      <section id="feedback" className="py-20 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-4xl mx-auto">
          <div className="text-center max-w-3xl mx-auto mb-12">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-purple-500 to-pink-500 rounded-2xl mb-6 shadow-lg">
              <MessageSquare className="text-white" size={32} />
            </div>
            <h2 className="font-display text-4xl sm:text-5xl font-bold mb-4" style={{color: '#1e3a5f'}}>
              {t('feedback.title')} <span className="text-red-500">{t('feedback.titleHighlight')}</span>
            </h2>
            <p className="text-xl text-slate-600">
              {t('feedback.subtitle')}
            </p>
          </div>

          <div className="bg-slate-50 rounded-3xl p-8">
            <form onSubmit={handleFeedbackFormSubmit} className="space-y-6">
              {feedbackStatus.message && (
                <div className={`p-4 rounded-2xl ${
                  feedbackStatus.type === 'success'
                    ? 'bg-green-50 border-2 border-green-200 text-green-800'
                    : 'bg-red-50 border-2 border-red-200 text-red-800'
                }`}>
                  {feedbackStatus.message}
                </div>
              )}

              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-bold mb-2" style={{color: '#1e3a5f'}}>{t('feedback.fullName')}</label>
                  <input
                    type="text"
                    name="full_name"
                    value={feedbackForm.full_name}
                    onChange={handleFeedbackFormChange}
                    className="w-full px-4 py-3 rounded-2xl border-2 border-white bg-white focus:border-red-500 focus:outline-none transition-colors"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-bold mb-2" style={{color: '#1e3a5f'}}>{t('feedback.email')}</label>
                  <input
                    type="email"
                    name="email"
                    value={feedbackForm.email}
                    onChange={handleFeedbackFormChange}
                    className="w-full px-4 py-3 rounded-2xl border-2 border-white bg-white focus:border-red-500 focus:outline-none transition-colors"
                    required
                  />
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-bold mb-2" style={{color: '#1e3a5f'}}>{t('feedback.service')}</label>
                  <select
                    name="service_type"
                    value={feedbackForm.service_type}
                    onChange={handleFeedbackFormChange}
                    className="w-full px-4 py-3 rounded-2xl border-2 border-white bg-white focus:border-red-500 focus:outline-none transition-colors"
                  >
                    <option value="Home Care Services">{t('services.homeCare')}</option>
                    <option value="Home Nursing">{t('services.nursing')}</option>
                    <option value="Home Cleaning">{t('services.cleaning')}</option>
                    <option value="Palliative Care">{t('services.palliative')}</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-bold mb-2" style={{color: '#1e3a5f'}}>{t('feedback.rating')}</label>
                  <div className="flex items-center space-x-2 bg-white rounded-2xl px-4 py-3 border-2 border-white">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        type="button"
                        onClick={() => setFeedbackForm(prev => ({ ...prev, rating: star }))}
                        className="focus:outline-none transition-transform hover:scale-110"
                      >
                        <Star
                          size={28}
                          className={`${
                            star <= feedbackForm.rating
                              ? 'text-yellow-400 fill-yellow-400'
                              : 'text-slate-300'
                          }`}
                        />
                      </button>
                    ))}
                    <span className="ml-2 text-sm text-slate-600">
                      {feedbackForm.rating} {t('feedback.stars')}
                    </span>
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-sm font-bold mb-2" style={{color: '#1e3a5f'}}>{t('feedback.message')}</label>
                <textarea
                  name="message"
                  value={feedbackForm.message}
                  onChange={handleFeedbackFormChange}
                  rows="4"
                  className="w-full px-4 py-3 rounded-2xl border-2 border-white bg-white focus:border-red-500 focus:outline-none transition-colors resize-none"
                  placeholder={t('feedback.messagePlaceholder')}
                  required
                />
              </div>

              <button
                type="submit"
                disabled={isSubmittingFeedback}
                className="w-full px-8 py-4 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-full hover:shadow-xl transition-all font-bold disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmittingFeedback ? t('feedback.submitting') : t('feedback.submit')}
              </button>
            </form>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="py-20 px-4 sm:px-6 lg:px-8 bg-slate-50">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12">
            <div className="space-y-8">
              <div>
                <h2 className="font-display text-4xl sm:text-5xl font-bold mb-4" style={{color: '#1e3a5f'}}>
                  {t('contact.title')}
                </h2>
                <p className="text-xl text-slate-600">
                  {t('contact.subtitle')}
                </p>
              </div>

              <div className="space-y-6">
                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-cyan-400 to-cyan-500 rounded-2xl flex items-center justify-center flex-shrink-0 shadow-lg">
                    <Phone className="text-white" size={20} />
                  </div>
                  <div>
                    <div className="font-bold mb-1" style={{color: '#1e3a5f'}}>{t('contact.phone')}</div>
                    <a href="tel:+358961500069" className="text-slate-600 hover:text-red-500 transition-colors">
                      +358 (09) 615 000 69
                    </a>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-yellow-500 to-amber-500 rounded-2xl flex items-center justify-center flex-shrink-0 shadow-lg">
                    <Mail className="text-white" size={20} />
                  </div>
                  <div>
                    <div className="font-bold mb-1" style={{color: '#1e3a5f'}}>{t('contact.email')}</div>
                    <a href="mailto:info@bridgehoito.fi" className="text-slate-600 hover:text-red-500 transition-colors">
                      info@bridgehoito.fi
                    </a>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-red-500 to-pink-500 rounded-2xl flex items-center justify-center flex-shrink-0 shadow-lg">
                    <MapPin className="text-white" size={20} />
                  </div>
                  <div>
                    <div className="font-bold mb-1" style={{color: '#1e3a5f'}}>{t('contact.serviceArea')}</div>
                    <p className="text-slate-600">
                      {t('contact.serviceAreaText')}
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-slate-50 rounded-3xl p-6">
                <h3 className="font-bold mb-4" style={{color: '#1e3a5f'}}>{t('contact.officeHours')}</h3>
                <div className="space-y-2 text-sm text-slate-700">
                  <div className="flex justify-between">
                    <span>{t('contact.mondayFriday')}</span>
                    <span className="font-medium">8:00 - 20:00</span>
                  </div>
                  <div className="flex justify-between">
                    <span>{t('contact.weekend')}</span>
                    <span className="font-medium">9:00 - 18:00</span>
                  </div>
                  <div className="flex justify-between">
                    <span>{t('contact.emergency')}</span>
                    <span className="font-medium text-red-500">{t('contact.emergencyAvailable')}</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-slate-50 rounded-3xl p-8">
              <form onSubmit={handleContactFormSubmit} className="space-y-6">
                {formStatus.message && (
                  <div className={`p-4 rounded-2xl ${
                    formStatus.type === 'success'
                      ? 'bg-green-50 border-2 border-green-200 text-green-800'
                      : 'bg-red-50 border-2 border-red-200 text-red-800'
                  }`}>
                    {formStatus.message}
                  </div>
                )}

                <div>
                  <label className="block text-sm font-bold mb-2" style={{color: '#1e3a5f'}}>{t('contact.fullName')}</label>
                  <input
                    type="text"
                    name="full_name"
                    value={contactForm.full_name}
                    onChange={handleContactFormChange}
                    className="w-full px-4 py-3 rounded-2xl border-2 border-white bg-white focus:border-red-500 focus:outline-none transition-colors"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-bold mb-2" style={{color: '#1e3a5f'}}>{t('contact.email')}</label>
                  <input
                    type="email"
                    name="email"
                    value={contactForm.email}
                    onChange={handleContactFormChange}
                    className="w-full px-4 py-3 rounded-2xl border-2 border-white bg-white focus:border-red-500 focus:outline-none transition-colors"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-bold mb-2" style={{color: '#1e3a5f'}}>{t('contact.phone')}</label>
                  <input
                    type="tel"
                    name="phone"
                    value={contactForm.phone}
                    onChange={handleContactFormChange}
                    className="w-full px-4 py-3 rounded-2xl border-2 border-white bg-white focus:border-red-500 focus:outline-none transition-colors"
                    placeholder="+358 123 456 789"
                  />
                </div>

                <div>
                  <label className="block text-sm font-bold mb-2" style={{color: '#1e3a5f'}}>{t('contact.service')}</label>
                  <select
                    name="service_needed"
                    value={contactForm.service_needed}
                    onChange={handleContactFormChange}
                    className="w-full px-4 py-3 rounded-2xl border-2 border-white bg-white focus:border-red-500 focus:outline-none transition-colors"
                  >
                    <option value="Home Care Services">{t('services.homeCare')}</option>
                    <option value="Home Nursing">{t('services.nursing')}</option>
                    <option value="Home Cleaning">{t('services.cleaning')}</option>
                    <option value="Palliative Care">{t('services.palliative')}</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-bold mb-2" style={{color: '#1e3a5f'}}>{t('contact.message')}</label>
                  <textarea
                    name="message"
                    value={contactForm.message}
                    onChange={handleContactFormChange}
                    rows="4"
                    className="w-full px-4 py-3 rounded-2xl border-2 border-white bg-white focus:border-red-500 focus:outline-none transition-colors resize-none"
                    placeholder="Tell us how we can help..."
                  />
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full px-8 py-4 bg-gradient-to-r from-red-500 to-pink-500 text-white rounded-full hover:shadow-xl transition-all font-bold disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? t('contact.sending') : t('contact.send')}
                </button>
              </form>
            </div>
          </div>
        </div>
      </section>

      {/* Floating Book Appointment Button (Mobile Only) */}
      {showFloatingButton && (
        <Link
          to="/appointments"
          className="md:hidden fixed bottom-6 right-6 z-40 flex items-center space-x-2 px-6 py-4 bg-gradient-to-r from-red-500 to-pink-500 text-white rounded-full shadow-2xl hover:shadow-3xl transition-all font-bold animate-bounce"
          style={{ animation: 'bounce 2s infinite' }}
        >
          <Calendar size={20} />
          <span>{t('hero.bookNow')}</span>
        </Link>
      )}

      {/* Footer */}
      <footer className="bg-gradient-to-br from-slate-800 to-slate-900 text-slate-300 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            <div>
              <div className="flex items-center space-x-3 mb-4">
                <div className="w-12 h-12 rounded-full flex items-center justify-center overflow-hidden bg-white shadow-lg">
                  <img
                    src="/logo.jpeg"
                    alt="Bridge Hoito Oy Logo"
                    className="w-full h-full object-cover scale-110"
                  />
                </div>
                <span className="font-display text-xl font-bold text-white">Bridge Hoito Oy</span>
              </div>
              <p className="text-sm text-slate-400">
                {t('footer.description')}
              </p>
            </div>

            <div>
              <h3 className="font-bold text-white mb-4">{t('footer.services')}</h3>
              <ul className="space-y-2 text-sm">
                <li><a href="#services" className="hover:text-red-400 transition-colors">{t('footer.homeCare')}</a></li>
                <li><a href="#services" className="hover:text-red-400 transition-colors">{t('footer.nursing')}</a></li>
                <li><a href="#services" className="hover:text-red-400 transition-colors">{t('footer.cleaning')}</a></li>
                <li><a href="#services" className="hover:text-red-400 transition-colors">{t('footer.palliativeCare')}</a></li>
              </ul>
            </div>

            <div>
              <h3 className="font-bold text-white mb-4">{t('footer.company')}</h3>
              <ul className="space-y-2 text-sm">
                <li><a href="#about" className="hover:text-red-400 transition-colors">{t('footer.aboutUs')}</a></li>
                <li><a href="#" className="hover:text-red-400 transition-colors">{t('footer.careers')}</a></li>
                <li><a href="#" className="hover:text-red-400 transition-colors">{t('footer.privacy')}</a></li>
                <li><a href="#" className="hover:text-red-400 transition-colors">{t('footer.terms')}</a></li>
              </ul>
            </div>

            <div>
              <h3 className="font-bold text-white mb-4">{t('footer.stayUpdated')}</h3>
              <p className="text-sm text-slate-400 mb-3">{t('footer.healthTips')}</p>
              <div className="flex space-x-2">
                <input
                  type="email"
                  placeholder={t('footer.yourEmail')}
                  className="flex-1 px-4 py-2 rounded-full bg-slate-700 border border-slate-600 text-white text-sm focus:outline-none focus:border-red-400"
                />
                <button className="px-4 py-2 bg-gradient-to-r from-red-500 to-pink-500 rounded-full hover:shadow-lg transition-all">
                  <ChevronRight size={20} />
                </button>
              </div>
            </div>
          </div>

          <div className="pt-8 border-t border-slate-700 text-center text-sm text-slate-400">
            <p>© 2025 Bridge Hoito Oy. {t('footer.rights')}</p>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default HomePage;
