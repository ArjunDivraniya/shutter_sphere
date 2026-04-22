import React from "react";
import { motion } from "framer-motion";
import { FaSearch, FaUserCheck, FaStar, FaShieldAlt, FaMoneyBillWave, FaSortAmountDown, FaCamera, FaCalendarCheck, FaUserFriends, FaArrowRight } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import Navbar from "./navbar";
import { AppButton, Container, SectionHeading, SurfaceCard } from "./ui";

const featuredPhotographers = [
  {
    name: "Aarav Mehta",
    specialty: "Wedding Photography",
    image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=900&auto=format&fit=crop",
    rating: 4.9,
    price: "₹4,500/hr",
  },
  {
    name: "Nisha Kapoor",
    specialty: "Portrait Sessions",
    image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=900&auto=format&fit=crop",
    rating: 4.8,
    price: "₹3,200/hr",
  },
  {
    name: "Kabir Khan",
    specialty: "Event Coverage",
    image: "https://images.unsplash.com/photo-1504593811423-6dd665756598?w=900&auto=format&fit=crop",
    rating: 4.7,
    price: "₹5,000/hr",
  },
];

const problemCards = [
  {
    icon: FaUserFriends,
    title: "Hard to find trusted photographers",
    description: "Browse verified profiles, ratings, and portfolio snapshots before you book.",
  },
  {
    icon: FaMoneyBillWave,
    title: "No price clarity",
    description: "Compare rates instantly and see clear pricing before you commit.",
  },
  {
    icon: FaShieldAlt,
    title: "Booking confusion",
    description: "Manage dates, events, and booking details in one place without back-and-forth.",
  },
];

const solutionSteps = [
  {
    icon: FaSearch,
    title: "Search",
    description: "Find photographers by location, style, and availability.",
  },
  {
    icon: FaSortAmountDown,
    title: "Compare",
    description: "Review pricing, ratings, and specialties side by side.",
  },
  {
    icon: FaCalendarCheck,
    title: "Book",
    description: "Select the right photographer and reserve your date.",
  },
  {
    icon: FaUserCheck,
    title: "Manage",
    description: "Track booking details and updates from one dashboard.",
  },
];

const howItWorks = [
  "Search Photographer",
  "View Profile",
  "Select Date",
  "Book Easily",
];

const collageImages = [
  "https://images.unsplash.com/photo-1492691527719-9d1e07e534b4?w=900&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1519741497674-611481863552?w=900&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1492691527719-9d1e07e534b4?w=900&auto=format&fit=crop",
];

const Homepage1 = () => {
  const navigate = useNavigate();

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-[#08111f] text-white overflow-hidden">
        <section className="relative isolate overflow-hidden">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(255,184,77,0.24),transparent_32%),radial-gradient(circle_at_top_right,rgba(255,110,64,0.22),transparent_28%),linear-gradient(180deg,#0f172a_0%,#08111f_100%)]" />
          <div className="absolute inset-0 opacity-20 bg-[linear-gradient(rgba(255,255,255,0.06)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.06)_1px,transparent_1px)] bg-[size:48px_48px]" />

          <Container className="relative grid min-h-screen items-center gap-12 py-20 lg:grid-cols-[1.05fr_0.95fr]">
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="max-w-2xl"
            >
              <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm text-orange-100 backdrop-blur-sm">
                <FaCamera className="text-orange-300" /> Compare, book, and manage with less friction
              </div>

              <h1 className="text-5xl font-black leading-tight tracking-tight text-white md:text-7xl">
                Book Trusted Photographers for Your Special Moments
              </h1>

              <p className="mt-6 max-w-xl text-lg leading-8 text-slate-200 md:text-xl">
                Compare prices, check availability, and book instantly.
              </p>

              <div className="mt-8 flex flex-col gap-4 sm:flex-row">
                <AppButton
                  onClick={() => navigate("/search")}
                  size="lg"
                >
                  Find Photographer <FaArrowRight />
                </AppButton>
                <AppButton
                  onClick={() => navigate("/login")}
                  variant="secondary"
                  size="lg"
                >
                  Join as Photographer
                </AppButton>
              </div>

              <div className="mt-10 grid grid-cols-2 gap-4 sm:grid-cols-3">
                {[
                  ["Trusted", "verified profiles"],
                  ["Clear", "price comparison"],
                  ["Fast", "booking flow"],
                ].map(([title, text]) => (
                  <div key={title} className="rounded-2xl border border-white/10 bg-white/5 p-4 backdrop-blur-sm">
                    <p className="text-sm font-semibold uppercase tracking-[0.18em] text-orange-200">{title}</p>
                    <p className="mt-1 text-sm text-slate-300">{text}</p>
                  </div>
                ))}
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.9, delay: 0.15 }}
              className="relative"
            >
              <div className="absolute -left-8 top-10 h-28 w-28 rounded-full bg-orange-400/20 blur-3xl" />
              <div className="absolute -bottom-8 right-2 h-32 w-32 rounded-full bg-amber-300/20 blur-3xl" />

              <div className="grid gap-4 sm:grid-cols-2">
                <div className="overflow-hidden rounded-[2rem] border border-white/10 bg-white/5 p-3 shadow-2xl backdrop-blur-md sm:row-span-2">
                  <img
                    src={collageImages[0]}
                    alt="Photographer collage 1"
                    className="h-full min-h-[420px] w-full rounded-[1.6rem] object-cover"
                  />
                </div>
                <div className="overflow-hidden rounded-[1.75rem] border border-white/10 bg-white/5 p-3 shadow-2xl backdrop-blur-md">
                  <img
                    src={collageImages[1]}
                    alt="Photographer collage 2"
                    className="h-52 w-full rounded-[1.25rem] object-cover"
                  />
                </div>
                <div className="overflow-hidden rounded-[1.75rem] border border-white/10 bg-white/5 p-3 shadow-2xl backdrop-blur-md sm:col-start-2">
                  <img
                    src={collageImages[2]}
                    alt="Photographer collage 3"
                    className="h-52 w-full rounded-[1.25rem] object-cover"
                  />
                </div>
              </div>

              <div className="absolute bottom-6 left-6 max-w-xs rounded-3xl border border-white/10 bg-slate-950/75 p-5 shadow-2xl backdrop-blur-md">
                <p className="text-sm uppercase tracking-[0.2em] text-orange-200">Featured Platform</p>
                <p className="mt-2 text-lg font-semibold text-white">Everything you need to book with confidence.</p>
              </div>
            </motion.div>
          </Container>
        </section>

        <section className="py-20">
          <Container>
            <SectionHeading
              eyebrow="Problem"
              title="The old booking process wastes time and creates doubt."
            />

            <div className="mt-10 grid gap-6 md:grid-cols-3">
              {problemCards.map((item, index) => (
                <motion.div
                  key={item.title}
                  initial={{ opacity: 0, y: 18 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.3 }}
                  transition={{ duration: 0.45, delay: index * 0.08 }}
                >
                  <SurfaceCard>
                    <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-orange-400 to-amber-300 text-slate-950">
                      <item.icon className="text-xl" />
                    </div>
                    <h3 className="mt-5 text-xl font-semibold text-white">{item.title}</h3>
                    <p className="mt-3 text-sm leading-7 text-slate-300">{item.description}</p>
                  </SurfaceCard>
                </motion.div>
              ))}
            </div>
          </Container>
        </section>

        <section className="bg-[#0d1728] py-20">
          <Container>
            <SectionHeading
              eyebrow="Solution"
              title="A simple platform that helps you move from search to booking."
            />

            <div className="mt-10 grid gap-6 md:grid-cols-4">
              {solutionSteps.map((item, index) => (
                <motion.div
                  key={item.title}
                  initial={{ opacity: 0, y: 18 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.3 }}
                  transition={{ duration: 0.45, delay: index * 0.08 }}
                >
                  <SurfaceCard className="text-center" padding="p-6">
                    <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-[#ffb84d] to-[#ff7a45] text-slate-950">
                      <item.icon className="text-2xl" />
                    </div>
                    <h3 className="mt-5 text-xl font-semibold text-white">{item.title}</h3>
                    <p className="mt-3 text-sm leading-7 text-slate-300">{item.description}</p>
                  </SurfaceCard>
                </motion.div>
              ))}
            </div>
          </Container>
        </section>

        <section className="mx-auto max-w-7xl px-6 py-20 lg:px-10">
          <SectionHeading
            eyebrow="Featured Photographers"
            title="Top profiles to help users start with trust."
          />

          <div className="mt-10 flex justify-start md:justify-end">
            <AppButton
              onClick={() => navigate("/search")}
              variant="secondary"
            >
              Explore More <FaArrowRight />
            </AppButton>
          </div>

          <div className="mt-10 grid gap-6 md:grid-cols-3">
            {featuredPhotographers.map((photographer, index) => (
              <motion.article
                key={photographer.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.3 }}
                transition={{ duration: 0.5, delay: index * 0.08 }}
                className="surface-card overflow-hidden p-0"
              >
                <img src={photographer.image} alt={photographer.name} className="h-72 w-full object-cover" />
                <div className="p-6">
                  <p className="text-sm uppercase tracking-[0.2em] text-orange-300">{photographer.specialty}</p>
                  <h3 className="mt-2 text-2xl font-semibold text-white">{photographer.name}</h3>
                  <div className="mt-4 flex items-center gap-2 text-amber-300">
                    <FaStar />
                    <span className="font-semibold text-white">{photographer.rating.toFixed(1)}</span>
                    <span className="text-sm text-slate-300">rating</span>
                  </div>
                  <div className="mt-4 inline-flex rounded-full bg-white/8 px-4 py-2 text-sm font-semibold text-slate-100">
                    Price: {photographer.price}
                  </div>
                </div>
              </motion.article>
            ))}
          </div>
        </section>

        <section className="bg-[#0d1728] py-20">
          <Container>
            <SectionHeading
              eyebrow="How It Works"
              title="Four simple steps from search to booking."
            />

            <div className="relative mt-12">
              <div className="absolute left-6 top-8 hidden h-[2px] w-[calc(100%-3rem)] bg-gradient-to-r from-[#ffb84d] via-white/20 to-[#ff7a45] md:block" />
              <div className="grid gap-6 md:grid-cols-4">
              {howItWorks.map((step, index) => (
                <motion.div
                  key={step}
                  initial={{ opacity: 0, y: 18 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.3 }}
                  transition={{ duration: 0.45, delay: index * 0.08 }}
                >
                  <div className="relative">
                    <div className="absolute left-6 top-6 hidden h-4 w-4 rounded-full border-2 border-[#ffb84d] bg-[#08111f] md:block" />
                    <SurfaceCard className="md:pt-10">
                      <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-[#ffb84d] to-[#ff7a45] font-bold text-slate-950">
                        {index + 1}
                      </div>
                      <h3 className="mt-5 text-xl font-semibold text-white">{step}</h3>
                      <p className="mt-3 text-sm leading-7 text-slate-300">
                        {index === 0 && "Use filters to find photographers by style, location, and budget."}
                        {index === 1 && "Open the profile to compare ratings, portfolio, and pricing."}
                        {index === 2 && "Choose the date that fits your event or session."}
                        {index === 3 && "Confirm the booking and manage everything from your dashboard."}
                      </p>
                    </SurfaceCard>
                  </div>
                </motion.div>
              ))}
              </div>
            </div>
          </Container>
        </section>
      </div>
    </>
  );
};

      export default Homepage1;
