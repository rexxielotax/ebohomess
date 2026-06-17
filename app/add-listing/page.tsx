'use client';
import { useState } from 'react';
import { supabase } from '@/lib/supabase';
import dynamic from 'next/dynamic';

const MapPinPicker = dynamic(() => import('@/components/MapPinPicker'), { ssr: false });

export default function AddListingPage() {
  const [form, setForm] = useState({
    title: '',
    description: '',
    rent: '',
    property_type: '',
    bedroom_count: '',
    location_text: '',
    availability_date: '',
    amenities: [] as string[],
  });
  const [lat, setLat] = useState<number | null>(null);
  const [lng, setLng] = useState<number | null>(null);
  const [photos, setPhotos] = useState<string[]>([]);
  const [uploading, setUploading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);

  const amenityOptions = ['Water', 'Generator', 'Parking', 'Security', 'Fence', 'Borehole'];

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const toggleAmenity = (item: string) => {
    setForm((prev) => ({
      ...prev,
      amenities: prev.amenities.includes(item)
        ? prev.amenities.filter((a) => a !== item)
        : [...prev.amenities, item],
    }));
  };

  const handleSubmit = async () => {
    setSubmitting(true);
    const { error } = await supabase.from('listings').insert({
      title: form.title,
      description: form.description,
      price_monthly: Number(form.rent),
      property_type: form.property_type,
      bedrooms: Number(form.bedroom_count),
      location_text: form.location_text,
      availability_date: form.availability_date || null,
      amenities: form.amenities,
      photos,
      lat,
      lng,
    });
    setSubmitting(false);
    if (!error) setSuccess(true);
    else alert('Error saving listing: ' + error.message);
  };

  if (success) {
    return (
      <div style={{ padding: 40, textAlign: 'center' }}>
        <h2>Listing submitted successfully!</h2>
        <button onClick={() => {
          setSuccess(false);
          setForm({ title: '', description: '', rent: '', property_type: '', bedroom_count: '', location_text: '', availability_date: '', amenities: [] });
          setPhotos([]);
        }}>Add Another</button>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: 600, margin: '0 auto', padding: 24 }}>
      <h1>Add Your Property</h1>
      <label>Title</label>
      <input name="title" value={form.title} onChange={handleChange} placeholder="e.g. 2 Bedroom Flat in Abakaliki" style={{ width: '100%', marginBottom: 12, padding: 8 }} />
      <label>Description</label>
      <textarea name="description" value={form.description} onChange={handleChange} rows={3} style={{ width: '100%', marginBottom: 12, padding: 8 }} />
      <label>Monthly Rent (₦)</label>
      <input name="rent" type="number" value={form.rent} onChange={handleChange} style={{ width: '100%', marginBottom: 12, padding: 8 }} />
      <label>Property Type</label>
      <select name="property_type" value={form.property_type} onChange={handleChange} style={{ width: '100%', marginBottom: 12, padding: 8 }}>
        <option value="">Select type</option>
        <option value="room">Single Room</option>
        <option value="self-con">Self Contain</option>
        <option value="flat">Flat</option>
        <option value="duplex">Duplex</option>
        <option value="bungalow">Bungalow</option>
      </select>
      <label>Number of Bedrooms</label>
      <input name="bedroom_count" type="number" value={form.bedroom_count} onChange={handleChange} style={{ width: '100%', marginBottom: 12, padding: 8 }} />
      <label>Neighborhood / Area</label>
      <input name="location_text" value={form.location_text} onChange={handleChange} placeholder="e.g. GRA Abakaliki" style={{ width: '100%', marginBottom: 12, padding: 8 }} />
      <label>Availability Date</label>
      <input name="availability_date" type="date" value={form.availability_date} onChange={handleChange} style={{ width: '100%', marginBottom: 12, padding: 8 }} />
      <label>Amenities</label>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginBottom: 12 }}>
        {amenityOptions.map((item) => (
          <button key={item} onClick={() => toggleAmenity(item)} style={{ padding: '6px 12px', background: form.amenities.includes(item) ? '#16a34a' : '#e5e7eb', color: form.amenities.includes(item) ? '#fff' : '#000', border: 'none', borderRadius: 20, cursor: 'pointer' }}>
            {item}
          </button>
        ))}
      </div>
      <label>Photos (up to 10)</label>
      <input type="file" multiple accept="image/*" onChange={() => {}} style={{ marginBottom: 8 }} />
      {uploading && <p>Uploading photos...</p>}
      <label>Drop Pin on Map</label>
      <p style={{ fontSize: 12, color: '#666' }}>Click on the map to mark your property location</p>
      <MapPinPicker onSelect={(lat: number, lng: number) => { setLat(lat); setLng(lng); }} />
      {lat && <p style={{ fontSize: 12, color: '#16a34a', marginTop: 4 }}>Location selected</p>}
      <button onClick={handleSubmit} disabled={submitting} style={{ marginTop: 20, width: '100%', padding: 14, background: '#16a34a', color: '#fff', border: 'none', borderRadius: 8, fontSize: 16, cursor: 'pointer' }}>
        {submitting ? 'Submitting...' : 'Submit Listing'}
      </button>
    </div>
  );
}