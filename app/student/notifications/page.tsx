"use client"

import { useState, useEffect } from "react"
import { Bell, CheckCircle, AlertTriangle, Info } from "lucide-react"
import { createClient } from "@/utils/supabase/client"
import { getNotifications, markNotificationRead } from "@/app/actions/student-actions"
import { format } from "date-fns"

export default function NotificationsPage() {
    const [notifications, setNotifications] = useState<any[]>([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        async function loadNotifications() {
            const supabase = createClient()
            const { data: { user } } = await supabase.auth.getUser()
            if (user) {
                const data = await getNotifications(user.id)
                setNotifications(data)
            }
            setLoading(false)
        }
        loadNotifications()
    }, [])

    const handleMarkRead = async (id: string) => {
        await markNotificationRead(id)
        setNotifications(notifications.map(n => n.id === id ? { ...n, is_read: true } : n))
    }

    if (loading) {
        return <div className="p-8">Loading...</div>
    }

    return (
        <div className="space-y-6 p-6 lg:p-8">
            <div className="space-y-2">
                <h1 className="text-2xl font-bold tracking-tight text-foreground">Notifications</h1>
                <p className="text-sm text-muted-foreground">Stay updated with important alerts and announcements</p>
            </div>

            <div className="space-y-4">
                {notifications.length === 0 ? (
                    <div className="text-center py-12 text-muted-foreground">
                        No notifications yet.
                    </div>
                ) : (
                    notifications.map((notification) => (
                        <div
                            key={notification.id}
                            className={`flex items-start gap-4 rounded-lg border p-4 transition-colors ${notification.is_read ? "bg-card border-border" : "bg-muted/30 border-primary/20"
                                }`}
                        >
                            <div className={`mt-1 rounded-full p-2 ${notification.type === 'warning' ? 'bg-yellow-500/10 text-yellow-500' :
                                    notification.type === 'success' ? 'bg-green-500/10 text-green-500' :
                                        'bg-blue-500/10 text-blue-500'
                                }`}>
                                {notification.type === 'warning' ? <AlertTriangle className="h-4 w-4" /> :
                                    notification.type === 'success' ? <CheckCircle className="h-4 w-4" /> :
                                        <Info className="h-4 w-4" />}
                            </div>
                            <div className="flex-1 space-y-1">
                                <div className="flex items-center justify-between">
                                    <p className={`font-medium ${notification.is_read ? "text-foreground" : "text-primary"}`}>
                                        {notification.title}
                                    </p>
                                    <span className="text-xs text-muted-foreground">
                                        {format(new Date(notification.created_at), "MMM d, h:mm a")}
                                    </span>
                                </div>
                                <p className="text-sm text-muted-foreground">
                                    {notification.message}
                                </p>
                                {notification.courses && (
                                    <p className="text-xs text-muted-foreground mt-1">
                                        Course: {notification.courses.course_code}
                                    </p>
                                )}
                            </div>
                            {!notification.is_read && (
                                <button
                                    onClick={() => handleMarkRead(notification.id)}
                                    className="text-xs font-medium text-primary hover:underline"
                                >
                                    Mark as read
                                </button>
                            )}
                        </div>
                    ))
                )}
            </div>
        </div>
    )
}
