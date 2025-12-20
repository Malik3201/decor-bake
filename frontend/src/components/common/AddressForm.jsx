import { useState, useEffect } from 'react';
import { Button } from './Button.jsx';
import { useToast } from '../../context/ToastContext.jsx';

export const AddressForm = ({ address, onSubmit, onCancel, loading = false }) => {
  const { error: showError } = useToast();
  const [formData, setFormData] = useState({
    fullName: '',
    phone: '',
    addressLine1: '',
    addressLine2: '',
    city: '',
    state: '',
    postalCode: '',
    country: 'United States',
    isDefault: false,
  });

  useEffect(() => {
    if (address) {
      setFormData(address);
    }
  }, [address]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const validate = () => {
    if (formData.fullName.length < 3) {
      showError('Please enter a valid full name (at least 3 characters)');
      return false;
    }
    
    const phoneRegex = /^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/;
    if (!phoneRegex.test(formData.phone)) {
      showError('Please enter a valid phone number');
      return false;
    }

    if (formData.postalCode.length < 5) {
      showError('Please enter a valid postal code');
      return false;
    }

    return true;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validate()) {
      onSubmit(formData);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">
            Full Name *
          </label>
          <input
            type="text"
            name="fullName"
            value={formData.fullName}
            onChange={handleChange}
            required
            placeholder="e.g. John Smith"
            className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-pink-500 focus:border-pink-500 transition-all"
          />
        </div>

        <div>
          <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">
            Phone Number *
          </label>
          <input
            type="tel"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            required
            placeholder="e.g. +1 234 567 8900"
            className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-pink-500 focus:border-pink-500 transition-all"
          />
        </div>
      </div>

      <div>
        <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">
          Street Address *
        </label>
        <div className="space-y-3">
          <input
            type="text"
            name="addressLine1"
            value={formData.addressLine1}
            onChange={handleChange}
            required
            placeholder="House number and street name"
            className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-pink-500 focus:border-pink-500 transition-all"
          />
          <input
            type="text"
            name="addressLine2"
            value={formData.addressLine2}
            onChange={handleChange}
            placeholder="Apartment, suite, unit, etc. (optional)"
            className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-pink-500 focus:border-pink-500 transition-all"
          />
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        <div className="md:col-span-1">
          <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">
            City *
          </label>
          <input
            type="text"
            name="city"
            value={formData.city}
            onChange={handleChange}
            required
            className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-pink-500 focus:border-pink-500 transition-all"
          />
        </div>
        <div>
          <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">
            State *
          </label>
          <input
            type="text"
            name="state"
            value={formData.state}
            onChange={handleChange}
            required
            className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-pink-500 focus:border-pink-500 transition-all"
          />
        </div>
        <div>
          <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">
            Postal Code *
          </label>
          <input
            type="text"
            name="postalCode"
            value={formData.postalCode}
            onChange={handleChange}
            required
            className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-pink-500 focus:border-pink-500 transition-all"
          />
        </div>
      </div>

      <div>
        <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">
          Country *
        </label>
        <input
          type="text"
          name="country"
          value={formData.country}
          onChange={handleChange}
          required
          className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-pink-500 focus:border-pink-500 transition-all bg-gray-50"
        />
      </div>

      <div className="relative flex items-start py-2">
        <div className="flex items-center h-5">
          <input
            type="checkbox"
            name="isDefault"
            id="isDefault"
            checked={formData.isDefault}
            onChange={handleChange}
            className="w-5 h-5 text-pink-600 border-gray-300 rounded-lg focus:ring-pink-500 transition-all cursor-pointer"
          />
        </div>
        <div className="ml-3 text-sm">
          <label htmlFor="isDefault" className="font-medium text-gray-700 cursor-pointer">
            Set as default address
          </label>
          <p className="text-gray-500">We'll use this address for your future orders.</p>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row gap-3 pt-4 border-t border-gray-100">
        <Button type="submit" variant="primary" size="lg" className="sm:flex-1" loading={loading}>
          {loading ? 'Saving...' : 'Save Address'}
        </Button>
        {onCancel && (
          <Button type="button" variant="outline" size="lg" className="sm:flex-1" onClick={onCancel} disabled={loading}>
            Cancel
          </Button>
        )}
      </div>
    </form>
  );
};

