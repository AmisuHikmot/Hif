'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowRight, Clock } from 'lucide-react';

interface KnowledgeArticle {
  id: string;
  slug: string;
  title: string;
  description: string | null;
  content: string;
  category: string | null;
  difficulty_level: string;
  read_time_minutes: number | null;
  image_url: string | null;
  order_rank: number;
}

export default function RamadanKnowledgePage() {
  const [articles, setArticles] = useState<KnowledgeArticle[]>([]);
  const [loading, setLoading] = useState(true);
  const [expandedId, setExpandedId] = useState<string | null>(null);

  useEffect(() => {
    const fetchArticles = async () => {
      try {
        const response = await fetch('/api/ramadan/content?type=knowledge');
        const fetchedArticles = await response.json();
        setArticles(fetchedArticles);
      } catch (error) {
        console.error('[v0] Error fetching articles:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchArticles();
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-950 to-slate-900 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-white mb-2">Learn About Ramadan</h1>
          <p className="text-slate-400">
            Understand the spiritual significance and practical aspects of Ramadan
          </p>
        </div>

        {/* Articles Grid */}
        {loading ? (
          <div className="text-center text-slate-300">Loading articles...</div>
        ) : articles.length > 0 ? (
          <div className="space-y-4">
            {articles.map((article) => (
              <Card
                key={article.id}
                className="bg-slate-900/50 border-slate-700 backdrop-blur hover:border-emerald-600/50 transition-colors cursor-pointer"
                onClick={() =>
                  setExpandedId(expandedId === article.id ? null : article.id)
                }
              >
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <CardTitle className="text-emerald-400 mb-2">
                        {article.title}
                      </CardTitle>
                      <CardDescription className="text-slate-400">
                        {article.description}
                      </CardDescription>
                    </div>
                    <ArrowRight
                      className={`h-5 w-5 text-emerald-400 transition-transform ${
                        expandedId === article.id ? 'rotate-90' : ''
                      }`}
                    />
                  </div>

                  {/* Meta Info */}
                  <div className="flex items-center gap-4 mt-4 text-xs text-slate-500">
                    {article.read_time_minutes && (
                      <span className="flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        {article.read_time_minutes} min read
                      </span>
                    )}
                    {article.category && (
                      <span className="bg-slate-800 px-2 py-1 rounded">
                        {article.category}
                      </span>
                    )}
                    <span className="bg-slate-800 px-2 py-1 rounded capitalize">
                      {article.difficulty_level}
                    </span>
                  </div>
                </CardHeader>

                {/* Expanded Content */}
                {expandedId === article.id && (
                  <CardContent className="border-t border-slate-700 pt-6">
                    {article.image_url && (
                      <img
                        src={article.image_url}
                        alt={article.title}
                        className="w-full h-48 object-cover rounded-lg mb-6"
                      />
                    )}
                    <div className="prose prose-invert max-w-none">
                      <p className="text-slate-200 leading-relaxed whitespace-pre-wrap">
                        {article.content}
                      </p>
                    </div>
                  </CardContent>
                )}
              </Card>
            ))}
          </div>
        ) : (
          <Card className="bg-slate-900/50 border-slate-700">
            <CardContent className="py-12 text-center text-slate-300">
              <p>No articles available yet.</p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
