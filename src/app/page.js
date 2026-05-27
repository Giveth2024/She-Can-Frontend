'use client';
import { useState } from 'react';

export default function PublicContactPage() {
  const [formData, setFormData] = useState({ name: '', email: '', message: '' });
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [serverError, setServerError] = useState('');

  const validateForm = () => {
    const activeErrors = {};
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!formData.name.trim() || formData.name.length < 2 || formData.name.length > 125) {
      activeErrors.name = 'Name must span between 2 and 125 characters.';
    }
    if (!formData.email.trim() || !emailRegex.test(formData.email)) {
      activeErrors.email = 'Please provide a valid email format (user@domain.com).';
    }
    if (!formData.message.trim() || formData.message.length < 10 || formData.message.length > 2500) {
      activeErrors.message = 'Message must be between 10 and 2500 characters long.';
    }

    setErrors(activeErrors);
    return Object.keys(activeErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: '' }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setServerError('');
    
    if (!validateForm()) return;

    setIsLoading(true);

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/submissions`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Something went wrong during submission execution.');
      }

      setIsSubmitted(true);
      setFormData({ name: '', email: '', message: '' });
    } catch (error) {
      setServerError(error.message || 'Server is temporarily unreachable. Please try again later.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="min-h-screen flex flex-col items-center justify-center p-4 sm:p-6 bg-brand-offWhite">
      <div className="w-full max-w-xl bg-brand-white p-8 rounded-xl shadow-sm border border-gray-100">
        
        {/* Foundation Branding Header */}
        <header className="text-center mb-8">
          <h1 className="font-title font-bold text-3xl text-brand-dark tracking-tight mb-2">
            SHE CAN <span className="text-brand-crimson">FOUNDATION</span>
          </h1>
          <p className="text-gray-500 font-medium text-sm">Submit your information or message directly using the secure platform below.</p>
        </header>

        {isSubmitted ? (
          <div className="text-center py-8 animate-fadeIn">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-red-50 text-brand-crimson mb-4 text-2xl font-bold">✓</div>
            <h2 className="font-title font-bold text-2xl text-brand-dark mb-2">Form Submitted Successfully</h2>
            <p className="text-gray-500 mb-6">Thank you for reaching out to us. Your contact entry record has been saved.</p>
            <button 
              onClick={() => setIsSubmitted(false)}
              className="px-6 py-2.5 bg-brand-crimson text-brand-white font-medium rounded-lg hover:bg-red-700 transition-colors font-body"
            >
              Submit Another Message
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-6">
            {serverError && (
              <div className="p-4 bg-red-50 border-l-4 border-brand-crimson text-brand-crimson text-sm rounded-r-lg font-medium">
                {serverError}
              </div>
            )}

            <div>
              <label className="block font-title font-semibold text-sm text-brand-dark mb-1.5">Full Name</label>
              <input 
                type="text" name="name" value={formData.name} onChange={handleChange}
                className={`w-full px-4 py-3 rounded-lg border ${errors.name ? 'border-brand-crimson ring-1 ring-brand-crimson' : 'border-gray-200'} focus:outline-none focus:border-brand-crimson focus:ring-1 focus:ring-brand-crimson transition-all`}
                placeholder="Enter your name" disabled={isLoading}
              />
              {errors.name && <p className="text-brand-crimson text-xs mt-1 font-medium">{errors.name}</p>}
            </div>

            <div>
              <label className="block font-title font-semibold text-sm text-brand-dark mb-1.5">Email Address</label>
              <input 
                type="email" name="email" value={formData.email} onChange={handleChange}
                className={`w-full px-4 py-3 rounded-lg border ${errors.email ? 'border-brand-crimson ring-1 ring-brand-crimson' : 'border-gray-200'} focus:outline-none focus:border-brand-crimson focus:ring-1 focus:ring-brand-crimson transition-all`}
                placeholder="user@domain.com" disabled={isLoading}
              />
              {errors.email && <p className="text-brand-crimson text-xs mt-1 font-medium">{errors.email}</p>}
            </div>

            <div>
              <label className="block font-title font-semibold text-sm text-brand-dark mb-1.5">Message / Inquiry</label>
              <textarea 
                name="message" rows="5" value={formData.message} onChange={handleChange}
                className={`w-full px-4 py-3 rounded-lg border ${errors.message ? 'border-brand-crimson ring-1 ring-brand-crimson' : 'border-gray-200'} focus:outline-none focus:border-brand-crimson focus:ring-1 focus:ring-brand-crimson transition-all resize-none`}
                placeholder="Type your communication details here..." disabled={isLoading}
              ></textarea>
              {errors.message && <p className="text-brand-crimson text-xs mt-1 font-medium">{errors.message}</p>}
            </div>

            <button 
              type="submit" disabled={isLoading}
              className="w-full py-3.5 bg-brand-crimson text-brand-white font-title font-bold rounded-lg hover:bg-red-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-all shadow-sm"
            >
              {isLoading ? 'Processing Ingestion...' : 'Submit Form'}
            </button>
          </form>
        )}
      </div>
    </main>
  );
}