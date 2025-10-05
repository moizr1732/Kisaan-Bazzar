"use client";

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Bot } from 'lucide-react';
import { DiagnosisModal } from '@/components/dashboard/DiagnosisModal';

export function FloatingAgent() {
    const [isModalOpen, setIsModalOpen] = useState(false);

    return (
        <>
            <div className="fixed bottom-6 right-6 z-50">
                <Button
                    size="icon"
                    className="rounded-full w-14 h-14 bg-primary hover:bg-primary/90 shadow-lg"
                    onClick={() => setIsModalOpen(true)}
                >
                    <Bot className="w-8 h-8" />
                    <span className="sr-only">Open Voice Agent</span>
                </Button>
            </div>
            <DiagnosisModal isOpen={isModalOpen} setIsOpen={setIsModalOpen} onAdvisoryCreated={() => {}} />
        </>
    )
}
