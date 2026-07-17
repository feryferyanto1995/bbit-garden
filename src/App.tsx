import { Cover } from './components/Cover';
import { Nav } from './components/Nav';
import { Philosophy } from './components/Philosophy';
import { Projects } from './components/Projects';
import { Photography } from './components/Photography';
import { Garden } from './components/Garden';
import { Footer } from './components/Footer';
import { SproutDivider } from './components/SproutDivider';

export default function App() {
  return (
    <>
      <a className="skip-link" href="#about">
        skip to content
      </a>
      <Nav />
      <Cover />
      <main>
        <Philosophy />
        <SproutDivider />
        <Projects />
        <SproutDivider />
        <Photography />
        <SproutDivider />
        <Garden />
      </main>
      <Footer />
    </>
  );
}
