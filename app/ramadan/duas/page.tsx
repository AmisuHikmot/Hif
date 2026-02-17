'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Copy, Check } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface Dua {
  id: string;
  title: string;
  category: string;
  arabic_text: string;
  arabic_transliteration: string | null;
  english_translation: string;
  reference: string | null;
  audio_url: string | null;
  is_featured: boolean;
  order_rank: number;
}

const DUA_CATEGORIES = [
  { id: 'suhoor', label: 'Suhoor (Before Fasting)' },
  { id: 'iftar', label: 'Iftar (Breaking Fast)' },
  { id: 'forgiveness', label: 'Forgiveness' },
  { id: 'last-ten-nights', label: 'Last 10 Nights' },
];

export default function RamadanDuasPage() {
  const [duas, setDuas] = useState<Dua[]>([]);
  const [loading, setLoading] = useState(true);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [activeCategory, setActiveCategory] = useState('suhoor');
  const { toast } = useToast();

  useEffect(() => {
    const fetchDuas = async () => {
      try {
        const response = await fetch('/api/ramadan/content?type=duas');
        const fetchedDuas = await response.json();
        setDuas(fetchedDuas);
      } catch (error) {
        console.error('[v0] Error fetching duas:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchDuas();
  }, []);

  const handleCopy = (duaId: string, text: string) => {
    navigator.clipboard.writeText(text).then(() => {
      setCopiedId(duaId);
      toast({
        title: 'Copied',
        description: 'Dua copied to clipboard',
      });
      setTimeout(() => setCopiedId(null), 2000);
    });
  };

  const getCategoryDuas = (category: string) => {
    return duas.filter((dua) => dua.category === category);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-950 to-slate-900 py-12 px-4">
      <div className="max-w-3xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-white mb-2">Ramadan Duas</h1>
          <p className="text-slate-400">Essential supplications for the blessed month</p>
        </div>

        {loading ? (
          <div className="text-center text-slate-300">Loading duas...</div>
        ) : (
          <Tabs value={activeCategory} onValueChange={setActiveCategory} className="w-full">
            {/* Tabs List */}
            <TabsList className="grid w-full grid-cols-2 md:grid-cols-4 bg-slate-900/50 border border-slate-700">
              {DUA_CATEGORIES.map((category) => (
                <TabsTrigger
                  key={category.id}
                  value={category.id}
                  className="text-xs md:text-sm data-[state=active]:bg-emerald-600/20 data-[state=active]:text-emerald-400"
                >
                  {category.label}
                </TabsTrigger>
              ))}
            </TabsList>

            {/* Tab Contents */}
            {DUA_CATEGORIES.map((category) => (
              <TabsContent key={category.id} value={category.id} className="space-y-4 mt-6">
                {getCategoryDuas(category.id).length > 0 ? (
                  getCategoryDuas(category.id).map((dua) => (
                    <Card
                      key={dua.id}
                      className="bg-slate-900/50 border-slate-700 backdrop-blur"
                    >
                      <CardHeader>
                        <CardTitle className="text-emerald-400 text-lg">
                          {dua.title}
                        </CardTitle>
                        {dua.reference && (
                          <CardDescription className="text-slate-500">
                            {dua.reference}
                          </CardDescription>
                        )}
                      </CardHeader>

                      <CardContent className="space-y-6">
                        {/* Arabic Text */}
                        <div>
                          <p className="text-slate-400 text-sm mb-3">Arabic</p>
                          <div className="relative">
                            <p className="text-xl leading-relaxed text-white font-arabic bg-slate-950/30 p-4 rounded">
                              {dua.arabic_text}
                            </p>
                            <Button
                              size="sm"
                              variant="ghost"
                              className="absolute top-2 right-2"
                              onClick={() => handleCopy(dua.id, dua.arabic_text)}
                            >
                              {copiedId === dua.id ? (
                                <Check className="h-4 w-4 text-emerald-400" />
                              ) : (
                                <Copy className="h-4 w-4 text-slate-400" />
                              )}
                            </Button>
                          </div>
                        </div>

                        {/* Transliteration */}
                        {dua.arabic_transliteration && (
                          <div>
                            <p className="text-slate-400 text-sm mb-3">Transliteration</p>
                            <p className="text-base leading-relaxed text-slate-300 italic bg-slate-950/30 p-4 rounded">
                              {dua.arabic_transliteration}
                            </p>
                          </div>
                        )}

                        {/* English Translation */}
                        <div>
                          <p className="text-slate-400 text-sm mb-3">English Translation</p>
                          <p className="text-base leading-relaxed text-slate-200 bg-slate-950/30 p-4 rounded">
                            {dua.english_translation}
                          </p>
                        </div>

                        {/* Audio */}
                        {dua.audio_url && (
                          <div>
                            <p className="text-slate-400 text-sm mb-3">Audio</p>
                            <audio
                              controls
                              className="w-full"
                              src={dua.audio_url}
                            />
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  ))
                ) : (
                  <Card className="bg-slate-900/50 border-slate-700">
                    <CardContent className="py-8 text-center text-slate-400">
                      <p>No duas available in this category yet.</p>
                    </CardContent>
                  </Card>
                )}
              </TabsContent>
            ))}
          </Tabs>
        )}

        {/* Footer Note */}
        <div className="mt-12 p-6 bg-emerald-600/10 border border-emerald-600/20 rounded-lg text-center text-slate-300 text-sm">
          <p>Bookmark this page for easy access to Ramadan supplications.</p>
        </div>
      </div>
    </div>
  );
}
