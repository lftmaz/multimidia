import AudioPlayer from './components/AudioPlayer'; 

export default function HomePage() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-slate-950 p-4">
      <AudioPlayer />
    </main>
  );
}