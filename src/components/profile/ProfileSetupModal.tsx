"use client";

import { useState, useRef, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Mic, Square, Loader2, AlertCircle, CheckCircle, Bot } from "lucide-react";
import { profileAssistance } from "@/ai/flows/voice-profile-assistance";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/useAuth";

type ModalState = "idle" | "listening" | "processing" | "speaking" | "error" | "completed";

interface ProfileSetupModalProps {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
}

export function ProfileSetupModal({ isOpen, setIsOpen }: ProfileSetupModalProps) {
  const [modalState, setModalState] = useState<ModalState>("idle");
  const [agentMessage, setAgentMessage] = useState("Welcome! I can help you set up your profile. What is your full name?");
  const [context, setContext] = useState<string | undefined>(undefined);
  const [errorMessage, setErrorMessage] = useState("");
  
  const mediaRecorder = useRef<MediaRecorder | null>(null);
  const audioChunks = useRef<Blob[]>([]);
  const { toast } = useToast();
  const { user } = useAuth();

  useEffect(() => {
    if (isOpen) {
      setModalState("speaking");
    }
  }, [isOpen]);

  const handleClose = () => {
    if (modalState === 'processing') return;
    setIsOpen(false);
    setTimeout(() => {
        setModalState("idle");
        setAgentMessage("Welcome! I can help you set up your profile. What is your full name?");
        setContext(undefined);
        setErrorMessage("");
    }, 300);
  };
  
  const startRecording = async () => {
    setModalState("listening");
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      mediaRecorder.current = new MediaRecorder(stream);
      mediaRecorder.current.ondataavailable = (event) => {
        audioChunks.current.push(event.data);
      };
      mediaRecorder.current.onstop = handleRecordingStop;
      mediaRecorder.current.start();
    } catch (err) {
      console.error("Error accessing microphone:", err);
      setModalState("error");
      setErrorMessage("Could not access your microphone. Please check permissions.");
    }
  };

  const stopRecording = () => {
    if (mediaRecorder.current && mediaRecorder.current.state === "listening") {
      mediaRecorder.current.stop();
    }
  };

  const handleRecordingStop = async () => {
    setModalState("processing");
    const audioBlob = new Blob(audioChunks.current, { type: 'audio/webm' });
    audioChunks.current = [];

    // This is a simplified approach. In a real app, you'd use a Speech-to-Text service.
    // For this demo, we'll pretend the AI flow can handle raw audio,
    // or we'd pass this to a transcription service first.
    // Let's assume for now `profileAssistance` can take a placeholder for the voice.
    // A real implementation would convert blob to base64 and send to a transcription API.
    const userInputText = "user said something";

    try {
        const result = await profileAssistance({ 
            userInput: userInputText, // Placeholder for actual transcription
            context: context,
        });

        setAgentMessage(result.agentResponse);
        setContext(result.newContext);

        if (result.completed) {
            setModalState("completed");
            // Here you would typically take the final context and update the user's profile in Firestore
        } else {
            setModalState("speaking");
        }

    } catch (error: any) {
        console.error("Profile Assistance Error:", error);
        setErrorMessage(error.message || "Something went wrong.");
        setModalState("error");
    }
  };

  const renderContent = () => {
    return (
        <div className="py-8 text-center space-y-4">
            <div className="flex justify-center items-center h-16 w-16 rounded-full bg-primary/10 mx-auto">
                <Bot className="h-10 w-10 text-primary" />
            </div>
            <div>
                <p className="text-lg font-medium">Profile Setup Assistant</p>
                <p className="text-muted-foreground bg-secondary p-4 rounded-md mt-2">
                    {agentMessage}
                </p>
            </div>
            {modalState === 'error' && (
                <div className="text-destructive bg-destructive/10 p-3 rounded-md flex items-center gap-2">
                    <AlertCircle className="h-4 w-4" />
                    <p>{errorMessage}</p>
                </div>
            )}
        </div>
    );
  };
  
  const renderFooter = () => {
    switch (modalState) {
      case "listening":
        return <Button onClick={stopRecording} variant="destructive" className="w-full"><Square className="mr-2 h-4 w-4" />Stop Listening</Button>;
      case "idle":
      case "speaking":
      case "error":
        return <Button onClick={startRecording} className="w-full"><Mic className="mr-2 h-4 w-4" />Speak Answer</Button>;
      case "completed":
        return <Button onClick={handleClose} className="w-full"><CheckCircle className="mr-2 h-4 w-4"/>Done</Button>;
      case "processing":
        return <Button disabled className="w-full"><Loader2 className="mr-2 h-4 w-4 animate-spin" />Processing...</Button>;
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="font-headline">Voice Profile Setup</DialogTitle>
          <DialogDescription>
            Let's set up your profile. Answer the questions one by one.
          </DialogDescription>
        </DialogHeader>
        {renderContent()}
        <DialogFooter>
          {renderFooter()}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
