import { useState, useEffect } from "react";
import BuildTribeForm from "../../../components/buildTribe/BuildTribeForm";
import ArtistCommunityDetails from "../../../components/buildTribe/ArtistCommunityDetails";
import CommunityLoading from "../../../components/CommunityLoading";
import { useAppSelector } from "@/redux/hooks";
import api from "@/config/apiConfig";
import WelcomeScreen from "@/components/buildTribe/WelcomeScreen";
import { Text, View } from "react-native";

// Removed unused import: useQuery

interface Community {
  _id: string;
  name: string;
  description: string;
  createdBy: string;
  createdAt: string;
  __v: number;
}

// Removed unused interface: CommunityResponse

const OnboardingFlow = () => {
  const [currentStep, setCurrentStep] = useState<'welcome' | 'buildTribe'>('welcome');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [artistCommunity, setArtistCommunity] = useState<Community | null>(null);
  const { userdata } = useAppSelector((state) => state.auth);

  useEffect(() => {
    const fetchArtistCommunity = async () => {
      if (!userdata?.artist) {
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError(null);

        const response = await api.get(`/api/community/${userdata.artist}`);
        setArtistCommunity(response?.data?.data);
      } catch (error) {
        console.error('Error fetching artist community:', error);
        setError('Failed to load community data. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchArtistCommunity();
  }, [userdata?.artist]);

  // Handle loading state
  if (loading) {
    return <CommunityLoading />;
  }

  // Handle error state
  if (error) {
    return (
      <View className="flex flex-col items-center justify-center p-6 text-center">
        <Text className="text-xl font-semibold text-red-600 mb-2">Error</Text>
        <Text>{error}</Text>
      </View>
    );
  }

  // If artist already has a community, show the community detail view
  if (artistCommunity) {
    return <ArtistCommunityDetails community={artistCommunity} />;
  }


  const handleNext = () => setCurrentStep('buildTribe');
  const handleBack = () => setCurrentStep('welcome');

  switch (currentStep) {
    case 'welcome':
      return <WelcomeScreen onNext={handleNext} />;
    case 'buildTribe':
      return <BuildTribeForm onBack={handleBack} />;
    default:
      return <WelcomeScreen onNext={handleNext} />;
  }
};

export default OnboardingFlow;
