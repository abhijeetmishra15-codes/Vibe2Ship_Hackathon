import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '@/store/useAuthStore';
import { useToastStore } from '@/store/useToastStore';
import { useTranslation } from '@/locales/LanguageContext';
import { Shield, Mail, Lock, User, ArrowRight, Sparkles, MapPin, Activity } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { signIn, signUp } from '@/services/auth';

export default function Auth() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const setUser = useAuthStore(state => state.setUser);
  const toast = useToastStore(state => state.toast);

  const [activeTab, setActiveTab] = useState("login"); // "login" | "signup"
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [verificationSent, setVerificationSent] = useState(false);

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    if (!email || !password) {
      setError("Please fill in all fields.");
      return;
    }
    setError("");
    setLoading(true);
    try {
      await signIn(email, password);
      navigate("/dashboard");
    } catch (err) {
      setError(err.message || "Invalid email or password.");
    } finally {
      setLoading(false);
    }
  };

  const handleSignupSubmit = async (e) => {
    e.preventDefault();
    if (!name || !email || !password) {
      setError("Please fill in all fields.");
      return;
    }
    setError("");
    setLoading(true);
    try {
      const data = await signUp(email, password, name);
      if (data?.session) {
        setUser(data.session.user);
        navigate("/dashboard");
      } else {
        setVerificationSent(true);
      }
    } catch (err) {
      setError(err.message || "Failed to register profile.");
    } finally {
      setLoading(false);
    }
  };


  return (
    <div className="min-h-screen grid grid-cols-1 lg:grid-cols-2 bg-[#faf9f6] dark:bg-[#030712] font-sans selection:bg-primary/30 relative">
      
      {/* Light Mode subtle noise overlay */}
      <div className="absolute inset-0 pointer-events-none opacity-[0.03] dark:opacity-[0.02] bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] mix-blend-multiply dark:mix-blend-screen z-0" />

      {/* Left Branding Side (Desktop) */}
      <div className="hidden lg:flex flex-col justify-between p-16 relative overflow-hidden bg-[#030712] text-white z-10 border-r border-white/5 shadow-2xl">
        
        {/* Animated Background Gradients & Blobs */}
        <div className="absolute inset-0 bg-gradient-to-br from-emerald-950/80 via-[#030712] to-teal-950/80 -z-10" />
        <div className="absolute -top-[20%] -left-[10%] w-[600px] h-[600px] bg-emerald-500/10 rounded-full blur-[120px] animate-pulse pointer-events-none" style={{ animationDuration: '8s' }} />
        <div className="absolute top-[40%] -right-[20%] w-[500px] h-[500px] bg-teal-400/10 rounded-full blur-[100px] animate-pulse pointer-events-none" style={{ animationDuration: '10s', animationDelay: '2s' }} />
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px] opacity-20" />

        {/* Top Header */}
        <div className="flex items-center space-x-3 relative z-10 animate-fade-in-up">
          <div className="bg-white/5 p-3 rounded-2xl border border-white/10 shadow-[0_0_20px_rgba(20,184,166,0.15)] backdrop-blur-md">
            <Shield className="h-6 w-6 text-emerald-400" />
          </div>
          <span className="font-display font-black text-2xl tracking-tight text-white">{t('logo')}</span>
        </div>

        {/* Hero message & Abstract Illustration */}
        <div className="my-auto space-y-10 relative z-10 max-w-lg">
          
          <div className="space-y-6 animate-fade-in-up" style={{ animationDelay: '100ms' }}>
            <div className="inline-flex items-center space-x-2 bg-emerald-500/10 border border-emerald-500/20 px-4 py-2 rounded-full text-emerald-300 font-bold text-[10px] uppercase tracking-widest backdrop-blur-md">
              <Activity className="h-3 w-3 animate-pulse" />
              <span>Civic Operations Network</span>
            </div>
            
            <h2 className="font-display font-black text-5xl lg:text-6xl leading-[1.1] tracking-tighter text-white">
              Securing <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-teal-300">
                City Intelligence.
              </span>
            </h2>
            <p className="text-slate-400 text-base leading-relaxed font-medium max-w-md">
              Transform infrastructure data into real-time operational intelligence. Join the high-trust civic network powered by AI deduplication and local verifiers.
            </p>
          </div>

          {/* Abstract Data Viz Card */}
          <div className="p-6 rounded-[2rem] bg-white/5 border border-white/10 backdrop-blur-xl relative overflow-hidden animate-fade-in-up group hover:border-emerald-500/30 transition-colors" style={{ animationDelay: '200ms' }}>
             <div className="absolute top-0 left-0 w-1 h-full bg-emerald-500/80 group-hover:bg-emerald-400 transition-colors" />
             <div className="flex justify-between items-start mb-4">
               <div>
                 <p className="text-[10px] text-slate-400 uppercase tracking-widest font-bold">Encrypted Stream</p>
                 <p className="text-white font-bold mt-1 text-sm flex items-center"><MapPin className="w-3.5 h-3.5 mr-1.5 text-emerald-400" /> Node Connection Established</p>
               </div>
               <div className="h-8 w-8 rounded-full bg-emerald-500/20 flex items-center justify-center">
                 <Sparkles className="w-4 h-4 text-emerald-400" />
               </div>
             </div>
             <div className="h-1.5 w-full bg-black/40 rounded-full overflow-hidden mt-6">
               <div className="h-full bg-gradient-to-r from-teal-500 to-emerald-400 w-[78%] rounded-full relative">
                 <div className="absolute right-0 top-0 h-full w-4 bg-white/50 blur-[2px]" />
               </div>
             </div>
          </div>
        </div>

        {/* Footer line */}
        <div className="text-[10px] text-slate-500 font-mono uppercase tracking-widest relative z-10 animate-fade-in-up" style={{ animationDelay: '300ms' }}>
          Protocol v2.0.4 • Hackathon Build Edition
        </div>
      </div>

      {/* Right Form Side */}
      <div className="flex flex-col justify-center px-6 sm:px-12 lg:px-24 py-12 relative z-10">
        
        {/* Subtle glow behind form in dark mode */}
        <div className="hidden dark:block absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-primary/5 rounded-full blur-[100px] -z-10" />

        <div className="max-w-md w-full mx-auto space-y-10 animate-fade-in-up">
          
          {/* Logo (Mobile Only) */}
          <div className="flex lg:hidden items-center space-x-3 mb-8">
            <div className="bg-primary p-2.5 rounded-xl text-white shadow-lg">
              <Shield className="h-5 w-5" />
            </div>
            <span className="font-display font-black text-2xl text-slate-900 dark:text-white">{t('logo')}</span>
          </div>

          <div className="bg-white/60 dark:bg-[#0a0f1c]/60 backdrop-blur-2xl p-8 sm:p-10 rounded-[2rem] border border-white/50 dark:border-white/10 shadow-[0_8px_30px_rgb(0,0,0,0.04)] dark:shadow-[0_8px_30px_rgba(0,0,0,0.3)]">
            
            {/* Heading */}
            {!verificationSent && (
              <div className="space-y-3 mb-8 text-center">
                <h3 className="font-display font-black text-3xl text-slate-900 dark:text-white">
                  {activeTab === 'login' && 'Welcome Back'}
                  {activeTab === 'signup' && 'Create Profile'}
                </h3>
                <p className="text-sm font-medium text-slate-500 dark:text-slate-400">
                  {activeTab === 'login' && 'Enter your credentials to access the network'}
                  {activeTab === 'signup' && 'Join the network of verified civic operators'}
                </p>
              </div>
            )}

            {/* Error Message */}
            {error && (
              <div className="bg-rose-500/10 border border-rose-500/20 text-rose-600 dark:text-rose-400 text-xs font-bold p-4 rounded-xl mb-6 flex items-center animate-fade-in">
                <div className="w-1.5 h-1.5 rounded-full bg-rose-500 mr-2 shrink-0 animate-pulse" />
                {error}
              </div>
            )}

            {/* TAB FORMS */}
            {activeTab === 'login' && (
              <form onSubmit={handleLoginSubmit} className="space-y-5">
                <Input
                  label="Email Address"
                  type="email"
                  icon={Mail}
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@domain.com"
                  required
                />

                <div className="space-y-2">
                  <Input
                    label="Password"
                    type="password"
                    icon={Lock}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    required
                  />
                </div>

                <Button
                  type="submit"
                  variant="primary"
                  loading={loading}
                  className="w-full mt-8 py-6"
                >
                  <span className="text-sm tracking-wide">Authenticate</span>
                  <ArrowRight className="h-4 w-4 ml-1" />
                </Button>

                <div className="text-center mt-6">
                  <span className="text-xs font-medium text-slate-500 dark:text-slate-400">New to the network? </span>
                  <button 
                    type="button" 
                    onClick={() => {
                      setActiveTab('signup');
                      setVerificationSent(false);
                    }}
                    className="text-xs text-primary font-bold hover:text-emerald-500 hover:underline transition-colors focus:outline-none"
                  >
                    Request Access
                  </button>
                </div>
              </form>
            )}

            {activeTab === 'signup' && (
              verificationSent ? (
                <div className="text-center space-y-6 py-8 animate-fade-in">
                  <div className="mx-auto w-16 h-16 bg-emerald-500/10 border border-emerald-500/20 rounded-full flex items-center justify-center mb-4">
                    <Mail className="h-8 w-8 text-emerald-400" />
                  </div>
                  <h4 className="font-display font-black text-2xl text-slate-900 dark:text-white">Check your email</h4>
                  <p className="text-slate-500 dark:text-slate-400 text-sm max-w-sm mx-auto">
                    We've sent a confirmation link to <span className="font-bold text-slate-700 dark:text-slate-300">{email}</span>. 
                    Please click the link to verify your account and complete the registration.
                  </p>
                  <Button
                    type="button"
                    onClick={() => {
                      setVerificationSent(false);
                      setActiveTab('login');
                    }}
                    variant="ghost"
                    className="mt-6 w-full py-6 text-slate-600 dark:text-slate-300"
                  >
                    Back to login
                  </Button>
                </div>
              ) : (
              <form onSubmit={handleSignupSubmit} className="space-y-5">
                <Input
                  label="Full Name"
                  type="text"
                  icon={User}
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Aarav Sharma"
                  required
                />

                <Input
                  label="Email Address"
                  type="email"
                  icon={Mail}
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@domain.com"
                  required
                />

                <Input
                  label="Secure Password"
                  type="password"
                  icon={Lock}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                />

                <Button
                  type="submit"
                  variant="primary"
                  loading={loading}
                  className="w-full mt-8 py-6"
                >
                  <span className="text-sm tracking-wide">Initialize Account</span>
                  <ArrowRight className="h-4 w-4 ml-1" />
                </Button>

                <div className="text-center mt-6">
                  <span className="text-xs font-medium text-slate-500 dark:text-slate-400">Already authorized? </span>
                  <button 
                    type="button" 
                    onClick={() => setActiveTab('login')}
                    className="text-xs text-primary font-bold hover:text-emerald-500 hover:underline transition-colors focus:outline-none"
                  >
                    Sign In
                  </button>
                </div>
              </form>
              )
            )}

          </div>
        </div>
      </div>
    </div>
  );
}
