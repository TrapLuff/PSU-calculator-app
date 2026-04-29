import { useState, useRef, useEffect } from 'react';
import type { Component } from '../modules/types';
import { cosineSimilarity } from '../modules/math';

export interface ProcessedComponent extends Component {
    score: number;
    isVisible: boolean;
    embedding?: number[];
}

function normalize(vec: number[]) {
    const norm = Math.sqrt(vec.reduce((s, v) => s + v * v, 0));
    return vec.map(v => v / (norm || 1));
}

export const useComponentSearch = (initialComponents: Component[]) => {
    const [components, setComponents] = useState<ProcessedComponent[]>([]);
    const [imageEmbedding, setImageEmbedding] = useState<number[] | null>(null);
    const [ready, setReady] = useState(false);
    const [progress, setProgress] = useState(0);

    const workerRef = useRef<Worker | null>(null);

    useEffect(() => {
        setComponents(
            initialComponents.map(c => ({
                ...c,
                score: 0,
                isVisible: true,
                embedding: undefined
            }))
        );
    }, [initialComponents]);

    useEffect(() => {
        workerRef.current = new Worker(
            new URL('../workers/search.worker.ts', import.meta.url),
            { type: 'module' }
        );

        workerRef.current.onmessage = (e) => {
            const { type, data } = e.data;

            switch (type) {

                case 'progress': {
                    if (data.status === 'progress') {
                        setProgress(data.progress);
                    } else {
                        setReady(true);
                    }
                    break;
                }

                case 'text_embeddings_ready': {
                   console.log("text keys:", Object.keys(data));
console.log("sample vector:", data[Object.keys(data)[0]]);
                    setComponents(prev =>
                        prev.map(c => ({
                            ...c,
                            embedding: data[c.id]
                            
                        }))
                        
                    );
                    
                    setReady(true);
                    break;
                }

                case 'image_embedding_ready': {
                    setImageEmbedding(data);
                    break;
                }
            }
        };

        workerRef.current.postMessage({
            type: 'init',
            data: initialComponents
        });

        return () => workerRef.current?.terminate();
    }, [initialComponents]);

 
    useEffect(() => {
        if (!imageEmbedding) return;

        setComponents(prev => {
            console.log("FIRST ITEM EMBEDDING", prev[0]?.embedding?.slice?.(0, 5));
        console.log("IMAGE EMBEDDING", imageEmbedding?.slice?.(0, 5));
            const hasEmbeddings = prev.every(c => c.embedding);

            if (!hasEmbeddings) return prev;

            const threshold = 0.03; // SigLIP-safe value
            const topK = 3;

            const processed = prev.map(c => {
                if (!c.embedding) return c;

                const similarity = cosineSimilarity(
    normalize(imageEmbedding),
    normalize(c.embedding)
);

                return {
                    ...c,
                    score: similarity,
                    isVisible: similarity > threshold
                };
            });

            processed.sort((a, b) => b.score - a.score);

            let visibleCount = 0;

            return processed.map(item => {
                if (item.isVisible && visibleCount < topK) {
                    visibleCount++;
                    return item;
                }

                return { ...item, isVisible: false };
            });
        });
    }, [imageEmbedding]);

    const searchByImage = (file: File) => {
        workerRef.current?.postMessage({ type: 'image', data: file });
    };

    const resetSearch = () => {
        setImageEmbedding(null);

        setComponents(prev =>
            prev.map(c => ({
                ...c,
                score: 0,
                isVisible: true
            }))
        );
    };

    return {
        items: components,
        ready,
        progress,
        searchByImage,
        resetSearch
    };
};