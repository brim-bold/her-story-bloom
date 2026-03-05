import React, { useState } from 'react';
import { Calendar, MapPin, Users, Plus, Coffee, Dumbbell, BookOpen, X, Wifi } from 'lucide-react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';
import { format } from 'date-fns';

interface Event {
    id: string;
    title: string;
    description?: string;
    event_date: string;
    location?: string;
    is_virtual: boolean;
    event_type: string;
    created_by: string;
    max_attendees?: number;
    attendee_count?: number;
    user_has_rsvpd?: boolean;
}

const EVENT_TYPES = ['networking', 'wellness', 'workshop', 'social', 'general'];

const SUGGESTED_INTERESTS = [
    'Entrepreneurship', 'Wellness', 'Motherhood', 'Travel', 'Fitness',
    'Photography', 'Cooking', 'Reading', 'Art', 'Music', 'Technology',
    'Fashion', 'Finance', 'Meditation', 'Volunteering'
  ];

const Events = () => {
    const { user } = useAuth();
    const { toast } = useToast();
    const queryClient = useQueryClient();
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [form, setForm] = useState({
          title: '',
          description: '',
          event_date: '',
          event_time: '',
          location: '',
          is_virtual: false,
          event_type: 'general',
          max_attendees: '',
    });

    // Fetch events with attendee counts
    const { data: events = [], isLoading } = useQuery({
          queryKey: ['events'],
          queryFn: async () => {
                  const { data, error } = await supabase
                    .from('events')
                    .select(`
                              *,
                                        event_attendees(count)
                                                `)
                    .gte('event_date', new Date().toISOString())
                    .order('event_date', { ascending: true });
                  if (error) throw error;

            // Check which events current user has RSVP'd to
            const { data: myRsvps } = await supabase
                    .from('event_attendees')
                    .select('event_id')
                    .eq('user_id', user?.id);

            const rsvpSet = new Set((myRsvps || []).map(r => r.event_id));

            return (data || []).map(event => ({
                      ...event,
                      attendee_count: event.event_attendees?.[0]?.count ?? 0,
                      user_has_rsvpd: rsvpSet.has(event.id),
            })) as Event[];
          },
          enabled: !!user,
    });

    // Create event mutation
    const createEventMutation = useMutation({
          mutationFn: async () => {
                  const eventDatetime = new Date(`${form.event_date}T${form.event_time || '12:00'}`);
                  const { error } = await supabase.from('events').insert({
                            title: form.title,
                            description: form.description || null,
                            event_date: eventDatetime.toISOString(),
                            location: form.location || null,
                            is_virtual: form.is_virtual,
                            event_type: form.event_type,
                            max_attendees: form.max_attendees ? parseInt(form.max_attendees) : null,
                            created_by: user!.id,
                  });
                  if (error) throw error;
          },
          onSuccess: () => {
                  queryClient.invalidateQueries({ queryKey: ['events'] });
                  toast({ title: 'Event created!' });
                  setShowCreateModal(false);
                  setForm({ title: '', description: '', event_date: '', event_time: '', location: '', is_virtual: false, event_type: 'general', max_attendees: '' });
          },
          onError: () => toast({ title: 'Failed to create event', variant: 'destructive' }),
    });

    // RSVP mutation
    const rsvpMutation = useMutation({
          mutationFn: async ({ eventId, isRsvpd }: { eventId: string; isRsvpd: boolean }) => {
                  if (isRsvpd) {
                            const { error } = await supabase.from('event_attendees').delete().eq('event_id', eventId).eq('user_id', user!.id);
                            if (error) throw error;
                  } else {
                            const { error } = await supabase.from('event_attendees').insert({ event_id: eventId, user_id: user!.id });
                            if (error) throw error;
                  }
          },
          onSuccess: () => queryClient.invalidateQueries({ queryKey: ['events'] }),
          onError: () => toast({ title: 'Could not update RSVP', variant: 'destructive' }),
    });

    const getEventIcon = (type: string) => {
          if (type === 'networking') return <Coffee className="w-4 h-4 text-primary" />;
          if (type === 'wellness') return <Dumbbell className="w-4 h-4 text-accent" />;
          return <BookOpen className="w-4 h-4 text-coral" />;
    };

    const getEventIconBg = (type: string) => {
          if (type === 'networking') return 'bg-primary/10';
          if (type === 'wellness') return 'bg-accent/10';
          return 'bg-coral/10';
    };

    return (
          <div className="flex-1 bg-gradient-events p-6 animate-fade-in">
                <div className="mb-6 flex items-center justify-between">
                        <div>
                                  <h2 className="text-xl font-semibold text-foreground mb-2">Upcoming Events</h2>
                                  <p className="text-muted-foreground">Join local gatherings, workshops and meetups</p>
                        </div>
                        <button
                                    onClick={() => setShowCreateModal(true)}
                                    className="p-3 bg-primary/10 rounded-full hover:bg-primary/20 transition-all duration-300 hover:scale-105"
                                    title="Create new event"
                                  >
                                  <Plus className="w-5 h-5 text-primary" />
                        </button>
                </div>
          
            {isLoading ? (
                    <div className="space-y-4">
                      {[1, 2, 3].map(i => (
                                  <div key={i} className="bg-card rounded-2xl p-5 shadow-card border border-border animate-pulse h-40" />
                                ))}
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {events.length === 0 ? (
                                  <div className="bg-card rounded-2xl p-8 shadow-card border border-border text-center">
                                                <Calendar className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                                                <h3 className="text-lg font-semibold text-card-foreground mb-2">No Upcoming Events</h3>
                                                <p className="text-muted-foreground mb-4">Be the first to create an event for the community!</p>
                                                <button
                                                                  onClick={() => setShowCreateModal(true)}
                                                                  className="bg-gradient-button text-white px-6 py-2 rounded-full text-sm font-medium hover:opacity-90 transition-all"
                                                                >
                                                                Create an Event
                                                </button>
                                  </div>
                                ) : (
                                  events.map(event => (
                                                  <div key={event.id} className="bg-card rounded-2xl p-5 shadow-card border border-border hover:shadow-elegant transition-all duration-300 animate-slide-up">
                                                                  <div className="flex items-start justify-between mb-3">
                                                                                    <h3 className="text-lg font-semibold text-card-foreground">{event.title}</h3>
                                                                                    <div className={`p-2 rounded-full ${getEventIconBg(event.event_type)}`}>
                                                                                      {getEventIcon(event.event_type)}
                                                                                      </div>
                                                                  </div>
                                                    {event.description && (
                                                                      <p className="text-sm text-muted-foreground mb-3 leading-relaxed">{event.description}</p>
                                                                  )}
                                                                  <div className="space-y-2 mb-4">
                                                                                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                                                                                        <Calendar className="w-4 h-4" />
                                                                                                        <span>{format(new Date(event.event_date), 'EEEE, MMMM d · h:mm a')}</span>
                                                                                      </div>
                                                                                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                                                                      {event.is_virtual ? <Wifi className="w-4 h-4" /> : <MapPin className="w-4 h-4" />}
                                                                                                        <span>{event.is_virtual ? 'Virtual Event' : (event.location || 'Location TBD')}</span>
                                                                                      </div>
                                                                                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                                                                                        <Users className="w-4 h-4" />
                                                                                                        <span>{event.attendee_count} attending{event.max_attendees ? ` · ${event.max_attendees} spots total` : ''}</span>
                                                                                      </div>
                                                                  </div>
                                                                  <button
                                                                                      onClick={() => rsvpMutation.mutate({ eventId: event.id, isRsvpd: !!event.user_has_rsvpd })}
                                                                                      disabled={rsvpMutation.isPending}
                                                                                      className={`w-full py-3 rounded-xl font-medium transition-all duration-300 hover:scale-105 ${
                                                                                                            event.user_has_rsvpd
                                                                                                              ? 'bg-primary/20 text-primary border border-primary/30'
                                                                                                              : 'bg-gradient-to-r from-primary/10 to-accent/10 text-foreground hover:from-primary/20 hover:to-accent/20'
                                                                                        }`}
                                                                                    >
                                                                    {event.user_has_rsvpd ? '✓ Going — Cancel RSVP' : 'Join Event'}
                                                                  </button>
                                                  </div>
                                                ))
                                )}
                    </div>
                )}
          
            {/* Create Event Modal */}
            {showCreateModal && (
                    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                              <div className="bg-card rounded-2xl shadow-2xl w-full max-w-md max-h-[90vh] overflow-y-auto">
                                          <div className="flex items-center justify-between p-6 border-b border-border">
                                                        <h3 className="text-lg font-semibold text-card-foreground">Create New Event</h3>
                                                        <button onClick={() => setShowCreateModal(false)} className="p-1 hover:bg-secondary rounded-full">
                                                                        <X className="w-5 h-5" />
                                                        </button>
                                          </div>
                                          <div className="p-6 space-y-4">
                                                        <div>
                                                                        <label className="block text-sm font-medium text-foreground mb-1">Event Title *</label>
                                                                        <input
                                                                                            type="text"
                                                                                            value={form.title}
                                                                                            onChange={e => setForm(f => ({ ...f, title: e.target.value }))}
                                                                                            placeholder="e.g. Morning Wellness Walk"
                                                                                            className="w-full px-3 py-2 rounded-lg border border-border bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
                                                                                          />
                                                        </div>
                                                        <div>
                                                                        <label className="block text-sm font-medium text-foreground mb-1">Description</label>
                                                                        <textarea
                                                                                            value={form.description}
                                                                                            onChange={e => setForm(f => ({ ...f, description: e.target.value }))}
                                                                                            placeholder="Tell people what to expect..."
                                                                                            rows={3}
                                                                                            className="w-full px-3 py-2 rounded-lg border border-border bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 resize-none"
                                                                                          />
                                                        </div>
                                                        <div className="grid grid-cols-2 gap-3">
                                                                        <div>
                                                                                          <label className="block text-sm font-medium text-foreground mb-1">Date *</label>
                                                                                          <input
                                                                                                                type="date"
                                                                                                                value={form.event_date}
                                                                                                                onChange={e => setForm(f => ({ ...f, event_date: e.target.value }))}
                                                                                                                min={new Date().toISOString().split('T')[0]}
                                                                                                                className="w-full px-3 py-2 rounded-lg border border-border bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
                                                                                                              />
                                                                        </div>
                                                                        <div>
                                                                                          <label className="block text-sm font-medium text-foreground mb-1">Time</label>
                                                                                          <input
                                                                                                                type="time"
                                                                                                                value={form.event_time}
                                                                                                                onChange={e => setForm(f => ({ ...f, event_time: e.target.value }))}
                                                                                                                className="w-full px-3 py-2 rounded-lg border border-border bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
                                                                                                              />
                                                                        </div>
                                                        </div>
                                                        <div>
                                                                        <label className="block text-sm font-medium text-foreground mb-1">Event Type</label>
                                                                        <select
                                                                                            value={form.event_type}
                                                                                            onChange={e => setForm(f => ({ ...f, event_type: e.target.value }))}
                                                                                            className="w-full px-3 py-2 rounded-lg border border-border bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
                                                                                          >
                                                                          {EVENT_TYPES.map(t => (
                                                                                                                <option key={t} value={t}>{t.charAt(0).toUpperCase() + t.slice(1)}</option>option>
                                                                                                              ))}
                                                                        </select>select>
                                                        </div>
                                                        <div className="flex items-center gap-3">
                                                                        <button
                                                                                            type="button"
                                                                                            onClick={() => setForm(f => ({ ...f, is_virtual: !f.is_virtual }))}
                                                                                            className={`relative w-10 h-6 rounded-full transition-colors ${form.is_virtual ? 'bg-primary' : 'bg-muted'}`}
                                                                                          >
                                                                                          <span className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-transform ${form.is_virtual ? 'translate-x-5' : 'translate-x-1'}`} />
                                                                        </button>
                                                                        <label className="text-sm text-foreground">Virtual Event</label>
                                                        </div>
                                            {!form.is_virtual && (
                                      <div>
                                                        <label className="block text-sm font-medium text-foreground mb-1">Location</label>
                                                        <input
                                                                              type="text"
                                                                              value={form.location}
                                                                              onChange={e => setForm(f => ({ ...f, location: e.target.value }))}
                                                                              placeholder="e.g. Central Park, New York"
                                                                              className="w-full px-3 py-2 rounded-lg border border-border bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
                                                                            />
                                      </div>
                                                        )}
                                                        <div>
                                                                        <label className="block text-sm font-medium text-foreground mb-1">Max Attendees (optional)</label>
                                                                        <input
                                                                                            type="number"
                                                                                            value={form.max_attendees}
                                                                                            onChange={e => setForm(f => ({ ...f, max_attendees: e.target.value }))}
                                                                                            placeholder="Leave blank for unlimited"
                                                                                            min="1"
                                                                                            className="w-full px-3 py-2 rounded-lg border border-border bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
                                                                                          />
                                                        </div>
                                                        <div className="flex gap-3 pt-2">
                                                                        <button
                                                                                            onClick={() => createEventMutation.mutate()}
                                                                                            disabled={!form.title || !form.event_date || createEventMutation.isPending}
                                                                                            className="flex-1 bg-gradient-button text-white py-2.5 rounded-xl font-medium disabled:opacity-50 hover:opacity-90 transition-all"
                                                                                          >
                                                                          {createEventMutation.isPending ? 'Creating...' : 'Create Event'}
                                                                        </button>
                                                                        <button
                                                                                            onClick={() => setShowCreateModal(false)}
                                                                                            className="px-4 py-2.5 rounded-xl border border-border text-foreground hover:bg-secondary transition-all"
                                                                                          >
                                                                                          Cancel
                                                                        </button>
                                                        </div>
                                          </div>
                              </div>
                    </div>
                )}
          </div>
        );
};

export default Events;</div>
