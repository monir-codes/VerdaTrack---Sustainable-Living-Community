import React, { useContext, useState, useEffect } from "react";
import { AuthContext } from "../../Auth/AuthContext/AuthContext";
import {
  CheckCircle2,
  Clock,
  MapPin,
  Trash2,
  ExternalLink,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import toast from 'react-hot-toast';

const MyActivities = () => {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  const [activities, setActivities] = useState([]);

  useEffect(() => {
    const saved = localStorage.getItem('myActivities');
    if (saved) {
      setActivities(JSON.parse(saved));
    }
  }, []);

  const handleDelete = (e, id) => {
    e.stopPropagation();
    const updatedActivities = activities.filter(activity => activity.id !== id);
    setActivities(updatedActivities);
    localStorage.setItem('myActivities', JSON.stringify(updatedActivities));
    toast.success("Activity removed successfully!");
  };
  const navigateActivitiesDetails = (id)=>{
    return navigate(`/my-activities/${id}`)
  }

  return (
    <div className="min-h-screen bg-[#121619] py-12 px-6">
      <div className="max-w-6xl mx-auto">
        {/* Header Section */}
        <div className="mb-10 flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div className="space-y-2">
            <h2 className="text-4xl font-black text-white uppercase italic tracking-tighter">
              My <span className="text-green-500">Activities</span>
            </h2>
            <p className="text-gray-500 font-bold uppercase text-xs tracking-widest">
              Tracking your environmental impact
            </p>
          </div>

          <div className="bg-[#1d2327] border border-white/5 p-4 rounded-2xl flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-green-500/10 flex items-center justify-center border border-green-500/20">
              <CheckCircle2 className="text-green-500" size={24} />
            </div>
            <div>
              <p className="text-[10px] text-gray-500 font-black uppercase">
                Total Impact
              </p>
              <p className="text-xl font-black text-white">120 Points</p>
            </div>
          </div>
        </div>

        {/* Desktop Table View */}
        <div className="bg-[#1d2327] rounded-[2rem] border border-white/5 overflow-hidden shadow-2xl">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-white/5 bg-white/[0.02]">
                  <th className="p-6 text-[10px] font-black uppercase tracking-widest text-gray-500">
                    Activity Details
                  </th>
                  <th className="p-6 text-[10px] font-black uppercase tracking-widest text-gray-500">
                    Location
                  </th>
                  <th className="p-6 text-[10px] font-black uppercase tracking-widest text-gray-500">
                    Status
                  </th>
                  <th className="p-6 text-[10px] font-black uppercase tracking-widest text-gray-500">
                    Impact
                  </th>
                  <th className="p-6 text-[10px] font-black uppercase tracking-widest text-gray-500 text-right">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {activities.map((item) => (
                  <tr
                    onClick={()=> navigateActivitiesDetails(item.id)}
                    key={item.id}
                    className="group hover:bg-white/[0.01] transition-colors cursor-pointer"
                  >
                    <td className="p-6">
                      <div className="flex items-center gap-4">
                        <div
                          className={`p-3 rounded-xl ${item.status === "Completed" ? "bg-green-500/10 text-green-500" : "bg-yellow-500/10 text-yellow-500"}`}
                        >
                          {item.status === "Completed" ? (
                            <CheckCircle2 size={20} />
                          ) : (
                            <Clock size={20} />
                          )}
                        </div>
                        <div>
                          <p className="text-white font-bold text-sm mb-1">
                            {item.title}
                          </p>
                          <p className="text-gray-500 text-[11px] font-medium">
                            {item.date}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="p-6">
                      <div className="flex items-center gap-2 text-gray-400 text-xs font-bold uppercase tracking-tighter">
                        <MapPin size={14} className="text-green-500" />
                        {item.location}
                      </div>
                    </td>
                    <td className="p-6">
                      <span
                        className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-tighter ${
                          item.status === "Completed"
                            ? "bg-green-500/10 text-green-500 border border-green-500/20"
                            : item.status === "Upcoming"
                              ? "bg-blue-500/10 text-blue-400 border border-blue-500/20"
                              : "bg-yellow-500/10 text-yellow-500 border border-yellow-500/20"
                        }`}
                      >
                        {item.status}
                      </span>
                    </td>
                    <td className="p-6">
                      <p
                        className={`text-xs font-black italic uppercase tracking-widest ${item.impact === "Pending" ? "text-gray-600" : "text-green-500"}`}
                      >
                        {item.impact}
                      </p>
                    </td>
                    <td className="p-6 text-right">
                      <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button className="p-2 hover:bg-white/5 rounded-lg text-gray-400 hover:text-white transition-all">
                          <ExternalLink size={18} />
                        </button>
                        <button 
                          onClick={(e) => handleDelete(e, item.id)}
                          className="p-2 hover:bg-red-500/10 rounded-lg text-gray-400 hover:text-red-500 transition-all"
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Empty State (Optional) */}
        {activities.length === 0 && (
          <div className="text-center py-20 bg-[#1d2327] rounded-[2rem] border border-dashed border-white/10 mt-6">
            <p className="text-gray-500 font-bold uppercase tracking-widest text-sm">
              No activities tracked yet.
            </p>
            <button className="mt-4 text-green-500 font-black uppercase text-xs hover:underline">
              Start a new challenge
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default MyActivities;
