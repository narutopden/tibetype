"use client"

import { useState, useEffect, useRef } from 'react'
import { Button } from "@/components/ui/button"
import { TypewriterEffectSmooth } from "@/components/ui/typewriter-effect";
import { cn } from "@/lib/utils"
import { Textarea } from "@/components/ui/textarea" // Import the Textarea component
import { Dialog, DialogTrigger, DialogContent, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import image from "@/app/image/image-2.webp"

const text = "བོད་སྐད་ནི་བོད་ཀྱི་སྐད་ཡིག་ཡིན། འདི་ནི་བོད་རིགས་ཚོས་བེད་སྤྱོད་བྱེད་པའི་སྐད་ཆ་གཙོ་བོ་དེ་ཡིན། བོད་སྐད་ནི་བོད་རང་སྐྱོང་ལྗོངས་དང་མཚོ་སྔོན་ཞིང་ཆེན། སི་ཁྲོན་ཞིང་ཆེན། ཡུན་ནན་ཞིང་ཆེན་བཅས་ཀྱི་ས་ཁུལ་མང་པོར་བེད་སྤྱོད་བྱེད་བཞིན་ཡོད།"

export default function Component() {
  const [typedText, setTypedText] = useState('')
  const [isRunning, setIsRunning] = useState(false)
  const [isFinished, setIsFinished] = useState(false)
  const [customText, setCustomText] = useState(text) // State for custom text
  const [tempText, setTempText] = useState(text) // Temporary state for dialog input
  const [isDialogOpen, setIsDialogOpen] = useState(false) // State to control dialog visibility
  const [scrollPosition, setScrollPosition] = useState(0)
  const textRef = useRef<HTMLDivElement>(null) // Declare textRef using useRef

  const words = [
    {
      text: "Master Tibetan Typing with",
      className: "text-blue-500 dark:text-blue-500",
    },
    {
      text: "Tibetype.",
      className: "text-red-500 dark:text-blue-500",
    },
  ];

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (isDialogOpen) return; // Prevent typing in the main input when dialog is open

      if (!isRunning && !isFinished) {
        setIsRunning(true)
      }

      if (isRunning && !isFinished) {
        if (e.key === 'Backspace') {
          setTypedText(prev => prev.slice(0, -1))
        } else if (e.key.length === 1) {
          setTypedText(prev => prev + e.key)
        }
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [isRunning, isFinished, isDialogOpen])

  useEffect(() => {
    if (textRef.current) {
      const lineHeight = 20 // Adjust this value based on your actual line height
      const charactersPerLine = 40 // Assuming 50 characters per line
      const currentLine = Math.floor(typedText.length / charactersPerLine)
      
      // Only start scrolling after the first 3 lines
      if (currentLine > 3) {
        const newScrollPosition = (currentLine - 3) * lineHeight
        setScrollPosition(newScrollPosition)
      } else {
        setScrollPosition(0)
      }
    }
  }, [typedText])

  const restartTest = () => {
    setTypedText('')
    setIsRunning(false)
    setIsFinished(false)
    if (textRef.current) textRef.current.focus()
  }

  const handleSave = () => {
    setCustomText(tempText)
    setIsDialogOpen(false)
  }

  const handleCancel = () => {
    setTempText(customText)
    setIsDialogOpen(false)
  }

  return (
    <div className="min-h-screen bg-black text-gray-300 flex flex-col p-4">
     
      <div className="flex justify-center my-4">
        <TypewriterEffectSmooth words={words} />
      </div>
      
      {/* Image */}
      <div className="flex justify-center my-4">
        <img src={image.src} style={{ width: '50%', height: 'auto' }} alt="Random" className="rounded-lg shadow-lg" />
      </div>

      <div className="flex-grow flex flex-col items-center justify-center">
        {/* Text display area */}
        <div className="relative w-full max-w-3xl h-[200px] overflow-hidden">
          <div 
            className="absolute top-0 left-0 right-0 pointer-events-none z-10"
            style={{
              background: 'linear-gradient(to bottom, rgba(0,0,0,1) 0%, rgba(0,0,0,0) 20%, rgba(0,0,0,0) 80%, rgba(0,0,0,1) 100%)'
            }}
          />
          <div 
            ref={textRef}
            className="absolute top-0 left-0 right-0 text-3xl text-center leading-relaxed font-tibetan outline-none"
            style={{ transform: `translateY(-${scrollPosition}px)`, transition: 'transform 0.3s ease-out' }}
          >
            {customText.split('').map((char, index) => (
              <span
                key={index}
                className={cn(
                  typedText.length > 0 ? (
                    index < typedText.length
                      ? typedText[index] === char
                        ? "text-green-500"
                        : "text-red-500"
                      : "text-gray-500"  // Shade upcoming text
                  ) : "text-gray-300",  // Default color when no typing has occurred
                  index === typedText.length && "bg-gray-700 animate-[pulse_1s_ease-in-out_infinite]"  // Add faster blinking animation to cursor
                )}
              >
                {char}
              </span>
            ))}
          </div>
        </div>
      </div>
      <div className="mt-8 text-center flex justify-center items-center space-x-4">
        <Button variant="outline" className="bg-black text-white" onClick={restartTest}>
          {isRunning ? "Restart test" : "Start new test"}
        </Button>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button variant="outline" className="bg-black text-white" onClick={() => setIsDialogOpen(true)}>
              Settings
            </Button>
          </DialogTrigger>
          <DialogContent className="bg-black text-white">
            <DialogTitle>ཡི་གེ་རང་སྒྲིག་བྱེད་པ།</DialogTitle>
            <DialogDescription>
            གཤམ་དུ་རང་མོས་ཡིག་ཆ་བླུགས་རོགས།
            </DialogDescription>
            <Textarea
              id="custom-text"
              value={tempText}
              onChange={(e) => setTempText(e.target.value)}
              className="w-full bg-transparent text-white"
            />
            <div className="flex justify-end mt-4">
              <Button variant="outline" onClick={handleCancel} className="mr-2 bg-black text-white">
                Cancel
              </Button>
              <Button variant="outline" onClick={handleSave} className="bg-black text-white">
                Save
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  )
}