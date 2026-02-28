import HeroSection from "@/components/hero-section";
import Features from "@/components/features-3";
import Agenda from "@/components/agenda";
import CallToAction from "@/components/call-to-action";
import { HeroHeader } from "@/components/header";
import FooterSection from "@/components/footer";
import Dither from "@/components/Dither";

export default function Home() {
    return (
        <div className="dark font-sans antialiased text-white bg-black min-h-screen relative overflow-hidden">
            <div className='absolute w-full h-dvh max-h-[155vh] sm:max-h-[115vh] md:max-h-[125vh] lg:max-h-[190vh] xl:max-h-[195vh] pointer-events-none'>
                <Dither
                    waveColor={[0.30980392156862746, 0.30980392156862746, 0.30980392156862746]}
                    disableAnimation={false}
                    enableMouseInteraction
                    mouseRadius={0.3}
                    colorNum={4}
                    pixelSize={2}
                    waveAmplitude={0.3}
                    waveFrequency={3}
                    waveSpeed={0.05}
                />
            </div>

            <HeroHeader />
            <div className="relative z-10 w-full overflow-hidden">
                <HeroSection />
                <Features />
                <Agenda />
                <CallToAction />
            </div>
            <FooterSection />
        </div>
    );
}
