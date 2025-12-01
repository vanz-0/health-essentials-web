export default function FestiveDivider() {
  return (
    <div className="container my-12" aria-hidden="true">
      <div className="flex items-center justify-center gap-4 opacity-30">
        <div className="h-px flex-1 bg-gradient-to-r from-transparent via-christmas-gold to-transparent" />
        <div className="flex items-center gap-3 text-christmas-red">
          <span className="text-2xl">🎄</span>
          <span className="text-xl">❄️</span>
          <span className="text-2xl">🎁</span>
          <span className="text-xl">❄️</span>
          <span className="text-2xl">⭐</span>
        </div>
        <div className="h-px flex-1 bg-gradient-to-r from-transparent via-christmas-gold to-transparent" />
      </div>
    </div>
  );
}
