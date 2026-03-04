import React from 'react';
import { Calendar, MapPin, Users, Plus, Coffee, Dumbbell, BookOpen } from 'lucide-react';

const Events = () => {
  const events: unknown[] = [];

  return (
    <div className="flex-1 bg-gradient-events p-6 animate-fade-in">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h2 className="text-xl font-semibold text-foreground mb-2">Upcoming Events</h2>
          <p className="text-muted-foreground">Join local gatherings and meetups</p>
        </div>
        <button className="p-3 bg-primary/10 rounded-full hover:bg-primary/20 transition-all duration-300 hover:scale-105">
          <Plus className="w-5 h-5 text-primary" />
        </button>
      </div>

      <div className="space-y-4">
        {events.length > 0 ? (
          events.map(event => (
            <div key={event.id} className="bg-card rounded-2xl p-5 shadow-card border border-border hover:shadow-elegant transition-all duration-300 animate-slide-up">
              <div className="flex items-start justify-between mb-3">
                <h3 className="text-lg font-semibold text-card-foreground">{event.title}</h3>
                <div className={`p-2 rounded-full ${
                  event.type === 'networking' ? 'bg-primary/10' :
                  event.type === 'wellness' ? 'bg-accent/10' : 'bg-coral/10'
                }`}>
                  {event.type === 'networking' ? <Coffee className={`w-4 h-4 text-primary`} /> :
                   event.type === 'wellness' ? <Dumbbell className={`w-4 h-4 text-accent`} /> :
                   <BookOpen className={`w-4 h-4 text-coral`} />}
                </div>
              </div>
              
              <div className="space-y-2 mb-4">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Calendar className="w-4 h-4" />
                  <span>{event.date} at {event.time}</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <MapPin className="w-4 h-4" />
                  <span>{event.location}</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Users className="w-4 h-4" />
                  <span>{event.attendees} women attending</span>
                </div>
              </div>
              
              <button className="w-full bg-gradient-to-r from-primary/10 to-accent/10 text-foreground py-3 rounded-xl hover:from-primary/20 hover:to-accent/20 transition-all duration-300 font-medium hover:scale-105">
                Join Event
              </button>
            </div>
          ))
        ) : (
          <div className="bg-card rounded-2xl p-8 shadow-card border border-border text-center">
            <Calendar className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-card-foreground mb-2">No Events Yet</h3>
            <p className="text-muted-foreground">New events will appear here. Check back soon or create your own!</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Events;