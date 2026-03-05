import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { formatDistanceToNow } from 'date-fns';
import { MessageCircle, Users } from 'lucide-react';

interface ConversationWithDetails {
    id: string;
    last_message_at: string;
    participants: Array<{
      user_id: string;
      profiles?: {
        first_name?: string;
        last_name?: string;
      };
    }>;
    latest_message?: {
      content: string;
      sender_id: string;
    };
}

const Messages = () => {
    const navigate = useNavigate();
    const { user } = useAuth();

    const { data: conversations, isLoading } = useQuery({
          queryKey: ['user-conversations'],
          queryFn: async () => {
                  if (!user) return [];
                  const { data, error } = await supabase
                    .from('conversations')
                    .select(`
                              id,
                                        last_message_at,
                                                  conversation_participants!inner(
                                                              user_id,
                                                                          profiles!inner(first_name, last_name)
                                                                                    )
                                                                                            `)
                    .eq('conversation_participants.user_id', user.id)
                    .is('conversation_participants.left_at', null)
                    .order('last_message_at', { ascending: false });

            if (error) throw error;

            const conversationsWithMessages = await Promise.all(
                      data.map(async (conv: Record<string, unknown>) => {
                                  const { data: latestMessage } = await supabase
                                    .from('messages')
                                    .select('content, sender_id')
                                    .eq('conversation_id', conv.id)
                                    .order('created_at', { ascending: false })
                                    .limit(1)
                                    .single();

                                         return {
                                                       ...conv,
                                                       participants: conv.conversation_participants,
                                                       latest_message: latestMessage,
                                         } as ConversationWithDetails;
                      })
                    );
                  return conversationsWithMessages;
          },
          enabled: !!user,
    });

    return (
          <div className="flex-1 bg-gradient-messages p-6 animate-fade-in">
                <div className="mb-6">
                        <h2 className="text-xl font-semibold text-foreground mb-2 font-serif">Messages</h2>h2>
                        <p className="text-muted-foreground">Your conversations</p>p>
                </div>div>
          
                <div className="space-y-3">
                  {isLoading ? (
                      <div className="space-y-3">
                        {[1, 2, 3].map(i => (
                                      <div key={i} className="bg-card rounded-xl p-4 border border-border animate-pulse h-20" />
                                    ))}
                      </div>div>
                    ) : conversations && conversations.length > 0 ? (
                      conversations.map(conv => {
                                    const otherParticipant = conv.participants.find(p => p.user_id !== user?.id);
                                    const participantName = otherParticipant?.profiles
                                                    ? `${otherParticipant.profiles.first_name || ''} ${otherParticipant.profiles.last_name || ''}`.trim()
                                                    : 'Unknown User';
                                    const timeAgo = formatDistanceToNow(new Date(conv.last_message_at), { addSuffix: true });
                                    const isFromCurrentUser = conv.latest_message?.sender_id === user?.id;
                                    const messagePreview = conv.latest_message?.content || 'No messages yet';
                        
                                    return (
                                                    <button
                                                                      key={conv.id}
                                                                      onClick={() => navigate(`/messages/${conv.id}`)}
                                                                      className="w-full bg-card rounded-xl p-4 shadow-card border border-border hover:bg-secondary/50 transition-all duration-300 hover:scale-105 animate-slide-up"
                                                                    >
                                                                    <div className="flex items-center gap-4">
                                                                                      <div className="w-12 h-12 bg-gradient-to-br from-primary/20 to-secondary/20 rounded-full flex items-center justify-center text-lg font-semibold text-primary">
                                                                                        {participantName.charAt(0).toUpperCase()}
                                                                                        </div>div>
                                                                                      <div className="flex-1 text-left">
                                                                                                          <div className="flex items-center justify-between mb-1">
                                                                                                                                <h3 className="font-semibold text-card-foreground">{participantName}</h3>h3>
                                                                                                                                <span className="text-xs text-muted-foreground">{timeAgo}</span>span>
                                                                                                            </div>div>
                                                                                                          <p className="text-sm text-muted-foreground truncate">
                                                                                                            {isFromCurrentUser && 'You: '}{messagePreview}
                                                                                                            </p>p>
                                                                                        </div>div>
                                                                    </div>div>
                                                    </button>button>
                                                  );
                      })
                    ) : (
                      /* Empty state */
                      <div className="flex flex-col items-center justify-center py-16 text-center">
                                  <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mb-5">
                                                <MessageCircle className="w-10 h-10 text-primary/50" />
                                  </div>div>
                                  <h3 className="text-lg font-semibold text-foreground mb-2">No conversations yet</h3>h3>
                                  <p className="text-muted-foreground text-sm max-w-xs mb-2">
                                                Messages unlock after a mutual connection is made in the Member Directory.
                                  </p>p>
                                  <p className="text-muted-foreground/70 text-xs max-w-xs mb-6">
                                                Connect with another member and once they connect back, you'll be able to message each other here.
                                  </p>p>
                                  <button
                                                  onClick={() => navigate('/discover')}
                                                  className="flex items-center gap-2 bg-gradient-button text-white px-6 py-3 rounded-full font-medium hover:opacity-90 transition-all hover:scale-105 shadow-md"
                                                >
                                                <Users className="w-4 h-4" />
                                                Find Members to Connect With
                                  </button>button>
                      </div>div>
                        )}
                </div>div>
          </div>div>
        );
};

export default Messages;</div>
