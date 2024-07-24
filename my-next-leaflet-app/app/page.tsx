// app/page.tsx
import dynamic from 'next/dynamic';

const Map = dynamic(() => import('./Map'), { ssr: false });

export default function Home() {
  return (
    <main>
      <Map />
    </main>
  );
}
