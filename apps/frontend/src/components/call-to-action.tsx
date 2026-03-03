import {Button} from '@/components/ui/button'
import Link from 'next/link'
import {TextEffect} from "./motion-primitives/text-effect"
import {AnimatedGroup} from "@/components/motion-primitives/animated-group";
import {transitionVariants} from "@/lib/utils";

export default function CallToAction() {
    return (
        <section className="py-16 mx-2">
            <div className="mx-auto max-w-5xl rounded-3xl border px-6 py-12 md:py-20 lg:py-32">
                <div className="text-center">
                    <TextEffect
                        triggerOnView
                        preset="fade-in-blur"
                        speedSegment={0.3}
                        as="h2"
                        className="text-balance text-4xl font-semibold lg:text-5xl">
                        Don't miss a spot!
                    </TextEffect>
                    <TextEffect
                        triggerOnView
                        preset="fade-in-blur"
                        speedSegment={0.3}
                        delay={0.3}
                        as="p"
                        className="mt-4 text-muted-foreground">
                        We have limited availability, register now in the link below.
                    </TextEffect>
                    <AnimatedGroup
                        triggerOnView
                        variants={{
                            container: {
                                visible: {
                                    transition: {
                                        staggerChildren: 0.05,
                                        delayChildren: 0.75,
                                    },
                                },
                            },
                            item: {
                                hidden: {
                                    opacity: 0,
                                    filter: "blur(12px)",
                                    y: 12,
                                },
                                visible: {
                                    opacity: 1,
                                    filter: "blur(0px)",
                                    y: 0,
                                    transition: {
                                        type: "spring",
                                        bounce: 0.3,
                                        duration: 1.5,
                                    },
                                },
                            },
                        }}
                        className="divide-y divide-dashed sm:mx-auto sm:max-w-lg lg:mx-0"
                    >
                        <div className="pb-6">
                            <div className="font-medium space-x-2">
                                <span className='text-muted-foreground font-mono '>11:00</span>
                                <span>Welcome Video</span>
                            </div>
                            <p className="text-muted-foreground mt-4">A special welcome from the v0 Team</p>
                        </div>
                        <div className="py-6">
                            <div className="font-medium space-x-2">
                                <span className='text-muted-foreground font-mono '>11:30</span>
                                <span>Build Time!</span>
                            </div>
                            <p className="text-muted-foreground mt-4">Hands on to build your project with v0.</p>
                        </div>
                        <div className="py-6">
                            <div className="font-medium space-x-2">
                                <span className='text-muted-foreground font-mono '>13:00</span>
                                <span>Showcase Sprint</span>
                            </div>
                            <p className="text-muted-foreground mt-4">Show a quick presentation of what you built.</p>
                        </div>
                        <div className="py-6">
                            <div className="font-medium space-x-2">
                                <span className='text-muted-foreground font-mono '>13:30</span>
                                <span>Networking and Event Close</span>
                            </div>
                            <p className="text-muted-foreground mt-4">Take some time to interact with other and share
                                ideas.</p>
                        </div>
                    </AnimatedGroup>
                </div>
            </div>
        </section>
    )
}
