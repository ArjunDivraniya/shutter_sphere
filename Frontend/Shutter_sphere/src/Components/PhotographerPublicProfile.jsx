import React, { useMemo, useState } from "react";
import {
  FiAward,
  FiCalendar,
  FiCheckCircle,
  FiClock,
  FiColumns,
  FiGlobe,
  FiGrid,
  FiImage,
  FiMapPin,
  FiMessageCircle,
  FiPlayCircle,
  FiStar,
  FiTag,
  FiUser,
  FiVideo,
} from "react-icons/fi";

const tabs = ["Portfolio", "About", "Packages", "Reviews", "Availability"];
const categoryFilters = ["All", "Wedding", "Festival", "Birthday"];

const portfolioItems = [
  { id: 1, h: "h-28", tag: "Wedding" },
  { id: 2, h: "h-40", tag: "Festival" },
  { id: 3, h: "h-32", tag: "Birthday" },
  { id: 4, h: "h-48", tag: "Wedding" },
  { id: 5, h: "h-36", tag: "Festival" },
  { id: 6, h: "h-44", tag: "Birthday" },
];

const packages = [
  {
    name: "Basic",
    duration: "4 Hours",
    price: "$299",
    popular: false,
    deliverables: ["120 Edited Photos", "Online Gallery", "72h Preview"],
  },
  {
    name: "Premium",
    duration: "8 Hours",
    price: "$649",
    popular: true,
    deliverables: ["320 Edited Photos", "Highlight Reel", "Priority Delivery"],
  },
  {
    name: "Elite",
    duration: "12 Hours",
    price: "$1,099",
    popular: false,
    deliverables: ["520 Edited Photos", "Film + Drone", "Luxury Album"],
  },
];

const reviews = [
  {
    id: 1,
    name: "Riya Shah",
    event: "Wedding",
    date: "Nov 14, 2025",
    stars: 5,
    text: "Excellent direction and timing. Every candid looked cinematic.",
    reply: "Thank you, Riya. Your ceremony light was perfect to shoot.",
  },
  {
    id: 2,
    name: "Aarav Patel",
    event: "Birthday",
    date: "Jan 08, 2026",
    stars: 4,
    text: "Fast delivery and good color grading. Team was very polite.",
    reply: "Glad you liked it. We will push an extra reel this weekend.",
  },
];

const cardBase =
  "rounded-2xl border border-[#2a2a2a] bg-[linear-gradient(160deg,#181818,#121212)] p-6 shadow-[0_12px_30px_rgba(0,0,0,0.22)] transition duration-300 hover:-translate-y-1 hover:border-[#aa8a3b] hover:shadow-[0_0_26px_rgba(201,166,79,0.18)]";

const HeaderBadge = ({ children }) => (
  <span className="rounded-full border border-[#443a1f] bg-[#211b0d] px-3 py-1.5 text-[11px] font-semibold tracking-wide text-[#e7c56b]">
    {children}
  </span>
);

const SectionHead = ({ icon: Icon, id, title }) => (
  <div className="mb-4 flex items-center justify-between">
    <div className="flex items-center gap-3">
      <span className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-[#3a3a3a] bg-[#0f0f0f] text-[#ddb85a]">
        <Icon />
      </span>
      <h2 className="text-xl font-semibold text-white">{title}</h2>
    </div>
    <span className="rounded-full border border-[#3f361a] bg-[#1c170d] px-2.5 py-1 text-xs font-semibold text-[#e7c56b]">
      {id}
    </span>
  </div>
);

const PhotographerPublicProfile = () => {
  const [activeTab, setActiveTab] = useState("Portfolio");
  const [activeFilter, setActiveFilter] = useState("All");

  const visiblePortfolio = useMemo(() => {
    if (activeFilter === "All") {
      return portfolioItems;
    }
    return portfolioItems.filter((item) => item.tag === activeFilter);
  }, [activeFilter]);

  return (
    <main
      className="min-h-screen bg-[radial-gradient(circle_at_15%_0%,#1d1a13_0%,#0b0b0b_32%,#050505_100%)] px-4 py-8 text-white sm:px-6 lg:px-12"
      style={{ fontFamily: "Sora, Manrope, ui-sans-serif, system-ui" }}
    >
      <div className="mx-auto max-w-7xl space-y-6">
        <header className="rounded-2xl border border-[#2a2a2a] bg-[#101010]/90 p-6 shadow-[0_14px_30px_rgba(0,0,0,0.25)] sm:p-8">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
            <div className="space-y-4">
              <p className="text-xs font-bold tracking-[0.22em] text-[#8a8a8a]">PAGE 03 OF 12</p>
              <h1 className="text-3xl font-semibold tracking-tight text-white sm:text-4xl">Photographer Public Profile</h1>
              <p className="max-w-3xl text-sm leading-relaxed text-[#bcbcbc] sm:text-base">
                The photographer&apos;s storefront. Client lands here from search and decides whether to book. Must build
                trust fast.
              </p>
              <div className="flex flex-wrap gap-2.5">
                <HeaderBadge>ROUTE: /PHOTOGRAPHER/:ID</HeaderBadge>
                <HeaderBadge>AUTH: LOGIN TO BOOK</HeaderBadge>
                <HeaderBadge>PRIORITY: CRITICAL</HeaderBadge>
              </div>
            </div>

            <span className="inline-flex h-fit rounded-full border border-[#3c6cb3] bg-[#112648] px-4 py-1.5 text-xs font-bold tracking-[0.2em] text-[#68a9ff]">
              PUBLIC
            </span>
          </div>
        </header>

        <section className="grid grid-cols-1 gap-6 lg:grid-cols-2 xl:grid-cols-3">
          <article className={cardBase}>
            <SectionHead icon={FiImage} id="S1" title="Cover + Avatar" />
            <div className="relative overflow-hidden rounded-2xl border border-[#363636]">
              <div className="h-36 bg-[linear-gradient(125deg,#262626,#3a2e16)]" />
              <div className="absolute right-3 top-3 flex gap-2">
                <button className="rounded-lg bg-[#d2aa4a] px-3 py-1.5 text-xs font-semibold text-black transition hover:bg-[#e6c063]">
                  Book Now
                </button>
                <button className="rounded-lg border border-[#4e4e4e] bg-[#151515] px-3 py-1.5 text-xs font-semibold text-white transition hover:border-[#d2aa4a]">
                  Message
                </button>
              </div>
              <div className="absolute -bottom-8 left-4 h-16 w-16 rounded-2xl border-4 border-[#111] bg-[linear-gradient(160deg,#b08a3f,#624b20)]" />
            </div>
            <div className="mt-10 space-y-2 text-sm">
              <div className="flex flex-wrap items-center gap-2">
                <p className="text-base font-semibold text-white">Aarav Mehta</p>
                <span className="inline-flex items-center gap-1 rounded-full border border-[#2e5235] bg-[#0d2012] px-2 py-0.5 text-[11px] text-[#78d58f]">
                  <FiCheckCircle className="text-xs" /> Verified
                </span>
              </div>
              <p className="flex items-center gap-1.5 text-[#b3b3b3]"><FiMapPin className="text-[#ddb85a]" />Rajkot, India</p>
              <p className="flex items-center gap-1.5 text-[#b3b3b3]"><FiStar className="text-[#ddb85a]" />4.9 (287 reviews)</p>
            </div>
          </article>

          <article className={cardBase}>
            <SectionHead icon={FiColumns} id="S2" title="Sticky Profile Tabs" />
            <div className="sticky top-3 rounded-xl border border-[#333] bg-[#121212] p-2">
              <div className="flex flex-wrap gap-2">
                {tabs.map((tab) => (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className={`rounded-md px-3 py-2 text-xs font-semibold transition ${
                      activeTab === tab ? "bg-[#1f1b10] text-[#e9c56c]" : "text-[#a9a9a9] hover:text-white"
                    }`}
                  >
                    {tab}
                    <span
                      className={`mt-1 block h-[2px] rounded transition ${
                        activeTab === tab ? "bg-[#ddb85a]" : "bg-transparent"
                      }`}
                    />
                  </button>
                ))}
              </div>
            </div>
            <p className="mt-4 text-sm leading-relaxed text-[#b8b8b8]">
              Tabs remain anchored below the cover while scrolling. Active state uses a gold underline and warm tint for
              instant orientation.
            </p>
          </article>

          <article className={cardBase}>
            <SectionHead icon={FiGrid} id="S3" title="Portfolio Grid" />
            <div className="mb-3 flex flex-wrap gap-2">
              {categoryFilters.map((filter) => (
                <button
                  key={filter}
                  onClick={() => setActiveFilter(filter)}
                  className={`rounded-full border px-3 py-1 text-xs font-semibold transition ${
                    activeFilter === filter
                      ? "border-[#7e6528] bg-[#211b0d] text-[#e4c26c]"
                      : "border-[#323232] bg-[#121212] text-[#b8b8b8] hover:text-white"
                  }`}
                >
                  {filter}
                </button>
              ))}
            </div>
            <div className="grid grid-cols-2 gap-2">
              {visiblePortfolio.map((item) => (
                <div
                  key={item.id}
                  className={`${item.h} group relative overflow-hidden rounded-xl border border-[#333] bg-[linear-gradient(150deg,#242424,#151515)]`}
                >
                  <button className="absolute inset-0 text-left">
                    <span className="absolute bottom-2 left-2 rounded bg-black/55 px-2 py-0.5 text-[10px] text-[#d8d8d8]">
                      {item.tag}
                    </span>
                    <span className="absolute right-2 top-2 rounded-full bg-black/55 p-1 text-[#e7c56b] opacity-0 transition group-hover:opacity-100">
                      <FiImage className="text-xs" />
                    </span>
                  </button>
                </div>
              ))}
            </div>
            <div className="mt-3 flex items-center justify-between">
              <button className="inline-flex items-center gap-1 rounded-lg border border-[#343434] bg-[#121212] px-3 py-1.5 text-xs font-semibold text-[#d4d4d4] hover:border-[#ddb85a] hover:text-[#f1d07c]">
                <FiVideo /> Video Reel
              </button>
              <button className="rounded-lg bg-[#d2aa4a] px-3 py-1.5 text-xs font-semibold text-black hover:bg-[#e7c56b]">
                Load More
              </button>
            </div>
          </article>

          <article className={cardBase}>
            <SectionHead icon={FiUser} id="S4" title="About Section" />
            <p className="text-sm leading-relaxed text-[#b7b7b7]">
              Documentary-style photographer focused on emotion-first compositions with natural light and clean skin-tone
              grading.
            </p>
            <div className="mt-3 grid grid-cols-2 gap-2 text-xs text-[#d5d5d5]">
              <div className="rounded-lg border border-[#333] bg-[#121212] p-2">Cameras: R6 Mark II, A7IV</div>
              <div className="rounded-lg border border-[#333] bg-[#121212] p-2">Lenses: 35mm, 85mm, 70-200</div>
              <div className="rounded-lg border border-[#333] bg-[#121212] p-2">Languages: English, Hindi, Gujarati</div>
              <div className="rounded-lg border border-[#333] bg-[#121212] p-2">Travel Radius: 200 km</div>
              <div className="rounded-lg border border-[#333] bg-[#121212] p-2">Experience: 9 Years</div>
              <div className="rounded-lg border border-[#333] bg-[#121212] p-2">Events Shot: 640+</div>
            </div>
            <div className="mt-3 flex flex-wrap gap-2">
              {[
                "Weddings",
                "Destination",
                "Cultural Festivals",
                "Family Portraits",
              ].map((specialty) => (
                <span key={specialty} className="rounded-full border border-[#3d3d3d] bg-[#121212] px-2.5 py-1 text-[11px] text-[#e2e2e2]">
                  {specialty}
                </span>
              ))}
            </div>
            <div className="mt-3 rounded-xl border border-[#333] bg-[#121212] p-3 text-xs text-[#bcbcbc]">
              <p className="mb-2 flex items-center gap-1.5 text-[#e2e2e2]"><FiGlobe className="text-[#ddb85a]" /> Travel Radius Map</p>
              <div className="h-16 rounded-lg bg-[linear-gradient(160deg,#1f1f1f,#141414)]" />
            </div>
          </article>

          <article className={cardBase}>
            <SectionHead icon={FiTag} id="S5" title="Packages / Pricing" />
            <div className="grid gap-3">
              {packages.map((pkg) => (
                <div
                  key={pkg.name}
                  className={`rounded-xl border p-3 ${
                    pkg.popular
                      ? "border-[#7a6228] bg-[linear-gradient(150deg,#251f10,#17130b)]"
                      : "border-[#343434] bg-[#121212]"
                  }`}
                >
                  <div className="mb-2 flex items-center justify-between">
                    <p className="font-semibold text-white">{pkg.name}</p>
                    {pkg.popular ? (
                      <span className="rounded-full bg-[#d2aa4a] px-2 py-0.5 text-[10px] font-bold text-black">Most Popular</span>
                    ) : null}
                  </div>
                  <p className="text-xs text-[#bbbbbb]">{pkg.duration}</p>
                  <p className="my-1 text-xl font-bold text-[#e7c56b]">{pkg.price}</p>
                  <ul className="mb-3 space-y-1 text-xs text-[#cfcfcf]">
                    {pkg.deliverables.map((item) => (
                      <li key={item} className="flex items-center gap-1.5"><FiCheckCircle className="text-[#ddb85a]" />{item}</li>
                    ))}
                  </ul>
                  <button className="w-full rounded-lg bg-[#d2aa4a] px-3 py-2 text-xs font-semibold text-black hover:bg-[#e6c063]">
                    Book This Package
                  </button>
                </div>
              ))}
            </div>
          </article>

          <article className={cardBase}>
            <SectionHead icon={FiCalendar} id="S6" title="Availability Calendar" />
            <div className="rounded-xl border border-[#343434] bg-[#121212] p-3">
              <div className="mb-2 flex items-center justify-between text-xs text-[#b4b4b4]">
                <p>December 2026</p>
                <p className="flex items-center gap-1"><FiClock /> Read-only</p>
              </div>
              <div className="grid grid-cols-7 gap-1 text-center text-[11px]">
                {Array.from({ length: 14 }).map((_, i) => {
                  const day = i + 18;
                  const booked = [20, 25, 28].includes(day);
                  return (
                    <button
                      key={day}
                      title={booked ? `Booked - Dec ${day}` : `Available - Dec ${day}`}
                      className={`rounded-md px-1 py-2 transition ${
                        booked
                          ? "cursor-not-allowed bg-[#3a1a1a] text-[#f09a9a]"
                          : "bg-[#1c1c1c] text-[#d9d9d9] hover:border hover:border-[#d2aa4a] hover:text-[#f0d083]"
                      }`}
                    >
                      {day}
                    </button>
                  );
                })}
              </div>
            </div>
            <div className="mt-3 flex items-center gap-4 text-xs text-[#bcbcbc]">
              <p className="flex items-center gap-1"><span className="inline-block h-2 w-2 rounded-full bg-[#f09a9a]" />Booked</p>
              <p className="flex items-center gap-1"><span className="inline-block h-2 w-2 rounded-full bg-[#d2aa4a]" />Available</p>
            </div>
            <p className="mt-2 text-xs text-[#8f8f8f]">
              Available dates are clickable and should open a booking modal in production flow.
            </p>
          </article>
        </section>

        <section className={cardBase}>
          <SectionHead icon={FiMessageCircle} id="S7" title="Reviews Section" />
          <div className="grid gap-5 lg:grid-cols-[0.9fr_1.1fr]">
            <div className="rounded-xl border border-[#343434] bg-[#121212] p-4">
              <p className="mb-3 flex items-center gap-2 text-sm font-semibold text-white">
                <FiStar className="text-[#ddb85a]" /> Rating Breakdown
              </p>
              {[5, 4, 3, 2, 1].map((stars, index) => (
                <div key={stars} className="mb-2 flex items-center gap-2 text-xs">
                  <span className="w-10 text-[#c8c8c8]">{stars} star</span>
                  <div className="h-2 flex-1 overflow-hidden rounded-full bg-[#242424]">
                    <div
                      className="h-full rounded-full bg-[linear-gradient(90deg,#b28b3f,#e7c56b)]"
                      style={{ width: `${100 - index * 18}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>

            <div className="space-y-3">
              {reviews.map((review) => (
                <article key={review.id} className="rounded-xl border border-[#343434] bg-[#121212] p-4">
                  <div className="mb-2 flex flex-wrap items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <div className="h-9 w-9 rounded-full bg-[linear-gradient(150deg,#3f3f3f,#232323)]" />
                      <div>
                        <p className="text-sm font-semibold text-white">{review.name}</p>
                        <p className="text-xs text-[#aaaaaa]">{review.event} • {review.date}</p>
                      </div>
                    </div>
                    <span className="inline-flex items-center gap-1 rounded-full border border-[#2f5536] bg-[#102315] px-2 py-0.5 text-[10px] text-[#88dd9c]">
                      <FiAward /> Verified Booking
                    </span>
                  </div>
                  <p className="mb-2 flex text-[#ddb85a]">
                    {Array.from({ length: review.stars }).map((_, idx) => (
                      <FiStar key={idx} className="fill-current" />
                    ))}
                  </p>
                  <p className="text-sm leading-relaxed text-[#c8c8c8]">{review.text}</p>
                  {review.reply ? (
                    <div className="mt-3 rounded-lg border border-[#3a3a3a] bg-[#171717] p-3 text-xs text-[#bcbcbc]">
                      <p className="mb-1 font-semibold text-[#e4e4e4]">Photographer Reply</p>
                      <p>{review.reply}</p>
                    </div>
                  ) : null}
                </article>
              ))}
            </div>
          </div>
        </section>

      </div>
    </main>
  );
};

export default PhotographerPublicProfile;
