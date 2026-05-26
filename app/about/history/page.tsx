import Image from "next/image"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "History & Philosophy | Hamduk Islamic Foundation",
  description: "Learn about the history and philosophy of Hamduk Islamic Foundation.",
}

export default function HistoryPage() {
  return (
    <main className="container mx-auto px-4 py-12">
      <div className="mx-auto max-w-4xl">
        <div className="mb-10 text-center">
          <h1 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-gray-100 sm:text-4xl md:text-5xl">
            Our History & Philosophy
          </h1>
          <p className="mt-4 text-lg text-gray-600 dark:text-gray-400">
            The journey and guiding principles of Hamduk Islamic Foundation
          </p>
        </div>

        <div className="relative mb-12 h-[300px] w-full overflow-hidden rounded-xl sm:h-[400px]">
          <Image
            src="/placeholder.svg?height=400&width=1200"
            alt="Hamduk Islamic Foundation History"
            fill
            className="object-cover"
          />
        </div>

        <div className="prose prose-emerald mx-auto max-w-none dark:prose-invert">
          <h2>Our Beginnings</h2>
          <p>
            The Hamduk Islamic Foundation (H.I.F.) was established in 1996 as a forum for Muslim professionals to make
            their expertise available for the propagation of Islam. The foundation was born out of a desire to address
            the growing need for Islamic education, community development, and humanitarian services in Nigeria.
          </p>
          <p>
            Founded by a group of dedicated Muslim professionals from various fields, the foundation started with small
            gatherings and educational sessions in Lagos. Over the years, it has grown into a prominent Islamic
            organization with branches across Nigeria, making significant contributions to Islamic education, community
            welfare, and interfaith dialogue.
          </p>

          <h2>Our Philosophy</h2>
          <p>
            At Hamduk Islamic Foundation, our philosophy is rooted in the principles of Islam, emphasizing knowledge,
            compassion, and service to humanity. We believe in:
          </p>
          <ul>
            <li>
              <strong>Knowledge as Empowerment:</strong> We believe that Islamic knowledge is the foundation for
              personal growth and community development. Through education, we aim to empower Muslims to understand and
              practice their faith with confidence and wisdom.
            </li>
            <li>
              <strong>Unity in Diversity:</strong> We recognize and celebrate the diversity within the Muslim Ummah,
              promoting unity and mutual respect among different Islamic traditions and schools of thought.
            </li>
            <li>
              <strong>Service to Humanity:</strong> Inspired by the Islamic principle of serving others, we are
              committed to humanitarian efforts that address the needs of the less privileged in our society.
            </li>
            <li>
              <strong>Interfaith Dialogue:</strong> We believe in fostering understanding and peaceful coexistence with
              people of other faiths through respectful dialogue and collaborative initiatives.
            </li>
          </ul>

          <h2>Our Growth</h2>
          <p>
            From its humble beginnings, Hamduk Islamic Foundation has grown significantly over the past 25+ years. Key
            milestones in our journey include:
          </p>
          <ul>
            <li>1996: Establishment of the foundation in Lagos</li>
            <li>2000: Launch of our first major educational program, the Annual Ramadan Tafsir</li>
            <li>2005: Expansion to other states in Nigeria</li>
            <li>2010: Introduction of youth development programs</li>
            <li>2015: Launch of our humanitarian aid initiatives</li>
            <li>2020: Development of online educational platforms</li>
          </ul>

          <h2>Looking Forward</h2>
          <p>
            As we continue our journey, Hamduk Islamic Foundation remains committed to its founding principles while
            adapting to the changing needs of the Muslim community and society at large. We strive to expand our reach,
            enhance our programs, and increase our impact in promoting Islamic values and serving humanity.
          </p>
          <p>
            We invite you to join us in this noble mission, whether as a member, volunteer, donor, or participant in our
            programs. Together, we can make a positive difference in our communities and beyond.
          </p>
        </div>
      </div>
    </main>
  )
}
