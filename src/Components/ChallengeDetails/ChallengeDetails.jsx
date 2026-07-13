import React, { useEffect, useState, useContext } from "react";
import { useParams, Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Calendar, Users, Trophy, Target, 
  ArrowLeft, Share2, Info, Clock, ShieldCheck, Loader2 
} from "lucide-react";
import Loader from "../Loader/Loader";
import { AuthContext } from "../../Auth/AuthContext/AuthContext"; // AuthContext ইমপোর্ট করুন
import toast, { Toaster } from "react-hot-toast";

const ChallengeDetails = () => {
  const { id } = useParams(); 
  const { user } = useContext(AuthContext); // ইউজার ডাটা নিন
  const [challenge, setChallenge] = useState(null);
  const [loading, setLoading] = useState(true);
  const [joining, setJoining] = useState(false); // জয়েন করার লোডিং স্টেট

  // ডাটা ফেচিং (একবারে নির্দিষ্ট আইডি দিয়ে ফেচ করা ভালো)
  useEffect(() => {
    const fetchChallenge = async () => {
      try {
        setLoading(true);
        // সরাসরি নির্দিষ্ট চ্যালেঞ্জ ফেচ করুন যদি আপনার ব্যাকএন্ডে GET /api/challenges/:id থাকে
        const res = await fetch("https://ecotrack-server-snowy.vercel.app/api/challenges");
        const data = await res.json();
        const found = data.find((item) => item._id === id);
        
        setChallenge(found);
        setLoading(false);
      } catch (error) {
        console.error("Fetch Error:", error);
        setLoading(false);
      }
    };
    fetchChallenge();
  }, [id]);

  // জয়েন করার হ্যান্ডলার
const handleJoin = async () => {
  if (!user) {
    return toast.error("Please login to join!");
  }

  setJoining(true);
  try {
    const response = await fetch(`https://ecotrack-server-snowy.vercel.app/api/challenges/join/${id}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ 
        userId: user?.email, // ব্যাকএন্ড এই নামগুলো এক্সপেক্ট করছে
        userEmail: user?.email 
      })
    });

    const data = await response.json();

    if (response.ok) {
      toast.success("Challenge Accepted!");
      setChallenge(prev => ({
        ...prev,
        participants: (prev.participants || 0) + 1,
        participantEmails: [...(prev.participantEmails || []), user.email]
      }));

      // Remove from deletedActivities if present
      let deleted = JSON.parse(localStorage.getItem('deletedActivities') || '[]');
      if (deleted.includes(id)) {
        deleted = deleted.filter(dId => dId !== id);
        localStorage.setItem('deletedActivities', JSON.stringify(deleted));
      }

      // Add to myActivities
      const savedActivities = JSON.parse(localStorage.getItem('myActivities') || '[]');
      if (!savedActivities.find(a => a.id === id)) {
        savedActivities.push({
          id: id,
          title: challenge.title || "New Challenge",
          date: challenge.startDate || new Date().toISOString().split('T')[0],
          location: "VerdaTrack Platform",
          status: "Ongoing",
          impact: challenge.impactMetric || "Pending",
        });
        localStorage.setItem('myActivities', JSON.stringify(savedActivities));
      }
    } else {
      toast.error(data.message || "Join failed");
    }
  } catch (error) {
    toast.error("Server connection failed");
  } finally {
    setJoining(false);
  }
};

  if (loading) return <Loader />;
  if (!challenge) return <NotFound />;

  const fadeInUp = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.6, ease: "easeOut" }
  };

  const isDeletedLocally = JSON.parse(localStorage.getItem('deletedActivities') || '[]').includes(id);
  const hasJoined = challenge.participantEmails?.includes(user?.email) && !isDeletedLocally;

  return (
    <div className="min-h-screen bg-[#121619] text-white pb-20 overflow-hidden">
      <Toaster position="top-center" />
      
      {/* Hero Section */}
      <div className="relative h-[350px] md:h-[450px] w-full overflow-hidden">
        <motion.img 
          initial={{ scale: 1.2, opacity: 0 }}
          animate={{ scale: 1, opacity: 0.4 }}
          transition={{ duration: 1.5 }}
          src={challenge.imageUrl} 
          alt={challenge.title} 
          className="w-full h-full object-cover shadow-inner"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#121619] via-[#121619]/60 to-transparent"></div>
        
        <motion.div initial={{ x: -50, opacity: 0 }} animate={{ x: 0, opacity: 1 }} className="absolute top-8 left-6 md:left-12">
          <Link to="/challenges" className="flex items-center gap-2 text-white/70 hover:text-green-500 transition-all font-bold uppercase text-[10px] tracking-widest bg-black/40 backdrop-blur-md px-6 py-2.5 rounded-full border border-white/10 group">
            <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" /> Back to Challenges
          </Link>
        </motion.div>
      </div>

      <div className="max-w-7xl mx-auto px-4 md:px-6 -mt-24 md:-mt-32 relative z-10">
        <motion.div initial="initial" animate="animate" className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          <div className="lg:col-span-2 space-y-6 md:space-y-8">
            <motion.div variants={fadeInUp} className="bg-[#1d2327] border border-white/5 p-6 md:p-12 rounded-[2.5rem] md:rounded-[3.5rem] shadow-2xl relative overflow-hidden group">
              <div className="flex flex-wrap items-center gap-3 mb-6">
                <span className="bg-green-500 text-black px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest">
                  {challenge.category}
                </span>
                <span className="bg-white/5 border border-white/10 text-gray-400 px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest flex items-center gap-2">
                  <Clock size={12}/> {challenge.duration} Days
                </span>
              </div>

              <h1 className="text-4xl md:text-7xl font-black uppercase italic tracking-tighter mb-6 leading-[0.9]">
                {challenge.title}
              </h1>

              <p className="text-gray-400 text-base md:text-lg leading-relaxed mb-10 max-w-2xl">
                {challenge.description}
              </p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
                <StatCard icon={<Target size={24}/>} title="Primary Goal" desc={challenge.target} />
                <StatCard icon={<Trophy size={24}/>} title="Impact Metric" desc={challenge.impactMetric} />
              </div>
            </motion.div>

            {/* Participation Guidelines */}
            <motion.div variants={fadeInUp} className="bg-[#1d2327] border border-white/5 p-8 md:p-10 rounded-[2.5rem] md:rounded-[3rem]">
              <h3 className="text-xl font-black uppercase italic mb-8 flex items-center gap-3 text-green-500">
                <Info size={24} /> Participation Guidelines
              </h3>
              <div className="grid sm:grid-cols-2 gap-6">
                {["Sign in to VerdaTrack", "Commit to Rules", "Weekly Submission", "Earn Verda-Badge"].map((step, index) => (
                  <div key={index} className="flex items-start gap-4 text-gray-400 p-2">
                    <div className="flex-shrink-0 w-8 h-8 rounded-lg bg-white/5 text-green-500 flex items-center justify-center text-xs font-black border border-white/10">0{index + 1}</div>
                    <p className="text-xs md:text-sm font-medium">{step}</p>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>

          {/* Right Sidebar */}
          <div className="space-y-6">
            <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.4 }} className="bg-gradient-to-b from-green-500 to-emerald-600 p-[1px] rounded-[3rem] shadow-xl shadow-green-500/10">
              <div className="bg-[#1d2327] p-8 md:p-10 rounded-[2.9rem] text-center">
                <div className="flex justify-center -space-x-3 mb-6">
                   {[1,2,3,4].map(i => (
                     <img key={i} className="w-10 h-10 md:w-12 md:h-12 rounded-full border-4 border-[#1d2327] object-cover" src={`https://i.pravatar.cc/100?img=${i+10}`} alt="" />
                   ))}
                   <div className="w-10 h-10 md:w-12 md:h-12 rounded-full border-4 border-[#1d2327] bg-green-500 flex items-center justify-center text-[10px] font-black text-black">+{challenge.participants}</div>
                </div>
                <p className="text-[10px] font-black text-gray-500 uppercase tracking-[0.2em] mb-8">Verda-Warriors Joined</p>
                
                <motion.button 
                  onClick={handleJoin}
                  disabled={joining || hasJoined}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.95 }}
                  className="w-full bg-green-500 hover:bg-green-400 disabled:bg-gray-700 disabled:text-gray-400 text-black py-5 rounded-2xl font-black uppercase tracking-widest text-xs shadow-lg transition-all mb-6 flex items-center justify-center"
                >
                  {joining ? <Loader2 className="animate-spin" /> : 
                   hasJoined ? "Already Accepted" : "Accept Challenge"}
                </motion.button>
                
                <button className="flex items-center justify-center gap-2 text-gray-500 hover:text-white transition-colors text-[10px] font-black uppercase tracking-widest mx-auto group">
                  <Share2 size={14} /> Share with Community
                </button>
              </div>
            </motion.div>

            <motion.div variants={fadeInUp} className="bg-[#1d2327] border border-white/5 p-8 rounded-[3rem] space-y-6">
              <MetaRow icon={<Calendar size={20}/>} label="Timeline" value={`${challenge.startDate} — ${challenge.endDate}`} />
              <MetaRow icon={<ShieldCheck size={20}/>} label="Verified Program" value="VerdaTrack Official" italic />
            </motion.div>
          </div>

        </motion.div>
      </div>
    </div>
  );
};

// Helpers
const StatCard = ({ icon, title, desc }) => (
  <div className="flex items-start gap-4 p-5 bg-black/20 rounded-3xl border border-white/5">
    <div className="bg-green-500/10 p-3 rounded-xl text-green-500">{icon}</div>
    <div>
      <h4 className="font-bold text-sm text-white uppercase tracking-wider">{title}</h4>
      <p className="text-xs text-gray-500 mt-1">{desc}</p>
    </div>
  </div>
);

const MetaRow = ({ icon, label, value, italic }) => (
  <div className="flex items-center gap-4 border-b border-white/5 last:border-0 pb-6 last:pb-0">
    <div className="p-3 bg-white/5 rounded-2xl text-green-500">{icon}</div>
    <div>
      <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest">{label}</p>
      <p className={`text-xs font-black text-white ${italic ? 'italic' : ''}`}>{value}</p>
    </div>
  </div>
);

const NotFound = () => (
  <div className="min-h-screen bg-[#121619] text-white flex flex-col items-center justify-center space-y-4">
    <h2 className="text-3xl font-black uppercase italic tracking-tighter">Challenge Not Found</h2>
    <Link to="/challenges" className="bg-green-500 text-black px-6 py-2 rounded-xl font-bold uppercase text-xs">Back to All Challenges</Link>
  </div>
);

export default ChallengeDetails;