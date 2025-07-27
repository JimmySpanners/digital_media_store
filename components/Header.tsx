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

function SectionNavDropdown() {
  const [sections, setSections] = useState<EditableTitleSectionType[]>([]);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownTimeout = useRef<NodeJS.Timeout | null>(null);

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

  const handleDropdownEnter = () => {
    if (dropdownTimeout.current) clearTimeout(dropdownTimeout.current);
    setDropdownOpen(true);
  };
  const handleDropdownLeave = () => {
    dropdownTimeout.current = setTimeout(() => setDropdownOpen(false), 120);
  };

  return (
    <div className="relative" onMouseEnter={handleDropdownEnter} onMouseLeave={handleDropdownLeave}>
      <button className="transition-colors hover:text-foreground/80 text-foreground/60 flex items-center" type="button">
        Page Links
        <svg className="ml-1 h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" /></svg>
      </button>
      {dropdownOpen && (
        <div className="absolute left-0 mt-2 min-w-[160px] rounded-md bg-white shadow-lg z-50 border dark:bg-background">
          {sections.length === 0 && (
            <div className="px-4 py-2 text-sm text-muted-foreground">No sections</div>
          )}
          {sections.map((section: EditableTitleSectionType) => (
            <a
              key={section.id}
              href={`#${section.slug}`}
              className="block px-4 py-2 text-sm hover:bg-muted"
            >
              {section.title}
            </a>
          ))}
        </div>
      )}
    </div>
  );
}

export function Header() {
  // Hooks and state declarations
  const { isOpen, toggle } = useMobileMenu();
  const { user, isAdmin, loading } = useAuth();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [mobileDropdownOpen, setMobileDropdownOpen] = useState(false);
  
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
            <SectionNavDropdown />
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
        <div className="fixed inset-0 top-14 z-50 grid h-[calc(100vh-4rem)] grid-flow-row auto-rows-fr overflow-auto p-6 pb-32 md:hidden">
          <div className="relative z-20 grid gap-6 rounded-lg bg-popover p-4 text-popover-foreground shadow-md">
            <nav className="grid grid-flow-row auto-rows-96 text-sm">
              <div className="relative"
                onMouseEnter={handleMobileDropdownEnter}
                onMouseLeave={handleMobileDropdownLeave}
              >
                <button
                  className="flex w-full items-center rounded-md p-2 text-sm font-medium hover:underline"
                  onClick={() => setMobileDropdownOpen((v) => !v)}
                  type="button"
                  aria-expanded={mobileDropdownOpen}
                  aria-controls="mobile-services-dropdown"
                >
                  Services
                  <svg className="ml-1 h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" /></svg>
                </button>
                {mobileDropdownOpen && (
                  <div
                    id="mobile-services-dropdown"
                    className="mt-2 ml-2 min-w-[160px] rounded-md bg-white shadow-lg border dark:bg-background"
                  >
                    {/* Removed: Gallery, Exclusive, Behind Scenes, and custom pages links */}
                  </div>
                )}
              </div>
              <Link href="#contact-us"
                  className="transition-colors hover:text-foreground/80 text-foreground/60">
                Contact Us
             </Link>
            </nav>
          </div>
        </div>
      )}
    </header>
  )
}
