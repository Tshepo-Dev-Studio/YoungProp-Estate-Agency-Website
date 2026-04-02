import { Link } from 'wouter';
import { Users, Gift, ArrowRight } from 'lucide-react';

export default function JoinUsAndReferralsBanner() {
  return (
    <section className="py-16 bg-navy relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-0 left-1/4 w-64 h-64 bg-gold rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-1/4 w-64 h-64 bg-gold rounded-full blur-3xl" />
      </div>

      <div className="container relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
          {/* Join Our Team */}
          <div className="group bg-white/5 border border-white/10 hover:border-gold/40 rounded-2xl p-8 transition-all duration-300 hover:bg-white/10">
            <div className="w-12 h-12 rounded-xl bg-gold/20 flex items-center justify-center mb-5">
              <Users size={22} className="text-gold" />
            </div>
            <h3 className="text-xl font-bold text-white font-display mb-3">
              Are You a Property Professional?
            </h3>
            <p className="text-white/60 text-sm leading-relaxed mb-6">
              YoungProp is growing and we're looking for driven agents to join our team.
              Whether you're experienced or just starting out, we have a place for you.
              Earn competitive commissions, access exclusive listings, and grow with us.
            </p>
            <Link
              href="/join-us"
              className="inline-flex items-center gap-2 text-gold font-semibold text-sm hover:gap-3 transition-all"
            >
              Join Our Team
              <ArrowRight size={16} />
            </Link>
          </div>

          {/* Referral Programme */}
          <div className="group bg-white/5 border border-white/10 hover:border-gold/40 rounded-2xl p-8 transition-all duration-300 hover:bg-white/10">
            <div className="w-12 h-12 rounded-xl bg-gold/20 flex items-center justify-center mb-5">
              <Gift size={22} className="text-gold" />
            </div>
            <h3 className="text-xl font-bold text-white font-display mb-3">
              Know Someone Who Needs Property Help?
            </h3>
            <p className="text-white/60 text-sm leading-relaxed mb-6">
              Refer a buyer, seller, or anyone needing a valuation to YoungProp and earn a
              referral fee when we close the deal. No estate agent licence required.
              Simple, transparent, and rewarding.
            </p>
            <Link
              href="/referrals"
              className="inline-flex items-center gap-2 text-gold font-semibold text-sm hover:gap-3 transition-all"
            >
              Learn About Referrals
              <ArrowRight size={16} />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
