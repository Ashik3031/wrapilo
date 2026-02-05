'use client';

import React, { useEffect, useState } from 'react';
import Hero from '@/components/Hero';
import DynamicHomeSection from '@/components/DynamicHomeSection';
import SeasonalCollections from '@/components/SeasonalCollections';
import TrendingProductsReveal from '@/components/TrendingProductsReveal';
import { Loader2 } from 'lucide-react';

interface HomeSection {
  _id: string;
  title: string;
  type: 'subcategories' | 'products' | 'featured';
  category: any;
  order: number;
  isActive: boolean;
}

export default function Home() {
  const [sections, setSections] = useState<HomeSection[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSections = async () => {
      try {
        const res = await fetch('/api/home-sections');
        const data = await res.json();
        if (data.success) {
          // Filter active sections and sort by order
          const activeSections = data.data
            .filter((s: HomeSection) => s.isActive)
            .sort((a: HomeSection, b: HomeSection) => a.order - b.order);
          setSections(activeSections);
        }
      } catch (error) {
        console.error('Failed to fetch sections', error);
      } finally {
        setLoading(false);
      }
    };

    fetchSections();
  }, []);

  // Separate sections that should appear before trending (order < 0)
  const featuredSections = sections.filter(s => s.order < 0);
  const regularSections = sections.filter(s => s.order >= 0);

  return (
    <main className="min-h-screen bg-white">
      <Hero />

      {/* Featured sections (order < 0) appear before trending */}
      {loading ? (
        <div className="container mx-auto px-8 py-12 flex justify-center">
          <Loader2 className="animate-spin text-gray-200" size={32} />
        </div>
      ) : (
        <>
          {featuredSections.map((section) => (
            <DynamicHomeSection key={section._id} section={section} />
          ))}
        </>
      )}

      <TrendingProductsReveal />
      <SeasonalCollections />

      {/* Regular sections (order >= 0) appear after seasonal */}
      {loading ? (
        <div className="container mx-auto px-8 py-20 flex flex-col items-center justify-center gap-4">
          <Loader2 className="animate-spin text-gray-200" size={48} />
          <p className="text-gray-400 font-medium tracking-wide animate-pulse">Designing your experience...</p>
        </div>
      ) : (
        <>
          {regularSections.map((section) => (
            <DynamicHomeSection key={section._id} section={section} />
          ))}
        </>
      )}
    </main>
  );
}
