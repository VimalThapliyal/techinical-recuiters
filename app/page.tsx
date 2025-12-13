"use client";

import { useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  Search,
  Globe,
  Users,
  Target,
  Zap,
  CheckCircle2,
  ArrowRight,
  Sparkles,
  TrendingUp,
  Rocket,
} from "lucide-react";
import { COUNTRY_INFO } from "@/lib/subdomain";
import { AnimatedBackground } from "@/components/AnimatedBackground";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

export default function LandingPage() {
  const router = useRouter();
  const heroRef = useRef<HTMLDivElement>(null);
  const featuresRef = useRef<HTMLDivElement>(null);
  const statsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Hero animations
    if (heroRef.current) {
      gsap.from(heroRef.current.children, {
        y: 50,
        opacity: 0,
        duration: 1,
        stagger: 0.2,
        ease: "power3.out",
      });
    }

    // Features animation
    if (featuresRef.current) {
      gsap.from(featuresRef.current.children, {
        scrollTrigger: {
          trigger: featuresRef.current,
          start: "top 80%",
        },
        y: 60,
        opacity: 0,
        duration: 0.8,
        stagger: 0.15,
        ease: "power3.out",
      });
    }

    // Stats animation
    if (statsRef.current) {
      gsap.from(statsRef.current.children, {
        scrollTrigger: {
          trigger: statsRef.current,
          start: "top 80%",
        },
        scale: 0.8,
        opacity: 0,
        duration: 0.6,
        stagger: 0.1,
        ease: "back.out(1.7)",
      });
    }
  }, []);

  const features = [
    {
      icon: Search,
      title: "Find Recruiters Fast",
      description:
        "Search through hundreds of technical recruiters by country, specialization, and company.",
      color: "from-blue-500 to-cyan-500",
    },
    {
      icon: Target,
      title: "Perfect Matches",
      description:
        "Our smart matching algorithm connects you with recruiters who specialize in your skills.",
      color: "from-purple-500 to-pink-500",
    },
    {
      icon: Globe,
      title: "Global Reach",
      description:
        "Access recruiters from United States, UK, Canada, Australia, and India.",
      color: "from-green-500 to-emerald-500",
    },
    {
      icon: Zap,
      title: "Zero Cost",
      description:
        "Completely free to use. No subscriptions, no hidden fees, just direct access to recruiters.",
      color: "from-yellow-500 to-orange-500",
    },
    {
      icon: Users,
      title: "Verified Profiles",
      description:
        "All recruiters have verified LinkedIn profiles with real experience and specializations.",
      color: "from-indigo-500 to-blue-500",
    },
    {
      icon: TrendingUp,
      title: "Stay Updated",
      description:
        "Regular updates with new recruiters and the latest opportunities in tech recruitment.",
      color: "from-red-500 to-rose-500",
    },
  ];

  const benefits = [
    "Save hours searching for the right recruiter",
    "Connect directly with specialized technical recruiters",
    "Find recruiters in your country or region",
    "Get personalized recommendations based on your profile",
    "Access verified LinkedIn profiles instantly",
    "No sign-up required, start browsing immediately",
  ];

  const stats = [
    { label: "Countries", value: "5" },
    { label: "Recruiters", value: "500+" },
    { label: "Companies", value: "200+" },
    { label: "Specializations", value: "50+" },
  ];

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white overflow-hidden">
      <AnimatedBackground />

      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center px-4 sm:px-6 lg:px-8 py-20">
        <div className="max-w-7xl mx-auto w-full">
          <div ref={heroRef} className="text-center space-y-8">
            <div className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-white/10 backdrop-blur-xl border border-white/20 mb-8 shadow-2xl">
              <Sparkles className="h-5 w-5 text-[#00d4ff]" />
              <span className="text-sm font-semibold text-white">
                Free Technical Recruiter Directory
              </span>
            </div>

            <h1 className="text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-bold leading-[1.1] mb-6 md:mb-8">
              <span className="bg-gradient-to-r from-white via-[#e7f3f8] to-white bg-clip-text text-transparent">
                Find the Right
              </span>
              <br />
              <span className="bg-gradient-to-r from-[#0077b5] via-[#00d4ff] to-[#0077b5] bg-clip-text text-transparent animate-gradient">
                Technical Recruiter
              </span>
              <br />
              <span className="bg-gradient-to-r from-white via-[#e7f3f8] to-white bg-clip-text text-transparent">
                for Your Career
              </span>
            </h1>

            <p className="text-lg md:text-xl lg:text-2xl text-white/80 max-w-3xl mx-auto leading-relaxed mb-8 md:mb-10 px-4">
              Stop wasting time searching LinkedIn. Connect directly with
              specialized technical recruiters who understand your skills and
              can help advance your career.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 md:gap-6 pt-4 md:pt-8">
              <Button
                size="lg"
                onClick={() => router.push("/us")}
                className="group relative bg-gradient-to-r from-[#0077b5] to-[#00d4ff] text-white text-lg px-10 py-7 h-auto font-semibold shadow-2xl hover:shadow-[#0077b5]/50 transition-all duration-300 hover:scale-105 border-0"
              >
                <span className="relative z-10 flex items-center">
                  Browse Recruiters
                  <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                </span>
                <div className="absolute inset-0 bg-gradient-to-r from-[#00d4ff] to-[#0077b5] opacity-0 group-hover:opacity-100 transition-opacity rounded-lg" />
              </Button>
              <Button
                size="lg"
                variant="outline"
                onClick={() => router.push("/profile")}
                className="!border-2 !border-white/30 !text-white hover:!bg-white/20 bg-white/10 backdrop-blur-xl text-base md:text-lg px-8 md:px-10 py-6 md:py-7 h-auto font-semibold transition-all duration-300 hover:scale-105 w-full sm:w-auto"
              >
                <Sparkles className="mr-2 h-5 w-5" />
                Create Your Profile
              </Button>
            </div>

            {/* Stats */}
            <div
              ref={statsRef}
              className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-8 max-w-4xl mx-auto pt-12 md:pt-16"
            >
              {stats.map((stat, idx) => (
                <div
                  key={idx}
                  className="group relative p-4 md:p-6 rounded-xl md:rounded-2xl bg-white/5 backdrop-blur-xl border border-white/10 hover:border-[#0077b5]/50 transition-all duration-300 hover:scale-105"
                >
                  <div className="absolute inset-0 bg-gradient-to-br from-[#0077b5]/20 to-transparent rounded-xl md:rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity" />
                  <div className="relative">
                    <div className="text-4xl md:text-5xl lg:text-6xl font-bold bg-gradient-to-r from-[#0077b5] to-[#00d4ff] bg-clip-text text-transparent mb-2">
                      {stat.value}
                    </div>
                    <div className="text-xs md:text-sm text-white/70 font-medium">
                      {stat.label}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-10 left-1/2 transform -translate-x-1/2 animate-bounce">
          <div className="w-6 h-10 border-2 border-white/30 rounded-full flex justify-center">
            <div className="w-1.5 h-3 bg-white/50 rounded-full mt-2" />
          </div>
        </div>
      </section>

      {/* Problem/Solution Section */}
      <section className="relative py-20 md:py-32 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12 md:mb-20">
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-4 md:mb-6">
              <span className="bg-gradient-to-r from-white to-[#e7f3f8] bg-clip-text text-transparent">
                The Problem We Solve
              </span>
            </h2>
            <p className="text-lg md:text-xl text-white/70 max-w-2xl mx-auto leading-relaxed">
              Finding the right technical recruiter shouldn&apos;t be this hard
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-6 md:gap-8 max-w-6xl mx-auto">
            <Card className="group relative overflow-hidden bg-gradient-to-br from-red-500/10 to-red-900/10 backdrop-blur-xl border-2 border-red-500/30 p-6 md:p-8 hover:border-red-500/50 transition-all duration-300">
              <div className="absolute inset-0 bg-gradient-to-br from-red-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
              <div className="relative">
                <div className="flex items-start gap-3 md:gap-4 mb-5 md:mb-6">
                  <div className="w-12 h-12 md:w-16 md:h-16 rounded-xl md:rounded-2xl bg-red-500/20 flex items-center justify-center flex-shrink-0 backdrop-blur-xl">
                    <span className="text-2xl md:text-3xl">😫</span>
                  </div>
                  <h3 className="text-2xl md:text-3xl font-bold text-white">
                    The Old Way
                  </h3>
                </div>
                <ul className="space-y-3 md:space-y-4 text-white/80">
                  {[
                    "Hours spent searching LinkedIn for recruiters",
                    "No way to filter by specialization or skills",
                    "Can't tell which recruiters match your profile",
                    "No country-wise organization",
                  ].map((item, idx) => (
                    <li key={idx} className="flex items-start gap-3">
                      <span className="text-red-400 mt-1 text-lg md:text-xl flex-shrink-0">
                        ×
                      </span>
                      <span className="text-base md:text-lg leading-relaxed">
                        {item}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            </Card>

            <Card className="group relative overflow-hidden bg-gradient-to-br from-[#0077b5]/20 to-[#00d4ff]/10 backdrop-blur-xl border-2 border-[#0077b5]/50 p-6 md:p-8 hover:border-[#00d4ff]/50 transition-all duration-300 hover:scale-105">
              <div className="absolute inset-0 bg-gradient-to-br from-[#0077b5]/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
              <div className="relative">
                <div className="flex items-start gap-3 md:gap-4 mb-5 md:mb-6">
                  <div className="w-12 h-12 md:w-16 md:h-16 rounded-xl md:rounded-2xl bg-[#0077b5]/30 flex items-center justify-center flex-shrink-0 backdrop-blur-xl">
                    <CheckCircle2 className="h-6 w-6 md:h-8 md:w-8 text-[#00d4ff]" />
                  </div>
                  <h3 className="text-2xl md:text-3xl font-bold text-white">
                    The New Way
                  </h3>
                </div>
                <ul className="space-y-3 md:space-y-4 text-white/80">
                  {[
                    "Browse organized directory by country instantly",
                    "Filter by specialization, company, and experience",
                    "Get personalized match scores for each recruiter",
                    "Direct links to verified LinkedIn profiles",
                  ].map((item, idx) => (
                    <li key={idx} className="flex items-start gap-3">
                      <span className="text-[#00d4ff] mt-1 text-lg md:text-xl flex-shrink-0">
                        ✓
                      </span>
                      <span className="text-base md:text-lg leading-relaxed">
                        {item}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            </Card>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="relative py-20 md:py-32 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12 md:mb-20">
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-4 md:mb-6">
              <span className="bg-gradient-to-r from-white to-[#e7f3f8] bg-clip-text text-transparent">
                Everything You Need
              </span>
            </h2>
            <p className="text-lg md:text-xl text-white/70 max-w-2xl mx-auto leading-relaxed">
              Powerful features to help you find and connect with the perfect
              recruiter
            </p>
          </div>

          <div
            ref={featuresRef}
            className="grid md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6"
          >
            {features.map((feature, idx) => {
              const Icon = feature.icon;
              return (
                <Card
                  key={idx}
                  className="group relative overflow-hidden !bg-white/10 backdrop-blur-xl !border-white/20 border p-6 md:p-8 hover:!border-[#0077b5]/50 hover:!bg-white/15 transition-all duration-500 hover:scale-105"
                >
                  <div className="absolute inset-0 bg-gradient-to-br from-[#0077b5]/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                  <div className="relative z-10">
                    <div
                      className={`w-12 h-12 md:w-16 md:h-16 rounded-xl md:rounded-2xl bg-gradient-to-br ${feature.color} flex items-center justify-center mb-4 md:mb-6 shadow-lg group-hover:scale-110 transition-transform duration-300`}
                    >
                      <Icon className="h-6 w-6 md:h-8 md:w-8 text-white" />
                    </div>
                    <h3 className="text-xl md:text-2xl font-bold text-white mb-2 md:mb-3">
                      {feature.title}
                    </h3>
                    <p className="text-sm md:text-base text-white/80 leading-relaxed">
                      {feature.description}
                    </p>
                  </div>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="relative py-20 md:py-32 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12 md:mb-20">
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-4 md:mb-6">
              <span className="bg-gradient-to-r from-white to-[#e7f3f8] bg-clip-text text-transparent">
                Why Choose Us?
              </span>
            </h2>
            <p className="text-lg md:text-xl text-white/70 leading-relaxed">
              Join thousands of job seekers finding their perfect recruiter
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-3 md:gap-4">
            {benefits.map((benefit, idx) => (
              <div
                key={idx}
                className="group flex items-start gap-3 md:gap-4 p-4 md:p-6 rounded-lg md:rounded-xl bg-white/5 backdrop-blur-xl border border-white/10 hover:border-[#0077b5]/50 transition-all duration-300 hover:scale-105"
              >
                <div className="w-8 h-8 md:w-10 md:h-10 rounded-lg bg-gradient-to-br from-[#0077b5] to-[#00d4ff] flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform">
                  <CheckCircle2 className="h-5 w-5 md:h-6 md:w-6 text-white" />
                </div>
                <span className="text-base md:text-lg text-white font-medium pt-0.5 md:pt-1 leading-relaxed">
                  {benefit}
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Country Selection */}
      <section className="relative py-20 md:py-32 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12 md:mb-20">
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-4 md:mb-6">
              <span className="bg-gradient-to-r from-white to-[#e7f3f8] bg-clip-text text-transparent">
                Browse by Country
              </span>
            </h2>
            <p className="text-lg md:text-xl text-white/70 leading-relaxed">
              Select your country to see available recruiters
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 md:gap-6">
            {Object.values(COUNTRY_INFO).map((country) => (
              <a
                key={country.code}
                href={`/${country.code}`}
                className="group relative"
              >
                <Card className="relative overflow-hidden bg-white/5 backdrop-blur-xl border-2 border-white/10 p-6 md:p-8 hover:border-[#0077b5]/50 transition-all duration-500 hover:scale-105 cursor-pointer">
                  <div className="absolute inset-0 bg-gradient-to-br from-[#0077b5]/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                  <div className="relative text-center">
                    <div className="text-5xl md:text-6xl mb-3 md:mb-4 transform group-hover:scale-125 transition-transform duration-300">
                      {country.flag}
                    </div>
                    <h3 className="text-lg md:text-xl font-bold text-white mb-2">
                      {country.name}
                    </h3>
                    <div className="flex items-center justify-center gap-2 text-xs md:text-sm text-white/70 group-hover:text-[#00d4ff] transition-colors">
                      <span>Browse</span>
                      <ArrowRight className="h-3 w-3 md:h-4 md:w-4 group-hover:translate-x-1 transition-transform" />
                    </div>
                  </div>
                </Card>
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative py-24 md:py-32 px-4 sm:px-6 lg:px-8">
        <div className="max-w-5xl mx-auto">
          <Card className="relative overflow-hidden bg-gradient-to-br from-[#0077b5] via-[#004182] to-[#001f3f] border-0 p-8 md:p-16 text-center">
            <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-10" />
            <div className="relative z-10 space-y-8">
              <div>
                <Rocket className="h-12 w-12 md:h-16 md:w-16 text-white mx-auto mb-6 animate-bounce" />
                <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-4 md:mb-6 text-white leading-tight">
                  Ready to Find Your Perfect Recruiter?
                </h2>
                <p className="text-lg md:text-xl text-white/90 mb-8 md:mb-10 max-w-2xl mx-auto leading-relaxed px-4">
                  Start browsing our directory of verified technical recruiters
                  today. It&apos;s free, fast, and designed to help you succeed.
                </p>
              </div>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4 md:gap-6">
                <Button
                  size="lg"
                  onClick={() => router.push("/us")}
                  className="bg-white text-[#0077b5] hover:bg-[#e7f3f8] text-base md:text-lg px-8 md:px-10 py-6 md:py-7 h-auto font-semibold shadow-2xl hover:scale-105 transition-transform w-full sm:w-auto"
                >
                  Get Started Now
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  onClick={() => router.push("/profile")}
                  className="!border-2 !border-white !text-white hover:!bg-white/10 text-base md:text-lg px-8 md:px-10 py-6 md:py-7 h-auto font-semibold backdrop-blur-xl w-full sm:w-auto bg-transparent"
                >
                  <Sparkles className="mr-2 h-5 w-5" />
                  Create Your Profile
                </Button>
              </div>
            </div>
          </Card>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative border-t border-white/10 bg-black/50 backdrop-blur-xl py-12">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-6xl mx-auto">
            <div className="grid md:grid-cols-3 gap-8 mb-8">
              <div>
                <div className="flex items-center gap-2 mb-4">
                  <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-[#0077b5] to-[#00d4ff] flex items-center justify-center">
                    <Globe className="h-6 w-6 text-white" />
                  </div>
                  <span className="text-xl font-bold text-white">
                    Recruiter Directory
                  </span>
                </div>
                <p className="text-sm text-white/60">
                  Your free gateway to finding the perfect technical recruiter
                  for your career.
                </p>
              </div>
              <div>
                <h4 className="font-semibold text-white mb-4">Quick Links</h4>
                <ul className="space-y-2 text-sm text-white/60">
                  <li>
                    <Link
                      href="/us"
                      className="hover:text-white transition-colors"
                    >
                      Browse Recruiters
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="/profile"
                      className="hover:text-white transition-colors"
                    >
                      Create Profile
                    </Link>
                  </li>
                </ul>
              </div>
              <div>
                <h4 className="font-semibold text-white mb-4">Countries</h4>
                <ul className="space-y-2 text-sm text-white/60">
                  {Object.values(COUNTRY_INFO).map((country) => (
                    <li key={country.code}>
                      <a
                        href={`/${country.code}`}
                        className="hover:text-white transition-colors"
                      >
                        {country.flag} {country.name}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
            <div className="border-t border-white/10 pt-8 text-center space-y-2">
              <p className="text-sm text-white/60">
                © {new Date().getFullYear()} Recruiter Directory. All rights
                reserved.
              </p>
              <p className="text-sm text-white/60">
                Designed and concept by{" "}
                <a
                  href="https://www.linkedin.com/in/vimal-thapliyal/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[#00d4ff] hover:text-[#0077b5] font-semibold transition-colors underline decoration-[#0077b5]/50 hover:decoration-[#00d4ff]"
                >
                  Vimal Thapliyal
                </a>
              </p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
