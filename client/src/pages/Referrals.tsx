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
  CheckCircle2, Gift, Users, DollarSign, ArrowRight,
  Phone, Home, TrendingUp, Shield, ChevronRight, Star
} from "lucide-react";

const referralSchema = z.object({
  referrer_name: z.string().min(2, "Your name is required"),
  referrer_email: z.string().email("Valid email required"),
  referrer_phone: z.string().min(10, "Valid phone number required"),
  client_name: z.string().min(2, "Client name is required"),
  client_phone: z.string().min(10, "Client phone is required"),
  client_email: z.string().email("Valid client email required").optional().or(z.literal("")),
  referral_type: z.string().min(1, "Please select referral type"),
  property_interest: z.string().optional(),
  additional_notes: z.string().optional(),
});

type ReferralForm = z.infer<typeof referralSchema>;

const howItWorks = [
  {
    step: "01",
    title: "Refer Someone You Know",
    description: "Know someone looking to buy, sell, or get a property valuation? Fill in the form below with their details.",
    icon: Users,
  },
  {
    step: "02",
    title: "We Make Contact",
    description: "Our team reaches out to your referral within 24 hours to understand their property needs.",
    icon: Phone,
  },
  {
    step: "03",
    title: "We Close the Deal",
    description: "YoungProp handles everything — from listing to sale or purchase. You sit back and wait.",
    icon: Home,
  },
  {
    step: "04",
    title: "You Get Paid",
    description: "Once the deal is successfully concluded, you receive your referral fee. Simple as that.",
    icon: DollarSign,
  },
];

const referralTypes = [
  {
    type: "Seller Referral",
    fee: "R2,500 – R5,000+",
    description: "Refer someone who wants to sell their property. Fee paid on successful registration and sale.",
    icon: TrendingUp,
    color: "bg-blue-50 border-blue-200",
    iconColor: "text-blue-600",
  },
  {
    type: "Buyer Referral",
    fee: "R1,500 – R3,000+",
    description: "Know someone actively looking to buy? Connect them with YoungProp and earn when they find their property.",
    icon: Home,
    color: "bg-green-50 border-green-200",
    iconColor: "text-green-600",
  },
  {
    type: "Valuation Referral",
    fee: "R500 – R1,000",
    description: "Refer a homeowner who wants to know what their property is worth. Earn on every completed valuation.",
    icon: Star,
    color: "bg-amber-50 border-amber-200",
    iconColor: "text-amber-600",
  },
];

const faqs = [
  {
    q: "Who can refer clients to YoungProp?",
    a: "Anyone! You don't need to be a registered estate agent to refer clients. Friends, family, colleagues, neighbours — if you know someone with a property need, you can earn from it.",
  },
  {
    q: "When do I get paid?",
    a: "Referral fees are paid out within 7 business days of a successful deal conclusion (transfer or lease commencement). We'll keep you updated throughout the process.",
  },
  {
    q: "Is there a limit to how many referrals I can make?",
    a: "No limit at all. Refer as many people as you like. The more successful referrals you make, the more you earn.",
  },
  {
    q: "What if my referral doesn't buy or sell immediately?",
    a: "We keep your referral on record. If they transact with YoungProp within 12 months of your referral, you still earn your fee.",
  },
  {
    q: "Do I need to sign anything?",
    a: "For larger referral fees, we'll send a simple referral agreement to protect both parties. For standard referrals, the form submission is sufficient.",
  },
];

export default function Referrals() {
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const { register, handleSubmit, setValue, formState: { errors } } = useForm<ReferralForm>({
    resolver: zodResolver(referralSchema),
  });

  const onSubmit = async (data: ReferralForm) => {
    setSubmitting(true);
    try {
      const { error } = await supabase.from("referrals").insert([{
        referrer_name: data.referrer_name,
        referrer_email: data.referrer_email,
        referrer_phone: data.referrer_phone,
        client_name: data.client_name,
        client_phone: data.client_phone,
        client_email: data.client_email || null,
        referral_type: data.referral_type,
        property_interest: data.property_interest || null,
        additional_notes: data.additional_notes || null,
        status: "new",
        created_at: new Date().toISOString(),
      }]);

      if (error) throw error;
      setSubmitted(true);
      toast.success("Referral submitted! We'll contact your client within 24 hours.");
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
        </div>
        <div className="container relative z-10 text-center max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2 bg-gold/20 text-gold border border-gold/30 rounded-full px-4 py-1.5 text-sm font-medium mb-6">
            <Gift size={14} />
            Earn Money by Referring Clients
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-white font-display mb-6 leading-tight">
            Know Someone Who Needs <span className="text-gold">Property Help?</span>
          </h1>
          <p className="text-white/70 text-lg leading-relaxed mb-8">
            YoungProp's Referral Programme rewards you for connecting people with our services.
            Refer a buyer, seller, or anyone needing a valuation — and earn a fee when we close the deal.
            No estate agent licence required.
          </p>
          <div className="flex flex-wrap gap-4 justify-center">
            <a href="#refer" className="btn-primary">Make a Referral</a>
            <a href="https://wa.me/27737124178?text=Hi%2C%20I%27d%20like%20to%20refer%20a%20client%20to%20YoungProp" target="_blank" rel="noopener noreferrer" className="btn-outline">
              WhatsApp Us Instead
            </a>
          </div>
        </div>
      </section>

      {/* Referral Types / Fees */}
      <section className="py-20 bg-white">
        <div className="container">
          <div className="text-center max-w-2xl mx-auto mb-14">
            <h2 className="text-3xl md:text-4xl font-bold text-navy font-display mb-4">
              What Can You <span className="text-gold">Earn?</span>
            </h2>
            <p className="text-navy/60 text-lg">
              Referral fees vary depending on the type of deal and the property value. Here's a guide to what you can expect.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {referralTypes.map((rt) => (
              <div key={rt.type} className={`p-8 rounded-2xl border-2 ${rt.color} transition-all hover:shadow-lg`}>
                <div className="w-12 h-12 rounded-xl bg-white flex items-center justify-center mb-4 shadow-sm">
                  <rt.icon size={22} className={rt.iconColor} />
                </div>
                <div className="text-2xl font-bold text-navy font-display mb-1">{rt.fee}</div>
                <div className="text-sm font-semibold text-navy/50 uppercase tracking-wide mb-3">{rt.type}</div>
                <p className="text-navy/70 text-sm leading-relaxed">{rt.description}</p>
              </div>
            ))}
          </div>
          <p className="text-center text-navy/40 text-sm mt-8">
            * Fees are indicative and may vary based on property value and deal type. Final amounts confirmed upon successful conclusion.
          </p>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20 bg-navy/5">
        <div className="container">
          <div className="text-center max-w-2xl mx-auto mb-14">
            <h2 className="text-3xl md:text-4xl font-bold text-navy font-display mb-4">
              How It <span className="text-gold">Works</span>
            </h2>
            <p className="text-navy/60 text-lg">Four simple steps from referral to payment.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 max-w-5xl mx-auto">
            {howItWorks.map((step, i) => (
              <div key={step.step} className="relative text-center">
                <div className="w-16 h-16 rounded-full bg-navy text-white font-bold text-xl flex items-center justify-center mx-auto mb-4 font-display">
                  {step.step}
                </div>
                {i < howItWorks.length - 1 && (
                  <div className="hidden md:flex absolute top-8 left-[calc(50%+2rem)] w-[calc(100%-4rem)] items-center justify-center">
                    <div className="w-full h-0.5 bg-gold/30" />
                    <ArrowRight size={14} className="text-gold absolute right-0" />
                  </div>
                )}
                <div className="w-10 h-10 rounded-xl bg-gold/10 flex items-center justify-center mx-auto mb-3">
                  <step.icon size={18} className="text-gold" />
                </div>
                <h3 className="font-bold text-navy mb-2">{step.title}</h3>
                <p className="text-navy/60 text-sm leading-relaxed">{step.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Referral Form */}
      <section id="refer" className="py-20 bg-white">
        <div className="container max-w-3xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-navy font-display mb-4">
              Submit a <span className="text-gold">Referral</span>
            </h2>
            <p className="text-navy/60 text-lg">
              Fill in your details and your client's details below. We'll take it from there.
            </p>
          </div>

          {submitted ? (
            <div className="bg-white rounded-3xl p-12 text-center shadow-xl border border-gold/20">
              <div className="w-20 h-20 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-6">
                <CheckCircle2 size={40} className="text-green-600" />
              </div>
              <h3 className="text-2xl font-bold text-navy mb-3">Referral Submitted!</h3>
              <p className="text-navy/60 mb-6">
                Thank you for your referral. We'll contact your client within 24 hours and keep you updated
                on the progress. Your referral fee will be paid out upon successful deal conclusion.
              </p>
              <a
                href="https://wa.me/27737124178?text=Hi%2C%20I%20just%20submitted%20a%20referral%20on%20your%20website"
                target="_blank"
                rel="noopener noreferrer"
                className="btn-primary inline-flex"
              >
                Follow Up on WhatsApp
              </a>
            </div>
          ) : (
            <form onSubmit={handleSubmit(onSubmit)} className="bg-white rounded-3xl p-8 md:p-12 shadow-xl border border-navy/10 space-y-8">
              {/* Your Details */}
              <div>
                <h3 className="font-bold text-navy text-lg mb-4 flex items-center gap-2">
                  <span className="w-7 h-7 rounded-full bg-gold text-navy text-sm font-bold flex items-center justify-center">1</span>
                  Your Details (Referrer)
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div>
                    <Label htmlFor="referrer_name" className="text-navy font-medium">Your Full Name *</Label>
                    <Input {...register("referrer_name")} id="referrer_name" placeholder="Your name" className="mt-1.5" />
                    {errors.referrer_name && <p className="text-red-500 text-xs mt-1">{errors.referrer_name.message}</p>}
                  </div>
                  <div>
                    <Label htmlFor="referrer_email" className="text-navy font-medium">Your Email *</Label>
                    <Input {...register("referrer_email")} id="referrer_email" type="email" placeholder="your@email.com" className="mt-1.5" />
                    {errors.referrer_email && <p className="text-red-500 text-xs mt-1">{errors.referrer_email.message}</p>}
                  </div>
                  <div>
                    <Label htmlFor="referrer_phone" className="text-navy font-medium">Your Phone Number *</Label>
                    <Input {...register("referrer_phone")} id="referrer_phone" placeholder="073 712 4178" className="mt-1.5" />
                    {errors.referrer_phone && <p className="text-red-500 text-xs mt-1">{errors.referrer_phone.message}</p>}
                  </div>
                </div>
              </div>

              {/* Client Details */}
              <div>
                <h3 className="font-bold text-navy text-lg mb-4 flex items-center gap-2">
                  <span className="w-7 h-7 rounded-full bg-gold text-navy text-sm font-bold flex items-center justify-center">2</span>
                  Client Details (Who You're Referring)
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div>
                    <Label htmlFor="client_name" className="text-navy font-medium">Client Full Name *</Label>
                    <Input {...register("client_name")} id="client_name" placeholder="Client's name" className="mt-1.5" />
                    {errors.client_name && <p className="text-red-500 text-xs mt-1">{errors.client_name.message}</p>}
                  </div>
                  <div>
                    <Label htmlFor="client_phone" className="text-navy font-medium">Client Phone Number *</Label>
                    <Input {...register("client_phone")} id="client_phone" placeholder="Client's phone" className="mt-1.5" />
                    {errors.client_phone && <p className="text-red-500 text-xs mt-1">{errors.client_phone.message}</p>}
                  </div>
                  <div>
                    <Label htmlFor="client_email" className="text-navy font-medium">Client Email (optional)</Label>
                    <Input {...register("client_email")} id="client_email" type="email" placeholder="client@email.com" className="mt-1.5" />
                  </div>
                  <div>
                    <Label className="text-navy font-medium">Referral Type *</Label>
                    <Select onValueChange={(v) => setValue("referral_type", v)}>
                      <SelectTrigger className="mt-1.5">
                        <SelectValue placeholder="What does the client need?" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="buyer">Buyer — looking to purchase property</SelectItem>
                        <SelectItem value="seller">Seller — wants to sell their property</SelectItem>
                        <SelectItem value="valuation">Valuation — wants to know property value</SelectItem>
                        <SelectItem value="rental">Rental — looking to rent a property</SelectItem>
                        <SelectItem value="landlord">Landlord — wants to rent out their property</SelectItem>
                      </SelectContent>
                    </Select>
                    {errors.referral_type && <p className="text-red-500 text-xs mt-1">{errors.referral_type.message}</p>}
                  </div>
                </div>
              </div>

              {/* Additional Info */}
              <div>
                <Label htmlFor="additional_notes" className="text-navy font-medium">Additional Notes (optional)</Label>
                <Textarea
                  {...register("additional_notes")}
                  id="additional_notes"
                  placeholder="Any additional context about the client's needs, preferred areas, budget, timeline, etc."
                  rows={4}
                  className="mt-1.5 resize-none"
                />
              </div>

              <Button type="submit" disabled={submitting} className="w-full btn-primary h-12 text-base">
                {submitting ? "Submitting Referral..." : "Submit Referral"}
                {!submitting && <ChevronRight size={18} className="ml-2" />}
              </Button>

              <p className="text-center text-navy/40 text-xs">
                By submitting this form, you confirm that you have the client's permission to share their contact details with YoungProp Estate Agency.
              </p>
            </form>
          )}
        </div>
      </section>

      {/* FAQ */}
      <section className="py-20 bg-navy/5">
        <div className="container max-w-3xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-navy font-display mb-4">
              Frequently Asked <span className="text-gold">Questions</span>
            </h2>
          </div>
          <div className="space-y-4">
            {faqs.map((faq) => (
              <div key={faq.q} className="bg-white rounded-2xl p-6 border border-navy/10">
                <div className="flex items-start gap-3">
                  <Shield size={18} className="text-gold mt-0.5 shrink-0" />
                  <div>
                    <h3 className="font-bold text-navy mb-2">{faq.q}</h3>
                    <p className="text-navy/60 text-sm leading-relaxed">{faq.a}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <Footer />
      <WhatsAppButton />
    </div>
  );
}
