import {useNavigate} from 'react-router-dom';

export default function Home() {
    const navigate = useNavigate();

    return (
        <div className="min-h-screen flex flex-col items-center justify-center gap-6 bg-gray-100">
        <h1 className="text-4xl font-bold">Boulderify</h1>

        <button onClick={() => navigate('/upload')} className="px-6 py-3 bg-blue-600 text-white rounded-xl shadow-xl hover:bg-blue-700">
          New boulder from pic
        </button>

        <button onClick={() => navigate('/myboulders')} className="px-6 py-3 bg-blue-600 text-white rounded-xl shadow-xl hover:bg-blue-700">
          My boulders
        </button>

        <button className="px-6 py-3 bg-gray-300 rounded-xl shadow hover:bg-gray-400 mt-2">
          Boulder community
        </button>
        
        <button className="px-6 py-3 bg-green-500 text-white rounded-xl shadow hover:bg-green-600 mt-2">
          Games and challenges
        </button>
        
        <button className="px-6 py-3 bg-orange-500 text-white rounded-xl shadow hover:bg-orange-600 mt-2">
          Train it!
        </button>

      </div>
    );
}