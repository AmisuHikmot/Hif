import Image from "next/image"
import type { Metadata } from "next"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Calendar, Clock, MapPin, Users } from "lucide-react"

export const metadata: Metadata = {
  title: "Training Programs | Hamduk Islamic Foundation",
  description: "Comprehensive Islamic training programs offered by Hamduk Islamic Foundation",
}

// Sample data for training programs
const trainingPrograms = [
  {
    id: 1,
    title: "Islamic Leadership Development",
    description: "A comprehensive program designed to develop leadership skills within an Islamic framework.",
    duration: "6 months",
    format: "Weekend sessions",
    audience: "Community leaders, Imams, and aspiring Islamic leaders",
    image: "/placeholder.svg?height=400&width=600",
    modules: [
      "Islamic Principles of Leadership",
      "Communication and Public Speaking",
      "Community Organization and Management",
      "Conflict Resolution in Islamic Context",
      "Strategic Planning for Islamic Organizations",
      "Financial Management for Islamic Institutions",
    ],
  },
  {
    id: 2,
    title: "Islamic Education for Teachers",
    description: "Training program for educators teaching Islamic subjects in schools and madrasas.",
    duration: "3 months",
    format: "Weekly sessions",
    audience: "Islamic studies teachers and educators",
    image: "/placeholder.svg?height=400&width=600",
    modules: [
      "Pedagogy in Islamic Education",
      "Curriculum Development",
      "Teaching Quran and Hadith",
      "Islamic History Teaching Methods",
      "Assessment and Evaluation Techniques",
      "Technology in Islamic Education",
    ],
  },
  {
    id: 3,
    title: "Da'wah Training Program",
    description: "Equipping Muslims with knowledge and skills to effectively share Islam with others.",
    duration: "2 months",
    format: "Twice weekly sessions",
    audience: "All Muslims interested in da'wah activities",
    image: "/placeholder.svg?height=400&width=600",
    modules: [
      "Fundamentals of Da'wah",
      "Understanding Different Worldviews",
      "Effective Communication Techniques",
      "Addressing Common Misconceptions about Islam",
      "Using Social Media for Da'wah",
      "Ethics and Etiquette in Da'wah",
    ],
  },
  {
    id: 4,
    title: "Islamic Counseling Skills",
    description: "Training in providing counseling services within an Islamic framework.",
    duration: "4 months",
    format: "Weekly sessions",
    audience: "Imams, community workers, and counseling professionals",
    image: "/placeholder.svg?height=400&width=600",
    modules: [
      "Islamic Perspective on Mental Health",
      "Basic Counseling Skills",
      "Marriage and Family Counseling",
      "Youth Counseling",
      "Crisis Intervention",
      "Ethical Considerations in Islamic Counseling",
    ],
  },
]

// Sample data for upcoming training events
const upcomingTrainings = [
  {
    id: 1,
    title: "Islamic Leadership Development",
    date: "Starting September 15, 2023",
    time: "Saturdays, 10:00 AM - 2:00 PM",
    location: "Hamduk Islamic Center, Lagos",
    seats: "30 participants",
    registration: "Open until September 10, 2023",
  },
  {
    id: 2,
    title: "Da'wah Training Program",
    date: "Starting October 5, 2023",
    time: "Tuesdays and Thursdays, 5:00 PM - 7:00 PM",
    location: "Hamduk Islamic Center, Kano",
    seats: "25 participants",
    registration: "Open until September 30, 2023",
  },
  {
    id: 3,
    title: "Islamic Education for Teachers",
    date: "Starting November 12, 2023",
    time: "Sundays, 9:00 AM - 1:00 PM",
    location: "Hamduk Islamic Center, Abuja",
    seats: "20 participants",
    registration: "Open until November 5, 2023",
  },
]

export default function TrainingPage() {
  return (
    <main className="container mx-auto px-4 py-12">
      <div className="mb-12 text-center">
        <h1 className="text-4xl font-bold tracking-tight text-emerald-900 dark:text-emerald-500 mb-4">
          Training Programs
        </h1>
        <p className="text-lg text-gray-600 dark:text-gray-400 max-w-3xl mx-auto">
          Comprehensive training programs designed to develop knowledge, skills, and leadership within the Islamic
          framework.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-16">
        <div className="lg:col-span-2">
          <div className="relative h-80 w-full rounded-lg overflow-hidden mb-6">
            <Image
              src="/placeholder.svg?height=600&width=1200"
              alt="Islamic training session"
              fill
              className="object-cover"
            />
            <div className="absolute inset-0 bg-emerald-900/30 flex items-center justify-center">
              <div className="bg-white/90 dark:bg-gray-900/90 p-6 rounded-lg max-w-md text-center">
                <h2 className="text-2xl font-bold text-emerald-900 dark:text-emerald-500 mb-2">
                  Excellence Through Education
                </h2>
                <p className="text-gray-700 dark:text-gray-300">
                  Our training programs are designed to equip Muslims with the knowledge and skills needed to excel in
                  various aspects of Islamic work and service.
                </p>
              </div>
            </div>
          </div>
          <div className="prose dark:prose-invert max-w-none">
            <h2 className="text-2xl font-bold text-emerald-900 dark:text-emerald-500 mb-4">Our Approach to Training</h2>
            <p>
              At Hamduk Islamic Foundation, we believe in a comprehensive approach to Islamic training that combines
              traditional Islamic knowledge with contemporary educational methodologies. Our training programs are
              designed to be:
            </p>
            <ul>
              <li>
                <strong>Authentic:</strong> Grounded in the Quran and Sunnah, ensuring that all content is in line with
                authentic Islamic teachings.
              </li>
              <li>
                <strong>Practical:</strong> Focused on real-world application, equipping participants with skills they
                can immediately put into practice.
              </li>
              <li>
                <strong>Comprehensive:</strong> Covering both theoretical knowledge and practical skills development.
              </li>
              <li>
                <strong>Accessible:</strong> Designed to accommodate different learning styles and backgrounds.
              </li>
              <li>
                <strong>Relevant:</strong> Addressing contemporary challenges and contexts faced by Muslims today.
              </li>
            </ul>
            <p>
              Our trainers are qualified scholars and professionals with expertise in their respective fields. They
              combine deep Islamic knowledge with professional experience and teaching skills to deliver high-quality
              training experiences.
            </p>
          </div>
        </div>

        <div>
          <Card className="border-emerald-200 dark:border-emerald-900">
            <CardHeader className="bg-emerald-50 dark:bg-emerald-900/20">
              <CardTitle className="text-xl text-emerald-900 dark:text-emerald-500">Upcoming Trainings</CardTitle>
              <CardDescription>Register for our upcoming training programs</CardDescription>
            </CardHeader>
            <CardContent className="pt-6">
              <div className="space-y-6">
                {upcomingTrainings.map((training) => (
                  <div
                    key={training.id}
                    className="border-b border-gray-200 dark:border-gray-800 pb-4 last:border-0 last:pb-0"
                  >
                    <h3 className="font-semibold text-lg mb-2 text-emerald-800 dark:text-emerald-400">
                      {training.title}
                    </h3>
                    <div className="space-y-2 text-sm">
                      <div className="flex items-start">
                        <Calendar className="h-4 w-4 text-emerald-700 dark:text-emerald-500 mr-2 mt-0.5" />
                        <span className="text-gray-700 dark:text-gray-300">{training.date}</span>
                      </div>
                      <div className="flex items-start">
                        <Clock className="h-4 w-4 text-emerald-700 dark:text-emerald-500 mr-2 mt-0.5" />
                        <span className="text-gray-700 dark:text-gray-300">{training.time}</span>
                      </div>
                      <div className="flex items-start">
                        <MapPin className="h-4 w-4 text-emerald-700 dark:text-emerald-500 mr-2 mt-0.5" />
                        <span className="text-gray-700 dark:text-gray-300">{training.location}</span>
                      </div>
                      <div className="flex items-start">
                        <Users className="h-4 w-4 text-emerald-700 dark:text-emerald-500 mr-2 mt-0.5" />
                        <span className="text-gray-700 dark:text-gray-300">{training.seats}</span>
                      </div>
                    </div>
                    <div className="mt-3">
                      <span className="text-xs font-medium bg-emerald-100 dark:bg-emerald-900/30 text-emerald-800 dark:text-emerald-400 px-2 py-1 rounded-full">
                        {training.registration}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
              <div className="mt-6">
                <button className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-medium py-2 px-4 rounded-md transition-colors">
                  Register for Training
                </button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      <h2 className="text-3xl font-bold text-emerald-900 dark:text-emerald-500 mb-8 text-center">
        Our Training Programs
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
        {trainingPrograms.map((program) => (
          <Card key={program.id} className="overflow-hidden border-emerald-200 dark:border-emerald-900">
            <div className="relative h-48 w-full">
              <Image src={program.image || "/placeholder.svg"} alt={program.title} fill className="object-cover" />
            </div>
            <CardHeader className="bg-emerald-50 dark:bg-emerald-900/20">
              <CardTitle className="text-xl text-emerald-900 dark:text-emerald-500">{program.title}</CardTitle>
              <CardDescription>{program.description}</CardDescription>
            </CardHeader>
            <CardContent className="pt-6">
              <div className="grid grid-cols-2 gap-4 mb-4">
                <div>
                  <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400">Duration</h4>
                  <p className="text-gray-700 dark:text-gray-300">{program.duration}</p>
                </div>
                <div>
                  <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400">Format</h4>
                  <p className="text-gray-700 dark:text-gray-300">{program.format}</p>
                </div>
                <div className="col-span-2">
                  <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400">Target Audience</h4>
                  <p className="text-gray-700 dark:text-gray-300">{program.audience}</p>
                </div>
              </div>
              <div>
                <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">Program Modules</h4>
                <ul className="list-disc pl-5 space-y-1 text-gray-700 dark:text-gray-300">
                  {program.modules.map((module, index) => (
                    <li key={index}>{module}</li>
                  ))}
                </ul>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="max-w-4xl mx-auto bg-emerald-50 dark:bg-emerald-900/10 p-8 rounded-lg border border-emerald-200 dark:border-emerald-900/50">
        <h2 className="text-2xl font-bold text-emerald-900 dark:text-emerald-500 mb-4">Custom Training Solutions</h2>
        <p className="text-gray-700 dark:text-gray-300 mb-4">
          In addition to our standard training programs, we offer customized training solutions for Islamic
          organizations, schools, and institutions. Our team can develop and deliver training programs tailored to your
          specific needs and objectives.
        </p>
        <p className="text-gray-700 dark:text-gray-300 mb-4">
          Whether you need training for your staff, volunteers, board members, or community, we can design a program
          that addresses your unique challenges and goals.
        </p>
        <p className="text-gray-700 dark:text-gray-300">
          Contact us to discuss your training needs and how we can support your organization's development.
        </p>
      </div>
    </main>
  )
}
