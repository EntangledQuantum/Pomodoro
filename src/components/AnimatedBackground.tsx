export const AnimatedBackground = () => {
  return (
    <div className="fixed inset-0 w-full h-full overflow-hidden bg-gray-900 -z-10 pointer-events-none flex items-center justify-center">
      {/* Orbs */}
      <div className="absolute top-[-10%] left-[-10%] w-[40rem] h-[40rem] bg-purple-600 rounded-full mix-blend-screen filter blur-[128px] opacity-60 animate-blob"></div>
      <div className="absolute top-[20%] right-[-10%] w-[40rem] h-[40rem] bg-cyan-500 rounded-full mix-blend-screen filter blur-[128px] opacity-60 animate-blob" style={{ animationDelay: '2s' }}></div>
      <div className="absolute bottom-[-20%] left-[20%] w-[40rem] h-[40rem] bg-indigo-600 rounded-full mix-blend-screen filter blur-[128px] opacity-60 animate-blob" style={{ animationDelay: '4s' }}></div>
      
      {/* Noise texture for organic feel */}
      <div className="absolute inset-0 opacity-[0.03] pointer-events-none" style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")` }}></div>
    </div>
  );
};
