import React, { useState } from 'react';
import { MessageCircle, Calendar, Users, Star, MapPin, Quote } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { ThemeToggle } from '@/components/ThemeToggle';

const Home = () => {
  const navigate = useNavigate();
  
  const users: unknown[] = [];
  const events: unknown[] = [];

  return (
    <div className="min-h-screen relative overflow-hidden animate-fade-in bg-background">
      <ThemeToggle />
      
      
      {/* Scrollable content */}
      <div className="relative z-10 h-full overflow-y-auto p-6 space-y-6">
        {/* Founder's Message */}
        <div className="backdrop-blur-md bg-white/10 border border-white/20 rounded-3xl p-6 shadow-2xl animate-slide-up">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center">
              <Quote className="w-6 h-6 text-foreground" />
            </div>
            <h2 className="text-xl font-bold text-foreground">A Message from Our Founders</h2>
          </div>
          
          <div className="flex flex-col md:flex-row-reverse gap-6 items-start">
            <div className="flex-1">
              <p className="text-foreground/90 leading-relaxed mb-4">
                "Welcome to Her Story Collective! We created this space to celebrate the incredible women in our communities. 
                Here, every story matters, every connection counts, and every woman has the power to inspire and be inspired. 
                Together, we're building a network of support, growth, and empowerment."
              </p>
              <p className="text-foreground/80 text-sm italic">- Toya & Jay, Co-founders</p>
            </div>
            
            <div className="relative flex justify-center md:flex-row md:gap-4">
              {/* Mobile: Overlapping centered images */}
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

        {/* New Events */}
        <div className="backdrop-blur-md bg-white/10 border border-white/20 rounded-3xl p-6 shadow-2xl animate-slide-up">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold text-foreground">New Events</h2>
            <Calendar className="w-6 h-6 text-foreground/70" />
          </div>
          
          <div className="flex flex-col lg:flex-row-reverse gap-6">
            {/* Right side - Image */}
            <div className="lg:w-1/3">
              <img 
                src="/lovable-uploads/98f40acd-8d57-45d3-acee-9bbc8b9c9e62.png" 
                alt="Women in stylish outfits" 
                className="w-full h-80 lg:h-96 rounded-lg object-cover"
              />
            </div>
            
            {/* Left side - Events and Calendar */}
            <div className="lg:w-2/3 space-y-6">
              {/* Events List */}
              <div className="space-y-3">
                {events.length > 0 ? (
                  events.slice(0, 3).map((event) => (
                    <div key={event.id} className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20 hover:bg-white/20 transition-all duration-300">
                      <h3 className="font-semibold text-foreground mb-1">{event.title}</h3>
                      <p className="text-foreground/80 text-sm mb-2">{event.date} at {event.time}</p>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2 text-foreground/70 text-sm">
                          <MapPin className="w-4 h-4" />
                          <span>{event.location}</span>
                        </div>
                        <div className="flex items-center gap-3">
                          <span className="text-foreground/60 text-xs">{event.attendees} attending</span>
                          <button className="bg-white/20 hover:bg-white/30 text-foreground text-xs px-3 py-1 rounded-full transition-all">
                            Join
                          </button>
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20 text-center">
                    <p className="text-foreground/80 text-sm">No events yet. Check back soon!</p>
                  </div>
                )}
              </div>
              
              {/* Mini Calendar */}
              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20">
                <h3 className="text-lg font-semibold text-foreground mb-3">Upcoming Events Calendar</h3>
                <div className="grid grid-cols-7 gap-1 text-center text-sm">
                  <div className="text-foreground/70 font-semibold p-2">Sun</div>
                  <div className="text-foreground/70 font-semibold p-2">Mon</div>
                  <div className="text-foreground/70 font-semibold p-2">Tue</div>
                  <div className="text-foreground/70 font-semibold p-2">Wed</div>
                  <div className="text-foreground/70 font-semibold p-2">Thu</div>
                  <div className="text-foreground/70 font-semibold p-2">Fri</div>
                  <div className="text-foreground/70 font-semibold p-2">Sat</div>
                  
                  {/* Calendar days - showing March 2024 as example */}
                  <div className="text-foreground/50 p-2">25</div>
                  <div className="text-foreground/50 p-2">26</div>
                  <div className="text-foreground/50 p-2">27</div>
                  <div className="text-foreground/50 p-2">28</div>
                  <div className="text-foreground/50 p-2">29</div>
                  <div className="text-foreground p-2 hover:bg-white/20 rounded cursor-pointer">1</div>
                  <div className="text-foreground p-2 hover:bg-white/20 rounded cursor-pointer">2</div>
                  
                  <div className="text-foreground p-2 hover:bg-white/20 rounded cursor-pointer">3</div>
                  <div className="text-foreground p-2 hover:bg-white/20 rounded cursor-pointer">4</div>
                  <div className="text-foreground p-2 hover:bg-white/20 rounded cursor-pointer">5</div>
                  <div className="text-foreground p-2 hover:bg-white/20 rounded cursor-pointer">6</div>
                  <div className="text-foreground p-2 hover:bg-white/20 rounded cursor-pointer">7</div>
                  <div className="text-foreground p-2 hover:bg-white/20 rounded cursor-pointer">8</div>
                  <div className="text-foreground p-2 hover:bg-white/20 rounded cursor-pointer">9</div>
                  
                  <div className="text-foreground p-2 hover:bg-white/20 rounded cursor-pointer">10</div>
                  <div className="text-foreground p-2 hover:bg-white/20 rounded cursor-pointer">11</div>
                  <div className="text-foreground p-2 hover:bg-white/20 rounded cursor-pointer">12</div>
                  <div className="text-foreground p-2 hover:bg-white/20 rounded cursor-pointer">13</div>
                  <div className="text-foreground p-2 hover:bg-white/20 rounded cursor-pointer">14</div>
                  <div className="bg-primary/30 text-foreground p-2 rounded cursor-pointer font-semibold">15</div>
                  <div className="text-foreground p-2 hover:bg-white/20 rounded cursor-pointer">16</div>
                  
                  <div className="text-foreground p-2 hover:bg-white/20 rounded cursor-pointer">17</div>
                  <div className="text-foreground p-2 hover:bg-white/20 rounded cursor-pointer">18</div>
                  <div className="text-foreground p-2 hover:bg-white/20 rounded cursor-pointer">19</div>
                  <div className="text-foreground p-2 hover:bg-white/20 rounded cursor-pointer">20</div>
                  <div className="text-foreground p-2 hover:bg-white/20 rounded cursor-pointer">21</div>
                  <div className="bg-accent/30 text-foreground p-2 rounded cursor-pointer font-semibold">22</div>
                  <div className="text-foreground p-2 hover:bg-white/20 rounded cursor-pointer">23</div>
                  
                  <div className="text-foreground p-2 hover:bg-white/20 rounded cursor-pointer">24</div>
                  <div className="text-foreground p-2 hover:bg-white/20 rounded cursor-pointer">25</div>
                  <div className="text-foreground p-2 hover:bg-white/20 rounded cursor-pointer">26</div>
                  <div className="text-foreground p-2 hover:bg-white/20 rounded cursor-pointer">27</div>
                  <div className="bg-secondary/30 text-foreground p-2 rounded cursor-pointer font-semibold">28</div>
                  <div className="text-foreground p-2 hover:bg-white/20 rounded cursor-pointer">29</div>
                  <div className="text-foreground p-2 hover:bg-white/20 rounded cursor-pointer">30</div>
                  
                  <div className="text-foreground p-2 hover:bg-white/20 rounded cursor-pointer">31</div>
                </div>
                <div className="mt-3 text-xs text-foreground/70">
                  <div className="flex items-center gap-2 mb-1">
                    <div className="w-3 h-3 bg-primary/30 rounded"></div>
                    <span>Leadership Summit (Mar 15)</span>
                  </div>
                  <div className="flex items-center gap-2 mb-1">
                    <div className="w-3 h-3 bg-accent/30 rounded"></div>
                    <span>Networking Brunch (Mar 22)</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-secondary/30 rounded"></div>
                    <span>Workshop Series (Mar 28)</span>
                  </div>
                </div>
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

        {/* Spotlight Members */}
        <div className="backdrop-blur-md bg-white/10 border border-white/20 rounded-3xl p-6 shadow-2xl animate-slide-up">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold text-foreground">Spotlight Members</h2>
            <Star className="w-6 h-6 text-foreground/70" />
          </div>
          <div className="space-y-4">
            {users.length > 0 ? (
              users.slice(0, 3).map((user) => (
                <div key={user.id} className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20 hover:bg-white/20 transition-all duration-300">
                  <div className="flex items-center space-x-4">
                    <div className="text-3xl">{user.image}</div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-foreground">{user.name}</h3>
                      <p className="text-foreground/80 text-sm">{user.location}</p>
                      <div className="flex flex-wrap gap-1 mt-1">
                        {user.interests?.slice(0, 2).map((interest: string, idx: number) => (
                          <span key={idx} className="bg-white/20 text-foreground text-xs px-2 py-1 rounded-full">
                            {interest}
                          </span>
                        ))}
                      </div>
                    </div>
                    <button 
                      onClick={() => navigate('/messages')}
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
                <p className="text-foreground/80 text-sm">No members to highlight yet. Join the community!</p>
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