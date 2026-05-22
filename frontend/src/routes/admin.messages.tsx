import { createFileRoute } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { Mail, Phone, User, Clock, Check, X, Archive, Trash2, Reply } from "lucide-react";
import { api } from "@/lib/api";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/admin/messages")({
  head: () => ({
    meta: [
      { title: "Messages — Ruddha Admin" },
    ],
  }),
  component: MessagesPage,
});

interface ContactMessage {
  id: string;
  name: string;
  email: string;
  phone: string;
  service: string;
  message: string;
  status: string;
  created_at: string;
}

function MessagesPage() {
  const [messages, setMessages] = useState<ContactMessage[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedMessage, setSelectedMessage] = useState<ContactMessage | null>(null);
  const [filter, setFilter] = useState<string>("all");

  useEffect(() => {
    loadMessages();
  }, []);

  const loadMessages = async () => {
    try {
      const data = await fetch("http://localhost:8001/api/contact", {
        headers: {
          Authorization: `Bearer ${api.getToken()}`,
        },
      }).then(res => res.json());
      setMessages(data);
    } catch (error) {
      console.error("Failed to load messages:", error);
    } finally {
      setLoading(false);
    }
  };

  const updateMessageStatus = async (messageId: string, status: string) => {
    try {
      await fetch(`http://localhost:8001/api/contact/${messageId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${api.getToken()}`,
        },
        body: JSON.stringify({ status }),
      });
      loadMessages();
      setSelectedMessage(null);
    } catch (error) {
      console.error("Failed to update message:", error);
    }
  };

  const deleteMessage = async (messageId: string) => {
    if (!confirm("Are you sure you want to delete this message?")) return;
    
    try {
      await fetch(`http://localhost:8001/api/contact/${messageId}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${api.getToken()}`,
        },
      });
      loadMessages();
      setSelectedMessage(null);
    } catch (error) {
      console.error("Failed to delete message:", error);
    }
  };

  const handleReply = (email: string, name: string) => {
    const subject = encodeURIComponent(`Re: Your inquiry - Ruddha Architects`);
    const body = encodeURIComponent(`Dear ${name},\n\nThank you for your interest in Ruddha Architects & Interiors.\n\nWe have received your inquiry and will get back to you shortly.\n\nBest regards,\nRuddha Architects & Interiors`);
    window.open(`mailto:${email}?subject=${subject}&body=${body}`);
  };

  const filteredMessages = messages.filter(msg => {
    if (filter === "all") return true;
    return msg.status === filter;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending": return "bg-yellow-500/20 text-yellow-500";
      case "read": return "bg-blue-500/20 text-blue-500";
      case "replied": return "bg-green-500/20 text-green-500";
      case "archived": return "bg-gray-500/20 text-gray-500";
      default: return "bg-gray-500/20 text-gray-500";
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  if (loading) {
    return (
      <div className="p-8">
        <div className="text-center">Loading messages...</div>
      </div>
    );
  }

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="font-display text-4xl">Messages</h1>
        <p className="mt-2 text-muted-foreground">View and manage client inquiries</p>
      </div>

      {/* Filter buttons */}
      <div className="mb-6 flex gap-2">
        <button
          onClick={() => setFilter("all")}
          className={cn(
            "px-4 py-2 text-sm rounded-lg transition-colors",
            filter === "all" ? "bg-gold text-primary-foreground" : "bg-border hover:bg-border/80"
          )}
        >
          All ({messages.length})
        </button>
        <button
          onClick={() => setFilter("pending")}
          className={cn(
            "px-4 py-2 text-sm rounded-lg transition-colors",
            filter === "pending" ? "bg-yellow-500 text-white" : "bg-border hover:bg-border/80"
          )}
        >
          Pending ({messages.filter(m => m.status === "pending").length})
        </button>
        <button
          onClick={() => setFilter("read")}
          className={cn(
            "px-4 py-2 text-sm rounded-lg transition-colors",
            filter === "read" ? "bg-blue-500 text-white" : "bg-border hover:bg-border/80"
          )}
        >
          Read ({messages.filter(m => m.status === "read").length})
        </button>
        <button
          onClick={() => setFilter("replied")}
          className={cn(
            "px-4 py-2 text-sm rounded-lg transition-colors",
            filter === "replied" ? "bg-green-500 text-white" : "bg-border hover:bg-border/80"
          )}
        >
          Replied ({messages.filter(m => m.status === "replied").length})
        </button>
      </div>

      <div className="grid gap-4">
        {filteredMessages.length === 0 ? (
          <div className="text-center py-12 text-muted-foreground">
            No messages found
          </div>
        ) : (
          filteredMessages.map((message) => (
            <div
              key={message.id}
              onClick={() => setSelectedMessage(message)}
              className={cn(
                "border border-border rounded-lg p-6 cursor-pointer transition-all hover:border-gold/50",
                selectedMessage?.id === message.id && "border-gold bg-gold/5"
              )}
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <User size={16} className="text-muted-foreground" />
                    <span className="font-semibold">{message.name}</span>
                    <span className={cn(
                      "px-2 py-0.5 text-xs rounded-full",
                      getStatusColor(message.status)
                    )}>
                      {message.status}
                    </span>
                  </div>
                  
                  <div className="flex items-center gap-4 text-sm text-muted-foreground mb-3">
                    <div className="flex items-center gap-1">
                      <Mail size={14} />
                      <span>{message.email}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Phone size={14} />
                      <span>{message.phone}</span>
                    </div>
                    {message.service && (
                      <div className="flex items-center gap-1">
                        <span>Service: {message.service}</span>
                      </div>
                    )}
                  </div>

                  <p className="text-sm line-clamp-2 text-muted-foreground">
                    {message.message}
                  </p>

                  <div className="flex items-center gap-1 mt-3 text-xs text-muted-foreground">
                    <Clock size={12} />
                    <span>{formatDate(message.created_at)}</span>
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Message detail modal */}
      {selectedMessage && (
        <div
          className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
          onClick={() => setSelectedMessage(null)}
        >
          <div
            className="bg-card border border-border rounded-lg p-8 max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-start justify-between mb-6">
              <div>
                <h2 className="font-display text-2xl">{selectedMessage.name}</h2>
                <div className="flex items-center gap-4 text-sm text-muted-foreground mt-2">
                  <div className="flex items-center gap-1">
                    <Mail size={14} />
                    <span>{selectedMessage.email}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Phone size={14} />
                    <span>{selectedMessage.phone}</span>
                  </div>
                </div>
              </div>
              <button
                onClick={() => setSelectedMessage(null)}
                className="text-muted-foreground hover:text-foreground"
              >
                <X size={24} />
              </button>
            </div>

            {selectedMessage.service && (
              <div className="mb-4">
                <span className="text-sm text-muted-foreground">Service: </span>
                <span className="font-medium">{selectedMessage.service}</span>
              </div>
            )}

            <div className="mb-6">
              <h3 className="text-sm font-medium mb-2">Message:</h3>
              <p className="text-muted-foreground whitespace-pre-wrap">{selectedMessage.message}</p>
            </div>

            <div className="flex items-center justify-between pt-6 border-t border-border">
              <div className="flex items-center gap-1 text-xs text-muted-foreground">
                <Clock size={12} />
                <span>{formatDate(selectedMessage.created_at)}</span>
              </div>
              <div className="flex gap-2">
                <button
                  className="flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
                  onClick={() => updateMessageStatus(selectedMessage.id, "read")}
                >
                  <Check size={16} />
                  Mark as Read
                </button>
                <button
                  className="flex items-center gap-2 px-4 py-2 bg-gold text-primary-foreground rounded-lg hover:bg-gold/90 transition-colors"
                  onClick={() => updateMessageStatus(selectedMessage.id, "replied")}
                >
                  <Check size={16} />
                  Mark as Replied
                </button>
                <button
                  className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                  onClick={() => handleReply(selectedMessage.email, selectedMessage.name)}
                >
                  <Reply size={16} />
                  Reply via Email
                </button>
                <button
                  className="flex items-center gap-2 px-4 py-2 bg-border hover:bg-border/80 rounded-lg transition-colors"
                  onClick={() => updateMessageStatus(selectedMessage.id, "archived")}
                >
                  <Archive size={16} />
                  Archive
                </button>
                <button
                  className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                  onClick={() => deleteMessage(selectedMessage.id)}
                >
                  <Trash2 size={16} />
                  Delete
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
