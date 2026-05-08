export default function Loading() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-zinc-50">
      <div className="flex flex-col items-center gap-4">
        <div className="w-10 h-10 border-4 border-[#0066CC] border-t-transparent rounded-full animate-spin" />
        <p className="text-zinc-500">Yükleniyor...</p>
      </div>
    </div>
  );
}
