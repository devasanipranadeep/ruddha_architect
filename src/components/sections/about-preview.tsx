import { Link } from "@tanstack/react-router";
import { Reveal, SectionLabel } from "@/components/animations/reveal";
import { IMAGES } from "@/data/site";

export function AboutPreview() {
  return (
    <section className="relative py-32 lg:py-44">
      <div className="mx-auto grid max-w-[1400px] gap-16 px-6 lg:grid-cols-12 lg:gap-24 lg:px-12">
        <Reveal className="lg:col-span-5 flex items-center">
          <div className="relative image-zoom w-full">
            <img
              src={IMAGES.about}
              alt="Inside the Ruddha studio"
              loading="lazy"
              width={1280}
              height={1600}
              className="w-full h-[480px] object-cover"
            />
          </div>
        </Reveal>

        <div className="lg:col-span-7 flex flex-col justify-center">
          <Reveal><SectionLabel>Who Are We</SectionLabel></Reveal>
          <Reveal delay={100}>
            <h2 className="mt-6 font-display text-5xl lg:text-7xl leading-[1.05]">
              <span className="italic text-gradient-gold">Ar. Sathkruth Gone</span>
            </h2>
          </Reveal>
          <Reveal delay={200}>
            <p className="mt-8 max-w-xl text-foreground/70 leading-relaxed">
              A passionate architect and designer based in Kashibugga, Warangal, Telangana. With a B.Arch from Chandigarh University and professional experience across Chandigarh and Hyderabad, Ruddha Architects & Interiors brings a refined design sensibility combined with cutting-edge AI visualization to every project.
            </p>
          </Reveal>
          <Reveal delay={300}>
            <p className="mt-4 max-w-xl text-foreground/70 leading-relaxed">
              We specialize in translating your vision into built reality — from residential bungalows and luxury interiors to commercial spaces — with meticulous attention to detail, material quality, and spatial experience.
            </p>
          </Reveal>
          <Reveal delay={400}>
            <div className="mt-8 grid grid-cols-2 gap-4">
              <div className="border border-border p-4">
                <div className="text-[10px] uppercase tracking-luxury text-gold">Qualification</div>
                <div className="mt-1 text-sm font-medium">B.Arch, Chandigarh University</div>
              </div>
              <div className="border border-border p-4">
                <div className="text-[10px] uppercase tracking-luxury text-gold">Location</div>
                <div className="mt-1 text-sm font-medium">Kashibugga, Warangal, Telangana</div>
              </div>
              <div className="border border-border p-4">
                <div className="text-[10px] uppercase tracking-luxury text-gold">Specialization</div>
                <div className="mt-1 text-sm font-medium">Architecture + Interiors</div>
              </div>
              <div className="border border-border p-4">
                <div className="text-[10px] uppercase tracking-luxury text-gold">Technology</div>
                <div className="mt-1 text-sm font-medium">AI-Integrated Design</div>
              </div>
            </div>
          </Reveal>
          <Reveal delay={500}>
            <Link
              to="/contact"
              className="mt-10 inline-flex items-center gap-3 text-[11px] uppercase tracking-wider-2 text-gold group"
            >
              Get in touch
              <span className="h-px w-10 bg-gold transition-all duration-500 group-hover:w-20" />
            </Link>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
