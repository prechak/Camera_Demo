// pages/index.tsx
import Camera from "../../components/Camera";

const Home = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-4">
      <h1 className="text-4xl font-bold text-blue-600 mb-6">
        Next.js + Tailwind CSS - Camera Demo
      </h1>
      <Camera />
    </div>
  );
};

export default Home;
