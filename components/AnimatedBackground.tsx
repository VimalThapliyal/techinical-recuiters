"use client";

export function AnimatedBackground() {
  return (
    <div className="fixed inset-0 -z-10 overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-[#0a0a0a] via-[#001f3f] to-[#0a0a0a]" />
      <div className="absolute inset-0">
        {/* Animated gradient blobs */}
        <div className="absolute top-1/4 left-1/4 w-[600px] h-[600px] bg-[#0077b5] rounded-full mix-blend-screen filter blur-[120px] opacity-30 animate-blob" />
        <div className="absolute top-1/3 right-1/4 w-[500px] h-[500px] bg-[#00d4ff] rounded-full mix-blend-screen filter blur-[120px] opacity-25 animate-blob animation-delay-2000" />
        <div className="absolute bottom-1/4 left-1/3 w-[550px] h-[550px] bg-[#004182] rounded-full mix-blend-screen filter blur-[120px] opacity-20 animate-blob animation-delay-4000" />

        {/* Grid pattern overlay */}
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage: `
              linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px),
              linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)
            `,
            backgroundSize: "50px 50px",
          }}
        />

        {/* Shimmer effect */}
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent animate-shimmer" />
      </div>
    </div>
  );
}
