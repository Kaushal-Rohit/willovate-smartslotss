import React, { useEffect, useMemo, useState } from 'react';
import { AlertCircle, CheckCircle2, ImageIcon } from 'lucide-react';
import { AmbientAssetUploader } from '../../components/ambient/AmbientAssetUploader';
import { GlassButton } from '../../components/ui/GlassButton';
import { InputField } from '../../components/ui/InputField';
import { useCategories, useOffers } from '../../hooks/useOffers';
import { Offer, OfferStatus } from '../../types';
import {
  addDays,
  businessTypeAssets,
  calculateDiscount,
  getBusinessById,
  validateOfferDates,
} from '../../services/dataStore';

interface CreateOfferPageProps {
  businessId: string;
  offerId?: string;
  onSaved?: () => void;
  onCancel?: () => void;
}

type FieldErrors = Partial<Record<'title' | 'category' | 'originalPrice' | 'offerPrice' | 'startDate' | 'endDate' | 'totalCapacity' | 'maxBookingPerCustomer' | 'status' | 'ambientAsset', string>>;

const defaultForm = (businessId: string, imageUrl: string): Partial<Offer> => ({
  businessId,
  title: '',
  category: '',
  originalPrice: 0,
  offerPrice: 0,
  discountPercentage: 0,
  startDate: '',
  endDate: '',
  startTime: '09:00',
  endTime: '18:00',
  totalCapacity: 1,
  maxBookingPerCustomer: 1,
  description: '',
  termsAndConditions: '',
  imageUrl,
  thumbnailUrl: imageUrl,
  status: 'Active',
});

const selectClass =
  'w-full rounded-xl border border-slate-300 bg-white/70 px-4 py-2.5 text-slate-900 backdrop-blur-sm transition-all duration-200 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50 dark:border-slate-700 dark:bg-slate-950/50 dark:text-white';

export const CreateOfferPage: React.FC<CreateOfferPageProps> = ({ businessId, offerId, onSaved, onCancel }) => {
  const business = getBusinessById(businessId);
  const defaultImage = businessTypeAssets[business.businessType];
  const { offers, saveOffer } = useOffers(businessId);
  const { categories } = useCategories(businessId);
  const [formData, setFormData] = useState<Partial<Offer>>(() => defaultForm(businessId, defaultImage));
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({});
  const [formError, setFormError] = useState('');
  const [success, setSuccess] = useState('');

  const editingOffer = useMemo(() => offers.find((offer) => offer.id === offerId), [offerId, offers]);
  const dateError = formData.startDate || formData.endDate
    ? validateOfferDates(formData.startDate, formData.endDate)
    : '';

  useEffect(() => {
    if (editingOffer) {
      setFormData({
        ...editingOffer,
        totalCapacity: editingOffer.totalCapacity || 1,
        maxBookingPerCustomer: editingOffer.maxBookingPerCustomer || 1,
        startTime: editingOffer.startTime || business.openingTime,
        endTime: editingOffer.endTime || business.closingTime,
      });
      setFieldErrors({});
      setFormError('');
      return;
    }

    setFormData({
      ...defaultForm(businessId, defaultImage),
      startTime: business.openingTime,
      endTime: business.closingTime,
    });
    setFieldErrors({});
    setFormError('');
  }, [business.closingTime, business.openingTime, businessId, defaultImage, editingOffer]);

  const setField = (name: keyof Offer, value: string | number | undefined) => {
    setSuccess('');
    setFormError('');
    setFieldErrors((prev) => ({ ...prev, [name]: undefined }));
    setFormData((prev) => {
      const updated = { ...prev, [name]: value };
      const originalPrice = Number(updated.originalPrice) || 0;
      const offerPrice = Number(updated.offerPrice) || 0;
      updated.discountPercentage = calculateDiscount(originalPrice, offerPrice);
      return updated;
    });
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    const numericFields = ['originalPrice', 'offerPrice', 'discountPercentage', 'totalCapacity', 'maxBookingPerCustomer'];
    setField(name as keyof Offer, numericFields.includes(name) ? Number(value) : value);
  };

  const validateForm = () => {
    const errors: FieldErrors = {};
    const originalPrice = Number(formData.originalPrice) || 0;
    const offerPrice = Number(formData.offerPrice) || 0;
    const capacity = Number(formData.totalCapacity) || 0;
    const maxPerCustomer = Number(formData.maxBookingPerCustomer) || 0;
    const datesMessage = validateOfferDates(formData.startDate, formData.endDate);

    if (!formData.title?.trim()) {
      errors.title = 'Offer title is required.';
    }
    if (!businessId) {
      errors.title = 'Business is required.';
    }
    if (!formData.category) {
      errors.category = 'Category is required.';
    }
    if (originalPrice <= 0) {
      errors.originalPrice = 'Original price must be greater than 0.';
    }
    if (offerPrice <= 0) {
      errors.offerPrice = 'Offer price must be positive.';
    } else if (offerPrice >= originalPrice) {
      errors.offerPrice = 'Offer price must be less than original price.';
    }
    if (datesMessage) {
      errors.startDate = datesMessage.includes('Start') ? datesMessage : undefined;
      errors.endDate = datesMessage.includes('End') ? datesMessage : undefined;
    }
    if (capacity <= 0) {
      errors.totalCapacity = 'Total capacity must be greater than 0.';
    }
    if (maxPerCustomer <= 0) {
      errors.maxBookingPerCustomer = 'Max booking per customer must be greater than 0.';
    }
    if (!formData.status) {
      errors.status = 'Status is required.';
    }

    setFieldErrors(errors);
    return errors;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const errors = validateForm();
    const firstError = Object.values(errors).find(Boolean);

    if (firstError) {
      setFormError(firstError);
      return;
    }

    const originalPrice = Number(formData.originalPrice) || 0;
    const offerPrice = Number(formData.offerPrice) || 0;
    const selectedAsset = formData.imageUrl || defaultImage;
    const savedOffer: Offer = {
      id: formData.id || `offer-${Date.now()}`,
      businessId,
      title: formData.title?.trim() || '',
      category: formData.category || '',
      originalPrice,
      offerPrice,
      discountPercentage: calculateDiscount(originalPrice, offerPrice),
      startDate: formData.startDate || '',
      endDate: formData.endDate || '',
      startTime: formData.startTime || business.openingTime,
      endTime: formData.endTime || business.closingTime,
      totalCapacity: Number(formData.totalCapacity) || 1,
      maxBookingPerCustomer: Number(formData.maxBookingPerCustomer) || 1,
      description: formData.description?.trim() || '',
      termsAndConditions: formData.termsAndConditions?.trim() || '',
      imageUrl: selectedAsset,
      thumbnailUrl: formData.ambientAsset?.url || selectedAsset,
      ambientAsset: formData.ambientAsset,
      status: (formData.status || 'Active') as OfferStatus,
      createdAt: formData.createdAt || new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      popularity: formData.popularity || 0,
    };

    saveOffer(savedOffer);
    setSuccess(offerId ? 'Offer updated successfully.' : 'Offer created successfully.');
    window.setTimeout(() => onSaved?.(), 350);
  };

  const minEndDate = formData.startDate ? addDays(formData.startDate, 1) : undefined;
  const maxStartDate = formData.endDate ? addDays(formData.endDate, -1) : undefined;

  return (
    <div className="mx-auto max-w-6xl p-6 md:p-8">
      <div className="mb-8 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-sm font-semibold text-blue-600 dark:text-blue-400">{business.name}</p>
          <h1 className="mt-1 text-3xl font-bold text-slate-950 dark:text-white">
            {offerId ? 'Edit Offer' : 'Create New Offer'}
          </h1>
          <p className="mt-1 text-slate-600 dark:text-slate-400">PDF-required offer fields, validation, slots, and ambient assets are handled here.</p>
        </div>
      </div>

      <div className="rounded-3xl border border-slate-200/70 bg-white/70 p-6 shadow-sm shadow-slate-950/5 backdrop-blur-xl transition-colors duration-500 dark:border-slate-800/70 dark:bg-slate-900/65 dark:shadow-black/20 md:p-8">
        {formError && (
          <div className="mb-6 flex gap-3 rounded-2xl border border-red-500/20 bg-red-500/10 p-4 text-sm font-medium text-red-700 dark:text-red-200">
            <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
            <span>{formError}</span>
          </div>
        )}

        {success && (
          <div className="mb-6 flex gap-3 rounded-2xl border border-emerald-500/20 bg-emerald-500/10 p-4 text-sm font-medium text-emerald-700 dark:text-emerald-200">
            <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0" />
            <span>{success}</span>
          </div>
        )}

        <form className="space-y-8" onSubmit={handleSubmit}>
          <section className="grid grid-cols-1 gap-6 lg:grid-cols-[1fr_320px]">
            <div className="space-y-6">
              <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                <InputField name="title" value={formData.title || ''} onChange={handleChange} label="Offer Title" placeholder="e.g., Afternoon Gym Trial" required error={fieldErrors.title} />

                <div className="flex w-full flex-col gap-1.5">
                  <label className="text-sm font-medium text-slate-700 dark:text-slate-200">Category</label>
                  <select name="category" value={formData.category || ''} onChange={handleChange} required className={selectClass}>
                    <option value="">Select category</option>
                    {categories.map((category) => (
                      <option key={category.id} value={category.name}>{category.name}</option>
                    ))}
                  </select>
                  {fieldErrors.category && <span className="text-xs text-red-500">{fieldErrors.category}</span>}
                  {!categories.length && (
                    <span className="text-xs text-amber-600 dark:text-amber-300">Create a category before publishing offers for this business.</span>
                  )}
                </div>

                <InputField name="originalPrice" value={formData.originalPrice ?? 0} onChange={handleChange} label="Original Price (INR)" type="number" min="1" placeholder="499" required error={fieldErrors.originalPrice} />
                <InputField name="offerPrice" value={formData.offerPrice ?? 0} onChange={handleChange} label="Offer Price (INR)" type="number" min="1" placeholder="99" required error={fieldErrors.offerPrice} />
                <InputField name="discountPercentage" value={formData.discountPercentage ?? 0} onChange={handleChange} label="Discount (%)" type="number" placeholder="80" readOnly className="opacity-80" />

                <div className="flex w-full flex-col gap-1.5">
                  <label className="text-sm font-medium text-slate-700 dark:text-slate-200">Status</label>
                  <select name="status" value={formData.status || 'Active'} onChange={handleChange} className={selectClass}>
                    <option value="Draft">Draft</option>
                    <option value="Active">Active</option>
                    <option value="Paused">Paused</option>
                    <option value="Expired">Expired</option>
                    <option value="Cancelled">Cancelled</option>
                  </select>
                  {fieldErrors.status && <span className="text-xs text-red-500">{fieldErrors.status}</span>}
                </div>

                <InputField name="startDate" value={formData.startDate || ''} onChange={handleChange} label="Start Date" type="date" max={maxStartDate} required error={fieldErrors.startDate || (dateError.includes('Start') ? dateError : undefined)} />
                <InputField name="endDate" value={formData.endDate || ''} onChange={handleChange} label="End Date" type="date" min={minEndDate} required error={fieldErrors.endDate || (dateError.includes('End') ? dateError : undefined)} />
                <InputField name="startTime" value={formData.startTime || ''} onChange={handleChange} label="Start Time" type="time" required />
                <InputField name="endTime" value={formData.endTime || ''} onChange={handleChange} label="End Time" type="time" required />
                <InputField name="totalCapacity" value={formData.totalCapacity ?? 1} onChange={handleChange} label="Total Capacity" type="number" min="1" required error={fieldErrors.totalCapacity} />
                <InputField name="maxBookingPerCustomer" value={formData.maxBookingPerCustomer ?? 1} onChange={handleChange} label="Max Booking Per Customer" type="number" min="1" required error={fieldErrors.maxBookingPerCustomer} />
              </div>

              <div className="flex w-full flex-col gap-1.5">
                <label className="text-sm font-medium text-slate-700 dark:text-slate-200">Description</label>
                <textarea
                  name="description"
                  value={formData.description || ''}
                  onChange={handleChange}
                  className={`${selectClass} min-h-28 resize-y`}
                  rows={4}
                  placeholder="Describe the offer value, inclusions, and booking details."
                  required
                />
              </div>

              <div className="flex w-full flex-col gap-1.5">
                <label className="text-sm font-medium text-slate-700 dark:text-slate-200">Terms and Conditions</label>
                <textarea
                  name="termsAndConditions"
                  value={formData.termsAndConditions || ''}
                  onChange={handleChange}
                  className={`${selectClass} min-h-24 resize-y`}
                  rows={3}
                  placeholder="e.g., Valid for first-time customers only."
                />
              </div>
            </div>

            <aside className="space-y-4 rounded-2xl border border-slate-200/70 bg-slate-50/80 p-4 dark:border-slate-800/70 dark:bg-slate-950/45">
              <div className="flex items-center gap-2 text-sm font-semibold text-slate-700 dark:text-slate-200">
                <ImageIcon className="h-4 w-4" />
                Ambient asset
              </div>
              <select name="imageUrl" value={formData.imageUrl || defaultImage} onChange={handleChange} className={selectClass}>
                <option value={businessTypeAssets[business.businessType]}>{business.businessType} default</option>
                <option value="/images/218fc872735831.5bf1e45999c40.gif">Gym motion</option>
                <option value="/images/NOT3bRt5u3.gif">Restaurant motion</option>
                <option value="/images/salon-motion.gif">Salon motion</option>
                <option value="/images/bc2c5056215299.59a596bb8c323.gif">Action motion</option>
                <option value="/images/personal-trainer-gives-instruction-woman-squat-exercise-illustration_166119-18.avif">Clinic visual</option>
              </select>
              <AmbientAssetUploader
                value={formData.ambientAsset}
                fallbackUrl={formData.imageUrl || defaultImage}
                onChange={(asset) => {
                  setFormError('');
                  setFieldErrors((prev) => ({ ...prev, ambientAsset: undefined }));
                  setFormData((prev) => ({ ...prev, ambientAsset: asset, thumbnailUrl: asset?.url || prev.imageUrl || defaultImage }));
                }}
                onError={(message) => {
                  setFieldErrors((prev) => ({ ...prev, ambientAsset: message }));
                  setFormError(message);
                }}
              />
              {fieldErrors.ambientAsset && <p className="text-xs font-medium text-red-500">{fieldErrors.ambientAsset}</p>}
              <p className="text-xs leading-5 text-slate-500 dark:text-slate-400">
                Uploaded assets override the selected preset. GIF/image media is mounted behind card content only on hover for readability and performance.
              </p>
            </aside>
          </section>

          <div className="flex flex-col-reverse gap-3 border-t border-slate-200 pt-6 dark:border-slate-800 sm:flex-row sm:items-center sm:justify-end">
            <GlassButton variant="secondary" type="button" onClick={onCancel}>
              Cancel
            </GlassButton>
            <GlassButton type="submit">
              {offerId ? 'Save Changes' : 'Publish Offer'}
            </GlassButton>
          </div>
        </form>
      </div>
    </div>
  );
};
