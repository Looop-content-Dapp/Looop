import { useState, useEffect } from "react";
import { View } from "react-native";
import { MotiView } from "moti";
import { useQuery } from "../../../hooks/useQuery";
import BuildTribeForm from "../../../components/buildTribe/BuildTribeForm";
import WelcomeScreen from "../../../components/buildTribe/WelcomScreen";
import ArtistCommunityDetails from "../../../components/buildTribe/ArtistCommunityDetails";
import CommunityLoading from "../../../components/CommunityLoading";

interface Community {
  _id: string;
  name: string;
  description: string;
  createdBy: string;
  createdAt: string;
  __v: number;
}

interface CommunityResponse {
  message: string;
  data: Community[];
}

const OnboardingFlow = ({ artistId }: { artistId: string }) => {
  const [currentStep, setCurrentStep] = useState('welcome');
  const [loading, setLoading] = useState(true);
  const [artistCommunity, setArtistCommunity] = useState<Community | null>(null);

  const { getAllCommunities } = useQuery();

  useEffect(() => {
    const fetchArtistCommunity = async () => {
      try {
        setLoading(true);
        const response = await getAllCommunities() as CommunityResponse;

        // Find community where createdBy matches artistId
        const community = response.data.find(
          (community) => community.createdBy === "66f25f518ceaa671b0d73a58"
        );

        if (community) {
          setArtistCommunity(community);
        }
      } catch (error) {
        console.error('Error fetching artist community:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchArtistCommunity();
  }, [getAllCommunities]);

  // Show skeleton loader while fetching data
  if (loading) {
    return <CommunityLoading />;
  }

  // If artist already has a community, show the community detail view
  if (artistCommunity) {
    return <ArtistCommunityDetails community={artistCommunity} />;
  }

  // If no community exists, show the onboarding flow
  const renderStep = () => {
    switch (currentStep) {
      case 'welcome':
        return <WelcomeScreen onNext={() => setCurrentStep('buildTribe')} />;
      case 'buildTribe':
        return <BuildTribeForm onBack={() => setCurrentStep('welcome')} />;
      default:
        return <WelcomeScreen onNext={() => setCurrentStep('buildTribe')} />;
    }
  };

  return renderStep();
};

export default OnboardingFlow;
