import { useCallback, useMemo, useRef } from "react";

export interface Snapshot<T> {
    data: T;
    timestamp: number;
}

export function useHistory<T>(maxSize = 100) {
    const pastRef = useRef<Snapshot<T>[]>([]);
    const futureRef = useRef<Snapshot<T>[]>([]);
    const debounceTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

    const pushState = useCallback(
        (state: T, debounceMs = 0) => {
            const commit = () => {
                const last = pastRef.current[pastRef.current.length - 1];
                if (last && JSON.stringify(last.data) === JSON.stringify(state)) return;
                pastRef.current = [
                    ...pastRef.current.slice(-(maxSize - 1)),
                    { data: structuredClone(state), timestamp: Date.now() },
                ];
                futureRef.current = [];
            };

            if (debounceMs > 0) {
                if (debounceTimerRef.current) clearTimeout(debounceTimerRef.current);
                debounceTimerRef.current = setTimeout(commit, debounceMs);
            } else {
                commit();
            }
        },
        [maxSize],
    );

    const undo = useCallback(
        (current: T): T | null => {
            if (pastRef.current.length < 2) return null;
            if (debounceTimerRef.current) {
                clearTimeout(debounceTimerRef.current);
                debounceTimerRef.current = null;
            }
            pastRef.current.pop();
            futureRef.current.push({ data: structuredClone(current), timestamp: Date.now() });
            const prev = pastRef.current[pastRef.current.length - 1];
            return structuredClone(prev.data);
        },
        [],
    );

    const redo = useCallback(
        (): T | null => {
            if (futureRef.current.length === 0) return null;
            if (debounceTimerRef.current) {
                clearTimeout(debounceTimerRef.current);
                debounceTimerRef.current = null;
            }
            const next = futureRef.current.pop()!;
            pastRef.current.push({ data: structuredClone(next.data), timestamp: Date.now() });
            return structuredClone(next.data);
        },
        [],
    );

    const canUndo = useCallback(() => pastRef.current.length >= 2, []);
    const canRedo = useCallback(() => futureRef.current.length > 0, []);

    return useMemo(
        () => ({ pushState, undo, redo, canUndo, canRedo }),
        [pushState, undo, redo, canUndo, canRedo],
    );
}
