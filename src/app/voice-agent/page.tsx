"use client";

import { useState, useRef, useEffect } from "react";
import AppLayout from "@/components/AppLayout";
import { Button } from "@/components/ui/button";
import { Mic, Square, Loader2, Volume2, User as UserIcon, Bot as BotIcon } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/useAuth";
import { multilingualVoiceInteraction } from "@/ai/flows/multilingual-voice-interaction";
import { textToSpeech } from "@/ai/flows/text-to-speech";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

type AgentState = "idle" | "recording" | "processing" | "speaking";

interface ConversationTurn {
  speaker: "user" | "agent";
  text: string;
}

function VoiceAgentContent() {
  const [agentState, setAgentState] = useState<AgentState>("idle");
  const [conversation, setConversation] = useState<ConversationTurn[]>([]);
  const mediaRecorder = useRef<MediaRecorder | null>(null);
  const audioChunks = useRef<Blob[]>([]);
  const audioPlayer = useRef<HTMLAudioElement | null>(null);
  const { toast } = useToast();
  const { user, userProfile } = useAuth();

  useEffect(() => {
    audioPlayer.current = new Audio();
    return () => {
      audioPlayer.current?.pause();
      audioPlayer.current = null;
    }
  }, []);

  const startRecording = async () => {
    setAgentState("recording");
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
      toast({
        variant: "destructive",
        title: "Microphone Error",
        description: "Could not access your microphone. Please check permissions.",
      });
      setAgentState("idle");
    }
  };

  const stopRecording = () => {
    if (mediaRecorder.current && mediaRecorder.current.state === "recording") {
      mediaRecorder.current.stop();
    }
  };

  const handleRecordingStop = async () => {
    setAgentState("processing");
    const audioBlob = new Blob(audioChunks.current, { type: 'audio/webm' });
    audioChunks.current = [];

    const reader = new FileReader();
    reader.readAsDataURL(audioBlob);
    reader.onloadend = async () => {
      const base64Audio = reader.result as string;

      try {
        const pastInteractions = conversation.map(turn => `${turn.speaker}: ${turn.text}`).join('\n');
        
        // This is a placeholder for Speech-to-Text.
        // Genkit's `multilingualVoiceInteraction` expects text, but we can pass the audio data URI to it.
        // And update the flow to use `{{media url=...}}`. The flow is already set up for that.
        // However, we don't get the transcription back to display in the UI.
        // For a better UX, we'll just show "You spoke."
        const userTurn: ConversationTurn = { speaker: 'user', text: 'You spoke to the agent.' };
        setConversation(prev => [...prev, userTurn]);

        const interactionResult = await multilingualVoiceInteraction({ 
          voiceCommand: base64Audio,
          userProfile: userProfile ? JSON.stringify(userProfile) : undefined,
          location: userProfile?.location,
          pastInteractions: pastInteractions
        });

        const agentTurn: ConversationTurn = { speaker: 'agent', text: interactionResult.response };
        setConversation(prev => [...prev, agentTurn]);

        const ttsResult = await textToSpeech({ text: interactionResult.response });

        if (audioPlayer.current) {
          audioPlayer.current.src = ttsResult.audio;
          audioPlayer.current.play();
          setAgentState("speaking");
          audioPlayer.current.onended = () => {
            setAgentState("idle");
          };
        } else {
           setAgentState("idle");
        }

      } catch (error: any) {
        console.error("AI Interaction Error:", error);
        toast({
          variant: "destructive",
          title: "Interaction Failed",
          description: error.message || "Could not get a response from the agent.",
        });
        setAgentState("idle");
      }
    };
  };

  const renderMicButton = () => {
    switch (agentState) {
      case "idle":
        return (
          <Button size="icon" className="w-24 h-24 rounded-full" onClick={startRecording}>
            <Mic className="h-10 w-10" />
          </Button>
        );
      case "recording":
        return (
          <Button size="icon" variant="destructive" className="w-24 h-24 rounded-full" onClick={stopRecording}>
            <Square className="h-10 w-10" />
          </Button>
        );
      case "processing":
        return (
          <Button size="icon" className="w-24 h-24 rounded-full" disabled>
            <Loader2 className="h-10 w-10 animate-spin" />
          </Button>
        );
       case "speaking":
        return (
          <Button size="icon" className="w-24 h-24 rounded-full" disabled>
            <Volume2 className="h-10 w-10" />
          </Button>
        );
    }
  }

  const getInitials = (name?: string) => {
    if (name) return name.split(' ').map(n => n[0]).join('').toUpperCase();
    return 'U';
  }

  return (
    <div className="flex flex-col h-full">
      <div className="flex-1 overflow-y-auto p-4 space-y-6">
        {conversation.length === 0 && (
          <div className="text-center text-muted-foreground pt-16">
            <BotIcon className="h-12 w-12 mx-auto mb-4" />
            <p className="text-lg">Kisan Bazaar Voice Assistant</p>
            <p>Press the microphone to start the conversation.</p>
          </div>
        )}
        {conversation.map((turn, index) => (
          <div key={index} className={`flex items-start gap-3 ${turn.speaker === 'user' ? 'justify-end' : ''}`}>
            {turn.speaker === 'agent' && (
              <Avatar className="w-8 h-8 bg-primary text-primary-foreground">
                <AvatarFallback><BotIcon className="w-5 h-5" /></AvatarFallback>
              </Avatar>
            )}
             <div className={`max-w-sm rounded-lg p-3 ${
                turn.speaker === 'user' 
                ? 'bg-primary text-primary-foreground' 
                : 'bg-muted'
             }`}>
               <p>{turn.text}</p>
             </div>
            {turn.speaker === 'user' && (
              <Avatar className="w-8 h-8">
                <AvatarFallback>{getInitials(userProfile?.name)}</AvatarFallback>
              </Avatar>
            )}
          </div>
        ))}
      </div>
      <div className="flex flex-col items-center justify-center p-6 border-t bg-background">
        <p className="text-sm text-muted-foreground mb-4">
          {agentState === 'recording' && 'Listening...'}
          {agentState === 'processing' && 'Thinking...'}
          {agentState === 'speaking' && 'Speaking...'}
        </p>
        {renderMicButton()}
      </div>
    </div>
  );
}

export default function VoiceAgentPage() {
  return (
    <AppLayout>
      <div className="h-full">
        <Card className="h-full">
          <CardContent className="h-full p-0">
             <VoiceAgentContent />
          </CardContent>
        </Card>
      </div>
    </AppLayout>
  );
}
