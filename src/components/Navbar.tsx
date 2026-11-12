import React, { useState, useRef, useEffect } from 'react';
import {
  Eye,
  PlusCircle,
  Users,
  Activity,
  ShieldCheck,
  ChevronDown,
  ChevronRight,
  BookOpen,
  Menu,
  X,
  Check,
  Cpu
} from 'lucide-react';
import { CLINICAL_DISCLAIMER } from '../types';

interface NavbarProps {
  currentView: string;
  onNavigate: (view: string, params?: any) => void;
  modelStatus: { loaded: boolean; version: string | null };
  currentRole: string;
  onRoleChange: (role: string) => void;
}

interface RoleOption {
  name: string;
  role: string;
  shortRole: string;
  initials: string;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentView,
  onNavigate,
  modelStatus,
  currentRole,
  onRoleChange,
}) => {
  const [roleMenuOpen, setRoleMenuOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [disclaimerVisible, setDisclaimerVisible] = useState(true);

  const roleDropdownRef = useRef<HTMLDivElement>(null);

  const roles: RoleOption[] = [
    {
      name: 'dr. Andi Pratama, Sp.M',
      role: 'Dokter Spesialis Mata (Reviewer)',
      shortRole: 'Spesialis Mata',
      initials: 'AP',
    },
    {
      name: 'Suster Nabila, S.Kep',
      role: 'Operator Screening Primer',
      shortRole: 'Operator Primer',
      initials: 'SN',
    },
    {
      name: 'Administrator Medis',
      role: 'Admin Sistem & Data Pasien',
      shortRole: 'Admin Sistem',
      initials: 'AM',
    },
  ];

  const currentRoleObj = roles.find((r) => r.name === currentRole) || roles[0];

  // Close role dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        roleDropdownRef.current &&
        !roleDropdownRef.current.contains(event.target as Node)
      ) {
        setRoleMenuOpen(false);
      }
    };
    if (roleMenuOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [roleMenuOpen]);

  const handleNav = (view: string, params?: any) => {
    onNavigate(view, params);
    setMobileMenuOpen(false);
  };

  const navItems = [
    {
      id: 'patients',
      label: 'Daftar Pasien',
      icon: Users,
      isActive: currentView === 'patients' || currentView === 'patient-detail',
    },
    {
      id: 'new-examination',
      label: 'Pemeriksaan Baru',
      icon: PlusCircle,
      isActive: currentView === 'new-examination',
    },
    {
      id: 'examinations-list',
      label: 'Riwayat Screening',
      icon: Activity,
      isActive: currentView === 'examinations-list' || currentView === 'analysis',
    },
    {
      id: 'education',
      label: 'Panduan & Edukasi',
      icon: BookOpen,
      isActive: currentView === 'education',
      badge: 'ICDR',
    },
  ];

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200/80 shadow-2xs">
      {/* Top Clinical Disclaimer Banner */}
      {disclaimerVisible && (
        <div className="bg-slate-900 text-slate-300 px-4 py-1.5 text-xs border-b border-slate-800 transition-all">
          <div className="max-w-7xl mx-auto flex items-center justify-between gap-3">
            <div className="flex items-center gap-2 truncate min-w-0">
              <span className="flex items-center gap-1.5 px-1.5 py-0.5 rounded bg-emerald-500/20 text-emerald-300 text-[10px] font-bold tracking-wide uppercase border border-emerald-500/30 flex-shrink-0">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                <span>Notice Klinis</span>
              </span>
              <span className="text-[11px] text-slate-300 truncate" title={CLINICAL_DISCLAIMER}>
                <strong>AI CAD Support:</strong> {CLINICAL_DISCLAIMER}
              </span>
            </div>

            <div className="flex items-center gap-3 flex-shrink-0">
              <div className="hidden sm:flex items-center gap-1.5 text-[11px] text-emerald-400/90 font-medium">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-400" />
                </span>
                <span>UU PDP No. 27/2022</span>
              </div>

              <button
                type="button"
                onClick={() => setDisclaimerVisible(false)}
                className="text-slate-400 hover:text-slate-100 p-0.5 rounded transition"
                title="Tutup pemberitahuan"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Main Nav Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
        {/* Brand & Logo */}
        <div
          onClick={() => handleNav('patients')}
          className="flex items-center gap-3 cursor-pointer group select-none flex-shrink-0"
        >
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-emerald-600 via-teal-600 to-emerald-500 text-white flex items-center justify-center shadow-md shadow-emerald-500/20 group-hover:scale-105 transition-all">
            <Eye className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-extrabold text-lg text-slate-900 tracking-tight leading-none">
                CAD-ViT
              </span>
              <span className="text-[10px] uppercase font-bold tracking-wider px-1.5 py-0.5 rounded-md bg-emerald-50 text-emerald-800 border border-emerald-200">
                Retina AI
              </span>
            </div>
            <p className="text-[11px] text-slate-500 font-medium leading-none mt-1 hidden sm:block">
              Sistem Informasi Deteksi Retinopati Diabetik
            </p>
          </div>
        </div>

        {/* Desktop Navigation Segmented Tabs */}
        <nav className="hidden lg:flex items-center gap-1 bg-slate-100/80 p-1 rounded-xl border border-slate-200/70">
          {navItems.map((item) => {
            const Icon = item.icon;
            const active = item.isActive;
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => handleNav(item.id)}
                className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all duration-150 ${
                  active
                    ? 'bg-white text-emerald-800 shadow-xs border border-slate-200/60'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-white/60'
                }`}
              >
                <Icon
                  className={`w-4 h-4 transition-colors ${
                    active ? 'text-emerald-600' : 'text-slate-500'
                  }`}
                />
                <span>{item.label}</span>
                {item.badge && (
                  <span
                    className={`text-[9px] font-bold px-1.5 py-0.2 rounded uppercase tracking-wider ${
                      active
                        ? 'bg-emerald-100 text-emerald-800'
                        : 'bg-slate-200 text-slate-600'
                    }`}
                  >
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>

        {/* Right Area: AI Model Status, Role Switcher, Mobile Toggle */}
        <div className="flex items-center gap-2.5">
          {/* AI Model Status Badge */}
          <div
            className="hidden sm:flex items-center gap-2 px-2.5 py-1.5 rounded-xl border border-slate-200/80 bg-slate-50/80 text-xs shadow-2xs"
            title={`Vision Transformer ViT-B/16 (${modelStatus.loaded ? 'Online' : 'Offline'})`}
          >
            <span className="relative flex h-2 w-2 flex-shrink-0">
              {modelStatus.loaded && (
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
              )}
              <span
                className={`relative inline-flex rounded-full h-2 w-2 ${
                  modelStatus.loaded ? 'bg-emerald-500' : 'bg-rose-500'
                }`}
              />
            </span>
            <div className="flex items-center gap-1.5">
              <Cpu className="w-3.5 h-3.5 text-slate-400" />
              <span className="font-semibold text-slate-700 text-xs">
                {modelStatus.loaded ? 'ViT Ready' : 'AI Offline'}
              </span>
            </div>
            {modelStatus.version && (
              <span className="text-slate-400 font-mono text-[10px] pl-1 border-l border-slate-200">
                {modelStatus.version}
              </span>
            )}
          </div>

          {/* Role Switcher Menu */}
          <div className="relative" ref={roleDropdownRef}>
            <button
              type="button"
              onClick={() => setRoleMenuOpen(!roleMenuOpen)}
              className="flex items-center gap-2 p-1.5 md:pl-2 md:pr-2.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-xs transition shadow-2xs group"
              aria-label="Menu Pengguna & Peran"
            >
              <div className="w-7 h-7 rounded-lg bg-emerald-100 text-emerald-800 font-bold text-xs flex items-center justify-center border border-emerald-200/80 flex-shrink-0 group-hover:bg-emerald-200/80 transition-colors">
                {currentRoleObj.initials}
              </div>

              <div className="text-left hidden md:block">
                <span className="font-bold text-slate-800 block leading-tight truncate max-w-[130px]">
                  {currentRoleObj.name}
                </span>
                <span className="text-[10px] text-slate-500 font-medium block leading-tight">
                  {currentRoleObj.shortRole}
                </span>
              </div>

              <ChevronDown
                className={`w-3.5 h-3.5 text-slate-400 transition-transform duration-200 ${
                  roleMenuOpen ? 'rotate-180' : ''
                }`}
              />
            </button>

            {roleMenuOpen && (
              <div className="absolute right-0 mt-2 w-72 bg-white rounded-2xl shadow-xl border border-slate-200/90 py-2 z-50 animate-in fade-in zoom-in-95 duration-150">
                <div className="px-3.5 py-1.5 border-b border-slate-100 text-[10px] font-bold text-slate-400 uppercase tracking-wider flex items-center justify-between">
                  <span>Pilih Peran Pengguna</span>
                  <span className="text-emerald-600 font-semibold lowercase">fase simulasi</span>
                </div>

                <div className="p-1 space-y-0.5">
                  {roles.map((r) => {
                    const isSelected = currentRole === r.name;
                    return (
                      <button
                        key={r.name}
                        type="button"
                        onClick={() => {
                          onRoleChange(r.name);
                          setRoleMenuOpen(false);
                        }}
                        className={`w-full text-left px-3 py-2.5 rounded-xl text-xs flex items-center justify-between gap-2.5 transition ${
                          isSelected
                            ? 'bg-emerald-50/80 text-emerald-950 font-semibold'
                            : 'text-slate-700 hover:bg-slate-50'
                        }`}
                      >
                        <div className="flex items-center gap-2.5 min-w-0">
                          <div
                            className={`w-7 h-7 rounded-lg font-bold text-xs flex items-center justify-center flex-shrink-0 border ${
                              isSelected
                                ? 'bg-emerald-600 text-white border-emerald-700'
                                : 'bg-slate-100 text-slate-600 border-slate-200'
                            }`}
                          >
                            {r.initials}
                          </div>
                          <div className="min-w-0 truncate">
                            <span className="font-bold text-slate-900 block truncate">
                              {r.name}
                            </span>
                            <span className="text-slate-500 text-[11px] block truncate">
                              {r.role}
                            </span>
                          </div>
                        </div>

                        {isSelected && (
                          <Check className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}
          </div>

          {/* Mobile Menu Hamburger Button */}
          <button
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden p-2 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 transition"
            title="Menu Navigasi"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Navigation */}
      {mobileMenuOpen && (
        <>
          {/* Backdrop */}
          <div
            className="fixed inset-0 top-[65px] bg-slate-900/30 backdrop-blur-xs z-30 lg:hidden"
            onClick={() => setMobileMenuOpen(false)}
          />

          <div className="relative z-40 lg:hidden border-t border-slate-200 bg-white p-4 space-y-3 shadow-xl animate-in slide-in-from-top-2 duration-150">
            {/* Mobile AI status info */}
            <div className="flex items-center justify-between p-2.5 rounded-xl bg-slate-50 border border-slate-200/80 text-xs">
              <span className="text-slate-600 font-medium flex items-center gap-1.5">
                <Cpu className="w-4 h-4 text-slate-500" />
                Status ViT Model:
              </span>
              <span className="font-bold flex items-center gap-1.5 text-slate-800">
                <span
                  className={`w-2 h-2 rounded-full ${
                    modelStatus.loaded ? 'bg-emerald-500 animate-pulse' : 'bg-rose-500'
                  }`}
                />
                {modelStatus.loaded ? 'ViT-B/16 Ready' : 'AI Offline'}
              </span>
            </div>

            {/* Nav list */}
            <div className="space-y-1">
              {navItems.map((item) => {
                const Icon = item.icon;
                const active = item.isActive;
                return (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => handleNav(item.id)}
                    className={`w-full px-3.5 py-3 rounded-xl text-left text-sm font-bold flex items-center justify-between transition ${
                      active
                        ? 'bg-emerald-50 text-emerald-800 border border-emerald-200/70 shadow-2xs'
                        : 'text-slate-700 hover:bg-slate-50'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <Icon
                        className={`w-5 h-5 ${
                          active ? 'text-emerald-600' : 'text-slate-500'
                        }`}
                      />
                      <span>{item.label}</span>
                    </div>

                    <div className="flex items-center gap-2">
                      {item.badge && (
                        <span className="text-[10px] uppercase font-extrabold px-1.5 py-0.5 rounded bg-emerald-100 text-emerald-800 border border-emerald-200">
                          {item.badge}
                        </span>
                      )}
                      <ChevronRight
                        className={`w-4 h-4 ${
                          active ? 'text-emerald-600' : 'text-slate-400'
                        }`}
                      />
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Mobile Role Switcher */}
            <div className="pt-2 border-t border-slate-100">
              <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider px-1 mb-2">
                Peran Pengguna Saat Ini
              </div>
              <div className="grid grid-cols-1 gap-1.5">
                {roles.map((r) => {
                  const isSelected = currentRole === r.name;
                  return (
                    <button
                      key={r.name}
                      type="button"
                      onClick={() => {
                        onRoleChange(r.name);
                        setMobileMenuOpen(false);
                      }}
                      className={`w-full text-left p-2.5 rounded-xl text-xs flex items-center justify-between border transition ${
                        isSelected
                          ? 'bg-emerald-50/70 border-emerald-300 text-emerald-950 font-semibold'
                          : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
                      }`}
                    >
                      <div className="flex items-center gap-2.5">
                        <div
                          className={`w-6 h-6 rounded-md font-bold text-[11px] flex items-center justify-center ${
                            isSelected
                              ? 'bg-emerald-600 text-white'
                              : 'bg-slate-100 text-slate-600'
                          }`}
                        >
                          {r.initials}
                        </div>
                        <div>
                          <div className="font-bold text-slate-900">{r.name}</div>
                          <div className="text-slate-500 text-[10px]">{r.role}</div>
                        </div>
                      </div>
                      {isSelected && <Check className="w-4 h-4 text-emerald-600" />}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        </>
      )}
    </header>
  );
};
