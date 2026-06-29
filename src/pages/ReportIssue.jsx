import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as zod from 'zod';
import { MapContainer, TileLayer, Marker, useMapEvents } from 'react-leaflet';
import { useAuthStore } from '@/store/useAuthStore';
import { useCreateIssue } from '@/hooks/useIssues';
import { useTranslation } from '@/locales/LanguageContext';
import { supabase } from '@/lib/supabase';
import DashboardLayout from '@/components/layout/DashboardLayout';
import {
  Upload, Film, MapPin, Sparkles, Check,
  Loader2, Info, ChevronDown
} from 'lucide-react';
import L from 'leaflet';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Input, Textarea } from '@/components/ui/Input';

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

// Handle Map Click to set location coordinates
function MapEventsHelper({ setPosition, setAddress }) {
  useMapEvents({
    click(e) {
      const { lat, lng } = e.latlng;
      setPosition([lat, lng]);
      setAddress(`Coordinates: ${lat.toFixed(4)}, ${lng.toFixed(4)} (Noida District)`);
    },
  });
  return null;
}

export default function ReportIssue() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const createMutation = useCreateIssue();

  const [videoFile, setVideoFile] = useState(null);
  const [imageFile, setImageFile] = useState(null);
  const [imagePreviewUrl, setImagePreviewUrl] = useState(null);

  // Location state
  const [position, setPosition] = useState([28.5355, 77.3910]); // Default Noida Sector 15
  const [address, setAddress] = useState("Sector 15 Main Rd, Noida");

  // AI Assistant States
  const [aiAnalyzing, setAiAnalyzing] = useState(false);
  const [aiAnalysisResult, setAiAnalysisResult] = useState(null);

  const { register, handleSubmit, setValue, formState: { errors } } = useForm({
    resolver: zodResolver(reportSchema),
    defaultValues: {
      title: "",
      category: "",
      description: "",
    }
  });

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

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      setImagePreviewUrl(URL.createObjectURL(file));
    }
  };

  const handleVideoUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setVideoFile(file);
    }
  };

  const handleImproveWithAI = async () => {
    const currentTitle = setValue.name === "title" ? "" : (document.querySelector('input[name="title"]')?.value || "");
    const currentDesc = document.querySelector('textarea[name="description"]')?.value || "";

    if (!currentTitle && !currentDesc && !imagePreviewUrl) {
      return; // Nothing to improve
    }

    setAiAnalyzing(true);
    setAiAnalysisResult(null);

    try {
      // Note: We only send text because sending base64 images without reading them properly can be heavy,
      // but to fully support "when user uploads image generate title" we'd read it as base64.
      // For MVP, we pass whatever we have.
      let base64 = null;
      let mime = null;
      if (imageFile) {
        const reader = new FileReader();
        base64 = await new Promise((resolve) => {
          reader.onload = () => resolve(reader.result.split(',')[1]);
          reader.readAsDataURL(imageFile);
        });
        mime = imageFile.type;
      }
      const { data: sessionData } = await supabase.auth.getSession();
      // const { data, error } = await supabase.functions.invoke('ai-civic-agent', {
      //   body: {
      //     action: 'improve_draft',
      //     payload: {
      //       title: currentTitle,
      //       description: currentDesc,
      //       imageBase64: base64,
      //       mimeType: mime
      //     }
      //   }
      // });
      const { data, error } = await supabase.functions.invoke('ai-civic-agent', {
        body: {
          action: 'improve_draft',
          payload: {
            title: currentTitle,
            description: currentDesc,
            imageBase64: base64,
            mimeType: mime
          }
        },
        headers: {
          Authorization: `Bearer ${(await supabase.auth.getSession()).data.session?.access_token}`
        }
      });

      if (error) throw error;

      // const { title, description } = data.result;

      const result = data?.result || data?.data || data;

      if (result?.title || result?.description) {
        setValue("title", result.title || "", {
          shouldDirty: true,
          shouldValidate: true,
        });

        setValue("description", result.description || "", {
          shouldDirty: true,
          shouldValidate: true,
        });

        if (result?.category) {
          setValue("category", result.category, {
            shouldDirty: true,
            shouldValidate: true,
          });
        }

        if (result?.severity) {
          setValue("severity", result.severity, {
            shouldDirty: true,
            shouldValidate: true,
          });
        }
      }

      setAiAnalysisResult({
        success: true,
        severity: result?.severity
      });
    } catch (err) {
      console.error("Failed to improve draft with AI:", err);
    } finally {
      setAiAnalyzing(false);
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
      imageFile: imageFile,
      videoFile: videoFile,
      image: imagePreviewUrl || "https://images.unsplash.com/photo-1515162305285-0293e4767cc2?auto=format&fit=crop&w=600&q=80",
    };

    createMutation.mutate(finalReport, {
      onSuccess: (newIssue) => {
        navigate("/issues");
      },
      onError: (err) => {
        console.error("[ReportIssue] createMutation.mutate failed! Error:", err);
      }
    });
  };

  return (
    <DashboardLayout>
      <div className="space-y-8 max-w-5xl mx-auto animate-fade-in pb-12">
        {/* Title Header Section */}
        <div className="space-y-2 pb-4">
          <h1 className="font-display font-black text-3xl tracking-tight text-foreground">
            {t('reportTitle')}
          </h1>
          <p className="text-sm font-medium text-muted-foreground max-w-2xl">
            Submit photo/video proof, set precise coordinates, and let the AI assistant instantly categorize and prioritize your civic report.
          </p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">

          {/* LEFT COLUMN: Main Form & Map */}
          <div className="lg:col-span-7 space-y-8">
            <Card className="glass-card p-6 sm:p-8 rounded-[2rem] space-y-6 border border-primary/20 hover:border-primary/40 shadow-[0_4px_20px_rgba(20,184,166,0.05)] hover:shadow-[0_8px_30px_rgba(20,184,166,0.15)] transition-all duration-300">

              <div className="space-y-5">
                {/* Title field */}
                <Input
                  label={t('issueTitleLabel')}
                  type="text"
                  placeholder={t('issueTitlePlaceholder')}
                  error={errors.title?.message}
                  {...register("title")}
                />

                {/* Category selection */}
                <div className="space-y-1.5">
                  <label className="block text-xs font-bold text-muted-foreground uppercase">{t('categoryLabel')}</label>
                  <div className="relative group">
                    <select
                      {...register("category")}
                      className="w-full appearance-none bg-background/50 dark:bg-black/40 rounded-xl border border-border px-4 py-3 text-sm text-foreground outline-none focus:border-primary focus:ring-4 focus:ring-primary/20 hover:border-primary/50 transition-all shadow-sm group-hover:shadow-[0_0_15px_rgba(20,184,166,0.1)] cursor-pointer"
                    >
                      <option value="" className="bg-card text-foreground">{t('selectCategory')}</option>
                      <option value="Pothole" className="bg-card text-foreground">{t('catPothole')}</option>
                      <option value="Garbage" className="bg-card text-foreground">{t('catGarbage')}</option>
                      <option value="Water Leakage" className="bg-card text-foreground">{t('catWaterLeak')}</option>
                      <option value="Streetlight" className="bg-card text-foreground">{t('catStreetlight')}</option>
                      <option value="Sewer" className="bg-card text-foreground">{t('catSewer')}</option>
                      <option value="Public Infrastructure" className="bg-card text-foreground">{t('catPublicInfra')}</option>
                    </select>
                    <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none group-hover:text-primary transition-colors" />
                  </div>
                  {errors.category && <span className="text-[10px] text-destructive mt-1 block font-medium">{errors.category.message}</span>}
                </div>

                {/* Description field */}
                <div className="space-y-2">
                  <Textarea
                    label={t('descriptionLabel')}
                    rows={4}
                    placeholder={t('descriptionPlaceholder')}
                    error={errors.description?.message}
                    {...register("description")}
                  />

                  <div className="flex justify-end">
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      className="text-xs bg-primary/10 text-primary border-primary/20 hover:bg-primary/20 hover:border-primary/30 font-semibold flex items-center gap-1.5 transition-all shadow-sm group"
                      onClick={handleImproveWithAI}
                      disabled={aiAnalyzing}
                    >
                      {aiAnalyzing ? (
                        <Loader2 className="h-3.5 w-3.5 animate-spin" />
                      ) : (
                        <Sparkles className="h-3.5 w-3.5 group-hover:scale-110 transition-transform" />
                      )}
                      {aiAnalyzing ? "Improving..." : "Improve with AI"}
                    </Button>
                  </div>
                </div>
              </div>
            </Card>

            <Card className="glass-card p-6 sm:p-8 rounded-[2rem] space-y-5 border border-primary/20 hover:border-primary/40 shadow-[0_4px_20px_rgba(20,184,166,0.05)] hover:shadow-[0_8px_30px_rgba(20,184,166,0.15)] transition-all duration-300">
              {/* GPS Map Picker */}
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <div className="space-y-0.5">
                    <label className="block text-xs font-bold text-muted-foreground uppercase">{t('gpsLabel')}</label>
                    <span className="text-[10px] text-muted-foreground/80 font-medium">Pinpoint the exact issue location on the map.</span>
                  </div>
                  <Button
                    type="button"
                    variant="ghost"
                    onClick={handleGPSLocate}
                    className="flex items-center space-x-1 text-xs font-bold text-primary hover:text-primary-hover hover:underline p-0 bg-transparent hover:bg-transparent h-auto"
                  >
                    <MapPin className="h-4 w-4" />
                    <span>{t('gpsBtn')}</span>
                  </Button>
                </div>

                <div className="h-[250px] rounded-2xl overflow-hidden border border-border shadow-inner relative z-10 group">
                  {/* Subtle map vignette/shadow overlay */}
                  <div className="absolute inset-0 pointer-events-none shadow-[inset_0_0_20px_rgba(0,0,0,0.05)] z-[400]" />
                  <MapContainer center={position} zoom={15} style={{ height: '100%', width: '100%' }}>
                    <TileLayer
                      url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                      attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
                    />
                    <Marker position={position} />
                    <MapEventsHelper setPosition={setPosition} setAddress={setAddress} />
                  </MapContainer>
                </div>

                <div className="flex items-start space-x-2 bg-secondary/40 dark:bg-black/20 p-3 rounded-xl border border-border/50">
                  <MapPin className="h-4 w-4 text-primary shrink-0 mt-0.5" />
                  <p className="text-xs text-foreground font-medium leading-relaxed">
                    {address}
                  </p>
                </div>
              </div>
            </Card>

            {/* Submit buttons (Desktop: Below Map, Mobile: Bottom of flow) */}
            <Button
              type="submit"
              variant="primary"
              size="lg"
              loading={createMutation.isPending}
              className="w-full text-base tracking-wide shadow-xl shadow-primary/20 hover:shadow-[0_0_25px_rgba(20,184,166,0.3)] transition-all duration-300"
            >
              {!createMutation.isPending && <Check className="h-5 w-5 mr-2" />}
              <span>{createMutation.isPending ? "Submitting complaint..." : t('submitReport')}</span>
            </Button>
          </div>

          {/* RIGHT COLUMN: Uploads & AI Panel */}
          <div className="lg:col-span-5 space-y-6">

            <Card className="glass-card p-6 sm:p-8 rounded-[2rem] space-y-6 border border-primary/20 hover:border-primary/40 shadow-[0_4px_20px_rgba(20,184,166,0.05)] hover:shadow-[0_8px_30px_rgba(20,184,166,0.15)] transition-all duration-300">
              {/* Image Drag-n-drop */}
              <div className="space-y-2.5">
                <label className="block text-xs font-bold text-muted-foreground uppercase">Evidence Upload</label>
                <div className="border-2 border-dashed border-border/80 hover:border-primary/50 bg-background/50 dark:bg-black/20 rounded-2xl p-6 text-center cursor-pointer transition-all duration-300 relative overflow-hidden h-44 flex flex-col items-center justify-center group hover:shadow-[0_0_25px_rgba(20,184,166,0.15)] hover:-translate-y-0.5">
                  {imagePreviewUrl ? (
                    <img src={imagePreviewUrl} alt="Preview" className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
                  ) : (
                    <>
                      <div className="bg-primary/10 p-3 rounded-full mb-3 group-hover:scale-110 transition-transform duration-300">
                        <Upload className="h-6 w-6 text-primary" />
                      </div>
                      <p className="text-xs font-bold text-foreground mb-1 group-hover:text-primary transition-colors">Click to upload image</p>
                      <p className="text-[10px] text-muted-foreground px-4 leading-relaxed font-medium">JPEG, PNG, WEBP up to 10MB</p>
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
              <div className="space-y-2.5 pt-2">
                <label className="block text-xs font-bold text-muted-foreground uppercase">Video Upload (Optional)</label>
                <div className="border-2 border-dashed border-border/80 hover:border-primary/50 bg-background/50 dark:bg-black/20 rounded-2xl p-6 text-center cursor-pointer transition-all duration-300 relative overflow-hidden h-28 flex flex-col items-center justify-center group hover:shadow-[0_0_25px_rgba(20,184,166,0.15)] hover:-translate-y-0.5">
                  {videoFile ? (
                    <div className="flex flex-col items-center justify-center space-y-2">
                      <div className="bg-primary/10 p-2 rounded-full">
                        <Check className="h-4 w-4 text-primary" />
                      </div>
                      <p className="text-[11px] text-foreground font-semibold">{videoFile.name}</p>
                    </div>
                  ) : (
                    <>
                      <Film className="h-5 w-5 text-muted-foreground/60 mb-2 group-hover:text-primary transition-colors duration-300" />
                      <p className="text-[10px] font-medium text-muted-foreground leading-relaxed group-hover:text-foreground transition-colors">{t('dragDropVideo')}</p>
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
            </Card>

            {/* Removed mock AI Analyzer panel as 'Improve with AI' now handles drafting directly */}
          </div>
        </form>
      </div>
    </DashboardLayout>
  );
}
