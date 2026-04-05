import { useEffect, useState, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { FiSend, FiUser, FiArrowLeft, FiClock } from 'react-icons/fi';
import toast from 'react-hot-toast';

const ComplaintDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const messagesEndRef = useRef(null);
  
  const [complaint, setComplaint] = useState(null);
  const [text, setText] = useState('');
  const [loading, setLoading] = useState(true);
  const [currentUser, setCurrentUser] = useState(null);

  // Scroll to bottom of chat
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    const fetchComplaint = async () => {
      try {
        const user = JSON.parse(localStorage.getItem('user'));
        setCurrentUser(user);
        const config = { headers: { Authorization: `Bearer ${user.token}` } };
        
        const { data } = await axios.get(`/api/complaints/${id}`, config);
        setComplaint(data);
        setLoading(false);
      } catch (error) {
        toast.error('Failed to load complaint');
        setLoading(false);
      }
    };
    fetchComplaint();
  }, [id]);

  // Auto-scroll when messages change
  useEffect(() => {
    scrollToBottom();
  }, [complaint?.comments]);

  const handleSend = async (e) => {
    e.preventDefault();
    if (!text.trim()) return;

    try {
      const config = { headers: { Authorization: `Bearer ${currentUser.token}` } };
      await axios.post(`/api/complaints/${id}/comment`, { text }, config);
      
      // Update UI immediately (Optimistic update or re-fetch)
      // Ideally re-fetch to get server timestamp
      const { data } = await axios.get(`/api/complaints/${id}`, config);
      setComplaint(data);
      setText('');
    } catch (error) {
      toast.error('Failed to send message');
    }
  };

  if (loading || !complaint) return <div className="p-10 text-center">Loading Conversation...</div>;

  return (
    <div className="max-w-4xl mx-auto h-[calc(100vh-100px)] flex flex-col">
      
      {/* HEADER - TICKET INFO */}
      <div className="bg-white p-6 rounded-t-2xl border-b shadow-sm flex-none">
        <button onClick={() => navigate(-1)} className="text-gray-500 hover:text-primary mb-4 flex items-center gap-2">
          <FiArrowLeft /> Back
        </button>
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">{complaint.title}</h1>
            <p className="text-gray-500 mt-1">{complaint.description}</p>
          </div>
          <span className={`px-4 py-1 rounded-full text-sm font-bold border ${
             complaint.status === 'Resolved' ? 'bg-green-100 text-green-700 border-green-200' : 
             'bg-yellow-100 text-yellow-700 border-yellow-200'
          }`}>
            {complaint.status}
          </span>
        </div>
      </div>

      {/* CHAT AREA (Scrollable) */}
      <div className="flex-1 overflow-y-auto p-6 bg-gray-50 space-y-6">
        
        {/* System Start Message */}
        <div className="flex justify-center">
           <span className="text-xs text-gray-400 bg-gray-200 px-3 py-1 rounded-full">
             Ticket Created on {new Date(complaint.createdAt).toLocaleDateString()}
           </span>
        </div>

        {complaint.comments.map((msg, index) => {
          const isMe = msg.user === currentUser._id;
          const isAdmin = msg.role === 'admin';

          return (
            <div key={index} className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}>
              <div className={`flex flex-col max-w-[70%] ${isMe ? 'items-end' : 'items-start'}`}>
                
                {/* Name Label */}
                <div className="flex items-center gap-2 mb-1 px-1">
                   <span className="text-xs font-semibold text-gray-500">{msg.name}</span>
                   {isAdmin && <span className="badge badge-xs badge-secondary">Admin</span>}
                </div>

                {/* Message Bubble */}
                <div className={`p-4 rounded-2xl shadow-sm text-sm leading-relaxed relative ${
                  isMe 
                    ? 'bg-primary text-white rounded-tr-none' 
                    : isAdmin 
                        ? 'bg-purple-100 text-purple-900 border border-purple-200 rounded-tl-none'
                        : 'bg-white text-gray-800 border border-gray-200 rounded-tl-none'
                }`}>
                  {msg.text}
                </div>
                
                {/* Time */}
                <span className="text-[10px] text-gray-400 mt-1 flex items-center gap-1">
                   <FiClock size={10} /> {new Date(msg.date).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                </span>
              </div>
            </div>
          );
        })}
        <div ref={messagesEndRef} />
      </div>

      {/* INPUT AREA */}
      <div className="bg-white p-4 border-t rounded-b-2xl flex-none">
        <form onSubmit={handleSend} className="flex gap-4">
          <input 
            type="text" 
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Type your reply here..." 
            className="input input-bordered w-full focus:input-primary bg-gray-50"
          />
          <button type="submit" className="btn btn-primary px-6">
            <FiSend />
          </button>
        </form>
      </div>
    </div>
  );
};

export default ComplaintDetails;