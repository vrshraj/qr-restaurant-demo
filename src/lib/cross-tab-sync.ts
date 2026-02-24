'use client'

type SyncEvent = {
    type: '86_TOGGLE' | 'ORDER_PLACED' | 'STATUS_UPDATE'
    payload: unknown
}

class CrossTabSync {
    private channel: BroadcastChannel | null = null
    private listeners: Map<string, Set<(data: unknown) => void>> = new Map()

    constructor() {
        if (typeof window !== 'undefined') {
            this.channel = new BroadcastChannel('qr-restaurant-sync')
            this.channel.onmessage = (event: MessageEvent<SyncEvent>) => {
                const listeners = this.listeners.get(event.data.type)
                if (listeners) {
                    listeners.forEach(fn => fn(event.data.payload))
                }
            }
        }
    }

    broadcast(type: SyncEvent['type'], payload: unknown) {
        this.channel?.postMessage({ type, payload })
        // Also trigger localStorage event for older browsers
        if (typeof window !== 'undefined') {
            localStorage.setItem('qr-sync-event', JSON.stringify({ type, payload, timestamp: Date.now() }))
        }
    }

    subscribe(type: SyncEvent['type'], callback: (data: unknown) => void) {
        if (!this.listeners.has(type)) {
            this.listeners.set(type, new Set())
        }
        this.listeners.get(type)!.add(callback)

        // Cleanup function
        return () => {
            this.listeners.get(type)?.delete(callback)
        }
    }
}

export const crossTabSync = new CrossTabSync()
