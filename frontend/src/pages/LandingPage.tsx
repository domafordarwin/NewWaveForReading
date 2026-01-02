import { Box } from '@mui/material';
import HeroSection from '../components/landing/HeroSection';
import Features from '../components/landing/Features';
import FinalCTA from '../components/landing/FinalCTA';

export default function LandingPage() {
  return (
    <Box>
      <HeroSection />
      <Features />
      <FinalCTA />
    </Box>
  );
}
