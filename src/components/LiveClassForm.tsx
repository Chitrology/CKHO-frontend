import React, { useState, useEffect } from 'react';

interface LiveClassFormProps {
  mode: 'create' | 'edit';
  initialData?: Partial<LiveClassFormData>;
  onSubmitSuccess?: () => void;
}

export interface LiveClassFormData {
  title: string;
  description: string;
  instructorId: string;
  dateTime: string;
  durationMinutes: number;
  maxCapacity: number;
  priceStandard: number;
  priceEarlyBird: number;
  earlyBirdStart: string;
  earlyBirdEnd: string;
  bundleEligible: boolean;
  bundleOfferEnabled: boolean;
  platform: 'ZOOM' | 'GOOGLE_MEET';
  zoomLink?: string;
}

interface Instructor {
  id: string;
  fullName: string;
}

const defaultForm: LiveClassFormData = {
  title: '',
  description: '',
  instructorId: '',
  dateTime: '',
  durationMinutes: 60,
  maxCapacity: 20,
  priceStandard: 149900,
  priceEarlyBird: 99900,
  earlyBirdStart: '',
  earlyBirdEnd: '',
  bundleEligible: true,
  bundleOfferEnabled: false,
  platform: 'ZOOM',
  zoomLink: '',
};

const LiveClassForm: React.FC<LiveClassFormProps> = ({ mode, initialData, onSubmitSuccess }) => {
  const [form, setForm] = useState<LiveClassFormData>({ ...defaultForm, ...initialData });
  const [instructors, setInstructors] = useState<Instructor[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  useEffect(() => {
    // Fetch instructors (mentors)
    const fetchInstructors = async () => {
      try {
        const res = await fetch('http://localhost:4000/api/mentors');
        const data = await res.json();
        setInstructors(data || []);
      } catch {
        setInstructors([]);
      }
    };
    fetchInstructors();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    let newValue: any = value;
    if (type === 'checkbox' && 'checked' in e.target) {
      newValue = (e.target as HTMLInputElement).checked;
    }
    setForm((prev) => ({
      ...prev,
      [name]: newValue,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(null);
    try {
      const payload = {
        ...form,
        durationMinutes: Number(form.durationMinutes),
        maxCapacity: Number(form.maxCapacity),
        priceStandard: Number(form.priceStandard),
        priceEarlyBird: Number(form.priceEarlyBird),
      };
      const url = mode === 'create' ? '/api/admin/live-classes' : `/api/admin/live-classes/${(initialData as any)?.id}`;
      const method = mode === 'create' ? 'POST' : 'PUT';
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      if (!res.ok) throw new Error('Failed to save live class');
      setSuccess('Live class saved successfully!');
      if (onSubmitSuccess) onSubmitSuccess();
    } catch (err: any) {
      setError(err.message || 'Error saving live class');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 bg-white p-8 rounded-lg shadow-md">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700">Title</label>
          <input name="title" value={form.title} onChange={handleChange} required className="mt-1 block w-full border-gray-300 rounded-md shadow-sm" />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Instructor</label>
          <select name="instructorId" value={form.instructorId} onChange={handleChange} required className="mt-1 block w-full border-gray-300 rounded-md shadow-sm">
            <option value="">Select instructor</option>
            {instructors.map((inst) => (
              <option key={inst.id} value={inst.id}>{inst.fullName}</option>
            ))}
          </select>
        </div>
        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-gray-700">Description</label>
          <textarea name="description" value={form.description} onChange={handleChange} required rows={3} className="mt-1 block w-full border-gray-300 rounded-md shadow-sm" />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Date & Time</label>
          <input name="dateTime" type="datetime-local" value={form.dateTime} onChange={handleChange} required className="mt-1 block w-full border-gray-300 rounded-md shadow-sm" />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Duration (minutes)</label>
          <input name="durationMinutes" type="number" min={1} value={form.durationMinutes} onChange={handleChange} required className="mt-1 block w-full border-gray-300 rounded-md shadow-sm" />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Max Capacity</label>
          <input name="maxCapacity" type="number" min={1} value={form.maxCapacity} onChange={handleChange} required className="mt-1 block w-full border-gray-300 rounded-md shadow-sm" />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Standard Price (₹)</label>
          <input name="priceStandard" type="number" min={0} value={form.priceStandard} onChange={handleChange} required className="mt-1 block w-full border-gray-300 rounded-md shadow-sm" />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Early Bird Price (₹)</label>
          <input name="priceEarlyBird" type="number" min={0} value={form.priceEarlyBird} onChange={handleChange} required className="mt-1 block w-full border-gray-300 rounded-md shadow-sm" />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Early Bird Start</label>
          <input name="earlyBirdStart" type="datetime-local" value={form.earlyBirdStart} onChange={handleChange} required className="mt-1 block w-full border-gray-300 rounded-md shadow-sm" />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Early Bird End</label>
          <input name="earlyBirdEnd" type="datetime-local" value={form.earlyBirdEnd} onChange={handleChange} required className="mt-1 block w-full border-gray-300 rounded-md shadow-sm" />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Platform</label>
          <select name="platform" value={form.platform} onChange={handleChange} required className="mt-1 block w-full border-gray-300 rounded-md shadow-sm">
            <option value="ZOOM">Zoom</option>
            <option value="GOOGLE_MEET">Google Meet</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Join Link (optional)</label>
          <input name="zoomLink" value={form.zoomLink} onChange={handleChange} className="mt-1 block w-full border-gray-300 rounded-md shadow-sm" />
        </div>
        <div className="flex items-center gap-2">
          <input name="bundleEligible" type="checkbox" checked={form.bundleEligible} onChange={handleChange} />
          <label className="text-sm text-gray-700">Bundle Eligible</label>
        </div>
        <div className="flex items-center gap-2">
          <input name="bundleOfferEnabled" type="checkbox" checked={form.bundleOfferEnabled} onChange={handleChange} />
          <label className="text-sm text-gray-700">Bundle Offer Enabled</label>
        </div>
      </div>
      {error && <div className="text-red-600 text-sm">{error}</div>}
      {success && <div className="text-green-600 text-sm">{success}</div>}
      <div className="flex gap-4 justify-end">
        <button type="submit" disabled={loading} className="px-4 py-2 rounded-md text-sm font-medium text-white bg-pink-600 hover:bg-pink-700 disabled:opacity-50">
          {loading ? (mode === 'create' ? 'Creating...' : 'Saving...') : (mode === 'create' ? 'Create Live Class' : 'Save Changes')}
        </button>
      </div>
    </form>
  );
};

export default LiveClassForm; 