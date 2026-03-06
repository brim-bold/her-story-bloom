import React, { useEffect, useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, Plus, X, Save } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { AvatarUpload } from '@/components/AvatarUpload';

const SUGGESTED_INTERESTS = [
    'Entrepreneurship', 'Wellness', 'Motherhood', 'Travel', 'Fitness',
    'Photography', 'Cooking', 'Reading', 'Art', 'Music', 'Technology',
    'Fashion', 'Finance', 'Meditation', 'Volunteering', 'Writing',
    'Yoga', 'Networking', 'Self-care', 'Leadership',
  ];

const EditProfile = () => {
    const { user } = useAuth();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [formData, setFormData] = useState({
          first_name: '',
          last_name: '',
          bio: '',
          location: '',
          age: '',
          interests: [] as string[],
          avatar_url: null as string | null,
    });
    const [newInterest, setNewInterest] = useState('');

    useEffect(() => {
          const fetchProfile = async () => {
                  if (!user) return;
                  const { data, error } = await supabase
                    .from('profiles')
                    .select('*')
                    .eq('user_id', user.id)
                    .single();

                  if (!error && data) {
                            setFormData({
                                        first_name: data.first_name || '',
                                        last_name: data.last_name || '',
                                        bio: data.bio || '',
                                        location: data.location || '',
                                        age: data.age ? data.age.toString() : '',
                                        interests: data.interests || [],
                                        avatar_url: data.avatar_url || null,
                            });
                  }
                  setLoading(false);
          };
          fetchProfile();
    }, [user]);

    const handleInputChange = (field: string, value: string) => {
          setFormData(prev => ({ ...prev, [field]: value }));
    };

    const addInterest = (interest?: string) => {
          const value = (interest || newInterest).trim();
          if (value && !formData.interests.includes(value)) {
                  setFormData(prev => ({ ...prev, interests: [...prev.interests, value] }));
                  if (!interest) setNewInterest('');
          }
    };

    const removeInterest = (interestToRemove: string) => {
          setFormData(prev => ({
                  ...prev,
                  interests: prev.interests.filter(i => i !== interestToRemove),
          }));
    };

    const handleAvatarUpdate = (newUrl: string | null) => {
          setFormData(prev => ({ ...prev, avatar_url: newUrl }));
    };

    // Profile completeness score
    const completenessFields = [
          !!formData.first_name,
          !!formData.last_name,
          !!formData.bio,
          !!formData.location,
          !!formData.age,
          formData.interests.length > 0,
          !!formData.avatar_url,
        ];
    const completeness = Math.round((completenessFields.filter(Boolean).length / completenessFields.length) * 100);

    const handleSave = async () => {
          if (!user) return;
          setSaving(true);
          const updateData = {
                  first_name: formData.first_name,
                  last_name: formData.last_name,
                  bio: formData.bio,
                  location: formData.location,
                  age: formData.age ? parseInt(formData.age) : null,
                  interests: formData.interests,
          };
          const { error } = await supabase.from('profiles').update(updateData).eq('user_id', user.id);
          if (error) {
                  toast.error('Failed to update profile');
          } else {
                  toast.success('Profile updated successfully!');
                  navigate('/profile');
          }
          setSaving(false);
    };

    if (loading) {
          return (
                  <div className="min-h-screen bg-gradient-profile flex items-center justify-center">
                          <div className="text-foreground text-xl">Loading...</div>
                  </div>
                );
    }
  
    const unusedSuggestions = SUGGESTED_INTERESTS.filter(s => !formData.interests.includes(s));
  
    return (
          <div className="min-h-screen bg-gradient-profile">
                <div className="max-w-2xl mx-auto p-6">
                  {/* Header */}
                        <div className="flex items-center gap-4 mb-6">
                                  <Button variant="ghost" size="sm" onClick={() => navigate('/profile')} className="hover:bg-secondary">
                                              <ArrowLeft className="w-4 h-4 mr-2" />
                                              Back
                                  </Button>
                                  <h1 className="text-2xl font-bold text-foreground font-serif">Edit Profile</h1>
                        </div>
                
                  {/* Profile Completeness */}
                        <Card className="mb-4 shadow-card border-border">
                                  <CardContent className="p-4">
                                              <div className="flex items-center justify-between mb-2">
                                                            <span className="text-sm font-medium text-foreground">Profile completeness</span>
                                                            <span className="text-sm font-bold text-primary">{completeness}%</span>
                                              </div>
                                              <div className="w-full bg-secondary rounded-full h-2">
                                                            <div
                                                                              className="bg-gradient-button h-2 rounded-full transition-all duration-500"
                                                                              style={{ width: `${completeness}%` }}
                                                                            />
                                              </div>
                                    {completeness < 100 && (
                          <p className="text-xs text-muted-foreground mt-2">
                                          Complete your profile to appear in the member directory and get more connections!
                          </p>
                                              )}
                                  </CardContent>
                        </Card>
                
                        <Card className="shadow-card border-border">
                                  <CardHeader>
                                              <CardTitle className="flex items-center gap-2">
                                                            <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
                                                                            <Save className="w-4 h-4 text-primary" />
                                                            </div>
                                                            Update Your Information
                                              </CardTitle>
                                  </CardHeader>
                                  <CardContent className="space-y-6">
                                    {/* Avatar Upload */}
                                              <div className="flex justify-center">
                                                            <AvatarUpload
                                                                              currentAvatarUrl={formData.avatar_url}
                                                                              onAvatarUpdate={handleAvatarUpdate}
                                                                              size="lg"
                                                                            />
                                              </div>
                                  
                                    {/* Name Fields */}
                                              <div className="grid grid-cols-2 gap-4">
                                                            <div className="space-y-2">
                                                                            <Label htmlFor="firstName">First Name</Label>
                                                                            <Input
                                                                                                id="firstName"
                                                                                                value={formData.first_name}
                                                                                                onChange={e => handleInputChange('first_name', e.target.value)}
                                                                                                placeholder="Your first name"
                                                                                              />
                                                            </div>
                                                            <div className="space-y-2">
                                                                            <Label htmlFor="lastName">Last Name</Label>
                                                                            <Input
                                                                                                id="lastName"
                                                                                                value={formData.last_name}
                                                                                                onChange={e => handleInputChange('last_name', e.target.value)}
                                                                                                placeholder="Your last name"
                                                                                              />
                                                            </div>
                                              </div>
                                  
                                    {/* Location and Age */}
                                              <div className="grid grid-cols-2 gap-4">
                                                            <div className="space-y-2">
                                                                            <Label htmlFor="location">Location</Label>
                                                                            <Input
                                                                                                id="location"
                                                                                                value={formData.location}
                                                                                                onChange={e => handleInputChange('location', e.target.value)}
                                                                                                placeholder="e.g. Miami, FL"
                                                                                              />
                                                            </div>
                                                            <div className="space-y-2">
                                                                            <Label htmlFor="age">Age</Label>
                                                                            <Input
                                                                                                id="age"
                                                                                                type="number"
                                                                                                value={formData.age}
                                                                                                onChange={e => handleInputChange('age', e.target.value)}
                                                                                                placeholder="Your age"
                                                                                                min="18"
                                                                                                max="100"
                                                                                              />
                                                            </div>
                                              </div>
                                  
                                    {/* Bio */}
                                              <div className="space-y-2">
                                                            <Label htmlFor="bio">Bio</Label>
                                                            <Textarea
                                                                              id="bio"
                                                                              value={formData.bio}
                                                                              onChange={e => handleInputChange('bio', e.target.value)}
                                                                              placeholder="Tell your story... What makes you unique? What are you passionate about?"
                                                                              rows={4}
                                                                              className="resize-none"
                                                                              maxLength={500}
                                                                            />
                                                            <p className="text-sm text-muted-foreground">{formData.bio.length}/500 characters</p>
                                              </div>
                                  
                                    {/* Interests */}
                                              <div className="space-y-4">
                                                            <Label>Interests</Label>
                                              
                                                {/* Current interests */}
                                                {formData.interests.length > 0 && (
                            <div className="flex flex-wrap gap-2">
                              {formData.interests.map((interest, index) => (
                                                  <Badge
                                                                          key={index}
                                                                          variant="secondary"
                                                                          className="bg-primary/10 text-primary border border-primary/20 pr-1 gap-1"
                                                                        >
                                                    {interest}
                                                                        <button
                                                                                                  onClick={() => removeInterest(interest)}
                                                                                                  className="ml-1 hover:bg-destructive/20 rounded-full p-0.5"
                                                                                                >
                                                                                                <X className="w-3 h-3" />
                                                                        </button>
                                                  </Badge>
                                                ))}
                            </div>
                                                            )}
                                              
                                                {/* Add custom interest */}
                                                            <div className="flex gap-2">
                                                                            <Input
                                                                                                value={newInterest}
                                                                                                onChange={e => setNewInterest(e.target.value)}
                                                                                                placeholder="Add a custom interest..."
                                                                                                onKeyPress={e => e.key === 'Enter' && addInterest()}
                                                                                              />
                                                                            <Button
                                                                                                type="button"
                                                                                                onClick={() => addInterest()}
                                                                                                size="sm"
                                                                                                className="bg-primary/10 text-primary hover:bg-primary/20"
                                                                                              >
                                                                                              <Plus className="w-4 h-4" />
                                                                            </Button>
                                                            </div>
                                              
                                                {/* Suggested interests */}
                                                {unusedSuggestions.length > 0 && (
                            <div>
                                              <p className="text-xs text-muted-foreground mb-2">Tap to add suggested interests:</p>
                                              <div className="flex flex-wrap gap-2">
                                                {unusedSuggestions.map(suggestion => (
                                                    <button
                                                                              key={suggestion}
                                                                              type="button"
                                                                              onClick={() => addInterest(suggestion)}
                                                                              className="px-3 py-1 text-xs rounded-full border border-border text-muted-foreground hover:border-primary/50 hover:text-primary hover:bg-primary/5 transition-all"
                                                                            >
                                                                            + {suggestion}
                                                    </button>
                                                  ))}
                                              </div>
                            </div>
                                                            )}
                                              
                                                {formData.interests.length === 0 && (
                            <p className="text-sm text-muted-foreground">
                                              Add interests to help other women find and connect with you
                            </p>
                                                            )}
                                              </div>
                                  
                                    {/* Save Button */}
                                              <div className="flex gap-3 pt-4">
                                                            <Button
                                                                              onClick={handleSave}
                                                                              disabled={saving}
                                                                              className="flex-1 bg-gradient-button hover:shadow-glow"
                                                                            >
                                                              {saving ? 'Saving...' : 'Save Changes'}
                                                            </Button>
                                                            <Button variant="outline" onClick={() => navigate('/profile')} disabled={saving}>
                                                                            Cancel
                                                            </Button>
                                              </div>
                                  </CardContent>
                        </Card>
                </div>
          </div>
        );
};

export default EditProfile;
