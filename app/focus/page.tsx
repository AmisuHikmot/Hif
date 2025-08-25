import type { Metadata } from "next"
import Image from "next/image"
import Link from "next/link"
import { ArrowRight, BookOpen, Users, ChurchIcon as Mosque, Megaphone } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"

export const metadata: Metadata = {
  title: "Our Focus | Hamduk Islamic Foundation",
  description: "Learn about the key focus areas of Hamduk Islamic Foundation",
}

export default function FocusPage() {
  return (
    <main className="container mx-auto px-4 py-12">
      <div className="mb-10 text-center">
        <h1 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-gray-100 sm:text-4xl md:text-5xl">
          Our Focus Areas
        </h1>
        <p className="mt-4 text-lg text-gray-600 dark:text-gray-400">
          Hamduk Islamic Foundation is dedicated to promoting Islamic values and knowledge through various initiatives
        </p>
      </div>

      <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
        <Card className="overflow-hidden">
          <div className="relative h-48">
            <Image src="/placeholder.svg?height=200&width=400" alt="Ramadan Tafsir" fill className="object-cover" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
            <div className="absolute bottom-4 left-4 right-4">
              <h2 className="text-xl font-bold text-white">Ramadan Tafsir</h2>
            </div>
          </div>
          <CardContent className="p-6">
            <div className="mb-4 flex items-center justify-center rounded-full bg-emerald-100 p-3 w-12 h-12">
              <BookOpen className="h-6 w-6 text-emerald-700" />
            </div>
            <p className="mb-4 text-gray-600 dark:text-gray-400">
              Our annual Ramadan Tafsir program provides in-depth interpretation of the Quran during the holy month of
              Ramadan, featuring renowned Islamic scholars.
            </p>
            <Button asChild className="w-full">
              <Link href="/focus/ramadan-tafsir">
                Learn More <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </CardContent>
        </Card>

        <Card className="overflow-hidden">
          <div className="relative h-48">
            <Image src="/placeholder.svg?height=200&width=400" alt="Periodic Lectures" fill className="object-cover" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
            <div className="absolute bottom-4 left-4 right-4">
              <h2 className="text-xl font-bold text-white">Periodic Lectures</h2>
            </div>
          </div>
          <CardContent className="p-6">
            <div className="mb-4 flex items-center justify-center rounded-full bg-emerald-100 p-3 w-12 h-12">
              <Megaphone className="h-6 w-6 text-emerald-700" />
            </div>
            <p className="mb-4 text-gray-600 dark:text-gray-400">
              We organize regular lectures on various Islamic topics to educate and inspire our community, addressing
              contemporary issues from an Islamic perspective.
            </p>
            <Button asChild className="w-full">
              <Link href="/focus/lectures">
                Learn More <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </CardContent>
        </Card>

        <Card className="overflow-hidden">
          <div className="relative h-48">
            <Image src="/placeholder.svg?height=200&width=400" alt="Training" fill className="object-cover" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
            <div className="absolute bottom-4 left-4 right-4">
              <h2 className="text-xl font-bold text-white">Training</h2>
            </div>
          </div>
          <CardContent className="p-6">
            <div className="mb-4 flex items-center justify-center rounded-full bg-emerald-100 p-3 w-12 h-12">
              <Users className="h-6 w-6 text-emerald-700" />
            </div>
            <p className="mb-4 text-gray-600 dark:text-gray-400">
              Our training programs focus on developing leadership skills, Islamic knowledge, and personal growth for
              Muslims of all ages, with special emphasis on youth development.
            </p>
            <Button asChild className="w-full">
              <Link href="/focus/training">
                Learn More <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </CardContent>
        </Card>

        <Card className="overflow-hidden">
          <div className="relative h-48">
            <Image src="/placeholder.svg?height=200&width=400" alt="Advocacy" fill className="object-cover" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
            <div className="absolute bottom-4 left-4 right-4">
              <h2 className="text-xl font-bold text-white">Advocacy</h2>
            </div>
          </div>
          <CardContent className="p-6">
            <div className="mb-4 flex items-center justify-center rounded-full bg-emerald-100 p-3 w-12 h-12">
              <Mosque className="h-6 w-6 text-emerald-700" />
            </div>
            <p className="mb-4 text-gray-600 dark:text-gray-400">
              We advocate for Islamic values and interests in public discourse, promoting interfaith dialogue and
              understanding to build bridges between communities.
            </p>
            <Button asChild className="w-full">
              <Link href="/focus/advocacy">
                Learn More <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </CardContent>
        </Card>
      </div>

      <div className="mt-16">
        <h2 className="mb-8 text-2xl font-bold text-center">Featured Programs</h2>
        <div className="grid gap-8 md:grid-cols-2">
          <div className="group relative overflow-hidden rounded-lg">
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-black/20 z-10" />
            <Image
              src="/placeholder.svg?height=400&width=600"
              alt="Ramadan Tafsir Program"
              width={600}
              height={400}
              className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
            />
            <div className="absolute inset-0 z-20 flex flex-col justify-end p-6 text-white">
              <h3 className="mb-2 text-2xl font-bold">Ramadan Tafsir Program</h3>
              <p className="mb-4 text-white/80">
                Join us for our annual Ramadan Tafsir program, featuring renowned Islamic scholars and in-depth Quranic
                interpretation.
              </p>
              <Button asChild variant="outline" className="w-fit border-white text-white hover:bg-white/20">
                <Link href="/focus/ramadan-tafsir">
                  Learn More <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </div>
          </div>

          <div className="grid gap-4">
            <div className="group relative overflow-hidden rounded-lg">
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-black/20 z-10" />
              <Image
                src="/placeholder.svg?height=200&width=600"
                alt="Youth Development Program"
                width={600}
                height={200}
                className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
              />
              <div className="absolute inset-0 z-20 flex flex-col justify-end p-6 text-white">
                <h3 className="mb-2 text-xl font-bold">Youth Development Program</h3>
                <p className="mb-4 text-white/80">
                  Empowering the next generation of Muslim leaders through education and mentorship.
                </p>
                <Button asChild variant="link" className="w-fit p-0 text-white hover:text-white/80">
                  <Link href="/focus/youth-development">
                    Learn More <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
              </div>
            </div>

            <div className="group relative overflow-hidden rounded-lg">
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-black/20 z-10" />
              <Image
                src="/placeholder.svg?height=200&width=600"
                alt="Islamic Education Initiative"
                width={600}
                height={200}
                className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
              />
              <div className="absolute inset-0 z-20 flex flex-col justify-end p-6 text-white">
                <h3 className="mb-2 text-xl font-bold">Islamic Education Initiative</h3>
                <p className="mb-4 text-white/80">
                  Promoting Islamic knowledge and education through lectures, workshops, and publications.
                </p>
                <Button asChild variant="link" className="w-fit p-0 text-white hover:text-white/80">
                  <Link href="/focus/education">
                    Learn More <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}
