import React, { useEffect, useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, Edit, Settings, HelpCircle, MapPin, Calendar, Plus } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';

const Profile = () => {
    const { user } = useAuth();
    const navigate = useNavigate();
    const [profile, setProfile] = useState<Record<string, unknown> | null>(null);
    const [loading, setLoading] = useState(true);
    const [stats, setStats] = useState({ connections: 0, eventsJoined: 0 });

    useEffect(() => {
          const fetchProfile = async () => {
                  if (!user) return;

                  const { data, error } = await supabase
                    .from('profiles')
                    .select('*')
                    .eq('user_id', user.id)
                    .single();

                  if (!error && data) {
                            setProfile(data);
                  }

                  // Fetch live stats
                  const [{ count: connCount }, { count: eventCount }] = await Promise.all([
                            supabase
                              .from('connections')
                              .select('*', { count: 'exact', head: true })
                              .eq('user_id', user.id)
                              .eq('connection_type', 'match'),
                            supabase
                              .from('event_attendees')
                              .select('*', { count: 'exact', head: true })
                              .eq('user_id', user.id),
                          ]);

                  setStats({
                            connections: connCount ?? 0,
                            eventsJoined: eventCount ?? 0,
                  });

                  setLoading(false);
          };

                  fetchProfile();
    }, [user]);

    if (loading) {
          return (
                  <div className="min-h-screen bg-gradient-profile flex items-center justify-center">
                          <div className="text-foreground text-xl">Loading...</div>
                  </div>
                );
    }
  
    const hasNoLocation = !profile?.location;
    const hasNoBio = !profile?.bio;
    const hasNoInterests = !profile?.interests || ((profile.interests as string[])).length === 0;
  
    return (
          <div className="min-h-screen bg-gradient-profile">
                <div className="max-w-4xl mx-auto p-6">
                  {/* Header */}
                        <div className="flex items-center gap-4 mb-6">
                                  <Button variant="ghost" size="sm" onClick={() => navigate('/')} className="hover:bg-secondary">
                                              <ArrowLeft className="w-4 h-4 mr-2" />
                                              Back
                                  </Button>
                                  <h1 className="text-2xl font-bold text-foreground font-serif">My Profile</h1>
                        </div>
                
                  {/* Profile Card */}
                        <Card className="mb-6 shadow-card border-border">
                                  <CardHeader className="text-center pb-4">
                                              <Avatar className="w-24 h-24 mx-auto mb-4 shadow-elegant">
                                                            <AvatarImage src={profile?.avatar_url || undefined} alt="Profile picture" />
                                                            <AvatarFallback className="bg-gradient-to-br from-primary to-accent text-white text-2xl font-semibold">
                                                              {profile?.first_name?.[0] || ''}{profile?.last_name?.[0] || ''}
                                                            </AvatarFallback>
                                              </Avatar>
                                              <CardTitle className="text-2xl text-card-foreground">
                                                {profile?.first_name} {profile?.last_name}
                                              </CardTitle>
                                              <button
                                                              onClick={() => navigate('/edit-profile')}
                                                              className="flex items-center justify-center gap-1 text-muted-foreground mt-2 hover:text-primary transition-colors mx-auto"
                                                            >
                                                            <MapPin className="w-4 h-4" />
                                                            <span className={hasNoLocation ? 'text-primary/70 text-sm underline-offset-2 hover:underline' : ''}>
                                                              {profile?.location || 'Add your location'}
                                                            </span>
                                                {profile?.age && <><span>•</span><span>{profile.age} years old</span></>>}
                                              </button>
                                  </CardHeader>
                        
                                  <CardContent className="space-y-6">
                                    {/* Bio Section */}
                                              <div>
                                                            <h3 className="text-lg font-semibold text-card-foreground mb-3">About Me</h3>
                                                {hasNoBio ? (
                            <button
                                                onClick={() => navigate('/edit-profile')}
                                                className="flex items-center gap-2 text-sm text-primary/70 hover:text-primary transition-colors border border-dashed border-primary/30 rounded-lg p-4 w-full hover:border-primary/60 hover:bg-primary/5"
                                              >
                                              <Plus className="w-4 h-4" />
                                              Add a bio to tell your story and connect with like-minded women
                            </button>
                          ) : (
                            <p className="text-card-foreground/80 leading-relaxed">{profile.bio}</p>
                                                            )}
                                              </div>
                                  
                                    {/* Interests Section */}
                                              <div>
                                                            <h3 className="text-lg font-semibold text-card-foreground mb-3">Interests</h3>
                                                {hasNoInterests ? (
                            <button
                                                onClick={() => navigate('/edit-profile')}
                                                className="flex items-center gap-2 text-sm text-primary/70 hover:text-primary transition-colors border border-dashed border-primary/30 rounded-lg p-4 w-full hover:border-primary/60 hover:bg-primary/5"
                                              >
                                              <Plus className="w-4 h-4" />
                                              Add interests to help other women find and connect with you
                            </button>
                          ) : (
                            <div className="flex flex-wrap gap-2">
                              {((profile.interests as string[])).map((interest, index) => (
                                                  <Badge key={index} variant="secondary" className="bg-secondary text-secondary-foreground">
                                                    {interest}
                                                  </Badge>
                                                ))}
                            </div>
                                                            )}
                                              </div>
                                  
                                    {/* Stats Section */}
                                              <div className="grid grid-cols-2 gap-4 pt-4 border-t border-border">
                                                            <button
                                                                              onClick={() => navigate('/discover')}
                                                                              className="text-center hover:bg-secondary/50 rounded-xl p-3 transition-all"
                                                                            >
                                                                            <div className="text-2xl font-bold text-primary">{stats.connections}</div>
                                                                            <div className="text-sm text-muted-foreground">Connections</div>
                                                            </button>
                                                            <button
                                                                              onClick={() => navigate('/events')}
                                                                              className="text-center hover:bg-secondary/50 rounded-xl p-3 transition-all"
                                                                            >
                                                                            <div className="text-2xl font-bold text-accent">{stats.eventsJoined}</div>
                                                                            <div className="text-sm text-muted-foreground">Events Joined</div>
                                                            </button>
                                              </div>
                                  </CardContent>
                        </Card>
                
                  {/* Quick Actions */}
                        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                                  <Card className="hover:shadow-elegant transition-all duration-300 cursor-pointer" onClick={() => navigate('/edit-profile')}>
                                              <CardContent className="flex items-center gap-4 p-6">
                                                            <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
                                                                            <Edit className="w-6 h-6 text-primary" />
                                                            </div>
                                                            <div>
                                                                            <h3 className="font-semibold text-card-foreground">Edit Profile</h3>
                                                                            <p className="text-sm text-muted-foreground">Update your information</p>
                                                            </div>
                                              </CardContent>
                                  </Card>
                                  <Card className="hover:shadow-elegant transition-all duration-300 cursor-pointer" onClick={() => navigate('/settings')}>
                                              <CardContent className="flex items-center gap-4 p-6">
                                                            <div className="w-12 h-12 bg-accent/10 rounded-full flex items-center justify-center">
                                                                            <Settings className="w-6 h-6 text-accent" />
                                                            </div>
                                                            <div>
                                                                            <h3 className="font-semibold text-card-foreground">Settings</h3>
                                                                            <p className="text-sm text-muted-foreground">Privacy & preferences</p>
                                                            </div>
                                              </CardContent>
                                  </Card>
                                  <Card className="hover:shadow-elegant transition-all duration-300 cursor-pointer" onClick={() => navigate('/help-support')}>
                                              <CardContent className="flex items-center gap-4 p-6">
                                                            <div className="w-12 h-12 bg-coral/10 rounded-full flex items-center justify-center">
                                                                            <HelpCircle className="w-6 h-6 text-coral" />
                                                            </div>
                                                            <div>
                                                                            <h3 className="font-semibold text-card-foreground">Help & Support</h3>
                                                                            <p className="text-sm text-muted-foreground">Get assistance</p>
                                                            </div>
                                              </CardContent>
                                  </Card>
                        </div>
                
                  {/* Member Since */}
                        <Card className="mt-6 shadow-card border-border">
                                  <CardContent className="flex items-center gap-3 p-4">
                                              <Calendar className="w-5 h-5 text-muted-foreground" />
                                              <span className="text-sm text-muted-foreground">
                                                            Member since {new Date(profile?.created_at as string || Date.now()).toLocaleDateString('en-US', { year: 'numeric', month: 'long' })}
                                              </span>
                                  </CardContent>
                        </Card>
                </div>
          </div>
        );
};

export default Profile;</></div>
