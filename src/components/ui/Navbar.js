// This file is deprecated. Use Header and BottomTabBar components instead.
// Kept for backward compatibility.
export { default as Header } from './Header';
export { default as BottomTabBar } from './BottomTabBar';

// Default export combines both for legacy usage
import Header from './Header';
import BottomTabBar from './BottomTabBar';

export default function Navbar() {
  return (
    <>
      <Header />
      <BottomTabBar />
    </>
  );
}
