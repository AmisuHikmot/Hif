import { FileText, Download, Calendar, ExternalLink } from "lucide-react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"

const publications = [
  {
    id: 1,
    title: "Understanding Islamic Finance",
    description: "A comprehensive guide to Islamic banking and finance principles",
    type: "PDF",
    size: "2.4 MB",
    date: "April 15, 2024",
    category: "Education",
    author: "Dr. Aisha Mohammed",
    downloadUrl: "#",
  },
  {
    id: 2,
    title: "Islamic Education Curriculum",
    description: "Curriculum guide for Islamic schools and educational institutions",
    type: "PDF",
    size: "3.8 MB",
    date: "March 10, 2024",
    category: "Education",
    author: "Hamduk Islamic Foundation Education Committee",
    downloadUrl: "#",
  },
  {
    id: 3,
    title: "Ramadan Guide",
    description: "A guide to fasting, prayer, and spiritual practices during Ramadan",
    type: "PDF",
    size: "1.5 MB",
    date: "February 20, 2024",
    category: "Religious",
    author: "Sheikh Abdullah Ibrahim",
    downloadUrl: "#",
  },
  {
    id: 4,
    title: "Islamic History Series - Volume 1",
    description: "The early years of Islam and the Prophet Muhammad (PBUH)",
    type: "PDF",
    size: "5.2 MB",
    date: "January 15, 2024",
    category: "History",
    author: "Dr. Ibrahim Yusuf",
    downloadUrl: "#",
  },
  {
    id: 5,
    title: "Annual Report 2023",
    description: "Overview of Hamduk Islamic Foundation's activities and achievements in 2023",
    type: "PDF",
    size: "4.1 MB",
    date: "December 31, 2023",
    category: "Reports",
    author: "Hamduk Islamic Foundation",
    downloadUrl: "#",
  },
  {
    id: 6,
    title: "Islamic Parenting Guide",
    description: "Guidance for raising children according to Islamic principles",
    type: "PDF",
    size: "2.8 MB",
    date: "November 20, 2023",
    category: "Family",
    author: "Dr. Fatima Hassan",
    downloadUrl: "#",
  },
]

export default function PublicationsGallery() {
  return (
    <div>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {publications.map((publication) => (
          <Card key={publication.id}>
            <CardHeader className="p-4">
              <div className="flex items-start gap-4">
                <div className="rounded-md bg-muted p-2">
                  <FileText className="h-8 w-8 text-emerald-600" />
                </div>
                <div>
                  <CardTitle className="text-lg">{publication.title}</CardTitle>
                  <CardDescription className="line-clamp-2">{publication.description}</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="p-4 pt-0">
              <div className="flex items-center justify-between text-sm text-muted-foreground">
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4" />
                  <span>{publication.date}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant="outline">{publication.type}</Badge>
                  <span>{publication.size}</span>
                </div>
              </div>
              <Separator className="my-3" />
              <div className="flex items-center justify-between">
                <p className="text-sm">
                  <span className="text-muted-foreground">By:</span> {publication.author}
                </p>
                <Badge>{publication.category}</Badge>
              </div>
            </CardContent>
            <CardFooter className="p-4 pt-0 flex gap-2">
              <Button variant="outline" className="flex-1">
                <Download className="mr-2 h-4 w-4" />
                Download
              </Button>
              <Button variant="outline" size="icon">
                <ExternalLink className="h-4 w-4" />
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>

      <div className="mt-8 flex justify-center">
        <Button variant="outline">View More Publications</Button>
      </div>
    </div>
  )
}
