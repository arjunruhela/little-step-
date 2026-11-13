import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Baby, LogOut, User } from 'lucide-react';
import Button from '../ui/Button';

const Navbar = () => {
  const navigate = useNavigate();
  const token = localStorage.getItem('token');
  const role = localStorage.getItem('role');

  const handleLogout = () => {
    localStorage.clear();
    navigate('/login');
  };

  return (
    <nav className="bg-white border-b border-slate-200 px-4 py-3 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2 text-primary-600 font-bold text-xl">
          <Baby className="w-8 h-8" />
          <span>Little Steps</span>
        </Link>

        <div className="flex items-center gap-4">
          {!token ? (
            <>
              <Link to="/login">
                <Button variant="ghost">Login</Button>
              </Link>
              <Link to="/register">
                <Button>Get Started</Button>
              </Link>
            </>
          ) : (
            <>
              <div className="flex items-center gap-2 text-sm text-slate-600 mr-4">
                <User className="w-4 h-4" />
                <span>{role === 'parent' ? 'Parent' : role === 'provider' ? 'Provider' : 'Admin'}</span>
              </div>
              <Button variant="outline" size="sm" onClick={handleLogout}>
                <LogOut className="w-4 h-4 mr-2" />
                Logout
              </Button>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
