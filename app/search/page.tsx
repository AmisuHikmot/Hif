import type { Metadata } from "next"
import { SearchResults } from "@/components/search/search-results"

export const metadata: Metadata = {
  title: "Search | Hamduk Islamic Foundation",
  description: "Search for content across the Hamduk Islamic Foundation website",
}

interface SearchPageProps {
  searchParams: { q?: string }
}

export default function SearchPage({ searchParams }: SearchPageProps) {
  const query = searchParams.q || ""

  return (
    <main className="container mx-auto px-4 py-12">
      <div className="mb-12 text-center">
        <h1 className="text-4xl font-bold tracking-tight text-emerald-900 dark:text-emerald-500 mb-4">
          Search Results
        </h1>
        {query ? (
          <p className="text-lg text-gray-600 dark:text-gray-400 max-w-3xl mx-auto">
            Showing results for <span className="font-medium">"{query}"</span>
          </p>
        ) : (
          <p className="text-lg text-gray-600 dark:text-gray-400 max-w-3xl mx-auto">
            Enter a search term to find content across our website
          </p>
        )}
      </div>

      <SearchResults query={query} />
    </main>
  )
}
