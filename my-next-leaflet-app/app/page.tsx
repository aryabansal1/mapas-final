// app/page.tsx
import dynamic from 'next/dynamic';

const Map = dynamic(() => import('./Map'), { ssr: false });

export default function Home() {
  return (
    <main>
      <h1>Click on a point to see all maps associated with it</h1>
      <Map />
    </main>
  );
}
