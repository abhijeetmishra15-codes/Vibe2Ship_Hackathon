import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '@/store/useAuthStore';
import { useToastStore } from '@/store/useToastStore';
import { useTranslation } from '@/locales/LanguageContext';
import { Shield, Mail, Lock, User, ArrowRight, Apple, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { signIn, signUp } from '@/services/auth';


export default function Auth() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const setRole = useAuthStore(state => state.setRole);
  const setUser = useAuthStore(state => state.setUser);
  const toast = useToastStore(state => state.toast);

  const [activeTab, setActiveTab] = useState("login"); // "login" | "signup"
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

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
        setActiveTab("login");
        toast({
          title: "Account Created",
          description: "Account created successfully. Please sign in.",
          type: "success"
        });
      }
    } catch (err) {
      setError(err.message || "Failed to register profile.");
    } finally {
      setLoading(false);
    }
  };

  const handleSocialLogin = () => {
    // Simulate social login redirect
    setRole("citizen");
    navigate("/dashboard");
  };

  return (
    <div className="min-h-screen grid grid-cols-1 lg:grid-cols-2 bg-background font-sans">
      {/* Left Branding Side (Desktop) */}
      <div className="hidden lg:flex flex-col justify-between p-12 bg-gradient-to-tr from-primary via-teal-600 to-emerald-600 text-white relative overflow-hidden">
        {/* Background visual shapes */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom_left,_var(--tw-gradient-stops))] from-white/10 via-transparent to-transparent pointer-events-none" />
        <div className="absolute -top-40 -right-40 w-96 h-96 rounded-full bg-white/5 blur-3xl" />

        {/* Top Header */}
        <div className="flex items-center space-x-2 relative z-10">
          <div className="bg-white/10 p-2.5 rounded-xl border border-white/20">
            <Shield className="h-6 w-6 text-white" />
          </div>
          <span className="font-display font-extrabold text-xl tracking-tight">{t('logo')}</span>
        </div>

        {/* Hero message */}
        <div className="my-auto space-y-6 relative z-10 max-w-md">
          <h2 className="font-display font-black text-4xl lg:text-5xl leading-tight">
            Be the change <br />
            your city needs.
          </h2>
          <p className="text-emerald-100 text-sm leading-relaxed">
            "Community Hero connects local voices with city departments, turning issues into resolutions. Track repairs in real-time, gain status points, and restore safety to your community."
          </p>
          <div className="flex items-center space-x-2 bg-white/10 border border-white/20 p-3 rounded-2xl w-fit">
            <Sparkles className="h-4 w-4 text-emerald-300 animate-pulse" />
            <span className="text-xxs font-bold uppercase tracking-wider">AI duplicate detector and severity analysis</span>
          </div>
        </div>

        {/* Footer line */}
        <div className="text-xxs text-emerald-200/70 relative z-10">
          © 2026 {t('logo')}. Hackathon Demo Client.
        </div>
      </div>

      {/* Right Form Side */}
      <div className="flex flex-col justify-center px-6 sm:px-12 lg:px-20 py-12 relative">
        <div className="max-w-md w-full mx-auto space-y-8 animate-fade-in-up">
          {/* Logo (Mobile Only) */}
          <div className="flex lg:hidden items-center space-x-2 mb-6">
            <div className="bg-primary p-2 rounded-lg text-white">
              <Shield className="h-5 w-5" />
            </div>
            <span className="font-display font-bold text-lg text-foreground">{t('logo')}</span>
          </div>

          {/* Heading */}
          <div className="space-y-2">
            <h3 className="font-display font-extrabold text-2xl text-foreground">
              {activeTab === 'login' && 'Sign in to Account'}
              {activeTab === 'signup' && 'Create Citizen Profile'}
            </h3>
            <p className="text-xs text-muted-foreground">
              {activeTab === 'login' && 'Enter details to access your dashboard'}
              {activeTab === 'signup' && 'Get started reporting community issues today'}
            </p>
          </div>

          {/* Error Message */}
          {error && (
            <div className="bg-destructive/10 border border-destructive/20 text-destructive text-xs p-3 rounded-xl">
              {error}
            </div>
          )}

          {/* TAB FORMS */}
          {activeTab === 'login' && (
            <form onSubmit={handleLoginSubmit} className="space-y-4">
              <Input
                label="Email Address"
                type="email"
                icon={Mail}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@domain.com"
                required
              />

              <div className="space-y-1.5">
                <div className="flex justify-between items-center">
                  <span className="text-xs font-bold text-muted-foreground uppercase">Password</span>
                </div>
                <Input
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
                className="w-full mt-6 space-x-2"
              >
                <span>Sign In</span>
                <ArrowRight className="h-4 w-4" />
              </Button>

              <div className="text-center mt-4">
                <span className="text-xs text-muted-foreground">New to Community Hero? </span>
                <Button 
                  type="button" 
                  variant="ghost"
                  onClick={() => setActiveTab('signup')}
                  className="text-xs text-primary font-bold hover:underline p-0 bg-transparent hover:bg-transparent h-auto inline-flex"
                >
                  Create Account
                </Button>
              </div>
            </form>
          )}

          {activeTab === 'signup' && (
            <form onSubmit={handleSignupSubmit} className="space-y-4">
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
                label="Password"
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
                className="w-full mt-6 space-x-2"
              >
                <span>Register Account</span>
                <ArrowRight className="h-4 w-4" />
              </Button>

              <div className="text-center mt-4">
                <span className="text-xs text-muted-foreground">Already have an account? </span>
                <Button 
                  type="button" 
                  variant="ghost"
                  onClick={() => setActiveTab('login')}
                  className="text-xs text-primary font-bold hover:underline p-0 bg-transparent hover:bg-transparent h-auto inline-flex"
                >
                  Sign In
                </Button>
              </div>
            </form>
          )}



          {/* Social login divider (Only on login/signup tabs) */}
          {(activeTab === 'login' || activeTab === 'signup') && (
            <div className="space-y-4 pt-4 border-t border-border/50">
              <div className="relative flex justify-center text-xxs font-bold text-muted-foreground uppercase">
                <span className="bg-background px-3 relative z-10">Or continue with</span>
                <div className="absolute left-0 top-1/2 w-full border-t border-border/60 z-0" />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <Button
                  variant="secondary"
                  onClick={() => handleSocialLogin()}
                  className="w-full space-x-2"
                >
                  <svg className="h-4 w-4" viewBox="0 0 24 24">
                    <path
                      fill="#EA4335"
                      d="M12.24 10.285V14.4h6.887c-.648 2.41-2.519 4.114-5.187 4.114-3.465 0-6.275-2.81-6.275-6.275s2.81-6.275 6.275-6.275c1.54 0 2.946.56 4.032 1.484l3.054-3.055C18.995 1.554 15.79 0 12.24 0 5.48 0 0 5.48 0 12.24s5.48 12.24 12.24 12.24c6.76 0 12.24-5.48 12.24-12.24 0-.825-.075-1.62-.21-2.395H12.24z"
                    />
                  </svg>
                  <span>Google</span>
                </Button>
                <Button
                  variant="secondary"
                  onClick={() => handleSocialLogin()}
                  className="w-full space-x-2"
                >
                  <Apple className="h-4 w-4" />
                  <span>Apple</span>
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
