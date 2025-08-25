"use client"

import { useState } from "react"
import { Play, Pause, SkipBack, SkipForward, Volume2, Calendar } from "lucide-react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Slider } from "@/components/ui/slider"

const audioRecordings = [
  {
    id: 1,
    title: "Ramadan Tafsir - Day 1",
    description: "Interpretation of Surah Al-Fatiha and the beginning of Surah Al-Baqarah",
    duration: "45:20",
    date: "March 12, 2024",
    category: "Lectures",
    speaker: "Sheikh Abdullah Ibrahim",
    audioUrl: "https://example.com/audio1",
  },
  {
    id: 2,
    title: "Islamic Finance Lecture",
    description: "Understanding the principles of Islamic banking and finance",
    duration: "38:15",
    date: "February 20, 2024",
    category: "Education",
    speaker: "Dr. Aisha Mohammed",
    audioUrl: "https://example.com/audio2",
  },
  {
    id: 3,
    title: "Friday Khutbah - Patience in Islam",
    description: "The importance of patience (Sabr) in Islamic teachings",
    duration: "25:40",
    date: "January 15, 2024",
    category: "Khutbah",
    speaker: "Imam Yusuf Abdullah",
    audioUrl: "https://example.com/audio3",
  },
  {
    id: 4,
    title: "Q&A Session - Islamic Practices",
    description: "Answering common questions about daily Islamic practices",
    duration: "52:10",
    date: "December 10, 2023",
    category: "Q&A",
    speaker: "Panel of Scholars",
    audioUrl: "https://example.com/audio4",
  },
  {
    id: 5,
    title: "Islamic History Series - Part 1",
    description: "The life of Prophet Muhammad (PBUH) in Mecca",
    duration: "1:05:30",
    date: "November 25, 2023",
    category: "Education",
    speaker: "Dr. Ibrahim Yusuf",
    audioUrl: "https://example.com/audio5",
  },
  {
    id: 6,
    title: "Dua and Dhikr Workshop",
    description: "Learning important supplications and remembrances in Islam",
    duration: "42:15",
    date: "October 18, 2023",
    category: "Workshop",
    speaker: "Sheikh Mohammed Ali",
    audioUrl: "https://example.com/audio6",
  },
]

export default function AudioGallery() {
  const [currentAudio, setCurrentAudio] = useState<(typeof audioRecordings)[0] | null>(null)
  const [isPlaying, setIsPlaying] = useState(false)

  const togglePlay = (audio: (typeof audioRecordings)[0]) => {
    if (currentAudio?.id === audio.id) {
      setIsPlaying(!isPlaying)
    } else {
      setCurrentAudio(audio)
      setIsPlaying(true)
    }
  }

  return (
    <div>
      <div className="grid gap-4 md:grid-cols-2">
        {audioRecordings.map((audio) => (
          <Card key={audio.id}>
            <CardHeader className="p-4">
              <div className="flex items-start justify-between">
                <div>
                  <CardTitle className="text-lg">{audio.title}</CardTitle>
                  <CardDescription className="line-clamp-2">{audio.description}</CardDescription>
                </div>
                <Badge>{audio.category}</Badge>
              </div>
            </CardHeader>
            <CardContent className="p-4 pt-0">
              <div className="flex items-center justify-between text-sm text-muted-foreground">
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4" />
                  <span>{audio.date}</span>
                </div>
                <span>{audio.duration}</span>
              </div>
              <p className="mt-2 text-sm font-medium">Speaker: {audio.speaker}</p>
            </CardContent>
            <CardFooter className="p-4 pt-0">
              <Button variant="outline" className="w-full" onClick={() => togglePlay(audio)}>
                {currentAudio?.id === audio.id && isPlaying ? (
                  <>
                    <Pause className="mr-2 h-4 w-4" />
                    Pause
                  </>
                ) : (
                  <>
                    <Play className="mr-2 h-4 w-4" />
                    Play
                  </>
                )}
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>

      {currentAudio && (
        <div className="fixed bottom-0 left-0 right-0 bg-background border-t p-4 shadow-lg z-50">
          <div className="container mx-auto flex items-center gap-4">
            <div className="flex-shrink-0">
              <Button variant="ghost" size="icon" className="rounded-full" onClick={() => setIsPlaying(!isPlaying)}>
                {isPlaying ? <Pause className="h-6 w-6" /> : <Play className="h-6 w-6" />}
              </Button>
            </div>

            <div className="flex-grow">
              <div className="flex items-center justify-between mb-1">
                <div>
                  <p className="font-medium">{currentAudio.title}</p>
                  <p className="text-xs text-muted-foreground">{currentAudio.speaker}</p>
                </div>
                <span className="text-xs text-muted-foreground">00:00 / {currentAudio.duration}</span>
              </div>
              <Slider defaultValue={[0]} max={100} step={1} className="w-full" />
            </div>

            <div className="flex items-center gap-2">
              <Button variant="ghost" size="icon" className="rounded-full">
                <SkipBack className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="icon" className="rounded-full">
                <SkipForward className="h-4 w-4" />
              </Button>
              <div className="flex items-center gap-2 w-32">
                <Volume2 className="h-4 w-4 text-muted-foreground" />
                <Slider defaultValue={[80]} max={100} step={1} className="w-full" />
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="mt-8 flex justify-center">
        <Button variant="outline">Load More Recordings</Button>
      </div>
    </div>
  )
}
