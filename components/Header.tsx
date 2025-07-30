"use client"

import { useState, useRef, useEffect } from "react"
import useSWR from 'swr';
import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { motion, AnimatePresence } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Menu, X, Camera, Lock, Info, Heart } from "lucide-react"
import { UserNav } from "./auth/UserNav"
import { useMobileMenu } from "@/hooks/useMobileMenu"
import supabase from '@/lib/supabase/client';
import { useAuth } from '@/components/providers/AuthProvider';
import TestComponent from '../components/admin/TestComponent';
import type { EditableTitleSectionType } from '@/app/custom_pages/types/sections';

interface SectionNavDropdownProps {
  sections: EditableTitleSectionType[];
}

function SectionNavDropdown({ sections }: SectionNavDropdownProps) {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownTimeout = useRef<NodeJS.Timeout | null>(null);

  const handleDropdownEnter = () => {
    if (dropdownTimeout.current) clearTimeout(dropdownTimeout.current);
    setDropdownOpen(true);
  };
  
  const handleDropdownLeave = () => {
    dropdownTimeout.current = setTimeout(() => setDropdownOpen(false), 120);
  };

  return (
    <div className="relative" onMouseEnter={handleDropdownEnter} onMouseLeave={handleDropdownLeave}>
      <button 
        className="transition-colors hover:text-foreground/80 text-foreground/60 flex items-center" 
        type="button"
        onClick={() => setDropdownOpen(!dropdownOpen)}
      >
        Page Links
        <svg className="ml-1 h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d={dropdownOpen ? "M5 15l7-7 7 7" : "M19 9l-7 7-7-7"} />
        </svg>
      </button>
      {dropdownOpen && (
        <div className="absolute left-0 mt-2 min-w-[160px] rounded-md bg-popover shadow-lg z-50 border">
          {sections.length === 0 ? (
            <div className="px-4 py-2 text-sm text-muted-foreground">No sections</div>
          ) : (
            sections.map((section: EditableTitleSectionType) => (
              <a
                key={section.id}
                href={`#${section.slug}`}
                className="block px-4 py-2 text-sm hover:bg-muted rounded-md"
                onClick={() => setDropdownOpen(false)}
              >
                {section.title}
              </a>
            ))
          )}
        </div>
      )}
    </div>
  );
}

export function Header() {
  // Hooks and state declarations
  const { isOpen, toggle } = useMobileMenu();
  const { user, isAdmin, loading } = useAuth();
  const [sections, setSections] = useState<EditableTitleSectionType[]>([]);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [mobileDropdownOpen, setMobileDropdownOpen] = useState(false);

  // Fetch sections for dropdown
  useEffect(() => {
    async function fetchSections() {
      const { data: components } = await supabase
        .from('root_page_components')
        .select('content')
        .eq('page_slug', 'home')
        .eq('component_type', 'sections')
        .single();
      const allSections = components?.content || [];
      setSections(allSections.filter((sec: any) => sec.type === 'editable-title'));
    }
    fetchSections();
  }, []);
  
  // SWR fetcher for custom pages
  const fetcher = (url: string) => fetch(url).then(res => res.json());
  const { data, error: customPagesError, isLoading: customPagesLoading, mutate: refreshCustomPages } = useSWR('/api/pages/list', fetcher, {
    revalidateOnFocus: true,
    refreshInterval: 0,
  });
  const customPages = data?.pages || [];
  
  // Debug logging
  useEffect(() => {
    if (data) {
      console.log('Custom pages data:', data);
      console.log('Custom pages array:', customPages);
    }
    if (customPagesError) {
      console.error('Custom pages error:', customPagesError);
    }
  }, [data, customPagesError, customPages]);
  const dropdownTimeout = useRef<NodeJS.Timeout | null>(null);
  const mobileDropdownTimeout = useRef<NodeJS.Timeout | null>(null);

  const handleDropdownEnter = () => {
    if (dropdownTimeout.current) clearTimeout(dropdownTimeout.current);
    setDropdownOpen(true);
  };
  const handleDropdownLeave = () => {
    dropdownTimeout.current = setTimeout(() => setDropdownOpen(false), 120);
  };

  const handleMobileDropdownEnter = () => {
    if (mobileDropdownTimeout.current) clearTimeout(mobileDropdownTimeout.current);
    setMobileDropdownOpen(true);
  };
  const handleMobileDropdownLeave = () => {
    mobileDropdownTimeout.current = setTimeout(() => setMobileDropdownOpen(false), 120);
  };

  const pathname = usePathname();
  const router = useRouter();

  const handleSignOut = async () => {
    try {
      const { error } = await supabase.auth.signOut()
      if (error) throw error
      router.push('/auth/login')
    } catch (error) {
      console.error('Error signing out:', error)
    }
  }

  const links = [
    { href: "/", label: "Home", icon: <Heart className="h-5 w-5" /> },
  ]

  // Get admin email from app_settings
  const settingsFetcher = (url: string) => fetch(url).then(res => res.json());
  const { data: settingsData } = useSWR('/api/settings', settingsFetcher);
  const adminEmail = settingsData?.settings?.admin_email;

  console.log('user:', user, 'isAdmin:', isAdmin);

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-14 items-center">
        <div className="mr-4 hidden md:flex">
          <Link href="/" className="hover:opacity-80 transition-opacity">
            <span className="hidden font-bold sm:inline-block">
              Digital&nbsp;&nbsp;&nbsp;
            </span>
          </Link>
          <Link href="/" className="mr-6 flex items-center space-x-2">
            <Heart className="h-6 w-6" />
            <span className="hidden font-bold sm:inline-block">
              Media Store
            </span>
          </Link>
          <nav className="flex items-center space-x-6 text-sm font-medium">
              <SectionNavDropdown sections={sections} />
            <Link href="#products"
                  className="transition-colors hover:text-foreground/80 text-foreground/60">
                Products
             </Link>
            <Link href="/#contact-us"
                  className="transition-colors hover:text-foreground/80 text-foreground/60">
                Contact Us
             </Link>
          </nav>
        </div>
        <button
          className="mr-2 px-0 text-base hover:bg-transparent focus-visible:bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0 md:hidden"
          onClick={toggle}
        >
          <Menu className="h-6 w-6" />
          <span className="sr-only">Toggle Menu</span>
        </button>
        <div className="flex flex-1 items-center justify-between space-x-2 md:justify-end">
          <div className="w-full flex-1 md:w-auto md:flex-none flex items-center gap-2">
            {/* Always show the nav dropdown */}
            {loading ? null : user ? (
              <UserNav user={user} />
            ) : (
              <div className="flex items-center space-x-2"></div>
            )}
          </div>
        </div>
      </div>
      {isOpen && (
        <div className="fixed inset-0 top-14 z-50 h-[calc(100vh-4rem)] overflow-auto bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 p-4 md:hidden">
          <div className="relative z-20 rounded-lg bg-popover p-4 text-popover-foreground shadow-md">
            <nav className="space-y-2">
              <div className="relative"
                onMouseEnter={handleMobileDropdownEnter}
                onMouseLeave={handleMobileDropdownLeave}
              >
                <button
                  className="flex w-full items-center rounded-md p-2 text-sm font-medium hover:underline"
                  onClick={() => setMobileDropdownOpen((v) => !v)}
                  type="button"
                  aria-expanded={mobileDropdownOpen}
                  aria-controls="mobile-page-links-dropdown"
                >
                  Page Links
                  <svg className="ml-1 h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" /></svg>
                </button>
                {mobileDropdownOpen && (
                  <div className="mt-2 ml-2 space-y-1">
                    {sections.length === 0 ? (
                      <div className="px-4 py-2 text-sm text-muted-foreground">No sections</div>
                    ) : (
                      sections.map((section: EditableTitleSectionType) => (
                        <a
                          key={section.id}
                          href={`#${section.slug}`}
                          className="block px-4 py-2 text-sm hover:bg-muted rounded-md"
                          onClick={(e) => {
                            e.preventDefault();
                            setMobileDropdownOpen(false);
                            toggle(); // Close the mobile menu
                            window.location.href = `#${section.slug}`; // Manually handle navigation
                          }}
                        >
                          {section.title}
                        </a>
                      ))
                    )}
                  </div>
                )}
              </div>
              <a href="#contact-us"
                  className="transition-colors hover:text-foreground/80 text-foreground/60 block px-4 py-2 text-sm hover:bg-muted rounded-md w-full text-left"
                  onClick={(e) => {
                    e.preventDefault();
                    toggle();
                    window.location.href = '#contact-us';
                  }}>  
                Contact Us
              </a>
            </nav>
          </div>
        </div>
      )}
    </header>
  )
}
