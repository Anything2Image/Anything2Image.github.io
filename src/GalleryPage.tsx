import FloatingParticles from "./components/ui/FloatingParticles";
import Logo from "./components/ui/Logo";
import Headers from "./components/ui/Header";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Spinner from "./components/ui/Spinner";
import { useState, useEffect } from "react";
import { getAllGalleryAPI } from "./services/api";
import { useAuth } from "./components/auth/AuthContext";
import { useNavigate } from "react-router-dom";
import Footer from "./components/ui/Footer";


type Entry = {
  animal: string;
  art_name: string;
  created_at: string;
  description: string;
  final_image_url: string;
  masked_image_url: string;
  original_image_url: string;
  prompt: string;
};

type GalleryCardProps = {
  entry: Entry;
  onClick: (entry: Entry) => void;
};

export function GalleryCard({ entry, onClick }: GalleryCardProps) {
  return (
    <div
      onClick={() => onClick(entry)}
      className="cursor-pointer bg-white/10 border border-white/20 backdrop-blur-lg rounded-2xl p-4 shadow-xl text-white hover:scale-[1.02] transition-transform"
    >
      <img
        src={entry.final_image_url}
        alt={entry.description}
        className="rounded-xl w-full h-48 object-cover mb-4"
      />
      <h2 className="font-semibold text-lg mb-2">{entry.art_name}</h2>
      <p className="text-sm text-gray-300 mb-1">{entry.description}</p>
      <p className="text-xs text-gray-500">{new Date(entry.created_at).toDateString()}</p>
    </div>
  );
}

type GalleryModalProps = {
  entry: Entry;
  onClose: () => void;
};

export function GalleryModal({ entry, onClose }: GalleryModalProps) {
  const [curImage, setCurImage] = useState<string>(entry.final_image_url);
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm">
      <div className="relative bg-white/5 border border-white/20 backdrop-blur-xl p-6 rounded-2xl w-full max-w-2xl shadow-2xl text-white">
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-2xl text-gray-300 hover:text-white focus:outline-none"
        >
          &times;
        </button>

        <h2 className="text-2xl font-bold mb-2">{entry.art_name}</h2>
        <p className="text-sm text-gray-400 mb-4">{new Date(entry.created_at).toDateString()}</p>

        <img
          src={curImage}
          alt={entry.description}
          className="rounded-xl w-full object-cover mb-4"
          onClick={() => setCurImage(curImage === entry.final_image_url ? entry.original_image_url : (curImage === entry.original_image_url ? entry.masked_image_url : entry.final_image_url))}
        />

        <div className="text-sm text-gray-300 space-y-2">
          <p><span className="font-semibold text-white">Animal:</span> {entry.animal}</p>
          <p><span className="font-semibold text-white">Description:</span> {entry.description}</p>
          <p><span className="font-semibold text-white">Prompt:</span> {entry.prompt}</p>
        </div>

        {/* <div className="grid grid-cols-2 gap-4 mt-6">
          <div>
            <p className="text-xs text-gray-400 mb-1">Original Image</p>
            <img src={entry.original_image_url} alt="Original" className="rounded-lg" />
          </div>
          <div>
            <p className="text-xs text-gray-400 mb-1">Masked Image</p>
            <img src={entry.masked_image_url} alt="Masked" className="rounded-lg" />
          </div>
        </div> */}
      </div>
    </div>
  );
}

export default function GalleryPage() {
  const [loading, setLoading] = useState(true);
  const { uid } = useAuth();
  const navigate = useNavigate();
  const [selectedEntry, setSelectedEntry] = useState<Entry | null>(null);
  const [galleryData, setGalleryData] = useState<Entry[]>([]);
  useEffect(() => {
    if (!uid) {
      navigate("/");
    }
  }, [uid, navigate]);

  useEffect(() => {
    const fetchGallery = async () => {
      if (!uid) {
        console.error("User is not authenticated.");
        setLoading(false);
        return;
      }
      try {
        const response_data = await getAllGalleryAPI(uid);
        console.log("Gallery data response:", response_data.gallery);
        setGalleryData(response_data.gallery ?? []);
        // console.log("Gallery data fetched:", data[0]);
      } catch (error) {
        console.error("Failed to fetch gallery:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchGallery();
  }, []);

  return (
    <>
      <FloatingParticles />
      <Headers />
      {loading ? (
        <Spinner />
      ) : (
        <>
          <div className="relative min-h-screen flex flex-col items-center justify-center p-4 sm:p-6 lg:p-8 z-10">
            <div className="w-full max-w-5xl mx-auto">
              <header className="mb-10">
                <Logo currentStep={1} />
                <h1 className="text-center text-3xl font-bold text-white mt-4">Your AI Animal Art Gallery</h1>
                <p className="text-center text-gray-400 mt-2">Browse your generated images with their descriptions</p>
              </header>

              <main className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
                {galleryData.map((entry, idx) => (
                  <GalleryCard
                    key={idx}
                    entry={entry}
                    onClick={(entry) => setSelectedEntry(entry)}
                  />
                ))}
              </main>
            </div>
          </div>
          <Footer />
        </>
      )
      }

      {selectedEntry && (
        <GalleryModal entry={selectedEntry} onClose={() => setSelectedEntry(null)} />
      )}
      <ToastContainer
        position="bottom-right"
        autoClose={5000}
        theme="dark"
        hideProgressBar={false}
        pauseOnHover
      />
    </>
  );
}
