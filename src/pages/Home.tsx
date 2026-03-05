import React, { useState } from 'react';
import { MessageCircle, Calendar, Star, MapPin, Quote, ChevronLeft, ChevronRight, X } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { ThemeToggle } from '@/components/ThemeToggle';
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameDay, isToday, isBefore, startOfDay } from 'date-fns';

const Home = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [founderDismissed, setFounderDismissed] = useState(
    () => localStorage.getItem('founder-message-dismissed') === 'true'
  );
  const [calendarDate, setCalendarDate] = useState(new Date());

  const dismissFounder = () => {
    localStorage.setItem('founder-message-dismissed', 'true');
    setFounderDismissed(true);
  };

  const { data: events = [] } = useQuery({
    queryKey: ['home-events'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('events')
        .select('id, title, event_date, location, is_virtual, event_type')
        .gte('event_date', new Date().toISOString())
        .order('event_date', { ascending: true })
        .limit(3);
      if (error) throw error;
      return data || [];
    },
    enabled: !!user,
  });

  const { data: spotlightMembers = [] } = useQuery({
    queryKey: ['spotlight-members'],
    queryFn: async () => {
      const { data, error } = await supabase.rpc('get_discovery_profiles', {
        requesting_user_id: user?.id,
      });
      if (error) throw error;
      return (data || []).slice(0, 3);
    },
    enabled: !!user,
  });

  const monthStart = startOfMonth(calendarDate);
  const monthEnd = endOfMonth(calendarDate);
  const daysInMonth = eachDayOfInterval({ start: monthStart, end: monthEnd });
  const startDayOfWeek = monthStart.getDay();
  const prevMonth = () => setCalendarDate(d => new Date(d.getFullYear(), d.getMonth() - 1, 1));
  const nextMonth = () => setCalendarDate(d => new Date(d.getFullYear(), d.getMonth() + 1, 1));
  const getEventForDay = (day) => events.find(e => isSameDay(new Date(e.event_date), day));

  return (
    <div className="min-h-screen relative overflow-hidden animate-fade-in bg-background">
      <ThemeToggle />
      <div className="relative z-10 h-full overflow-y-auto p-6 space-y-6">

        {!founderDismissed && (
          <div className="backdrop-blur-md bg-white/10 border border-white/20 rounded-3xl p-6 shadow-2xl animate-slide-up relative">
            <button
              onClick={dismissFounder}
              className="absolute top-4 right-4 p-1 rounded-full hover:bg-white/20 transition-all"
              title="Dismiss"
            >
              <X className="w-4 h-4 text-foreground/60" />
            </button>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center">
                <Quote className="w-6 h-6 text-foreground" />
              </div>
              <h2 className="text-xl font-bold text-foreground">A Message from Our Founders</h2>
            </div>
            <div className="flex flex-col md:flex-row-reverse gap-6 items-start">
              <div className="flex-1">
                <p className="text-foreground/90 leading-relaxed mb-4">
                  Welcome to Her Story Collective! We created this space to celebrate the incredible women in our communities. Here, every story matters, every connection counts, and every woman has the power to inspire and be inspired. Together, we are building a network of support, growth, and empowerment.
                </p>
                <p className="text-foreground/80 text-sm italic">- Toya and Jay, Co-founders</p>
              </div>
              <div className="relative flex justify-center md:flex-row md:gap-4">
                <div className="relative md:flex md:gap-4">
                  <img
                    src="/lovable-uploads/ff7fd203-2307-43a9-8b21-91d5e7f49a8e.png"
                    alt="Co-founder working"
                    className="w-40 h-40 md:w-48 md:h-48 rounded-lg object-cover shadow-lg relative z-10 mx-auto md:mx-0"
                  />
                  <img
                    src="/lovable-uploads/192b37f2-d4dc-4d84-8128-fb689a114e4f.png"
                    alt="Co-founder portrait"
                    className="w-40 h-40 md:w-48 md:h-48 rounded-lg object-cover shadow-lg -mt-6 ml-16 md:mt-12 md:-ml-8 relative z-20"
                  />
                </div>
              </div>
            </div>
          </div>
        )}

        <div className="backdrop-blur-md bg-white/10 border border-white/20 rounded-3xl p-6 shadow-2xl animate-slide-up">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold text-foreground">Upcoming Events</h2>
            <Calendar className="w-6 h-6 text-foreground/70" />
          </div>
          <div className="flex flex-col lg:flex-row-reverse gap-6">
            <div className="lg:w-1/3">
              <img
                src="/lovable-uploads/98f40acd-8d57-45d3-acee-9bbc8b9c9e62.png"
                alt="Women in stylish outfits"
                className="w-full h-80 lg:h-96 rounded-lg object-cover"
              />
            </div>
            <div className="lg:w-2/3 space-y-6">
              <div className="space-y-3">
                {events.length > 0 ? (
                  events.map(event => (
                    <div key={event.id} className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20 hover:bg-white/20 transition-all duration-300">
                      <h3 className="font-semibold text-foreground mb-1">{event.title}</h3>
                      <p className="text-foreground/80 text-sm mb-2">
                        {format(new Date(event.event_date), 'MMM d h:mm a')}
                      </p>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2 text-foreground/70 text-sm">
                          <MapPin className="w-4 h-4" />
                          <span>{event.is_virtual ? 'Virtual' : (event.location || 'TBD')}</span>
                        </div>
                        <button
                          onClick={() => navigate('/events')}
                          className="bg-white/20 hover:bg-white/30 text-foreground text-xs px-3 py-1 rounded-full transition-all"
                        >
                          View
                        </button>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20 text-center">
                    <p className="text-foreground/80 text-sm mb-3">No upcoming events yet.</p>
                    <button
                      onClick={() => navigate('/events')}
                      className="bg-white/20 hover:bg-white/30 text-foreground text-xs px-4 py-2 rounded-full transition-all"
                    >
                      Create the first one!
                    </button>
                  </div>
                )}
              </div>

              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-lg font-semibold text-foreground">
                    {format(calendarDate, 'MMMM yyyy')}
                  </h3>
                  <div className="flex gap-1">
                    <button onClick={prevMonth} className="p-1 hover:bg-white/20 rounded-full transition-all">
                      <ChevronLeft className="w-4 h-4 text-foreground" />
                    </button>
                    <button onClick={nextMonth} className="p-1 hover:bg-white/20 rounded-full transition-all">
                      <ChevronRight className="w-4 h-4 text-foreground" />
                    </button>
                  </div>
                </div>
                <div className="grid grid-cols-7 gap-1 text-center text-sm">
                  {['Sun','Mon','Tue','Wed','Thu','Fri','Sat'].map(d => (
                    <div key={d} className="text-foreground/70 font-semibold p-2">{d}</div>
                  ))}
                  {Array.from({ length: startDayOfWeek }).map((_, i) => (
                    <div key={"empty-" + i} />
                  ))}
                  {daysInMonth.map(day => {
                    const event = getEventForDay(day);
                    const isPast = isBefore(day, startOfDay(new Date()));
                    return (
                      <div
                        key={day.toISOString()}
                        onClick={() => event && navigate('/events')}
                        className={"p-2 rounded cursor-pointer text-sm transition-all " + (
                          isToday(day)
                            ? 'bg-primary/40 text-foreground font-bold'
                            : event
                            ? 'bg-accent/30 text-foreground font-semibold hover:bg-accent/50'
                            : isPast
                            ? 'text-foreground/30'
                            : 'text-foreground hover:bg-white/20'
                        )}
                        title={event ? event.title : undefined}
                      >
                        {format(day, 'd')}
                      </div>
                    );
                  })}
                </div>
                {events.length > 0 && (
                  <div className="mt-3 space-y-1">
                    {events.map(e => (
                      <div key={e.id} className="flex items-center gap-2 text-xs text-foreground/70">
                        <div className="w-3 h-3 bg-accent/50 rounded" />
                        <span>{e.title} - {format(new Date(e.event_date), 'MMM d')}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
          <button
            onClick={() => navigate('/events')}
            className="w-full mt-4 bg-white/20 hover:bg-white/30 text-foreground font-semibold py-2 px-4 rounded-full transition-all duration-300"
          >
            View All Events
          </button>
        </div>

        <div className="backdrop-blur-md bg-white/10 border border-white/20 rounded-3xl p-6 shadow-2xl animate-slide-up">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold text-foreground">Spotlight Members</h2>
            <Star className="w-6 h-6 text-foreground/70" />
          </div>
          <div className="space-y-4">
            {spotlightMembers.length > 0 ? (
              spotlightMembers.map((member) => (
                <div key={member.user_id} className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20 hover:bg-white/20 transition-all duration-300">
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 bg-gradient-to-br from-primary/30 to-accent/30 rounded-full flex items-center justify-center text-lg font-bold text-foreground">
                      {member.first_name_initial || '?'}
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-foreground">{member.first_name_initial}</h3>
                      {member.city_only && (
                        <div className="flex items-center gap-1 text-foreground/70 text-xs">
                          <MapPin className="w-3 h-3" />
                          <span>{member.city_only}</span>
                        </div>
                      )}
                      {member.interests_sample && member.interests_sample.length > 0 && (
                        <div className="flex flex-wrap gap-1 mt-1">
                          {member.interests_sample.slice(0, 2).map((interest, idx) => (
                            <span key={idx} className="bg-white/20 text-foreground text-xs px-2 py-0.5 rounded-full">
                              {interest}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                    <button
                      onClick={() => navigate('/discover')}
                      className="bg-white/20 hover:bg-white/30 text-foreground text-xs px-3 py-1 rounded-full transition-all flex items-center gap-1"
                    >
                      <MessageCircle className="w-3 h-3" />
                      Connect
                    </button>
                  </div>
                </div>
              ))
            ) : (
              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20 text-center">
                <p className="text-foreground/80 text-sm mb-3">No members to spotlight yet.</p>
                <p className="text-foreground/60 text-xs">Complete your profile to appear here!</p>
              </div>
            )}
          </div>
          <button
            onClick={() => navigate('/discover')}
            className="w-full mt-4 bg-white/20 hover:bg-white/30 text-foreground font-semibold py-2 px-4 rounded-full transition-all duration-300"
          >
            Discover More Members
          </button>
        </div>

      </div>
    </div>
  );
};

export default Home;
