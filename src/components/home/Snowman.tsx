export default function Snowman() {
  return (
    <div 
      className="fixed z-50 pointer-events-none will-change-transform"
      style={{ 
        bottom: 'max(1rem, env(safe-area-inset-bottom, 1rem))',
        left: '1rem',
      }}
    >
      <div className="animate-snowman-sequence">
        <div className="text-5xl md:text-6xl">
          ⛄
        </div>
      </div>
    </div>
  );
}
