"use client";

import { useRef } from "react";
import Image from "next/image";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { motivations, projects, stack } from "@/ts/about";

gsap.registerPlugin(ScrollTrigger, useGSAP);

function Line({ children }: { children: React.ReactNode }) {
  return (
    <span className="block overflow-hidden pb-1">
      <span className="hero-line block">{children}</span>
    </span>
  );
}

function Chars({ text }: { text: string }) {
  return (
    <>
      {text.split(" ").map((word, w, words) => (
        <span key={w}>
          <span className="inline-block whitespace-nowrap" aria-hidden>
            {word.split("").map((c, i) => (
              <span key={i} className="hero-mask inline-block overflow-hidden pb-[0.15em] -mb-[0.15em] align-bottom">
                <span className="hero-char inline-block">{c}</span>
              </span>
            ))}
          </span>
          {w < words.length - 1 ? " " : null}
        </span>
      ))}
    </>
  );
}

function Proficiency({ value }: { value: number }) {
  return (
    <div className="flex items-center gap-3">
      <div className="flex gap-1" aria-hidden>
        {[1, 2, 3, 4, 5].map((n) => (
          <span key={n} className={`size-3 border border-ink ${n <= value ? "bg-ink" : ""}`} />
        ))}
      </div>
      <span className="text-sm">{value}/5</span>
    </div>
  );
}

// An endless loop needs the track to be two identical halves, and each half
// must be wider than the screen. Repeat the projects until it is.
const REPS = Math.ceil(8 / Math.max(1, projects.length));
const slides = Array.from({ length: REPS * 2 }).flatMap((_, rep) =>
  projects.map((p, i) => ({ p, i, rep })),
);

export function About() {
  const root = useRef<HTMLDivElement>(null);
  const counter = useRef<HTMLSpanElement>(null);

  useGSAP(
    () => {
      const helix = root.current!.querySelector<HTMLElement>(".helix")!;
      const logos = gsap.utils.toArray<HTMLElement>(".helix-logo");
      const details = gsap.utils.toArray<HTMLElement>(".helix-detail");
      const N = logos.length;
      const STEP = 0.95;
      const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      const dur = (s: number) => (reduce ? 0 : s);

      let current = 0;
      gsap.set(details, { opacity: 0, y: 0 });
      gsap.set(details[0], { opacity: 1 });
      details.forEach((el, i) => el.setAttribute("aria-hidden", String(i !== 0)));

      const show = (next: number) => {
        if (next === current) return;
        const dir = next > current ? 1 : -1; // scrolling down = content moves up
        current = next;
        root.current!.querySelector(".stack-count")!.textContent = String(next + 1).padStart(2, "0");

        details.forEach((el, i) => {
          el.setAttribute("aria-hidden", String(i !== next));

          if (i === next) {
            gsap.fromTo(
              el,
              // start from wherever it currently is, so reversing mid-fade doesn't pop
              { y: dir * 30, opacity: Number(gsap.getProperty(el, "opacity")) },
              { y: 0, opacity: 1, duration: dur(0.5), delay: dur(0.15), ease: "power3.out", overwrite: true },
            );
          } else {
            // unconditional: kills any pending or running tween on this block
            gsap.to(el, {
              y: -dir * 30,
              opacity: 0,
              duration: dur(0.25),
              ease: "power2.in",
              overwrite: true,
            });
          }
        });
      };

      const layout = (active: number) => {
        const R = Math.min(helix.clientWidth * 0.28, 200);
        const pitch = Math.min(helix.clientHeight * 0.2, 110);

        logos.forEach((el, i) => {
          const d = i - active;
          const a = d * STEP;
          const depth = (Math.cos(a) + 1) / 2;
          const fade = Math.max(0, 1 - Math.abs(d) / 3);
          el.style.transform = `translate3d(${Math.sin(a) * R}px, ${d * pitch}px, ${
            Math.cos(a) * R
          }px) scale(${0.65 + 0.35 * depth})`;
          el.style.opacity = String(fade * (0.2 + 0.8 * depth));
          el.style.zIndex = String(Math.round(depth * 100));
        });

        if (Math.abs(active - current) > 0.55) {
          show(Math.min(N - 1, Math.max(0, Math.round(active))));
        }
      };

      const state = { active: 0 };
      layout(0);

      gsap.to(state, {
        active: N - 1,
        ease: "none",
        onUpdate: () => layout(state.active),
        scrollTrigger: {
          trigger: ".stack",
          start: "top top",
          end: () => "+=" + Math.max(1, N - 1) * window.innerHeight * 0.7,
          pin: true,
          scrub: 0.5,
          invalidateOnRefresh: true,
          onRefresh: () => layout(state.active),
        },
      });

      const scenes = gsap.utils.toArray<HTMLElement>(".scene");
      const setScene = (name: string) =>
        scenes.forEach((el) => (el.dataset.on = String(el.dataset.scene === name)));

      gsap.utils.toArray<HTMLElement>("[data-section]").forEach((el) => {
        ScrollTrigger.create({
          trigger: el,
          start: "top 55%",
          end: "bottom 55%",
          onToggle: (self) => {
            if (self.isActive) setScene(el.dataset.section!);
          },
        });
      });

      // cursor spotlight (mouse only; touch has no cursor to follow)
      let cleanupSpot = () => {};
      if (window.matchMedia("(pointer: fine)").matches) {
        const scenesEl = root.current!.querySelector<HTMLElement>(".scenes")!;
        const calm = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
        const target = { x: 0, y: 0 };
        const cur = { x: 0, y: 0 };
        let seen = false;

        // eased follow: the glow trails the cursor slightly
        const follow = () => {
          const dx = target.x - cur.x;
          const dy = target.y - cur.y;
          if (Math.abs(dx) < 0.1 && Math.abs(dy) < 0.1) return;
          const k = calm ? 1 : 0.14;
          cur.x += dx * k;
          cur.y += dy * k;
          scenesEl.style.setProperty("--mx", `${cur.x}px`);
          scenesEl.style.setProperty("--my", `${cur.y}px`);
        };
        const move = (e: PointerEvent) => {
          if (e.pointerType !== "mouse") return;
          target.x = e.clientX;
          target.y = e.clientY;
          if (!seen) {
            cur.x = target.x; // first move: appear under the cursor, don't glide in
            cur.y = target.y;
            seen = true;
          }
          scenesEl.dataset.spot = "true";
        };
        const leave = () => {
          scenesEl.dataset.spot = "false";
        };

        gsap.ticker.add(follow);
        window.addEventListener("pointermove", move, { passive: true });
        document.documentElement.addEventListener("pointerleave", leave);

        cleanupSpot = () => {
          gsap.ticker.remove(follow);
          window.removeEventListener("pointermove", move);
          document.documentElement.removeEventListener("pointerleave", leave);
        };
      }

      const mm = gsap.matchMedia();

      mm.add("(prefers-reduced-motion: reduce)", () => {
        gsap.set(".loader", { display: "none" });
        gsap.set(".project-dup", { display: "none" });
        const vp = root.current!.querySelector<HTMLElement>(".project-viewport")!;
        vp.style.overflowX = "auto";
        return () => {
          vp.style.overflowX = "";
        };
      });

      mm.add("(prefers-reduced-motion: no-preference)", () => {
        document.body.style.overflow = "hidden";
        let cancelled = false;
        let live = false;     // reveal finished, pointer effect allowed
        let started = false;  // motivations loop allowed to run
        let hovering = false;

        const hero = root.current!.querySelector<HTMLElement>(".hero")!;
        const wrap = root.current!.querySelector<HTMLElement>(".mottos-wrap")!;
        const mottos = gsap.utils.toArray<HTMLElement>(".motto");
        const canLoop = mottos.length > 1;
        wrap.dataset.loop = "true"; // stack the lines in one cell instead of listing them

        // looping motivations: enter, hold while the bar fills, exit, next
        const HOLD = 3; // seconds each line stays on screen
        const loop = gsap.timeline({ repeat: -1, paused: true });
        if (canLoop) {
          mottos.forEach((el) => {
            loop
              .fromTo(el, { yPercent: 100, opacity: 0 }, { yPercent: 0, opacity: 1, duration: 0.7, ease: "power3.out" })
              .to(el, { yPercent: -100, opacity: 0, duration: 0.5, ease: "power3.in", delay: HOLD });
          });
        }

        // hover pauses the loop so a line can be read
        const play = () => {
          if (canLoop && started && !hovering) loop.play();
        };
        const onEnter = () => {
          hovering = true;
          loop.pause();
        };
        const onLeave = () => {
          hovering = false;
          play();
        };
        wrap.addEventListener("pointerenter", onEnter);
        wrap.addEventListener("pointerleave", onLeave);

        // letters lift toward the cursor (mouse only)
        const chars = gsap.utils.toArray<HTMLElement>(".hero-char");
        const lift = chars.map((c) => gsap.quickTo(c, "y", { duration: 0.5, ease: "power3" }));
        const heroMove = (e: PointerEvent) => {
          if (!live) return;
          chars.forEach((c, i) => {
            const r = c.getBoundingClientRect();
            const cx = r.left + r.width / 2;
            const cy = r.top + r.height / 2 - Number(gsap.getProperty(c, "y")); // ignore our own lift
            const near = Math.max(0, 1 - Math.hypot(e.clientX - cx, e.clientY - cy) / 150);
            lift[i](-18 * near * near);
          });
        };
        const heroLeave = () => lift.forEach((f) => f(0));
        if (window.matchMedia("(pointer: fine)").matches) {
          hero.addEventListener("pointermove", heroMove);
          hero.addEventListener("pointerleave", heroLeave);
        }

        gsap.to(".scroll-cue", { y: 6, duration: 0.9, ease: "sine.inOut", repeat: -1, yoyo: true });

        // reveal: loader slides away, name drops in, then the loop and extras start
        const tl = gsap.timeline({
          paused: true,
          onComplete: () => {
            document.body.style.overflow = "";
            gsap.set(".hero-mask", { overflow: "visible" }); // so lifted letters aren't clipped
            live = true;
            ScrollTrigger.refresh();
          },
        });
        tl.to(".loader", { yPercent: -100, duration: 0.9, ease: "power4.inOut" })
          .from(".hero-char", { yPercent: 110, stagger: 0.04, duration: 0.9, ease: "power4.out" }, "-=0.4")
          .call(
            () => {
              started = true;
              play();
            },
            undefined,
            "-=0.3",
          )
          .from(".hero-fade", { opacity: 0, y: 10, stagger: 0.15, duration: 0.6, ease: "power2.out" }, "<");

        // real loading: fonts + every <img> in the DOM
        const imgs = Array.from(root.current!.querySelectorAll("img"));
        const tasks: Promise<unknown>[] = [document.fonts.ready, ...imgs.map((img) => img.decode())];

        const shown = { v: 0 };
        const render = () => {
          if (counter.current) counter.current.textContent = String(Math.round(shown.v));
        };

        let done = 0;
        const bump = () => {
          done++;
          gsap.to(shown, {
            v: (done / tasks.length) * 100,
            duration: 0.4,
            ease: "power1.out",
            overwrite: true,
            onUpdate: render,
          });
        };
        tasks.forEach((t) => t.then(bump, bump));

        const minTime = new Promise((r) => setTimeout(r, 900));
        const failsafe = new Promise((r) => setTimeout(r, 10000));

        Promise.all([Promise.race([Promise.allSettled(tasks), failsafe]), minTime]).then(() => {
          if (cancelled) return;
          gsap.to(shown, { v: 100, duration: 0.3, onUpdate: render, onComplete: () => tl.play() });
        });

        // 3. projects: endless diagonal slideshow
        const section = root.current!.querySelector<HTMLElement>(".projects")!;
        const viewport = section.querySelector<HTMLElement>(".project-viewport")!;
        const track = section.querySelector<HTMLElement>(".project-track")!;
        const cards = track.querySelectorAll<HTMLElement>(".project-card");
        const countEl2 = section.querySelector(".project-count");
        const SPEED = 45; // px per second

        let half = 0, stride = 0, cw = 0, vw = 0;
        const measure = () => {
          half = track.offsetWidth / 2;
          stride = track.offsetWidth / cards.length;
          cw = cards[0].offsetWidth;
          vw = viewport.offsetWidth;
        };
        measure();
        window.addEventListener("resize", measure);

        const speed = { s: 1 };
        let x = 0;
        let inView = false;
        let shownIdx = -1;
        const setX = gsap.quickSetter(track, "x", "px");

        const tick = (_t: number, dt: number) => {
          if (!inView) return;
          x = (x - SPEED * speed.s * (Math.min(dt, 100) / 1000)) % half; // wraps seamlessly
          setX(x);

          // which card is nearest the screen center? The band rotates around its
          // center, so the screen center sits at vw / 2 along the track.
          const p = vw / 2 - x;
          const idx = ((Math.round((p - cw / 2) / stride) % projects.length) + projects.length) % projects.length;
          if (idx !== shownIdx) {
            shownIdx = idx;
            if (countEl2) countEl2.textContent = String(idx + 1).padStart(2, "0");
          }
        };

        const st = ScrollTrigger.create({
          trigger: section,
          start: "top bottom",
          end: "bottom top",
          onToggle: (self) => {
            inView = self.isActive; // only run while on screen
          },
        });
        gsap.ticker.add(tick);

        // ease to a stop on hover/focus, ease back after
        const slow = () => gsap.to(speed, { s: 0, duration: 0.6, overwrite: true });
        const resume = () => gsap.to(speed, { s: 1, duration: 0.8, overwrite: true });
        viewport.addEventListener("pointerenter", slow);
        viewport.addEventListener("pointerleave", resume);
        viewport.addEventListener("focusin", slow);
        viewport.addEventListener("focusout", resume);

        return () => {
          cancelled = true;
          document.body.style.overflow = "";
          wrap.dataset.loop = "false";
          wrap.removeEventListener("pointerenter", onEnter);
          wrap.removeEventListener("pointerleave", onLeave);
          hero.removeEventListener("pointermove", heroMove);
          hero.removeEventListener("pointerleave", heroLeave);
          gsap.ticker.remove(tick);
          st.kill();
          window.removeEventListener("resize", measure);
          viewport.removeEventListener("pointerenter", slow);
          viewport.removeEventListener("pointerleave", resume);
          viewport.removeEventListener("focusin", slow);
          viewport.removeEventListener("focusout", resume);
        };
      });

      return () => {
        mm.revert();
        cleanupSpot();
      };
    },
    { scope: root },
  );

  return (
    <div ref={root} className="relative z-10 ml-[calc(50%-50vw)] w-screen">
      <div aria-hidden className="scenes pointer-events-none fixed inset-0 z-0">
        <div className="scene scene-hero" data-scene="hero" data-on="true" />
        <div className="scene scene-stack" data-scene="stack" data-on="false" />
        <div className="scene scene-work" data-scene="work" data-on="false" />
      </div>


      <noscript>
        <style>{`.loader{display:none}`}</style>
      </noscript>

      <div className="loader fixed inset-0 z-[100] flex items-end justify-between bg-ink p-6 text-paper">
        <span>loading</span>
        <span className="text-6xl tabular-nums">
          <span ref={counter}>0</span>%
        </span>
      </div>

      <div data-section="hero">
        <section className="hero relative flex h-[calc(100dvh-3.5rem)] flex-col justify-center px-6 md:px-16">
        <h1 className="-ml-[0.06em] text-6xl leading-none md:text-8xl" aria-label="hi, I’m Arya.">
          <Chars text="hi, I’m Arya." />
        </h1>

        <div className="mottos-wrap group mt-8 max-w-xl" data-loop="false">
          <div className="flex gap-[0.4em] text-2xl md:text-3xl">
            <span className="hero-fade shrink-0 py-1">I'm</span>
            <div className="mottos grid gap-1 overflow-hidden py-1">
              {motivations.map((line) => (
                <p key={line} className="motto group-data-[loop=true]:[grid-area:1/1]">
                  {line}
                </p>
              ))}
            </div>
          </div>
        </div>

          <div className="hero-fade absolute bottom-6 left-6 text-xs text-ink/60 md:left-16">
            <span className="scroll-cue inline-block">scroll ↓</span>
          </div>
        </section>
      </div>

      <div data-section="stack">
        <section className="stack relative h-dvh overflow-hidden">
           <div className="pointer-events-none absolute inset-x-6 top-14 z-10 flex items-baseline justify-between md:inset-x-16">
            <h2 className="text-sm">language/framework</h2>
            <p className="text-xs tabular-nums text-ink/60">
              <span className="stack-count">01</span> / {String(stack.length).padStart(2, "0")}
            </p>
          </div>       

          <div className="grid h-full grid-rows-2 md:grid-cols-2 md:grid-rows-1">
            <div className="helix relative overflow-hidden [perspective:800px]" aria-hidden>
              {stack.map((item) => (
                <div
                  key={item.name}
                  className="helix-logo absolute left-1/2 top-1/2 -ml-16 -mt-16 size-32 will-change-transform"
                >
                  <Image
                    src={item.image}
                    alt=""
                    width={128}
                    height={128}
                    loading="eager"
                    className="size-full object-contain invert"
                  />
                </div>
              ))}
            </div>

            <div className="grid content-center px-8 md:px-16">
              {stack.map((item) => (
                <div key={item.name} className="helix-detail flex flex-col gap-4 [grid-area:1/1]">
                  <h3 className="text-4xl">{item.name}</h3>
                  <Proficiency value={item.proficiency} />
                  <div>
                    <p className="text-sm opacity-60">thoughts</p>
                    <p className="mt-1 max-w-md opacity-80">{item.thoughts}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      </div>

      {/* 3. projects: endless diagonal slideshow */}
      <div data-section="work">
        <section className="projects relative overflow-hidden py-24">
          <div className="flex items-baseline justify-between px-6 md:px-16">
            <h2 className="text-sm">what i&rsquo;ve built</h2>
            <p className="text-xs tabular-nums text-ink/60">
              <span className="project-count">01</span> / {String(projects.length).padStart(2, "0")}
            </p>
          </div>

          {/* the band is wider than the screen so the tilted edges never show */}
          <div className="project-band -ml-[10%] my-20 w-[120%] -rotate-3">
            <div className="project-viewport overflow-x-clip">
              <div className="project-track flex w-max will-change-transform">
                {slides.map(({ p, i, rep }) => (
                  <a
                    key={`${rep}-${i}`}
                    href={p.href}
                    {...(rep > 0 ? { "aria-hidden": true, tabIndex: -1 } : {})}
                    className={`project-card group relative mr-6 block aspect-[4/5] w-[min(72vw,20rem)] shrink-0 overflow-hidden border border-line ${
                      rep > 0 ? "project-dup" : ""
                    }`}
                  >
                    <Image
                      src={p.image}
                      alt=""
                      fill
                      sizes="(min-width: 768px) 20rem, 72vw"
                      loading="eager"
                      className="object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-[linear-gradient(to_top,rgb(0_0_0/0.8),rgb(0_0_0/0.15)_55%,transparent)]" />
                    <div className="absolute inset-x-0 bottom-0 p-5 text-white">
                      <div className="flex items-baseline justify-between gap-4">
                        <h3 className="text-xl">{p.title}</h3>
                        <span className="text-xs opacity-70">{p.year}</span>
                      </div>
                      <p className="mt-1 line-clamp-2 text-sm opacity-80">{p.description}</p>
                    </div>
                  </a>
                ))}
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
