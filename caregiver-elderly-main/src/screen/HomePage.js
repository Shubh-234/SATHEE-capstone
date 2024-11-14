
import Header from './Header';
import HomeSection from './HomeSection';
import FeatureSection from './FeatureSection';
import HowSection from './HowSection';
import TestimonialSection from './TestimonialSection';
import WhySection from './WhySection';
import FAQSection from './FAQSection';
import Footer from './Footer';
import { Box } from '@chakra-ui/react';

export default function HomePage() {
    return (
        <Box bg="gray.900" color="whitesmoke" minH="100vh" w={'100%'}>
            {/* Header */}
            <Header />

            {/* Hero Section */}
            <HomeSection />

            {/* Features Section */}
            <FeatureSection />

            {/* How It Works Section */}
            <HowSection />

            {/* Testimonials Section */}
            <TestimonialSection />

            {/* Why Sathee Section */}
            <WhySection />

            {/* FAQ Section */}
            <FAQSection />

            {/* Footer */}
            <Footer />
        </Box>
    );
}







