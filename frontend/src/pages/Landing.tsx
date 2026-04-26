import {
  Header,
  Hero,
  LogoMarquee,
  HowItWorks,
  Why,
  Pricing,
  Testimonials,
  FAQ,
  FinalCta,
  Footer,
} from "@/components/landing";

export default function Landing() {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main>
        <Hero />
        <LogoMarquee />
        <HowItWorks />
        <Why />
        <Pricing />
        <Testimonials />
        <FAQ />
        <FinalCta />
      </main>
      <Footer />
    </div>
  );
}
