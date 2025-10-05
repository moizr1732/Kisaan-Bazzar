"use client";

import { useState, useRef } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Mic, Square, Loader2, AlertCircle, CheckCircle } from "lucide-react";
import { multilingualVoiceInteraction } from "@/ai/flows/multilingual-voice-interaction";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/useAuth";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { db } from "@/lib/firebase";
import type { Advisory } from "@/lib/types";

type ModalState = "idle" | "recording" | "processing" | "success" | "error";

interface DiagnosisModalProps {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
  onAdvisoryCreated: (advisory: Advisory) => void;
}

export function DiagnosisModal({ isOpen, setIsOpen, onAdvisoryCreated }: DiagnosisModalProps) {
  const [modalState, setModalState] = useState<ModalState>("idle");
  const [diagnosis, setDiagnosis] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const mediaRecorder = useRef<MediaRecorder | null>(null);
  const audioChunks = useRef<Blob[]>([]);
  const { toast } = useToast();
  const { user, userProfile } = useAuth();

  const handleClose = () => {
    if (modalState === 'processing') return;
    setIsOpen(false);
    setTimeout(() => {
        setModalState("idle");
        setDiagnosis("");
        setErrorMessage("");
    }, 300);
  };
  
  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      mediaRecorder.current = new MediaRecorder(stream);
      mediaRecorder.current.ondataavailable = (event) => {
        audioChunks.current.push(event.data);
      };
      mediaRecorder.current.onstop = handleRecordingStop;
      mediaRecorder.current.start();
      setModalState("recording");
    } catch (err) {
      console.error("Error accessing microphone:", err);
      toast({
        variant: "destructive",
        title: "Microphone Error",
        description: "Could not access your microphone. Please check permissions.",
      });
    }
  };

  const stopRecording = () => {
    if (mediaRecorder.current && mediaRecorder.current.state === "recording") {
      mediaRecorder.current.stop();
    }
  };

  const handleRecordingStop = async () => {
    setModalState("processing");
    const audioBlob = new Blob(audioChunks.current, { type: 'audio/webm' });
    audioChunks.current = [];

    const reader = new FileReader();
    reader.readAsDataURL(audioBlob);
    reader.onloadend = async () => {
      const base64Audio = reader.result as string;
      try {
        const result = await multilingualVoiceInteraction({ 
          voiceCommand: base64Audio,
          userProfile: userProfile ? JSON.stringify(userProfile) : undefined,
          location: userProfile?.location,
        });
        setDiagnosis(result.response);
        setModalState("success");

        if(user) {
            const newAdvisoryRef = await addDoc(collection(db, "advisories"), {
              userId: user.uid,
              diagnosis: result.response,
              createdAt: serverTimestamp(),
            });
            const newAdvisory: Advisory = {
              id: newAdvisoryRef.id,
              userId: user.uid,
              diagnosis: result.response,
              createdAt: {
                toDate: () => new Date(),
                seconds: Math.floor(Date.now() / 1000),
                nanoseconds: 0
              } as any
            };
            onAdvisoryCreated(newAdvisory);
        }

      } catch (error: any) {
        console.error("AI Diagnosis Error:", error);
        setErrorMessage(error.message || "Failed to get diagnosis.");
        setModalState("error");
      }
    };
  };

  const renderContent = () => {
    switch (modalState) {
      case "recording":
        return (
          <div className="text-center py-8">
            <Mic className="mx-auto h-16 w-16 text-red-500 animate-pulse" />
            <p className="mt-4 text-lg font-medium">Recording in progress...</p>
            <p className="text-muted-foreground">Describe your crop's symptoms clearly.</p>
          </div>
        );
      case "processing":
        return (
          <div className="text-center py-8">
            <Loader2 className="mx-auto h-16 w-16 animate-spin text-primary" />
            <p className="mt-4 text-lg font-medium">Analyzing symptoms...</p>
            <p className="text-muted-foreground">Our AI is preparing your advisory.</p>
          </div>
        );
      case "success":
        return (
          <div className="text-center py-8">
            <CheckCircle className="mx-auto h-16 w-16 text-green-500" />
            <p className="mt-4 text-lg font-medium">Diagnosis Complete</p>
            <p className="mt-2 text-muted-foreground bg-secondary p-4 rounded-md">{diagnosis}</p>
          </div>
        );
      case "error":
        return (
          <div className="text-center py-8">
            <AlertCircle className="mx-auto h-16 w-16 text-destructive" />
            <p className="mt-4 text-lg font-medium">Analysis Failed</p>
            <p className="mt-2 text-muted-foreground bg-destructive/10 p-4 rounded-md">{errorMessage}</p>
          </div>
        );
      case "idle":
      default:
        return (
          <div className="text-center py-8">
            <Mic className="mx-auto h-16 w-16 text-primary" />
            <p className="mt-4 text-lg font-medium">Ready to Record</p>
            <p className="text-muted-foreground">Press the button below to start recording your query.</p>
          </div>
        );
    }
  };
  
  const renderFooter = () => {
    switch (modalState) {
      case "recording":
        return <Button onClick={stopRecording} variant="destructive" className="w-full"><Square className="mr-2 h-4 w-4" />Stop Recording</Button>;
      case "idle":
      case "error":
        return <Button onClick={startRecording} className="w-full"><Mic className="mr-2 h-4 w-4" />Start Recording</Button>;
      case "success":
        return <Button onClick={handleClose} className="w-full">Done</Button>;
      case "processing":
        return <Button disabled className="w-full"><Loader2 className="mr-2 h-4 w-4 animate-spin" />Processing...</Button>;
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="font-headline">Voice Advisory</DialogTitle>
          <DialogDescription>
            Record your question and our AI assistant Moiz will provide an answer.
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
