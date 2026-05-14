"use client";

import { useState, useRef } from "react";
import { useParams } from "next/navigation";
import { useTranslations } from "next-intl";
import { motion, AnimatePresence, useMotionValue, animate } from "framer-motion";
import { Menu, X } from "lucide-react";
import ProfileCard from "@/components/Dashboard/ProfileCard";
import BookingHistory from "@/components/Dashboard/BookingHistory";
import VisaStatus from "@/components/Dashboard/VisaStatus";
import PointsCard from "@/components/Dashboard/PointsCard";
import LoyaltyTierSystem from "@/components/LoyaltyTierSystem";
import SavedSearches from "@/components/SavedSearches";
import GamificationBadges from "@/components/GamificationBadges";
import CollaborativeTripBoard from "@/components/CollaborativeTripBoard";
import QuickActions from "@/components/Support/QuickActions";
import { TripCountdownWidget } from "@/components/TripCountdownWidget";
import { Sun, CloudSun } from "lucide-react";

const TABS = ["profile", "bookings", "visa", "points", "loyalty", "saved", "badges", "board"] as const;
type Tab = (typeof TABS)[number];

const TAB_ICONS: Record<Tab, string> = {
  profile: "👤",
  bookings: "📋",
  visa: "🛂",
  points: "⭐",
  loyalty: "🏆",
  saved: "💾",
  badges: "🏅",
  board: "🗺️",
};

export default function DashboardLayout() {
  const params = useParams();
  const locale = (params?.locale as string) || "en";
  const t = useTranslations("dashboard");
  const tOverview = useTranslations("dashboard.tripOverview");
  const [activeTab, setActiveTab] = useState<Tab>("profile");
  const [quickActionsVisible, setQuickActionsVisible] = useState(false);
  const [mobileDrawerOpen, setMobileDrawerOpen] = useState(false);

  // Touch gesture refs
  const drawerRef = useRef<HTMLDivElement>(null);
  const x = useMotionValue(0);
  const SNAP_THRESHOLD = 80; // px — close drawer if dragged past this

  const openDrawer = () => {
    setMobileDrawerOpen(true);
    x.set(0);
  };

  const closeDrawer = () => {
    setMobileDrawerOpen(false);
    x.set(0);
  };

// framer-motion spring config for drawer open/close
  const drawerSpring = {
    type: "spring" as const,
    damping: 28,
    stiffness: 300,
  };

  const handleTouchEnd = (_event: unknown, info: { offset: { x: number } }) => {
    const offset = info?.offset?.x ?? 0;
    // Close if dragged more than SNAP_THRESHOLD px to the left, or settled past -100px
    if (offset < -SNAP_THRESHOLD || x.get() < -100) {
      closeDrawer();
    } else {
      animate(x, 0, { type: "spring", damping: 28, stiffness: 300 });
    }
  };

  const handleTabChange = (tab: Tab) => {
    setActiveTab(tab);
    closeDrawer();
  };

  const handleQuickAction = (actionId: string) => {
    setQuickActionsVisible(false);
    console.log('Quick action triggered:', actionId);
  };

  const renderContent = () => {
    switch (activeTab) {
      case "profile":
        return <ProfileCard />;
      case "bookings":
        return <BookingHistory />;
      case "visa":
        return <VisaStatus />;
      case "points":
        return <PointsCard />;
      case "loyalty":
        return <LoyaltyTierSystem />;
      case "saved":
        return <SavedSearches />;
      case "badges":
        return <GamificationBadges />;
      case "board":
        return <CollaborativeTripBoard locale={locale as 'tr' | 'en'} />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Mobile Top Bar */}
      <div className="md:hidden flex items-center justify-between px-4 py-3 bg-white border-b border-gray-100 sticky top-0 z-30">
        <div>
          <h1 className="text-lg font-bold text-gray-900">{t("title")}</h1>
          <p className="text-xs text-gray-500">{t("subtitle")}</p>
        </div>
        <button
          onClick={openDrawer}
          className="p-2 rounded-lg hover:bg-gray-100 active:scale-90 transition-all duration-150"
          aria-label="Open menu"
        >
          <Menu className="w-5 h-5 text-gray-600" />
        </button>
      </div>

      {/* Mobile Drawer Overlay */}
      <AnimatePresence>
        {mobileDrawerOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.22, ease: "easeOut" }}
              className="fixed inset-0 bg-black/40 z-40 md:hidden"
              onClick={closeDrawer}
            />

            {/* Drawer — framer-motion drag with spring snap */}
            <motion.div
              ref={drawerRef}
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={drawerSpring}
              drag="x"
              dragConstraints={{ left: -280, right: 0 }}
              dragElastic={0}
              onDragEnd={handleTouchEnd}
              style={{ x }}
              className="fixed left-0 top-0 bottom-0 w-72 bg-white z-50 shadow-2xl md:hidden overflow-y-auto cursor-grab active:cursor-grabbing select-none"
            >
              {/* Drawer Header */}
              <div className="flex items-center justify-between p-4 border-b border-gray-100">
                <div>
                  <h2 className="text-lg font-semibold text-gray-900">{t("title")}</h2>
                  <p className="text-sm text-gray-500">{t("subtitle")}</p>
                </div>
                <button
                  onClick={closeDrawer}
                  className="p-1.5 rounded-lg hover:bg-gray-100 active:scale-90 transition-all duration-150"
                  aria-label="Close menu"
                >
                  <X className="w-5 h-5 text-gray-500" />
                </button>
              </div>

              {/* Navigation */}
              <nav className="p-3">
                <ul className="space-y-1">
                  {TABS.map((tab) => (
                    <li key={tab}>
                      <button
                        onClick={() => handleTabChange(tab)}
                        className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-150 ${
                          activeTab === tab
                            ? "bg-blue-50 text-blue-700"
                            : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                        }`}
                      >
                        <span className="text-lg">{TAB_ICONS[tab]}</span>
                        <span>{t(`tabs.${tab}`)}</span>
                        {activeTab === tab && (
                          <motion.div
                            layoutId="mobile-active-tab"
                            className="ml-auto w-1.5 h-1.5 rounded-full bg-blue-600"
                            transition={{ type: "spring", damping: 25, stiffness: 350 }}
                          />
                        )}
                      </button>
                    </li>
                  ))}
                </ul>
              </nav>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Trip Overview Hero */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8 p-4 bg-gradient-to-r from-blue-600 to-blue-800 rounded-2xl text-white"
        >
          <div className="md:col-span-2 flex flex-col justify-center">
            <p className="text-xs font-medium uppercase tracking-wider opacity-80 mb-1">
              {tOverview("upcomingTrip")}
            </p>
            <h2 className="text-2xl font-bold mb-1">{tOverview("destination")}</h2>
            <p className="text-sm text-blue-100 mb-4">{tOverview("tripDate")}</p>
            <div className="flex items-center gap-2 bg-white/10 rounded-xl p-3 backdrop-blur-sm w-fit">
              <Sun className="h-5 w-5 text-amber-300" />
              <span className="text-sm">{tOverview("weather")}</span>
              <span className="text-sm text-blue-200 ml-2">
                <CloudSun className="inline h-4 w-4 mr-1 text-amber-400" />
                {tOverview("temp")}
              </span>
            </div>
          </div>
          <div className="flex items-center justify-center">
            <TripCountdownWidget
              destination={tOverview("destination")}
              tripDate="2026-06-15T09:00:00Z"
            />
          </div>
        </motion.div>

        {/* Quick Support Actions */}
        <div className="mb-8">
          <button
            onClick={() => setQuickActionsVisible(!quickActionsVisible)}
            className="flex items-center gap-2 text-sm font-medium text-blue-600 hover:text-blue-700 mb-2"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.923-2.345 3.857-2.345 2.21 0 4 1.343 4 3a4.015 4.015 0 01-.828-1.678M12 4.5A4.5 4.5 0 007.5 9H5a4.5 4.5 0 000 9h2.5m-6.5 5.5h5" />
            </svg>
            {quickActionsVisible
              ? (locale === 'tr' ? 'Destek Kısayollarını Gizle' : 'Hide Support Shortcuts')
              : (locale === 'tr' ? 'Destek Kısayollarını Göster' : 'Show Support Shortcuts')}
          </button>
          <QuickActions
            locale={locale === 'tr' ? 'tr' : 'en'}
            onAction={handleQuickAction}
            visible={quickActionsVisible}
          />
        </div>

        <div className="flex gap-8">
          {/* Desktop Sidebar */}
          <aside className="hidden md:block w-64 shrink-0">
            <nav className="sticky top-24 bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
              <div className="p-4 border-b border-gray-100">
                <h2 className="text-lg font-semibold text-gray-900">
                  {t("title")}
                </h2>
                <p className="text-sm text-gray-500 mt-1">
                  {t("subtitle")}
                </p>
              </div>
              <ul className="p-2">
                {TABS.map((tab) => (
                  <li key={tab}>
                    <button
                      onClick={() => setActiveTab(tab)}
                      className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors ${
                        activeTab === tab
                          ? "bg-blue-50 text-blue-700"
                          : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                      }`}
                    >
                      <span className="text-lg">{TAB_ICONS[tab]}</span>
                      <span>{t(`tabs.${tab}`)}</span>
                    </button>
                  </li>
                ))}
              </ul>
            </nav>
          </aside>

          {/* Content Area with Animated Tab Transitions */}
          <main className="flex-1 min-w-0">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeTab}
                initial={{ opacity: 0, x: 8 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -8 }}
                transition={{ duration: 0.2, ease: "easeOut" }}
              >
                {renderContent()}
              </motion.div>
            </AnimatePresence>
          </main>
        </div>
      </div>
    </div>
  );
}
