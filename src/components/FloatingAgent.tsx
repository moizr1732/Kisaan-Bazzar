
"use client";

import { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Bot } from 'lucide-react';
import { DiagnosisModal } from '@/components/dashboard/DiagnosisModal';

export function FloatingAgent() {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [position, setPosition] = useState({ x: NaN, y: NaN });
    const [isDragging, setIsDragging] = useState(false);
    const agentRef = useRef<HTMLDivElement>(null);
    const offset = useRef({ x: 0, y: 0 });
    const [isMounted, setIsMounted] = useState(false);

    useEffect(() => {
        setIsMounted(true);
    }, []);

    const handleMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
        if (agentRef.current) {
            // Prevent drag from starting on right-click
            if (e.button !== 0) return;
            const rect = agentRef.current.getBoundingClientRect();
            offset.current = {
                x: e.clientX - rect.left,
                y: e.clientY - rect.top,
            };
            setIsDragging(true);
            (agentRef.current as any).isBeingDragged = false;
        }
    };

    const handleMouseMove = (e: MouseEvent) => {
        if (isDragging && agentRef.current) {
            (agentRef.current as any).isBeingDragged = true;
            let newX = e.clientX - offset.current.x;
            let newY = e.clientY - offset.current.y;

            const parentWidth = window.innerWidth;
            const parentHeight = window.innerHeight;
            const agentWidth = agentRef.current.offsetWidth;
            const agentHeight = agentRef.current.offsetHeight;

            newX = Math.max(0, Math.min(newX, parentWidth - agentWidth));
            newY = Math.max(0, Math.min(newY, parentHeight - agentHeight));

            agentRef.current.style.left = `${newX}px`;
            agentRef.current.style.top = `${newY}px`;
        }
    };
    
    const handleMouseUp = () => {
        if (!isDragging) return;
        setIsDragging(false);
        if (agentRef.current) {
            const rect = agentRef.current.getBoundingClientRect();
            setPosition({ x: rect.left, y: rect.top });
        }
    };
    
    const handleClick = () => {
      if (agentRef.current && !(agentRef.current as any).isBeingDragged) {
        setIsModalOpen(true);
      }
    }

    useEffect(() => {
        if (isDragging) {
            document.addEventListener('mousemove', handleMouseMove);
            document.addEventListener('mouseup', handleMouseUp);
        } else {
            document.removeEventListener('mousemove', handleMouseMove);
            document.removeEventListener('mouseup', handleMouseUp);
        }

        return () => {
            document.removeEventListener('mousemove', handleMouseMove);
            document.removeEventListener('mouseup', handleMouseUp);
        };
    }, [isDragging]);

    useEffect(() => {
        if (isMounted && agentRef.current && isNaN(position.x)) {
             const agentWidth = agentRef.current.offsetWidth;
             const agentHeight = agentRef.current.offsetHeight;
             setPosition({
                 x: window.innerWidth - agentWidth - 24,
                 y: window.innerHeight - agentHeight - 24,
             });
        }
    }, [isMounted, position.x]);


    if (!isMounted) {
        return null;
    }

    const style: React.CSSProperties = {
        left: !isNaN(position.x) ? `${position.x}px` : undefined,
        top: !isNaN(position.y) ? `${position.y}px` : undefined,
        right: isNaN(position.x) ? '24px' : undefined,
        bottom: isNaN(position.y) ? '24px' : undefined,
        visibility: isNaN(position.x) ? 'hidden' : 'visible'
    };

    return (
        <>
            <div
                ref={agentRef}
                className="fixed z-50 cursor-grab active:cursor-grabbing"
                style={style}
                onMouseDown={handleMouseDown}
                onClick={handleClick}
            >
                <Button
                    size="icon"
                    className="rounded-full w-14 h-14 bg-primary hover:bg-primary/90 shadow-lg"
                    onPointerDown={(e) => {
                        // This helps distinguish between click and drag
                        e.stopPropagation();
                    }}
                >
                    <Bot className="w-8 h-8" />
                    <span className="sr-only">Open Voice Agent</span>
                </Button>
            </div>
            <DiagnosisModal isOpen={isModalOpen} setIsOpen={setIsModalOpen} onAdvisoryCreated={() => {}} />
        </>
    )
}
