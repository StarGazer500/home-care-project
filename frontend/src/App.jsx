import React, { useState, useEffect, useRef } from 'react';
import { Heart, Home, Stethoscope, Sparkles, Phone, Mail, MapPin, ChevronRight, Check, Menu, X, Users, Clock, Shield, Award, Star } from 'lucide-react';

function App() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [activeService, setActiveService] = useState(null);
  const [scrolled, setScrolled] = useState(false);
  const [isVisible, setIsVisible] = useState({});
  const observerRef = useRef(null);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
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

  const services = [
    {
      id: 'home-care',
      icon: Home,
      title: 'Home Care Services',
      subtitle: 'Daily living assistance',
      description: 'Compassionate support for daily activities, personal care, and maintaining independence at home.',
      features: ['Personal hygiene assistance', 'Meal preparation', 'Mobility support', 'Medication reminders'],
      price: 'From €32/hour',
      color: 'bg-cyan-50 border-cyan-200'
    },
    {
      id: 'nursing',
      icon: Stethoscope,
      title: 'Home Nursing',
      subtitle: 'Professional medical care',
      description: 'Qualified nurses providing expert medical care in the comfort of your home.',
      features: ['Wound care', 'Injections & medications', 'Health monitoring', 'Post-surgery care'],
      price: 'From €59/hour',
      color: 'bg-red-50 border-red-200'
    },
    {
      id: 'cleaning',
      icon: Sparkles,
      title: 'Home Cleaning',
      subtitle: 'Professional housekeeping',
      description: 'Keep your home fresh and clean with our reliable cleaning services.',
      features: ['Regular cleaning', 'Deep cleaning', 'Window washing', 'Moving assistance'],
      price: 'From €37.82/hour',
      color: 'bg-blue-50 border-blue-200'
    },
    {
      id: 'palliative',
      icon: Heart,
      title: 'Palliative Care',
      subtitle: 'Compassionate end-of-life care',
      description: 'Dignified, comfortable care during life\'s final journey, supporting patients and families.',
      features: ['24/7 care options', 'Pain management', 'Emotional support', 'Family counseling'],
      price: 'Custom pricing',
      color: 'bg-rose-50 border-rose-200'
    }
  ];

  const stats = [
    { icon: Users, value: '2,500+', label: 'Happy Clients' },
    { icon: Award, value: '15+', label: 'Years Experience' },
    { icon: Clock, value: '24/7', label: 'Availability' },
    { icon: Shield, value: '100%', label: 'Licensed Staff' }
  ];

  const testimonials = [
    {
      name: 'Maria Korhonen',
      role: 'Family Member',
      text: 'The care my mother receives is exceptional. The staff is professional, caring, and truly makes a difference in her quality of life.',
      rating: 5
    },
    {
      name: 'Jukka Virtanen',
      role: 'Client',
      text: 'After my surgery, the home nursing service was invaluable. Professional, punctual, and compassionate care every visit.',
      rating: 5
    },
    {
      name: 'Anna Nieminen',
      role: 'Client',
      text: 'The cleaning service keeps my home spotless. It\'s such a relief to have reliable, thorough professionals I can trust.',
      rating: 5
    }
  ];

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800">
      {/* Navigation */}
      <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${scrolled ? 'bg-white/95 backdrop-blur-sm shadow-sm' : 'bg-transparent'}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            <div className="flex items-center space-x-3">
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
            </div>

            {/* Desktop Menu */}
            <div className="hidden md:flex items-center space-x-8">
              <a href="#services" className="text-navy-900 hover:text-red-500 transition-colors font-medium" style={{color: '#1e3a5f'}}>Services</a>
              <a href="#about" className="text-navy-900 hover:text-red-500 transition-colors font-medium" style={{color: '#1e3a5f'}}>About</a>
              <a href="#pricing" className="text-navy-900 hover:text-red-500 transition-colors font-medium" style={{color: '#1e3a5f'}}>Pricing</a>
              <a href="#testimonials" className="text-navy-900 hover:text-red-500 transition-colors font-medium" style={{color: '#1e3a5f'}}>Testimonials</a>
              <a href="#contact" className="bg-gradient-to-r from-red-500 to-pink-500 text-white px-6 py-2.5 rounded-full hover:shadow-lg transition-all font-medium">
                Contact Us
              </a>
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
              <a href="#services" className="block text-navy-900 hover:text-red-500 transition-colors font-medium" style={{color: '#1e3a5f'}}>Services</a>
              <a href="#about" className="block text-navy-900 hover:text-red-500 transition-colors font-medium" style={{color: '#1e3a5f'}}>About</a>
              <a href="#pricing" className="block text-navy-900 hover:text-red-500 transition-colors font-medium" style={{color: '#1e3a5f'}}>Pricing</a>
              <a href="#testimonials" className="block text-navy-900 hover:text-red-500 transition-colors font-medium" style={{color: '#1e3a5f'}}>Testimonials</a>
              <a href="#contact" className="block bg-gradient-to-r from-red-500 to-pink-500 text-white px-6 py-3 rounded-full text-center font-medium">
                Contact Us
              </a>
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
                <div className="inline-block px-4 py-2 bg-white rounded-full border-2 border-red-200 shadow-sm">
                  <span className="text-red-500 font-semibold text-sm">Trusted Since 2008</span>
                </div>
                <h1 className="font-display text-5xl sm:text-6xl lg:text-7xl font-bold leading-tight" style={{color: '#1e3a5f'}}>
                  Care That Feels
                  <br />
                  <span className="text-red-500">Like Home</span>
                </h1>
                <p className="text-xl text-slate-600 leading-relaxed">
                  Professional healthcare services delivered with warmth, compassion, and respect in the comfort of your own home.
                </p>
              </div>
              
              <div className="flex flex-wrap gap-4">
                <a 
                  href="#services"
                  className="px-8 py-4 bg-gradient-to-r from-red-500 to-pink-500 text-white rounded-full hover:shadow-xl transition-all font-semibold inline-flex items-center space-x-2"
                >
                  <span>Explore Our Services</span>
                  <ChevronRight size={20} />
                </a>
                <a 
                  href="#contact"
                  className="px-8 py-4 border-2 border-red-500 text-red-500 rounded-full hover:bg-red-500 hover:text-white transition-all font-semibold"
                >
                  Get In Touch
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
              Our <span className="text-red-500">Services</span>
            </h2>
            <p className="text-xl text-slate-600">
              Comprehensive care solutions tailored to your unique needs
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
              Why Choose <span className="text-red-500">Us</span>
            </h2>
            <p className="text-xl text-slate-600">
              Our commitment to excellence in every aspect of care
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-white rounded-3xl p-8 shadow-sm">
              <div className="w-16 h-16 bg-gradient-to-br from-red-500 to-pink-500 rounded-2xl flex items-center justify-center mb-6 shadow-lg">
                <Heart className="text-white" size={32} />
              </div>
              <h3 className="font-display text-2xl font-bold mb-3" style={{color: '#1e3a5f'}}>Compassionate Care</h3>
              <p className="text-slate-600 leading-relaxed">
                We treat every client as family, providing care with genuine warmth, empathy, and respect for their dignity.
              </p>
            </div>

            <div className="bg-white rounded-3xl p-8 shadow-sm">
              <div className="w-16 h-16 bg-gradient-to-br from-yellow-500 to-amber-500 rounded-2xl flex items-center justify-center mb-6 shadow-lg">
                <Shield className="text-white" size={32} />
              </div>
              <h3 className="font-display text-2xl font-bold mb-3" style={{color: '#1e3a5f'}}>Licensed Professionals</h3>
              <p className="text-slate-600 leading-relaxed">
                All our staff are fully licensed, background-checked, and continuously trained to provide the highest quality care.
              </p>
            </div>

            <div className="bg-white rounded-3xl p-8 shadow-sm">
              <div className="w-16 h-16 bg-gradient-to-br from-cyan-400 to-cyan-500 rounded-2xl flex items-center justify-center mb-6 shadow-lg">
                <Clock className="text-white" size={32} />
              </div>
              <h3 className="font-display text-2xl font-bold mb-3" style={{color: '#1e3a5f'}}>Always Available</h3>
              <p className="text-slate-600 leading-relaxed">
                Round-the-clock availability ensures you get the care you need, whenever you need it, day or night.
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
              Simple <span className="text-red-500">Pricing</span>
            </h2>
            <p className="text-xl text-slate-600">
              Transparent rates with no hidden fees
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
                  <h3 className="font-display text-2xl font-bold" style={{color: '#1e3a5f'}}>Home Care</h3>
                  <p className="text-sm text-slate-600">Daily assistance</p>
                </div>
              </div>
              <div className="mb-6">
                <div className="font-display text-4xl font-bold text-red-500 mb-2">€32<span className="text-xl text-slate-600">/hour</span></div>
                <p className="text-sm text-slate-600">Starting rate for home care services</p>
              </div>
              <ul className="space-y-3 text-sm text-slate-700">
                <li className="flex items-start"><Check size={16} className="text-red-500 mr-2 mt-0.5 flex-shrink-0" />Personal care assistance</li>
                <li className="flex items-start"><Check size={16} className="text-red-500 mr-2 mt-0.5 flex-shrink-0" />Meal preparation</li>
                <li className="flex items-start"><Check size={16} className="text-red-500 mr-2 mt-0.5 flex-shrink-0" />Mobility support</li>
              </ul>
            </div>

            {/* Nursing */}
            <div className="bg-red-50 border-2 border-red-200 rounded-3xl p-8">
              <div className="flex items-center space-x-3 mb-6">
                <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center shadow-sm">
                  <Stethoscope className="text-red-500" size={24} />
                </div>
                <div>
                  <h3 className="font-display text-2xl font-bold" style={{color: '#1e3a5f'}}>Nursing</h3>
                  <p className="text-sm text-slate-600">Medical care</p>
                </div>
              </div>
              <div className="mb-6">
                <div className="font-display text-4xl font-bold text-red-500 mb-2">€59<span className="text-xl text-slate-600">/hour</span></div>
                <p className="text-sm text-slate-600">Professional nursing services</p>
              </div>
              <ul className="space-y-3 text-sm text-slate-700">
                <li className="flex items-start"><Check size={16} className="text-red-500 mr-2 mt-0.5 flex-shrink-0" />Wound care & dressing</li>
                <li className="flex items-start"><Check size={16} className="text-red-500 mr-2 mt-0.5 flex-shrink-0" />Medication administration</li>
                <li className="flex items-start"><Check size={16} className="text-red-500 mr-2 mt-0.5 flex-shrink-0" />Health monitoring</li>
              </ul>
            </div>

            {/* Cleaning */}
            <div className="bg-blue-50 border-2 border-blue-200 rounded-3xl p-8">
              <div className="flex items-center space-x-3 mb-6">
                <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center shadow-sm">
                  <Sparkles className="text-blue-600" size={24} />
                </div>
                <div>
                  <h3 className="font-display text-2xl font-bold" style={{color: '#1e3a5f'}}>Cleaning</h3>
                  <p className="text-sm text-slate-600">Housekeeping</p>
                </div>
              </div>
              <div className="mb-6">
                <div className="font-display text-4xl font-bold text-red-500 mb-2">€37.82<span className="text-xl text-slate-600">/hour</span></div>
                <p className="text-sm text-slate-600">Professional home cleaning</p>
              </div>
              <ul className="space-y-3 text-sm text-slate-700">
                <li className="flex items-start"><Check size={16} className="text-red-500 mr-2 mt-0.5 flex-shrink-0" />Regular & deep cleaning</li>
                <li className="flex items-start"><Check size={16} className="text-red-500 mr-2 mt-0.5 flex-shrink-0" />Window washing</li>
                <li className="flex items-start"><Check size={16} className="text-red-500 mr-2 mt-0.5 flex-shrink-0" />Tax deductible</li>
              </ul>
            </div>

            {/* Palliative */}
            <div className="bg-rose-50 border-2 border-rose-200 rounded-3xl p-8">
              <div className="flex items-center space-x-3 mb-6">
                <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center shadow-sm">
                  <Heart className="text-red-500" size={24} />
                </div>
                <div>
                  <h3 className="font-display text-2xl font-bold" style={{color: '#1e3a5f'}}>Palliative Care</h3>
                  <p className="text-sm text-slate-600">End-of-life support</p>
                </div>
              </div>
              <div className="mb-6">
                <div className="font-display text-3xl font-bold text-red-500 mb-2">Custom Quote</div>
                <p className="text-sm text-slate-600">Personalized pricing for your needs</p>
              </div>
              <ul className="space-y-3 text-sm text-slate-700">
                <li className="flex items-start"><Check size={16} className="text-red-500 mr-2 mt-0.5 flex-shrink-0" />24/7 care available</li>
                <li className="flex items-start"><Check size={16} className="text-red-500 mr-2 mt-0.5 flex-shrink-0" />Pain management</li>
                <li className="flex items-start"><Check size={16} className="text-red-500 mr-2 mt-0.5 flex-shrink-0" />Family support</li>
              </ul>
            </div>
          </div>

          {/* Additional Info */}
          <div className="mt-12 bg-slate-50 rounded-3xl p-8">
            <div className="grid md:grid-cols-3 gap-6 text-center">
              <div>
                <div className="text-2xl mb-2">✓</div>
                <h4 className="font-bold mb-2" style={{color: '#1e3a5f'}}>Service Vouchers</h4>
                <p className="text-sm text-slate-600">We accept municipal palveluseteli</p>
              </div>
              <div>
                <div className="text-2xl mb-2">✓</div>
                <h4 className="font-bold mb-2" style={{color: '#1e3a5f'}}>Flexible Plans</h4>
                <p className="text-sm text-slate-600">Weekly packages with discounts</p>
              </div>
              <div>
                <div className="text-2xl mb-2">✓</div>
                <h4 className="font-bold mb-2" style={{color: '#1e3a5f'}}>No Hidden Fees</h4>
                <p className="text-sm text-slate-600">Transparent, honest pricing</p>
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
              What Our <span className="text-red-500">Clients Say</span>
            </h2>
            <p className="text-xl text-slate-600">
              Real stories from the families we serve
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

      {/* Contact Section */}
      <section id="contact" className="py-20 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12">
            <div className="space-y-8">
              <div>
                <h2 className="font-display text-4xl sm:text-5xl font-bold mb-4" style={{color: '#1e3a5f'}}>
                  Let's <span className="text-red-500">Connect</span>
                </h2>
                <p className="text-xl text-slate-600">
                  We're here to answer your questions and provide the care you deserve
                </p>
              </div>

              <div className="space-y-6">
                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-cyan-400 to-cyan-500 rounded-2xl flex items-center justify-center flex-shrink-0 shadow-lg">
                    <Phone className="text-white" size={20} />
                  </div>
                  <div>
                    <div className="font-bold mb-1" style={{color: '#1e3a5f'}}>Phone</div>
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
                    <div className="font-bold mb-1" style={{color: '#1e3a5f'}}>Email</div>
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
                    <div className="font-bold mb-1" style={{color: '#1e3a5f'}}>Service Area</div>
                    <p className="text-slate-600">
                      Helsinki, Espoo & Greater Helsinki Area
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-slate-50 rounded-3xl p-6">
                <h3 className="font-bold mb-4" style={{color: '#1e3a5f'}}>Office Hours</h3>
                <div className="space-y-2 text-sm text-slate-700">
                  <div className="flex justify-between">
                    <span>Monday - Friday</span>
                    <span className="font-medium">8:00 AM - 8:00 PM</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Weekend</span>
                    <span className="font-medium">9:00 AM - 6:00 PM</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Emergency</span>
                    <span className="font-medium text-red-500">24/7 Available</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-slate-50 rounded-3xl p-8">
              <form className="space-y-6">
                <div>
                  <label className="block text-sm font-bold mb-2" style={{color: '#1e3a5f'}}>Full Name</label>
                  <input 
                    type="text"
                    className="w-full px-4 py-3 rounded-2xl border-2 border-white bg-white focus:border-red-500 focus:outline-none transition-colors"
                    placeholder="John Doe"
                  />
                </div>

                <div>
                  <label className="block text-sm font-bold mb-2" style={{color: '#1e3a5f'}}>Email Address</label>
                  <input 
                    type="email"
                    className="w-full px-4 py-3 rounded-2xl border-2 border-white bg-white focus:border-red-500 focus:outline-none transition-colors"
                    placeholder="john@example.com"
                  />
                </div>

                <div>
                  <label className="block text-sm font-bold mb-2" style={{color: '#1e3a5f'}}>Phone Number</label>
                  <input 
                    type="tel"
                    className="w-full px-4 py-3 rounded-2xl border-2 border-white bg-white focus:border-red-500 focus:outline-none transition-colors"
                    placeholder="+358 123 456 789"
                  />
                </div>

                <div>
                  <label className="block text-sm font-bold mb-2" style={{color: '#1e3a5f'}}>Service Needed</label>
                  <select className="w-full px-4 py-3 rounded-2xl border-2 border-white bg-white focus:border-red-500 focus:outline-none transition-colors">
                    <option>Home Care Services</option>
                    <option>Home Nursing</option>
                    <option>Home Cleaning</option>
                    <option>Palliative Care</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-bold mb-2" style={{color: '#1e3a5f'}}>Message</label>
                  <textarea 
                    rows="4"
                    className="w-full px-4 py-3 rounded-2xl border-2 border-white bg-white focus:border-red-500 focus:outline-none transition-colors resize-none"
                    placeholder="Tell us how we can help..."
                  />
                </div>

                <button 
                  type="submit"
                  className="w-full px-8 py-4 bg-gradient-to-r from-red-500 to-pink-500 text-white rounded-full hover:shadow-xl transition-all font-bold"
                >
                  Send Message
                </button>
              </form>
            </div>
          </div>
        </div>
      </section>

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
                Compassionate healthcare services delivered with warmth and professionalism.
              </p>
            </div>

            <div>
              <h3 className="font-bold text-white mb-4">Services</h3>
              <ul className="space-y-2 text-sm">
                <li><a href="#" className="hover:text-red-400 transition-colors">Home Care</a></li>
                <li><a href="#" className="hover:text-red-400 transition-colors">Nursing</a></li>
                <li><a href="#" className="hover:text-red-400 transition-colors">Cleaning</a></li>
                <li><a href="#" className="hover:text-red-400 transition-colors">Palliative Care</a></li>
              </ul>
            </div>

            <div>
              <h3 className="font-bold text-white mb-4">Company</h3>
              <ul className="space-y-2 text-sm">
                <li><a href="#" className="hover:text-red-400 transition-colors">About Us</a></li>
                <li><a href="#" className="hover:text-red-400 transition-colors">Careers</a></li>
                <li><a href="#" className="hover:text-red-400 transition-colors">Privacy</a></li>
                <li><a href="#" className="hover:text-red-400 transition-colors">Terms</a></li>
              </ul>
            </div>

            <div>
              <h3 className="font-bold text-white mb-4">Stay Updated</h3>
              <p className="text-sm text-slate-400 mb-3">Get health tips and news</p>
              <div className="flex space-x-2">
                <input 
                  type="email"
                  placeholder="Your email"
                  className="flex-1 px-4 py-2 rounded-full bg-slate-700 border border-slate-600 text-white text-sm focus:outline-none focus:border-red-400"
                />
                <button className="px-4 py-2 bg-gradient-to-r from-red-500 to-pink-500 rounded-full hover:shadow-lg transition-all">
                  <ChevronRight size={20} />
                </button>
              </div>
            </div>
          </div>

          <div className="pt-8 border-t border-slate-700 text-center text-sm text-slate-400">
            <p>© 2025 Bridge Hoito Oy. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;