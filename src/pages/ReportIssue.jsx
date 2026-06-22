import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as zod from 'zod';
import { MapContainer, TileLayer, Marker, useMapEvents } from 'react-leaflet';
import { useAuthStore } from '@/store/useAuthStore';
import { useCreateIssue } from '@/hooks/useIssues';
import { useTranslation } from '@/locales/LanguageContext';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { 
  Upload, Film, MapPin, Sparkles, Check, 
  AlertTriangle, Loader2, Info 
} from 'lucide-react';
import L from 'leaflet';

// Setup Leaflet marker icon
import markerIcon2x from 'leaflet/dist/images/marker-icon-2x.png';
import markerIcon from 'leaflet/dist/images/marker-icon.png';
import markerShadow from 'leaflet/dist/images/marker-shadow.png';

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
    iconRetinaUrl: markerIcon2x,
    iconUrl: markerIcon,
    shadowUrl: markerShadow,
});

const reportSchema = zod.object({
  title: zod.string().min(5, { message: "Title must be at least 5 characters long." }),
  category: zod.string().min(1, { message: "Please select a category." }),
  description: zod.string().min(10, { message: "Description must be at least 10 characters." }),
});

export default function ReportIssue() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const createMutation = useCreateIssue();

  const [imageFile, setImageFile] = useState(null);
  const [videoFile, setVideoFile] = useState(null);
  const [imagePreviewUrl, setImagePreviewUrl] = useState(null);
  
  // Location state
  const [position, setPosition] = useState([28.5355, 77.3910]); // Default Noida Sector 15
  const [address, setAddress] = useState("Sector 15 Main Rd, Noida");

  // AI Assistant States
  const [aiAnalyzing, setAiAnalyzing] = useState(false);
  const [aiAnalysisResult, setAiAnalysisResult] = useState(null);

  const { register, handleSubmit, setValue, watch, formState: { errors } } = useForm({
    resolver: zodResolver(reportSchema),
    defaultValues: {
      title: "",
      category: "",
      description: "",
    }
  });

  // Handle Map Click to set location coordinates
  function MapEventsHelper() {
    useMapEvents({
      click(e) {
        const { lat, lng } = e.latlng;
        setPosition([lat, lng]);
        setAddress(`Coordinates: ${lat.toFixed(4)}, ${lng.toFixed(4)} (Noida District)`);
      },
    });
    return null;
  }

  // Simulate GPS coordinates locator click
  const handleGPSLocate = () => {
    // Generate slight random variation in Noida center
    const randomOffsetLat = (Math.random() - 0.5) * 0.02;
    const randomOffsetLng = (Math.random() - 0.5) * 0.02;
    const lat = 28.5355 + randomOffsetLat;
    const lng = 77.3910 + randomOffsetLng;
    setPosition([lat, lng]);
    setAddress(`Locality near Sector 15 Main Rd, Noida`);
  };

  // Simulate file drops and trigger AI Analysis
  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      setImagePreviewUrl(URL.createObjectURL(file));
      triggerAiAnalysis();
    }
  };

  const handleVideoUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setVideoFile(file);
    }
  };

  // Simulated AI Analyzer
  const triggerAiAnalysis = () => {
    setAiAnalyzing(true);
    setAiAnalysisResult(null);
    setTimeout(() => {
      // Return beautiful mock AI predictions
      setAiAnalyzing(false);
      setAiAnalysisResult({
        category: "Pothole",
        confidence: 0.94,
        severity: "critical",
        severityConfidence: 0.89,
        enhancedDescription: "AI Report [AUTO-GENERATED]: Multi-layered structural damage detected on public asphalt. A severe pothole has formed measuring roughly 8 inches deep and 2 feet wide. Accumulation of water restricts visibility. Immediate patch work recommended to avoid vehicle tire burst hazards."
      });
      // Suggest form changes
      setValue("title", "Deep Pothole reported near Sector 15");
      setValue("category", "Pothole");
    }, 1500);
  };

  const handleApplyAiDesc = () => {
    if (aiAnalysisResult) {
      setValue("description", aiAnalysisResult.enhancedDescription);
    }
  };

  const onSubmit = (data) => {
    const finalReport = {
      title: data.title,
      category: data.category,
      description: data.description,
      severity: aiAnalysisResult?.severity || "medium",
      location: {
        lat: position[0],
        lng: position[1],
        address: address
      },
      reporter: {
        id: user.id,
        name: user.name,
        avatar: user.avatar,
        points: user.points,
        role: user.role
      },
      image: imagePreviewUrl || "https://images.unsplash.com/photo-1515162305285-0293e4767cc2?auto=format&fit=crop&w=600&q=80",
      confidenceScore: aiAnalysisResult?.confidence || 0.90
    };

    createMutation.mutate(finalReport, {
      onSuccess: () => {
        navigate("/issues");
      }
    });
  };

  return (
    <DashboardLayout>
      <div className="space-y-6 max-w-4xl mx-auto animate-fade-in">
        {/* Title */}
        <div className="space-y-1 border-b border-border/60 pb-4">
          <h1 className="font-display font-black text-2xl text-foreground">
            {t('reportTitle')}
          </h1>
          <p className="text-xs text-muted-foreground">
            Submit photo/video proof, set coordinates, and let the AI assistant categorize the complaint.
          </p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="grid grid-cols-1 lg:grid-cols-5 gap-8">
          {/* Left Fields Form */}
          <div className="lg:col-span-3 space-y-5">
            {/* Title field */}
            <div>
              <label className="block text-xs font-bold text-muted-foreground uppercase mb-1.5">{t('issueTitleLabel')}</label>
              <input
                type="text"
                placeholder={t('issueTitlePlaceholder')}
                {...register("title")}
                className="w-full bg-card rounded-xl border border-border/80 px-4 py-2.5 text-xs text-foreground outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all"
              />
              {errors.title && <span className="text-[10px] text-destructive mt-1 block">{errors.title.message}</span>}
            </div>

            {/* Category selection */}
            <div>
              <label className="block text-xs font-bold text-muted-foreground uppercase mb-1.5">{t('categoryLabel')}</label>
              <select
                {...register("category")}
                className="w-full bg-card rounded-xl border border-border/80 px-4 py-2.5 text-xs text-foreground outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all"
              >
                <option value="">{t('selectCategory')}</option>
                <option value="Pothole">{t('catPothole')}</option>
                <option value="Garbage">{t('catGarbage')}</option>
                <option value="Water Leakage">{t('catWaterLeak')}</option>
                <option value="Streetlight">{t('catStreetlight')}</option>
                <option value="Sewer">{t('catSewer')}</option>
                <option value="Public Infrastructure">{t('catPublicInfra')}</option>
              </select>
              {errors.category && <span className="text-[10px] text-destructive mt-1 block">{errors.category.message}</span>}
            </div>

            {/* Description field */}
            <div>
              <label className="block text-xs font-bold text-muted-foreground uppercase mb-1.5">{t('descriptionLabel')}</label>
              <textarea
                rows={5}
                placeholder={t('descriptionPlaceholder')}
                {...register("description")}
                className="w-full bg-card rounded-xl border border-border/80 px-4 py-2.5 text-xs text-foreground outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all resize-none"
              />
              {errors.description && <span className="text-[10px] text-destructive mt-1 block">{errors.description.message}</span>}
            </div>

            {/* GPS Map Picker */}
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <label className="block text-xs font-bold text-muted-foreground uppercase">{t('gpsLabel')}</label>
                <button
                  type="button"
                  onClick={handleGPSLocate}
                  className="flex items-center space-x-1 text-xxs font-bold text-primary hover:underline"
                >
                  <MapPin className="h-3.5 w-3.5" />
                  <span>{t('gpsBtn')}</span>
                </button>
              </div>
              <div className="h-48 rounded-xl overflow-hidden border border-border relative z-10">
                <MapContainer center={position} zoom={15} style={{ height: '100%', width: '100%' }}>
                  <TileLayer
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
                  />
                  <Marker position={position} />
                  <MapEventsHelper />
                </MapContainer>
              </div>
              <p className="text-xxs text-muted-foreground bg-secondary/60 p-2.5 rounded-lg border border-border/40">
                {address}
              </p>
            </div>

            {/* Submit buttons */}
            <button
              type="submit"
              disabled={createMutation.isPending}
              className="w-full bg-primary hover:bg-primary-hover text-white py-3.5 rounded-xl font-bold text-xs shadow-premium flex items-center justify-center space-x-2 transition-all"
            >
              {createMutation.isPending ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  <span>Submitting complaint...</span>
                </>
              ) : (
                <>
                  <Check className="h-4 w-4" />
                  <span>{t('submitReport')}</span>
                </>
              )}
            </button>
          </div>

          {/* Right Upload & AI Preview Panel */}
          <div className="lg:col-span-2 space-y-6">
            {/* Image Drag-n-drop */}
            <div className="space-y-2">
              <label className="block text-xs font-bold text-muted-foreground uppercase">Upload Image</label>
              <div className="border-2 border-dashed border-border/80 hover:border-primary/50 bg-card rounded-2xl p-6 text-center cursor-pointer transition-all relative overflow-hidden h-40 flex flex-col items-center justify-center">
                {imagePreviewUrl ? (
                  <img src={imagePreviewUrl} alt="Preview" className="absolute inset-0 w-full h-full object-cover" />
                ) : (
                  <>
                    <Upload className="h-8 w-8 text-muted-foreground/60 mb-2" />
                    <p className="text-[10px] text-muted-foreground px-4 leading-normal">{t('dragDropImage')}</p>
                  </>
                )}
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="absolute inset-0 opacity-0 cursor-pointer"
                />
              </div>
            </div>

            {/* Video Drag-n-drop */}
            <div className="space-y-2">
              <label className="block text-xs font-bold text-muted-foreground uppercase">Upload Video (Optional)</label>
              <div className="border-2 border-dashed border-border/80 hover:border-primary/50 bg-card rounded-2xl p-6 text-center cursor-pointer transition-all relative overflow-hidden h-28 flex flex-col items-center justify-center">
                {videoFile ? (
                  <p className="text-[10px] text-primary font-semibold">{videoFile.name} (Uploaded)</p>
                ) : (
                  <>
                    <Film className="h-6 w-6 text-muted-foreground/60 mb-1" />
                    <p className="text-[10px] text-muted-foreground px-4 leading-normal">{t('dragDropVideo')}</p>
                  </>
                )}
                <input
                  type="file"
                  accept="video/*"
                  onChange={handleVideoUpload}
                  className="absolute inset-0 opacity-0 cursor-pointer"
                />
              </div>
            </div>

            {/* AI Assistant Analyzer Panel */}
            <div className="bg-gradient-to-tr from-primary/10 via-emerald-400/5 to-transparent border border-primary/20 rounded-2xl p-5 space-y-4">
              <div className="flex items-center space-x-2 text-primary">
                <Sparkles className="h-5 w-5 fill-current animate-pulse" />
                <h3 className="font-display font-bold text-xs tracking-tight">AI Copilot Analysis</h3>
              </div>

              {aiAnalyzing && (
                <div className="flex items-center space-x-2 text-muted-foreground text-xs py-4">
                  <Loader2 className="h-4 w-4 animate-spin text-primary" />
                  <span>{t('aiAnalyzing')}</span>
                </div>
              )}

              {!imagePreviewUrl && !aiAnalyzing && (
                <div className="text-muted-foreground text-[10px] flex items-start space-x-2 py-4">
                  <Info className="h-4 w-4 text-primary shrink-0 mt-0.5" />
                  <span>Upload an image of the issue to activate instant AI categorisation and severity check.</span>
                </div>
              )}

              {aiAnalysisResult && (
                <div className="space-y-3.5 animate-fade-in text-xs">
                  {/* Category Suggestion */}
                  <div className="flex justify-between items-center border-b border-border/50 pb-2">
                    <span className="text-muted-foreground">{t('aiCategorized')}</span>
                    <span className="font-bold text-foreground">
                      {aiAnalysisResult.category} ({(aiAnalysisResult.confidence * 100).toFixed(0)}%)
                    </span>
                  </div>

                  {/* Severity Suggestion */}
                  <div className="flex justify-between items-center border-b border-border/50 pb-2">
                    <span className="text-muted-foreground">{t('aiSeverity')}</span>
                    <span className="font-bold uppercase text-rose-500">
                      {aiAnalysisResult.severity} ({(aiAnalysisResult.severityConfidence * 100).toFixed(0)}%)
                    </span>
                  </div>

                  {/* Description Expansion */}
                  <div className="space-y-1.5">
                    <span className="text-muted-foreground block">{t('aiDescription')}</span>
                    <p className="bg-card p-3 rounded-xl border border-border/80 text-[10px] leading-relaxed text-muted-foreground max-h-24 overflow-y-auto">
                      {aiAnalysisResult.enhancedDescription}
                    </p>
                    <button
                      type="button"
                      onClick={handleApplyAiDesc}
                      className="w-full bg-primary/10 border border-primary/20 hover:bg-primary/20 text-primary text-xxs font-bold py-1.5 rounded-lg transition-all"
                    >
                      {t('applyAiDesc')}
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </form>
      </div>
    </DashboardLayout>
  );
}
