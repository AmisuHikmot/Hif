import type { Metadata } from "next"
import { createClient } from "@/lib/supabase/server"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Search, Download, FileText, FileAudio, FileVideo, File, Calendar } from "lucide-react"

export const metadata: Metadata = {
  title: "Downloads | Hamduk Islamic Foundation",
  description: "Download resources, publications, and media from Hamduk Islamic Foundation",
}

async function getDownloads() {
  const supabase = await createClient()
  const { data } = await supabase.from("media").select("*").order("download_count", { ascending: false })

  return data || []
}

function getFileIcon(type: string) {
  switch (type) {
    case "pdf":
    case "document":
      return <FileText className="h-8 w-8 text-red-500" />
    case "audio":
      return <FileAudio className="h-8 w-8 text-purple-500" />
    case "video":
      return <FileVideo className="h-8 w-8 text-blue-500" />
    default:
      return <File className="h-8 w-8 text-gray-500" />
  }
}

function formatFileSize(bytes?: number) {
  if (!bytes) return "Unknown size"
  const sizes = ["Bytes", "KB", "MB", "GB"]
  const i = Math.floor(Math.log(bytes) / Math.log(1024))
  return `${(bytes / Math.pow(1024, i)).toFixed(2)} ${sizes[i]}`
}

export default async function DownloadsPage() {
  const downloads = await getDownloads()

  const documents = downloads.filter((d) => d.media_type === "document" || d.media_type === "pdf")
  const audio = downloads.filter((d) => d.media_type === "audio")
  const other = downloads.filter((d) => !["document", "pdf", "audio", "video"].includes(d.media_type))

  return (
    <main className="container mx-auto px-4 py-12">
      <div className="mb-10 text-center">
        <h1 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-gray-100 sm:text-4xl md:text-5xl">
          Downloads
        </h1>
        <p className="mt-4 text-lg text-gray-600 dark:text-gray-400">
          Access and download resources, publications, lectures, and other materials.
        </p>
      </div>

      <div className="mb-8 flex flex-col gap-4 sm:flex-row">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-500" />
          <Input placeholder="Search downloads..." className="pl-10" />
        </div>
      </div>

      <Tabs defaultValue="all" className="w-full">
        <TabsList className="mb-8">
          <TabsTrigger value="all">All Downloads ({downloads.length})</TabsTrigger>
          <TabsTrigger value="documents">Documents ({documents.length})</TabsTrigger>
          <TabsTrigger value="audio">Audio ({audio.length})</TabsTrigger>
          <TabsTrigger value="other">Other ({other.length})</TabsTrigger>
        </TabsList>

        <TabsContent value="all">
          <DownloadList downloads={downloads} />
        </TabsContent>

        <TabsContent value="documents">
          <DownloadList downloads={documents} />
        </TabsContent>

        <TabsContent value="audio">
          <DownloadList downloads={audio} />
        </TabsContent>

        <TabsContent value="other">
          <DownloadList downloads={other} />
        </TabsContent>
      </Tabs>
    </main>
  )
}

function DownloadList({ downloads }: { downloads: any[] }) {
  if (downloads.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground">No downloads available in this category.</p>
      </div>
    )
  }

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {downloads.map((item) => (
        <Card key={item.id}>
          <CardHeader className="pb-3">
            <div className="flex items-start gap-4">
              {getFileIcon(item.media_type)}
              <div className="flex-1 min-w-0">
                <CardTitle className="text-base line-clamp-2">{item.title}</CardTitle>
                <CardDescription className="line-clamp-2">{item.description}</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2 mb-4">
              {item.category && <Badge variant="secondary">{item.category}</Badge>}
              <Badge variant="outline">{formatFileSize(item.file_size)}</Badge>
            </div>
            <div className="flex items-center justify-between text-sm text-muted-foreground mb-4">
              <div className="flex items-center gap-1">
                <Calendar className="h-3 w-3" />
                <span>{new Date(item.created_at).toLocaleDateString()}</span>
              </div>
              <div className="flex items-center gap-1">
                <Download className="h-3 w-3" />
                <span>{item.download_count || 0} downloads</span>
              </div>
            </div>
            {item.file_url && (
              <Button asChild className="w-full">
                <a href={item.file_url} download target="_blank" rel="noopener noreferrer">
                  <Download className="mr-2 h-4 w-4" />
                  Download
                </a>
              </Button>
            )}
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
