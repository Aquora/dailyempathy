"use client";

import Link from "next/link";
import ParticleWave from "./components/ParticleWave";
import { motion } from "motion/react";

export default function Home() {
  return (
    <div className="relative min-h-screen bg-[#0a0a0a] text-white">
      {/* Particle Wave Background */}
      <ParticleWave />

      {/* Sign In -- top right */}
      <header className="fixed top-0 right-0 z-20 p-8">
        <Link
          href="/auth/signin"
          className="font-mono text-sm tracking-widest text-gold transition-colors hover:text-gold-dim"
        >
          SIGN IN
        </Link>
      </header>

      {/* ===== HERO SECTION ===== */}
      <section className="relative z-10 flex min-h-screen flex-col items-center justify-center px-6 text-center">
        {/* Badge */}
        <div className="mb-8 flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-1.5 backdrop-blur-sm">
          <span className="inline-block h-2 w-2 rounded-full bg-gold" />
          <span className="font-mono text-xs tracking-widest text-white/70">
            BETA RELEASE
          </span>
        </div>

        {/* Heading */}
        <h1 className="max-w-3xl font-serif text-5xl leading-tight tracking-tight md:text-7xl md:leading-[1.1]">
          Unlock your
          <br />
          <em className="italic text-gold">daily</em> potential
        </h1>

        {/* Subtitle */}
        <p className="mt-6 max-w-lg font-mono text-sm leading-relaxed text-white/50 md:text-base">
          A calendar, tasks, and your personal motivational
          <br className="hidden md:block" /> companion — all in one place
        </p>

        {/* CTA Button */}
        <Link
          href="/auth/signin"
          className="mt-10 inline-block border border-gold px-8 py-3 font-mono text-sm tracking-widest text-gold transition-all hover:bg-gold hover:text-black"
          style={{
            clipPath:
              "polygon(12px 0%, 100% 0%, calc(100% - 12px) 100%, 0% 100%)",
          }}
        >
          [GET STARTED]
        </Link>

        {/* Scroll indicator */}
        <div className="absolute bottom-10 flex flex-col items-center gap-2">
          <span className="font-mono text-[10px] tracking-widest text-white/30">
            SCROLL
          </span>
          <motion.div
            animate={{ y: [0, 8, 0] }}
            transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
            className="h-6 w-px bg-white/20"
          />
        </div>
      </section>

      {/* ===== ABOUT SECTION ===== */}
      <section className="relative z-10 flex min-h-screen flex-col items-center justify-center px-6 py-24">
        {/* Section header */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          viewport={{ once: true, amount: 0.3 }}
          className="mb-20 text-center"
        >
          <span className="font-mono text-xs tracking-widest text-gold/60">
            WHAT WE DO
          </span>
          <h2 className="mt-4 font-serif text-4xl tracking-tight md:text-5xl">
            Everything you need,
            <br />
            <em className="italic text-white/70">in one place</em>
          </h2>
        </motion.div>

        {/* Feature cards */}
        <div className="grid max-w-5xl gap-8 md:grid-cols-3">
          {/* Calendar */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            className="rounded-xl border border-white/5 bg-white/2 p-8 backdrop-blur-sm transition-colors hover:border-gold/20"
          >
            <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-lg bg-gold/10 font-mono text-lg text-gold">
              01
            </div>
            <h3 className="mb-3 font-mono text-sm tracking-widest text-white/90">
              CALENDAR
            </h3>
            <p className="text-sm leading-relaxed text-white/40">
              See all your events and deadlines in a clean calendar view. Never
              miss an important date again.
            </p>
          </motion.div>

          {/* Todo List */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.15 }}
            viewport={{ once: true, amount: 0.3 }}
            className="rounded-xl border border-white/5 bg-white/2 p-8 backdrop-blur-sm transition-colors hover:border-gold/20"
          >
            <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-lg bg-gold/10 font-mono text-lg text-gold">
              02
            </div>
            <h3 className="mb-3 font-mono text-sm tracking-widest text-white/90">
              TODO LIST
            </h3>
            <p className="text-sm leading-relaxed text-white/40">
              Organize your tasks, prioritize what matters most, and track your
              progress every step of the way.
            </p>
          </motion.div>

          {/* Companion */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            viewport={{ once: true, amount: 0.3 }}
            className="rounded-xl border border-white/5 bg-white/2 p-8 backdrop-blur-sm transition-colors hover:border-gold/20"
          >
            <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-lg bg-gold/10 font-mono text-lg text-gold">
              03
            </div>
            <h3 className="mb-3 font-mono text-sm tracking-widest text-white/90">
              COMPANION
            </h3>
            <p className="text-sm leading-relaxed text-white/40">
              A motivational chatbot that keeps you on track, boosts your spirit,
              and helps you push through tough days.
            </p>
          </motion.div>
        </div>

        {/* Bottom tagline */}
        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 1, delay: 0.5 }}
          viewport={{ once: true }}
          className="mt-16 font-mono text-xs tracking-widest text-white/20"
        >
          BUILT FOR PRODUCTIVITY, POWERED BY EMPATHY
        </motion.p>
      </section>
    </div>
  );
}
