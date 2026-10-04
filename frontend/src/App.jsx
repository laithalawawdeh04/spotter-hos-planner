import React, { useState } from 'react';
import axios from 'axios';
import { Truck, Clock, AlertCircle, MapPin } from 'lucide-react';

function App() {
  const [formData, setFormData] = useState({
    start_location: 'Chicago, IL',
    end_location: 'Dallas, TX',
    distance_miles: 920,
  });

  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setResult(null);

    try {
      const response = await axios.post('http://127.0.0.1:8000/api/hos/calculate/', {
        start_location: formData.start_location,
        end_location: formData.end_location,
        distance_miles: parseFloat(formData.distance_miles),
      });
      setResult(response.data);
    } catch (err) {
      setError('Failed to connect to the server. Make sure the Django backend is running.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 p-6 font-sans">
      <header className="max-w-4xl mx-auto mb-8 flex items-center justify-between border-b border-slate-700 pb-4">
        <div className="flex items-center space-x-3 gap-3">
          <Truck className="w-8 h-8 text-blue-500" />
          <h1 className="text-2xl font-bold tracking-wide">Spotter AI - HOS Planner</h1>
        </div>
      </header>

      <main className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Form Card */}
        <div className="bg-slate-800 p-6 rounded-xl border border-slate-700 shadow-lg h-fit">
          <h2 className="text-lg font-semibold mb-4 text-blue-400">Trip Details</h2>
          <form onSubmit={handleSubmit} className="space-y-4 text-slate-200">
            <div>
              <label className="block text-sm mb-1">Start Location</label>
              <input
                type="text"
                name="start_location"
                value={formData.start_location}
                onChange={handleChange}
                className="w-full bg-slate-900 border border-slate-600 rounded p-2 text-white focus:outline-none focus:border-blue-500"
                required
              />
            </div>

            <div>
              <label className="block text-sm mb-1">Destination</label>
              <input
                type="text"
                name="end_location"
                value={formData.end_location}
                onChange={handleChange}
                className="w-full bg-slate-900 border border-slate-600 rounded p-2 text-white focus:outline-none focus:border-blue-500"
                required
              />
            </div>

            <div>
              <label className="block text-sm mb-1">Distance (Miles)</label>
              <input
                type="number"
                name="distance_miles"
                value={formData.distance_miles}
                onChange={handleChange}
                className="w-full bg-slate-900 border border-slate-600 rounded p-2 text-white focus:outline-none focus:border-blue-500"
                required
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-600 hover:bg-blue-500 text-white font-medium py-2 rounded transition-colors"
            >
              {loading ? 'Calculating...' : 'Calculate HOS Schedule'}
            </button>
          </form>
        </div>

        {/* Results Timeline Card */}
        <div className="md:col-span-2 bg-slate-800 p-6 rounded-xl border border-slate-700 shadow-lg">
          <h2 className="text-lg font-semibold mb-4 text-blue-400">Trip Schedule (FMCSA Compliant)</h2>

          {error && (
            <div className="flex items-center gap-2 p-3 bg-red-900/50 border border-red-500 rounded text-red-200">
              <AlertCircle className="w-5 h-5" />
              <span>{error}</span>
            </div>
          )}

          {!result && !error && (
            <div className="text-slate-400 text-center py-12">
              Submit trip details to generate the timeline and mandatory rest breaks.
            </div>
          )}

          {result && (
            <div>
              <div className="grid grid-cols-3 gap-4 mb-6 bg-slate-900 p-4 rounded-lg border border-slate-700 text-center">
                <div>
                  <p className="text-xs text-slate-400">Total Distance</p>
                  <p className="text-lg font-bold text-white">{result.total_distance_miles} miles</p>
                </div>
                <div>
                  <p className="text-xs text-slate-400">Driving Hours</p>
                  <p className="text-lg font-bold text-white">{result.estimated_driving_hours} hrs</p>
                </div>
                <div>
                  <p className="text-xs text-slate-400">Total Duration</p>
                  <p className="text-lg font-bold text-blue-400">{result.total_trip_duration_hours} hrs</p>
                </div>
              </div>

              <div className="space-y-4">
                {result.schedule.map((item, idx) => (
                  <div key={idx} className="flex gap-4 p-3 bg-slate-900/60 rounded border border-slate-700/50">
                    <div className="mt-1">
                      <Clock className="w-5 h-5 text-blue-400" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-semibold text-white">{item.event}</span>
                        <span className="text-xs text-slate-400">({item.time})</span>
                      </div>
                      <p className="text-sm text-slate-300 mt-1">{item.details}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}

export default App;