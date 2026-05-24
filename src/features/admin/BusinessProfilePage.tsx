import React, { useEffect, useState } from 'react';
import { Building2, CheckCircle2 } from 'lucide-react';
import { GlassButton } from '../../components/ui/GlassButton';
import { InputField } from '../../components/ui/InputField';
import { useBusinessProfile } from '../../hooks/useOffers';
import { Business, BusinessType } from '../../types';

interface BusinessProfilePageProps {
  businessId: string;
}

const businessTypes: BusinessType[] = ['Restaurant', 'Gym', 'Salon', 'Clinic', 'Coaching', 'Turf', 'Cosmetics', 'Massage/Spa', 'Gaming Zone', 'Activity Center', 'Other'];

const selectClass =
  'w-full rounded-xl border border-slate-300 bg-white/70 px-4 py-2.5 text-slate-900 backdrop-blur-sm transition-all duration-200 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50 dark:border-slate-700 dark:bg-slate-950/50 dark:text-white';

export const BusinessProfilePage: React.FC<BusinessProfilePageProps> = ({ businessId }) => {
  const { business, saveBusiness } = useBusinessProfile(businessId);
  const [formData, setFormData] = useState<Business>(business);
  const [success, setSuccess] = useState('');

  useEffect(() => {
    setFormData(business);
  }, [business]);

  const handleChange = (event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = event.target;
    setSuccess('');
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    saveBusiness({ ...formData, createdAt: formData.createdAt || new Date().toISOString() });
    setSuccess('Business profile saved.');
  };

  return (
    <div className="mx-auto max-w-5xl space-y-8 p-6 md:p-8">
      <div>
        <p className="text-sm font-semibold text-blue-600 dark:text-blue-400">Business profile</p>
        <h1 className="mt-1 text-3xl font-bold text-slate-950 dark:text-white">{business.name}</h1>
        <p className="mt-1 text-slate-600 dark:text-slate-400">Edit the PDF-required business profile fields for this admin account.</p>
      </div>

      <form onSubmit={handleSubmit} className="rounded-3xl border border-slate-200/70 bg-white/70 p-6 shadow-sm shadow-slate-950/5 backdrop-blur-xl dark:border-slate-800/70 dark:bg-slate-900/65 md:p-8">
        <div className="mb-6 flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-slate-950 text-white dark:bg-white dark:text-slate-950">
            <Building2 className="h-5 w-5" />
          </div>
          <div>
            <h2 className="font-bold text-slate-950 dark:text-white">Profile Details</h2>
            <p className="text-sm text-slate-500 dark:text-slate-400">Visible across dashboard and public offer cards.</p>
          </div>
        </div>

        {success && (
          <div className="mb-6 flex gap-3 rounded-2xl border border-emerald-500/20 bg-emerald-500/10 p-4 text-sm font-medium text-emerald-700 dark:text-emerald-200">
            <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0" />
            <span>{success}</span>
          </div>
        )}

        <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
          <InputField name="name" value={formData.name} onChange={handleChange} label="Business Name" required />
          <div className="flex w-full flex-col gap-1.5">
            <label className="text-sm font-medium text-slate-700 dark:text-slate-200">Business Type</label>
            <select name="businessType" value={formData.businessType} onChange={handleChange} className={selectClass} required>
              {businessTypes.map((type) => <option key={type} value={type}>{type}</option>)}
            </select>
          </div>
          <InputField name="ownerName" value={formData.ownerName} onChange={handleChange} label="Owner Name" required />
          <InputField name="phone" value={formData.phone} onChange={handleChange} label="Phone Number" required />
          <InputField name="email" value={formData.email} onChange={handleChange} label="Email" type="email" required />
          <InputField name="city" value={formData.city} onChange={handleChange} label="City" required />
          <InputField name="openingTime" value={formData.openingTime} onChange={handleChange} label="Opening Time" type="time" required />
          <InputField name="closingTime" value={formData.closingTime} onChange={handleChange} label="Closing Time" type="time" required />
          <InputField name="logoUrl" value={formData.logoUrl || ''} onChange={handleChange} label="Logo URL" placeholder="Optional" />
          <InputField name="address" value={formData.address} onChange={handleChange} label="Address" required className="md:col-span-2" />
        </div>

        <div className="mt-6 flex justify-end border-t border-slate-200 pt-6 dark:border-slate-800">
          <GlassButton type="submit">Save Profile</GlassButton>
        </div>
      </form>
    </div>
  );
};
