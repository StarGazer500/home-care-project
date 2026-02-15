import { useState, useEffect, useRef } from 'react';
import { Heart, Home, Stethoscope, Sparkles, Phone, Mail, MapPin, ChevronRight, ChevronLeft, Check, Menu, X, Users, Clock, Shield, Award, Star, Calendar, MessageSquare, UserCheck, Moon, Sun, CalendarDays, Ticket, FileText, Calculator, Footprints, HeartHandshake, Info, AlertCircle } from 'lucide-react';
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
  const [currentServiceIndex, setCurrentServiceIndex] = useState(0);
  const observerRef = useRef(null);
  const carouselRef = useRef(null);

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

  // Carousel scroll handler to update current index
  useEffect(() => {
    const carousel = carouselRef.current;
    if (!carousel) return;

    const handleCarouselScroll = () => {
      const scrollLeft = carousel.scrollLeft;
      const itemWidth = carousel.children[0]?.offsetWidth || 0;
      const gap = 16; // 4 * 4px (gap-4)
      const newIndex = Math.round(scrollLeft / (itemWidth + gap));
      setCurrentServiceIndex(Math.min(newIndex, 4)); // 5 services (0-4)
    };

    carousel.addEventListener('scroll', handleCarouselScroll);
    return () => carousel.removeEventListener('scroll', handleCarouselScroll);
  }, []);

  // Auto-scroll carousel every 4 seconds on mobile
  useEffect(() => {
    const carousel = carouselRef.current;
    if (!carousel) return;

    // Only auto-scroll on mobile/tablet (lg breakpoint is 1024px)
    const isDesktop = window.innerWidth >= 1024;
    if (isDesktop) return;

    const autoScrollInterval = setInterval(() => {
      const totalServices = 5;
      const nextIndex = (currentServiceIndex + 1) % totalServices;

      const itemWidth = carousel.children[0]?.offsetWidth || 0;
      const gap = 16; // gap-4 = 16px
      const scrollPosition = nextIndex * (itemWidth + gap);
      carousel.scrollTo({
        left: scrollPosition,
        behavior: 'smooth'
      });
    }, 4000); // Scroll every 4 seconds

    return () => clearInterval(autoScrollInterval);
  }, [currentServiceIndex]);

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
      features: [t('services.homeCareFeature1') || 'Personal hygiene assistance', t('services.homeCareFeature2') || 'Meal preparation', t('services.homeCareFeature3') || 'Mobility support', t('services.homeCareFeature4') || 'Medication reminders'],
      price: `${t('services.from')} €32/${t('services.hour')}`,
      color: 'bg-cyan-50 border-cyan-200',
      image: 'https://images.pexels.com/photos/7551617/pexels-photo-7551617.jpeg?auto=compress&cs=tinysrgb&w=600',
      imageAlt: 'Caregiver helping elderly person at home'
    },
    {
      id: 'nursing',
      icon: Stethoscope,
      title: t('services.nursing'),
      subtitle: t('services.nursingSubtitle') || 'Professional medical care',
      description: t('services.nursingDesc'),
      features: [t('services.nursingFeature1') || 'Wound care', t('services.nursingFeature2') || 'Injections & medications', t('services.nursingFeature3') || 'Health monitoring', t('services.nursingFeature4') || 'Post-surgery care'],
      price: `${t('services.from')} €59/${t('services.hour')}`,
      color: 'bg-red-50 border-red-200',
      image: 'https://images.unsplash.com/photo-1576765608866-5b51046452be?q=80&w=878&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
      imageAlt: 'Nurse checking blood pressure of elderly patient'
    },
    {
      id: 'cleaning',
      icon: Sparkles,
      title: t('services.cleaning'),
      subtitle: t('services.cleaningSubtitle') || 'Professional housekeeping',
      description: t('services.cleaningDesc'),
      features: [t('services.cleaningFeature1') || 'Regular cleaning', t('services.cleaningFeature2') || 'Deep cleaning', t('services.cleaningFeature3') || 'Window washing', t('services.cleaningFeature4') || 'Moving assistance'],
      price: `${t('services.from')} €37.82/${t('services.hour')}`,
      color: 'bg-blue-50 border-blue-200',
      image: 'https://images.pexels.com/photos/4239091/pexels-photo-4239091.jpeg?auto=compress&cs=tinysrgb&w=600',
      imageAlt: 'Professional home cleaning service'
    },
    {
      id: 'palliative',
      icon: Heart,
      title: t('services.palliative'),
      subtitle: t('services.palliativeSubtitle') || 'Compassionate end-of-life care',
      description: t('services.palliativeDesc'),
      features: [t('services.palliativeFeature1') || '24/7 care options', t('services.palliativeFeature2') || 'Pain management', t('services.palliativeFeature3') || 'Emotional support', t('services.palliativeFeature4') || 'Family counseling'],
      price: t('services.customPricing') || 'Custom pricing',
      color: 'bg-rose-50 border-rose-200',
      image: 'https://images.pexels.com/photos/7551667/pexels-photo-7551667.jpeg?auto=compress&cs=tinysrgb&w=600',
      imageAlt: 'Compassionate care for elderly'
    },
    {
      id: 'personal-assistant',
      icon: UserCheck,
      title: t('services.personalAssistant') || 'Personal Assistant',
      subtitle: t('services.personalAssistantSubtitle') || 'Your dedicated helper',
      description: t('services.personalAssistantDesc') || 'Personalized assistance for errands, appointments, shopping, and daily tasks to help you maintain independence.',
      features: [t('services.personalAssistantFeature1') || 'Errand running', t('services.personalAssistantFeature2') || 'Appointment accompaniment', t('services.personalAssistantFeature3') || 'Shopping assistance', t('services.personalAssistantFeature4') || 'Administrative help'],
      price: `${t('services.from')} €35/${t('services.hour')}`,
      color: 'bg-purple-50 border-purple-200',
      image: 'https://images.pexels.com/photos/7551619/pexels-photo-7551619.jpeg?auto=compress&cs=tinysrgb&w=600',
      imageAlt: 'Personal assistant helping with daily tasks'
    }
  ];

  const getStats = () => [
   
    { icon: Clock, value: '24/7', label: t('hero.availability') },
    { icon: Shield, value: '100%', label: t('hero.licensedStaff') }
  ];

  const services = getServices();
  const stats = getStats();

  

  

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800">
      {/* Navigation */}
      <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${scrolled ? 'bg-white/95 backdrop-blur-sm shadow-sm' : 'bg-transparent'}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-row items-center justify-between h-20">
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
                <p className="text-xs text-cyan-600">{t('nav.tagline')}</p>
              </div>
              
            </Link>
            
            

            {/* Desktop Menu */}
            <div className="hidden md:flex items-center space-x-6">
              <a href="#services" className="text-navy-900 hover:text-red-500 transition-colors font-medium" style={{color: '#1e3a5f'}}>{t('nav.services')}</a>
              <a href="#about" className="text-navy-900 hover:text-red-500 transition-colors font-medium" style={{color: '#1e3a5f'}}>{t('nav.about')}</a>
              <a href="#pricing" className="text-navy-900 hover:text-red-500 transition-colors font-medium" style={{color: '#1e3a5f'}}>{t('nav.pricing')}</a>
              <a href="#feedback" className="text-navy-900 hover:text-red-500 transition-colors font-medium" style={{color: '#1e3a5f'}}>{t('nav.feedback') || 'Feedback'}</a>
              <a href="#contact" className="text-navy-900 hover:text-red-500 transition-colors font-medium" style={{color: '#1e3a5f'}}>{t('nav.contact') || 'Contact'}</a>
              <Link to="/appointments" className="flex items-center space-x-2 text-navy-900 hover:text-red-500 transition-colors font-medium" style={{color: '#1e3a5f'}}>
                {/* <Calendar size={18} /> */}
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
           
                <div className=" md:hidden  ">
                  <LanguageSelector variant="compact" />
                </div>

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
          
          
          <div className="md:hidden  bg-white border-t border-slate-200 max-h-[80vh] overflow-y-auto">
            
            <div className="px-4 py-6 space-y-4">
              <a href="#services" onClick={() => setIsMenuOpen(false)} className="block text-navy-900 hover:text-red-500 transition-colors font-medium" style={{color: '#1e3a5f'}}>{t('nav.services')}</a>
              <a href="#about" onClick={() => setIsMenuOpen(false)} className="block text-navy-900 hover:text-red-500 transition-colors font-medium" style={{color: '#1e3a5f'}}>{t('nav.about')}</a>
              <a href="#pricing" onClick={() => setIsMenuOpen(false)} className="block text-navy-900 hover:text-red-500 transition-colors font-medium" style={{color: '#1e3a5f'}}>{t('nav.pricing')}</a>
              <a href="#feedback" onClick={() => setIsMenuOpen(false)} className="flex items-center space-x-2 text-navy-900 hover:text-red-500 transition-colors font-medium" style={{color: '#1e3a5f'}}>
                {/* <MessageSquare size={18} /> */}
                <span>{t('nav.feedback') || 'Share Feedback'}</span>
              </a>
              <a href="#contact" onClick={() => setIsMenuOpen(false)} className="flex items-center space-x-2 text-navy-900 hover:text-red-500 transition-colors font-medium" style={{color: '#1e3a5f'}}>
                {/* <Phone size={18} /> */}
                <span>{t('nav.contact') || 'Contact Us'}</span>
              </a>
              <Link to="/appointments" onClick={() => setIsMenuOpen(false)} className="flex items-center space-x-2 text-navy-900 hover:text-red-500 transition-colors font-medium" style={{color: '#1e3a5f'}}>
                {/* <Calendar size={18} /> */}
                <span>{t('hero.bookAppointment')}</span>
              </Link>
              <Link to="/login" onClick={() => setIsMenuOpen(false)} className="block text-navy-900 hover:text-red-500 transition-colors font-medium" style={{color: '#1e3a5f'}}>
                {t('nav.login')}
              </Link>
              <Link to="/register" onClick={() => setIsMenuOpen(false)} className="block bg-gradient-to-r from-red-500 to-pink-500 text-white px-6 py-3 rounded-full text-center font-medium">
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
      <section className="relative pt-24 sm:pt-32 pb-12 sm:pb-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-slate-100 to-white">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col-reverse lg:grid lg:grid-cols-2 gap-8 lg:gap-12 items-center">
            <div className="space-y-6 sm:space-y-8">
              <div className="space-y-4 sm:space-y-6 text-center lg:text-left">
                <h1 className="font-display text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-bold leading-tight" style={{color: '#1e3a5f'}}>
                  {t('hero.title1')}
                  <br />
                  <span className="text-red-500">{t('hero.title2')}</span>
                </h1>
                <p className="text-lg sm:text-xl text-slate-600 leading-relaxed max-w-xl mx-auto lg:mx-0">
                  {t('hero.subtitle')}
                </p>
              </div>

              <div className="flex flex-col sm:flex-row flex-wrap gap-3 sm:gap-4 justify-center lg:justify-start">
                <a
                  href="#services"
                  className="px-6 sm:px-8 py-3 sm:py-4 bg-gradient-to-r from-red-500 to-pink-500 text-white rounded-full hover:shadow-xl transition-all font-semibold inline-flex items-center justify-center space-x-2"
                >
                  <span>{t('hero.ourServices')}</span>
                  <ChevronRight size={20} />
                </a>
                <a
                  href="#contact"
                  className="px-6 sm:px-8 py-3 sm:py-4 border-2 border-red-500 text-red-500 rounded-full hover:bg-red-500 hover:text-white transition-all font-semibold text-center"
                >
                  {t('hero.getInTouch')}
                </a>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-2 gap-4 sm:gap-6 pt-6 sm:pt-8 border-t-2 border-slate-200">
                {stats.map((stat, idx) => (
                  <div key={idx} className="text-center">
                    <div className="inline-flex items-center justify-center w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-cyan-400 to-cyan-500 rounded-full mb-2 text-white shadow-lg">
                      <stat.icon size={20} className="sm:hidden" />
                      <stat.icon size={24} className="hidden sm:block" />
                    </div>
                    <div className="font-display text-2xl sm:text-3xl font-bold" style={{color: '#1e3a5f'}}>{stat.value}</div>
                    <div className="text-xs sm:text-sm text-slate-600">{stat.label}</div>
                  </div>
                ))}
              </div>
            </div>

            <div className="relative w-full max-w-md lg:max-w-none mx-auto">
              <div className="relative z-10 rounded-2xl sm:rounded-3xl overflow-hidden shadow-2xl aspect-[4/3] sm:aspect-[3/4] lg:aspect-auto">
                <img
                  src="https://plus.unsplash.com/premium_photo-1663054397533-2a3fb0cab5de?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MXx8aG9tZSUyMGNhcmV8ZW58MHx8MHx8fDA%3D"
                  alt="Caregiver assisting elderly person at home"
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    e.target.src = 'https://placehold.co/800x600/D8725F/white?text=Home+Care+Services';
                  }}
                />
              </div>
              <div className="hidden sm:block absolute -bottom-6 -right-6 w-48 h-48 bg-red-200 rounded-full -z-10 blur-2xl opacity-60" />
              <div className="hidden sm:block absolute -top-6 -left-6 w-32 h-32 bg-cyan-200 rounded-full -z-10 blur-2xl opacity-60" />
            </div>
          </div>
        </div>
      </section>

      {/* Services Section with Carousel */}
      <section id="services" className="py-12 sm:py-20 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center max-w-3xl mx-auto mb-10 sm:mb-16">
            <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl font-bold mb-3 sm:mb-4" style={{color: '#1e3a5f'}}>
              {t('services.title')}
            </h2>
            <p className="text-lg sm:text-xl text-slate-600">
              {t('services.subtitle')}
            </p>
          </div>

          {/* Mobile Carousel */}
          <div className="lg:hidden relative">
            <div
              ref={carouselRef}
              className="overflow-x-auto snap-x snap-mandatory scrollbar-hide flex gap-4 pb-4"
              style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
            >
              {services.map((service, idx) => (
                <div
                  key={service.id}
                  className={`${service.color} border-2 rounded-2xl flex-shrink-0 w-[85vw] sm:w-[45vw] snap-center overflow-hidden`}
                >
                  {/* Service Image */}
                  <div className="relative h-40 sm:h-48 overflow-hidden">
                    <img
                      src={service.image}
                      alt={service.imageAlt}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        e.target.src = `https://placehold.co/600x400/D8725F/white?text=${encodeURIComponent(service.title)}`;
                      }}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
                    <div className="absolute bottom-3 left-3 w-10 h-10 bg-white/90 rounded-xl flex items-center justify-center shadow-md">
                      <service.icon size={20} className="text-red-500" />
                    </div>
                  </div>

                  {/* Service Content */}
                  <div className="p-4 sm:p-5">
                    <h3 className="font-display text-lg sm:text-xl font-bold mb-1" style={{color: '#1e3a5f'}}>{service.title}</h3>
                    <p className="text-xs text-slate-600 mb-2">{service.subtitle}</p>
                    <p className="text-sm text-slate-700 leading-relaxed mb-3 line-clamp-2">{service.description}</p>

                    <div className="flex flex-wrap gap-1.5 mb-3">
                      {service.features.slice(0, 3).map((feature, fIdx) => (
                        <span key={fIdx} className="inline-flex items-center text-xs bg-white/80 px-2 py-1 rounded-full">
                          <Check size={12} className="text-red-500 mr-1" />
                          {feature}
                        </span>
                      ))}
                    </div>

                    <Link
                      to="/appointments"
                      className="block w-full py-2.5 bg-gradient-to-r from-red-500 to-pink-500 rounded-xl text-white font-semibold text-center text-sm shadow-sm"
                    >
                      {t('hero.bookNow') || 'Book Now'}
                    </Link>
                  </div>
                </div>
              ))}
            </div>

            {/* Carousel Indicators */}
            <div className="flex justify-center gap-2 mt-4">
              {services.map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => {
                    setCurrentServiceIndex(idx);
                    carouselRef.current?.children[idx]?.scrollIntoView({ behavior: 'smooth', inline: 'center', block: 'nearest' });
                  }}
                  className={`w-2 h-2 rounded-full transition-all ${
                    currentServiceIndex === idx ? 'bg-red-500 w-6' : 'bg-slate-300'
                  }`}
                />
              ))}
            </div>
          </div>

          {/* Desktop Grid with Images */}
          <div className="hidden lg:grid lg:grid-cols-3 gap-6 lg:gap-8">
            {services.map((service, idx) => (
              <div
                key={service.id}
                className={`${service.color} border-2 rounded-3xl overflow-hidden hover:shadow-xl transition-all duration-300 cursor-pointer group`}
                onClick={() => setActiveService(activeService === service.id ? null : service.id)}
              >
                {/* Service Image */}
                <div className="relative h-48 overflow-hidden">
                  <img
                    src={service.image}
                    alt={service.imageAlt}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    onError={(e) => {
                      e.target.src = `https://placehold.co/600x400/D8725F/white?text=${encodeURIComponent(service.title)}`;
                    }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                  <div className="absolute bottom-4 left-4 w-12 h-12 bg-white/90 rounded-2xl flex items-center justify-center shadow-lg">
                    <service.icon size={24} className="text-red-500" />
                  </div>
                </div>

                {/* Service Content */}
                <div className="p-6 lg:p-8">
                  <h3 className="font-display text-xl lg:text-2xl font-bold mb-1" style={{color: '#1e3a5f'}}>{service.title}</h3>
                  <p className="text-sm text-slate-600 mb-3">{service.subtitle}</p>
                  <p className="text-base text-slate-700 leading-relaxed mb-4">{service.description}</p>

                  {activeService === service.id && (
                    <div className="space-y-3 pt-4 border-t-2 border-white animate-fadeInUp">
                      {service.features.map((feature, fIdx) => (
                        <div key={fIdx} className="flex items-center space-x-2 text-sm">
                          <Check size={16} className="text-red-500 flex-shrink-0" />
                          <span className="text-slate-700">{feature}</span>
                        </div>
                      ))}
                    </div>
                  )}

                  <div className="mt-4 flex gap-2">
                    <button className="flex-1 py-2.5 bg-white rounded-xl text-red-500 font-semibold hover:bg-red-50 transition-colors shadow-sm">
                      {t('services.learnMore') || 'Learn More'}
                    </button>
                    <Link
                      to="/appointments"
                      className="flex-1 py-2.5 bg-gradient-to-r from-red-500 to-pink-500 rounded-xl text-white font-semibold hover:shadow-lg transition-all text-center"
                      onClick={(e) => e.stopPropagation()}
                    >
                      {t('hero.bookNow') || 'Book Now'}
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* About/Values Section */}
      <section id="about" className="py-12 sm:py-20 px-4 sm:px-6 lg:px-8 bg-slate-50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center max-w-3xl mx-auto mb-10 sm:mb-16">
            <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl font-bold mb-3 sm:mb-4" style={{color: '#1e3a5f'}}>
              {t('about.whyChooseUs')}
            </h2>
            <p className="text-lg sm:text-xl text-slate-600">
              {t('about.commitment')}
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8">
            <div className="bg-white rounded-2xl sm:rounded-3xl p-6 sm:p-8 shadow-sm hover:shadow-md transition-shadow text-center">
              <div className="w-12 h-12 sm:w-14 sm:h-14 lg:w-16 lg:h-16 bg-gradient-to-br from-red-500 to-pink-500 rounded-xl sm:rounded-2xl flex items-center justify-center mb-4 sm:mb-6 shadow-lg mx-auto">
                <Heart className="text-white" size={24} />
              </div>
              <h3 className="font-display text-xl sm:text-2xl font-bold mb-2 sm:mb-3" style={{color: '#1e3a5f'}}>{t('about.compassionateCare')}</h3>
              <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
                {t('about.compassionateCareDesc')}
              </p>
            </div>

            <div className="bg-white rounded-2xl sm:rounded-3xl p-6 sm:p-8 shadow-sm hover:shadow-md transition-shadow text-center">
              <div className="w-12 h-12 sm:w-14 sm:h-14 lg:w-16 lg:h-16 bg-gradient-to-br from-yellow-500 to-amber-500 rounded-xl sm:rounded-2xl flex items-center justify-center mb-4 sm:mb-6 shadow-lg mx-auto">
                <Shield className="text-white" size={24} />
              </div>
              <h3 className="font-display text-xl sm:text-2xl font-bold mb-2 sm:mb-3" style={{color: '#1e3a5f'}}>{t('about.licensedProfessionals')}</h3>
              <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
                {t('about.licensedProfessionalsDesc')}
              </p>
            </div>

            <div className="bg-white rounded-2xl sm:rounded-3xl p-6 sm:p-8 shadow-sm hover:shadow-md transition-shadow sm:col-span-2 lg:col-span-1 text-center">
              <div className="w-12 h-12 sm:w-14 sm:h-14 lg:w-16 lg:h-16 bg-gradient-to-br from-cyan-400 to-cyan-500 rounded-xl sm:rounded-2xl flex items-center justify-center mb-4 sm:mb-6 shadow-lg mx-auto">
                <Clock className="text-white" size={24} />
              </div>
              <h3 className="font-display text-xl sm:text-2xl font-bold mb-2 sm:mb-3" style={{color: '#1e3a5f'}}>{t('about.alwaysAvailable')}</h3>
              <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
                {t('about.alwaysAvailableDesc')}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="py-12 sm:py-20 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-7xl mx-auto">
          {/* Section Header */}
          <div className="text-center max-w-3xl mx-auto mb-10 sm:mb-16">
            <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl font-bold mb-3 sm:mb-4" style={{color: '#1e3a5f'}}>
              {t('pricingPage.heroTitle')}
            </h2>
            <p className="text-lg sm:text-xl text-slate-600">
              {t('pricingPage.heroSubtitle')}
            </p>
          </div>

          {/* ── Service Price List ── */}
          <div className="mb-12 sm:mb-16">
            <h3 className="font-display text-xl sm:text-2xl font-bold mb-1 sm:mb-2" style={{color: '#1e3a5f'}}>
              {t('pricingPage.serviceRatesTitle')}
            </h3>
            <p className="text-sm sm:text-base text-slate-500 mb-5 sm:mb-6">{t('pricingPage.serviceRatesSubtitle')}</p>

            <div className="bg-white rounded-2xl sm:rounded-3xl border-2 border-slate-200 overflow-hidden shadow-sm">
              {/* Table Header */}
              <div className="hidden sm:grid sm:grid-cols-3 bg-slate-50 px-6 py-4 border-b-2 border-slate-200">
                <div className="col-span-2 font-bold text-sm uppercase tracking-wider" style={{color: '#1e3a5f'}}>{t('pricingPage.service')}</div>
                <div className="text-right font-bold text-sm uppercase tracking-wider" style={{color: '#1e3a5f'}}>{t('pricingPage.price')}</div>
              </div>

              {/* Row: Home Care */}
              <div className="flex flex-col sm:grid sm:grid-cols-3 items-start sm:items-center px-4 sm:px-6 py-4 sm:py-5 border-b border-slate-100 hover:bg-slate-50 transition-colors">
                <div className="col-span-2 flex items-center space-x-3 sm:space-x-4 mb-2 sm:mb-0">
                  <div className="w-10 h-10 sm:w-12 sm:h-12 bg-cyan-50 rounded-lg sm:rounded-xl flex items-center justify-center flex-shrink-0">
                    <Home className="text-cyan-600" size={20} />
                  </div>
                  <span className="font-semibold text-base sm:text-lg" style={{color: '#1e3a5f'}}>{t('pricingPage.homeCare')}</span>
                </div>
                <div className="text-left sm:text-right pl-13 sm:pl-0">
                  <span className="font-display text-2xl sm:text-3xl font-bold text-red-500">€52<span className="text-sm sm:text-base text-slate-500 font-normal ml-1">{t('pricingPage.perHour')}</span></span>
                </div>
              </div>

              {/* Row: Nursing */}
              <div className="flex flex-col sm:grid sm:grid-cols-3 items-start sm:items-center px-4 sm:px-6 py-4 sm:py-5 border-b border-slate-100 hover:bg-slate-50 transition-colors">
                <div className="col-span-2 flex items-start space-x-3 sm:space-x-4 mb-2 sm:mb-0">
                  <div className="w-10 h-10 sm:w-12 sm:h-12 bg-red-50 rounded-lg sm:rounded-xl flex items-center justify-center flex-shrink-0">
                    <Stethoscope className="text-red-500" size={20} />
                  </div>
                  <div>
                    <span className="font-semibold text-base sm:text-lg block" style={{color: '#1e3a5f'}}>{t('pricingPage.homeNursing')}</span>
                    <span className="text-xs text-slate-400 italic">{t('pricingPage.homeNursingNote')}</span>
                  </div>
                </div>
                <div className="text-left sm:text-right pl-13 sm:pl-0">
                  <span className="font-display text-2xl sm:text-3xl font-bold text-red-500">€59<span className="text-sm sm:text-base text-slate-500 font-normal ml-1">{t('pricingPage.perHour')}</span></span>
                </div>
              </div>

              {/* Row: Foot Care */}
              <div className="flex flex-col sm:grid sm:grid-cols-3 items-start sm:items-center px-4 sm:px-6 py-4 sm:py-5 border-b border-slate-100 hover:bg-slate-50 transition-colors">
                <div className="col-span-2 flex items-start space-x-3 sm:space-x-4 mb-2 sm:mb-0">
                  <div className="w-10 h-10 sm:w-12 sm:h-12 bg-orange-50 rounded-lg sm:rounded-xl flex items-center justify-center flex-shrink-0">
                    <Footprints className="text-orange-500" size={20} />
                  </div>
                  <div>
                    <span className="font-semibold text-base sm:text-lg block" style={{color: '#1e3a5f'}}>{t('pricingPage.footCare')}</span>
                    <span className="text-xs text-slate-400 italic">{t('pricingPage.footCareNote')}</span>
                  </div>
                </div>
                <div className="text-left sm:text-right pl-13 sm:pl-0">
                  <div className="font-display text-2xl sm:text-3xl font-bold text-red-500">€85<span className="text-sm sm:text-base text-slate-500 font-normal ml-1">{t('pricingPage.perVisit')}</span></div>
                  <span className="text-xs text-slate-500">{t('pricingPage.footCareDemanding')}: +€35</span>
                </div>
              </div>

              {/* Row: Family Caregiver Support */}
              <div className="flex flex-col sm:grid sm:grid-cols-3 items-start sm:items-center px-4 sm:px-6 py-4 sm:py-5 border-b border-slate-100 hover:bg-slate-50 transition-colors">
                <div className="col-span-2 flex items-center space-x-3 sm:space-x-4 mb-2 sm:mb-0">
                  <div className="w-10 h-10 sm:w-12 sm:h-12 bg-pink-50 rounded-lg sm:rounded-xl flex items-center justify-center flex-shrink-0">
                    <HeartHandshake className="text-pink-500" size={20} />
                  </div>
                  <span className="font-semibold text-base sm:text-lg" style={{color: '#1e3a5f'}}>{t('pricingPage.familyCaregiverSupport')}</span>
                </div>
                <div className="text-left sm:text-right pl-13 sm:pl-0">
                  <span className="font-display text-2xl sm:text-3xl font-bold text-red-500">€41<span className="text-sm sm:text-base text-slate-500 font-normal ml-1">{t('pricingPage.perHour')}</span></span>
                </div>
              </div>

              {/* Row: Cleaning */}
              <div className="flex flex-col sm:grid sm:grid-cols-3 items-start sm:items-center px-4 sm:px-6 py-4 sm:py-5 border-b border-slate-100 hover:bg-slate-50 transition-colors">
                <div className="col-span-2 flex items-start space-x-3 sm:space-x-4 mb-2 sm:mb-0">
                  <div className="w-10 h-10 sm:w-12 sm:h-12 bg-blue-50 rounded-lg sm:rounded-xl flex items-center justify-center flex-shrink-0">
                    <Sparkles className="text-blue-600" size={20} />
                  </div>
                  <div>
                    <span className="font-semibold text-base sm:text-lg block" style={{color: '#1e3a5f'}}>{t('pricingPage.cleaning')}</span>
                    <span className="text-xs text-slate-400 italic">{t('pricingPage.cleaningVoucher')}: €37{t('pricingPage.perHour')}</span>
                  </div>
                </div>
                <div className="text-left sm:text-right pl-13 sm:pl-0">
                  <span className="font-display text-2xl sm:text-3xl font-bold text-red-500">€41<span className="text-sm sm:text-base text-slate-500 font-normal ml-1">{t('pricingPage.perHour')}</span></span>
                </div>
              </div>

              {/* Row: Personal Assistant */}
              <div className="flex flex-col sm:grid sm:grid-cols-3 items-start sm:items-center px-4 sm:px-6 py-4 sm:py-5 border-b border-slate-100 hover:bg-slate-50 transition-colors">
                <div className="col-span-2 flex items-start space-x-3 sm:space-x-4 mb-2 sm:mb-0">
                  <div className="w-10 h-10 sm:w-12 sm:h-12 bg-purple-50 rounded-lg sm:rounded-xl flex items-center justify-center flex-shrink-0">
                    <UserCheck className="text-purple-600" size={20} />
                  </div>
                  <div>
                    <span className="font-semibold text-base sm:text-lg block" style={{color: '#1e3a5f'}}>{t('pricingPage.personalAssistant')}</span>
                    <span className="text-xs text-slate-400 italic">{t('pricingPage.personalAssistantNote')}</span>
                  </div>
                </div>
                <div className="text-left sm:text-right pl-13 sm:pl-0">
                  <span className="font-display text-2xl sm:text-3xl font-bold text-red-500">€37<span className="text-sm sm:text-base text-slate-500 font-normal ml-1">{t('pricingPage.perHour')}</span></span>
                </div>
              </div>

              {/* Row: Palliative Care */}
              <div className="flex flex-col sm:grid sm:grid-cols-3 items-start sm:items-center px-4 sm:px-6 py-4 sm:py-5 hover:bg-slate-50 transition-colors">
                <div className="col-span-2 flex items-center space-x-3 sm:space-x-4 mb-2 sm:mb-0">
                  <div className="w-10 h-10 sm:w-12 sm:h-12 bg-rose-50 rounded-lg sm:rounded-xl flex items-center justify-center flex-shrink-0">
                    <Heart className="text-rose-500" size={20} />
                  </div>
                  <span className="font-semibold text-base sm:text-lg" style={{color: '#1e3a5f'}}>{t('pricingPage.palliativeCare')}</span>
                </div>
                <div className="text-left sm:text-right pl-13 sm:pl-0">
                  <span className="inline-block px-4 py-1.5 bg-rose-50 text-rose-600 rounded-full text-sm font-semibold border border-rose-200">
                    {t('pricingPage.contactForQuote')}
                  </span>
                </div>
              </div>
            </div>

            {/* One-time visit surcharge + VAT note */}
            <div className="mt-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
              <div className="flex items-center gap-2 bg-amber-50 border border-amber-200 rounded-xl px-4 py-2.5">
                <AlertCircle size={16} className="text-amber-500 flex-shrink-0" />
                <span className="text-sm text-slate-700">
                  <span className="font-semibold">{t('pricingPage.oneTimeVisitSurcharge')}:</span> {t('pricingPage.oneTimeVisitAmount')}
                </span>
              </div>
              <p className="text-sm text-slate-500 text-center sm:text-right">{t('pricingPage.vatNote')}</p>
            </div>
          </div>

          {/* ── Surcharges ── */}
          <div className="mb-12 sm:mb-16">
            <h3 className="font-display text-xl sm:text-2xl font-bold mb-1 sm:mb-2" style={{color: '#1e3a5f'}}>
              {t('pricingPage.surchargesTitle')}
            </h3>
            <p className="text-sm sm:text-base text-slate-500 mb-5 sm:mb-6">{t('pricingPage.surchargesSubtitle')}</p>

            {/* Surcharges table */}
            <div className="bg-white rounded-2xl sm:rounded-3xl border-2 border-slate-200 overflow-hidden shadow-sm">
              <div className="hidden sm:grid sm:grid-cols-3 bg-slate-50 px-6 py-3 border-b-2 border-slate-200">
                <div className="font-bold text-sm uppercase tracking-wider" style={{color: '#1e3a5f'}}></div>
                <div className="font-bold text-sm uppercase tracking-wider text-slate-500"></div>
                <div className="text-right font-bold text-sm uppercase tracking-wider" style={{color: '#1e3a5f'}}></div>
              </div>

              {/* Evening */}
              <div className="flex flex-col sm:grid sm:grid-cols-3 items-start sm:items-center px-4 sm:px-6 py-3.5 sm:py-4 border-b border-slate-100 hover:bg-amber-50/50 transition-colors">
                <div className="flex items-center space-x-3 mb-1 sm:mb-0">
                  <Sun className="text-amber-500 flex-shrink-0" size={18} />
                  <span className="font-semibold text-sm sm:text-base" style={{color: '#1e3a5f'}}>{t('pricingPage.eveningLabel')}</span>
                </div>
                <div className="text-xs sm:text-sm text-slate-500 pl-8 sm:pl-0">{t('pricingPage.eveningTime')}</div>
                <div className="text-left sm:text-right pl-8 sm:pl-0">
                  <span className="font-display text-xl sm:text-2xl font-bold text-red-500">{t('pricingPage.eveningSurcharge')}</span>
                </div>
              </div>

              {/* Night */}
              <div className="flex flex-col sm:grid sm:grid-cols-3 items-start sm:items-center px-4 sm:px-6 py-3.5 sm:py-4 border-b border-slate-100 hover:bg-indigo-50/50 transition-colors">
                <div className="flex items-center space-x-3 mb-1 sm:mb-0">
                  <Moon className="text-indigo-500 flex-shrink-0" size={18} />
                  <span className="font-semibold text-sm sm:text-base" style={{color: '#1e3a5f'}}>{t('pricingPage.nightLabel')}</span>
                </div>
                <div className="text-xs sm:text-sm text-slate-500 pl-8 sm:pl-0">{t('pricingPage.nightTime')}</div>
                <div className="text-left sm:text-right pl-8 sm:pl-0">
                  <span className="font-display text-xl sm:text-2xl font-bold text-red-500">{t('pricingPage.nightSurcharge')}</span>
                </div>
              </div>

              {/* Saturday */}
              <div className="flex flex-col sm:grid sm:grid-cols-3 items-start sm:items-center px-4 sm:px-6 py-3.5 sm:py-4 border-b border-slate-100 hover:bg-teal-50/50 transition-colors">
                <div className="flex items-center space-x-3 mb-1 sm:mb-0">
                  <CalendarDays className="text-teal-500 flex-shrink-0" size={18} />
                  <span className="font-semibold text-sm sm:text-base" style={{color: '#1e3a5f'}}>{t('pricingPage.saturdayLabel')}</span>
                </div>
                <div className="text-xs sm:text-sm text-slate-500 pl-8 sm:pl-0">{t('pricingPage.saturdayTime')}</div>
                <div className="text-left sm:text-right pl-8 sm:pl-0">
                  <span className="font-display text-xl sm:text-2xl font-bold text-red-500">{t('pricingPage.saturdaySurcharge')}</span>
                </div>
              </div>

              {/* Sunday & Holidays */}
              <div className="flex flex-col sm:grid sm:grid-cols-3 items-start sm:items-center px-4 sm:px-6 py-3.5 sm:py-4 border-b border-slate-100 hover:bg-red-50/50 transition-colors">
                <div className="flex items-center space-x-3 mb-1 sm:mb-0">
                  <CalendarDays className="text-red-500 flex-shrink-0" size={18} />
                  <span className="font-semibold text-sm sm:text-base" style={{color: '#1e3a5f'}}>{t('pricingPage.sundayLabel')}</span>
                </div>
                <div className="text-xs sm:text-sm text-slate-500 pl-8 sm:pl-0">{t('pricingPage.sundayTime')}</div>
                <div className="text-left sm:text-right pl-8 sm:pl-0">
                  <span className="font-display text-xl sm:text-2xl font-bold text-red-500">{t('pricingPage.sundaySurcharge')}</span>
                </div>
              </div>

              {/* Eve of Public Holidays */}
              <div className="flex flex-col sm:grid sm:grid-cols-3 items-start sm:items-center px-4 sm:px-6 py-3.5 sm:py-4 hover:bg-red-50/50 transition-colors">
                <div className="flex items-center space-x-3 mb-1 sm:mb-0">
                  <CalendarDays className="text-red-400 flex-shrink-0" size={18} />
                  <span className="font-semibold text-sm sm:text-base" style={{color: '#1e3a5f'}}>{t('pricingPage.holidayEveLabel')}</span>
                </div>
                <div className="text-xs sm:text-sm text-slate-500 pl-8 sm:pl-0">{t('pricingPage.holidayEveTime')}</div>
                <div className="text-left sm:text-right pl-8 sm:pl-0">
                  <span className="font-display text-xl sm:text-2xl font-bold text-red-500">{t('pricingPage.holidayEveSurcharge')}</span>
                </div>
              </div>
            </div>
          </div>

          {/* ── Service Voucher ── */}
          <div className="mb-12 sm:mb-16">
            <div className="bg-cyan-50 border-2 border-cyan-200 rounded-2xl sm:rounded-3xl p-5 sm:p-6 lg:p-8">
              <div className="flex items-start space-x-4">
                <div className="w-10 h-10 sm:w-12 sm:h-12 bg-white rounded-xl flex items-center justify-center shadow-sm flex-shrink-0">
                  <Ticket className="text-cyan-600" size={20} />
                </div>
                <div>
                  <h3 className="font-display text-xl sm:text-2xl font-bold mb-2 sm:mb-3" style={{color: '#1e3a5f'}}>
                    {t('pricingPage.serviceVouchersTitle')}
                  </h3>
                  <p className="text-sm sm:text-base text-slate-600 leading-relaxed mb-3">
                    {t('pricingPage.serviceVouchersDesc')}
                  </p>
                  <div className="flex items-start gap-2 bg-white border border-cyan-200 rounded-lg px-3 py-2">
                    <Info size={14} className="text-cyan-600 mt-0.5 flex-shrink-0" />
                    <span className="text-xs sm:text-sm text-slate-600 italic">{t('pricingPage.serviceVouchersNote')}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* ── Billing & Invoicing ── */}
          <div className="mb-12 sm:mb-16">
            <div className="bg-amber-50 border-2 border-amber-200 rounded-2xl sm:rounded-3xl p-5 sm:p-6 lg:p-8">
              <div className="flex items-start space-x-4 mb-4">
                <div className="w-10 h-10 sm:w-12 sm:h-12 bg-white rounded-xl flex items-center justify-center shadow-sm flex-shrink-0">
                  <FileText className="text-amber-600" size={20} />
                </div>
                <h3 className="font-display text-xl sm:text-2xl font-bold pt-2" style={{color: '#1e3a5f'}}>
                  {t('pricingPage.billingTitle')}
                </h3>
              </div>

              <div className="grid sm:grid-cols-2 gap-x-6 gap-y-2.5 ml-0 sm:ml-16">
                <div className="flex items-start gap-2">
                  <Check size={14} className="text-green-500 mt-1 flex-shrink-0" />
                  <span className="text-sm text-slate-700 font-medium">{t('pricingPage.billingAssessment')}</span>
                </div>
                <div className="flex items-start gap-2">
                  <ChevronRight size={14} className="text-amber-500 mt-1 flex-shrink-0" />
                  <span className="text-sm text-slate-600">{t('pricingPage.billingCarePlan')}</span>
                </div>
                <div className="flex items-start gap-2">
                  <ChevronRight size={14} className="text-amber-500 mt-1 flex-shrink-0" />
                  <span className="text-sm text-slate-600">{t('pricingPage.billingMinimum')}</span>
                </div>
                <div className="flex items-start gap-2">
                  <ChevronRight size={14} className="text-amber-500 mt-1 flex-shrink-0" />
                  <span className="text-sm text-slate-600">{t('pricingPage.billingCleaning')}</span>
                </div>
                <div className="flex items-start gap-2">
                  <ChevronRight size={14} className="text-amber-500 mt-1 flex-shrink-0" />
                  <span className="text-sm text-slate-600">{t('pricingPage.billingPersonalAssistant')}</span>
                </div>
                <div className="flex items-start gap-2">
                  <ChevronRight size={14} className="text-amber-500 mt-1 flex-shrink-0" />
                  <span className="text-sm text-slate-600">{t('pricingPage.billingIncrements')}</span>
                </div>
                <div className="flex items-start gap-2">
                  <ChevronRight size={14} className="text-amber-500 mt-1 flex-shrink-0" />
                  <span className="text-sm text-slate-600">{t('pricingPage.billingTravel')}</span>
                </div>
                <div className="flex items-start gap-2">
                  <ChevronRight size={14} className="text-amber-500 mt-1 flex-shrink-0" />
                  <span className="text-sm text-slate-600">{t('pricingPage.billingFrequency')}</span>
                </div>
                <div className="flex items-start gap-2">
                  <ChevronRight size={14} className="text-amber-500 mt-1 flex-shrink-0" />
                  <span className="text-sm text-slate-600">{t('pricingPage.billingPaymentTerms')}</span>
                </div>
                <div className="flex items-start gap-2">
                  <ChevronRight size={14} className="text-amber-500 mt-1 flex-shrink-0" />
                  <span className="text-sm text-slate-600">{t('pricingPage.billingLateInterest')}</span>
                </div>
                <div className="flex items-start gap-2">
                  <ChevronRight size={14} className="text-amber-500 mt-1 flex-shrink-0" />
                  <span className="text-sm text-slate-600">{t('pricingPage.billingPaperInvoice')}</span>
                </div>
                <div className="flex items-start gap-2">
                  <Check size={14} className="text-green-500 mt-1 flex-shrink-0" />
                  <span className="text-sm text-slate-600">{t('pricingPage.billingEInvoice')}</span>
                </div>
                <div className="flex items-start gap-2 sm:col-span-2">
                  <AlertCircle size={14} className="text-amber-500 mt-1 flex-shrink-0" />
                  <span className="text-sm text-slate-700 font-medium">{t('pricingPage.billingCancellation')}</span>
                </div>
              </div>
            </div>
          </div>

          {/* ── Household Tax Deduction ── */}
          <div>
            <div className="bg-green-50 border-2 border-green-200 rounded-2xl sm:rounded-3xl p-5 sm:p-6 lg:p-8">
              <div className="flex items-start space-x-4 mb-4">
                <div className="w-10 h-10 sm:w-12 sm:h-12 bg-white rounded-xl flex items-center justify-center shadow-sm flex-shrink-0">
                  <Calculator className="text-green-600" size={20} />
                </div>
                <div>
                  <h3 className="font-display text-xl sm:text-2xl font-bold mb-2 sm:mb-3" style={{color: '#1e3a5f'}}>
                    {t('pricingPage.deductionTitle')}
                  </h3>
                  <p className="text-sm sm:text-base text-slate-600 leading-relaxed mb-4">
                    {t('pricingPage.deductionDesc')}
                  </p>
                </div>
              </div>

              <div className="grid sm:grid-cols-2 gap-3 ml-0 sm:ml-16 mb-4">
                <div className="flex items-center bg-white rounded-lg px-3 py-2.5 border border-green-200">
                  <Check size={14} className="text-green-600 mr-2 flex-shrink-0" />
                  <span className="text-sm text-slate-700">{t('pricingPage.deductionMaxAmount')}</span>
                </div>
                <div className="flex items-center bg-white rounded-lg px-3 py-2.5 border border-green-200">
                  <Check size={14} className="text-green-600 mr-2 flex-shrink-0" />
                  <span className="text-sm text-slate-700">{t('pricingPage.deductionPercentage')}</span>
                </div>
              </div>

              <div className="space-y-2 ml-0 sm:ml-16">
                <div className="flex items-start gap-2">
                  <AlertCircle size={14} className="text-amber-500 mt-0.5 flex-shrink-0" />
                  <span className="text-sm text-slate-600 italic">{t('pricingPage.deductionNursingNote')}</span>
                </div>
                <div className="flex items-start gap-2">
                  <Info size={14} className="text-green-600 mt-0.5 flex-shrink-0" />
                  <span className="text-sm text-slate-600">{t('pricingPage.deductionVatNote')}</span>
                </div>
                <div className="flex items-start gap-2">
                  <ChevronRight size={14} className="text-green-600 mt-0.5 flex-shrink-0" />
                  <span className="text-sm text-slate-600 font-medium">{t('pricingPage.deductionMoreInfo')}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Feedback Section */}
      <section id="feedback" className="py-12 sm:py-20 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-4xl mx-auto">
          <div className="text-center max-w-3xl mx-auto mb-8 sm:mb-12">
            <div className="inline-flex items-center justify-center w-12 h-12 sm:w-16 sm:h-16 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl sm:rounded-2xl mb-4 sm:mb-6 shadow-lg">
              <MessageSquare className="text-white" size={24} />
            </div>
            <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl font-bold mb-3 sm:mb-4" style={{color: '#1e3a5f'}}>
              {t('feedback.title')} <span className="text-red-500">{t('feedback.titleHighlight')}</span>
            </h2>
            <p className="text-lg sm:text-xl text-slate-600">
              {t('feedback.subtitle')}
            </p>
          </div>

          <div className="bg-slate-50 rounded-2xl sm:rounded-3xl p-5 sm:p-6 lg:p-8">
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
                    <option value="Palliative Care">{t('services.personalAssistant')}</option>
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
      <section id="contact" className="py-12 sm:py-20 px-4 sm:px-6 lg:px-8 bg-slate-50">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-8 lg:gap-12">
            <div className="space-y-6 sm:space-y-8">
              <div className="text-center lg:text-left">
                <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl font-bold mb-3 sm:mb-4" style={{color: '#1e3a5f'}}>
                  {t('contact.title')}
                </h2>
                <p className="text-lg sm:text-xl text-slate-600">
                  {t('contact.subtitle')}
                </p>
              </div>

              <div className="grid sm:grid-cols-2 lg:grid-cols-1 gap-4">
                <div className="flex items-start space-x-3 sm:space-x-4 bg-white rounded-xl sm:rounded-2xl p-4 shadow-sm">
                  <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-cyan-400 to-cyan-500 rounded-xl sm:rounded-2xl flex items-center justify-center flex-shrink-0 shadow-lg">
                    <Phone className="text-white" size={18} />
                  </div>
                  <div>
                    <div className="font-bold mb-1 text-sm sm:text-base" style={{color: '#1e3a5f'}}>{t('contact.phone')}</div>
                    <a href="tel:+358961500069" className="text-slate-600 hover:text-red-500 transition-colors text-sm sm:text-base">
                      +3584579244212
                    </a>
                  </div>
                </div>

                <div className="flex items-start space-x-3 sm:space-x-4 bg-white rounded-xl sm:rounded-2xl p-4 shadow-sm">
                  <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-yellow-500 to-amber-500 rounded-xl sm:rounded-2xl flex items-center justify-center flex-shrink-0 shadow-lg">
                    <Mail className="text-white" size={18} />
                  </div>
                  <div>
                    <div className="font-bold mb-1 text-sm sm:text-base" style={{color: '#1e3a5f'}}>{t('contact.email')}</div>
                    <a href="mailto:info@bridgehoito.fi" className="text-slate-600 hover:text-red-500 transition-colors text-sm sm:text-base break-all">
                      otelesika@gmail.com
                    </a>
                  </div>
                </div>

                <div className="flex items-start space-x-3 sm:space-x-4 bg-white rounded-xl sm:rounded-2xl p-4 shadow-sm sm:col-span-2 lg:col-span-1">
                  <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-red-500 to-pink-500 rounded-xl sm:rounded-2xl flex items-center justify-center flex-shrink-0 shadow-lg">
                    <MapPin className="text-white" size={18} />
                  </div>
                  <div>
                    <div className="font-bold mb-1 text-sm sm:text-base" style={{color: '#1e3a5f'}}>{t('contact.serviceArea')}</div>
                    <p className="text-slate-600 text-sm sm:text-base">
                      {t('contact.serviceAreaText')}
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-2xl sm:rounded-3xl p-4 sm:p-6 shadow-sm">
                <h3 className="font-bold mb-3 sm:mb-4 text-sm sm:text-base" style={{color: '#1e3a5f'}}>{t('contact.officeHours')}</h3>
                <div className="space-y-2 text-xs sm:text-sm text-slate-700">
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

            <div className="bg-white rounded-2xl sm:rounded-3xl p-5 sm:p-6 lg:p-8 shadow-sm">
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
                    <option value="Palliative Care">{t('services.personalAssistant')}</option>
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
      <footer className="bg-gradient-to-br from-slate-800 to-slate-900 text-slate-300 py-10 sm:py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 sm:gap-8 mb-8">
            <div className="col-span-2 md:col-span-1">
              <div className="flex items-center space-x-3 mb-3 sm:mb-4">
                <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full flex items-center justify-center overflow-hidden bg-white shadow-lg">
                  <img
                    src="/logo.jpeg"
                    alt="Bridge Hoito Oy Logo"
                    className="w-full h-full object-cover scale-110"
                  />
                </div>
                <span className="font-display text-lg sm:text-xl font-bold text-white">Bridge Hoito Oy</span>
              </div>
              <p className="text-xs sm:text-sm text-slate-400">
                {t('footer.description')}
              </p>
            </div>

            <div>
              <h3 className="font-bold text-white mb-3 sm:mb-4 text-sm sm:text-base">{t('footer.services')}</h3>
              <ul className="space-y-1.5 sm:space-y-2 text-xs sm:text-sm">
                <li><a href="#services" className="hover:text-red-400 transition-colors">{t('footer.homeCare')}</a></li>
                <li><a href="#services" className="hover:text-red-400 transition-colors">{t('footer.nursing')}</a></li>
                <li><a href="#services" className="hover:text-red-400 transition-colors">{t('footer.cleaning')}</a></li>
                <li><a href="#services" className="hover:text-red-400 transition-colors">{t('footer.palliativeCare')}</a></li>
                <li><a href="#services" className="hover:text-red-400 transition-colors">{t('footer.personalAssistant')}</a></li>
              </ul>
            </div>

            <div>
              <h3 className="font-bold text-white mb-3 sm:mb-4 text-sm sm:text-base">{t('footer.company')}</h3>
              <ul className="space-y-1.5 sm:space-y-2 text-xs sm:text-sm">
                <li><a href="#about" className="hover:text-red-400 transition-colors">{t('footer.aboutUs')}</a></li>
                <li><a href="#" className="hover:text-red-400 transition-colors">{t('footer.careers')}</a></li>
                <li><a href="#" className="hover:text-red-400 transition-colors">{t('footer.privacy')}</a></li>
                <li><a href="#" className="hover:text-red-400 transition-colors">{t('footer.terms')}</a></li>
              </ul>
            </div>

            <div className="col-span-2 md:col-span-1">
              <h3 className="font-bold text-white mb-3 sm:mb-4 text-sm sm:text-base">{t('footer.stayUpdated')}</h3>
              <p className="text-xs sm:text-sm text-slate-400 mb-2 sm:mb-3">{t('footer.healthTips')}</p>
              <div className="flex space-x-2">
                <input
                  type="email"
                  placeholder={t('footer.yourEmail')}
                  className="flex-1 min-w-0 px-3 sm:px-4 py-2 rounded-full bg-slate-700 border border-slate-600 text-white text-xs sm:text-sm focus:outline-none focus:border-red-400"
                />
                <button className="px-3 sm:px-4 py-2 bg-gradient-to-r from-red-500 to-pink-500 rounded-full hover:shadow-lg transition-all flex-shrink-0">
                  <ChevronRight size={18} />
                </button>
              </div>
            </div>
          </div>

          <div className="pt-6 sm:pt-8 border-t border-slate-700 text-center text-xs sm:text-sm text-slate-400">
            <p>© 2026 Bridge Hoito Oy. {t('footer.rights')}</p>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default HomePage;
