import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import { supabase } from "@/lib/supabase";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import WhatsAppButton from "@/components/WhatsAppButton";
import {
  CheckCircle2, Users, TrendingUp, Award, BookOpen,
  Smartphone, DollarSign, Shield, Star, ChevronRight
} from "lucide-react";

const agentSchema = z.object({
  full_name: z.string().min(2, "Full name is required"),
  email: z.string().email("Valid email required"),
  phone: z.string().min(10, "Valid phone number required"),
  location: z.string().min(2, "Location is required"),
  experience_level: z.string().min(1, "Please select your experience level"),
  current_employer: z.string().optional(),
  ffc_number: z.string().optional(),
  motivation: z.string().min(20, "Please tell us a bit more about yourself"),
  agent_type: z.string().min(1, "Please select agent type"),
});

type AgentForm = z.infer<typeof agentSchema>;

const benefits = [
  {
    icon: DollarSign,
    title: "Competitive Commission Structure",
    description: "Earn up to 50% commission on every successful deal. Our transparent, performance-based structure rewards your hard work directly.",
  },
  {
    icon: TrendingUp,
    title: "Exclusive Listings & Leads",
    description: "Access to YoungProp's growing portfolio of vacant land, plots, and residential properties across Walkerville and Gauteng.",
  },
  {
    icon: BookOpen,
    title: "Training & Development",
    description: "Structured onboarding, ongoing mentorship, and access to our Agent Development Programme — whether you're new or experienced.",
  },
  {
    icon: Smartphone,
    title: "Digital Tools & CRM",
    description: "Full access to our platform: CRM, deal pipeline, digital mandate management, and marketing materials at your fingertips.",
  },
  {
    icon: Shield,
    title: "PPRA Compliance Support",
    description: "We help you navigate PPRA registration, FFC renewals, and compliance requirements so you can focus on selling.",
  },
  {
    icon: Users,
    title: "Collaborative Team Culture",
    description: "Join a young, driven, and supportive team that celebrates wins together. We grow as individuals and as a company.",
  },
];

const agentTypes = [
  {
    title: "Full-Time Agent",
    description: "Dedicated agents who work exclusively with YoungProp. Full support, leads, and resources provided.",
    icon: Award,
    highlight: true,
  },
  {
    title: "Part-Time / Side Agent",
    description: "Earn commission alongside your current career. Flexible hours, your own pace.",
    icon: Star,
    highlight: false,
  },
  {
    title: "Referral Partner",
    description: "Not a registered agent? Refer clients to us and earn a referral fee on every successful deal.",
    icon: Users,
    highlight: false,
  },
];

const steps = [
  { number: "01", title: "Submit Your Application", description: "Complete the form below with your details and experience." },
  { number: "02", title: "Initial Interview", description: "A brief call or meeting with our team to understand your goals." },
  { number: "03", title: "Onboarding & Training", description: "Complete our agent onboarding programme and get set up on the platform." },
  { number: "04", title: "Start Selling", description: "Access listings, leads, and tools. Begin earning from day one." },
];

export default function JoinUs() {
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const { register, handleSubmit, setValue, formState: { errors } } = useForm<AgentForm>({
    resolver: zodResolver(agentSchema),
  });

  const onSubmit = async (data: AgentForm) => {
    setSubmitting(true);
    try {
      const { error } = await supabase.from("agent_applications").insert([{
        full_name: data.full_name,
        email: data.email,
        phone: data.phone,
        location: data.location,
        experience_level: data.experience_level,
        current_employer: data.current_employer || null,
        ffc_number: data.ffc_number || null,
        motivation: data.motivation,
        agent_type: data.agent_type,
        status: "new",
        created_at: new Date().toISOString(),
      }]);

      if (error) throw error;
      setSubmitted(true);
      toast.success("Application submitted! We'll be in touch within 24 hours.");
    } catch (err) {
      console.error(err);
      toast.error("Something went wrong. Please try again or WhatsApp us directly.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-white">
      <Navbar />

      {/* Hero */}
      <section className="bg-navy pt-24 pb-16 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 right-0 w-96 h-96 bg-gold rounded-full blur-3xl translate-x-1/2 -translate-y-1/2" />
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-gold rounded-full blur-3xl -translate-x-1/2 translate-y-1/2" />
        </div>
        <div className="container relative z-10 text-center max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2 bg-gold/20 text-gold border border-gold/30 rounded-full px-4 py-1.5 text-sm font-medium mb-6">
            <Users size={14} />
            We're Growing — Join the Team
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-white font-display mb-6 leading-tight">
            Build Your Career in <span className="text-gold">Property</span> with YoungProp
          </h1>
          <p className="text-white/70 text-lg leading-relaxed mb-8">
            YoungProp Estate Agency is looking for driven, ambitious individuals who are passionate about property.
            Whether you're a seasoned agent or just starting out, we have a place for you in our growing team.
          </p>
          <div className="flex flex-wrap gap-4 justify-center">
            <a href="#apply" className="btn-primary">Apply Now</a>
            <a href="https://wa.me/27737124178?text=Hi%2C%20I%27m%20interested%20in%20joining%20the%20YoungProp%20team" target="_blank" rel="noopener noreferrer" className="btn-outline">
              WhatsApp Us First
            </a>
          </div>
        </div>
      </section>

      {/* Why Join */}
      <section className="py-20 bg-white">
        <div className="container">
          <div className="text-center max-w-2xl mx-auto mb-14">
            <h2 className="text-3xl md:text-4xl font-bold text-navy font-display mb-4">
              Why Join <span className="text-gold">YoungProp?</span>
            </h2>
            <p className="text-navy/60 text-lg">
              We're not just another estate agency. We're building a platform that empowers agents with the tools,
              training, and support to succeed in today's property market.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {benefits.map((benefit) => (
              <div key={benefit.title} className="group p-6 rounded-2xl border border-navy/10 hover:border-gold/40 hover:shadow-lg transition-all duration-300">
                <div className="w-12 h-12 rounded-xl bg-gold/10 flex items-center justify-center mb-4 group-hover:bg-gold/20 transition-colors">
                  <benefit.icon size={22} className="text-gold" />
                </div>
                <h3 className="font-bold text-navy text-lg mb-2">{benefit.title}</h3>
                <p className="text-navy/60 text-sm leading-relaxed">{benefit.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Agent Types */}
      <section className="py-20 bg-navy/5">
        <div className="container">
          <div className="text-center max-w-2xl mx-auto mb-14">
            <h2 className="text-3xl md:text-4xl font-bold text-navy font-display mb-4">
              Which <span className="text-gold">Role</span> Suits You?
            </h2>
            <p className="text-navy/60 text-lg">
              We accommodate different working styles and commitment levels. Find the arrangement that works for you.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {agentTypes.map((type) => (
              <div
                key={type.title}
                className={`p-8 rounded-2xl border-2 transition-all ${
                  type.highlight
                    ? "border-gold bg-navy text-white shadow-xl shadow-navy/20"
                    : "border-navy/10 bg-white hover:border-gold/40 hover:shadow-lg"
                }`}
              >
                {type.highlight && (
                  <div className="inline-flex items-center gap-1 bg-gold text-navy text-xs font-bold px-3 py-1 rounded-full mb-4">
                    <Star size={10} fill="currentColor" /> Most Popular
                  </div>
                )}
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-4 ${type.highlight ? "bg-gold/20" : "bg-gold/10"}`}>
                  <type.icon size={22} className="text-gold" />
                </div>
                <h3 className={`font-bold text-xl mb-3 ${type.highlight ? "text-white" : "text-navy"}`}>{type.title}</h3>
                <p className={`text-sm leading-relaxed ${type.highlight ? "text-white/70" : "text-navy/60"}`}>{type.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Process */}
      <section className="py-20 bg-white">
        <div className="container">
          <div className="text-center max-w-2xl mx-auto mb-14">
            <h2 className="text-3xl md:text-4xl font-bold text-navy font-display mb-4">
              How the <span className="text-gold">Process</span> Works
            </h2>
            <p className="text-navy/60 text-lg">From application to your first deal — here's what to expect.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 max-w-5xl mx-auto">
            {steps.map((step, i) => (
              <div key={step.number} className="relative text-center">
                <div className="w-16 h-16 rounded-full bg-navy text-white font-bold text-xl flex items-center justify-center mx-auto mb-4 font-display">
                  {step.number}
                </div>
                {i < steps.length - 1 && (
                  <div className="hidden md:block absolute top-8 left-[calc(50%+2rem)] w-[calc(100%-4rem)] h-0.5 bg-gold/30" />
                )}
                <h3 className="font-bold text-navy mb-2">{step.title}</h3>
                <p className="text-navy/60 text-sm leading-relaxed">{step.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Application Form */}
      <section id="apply" className="py-20 bg-navy/5">
        <div className="container max-w-3xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-navy font-display mb-4">
              Submit Your <span className="text-gold">Application</span>
            </h2>
            <p className="text-navy/60 text-lg">
              Fill in the form below and our team will be in touch within 24 hours.
            </p>
          </div>

          {submitted ? (
            <div className="bg-white rounded-3xl p-12 text-center shadow-xl border border-gold/20">
              <div className="w-20 h-20 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-6">
                <CheckCircle2 size={40} className="text-green-600" />
              </div>
              <h3 className="text-2xl font-bold text-navy mb-3">Application Received!</h3>
              <p className="text-navy/60 mb-6">
                Thank you for your interest in joining YoungProp. Our team will review your application
                and reach out within 24 hours. We're excited to potentially have you on board.
              </p>
              <a
                href="https://wa.me/27737124178?text=Hi%2C%20I%20just%20submitted%20my%20agent%20application%20on%20your%20website"
                target="_blank"
                rel="noopener noreferrer"
                className="btn-primary inline-flex"
              >
                Follow Up on WhatsApp
              </a>
            </div>
          ) : (
            <form onSubmit={handleSubmit(onSubmit)} className="bg-white rounded-3xl p-8 md:p-12 shadow-xl border border-navy/10 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <Label htmlFor="full_name" className="text-navy font-medium">Full Name *</Label>
                  <Input {...register("full_name")} id="full_name" placeholder="Your full name" className="mt-1.5" />
                  {errors.full_name && <p className="text-red-500 text-xs mt-1">{errors.full_name.message}</p>}
                </div>
                <div>
                  <Label htmlFor="email" className="text-navy font-medium">Email Address *</Label>
                  <Input {...register("email")} id="email" type="email" placeholder="your@email.com" className="mt-1.5" />
                  {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email.message}</p>}
                </div>
                <div>
                  <Label htmlFor="phone" className="text-navy font-medium">Phone Number *</Label>
                  <Input {...register("phone")} id="phone" placeholder="073 712 4178" className="mt-1.5" />
                  {errors.phone && <p className="text-red-500 text-xs mt-1">{errors.phone.message}</p>}
                </div>
                <div>
                  <Label htmlFor="location" className="text-navy font-medium">Your Location *</Label>
                  <Input {...register("location")} id="location" placeholder="e.g. Walkerville, Johannesburg" className="mt-1.5" />
                  {errors.location && <p className="text-red-500 text-xs mt-1">{errors.location.message}</p>}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <Label className="text-navy font-medium">Experience Level *</Label>
                  <Select onValueChange={(v) => setValue("experience_level", v)}>
                    <SelectTrigger className="mt-1.5">
                      <SelectValue placeholder="Select experience level" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="no_experience">No experience — eager to learn</SelectItem>
                      <SelectItem value="1_2_years">1–2 years in property</SelectItem>
                      <SelectItem value="3_5_years">3–5 years in property</SelectItem>
                      <SelectItem value="5_plus_years">5+ years in property</SelectItem>
                      <SelectItem value="other_sales">Sales experience (other industry)</SelectItem>
                    </SelectContent>
                  </Select>
                  {errors.experience_level && <p className="text-red-500 text-xs mt-1">{errors.experience_level.message}</p>}
                </div>
                <div>
                  <Label className="text-navy font-medium">I Want to Join As *</Label>
                  <Select onValueChange={(v) => setValue("agent_type", v)}>
                    <SelectTrigger className="mt-1.5">
                      <SelectValue placeholder="Select agent type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="full_time">Full-Time Agent</SelectItem>
                      <SelectItem value="part_time">Part-Time / Side Agent</SelectItem>
                      <SelectItem value="referral_partner">Referral Partner</SelectItem>
                    </SelectContent>
                  </Select>
                  {errors.agent_type && <p className="text-red-500 text-xs mt-1">{errors.agent_type.message}</p>}
                </div>
                <div>
                  <Label htmlFor="current_employer" className="text-navy font-medium">Current / Previous Agency (if any)</Label>
                  <Input {...register("current_employer")} id="current_employer" placeholder="e.g. Seeff, Rawson, Independent" className="mt-1.5" />
                </div>
                <div>
                  <Label htmlFor="ffc_number" className="text-navy font-medium">FFC Number (if registered)</Label>
                  <Input {...register("ffc_number")} id="ffc_number" placeholder="Your PPRA FFC number" className="mt-1.5" />
                </div>
              </div>

              <div>
                <Label htmlFor="motivation" className="text-navy font-medium">Why Do You Want to Join YoungProp? *</Label>
                <Textarea
                  {...register("motivation")}
                  id="motivation"
                  placeholder="Tell us about yourself, your goals, and why you think you'd be a great fit for our team..."
                  rows={5}
                  className="mt-1.5 resize-none"
                />
                {errors.motivation && <p className="text-red-500 text-xs mt-1">{errors.motivation.message}</p>}
              </div>

              <Button type="submit" disabled={submitting} className="w-full btn-primary h-12 text-base">
                {submitting ? "Submitting Application..." : "Submit My Application"}
                {!submitting && <ChevronRight size={18} className="ml-2" />}
              </Button>

              <p className="text-center text-navy/40 text-xs">
                By submitting this form, you agree to be contacted by YoungProp Estate Agency regarding your application.
                We do not share your information with third parties.
              </p>
            </form>
          )}
        </div>
      </section>

      <Footer />
      <WhatsAppButton />
    </div>
  );
}
