import type { Metadata } from "next"
import Image from "next/image"

export const metadata: Metadata = {
  title: "Founding Members | Hamduk Islamic Foundation",
  description: "Learn about the founding members of Hamduk Islamic Foundation",
}

export default function FoundingMembersPage() {
  return (
    <main className="container mx-auto px-4 py-12">
      <div className="mx-auto max-w-4xl">
        <div className="mb-10 text-center">
          <h1 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-gray-100 sm:text-4xl md:text-5xl">
            Founding Members
          </h1>
          <p className="mt-4 text-lg text-gray-600 dark:text-gray-400">
            Meet the visionary individuals who established Hamduk Islamic Foundation in 1996
          </p>
        </div>

        <div className="relative mb-12 h-[300px] w-full overflow-hidden rounded-xl sm:h-[400px]">
          <Image
            src="/placeholder.svg?height=400&width=1200"
            alt="Hamduk Islamic Foundation Founding Members"
            fill
            className="object-cover"
          />
        </div>

        <div className="prose prose-emerald mx-auto max-w-none dark:prose-invert">
          <h2>The Visionaries Behind Hamduk Islamic Foundation</h2>
          <p>
            In 1996, a group of dedicated Muslim professionals came together with a shared vision: to establish an
            organization that would promote Islamic education, community development, and humanitarian services in
            Nigeria. These visionaries, with their diverse backgrounds and expertise, laid the foundation for what would
            become one of the most impactful Islamic organizations in the country.
          </p>

          <div className="mt-12 grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            <div className="flex flex-col items-center text-center">
              <div className="relative h-40 w-40 overflow-hidden rounded-full">
                <Image
                  src="/placeholder.svg?height=160&width=160"
                  alt="Dr. Ibrahim Yusuf"
                  fill
                  className="object-cover"
                />
              </div>
              <h3 className="mt-4 text-xl font-bold">Dr. Ibrahim Yusuf</h3>
              <p className="text-sm text-emerald-600 dark:text-emerald-400">Founding Chairman</p>
              <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
                A renowned Islamic scholar and educator who dedicated his life to promoting Islamic knowledge and
                values.
              </p>
            </div>

            <div className="flex flex-col items-center text-center">
              <div className="relative h-40 w-40 overflow-hidden rounded-full">
                <Image
                  src="/placeholder.svg?height=160&width=160"
                  alt="Alhaji Mohammed Abdullahi"
                  fill
                  className="object-cover"
                />
              </div>
              <h3 className="mt-4 text-xl font-bold">Alhaji Mohammed Abdullahi</h3>
              <p className="text-sm text-emerald-600 dark:text-emerald-400">Founding Secretary</p>
              <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
                A dedicated community leader with a passion for Islamic education and youth development.
              </p>
            </div>

            <div className="flex flex-col items-center text-center">
              <div className="relative h-40 w-40 overflow-hidden rounded-full">
                <Image
                  src="/placeholder.svg?height=160&width=160"
                  alt="Hajiya Fatima Hassan"
                  fill
                  className="object-cover"
                />
              </div>
              <h3 className="mt-4 text-xl font-bold">Hajiya Fatima Hassan</h3>
              <p className="text-sm text-emerald-600 dark:text-emerald-400">Founding Treasurer</p>
              <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
                A financial expert who ensured the foundation's resources were managed with transparency and integrity.
              </p>
            </div>

            <div className="flex flex-col items-center text-center">
              <div className="relative h-40 w-40 overflow-hidden rounded-full">
                <Image
                  src="/placeholder.svg?height=160&width=160"
                  alt="Sheikh Abdullah Ibrahim"
                  fill
                  className="object-cover"
                />
              </div>
              <h3 className="mt-4 text-xl font-bold">Sheikh Abdullah Ibrahim</h3>
              <p className="text-sm text-emerald-600 dark:text-emerald-400">Founding Spiritual Advisor</p>
              <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
                A respected Islamic scholar who provided spiritual guidance and ensured the foundation's activities
                aligned with Islamic principles.
              </p>
            </div>

            <div className="flex flex-col items-center text-center">
              <div className="relative h-40 w-40 overflow-hidden rounded-full">
                <Image
                  src="/placeholder.svg?height=160&width=160"
                  alt="Dr. Aisha Mohammed"
                  fill
                  className="object-cover"
                />
              </div>
              <h3 className="mt-4 text-xl font-bold">Dr. Aisha Mohammed</h3>
              <p className="text-sm text-emerald-600 dark:text-emerald-400">Founding Education Director</p>
              <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
                An education specialist who developed the foundation's educational programs and curriculum.
              </p>
            </div>

            <div className="flex flex-col items-center text-center">
              <div className="relative h-40 w-40 overflow-hidden rounded-full">
                <Image
                  src="/placeholder.svg?height=160&width=160"
                  alt="Alhaji Yusuf Musa"
                  fill
                  className="object-cover"
                />
              </div>
              <h3 className="mt-4 text-xl font-bold">Alhaji Yusuf Musa</h3>
              <p className="text-sm text-emerald-600 dark:text-emerald-400">Founding Public Relations Officer</p>
              <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
                A communications expert who helped establish the foundation's presence in the community.
              </p>
            </div>
          </div>

          <h2 className="mt-12">Their Legacy</h2>
          <p>
            The founding members of Hamduk Islamic Foundation laid a strong foundation based on the principles of
            knowledge, compassion, and service to humanity. Their vision and dedication have enabled the foundation to
            grow and expand its reach, impacting thousands of lives across Nigeria.
          </p>
          <p>
            Today, we continue to build on their legacy, guided by the same principles and values that inspired them to
            establish this organization. We remain committed to their vision of promoting Islamic education, community
            development, and humanitarian services.
          </p>
          <p>
            We honor their contributions and strive to uphold the standards of excellence they set for Hamduk Islamic
            Foundation. Their legacy lives on in every program we organize, every student we educate, and every life we
            touch.
          </p>
        </div>
      </div>
    </main>
  )
}
