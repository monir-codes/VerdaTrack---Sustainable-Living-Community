import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Calendar, MapPin, ArrowRight, BellRing, Users } from 'lucide-react';
import toast from 'react-hot-toast';

const UpcomingEvents = () => {
  // আপনার দেওয়া JSON স্ট্রাকচার অনুযায়ী ডেটা
  const initialEvents = [
    {
      _id: "1",
      title: "Coastal Cleanup Drive",
      description: "Join neighborhood clean-up event to protect marine life from plastic pollution.",
      date: "2026-10-24T09:00:00Z",
      location: "Patenga Beach, CTG",
      organizer: "admin@verda.com",
      maxParticipants: 100,
      currentParticipants: 65,
      image: "https://picsum.photos/id/20/600/400"
    },
    {
      _id: "2",
      title: "Urban Tree Plantation",
      description: "Help us plant 500 native saplings to improve our city's green cover.",
      date: "2026-11-02T10:00:00Z",
      location: "Ramna Park, Dhaka",
      organizer: "green@society.org",
      maxParticipants: 50,
      currentParticipants: 35,
      image: "https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?q=80&w=600"
    },
    {
      _id: "3",
      title: "Solar Power Workshop",
      description: "A hands-on workshop learning how to switch to affordable solar energy.",
      date: "2026-11-15T14:00:00Z",
      location: "Community Center",
      organizer: "tech@solar.com",
      maxParticipants: 30,
      currentParticipants: 28,
      image: "https://picsum.photos/id/30/600/400"
    },
    {
      _id: "4",
      title: "Zero Waste Living Expo",
      description: "Explore daily hacks that help you transition to a zero-waste lifestyle.",
      date: "2026-12-05T11:00:00Z",
      location: "Exhibition Hall",
      organizer: "zero@waste.io",
      maxParticipants: 200,
      currentParticipants: 142,
      image: "https://images.unsplash.com/photo-1532996122724-e3c354a0b15b?q=80&w=600"
    }
  ];

  const [eventList, setEventList] = useState(initialEvents);

  const getSavedActivities = () => {
    const saved = localStorage.getItem('myActivities');
    return saved ? JSON.parse(saved) : [];
  };

  const [registeredEvents, setRegisteredEvents] = useState(() => {
    const saved = getSavedActivities();
    return saved.map(activity => activity.id.toString());
  });

  const handleRegister = (id) => {
    if (registeredEvents.includes(id.toString())) {
      toast.error("You are already registered for this event!");
      return;
    }

    let joinedEvent = null;

    setEventList(prevEvents => prevEvents.map(event => {
      if (event._id === id) {
        if (event.currentParticipants >= event.maxParticipants) {
          toast.error("This event is fully booked!");
          return event;
        }
        joinedEvent = event;
        return { ...event, currentParticipants: event.currentParticipants + 1 };
      }
      return event;
    }));

    if (joinedEvent) {
      setRegisteredEvents([...registeredEvents, id.toString()]);
      
      const savedActivities = getSavedActivities();
      const newActivity = {
        id: id,
        title: joinedEvent.title,
        date: formatDate(joinedEvent.date),
        location: joinedEvent.location,
        status: "Upcoming",
        impact: "Pending",
      };
      localStorage.setItem('myActivities', JSON.stringify([...savedActivities, newActivity]));
      
      toast.success("Successfully registered for the event!");
    }
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.15 }
    }
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 0.6, ease: "easeOut" }
    }
  };

  // ডেট ফরম্যাট করার ফাংশন
  const formatDate = (dateString) => {
    const options = { month: 'short', day: 'numeric', year: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  return (
    <section className="max-w-7xl mx-auto px-4 md:px-6 py-20 overflow-hidden">
      {/* Header */}
      <motion.div 
        initial={{ opacity: 0, x: -20 }}
        whileInView={{ opacity: 1, x: 0 }}
        viewport={{ once: false }}
        className="flex flex-col md:flex-row justify-between items-start md:items-end mb-12 gap-6"
      >
        <div className="space-y-4">
          <div className="flex items-center gap-2 text-green-500 font-black text-[10px] uppercase tracking-[0.3em]">
            <BellRing size={14} className="animate-bounce" />
            <span>Active Challenges</span>
          </div>
          <h2 className="text-4xl md:text-5xl font-black text-white tracking-tighter uppercase italic leading-none">
            Upcoming <span className="text-green-500">Events</span>
          </h2>
          <motion.div 
            initial={{ width: 0 }}
            whileInView={{ width: 80 }}
            viewport={{ once: false }}
            className="h-1 bg-green-500 rounded-full"
          />
        </div>
        <button className="flex items-center gap-2 text-gray-500 font-black text-[10px] uppercase tracking-widest hover:text-green-500 transition-colors group">
          All Events <ArrowRight size={14} className="group-hover:translate-x-2 transition-transform" />
        </button>
      </motion.div>

      {/* Grid */}
      <motion.div 
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: false, amount: 0.1 }}
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6"
      >
        {eventList.map((event) => (
          <motion.div 
            key={event._id} 
            variants={cardVariants}
            whileHover={{ y: -8 }}
            className="group bg-[#121619] rounded-[2rem] border border-white/5 overflow-hidden flex flex-col hover:border-green-500/20 transition-all duration-500 shadow-2xl"
          >
            {/* Image & Date Tag */}
            <div className="h-48 overflow-hidden relative">
              <img 
                src={event.image} 
                className="w-full h-full object-cover grayscale group-hover:grayscale-0 group-hover:scale-105 transition-all duration-700"
                alt={event.title}
              />
              <div className="absolute top-4 left-4 bg-black/70 backdrop-blur-md text-white text-[9px] font-black px-3 py-1.5 rounded-xl border border-white/10 flex items-center gap-2">
                <Calendar size={12} className="text-green-500" />
                {formatDate(event.date)}
              </div>
            </div>

            {/* Content */}
            <div className="p-6 flex-grow flex flex-col">
              <h3 className="text-lg font-black text-white mb-2 uppercase italic tracking-tight group-hover:text-green-400 transition-colors">
                {event.title}
              </h3>
              <p className="text-gray-500 text-xs font-medium leading-relaxed mb-6 line-clamp-2">
                {event.description}
              </p>

              <div className="mt-auto space-y-4">
                {/* Location & Participants */}
                <div className="flex flex-col gap-2">
                  <div className="flex items-center gap-2 text-gray-400">
                    <MapPin size={12} className="text-green-500" />
                    <span className="text-[10px] font-bold uppercase tracking-wider">{event.location}</span>
                  </div>
                  <div className="flex items-center gap-2 text-gray-400">
                    <Users size={12} className="text-green-500" />
                    <span className="text-[10px] font-bold uppercase tracking-wider">
                      {event.currentParticipants}/{event.maxParticipants} Joined
                    </span>
                  </div>
                </div>

                {/* Progress Bar for Participants */}
                <div className="w-full h-1 bg-white/5 rounded-full overflow-hidden">
                  <motion.div 
                    initial={{ width: 0 }}
                    whileInView={{ width: `${(event.currentParticipants/event.maxParticipants)*100}%` }}
                    viewport={{ once: false }}
                    className="h-full bg-green-500"
                  />
                </div>
                
                <button 
                  onClick={() => handleRegister(event._id)}
                  disabled={event.currentParticipants >= event.maxParticipants}
                  className={`w-full py-3 border rounded-xl text-[10px] font-black uppercase tracking-[0.2em] transition-all
                    ${registeredEvents.includes(event._id.toString()) 
                      ? "bg-green-500 text-black border-green-500 cursor-not-allowed" 
                      : event.currentParticipants >= event.maxParticipants
                      ? "bg-gray-800 text-gray-500 border-gray-800 cursor-not-allowed"
                      : "bg-white/5 border-white/5 group-hover:bg-green-500 group-hover:text-black hover:border-green-500"
                    }`}
                >
                  {registeredEvents.includes(event._id.toString()) 
                    ? "Registered"  
                    : event.currentParticipants >= event.maxParticipants 
                    ? "Fully Booked" 
                    : "Register Now"}
                </button>
              </div>
            </div>
          </motion.div>
        ))}
      </motion.div>
    </section>
  );
};

export default UpcomingEvents;