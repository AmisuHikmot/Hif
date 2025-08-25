"use client"

import { useRouter } from "next/navigation"
import Image from "next/image"
import { ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"

export default function FeaturedPrograms() {
  const router = useRouter()

  const handleNavigation = (href: string) => {
    router.push(href)
    window.scrollTo({ top: 0, behavior: "smooth" })
  }

  return (
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
          <Button
            variant="outline"
            className="w-fit border-white text-white hover:bg-white/20"
            onClick={() => handleNavigation("/focus/ramadan-tafsir")}
          >
            Learn More <ArrowRight className="ml-2 h-4 w-4" />
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
            <Button
              variant="link"
              className="w-fit p-0 text-white hover:text-white/80"
              onClick={() => handleNavigation("/focus/youth-development")}
            >
              Learn More <ArrowRight className="ml-2 h-4 w-4" />
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
            <Button
              variant="link"
              className="w-fit p-0 text-white hover:text-white/80"
              onClick={() => handleNavigation("/focus/education")}
            >
              Learn More <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
