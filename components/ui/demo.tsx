import { AnimatedNavFramer } from '@/components/ui/navigation-menu';
export default function NavigationDemo() {
  return <><AnimatedNavFramer /><main className="container mx-auto px-4"><div className="h-screen pt-24"><h1 className="text-center text-4xl font-bold">Navigation with Framer Motion</h1><p className="mt-4 text-center text-muted-foreground">Scroll down to collapse the navigation. Click the circle to expand it.</p></div><div className="h-[200vh] rounded-lg bg-muted p-8"><h2 className="text-2xl font-bold">Page Content</h2><p className="mt-4">This animation is powered by Framer Motion.</p></div></main></>;
}
