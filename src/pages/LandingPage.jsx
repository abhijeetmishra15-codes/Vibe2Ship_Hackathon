
import { Link } from 'react-router-dom';
import { 
  Shield, CheckCircle, BarChart3, Users, 
  ArrowRight, Star, AlertTriangle, 
  Cpu, Award 
} from 'lucide-react';
import { useTranslation } from '@/locales/LanguageContext';
import { Button } from '@/components/ui/Button';
import { Card, CardContent } from '@/components/ui/Card';

export default function LandingPage() {
  const { t } = useTranslation();

  return (
    <div className="bg-background min-h-screen flex flex-col font-sans">
      {/* Header */}
      <header className="glass-nav sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <div className="bg-gradient-to-tr from-primary to-emerald-400 p-2 rounded-lg flex items-center justify-center text-white shadow-premium">
              <Shield className="h-6 w-6" />
            </div>
            <span className="font-display font-extrabold text-xl tracking-tight bg-gradient-to-r from-primary to-emerald-500 bg-clip-text text-transparent">
              {t('logo')}
            </span>
          </div>
          <div className="flex items-center space-x-4">
            <Link to="/auth" className="text-sm font-semibold text-muted-foreground hover:text-foreground">
              Log In
            </Link>
            <Link to="/auth">
              <Button variant="primary" size="sm">
                Get Started
              </Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative py-20 lg:py-32 overflow-hidden flex-1 flex items-center">
        {/* Background glow effects */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-primary/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute top-1/3 left-1/4 w-[300px] h-[300px] bg-emerald-400/10 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-6 text-center lg:text-left">
            <div className="inline-flex items-center space-x-2 bg-primary/10 border border-primary/20 px-3.5 py-1.5 rounded-full text-primary font-bold text-xs">
              <Cpu className="h-4 w-4 text-primary animate-pulse" />
              <span>AI-Powered Hyperlocal Civic Tech</span>
            </div>
            <h1 className="font-display font-extrabold text-4xl sm:text-5xl lg:text-6xl tracking-tight text-foreground leading-[1.1]">
              Empower Your <br />
              <span className="bg-gradient-to-r from-primary via-teal-500 to-emerald-500 bg-clip-text text-transparent">
                Neighborhood.
              </span><br />
              Resolve Issues.
            </h1>
            <p className="text-muted-foreground text-sm sm:text-base max-w-lg mx-auto lg:mx-0 leading-relaxed">
              Join the smart community network. Snap photos of potholes, garbage bins, or broken streetlights. Let AI categorize and assess severity, and watch local verifiers and authorities resolve them.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-3 sm:space-y-0">
              <Link to="/auth" className="w-full sm:w-auto">
                <Button variant="primary" className="w-full bg-gradient-to-r from-primary to-emerald-500 hover:brightness-105 px-8 py-3.5 space-x-2 h-auto">
                  <span>Report an Issue</span>
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
              <Link to="/map" className="w-full sm:w-auto">
                <Button variant="secondary" className="w-full px-8 py-3.5 h-auto">
                  <span>Explore Interactive Map</span>
                </Button>
              </Link>
            </div>
          </div>

          {/* Interactive UI Mockup */}
          <div className="relative mx-auto max-w-md lg:max-w-none w-full animate-fade-in-up">
            <Card variant="glass" className="p-6 shadow-2xl relative overflow-hidden bg-card/70 border border-border/80 rounded-2xl">
              <div className="flex justify-between items-center pb-4 border-b border-border">
                <div className="flex items-center space-x-2">
                  <span className="w-3 h-3 bg-rose-500 rounded-full" />
                  <span className="w-3 h-3 bg-amber-500 rounded-full" />
                  <span className="w-3 h-3 bg-emerald-500 rounded-full" />
                </div>
                <span className="text-[10px] font-bold text-muted-foreground/60 tracking-widest uppercase">LIVE DASHBOARD</span>
              </div>
              <div className="mt-4 space-y-4">
                {/* Active issue tracker mockup */}
                <div className="bg-primary/5 rounded-xl p-4 border border-primary/20 flex items-start space-x-3">
                  <AlertTriangle className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                  <div>
                    <h4 className="font-bold text-xs text-foreground">Broken Streetlight reported</h4>
                    <p className="text-[10px] text-muted-foreground mt-0.5">Sector 15 Park, Noida</p>
                    <div className="flex items-center space-x-2 mt-2">
                      <span className="bg-primary/10 text-primary text-[9px] font-semibold px-2 py-0.5 rounded">AI Categorized</span>
                      <span className="bg-rose-500/10 text-rose-500 text-[9px] font-semibold px-2 py-0.5 rounded">High Severity</span>
                    </div>
                  </div>
                </div>
                {/* Resolution notification mock */}
                <div className="bg-emerald-500/5 rounded-xl p-4 border border-emerald-500/15 flex items-start space-x-3">
                  <CheckCircle className="h-5 w-5 text-emerald-500 shrink-0 mt-0.5" />
                  <div>
                    <h4 className="font-bold text-xs text-foreground">Water Leak Resolved!</h4>
                    <p className="text-[10px] text-muted-foreground mt-0.5">Fixed within 4 hours by Noida Jal Board.</p>
                  </div>
                </div>
              </div>
            </Card>
            {/* Overlay XP Badge */}
            <div className="absolute -bottom-6 -left-6 bg-background rounded-2xl p-4 shadow-xl border border-border max-w-[160px] hidden sm:block">
              <div className="flex items-center space-x-2">
                <Award className="h-8 w-8 text-amber-500" />
                <div>
                  <p className="text-[9px] text-muted-foreground">TOP CITIZEN XP</p>
                  <p className="font-extrabold text-sm text-foreground">+240 XP</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Impact Stats */}
      <section className="bg-secondary/40 border-y border-border py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
          <div>
            <p className="text-3xl sm:text-4xl font-extrabold text-primary font-display">1,420+</p>
            <p className="text-xs text-muted-foreground mt-1 font-medium">Issues Resolved</p>
          </div>
          <div>
            <p className="text-3xl sm:text-4xl font-extrabold text-primary font-display">98.4%</p>
            <p className="text-xs text-muted-foreground mt-1 font-medium">Verification Accuracy</p>
          </div>
          <div>
            <p className="text-3xl sm:text-4xl font-extrabold text-primary font-display">12.5 hrs</p>
            <p className="text-xs text-muted-foreground mt-1 font-medium">Avg Resolution Time</p>
          </div>
          <div>
            <p className="text-3xl sm:text-4xl font-extrabold text-primary font-display">4.8k+</p>
            <p className="text-xs text-muted-foreground mt-1 font-medium">Active Citizens</p>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center space-y-4 max-w-xl mx-auto mb-16">
          <h2 className="font-display font-extrabold text-3xl text-foreground">How Community Hero Works</h2>
          <p className="text-sm text-muted-foreground">Empowering citizens, verifiers, and civic departments with tools to report, analyze, verify, and resolve issues collaboratively.</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <Card variant="glass" className="p-8 text-center hover:scale-[1.02] transition-transform duration-300">
            <CardContent className="p-0 flex flex-col items-center">
              <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center text-primary mx-auto mb-6 shrink-0">
                <Cpu className="h-6 w-6" />
              </div>
              <h3 className="font-display font-bold text-lg text-foreground mb-3">AI Detection</h3>
              <p className="text-xs text-muted-foreground leading-relaxed">
                Upload photos/videos. Our on-device AI model automatically estimates severity, predicts categories, matches duplicate nearby reports, and generates descriptions.
              </p>
            </CardContent>
          </Card>
          <Card variant="glass" className="p-8 text-center hover:scale-[1.02] transition-transform duration-300">
            <CardContent className="p-0 flex flex-col items-center">
              <div className="w-12 h-12 bg-emerald-500/10 rounded-xl flex items-center justify-center text-emerald-500 mx-auto mb-6 shrink-0">
                <Users className="h-6 w-6" />
              </div>
              <h3 className="font-display font-bold text-lg text-foreground mb-3">Community Verification</h3>
              <p className="text-xs text-muted-foreground leading-relaxed">
                Reports are vetted on-site by trusted verifiers and local citizens to prevent spam and duplicates, ensuring municipal action is focused on legitimate requests.
              </p>
            </CardContent>
          </Card>
          <Card variant="glass" className="p-8 text-center hover:scale-[1.02] transition-transform duration-300">
            <CardContent className="p-0 flex flex-col items-center">
              <div className="w-12 h-12 bg-amber-500/10 rounded-xl flex items-center justify-center text-amber-500 mx-auto mb-6 shrink-0">
                <BarChart3 className="h-6 w-6" />
              </div>
              <h3 className="font-display font-bold text-lg text-foreground mb-3">Municipal Integration</h3>
              <p className="text-xs text-muted-foreground leading-relaxed">
                Admins track city metrics, assign task priorities, dispatch crews, and submit photo evidence of successful repairs back to the citizen feed.
              </p>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Testimonials */}
      <section className="bg-secondary/20 py-20 border-t border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-xl mx-auto mb-16">
            <h2 className="font-display font-extrabold text-3xl text-foreground">What Citizens Say</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card className="p-6 space-y-4">
              <CardContent className="p-0 flex flex-col gap-4">
                <div className="flex text-amber-500">
                  <Star className="h-4 w-4 fill-current" /><Star className="h-4 w-4 fill-current" /><Star className="h-4 w-4 fill-current" /><Star className="h-4 w-4 fill-current" /><Star className="h-4 w-4 fill-current" />
                </div>
                <p className="text-xs text-muted-foreground italic leading-relaxed">"Reported an overflowing garbage dump in front of our housing society. The community verified it, and municipal sanitation trucks cleared it within 24 hours!"</p>
                <div className="flex items-center space-x-2 pt-2 border-t border-border/50">
                  <div className="w-8 h-8 rounded-full bg-slate-300 shrink-0" />
                  <div>
                    <h4 className="font-bold text-xs">Ananya Sen</h4>
                    <span className="text-[10px] text-muted-foreground">Citizen, Noida</span>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card className="p-6 space-y-4">
              <CardContent className="p-0 flex flex-col gap-4">
                <div className="flex text-amber-500">
                  <Star className="h-4 w-4 fill-current" /><Star className="h-4 w-4 fill-current" /><Star className="h-4 w-4 fill-current" /><Star className="h-4 w-4 fill-current" /><Star className="h-4 w-4 fill-current" />
                </div>
                <p className="text-xs text-muted-foreground italic leading-relaxed">"As a certified verifier, I review reports during my evening walks. It feels great to be part of the solution and help filter out duplicates using the AI matching engine."</p>
                <div className="flex items-center space-x-2 pt-2 border-t border-border/50">
                  <div className="w-8 h-8 rounded-full bg-slate-300 shrink-0" />
                  <div>
                    <h4 className="font-bold text-xs">Vikram Singh</h4>
                    <span className="text-[10px] text-muted-foreground">Verifier, Noida</span>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card className="p-6 space-y-4">
              <CardContent className="p-0 flex flex-col gap-4">
                <div className="flex text-amber-500">
                  <Star className="h-4 w-4 fill-current" /><Star className="h-4 w-4 fill-current" /><Star className="h-4 w-4 fill-current" /><Star className="h-4 w-4 fill-current" /><Star className="h-4 w-4 fill-current" />
                </div>
                <p className="text-xs text-muted-foreground italic leading-relaxed">"Having a localized dashboard allows us to plan repair runs much more efficiently. We saved hours by batching street light fixes in Sector 30."</p>
                <div className="flex items-center space-x-2 pt-2 border-t border-border/50">
                  <div className="w-8 h-8 rounded-full bg-slate-300 shrink-0" />
                  <div>
                    <h4 className="font-bold text-xs">M. K. Mishra</h4>
                    <span className="text-[10px] text-muted-foreground">Municipal Admin, Sector 12</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="bg-gradient-to-tr from-primary to-emerald-600 py-16 text-center text-white relative overflow-hidden border-t border-border">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-white/10 via-transparent to-transparent pointer-events-none" />
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 space-y-6">
          <h2 className="font-display font-extrabold text-3xl sm:text-4xl">Ready to become a Community Hero?</h2>
          <p className="text-sm text-emerald-100 max-w-xl mx-auto">Help clean our streets, repair our light fixtures, and keep our clean drinking water from leaking. Sign up today and start earning community status points.</p>
          <Link to="/auth">
            <Button className="inline-flex items-center !bg-white !text-primary hover:!bg-slate-100 px-8 py-3.5 space-x-2 shadow-lg transition-all h-auto">
              <span>Create Free Account</span>
              <ArrowRight className="h-4 w-4" />
            </Button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-card border-t border-border py-12 text-center text-muted-foreground text-xs mt-auto">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-4">
          <div className="flex justify-center items-center space-x-2 text-foreground font-bold">
            <Shield className="h-5 w-5 text-primary" />
            <span>{t('logo')}</span>
          </div>
          <p>Hyperlocal Problem Solver Platform for Hackathon Demonstrations.</p>
          <div className="flex justify-center space-x-6">
            <a href="#" className="hover:underline">Privacy Policy</a>
            <a href="#" className="hover:underline">Terms of Service</a>
            <a href="#" className="hover:underline">Contact Support</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
