import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowRight, Baby, Clock3, ShieldCheck, Search, MapPin, Star, HeartHandshake } from 'lucide-react';
import api from '../services/api';
import Navbar from '../components/layout/Navbar';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';

const LandingPage = () => {
  const [centers, setCenters] = useState([]);
  const [city, setCity] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    api.get('/centers?limit=6&verificationStatus=verified')
      .then(({ data }) => setCenters(data?.data?.data || data?.data || []))
      .catch(() => setCenters([]));
  }, []);

  const search = (e) => {
    e.preventDefault();
    navigate(`/search${city ? `?city=${encodeURIComponent(city)}` : ''}`);
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar />
      <section className="relative overflow-hidden bg-gradient-to-br from-primary-50 via-white to-emerald-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-28 grid lg:grid-cols-2 gap-12 items-center">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full bg-white border border-primary-100 px-4 py-2 text-sm font-medium text-primary-700 shadow-sm mb-6">
              <ShieldCheck className="w-4 h-4" /> Trusted childcare, around the clock
            </div>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-slate-900 leading-tight">
              Safe care for your little ones. <span className="text-primary-600">On your schedule.</span>
            </h1>
            <p className="mt-6 text-lg text-slate-600 max-w-xl leading-8">
              Discover verified childcare centers, compare plans, check availability and request care for hourly, daily or monthly needs.
            </p>
            <form onSubmit={search} className="mt-8 flex flex-col sm:flex-row gap-3 max-w-xl">
              <div className="flex-1 relative">
                <MapPin className="absolute left-3 top-3.5 w-5 h-5 text-slate-400" />
                <input value={city} onChange={(e) => setCity(e.target.value)} placeholder="Search by city, e.g. Delhi" className="w-full pl-11 pr-4 py-3.5 rounded-xl border border-slate-200 bg-white outline-none focus:ring-2 focus:ring-primary-200 focus:border-primary-500" />
              </div>
              <Button type="submit" className="py-3.5 px-6"><Search className="w-4 h-4 mr-2" /> Find childcare</Button>
            </form>
            <div className="mt-7 flex flex-wrap gap-5 text-sm text-slate-600">
              <span className="flex items-center gap-2"><ShieldCheck className="w-4 h-4 text-primary-600" /> Verified providers</span>
              <span className="flex items-center gap-2"><Clock3 className="w-4 h-4 text-primary-600" /> 24×7 options</span>
              <span className="flex items-center gap-2"><HeartHandshake className="w-4 h-4 text-primary-600" /> Family-first</span>
            </div>
          </div>
          <div className="hidden lg:block">
            <div className="bg-white rounded-3xl shadow-xl border border-slate-100 p-7 rotate-1">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 rounded-2xl bg-primary-100 flex items-center justify-center"><Baby className="w-6 h-6 text-primary-600" /></div>
                <div><p className="font-bold text-slate-900">Little Steps</p><p className="text-sm text-slate-500">Care made simpler</p></div>
              </div>
              <div className="space-y-3">
                {['Verified caregivers', 'Flexible booking plans', 'Transparent center details', 'Parent booking history'].map((x) => <div key={x} className="flex items-center gap-3 p-4 rounded-2xl bg-slate-50"><ShieldCheck className="w-5 h-5 text-emerald-600" /><span className="font-medium text-slate-700">{x}</span></div>)}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="flex items-end justify-between gap-4 mb-7"><div><p className="text-sm font-semibold text-primary-600 uppercase tracking-wide">Explore</p><h2 className="text-3xl font-bold text-slate-900 mt-1">Verified childcare centers</h2></div><Link to="/search" className="text-primary-600 font-semibold flex items-center gap-1">View all <ArrowRight className="w-4 h-4" /></Link></div>
        {centers.length ? <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">{centers.map((center) => <CenterCard key={center._id} center={center} />)}</div> : <Card><div className="text-center py-10 text-slate-500">No verified centers are available yet. Try the search page after seeding your database.</div></Card>}
      </section>

      <section className="bg-white border-y border-slate-100"><div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14 grid md:grid-cols-3 gap-8">{[['01','Search & compare','Find centers by city, age group, services and 24×7 availability.'],['02','Choose a plan','Review hourly, daily or monthly care options and center details.'],['03','Request a booking','Select your child and dates, then track the booking from your dashboard.']].map(([n,t,d]) => <div key={n}><div className="text-primary-600 font-bold text-sm">{n}</div><h3 className="text-xl font-bold mt-2">{t}</h3><p className="text-slate-600 mt-2 leading-7">{d}</p></div>)}</div></section>
    </div>
  );
};

const CenterCard = ({ center }) => <Card className="overflow-hidden p-0 hover:shadow-lg transition-shadow"><div className="h-40 bg-gradient-to-br from-primary-100 to-emerald-100 flex items-center justify-center">{center.images?.[0] ? <img src={center.images[0]} alt={center.name} className="w-full h-full object-cover" /> : <Baby className="w-16 h-16 text-primary-400" />}</div><div className="p-5"><div className="flex justify-between gap-3"><h3 className="font-bold text-lg text-slate-900">{center.name}</h3><span className="flex items-center gap-1 text-sm font-semibold"><Star className="w-4 h-4 fill-amber-400 text-amber-400" /> {center.rating || 'New'}</span></div><p className="text-sm text-slate-500 mt-1 flex items-center gap-1"><MapPin className="w-3.5 h-3.5" /> {center.city}</p><p className="text-sm text-slate-600 mt-3 line-clamp-2">{center.description}</p><Link to={`/centers/${center._id}`} className="mt-4 block"><Button variant="outline" className="w-full">View center</Button></Link></div></Card>;
export default LandingPage;
