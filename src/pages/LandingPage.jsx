import { Link } from 'react-router-dom';
import { 
  Shield, CheckCircle, BarChart3, Users, 
  ArrowRight, Star, AlertTriangle, 
  Cpu, Award, Activity, Lock, MapPin, Zap
} from 'lucide-react';
import { useTranslation } from '@/locales/LanguageContext';
import { Button } from '@/components/ui/Button';
import { Card, CardContent } from '@/components/ui/Card';

export default function LandingPage() {
  const { t } = useTranslation();

  return (
    <div className="bg-[#030712] min-h-screen flex flex-col font-sans overflow-x-hidden selection:bg-primary/30 text-slate-50">
      
      {/* Background Ambient Grid & Glows */}
      <div className="fixed inset-0 z-0 pointer-events-none bg-gradient-to-b from-[#0a1128] to-[#030712]">
        {/* Soft Noise Texture Overlay */}
        <div className="absolute inset-0 opacity-[0.03] mix-blend-overlay bg-[url('https://grainy-gradients.vercel.app/noise.svg')]"></div>
        {/* Tech Grid Overlay */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#14b8a610_1px,transparent_1px),linear-gradient(to_bottom,#14b8a610_1px,transparent_1px)] bg-[size:3rem_3rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)]"></div>
        
        {/* Slow moving glow orbs */}
        <div className="absolute top-[20%] left-[20%] w-[500px] h-[500px] bg-teal-500/20 rounded-full blur-[120px] mix-blend-screen animate-pulse duration-[10000ms]"></div>
        <div className="absolute top-[40%] right-[15%] w-[400px] h-[400px] bg-cyan-500/10 rounded-full blur-[100px] mix-blend-screen animate-pulse duration-[12000ms] delay-1000"></div>
        <div className="absolute bottom-[-10%] left-[50%] -translate-x-1/2 w-[600px] h-[300px] bg-primary/20 rounded-full blur-[100px]"></div>

        {/* Floating background dashboard cards (blurred) */}
        <div className="absolute top-[15%] left-[5%] transform -rotate-12 scale-75 opacity-30 blur-[2px] pointer-events-none animate-pulse duration-[7000ms]">
          <div className="w-64 h-32 bg-[#030712]/80 border border-teal-500/20 rounded-xl p-4 flex flex-col gap-2">
             <div className="h-2 w-1/3 bg-teal-500/40 rounded"></div>
             <div className="h-2 w-full bg-white/10 rounded mt-2"></div>
             <div className="h-2 w-2/3 bg-white/10 rounded"></div>
          </div>
        </div>
        <div className="absolute top-[50%] right-[2%] transform rotate-6 scale-90 opacity-20 blur-[3px] pointer-events-none animate-pulse duration-[10000ms] delay-500">
          <div className="w-80 h-48 bg-[#030712]/80 border border-cyan-500/20 rounded-xl p-4 flex flex-col gap-3">
             <div className="flex gap-2 mb-2">
               <div className="h-8 w-8 bg-cyan-500/20 rounded-full"></div>
               <div className="h-2 w-1/2 bg-cyan-500/40 rounded mt-2"></div>
             </div>
             <div className="h-2 w-full bg-white/10 rounded"></div>
             <div className="h-2 w-5/6 bg-white/10 rounded"></div>
             <div className="h-2 w-full bg-white/10 rounded"></div>
          </div>
        </div>
      </div>

      {/* Header */}
      <header className="fixed top-0 w-full z-50 bg-[#030712]/50 backdrop-blur-xl border-b border-white/5 transition-all">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex justify-between items-center">
          <div className="flex items-center space-x-3">
            <div className="bg-primary/10 border border-primary/20 p-2 rounded-xl flex items-center justify-center text-primary shadow-[0_0_15px_rgba(20,184,166,0.3)]">
              <Shield className="h-5 w-5" />
            </div>
            <span className="font-display font-black text-xl tracking-tight text-white">
              {t('logo')}
            </span>
          </div>
          <div className="flex items-center space-x-6">
            <Link to="/auth" className="text-xs font-bold text-slate-300 hover:text-white transition-colors">
              Operator Login
            </Link>
            <Link to="/auth">
              <Button className="bg-primary hover:bg-primary/90 text-primary-foreground text-xs font-bold px-5 h-9 rounded-lg shadow-[0_0_20px_rgba(20,184,166,0.3)] hover:shadow-[0_0_25px_rgba(20,184,166,0.5)] border-none transition-all">
                Initialize System
              </Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative pt-32 pb-20 lg:pt-48 lg:pb-32 overflow-hidden z-10 flex flex-col items-center">
        {/* Ambient Glow Behind Hero */}
        <div className="absolute inset-0 z-0 flex items-center justify-center pointer-events-none">
          <div className="w-full max-w-4xl h-[70%] bg-primary/10 blur-[150px] rounded-full animate-pulse duration-[8000ms]"></div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 flex flex-col items-center text-center">
          
          <div className="inline-flex items-center space-x-2 bg-black/40 border border-teal-500/30 px-5 py-2 rounded-full text-teal-100 font-mono text-xs mb-8 animate-fade-in-up backdrop-blur-xl shadow-[0_0_15px_rgba(20,184,166,0.2)]" style={{ animationFillMode: 'both' }}>
            <Activity className="h-4 w-4 text-teal-400 animate-pulse" />
            <span className="uppercase tracking-[0.3em] font-bold">Civic Intelligence Engine v2.0</span>
          </div>
          
          {/* Glassmorphism Hero Content Container */}
          <div className="relative p-8 sm:p-12 md:p-16 rounded-[3rem] border border-white/10 bg-white/[0.02] shadow-[0_0_60px_rgba(0,0,0,0.6)] backdrop-blur-lg overflow-hidden w-full max-w-5xl">
            {/* Floating Particles Micro-Animation */}
            <div className="absolute inset-0 pointer-events-none overflow-hidden opacity-40">
              <div className="absolute w-2 h-2 bg-teal-400 rounded-full blur-[2px] top-[20%] left-[15%] animate-[bounce_6s_infinite]" />
              <div className="absolute w-3 h-3 bg-cyan-400 rounded-full blur-[3px] top-[60%] right-[20%] animate-[bounce_8s_infinite]" />
              <div className="absolute w-1 h-1 bg-emerald-400 rounded-full blur-[1px] bottom-[15%] left-[30%] animate-[bounce_5s_infinite]" />
              <div className="absolute w-4 h-4 bg-primary/20 rounded-full blur-[4px] top-[30%] right-[10%] animate-[bounce_10s_infinite]" />
            </div>

            <h1 className="relative font-display font-black text-5xl sm:text-6xl lg:text-[5.5rem] tracking-tighter text-white leading-[1.05] animate-fade-in-up [text-wrap:balance]" style={{ animationDelay: '100ms', animationFillMode: 'both' }}>
              Report. Track. <br className="hidden sm:block" />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-teal-400 via-cyan-300 to-emerald-400 drop-shadow-[0_0_40px_rgba(20,184,166,0.5)]">
                Resolve Civic Issues in Real Time.
              </span>
            </h1>
            
            <p className="relative mt-8 text-slate-300 text-lg sm:text-xl lg:text-2xl max-w-2xl mx-auto leading-relaxed font-light tracking-wide animate-fade-in-up" style={{ animationDelay: '200ms', animationFillMode: 'both' }}>
              A smart civic intelligence platform for transparent issue reporting and resolution.
            </p>
            
            <div className="relative mt-12 flex flex-col sm:flex-row items-center justify-center gap-6 animate-fade-in-up w-full" style={{ animationDelay: '300ms', animationFillMode: 'both' }}>
              <Link to="/auth" className="w-full sm:w-auto group">
                <Button className="w-full sm:w-auto bg-primary hover:bg-teal-400 text-slate-950 font-black px-10 py-7 rounded-2xl text-base space-x-2 shadow-[0_0_40px_rgba(20,184,166,0.4)] hover:shadow-[0_0_80px_rgba(20,184,166,0.8)] hover:-translate-y-1 hover:scale-105 transition-all duration-300 border-none">
                  <span>Deploy System</span>
                  <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
                </Button>
              </Link>
              <Link to="/map" className="w-full sm:w-auto">
                <Button variant="outline" className="w-full sm:w-auto px-10 py-7 text-base font-bold rounded-2xl bg-white/5 border-white/10 text-white hover:bg-primary/10 hover:border-primary/50 hover:text-teal-400 hover:shadow-[0_0_40px_rgba(20,184,166,0.3)] hover:-translate-y-1 hover:scale-[1.02] transition-all duration-300 backdrop-blur-md">
                  <MapPin className="h-4.5 w-4.5 mr-2 transition-transform duration-300" />
                  <span>View Live Intel Map</span>
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Visual Demo Section (The "Palantir" Dashboard Mock) */}
      <section className="relative z-20 pb-24 -mt-10 lg:-mt-16 animate-fade-in-up mx-4" style={{ animationDelay: '400ms' }}>
        <div className="max-w-6xl mx-auto relative">
          <div className="absolute inset-0 bg-gradient-to-b from-primary/20 to-transparent blur-3xl -z-10 rounded-full opacity-50" />
          
          <div className="rounded-[2rem] border border-white/10 bg-[#0a0f1c]/80 backdrop-blur-2xl shadow-[0_0_50px_rgba(0,0,0,0.5)] overflow-hidden relative">
            
            {/* Mock Window Header */}
            <div className="h-12 border-b border-white/10 bg-white/5 flex items-center px-4 justify-between">
              <div className="flex space-x-2">
                <div className="w-3 h-3 rounded-full bg-rose-500/80" />
                <div className="w-3 h-3 rounded-full bg-amber-500/80" />
                <div className="w-3 h-3 rounded-full bg-emerald-500/80" />
              </div>
              <div className="flex items-center space-x-2 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">
                <Lock className="w-3 h-3 text-primary" />
                <span>Encrypted Operations Network</span>
              </div>
            </div>

            {/* Mock Dashboard Body */}
            <div className="p-6 sm:p-10 grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="md:col-span-2 rounded-2xl border border-white/10 bg-black/40 h-64 sm:h-80 relative overflow-hidden flex items-center justify-center">
                 <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-20" />
                 <div className="absolute w-full h-full flex flex-col items-center justify-center space-y-4 z-10">
                   <div className="relative">
                     <div className="absolute inset-0 bg-primary/40 blur-xl rounded-full animate-pulse" />
                     <MapPin className="h-12 w-12 text-primary relative z-10" />
                   </div>
                   <div className="px-4 py-1.5 bg-primary/10 border border-primary/20 rounded-lg backdrop-blur-md">
                     <span className="text-[10px] font-mono text-primary">LIVE TRACKING ACTIVE</span>
                   </div>
                 </div>
              </div>
              <div className="space-y-4">
                <div className="h-full flex flex-col gap-4">
                  <div className="bg-white/5 border border-white/10 p-5 rounded-2xl backdrop-blur-md flex-1 relative overflow-hidden group hover:border-primary/30 transition-colors cursor-default">
                    <div className="absolute top-0 left-0 w-1 h-full bg-rose-500" />
                    <p className="text-[9px] uppercase tracking-widest text-slate-400 font-bold">Priority Target</p>
                    <h4 className="text-white font-bold mt-1 text-sm">Critical Water Main Break</h4>
                    <p className="text-[10px] text-slate-500 mt-2 font-mono">ID: 8492-AX | Confirmed: 98%</p>
                  </div>
                  <div className="bg-white/5 border border-white/10 p-5 rounded-2xl backdrop-blur-md flex-1 relative overflow-hidden group hover:border-primary/30 transition-colors cursor-default">
                    <div className="absolute top-0 left-0 w-1 h-full bg-amber-500" />
                    <p className="text-[9px] uppercase tracking-widest text-slate-400 font-bold">Verification Pending</p>
                    <h4 className="text-white font-bold mt-1 text-sm">Pothole Cluster - Sector 12</h4>
                    <p className="text-[10px] text-slate-500 mt-2 font-mono">ID: 7110-BZ | Confirmed: 45%</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Impact Stats Strip */}
      <section className="border-y border-white/10 bg-white/[0.02] py-16 relative z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-2 md:grid-cols-4 gap-8">
          {[
            { label: "Active Nodes", value: "4.8k+", icon: Activity },
            { label: "Issues Resolved", value: "1,420+", icon: CheckCircle },
            { label: "AI Accuracy", value: "99.4%", icon: Cpu },
            { label: "Avg Resolution", value: "12.5h", icon: Zap }
          ].map((stat, i) => (
            <div key={i} className="flex flex-col items-center justify-center p-6 bg-white/5 rounded-2xl border border-white/10 hover:bg-white/10 transition-colors group cursor-default">
              <stat.icon className="h-6 w-6 text-primary mb-4 opacity-50 group-hover:opacity-100 group-hover:scale-110 transition-all" />
              <p className="text-4xl font-display font-black text-white">{stat.value}</p>
              <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400 mt-2">{stat.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Trust & Mission Section */}
      <section className="py-24 relative z-10">
        <div className="max-w-4xl mx-auto px-4 text-center space-y-6">
          <Shield className="h-12 w-12 text-primary mx-auto opacity-80" />
          <h2 className="font-display font-black text-3xl md:text-5xl text-white tracking-tight">
            Restoring Trust in Civic Operations.
          </h2>
          <p className="text-slate-400 text-lg md:text-xl leading-relaxed max-w-3xl mx-auto">
            We believe that modern cities need modern nervous systems. By combining citizen crowdsourcing, AI-driven deduplication, and a rigid cryptographic verification model, we ensure that every reported issue is genuine, tracked, and resolved.
          </p>
        </div>
      </section>

      {/* Feature Showcase */}
      <section className="py-24 bg-white/[0.01] border-t border-white/5 relative z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
          <div className="text-center space-y-4">
            <h2 className="font-display font-black text-4xl text-white">System Architecture</h2>
            <p className="text-slate-400">The three pillars of our civic intelligence grid.</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card className="bg-[#0a0f1c]/80 border-white/10 backdrop-blur-xl p-8 hover:-translate-y-2 transition-all duration-300 group hover:border-primary/40 hover:shadow-[0_0_30px_rgba(20,184,166,0.1)] cursor-default">
              <div className="h-14 w-14 bg-primary/10 rounded-2xl flex items-center justify-center border border-primary/20 mb-6 group-hover:bg-primary/20 transition-colors">
                <Cpu className="h-7 w-7 text-primary" />
              </div>
              <h3 className="text-xl font-bold text-white mb-3">AI Deduplication Engine</h3>
              <p className="text-sm text-slate-400 leading-relaxed">
                Automatically clusters identical reports within a 500m radius. Prevents municipal spam and optimizes deployment of repair crews.
              </p>
            </Card>

            <Card className="bg-[#0a0f1c]/80 border-white/10 backdrop-blur-xl p-8 hover:-translate-y-2 transition-all duration-300 group hover:border-primary/40 hover:shadow-[0_0_30px_rgba(20,184,166,0.1)] cursor-default">
              <div className="h-14 w-14 bg-primary/10 rounded-2xl flex items-center justify-center border border-primary/20 mb-6 group-hover:bg-primary/20 transition-colors">
                <Users className="h-7 w-7 text-primary" />
              </div>
              <h3 className="text-xl font-bold text-white mb-3">Distributed Verification</h3>
              <p className="text-sm text-slate-400 leading-relaxed">
                Trusted citizen verifiers review nearby reports physically. Multi-node consensus ensures the data reaching officials is 100% accurate.
              </p>
            </Card>

            <Card className="bg-[#0a0f1c]/80 border-white/10 backdrop-blur-xl p-8 hover:-translate-y-2 transition-all duration-300 group hover:border-primary/40 hover:shadow-[0_0_30px_rgba(20,184,166,0.1)] cursor-default">
              <div className="h-14 w-14 bg-primary/10 rounded-2xl flex items-center justify-center border border-primary/20 mb-6 group-hover:bg-primary/20 transition-colors">
                <BarChart3 className="h-7 w-7 text-primary" />
              </div>
              <h3 className="text-xl font-bold text-white mb-3">Command Dashboard</h3>
              <p className="text-sm text-slate-400 leading-relaxed">
                A mission-control interface for city admins. Track resolution velocities, identify hotspot districts, and dispatch resources efficiently.
              </p>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-32 relative z-10 border-t border-white/10 bg-gradient-to-b from-transparent to-primary/5">
        <div className="max-w-4xl mx-auto px-4 text-center space-y-8">
          <h2 className="font-display font-black text-5xl text-white">Initialize Your Node.</h2>
          <p className="text-slate-400 text-lg">Join thousands of operators securing and optimizing urban infrastructure.</p>
          <Link to="/auth" className="inline-block mt-4 w-full sm:w-auto">
            <Button className="w-full sm:w-auto bg-white hover:bg-slate-200 text-[#030712] font-black px-10 py-7 rounded-xl text-base shadow-[0_0_30px_rgba(255,255,255,0.2)] transition-all hover:scale-105 border-none">
              Access the Network
            </Button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-10 border-t border-white/5 bg-[#030712] text-center z-10 relative">
        <div className="max-w-7xl mx-auto px-4 flex flex-col items-center space-y-4">
          <div className="flex items-center space-x-2 opacity-50">
            <Shield className="h-5 w-5 text-primary" />
            <span className="font-bold text-white tracking-widest">{t('logo')}</span>
          </div>
          <p className="text-[10px] font-mono text-slate-600 uppercase tracking-widest">
            Protocol v2.0.4 • Hackathon Build Edition • Secure Civic Intelligence
          </p>
        </div>
      </footer>

    </div>
  );
}
