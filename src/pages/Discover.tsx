import React, { useState } from 'react';
import { Heart, MessageCircle, MapPin } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';

const Discover = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [likedUsers, setLikedUsers] = useState(new Set());

  // Fetch discoverable profiles using secure function
  const { data: profiles = [], isLoading } = useQuery({
    queryKey: ['discoverable-profiles'],
    queryFn: async () => {
      const { data, error } = await supabase.rpc('get_discovery_profiles', {
        requesting_user_id: user?.id
      });
      
      if (error) throw error;
      return data;
    },
    enabled: !!user
  });

  // Fetch existing connections to track liked users
  const { data: connections = [] } = useQuery({
    queryKey: ['my-connections'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('connections')
        .select('connected_user_id, connection_type')
        .eq('user_id', user?.id);
      
      if (error) throw error;
      return data;
    },
    enabled: !!user
  });

  // Create connection mutation
  const createConnectionMutation = useMutation({
    mutationFn: async ({ connectedUserId, connectionType }: { connectedUserId: string, connectionType: string }) => {
      const { error } = await supabase
        .from('connections')
        .insert({
          user_id: user?.id,
          connected_user_id: connectedUserId,
          connection_type: connectionType
        });
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['my-connections'] });
      toast({ title: "Connection sent!" });
    },
    onError: (error) => {
      console.error('Error creating connection:', error);
      toast({ title: "Error sending connection", variant: "destructive" });
    }
  });

  const handleLike = (userId: string) => {
    setLikedUsers(prev => new Set([...prev, userId]));
    createConnectionMutation.mutate({ 
      connectedUserId: userId, 
      connectionType: 'like' 
    });
  };

  // Get connection status for a user
  const getConnectionStatus = (userId: string) => {
    return connections.find(c => c.connected_user_id === userId)?.connection_type;
  };

  if (isLoading) {
    return (
      <div className="flex-1 bg-gradient-discover p-6 animate-fade-in">
        <div className="mb-6">
          <h2 className="text-xl font-semibold text-foreground mb-2 tracking-tight">Discover Amazing Women</h2>
          <p className="text-muted-foreground">Connect with like-minded women in your area</p>
        </div>
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="bg-card rounded-2xl p-6 shadow-card border border-border animate-pulse">
              <div className="flex items-start gap-4 mb-4">
                <div className="w-16 h-16 bg-muted rounded-full"></div>
                <div className="flex-1 space-y-2">
                  <div className="h-4 bg-muted rounded w-1/3"></div>
                  <div className="h-3 bg-muted rounded w-1/4"></div>
                  <div className="h-3 bg-muted rounded w-full"></div>
                  <div className="flex gap-2">
                    <div className="h-6 bg-muted rounded w-16"></div>
                    <div className="h-6 bg-muted rounded w-20"></div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 bg-gradient-discover p-6 animate-fade-in">
      <div className="mb-6">
        <h2 className="text-xl font-semibold text-foreground mb-2 tracking-tight">Discover Amazing Women</h2>
        <p className="text-muted-foreground">Connect with like-minded women in your area</p>
        <div className="mt-3 p-3 bg-primary/5 border border-primary/20 rounded-lg">
          <p className="text-sm text-primary/80">
            🔒 <strong>Privacy-First Discovery:</strong> We show limited information to protect your privacy. 
            Full profiles are revealed only after mutual connections are made.
          </p>
        </div>
      </div>

      <div className="space-y-4">
        {profiles.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-muted-foreground">No new profiles to discover right now.</p>
            <p className="text-sm text-muted-foreground mt-2">Check back later for more connections!</p>
          </div>
        ) : (
          profiles.map(profile => {
            const connectionStatus = getConnectionStatus(profile.user_id);
            const isLiked = connectionStatus === 'like' || likedUsers.has(profile.user_id);
            
            return (
              <div key={profile.user_id} className="bg-card rounded-2xl p-6 shadow-card border border-border hover:shadow-elegant transition-all duration-300 animate-slide-up">
                <div className="flex items-start gap-4 mb-4">
                  <div className="w-16 h-16 bg-gradient-to-br from-primary/20 to-accent/20 rounded-full flex items-center justify-center">
                    {profile.avatar_url ? (
                      <img 
                        src={profile.avatar_url} 
                        alt="Profile" 
                        className="w-full h-full rounded-full object-cover"
                      />
                    ) : (
                      <span className="text-2xl">👤</span>
                    )}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="text-lg font-semibold text-card-foreground">{profile.first_name_initial}</h3>
                      <span className="text-sm text-muted-foreground">• {profile.age_range}</span>
                    </div>
                    <div className="flex items-center gap-1 text-sm text-muted-foreground mb-2">
                      <MapPin className="w-4 h-4" />
                      <span>{profile.city_only}</span>
                    </div>
                    {profile.has_bio && (
                      <p className="text-card-foreground/80 text-sm leading-relaxed mb-3 italic">
                        "Bio available after connection"
                      </p>
                    )}
                    {profile.interests_sample && profile.interests_sample.length > 0 && (
                      <div className="flex flex-wrap gap-2">
                        {profile.interests_sample.map((interest, idx) => (
                          <span key={idx} className="px-3 py-1 bg-secondary text-secondary-foreground text-xs rounded-full">
                            {interest}
                          </span>
                        ))}
                        <span className="px-3 py-1 bg-muted text-muted-foreground text-xs rounded-full">
                          +more interests
                        </span>
                      </div>
                    )}
                  </div>
                </div>
                
                <div className="flex items-center justify-end">
                  <div className="flex gap-3">
                    <button
                      onClick={() => handleLike(profile.user_id)}
                      disabled={connectionStatus !== undefined}
                      className={`flex items-center gap-2 px-4 py-2 rounded-full transition-all duration-300 ${
                        isLiked
                          ? 'bg-accent/20 text-accent scale-105'
                          : connectionStatus
                          ? 'bg-muted text-muted-foreground cursor-not-allowed'
                          : 'bg-secondary text-secondary-foreground hover:bg-accent/10 hover:text-accent'
                      }`}
                    >
                      <Heart className="w-4 h-4" fill={isLiked ? 'currentColor' : 'none'} />
                      <span className="text-sm">
                        {connectionStatus === 'like' ? 'Liked' : connectionStatus === 'match' ? 'Matched' : 'Connect'}
                      </span>
                    </button>
                    {connectionStatus === 'match' && (
                      <button
                        onClick={() => navigate('/messages')}
                        className="flex items-center gap-2 px-4 py-2 bg-primary/10 text-primary rounded-full hover:bg-primary/20 transition-all duration-300 hover:scale-105"
                      >
                        <MessageCircle className="w-4 h-4" />
                        <span className="text-sm">Message</span>
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};

export default Discover;