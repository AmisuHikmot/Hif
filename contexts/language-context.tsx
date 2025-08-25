"use client"

import type React from "react"
import { createContext, useContext, useState, useEffect } from "react"

type Language = "en" | "ar" | "ha"

type LanguageContextType = {
  language: Language
  setLanguage: (language: Language) => void
  t: (key: string) => string
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined)

export const translations = {
  en: {
    // Common
    "site.name": "Hamduk Islamic Foundation",
    "site.tagline": "Promoting unity, education, and understanding amongst the Muslim Ummah",
    "nav.about": "About",
    "nav.focus": "Our Focus",
    "nav.conference": "Conference",
    "nav.membership": "Membership",
    "nav.media": "Media",
    "nav.events": "Events",
    "nav.donate": "Donate",
    "nav.contact": "Contact",
    "nav.login": "Login",
    "nav.register": "Register",
    "button.learnMore": "Learn More",
    "button.viewAll": "View All",

    // Homepage
    "home.hero.established": "Established 1996",
    "home.hero.title": "Hamduk Islamic Foundation",
    "home.hero.description":
      "Promoting unity, education, and understanding amongst the Muslim Ummah through knowledge, charity, and community development.",
    "home.hero.learnAboutUs": "Learn About Us",
    "home.hero.upcomingEvents": "Upcoming Events",

    "home.mission.title": "Our Mission & Vision",
    "home.mission.description":
      "Hamduk Islamic Foundation was established in 1996 with the aim of building Islam worldwide through education, community service, and humanitarian efforts.",
    "home.mission.education.title": "Islamic Education",
    "home.mission.education.description":
      "Promoting Islamic knowledge through lectures, publications, and educational programs for all age groups.",
    "home.mission.community.title": "Community Development",
    "home.mission.community.description":
      "Building strong Muslim communities through social programs, youth development, and family support services.",
    "home.mission.advocacy.title": "Islamic Advocacy",
    "home.mission.advocacy.description":
      "Representing Islamic values and interests in public discourse and promoting interfaith dialogue and understanding.",

    "home.programs.title": "Programs & Events",
    "home.programs.description":
      "Join us for our upcoming events and programs designed to educate, inspire, and strengthen our community.",
    "home.programs.tab.featured": "Featured",
    "home.programs.tab.upcoming": "Upcoming",
    "home.programs.tab.past": "Past Events",
    "home.programs.viewAll": "View All Events",

    "home.impact.title": "Our Impact",
    "home.impact.description":
      "For over 25 years, Hamduk Islamic Foundation has been making a difference in communities across Nigeria.",
    "home.impact.years": "Years of Service",
    "home.impact.people": "People Reached",
    "home.impact.events": "Events Organized",
    "home.impact.branches": "Active Branches",

    "home.testimonials.title": "What People Say",
    "home.testimonials.description": "Hear from those who have been impacted by our work.",

    "home.training.title": "Training & Education Programs",
    "home.training.description":
      "Explore our comprehensive training and educational programs designed to empower Muslims with knowledge and skills.",
    "home.training.islamic.title": "Islamic Training",
    "home.training.islamic.description":
      "Comprehensive training programs on Islamic principles, practices, and leadership.",
    "home.training.lectures.title": "Islamic Lectures",
    "home.training.lectures.description":
      "Regular lectures by renowned scholars on various Islamic topics and contemporary issues.",
    "home.training.tafsir.title": "Ramadan Tafsir",
    "home.training.tafsir.description": "Special Quranic interpretation sessions during the holy month of Ramadan.",
    "home.training.youth.title": "Youth Development",
    "home.training.youth.description": "Programs specifically designed to nurture and develop young Muslim leaders.",

    "newsletter.title": "Stay Updated",
    "newsletter.description": "Subscribe to our newsletter to receive updates on our activities, events, and programs.",
    "newsletter.placeholder": "Your email address",
    "newsletter.button": "Subscribe",
    "newsletter.privacy": "We respect your privacy. Unsubscribe at any time.",

    // Members Directory
    "members.title": "Members Directory",
    "members.description": "Browse our community of members and connect with fellow Muslims.",
    "members.search": "Search members...",
    "members.filter.all": "All Members",
    "members.filter.executives": "Executives",
    "members.filter.scholars": "Scholars",
    "members.filter.volunteers": "Volunteers",
    "members.sort.name": "Name",
    "members.sort.newest": "Newest",
    "members.sort.oldest": "Oldest",
    "members.noResults": "No members found matching your criteria.",

    // Search
    "search.title": "Search Results",
    "search.placeholder": "Search...",
    "search.button": "Search",
    "search.results.for": "Showing results for",
    "search.noResults": "No results found for",
    "search.tryDifferent": "Try different keywords or check your spelling",
    "search.enterTerm": "Enter a search term to find content",
    "search.canSearch": "You can search for events, pages, members, and resources",
    "search.tabs.all": "All Results",
    "search.tabs.events": "Events",
    "search.tabs.pages": "Pages",
    "search.tabs.members": "Members",
    "search.tabs.resources": "Resources",

    // Language Switcher
    "language.english": "English",
    "language.arabic": "العربية",
    "language.hausa": "Hausa",
  },
  ar: {
    // Common
    "site.name": "مؤسسة حمدك الإسلامية",
    "site.tagline": "تعزيز الوحدة والتعليم والتفاهم بين الأمة الإسلامية",
    "nav.about": "عن المؤسسة",
    "nav.focus": "تركيزنا",
    "nav.conference": "المؤتمرات",
    "nav.membership": "العضوية",
    "nav.media": "الوسائط",
    "nav.events": "الفعاليات",
    "nav.donate": "تبرع",
    "nav.contact": "اتصل بنا",
    "nav.login": "تسجيل الدخول",
    "nav.register": "التسجيل",
    "button.learnMore": "اقرأ المزيد",
    "button.viewAll": "عرض الكل",

    // Homepage
    "home.hero.established": "تأسست عام 1996",
    "home.hero.title": "مؤسسة حمدك الإسلامية",
    "home.hero.description":
      "تعزيز الوحدة والتعليم والتفاهم بين الأمة الإسلامية من خلال المعرفة والعمل الخيري وتنمية المجتمع.",
    "home.hero.learnAboutUs": "تعرف علينا",
    "home.hero.upcomingEvents": "الفعاليات القادمة",

    "home.mission.title": "رسالتنا ورؤيتنا",
    "home.mission.description":
      "تأسست مؤسسة حمدك الإسلامية في عام 1996 بهدف بناء الإسلام في جميع أنحاء العالم من خلال التعليم وخدمة المجتمع والجهود الإنسانية.",
    "home.mission.education.title": "التعليم الإسلامي",
    "home.mission.education.description":
      "تعزيز المعرفة الإسلامية من خلال المحاضرات والمنشورات والبرامج التعليمية لجميع الفئات العمرية.",
    "home.mission.community.title": "تنمية المجتمع",
    "home.mission.community.description":
      "بناء مجتمعات إسلامية قوية من خلال البرامج الاجتماعية وتنمية الشباب وخدمات دعم الأسرة.",
    "home.mission.advocacy.title": "الدعوة الإسلامية",
    "home.mission.advocacy.description":
      "تمثيل القيم والمصالح الإسلامية في الخطاب العام وتعزيز الحوار والتفاهم بين الأديان.",

    // More translations would be added here
  },
  ha: {
    // Common
    "site.name": "Kungiyar Musulunci ta Hamduk",
    "site.tagline": "Ƙarfafa ƙungiya, ilimi, da fahimta a tsakanin al'ummar Musulmi",
    "nav.about": "Game da Mu",
    "nav.focus": "Manufarmu",
    "nav.conference": "Taro",
    "nav.membership": "Ƙungiyan Membobi",
    "nav.media": "Kafofin Watsa Labarai",
    "nav.events": "Ayyuka",
    "nav.donate": "Bayar da Gudummawa",
    "nav.contact": "Tuntuɓi Mu",
    "nav.login": "Shiga",
    "nav.register": "Yi Rijista",
    "button.learnMore": "Ƙara Koyo",
    "button.viewAll": "Duba Duka",

    // More translations would be added here
  },
}

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguageState] = useState<Language>("en")

  useEffect(() => {
    // Check if there's a saved language preference
    const savedLanguage = localStorage.getItem("language") as Language
    if (savedLanguage && ["en", "ar", "ha"].includes(savedLanguage)) {
      setLanguageState(savedLanguage)
    }

    // Set the dir attribute on the html element for RTL languages
    if (language === "ar") {
      document.documentElement.dir = "rtl"
      document.documentElement.lang = "ar"
    } else {
      document.documentElement.dir = "ltr"
      document.documentElement.lang = language
    }
  }, [language])

  const setLanguage = (newLanguage: Language) => {
    setLanguageState(newLanguage)
    localStorage.setItem("language", newLanguage)
  }

  const t = (key: string): string => {
    return translations[language][key as keyof (typeof translations)[typeof language]] || key
  }

  return <LanguageContext.Provider value={{ language, setLanguage, t }}>{children}</LanguageContext.Provider>
}

export function useLanguage() {
  const context = useContext(LanguageContext)
  if (context === undefined) {
    throw new Error("useLanguage must be used within a LanguageProvider")
  }
  return context
}
