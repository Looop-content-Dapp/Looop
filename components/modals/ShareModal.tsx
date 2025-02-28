import React, { useState, useEffect } from 'react';
import {
  Modal,
  View,
  Text,
  TouchableOpacity,
  Share,
  Linking,
  FlatList,
  Pressable,
} from 'react-native';
import * as Contacts from 'expo-contacts';
import * as SMS from 'expo-sms';
import {
  Facebook02Icon,
  TwitterIcon,
  InstagramIcon,
  WhatsappIcon,
  Mail02Icon,
} from '@hugeicons/react-native';
import Clipboard from '@react-native-clipboard/clipboard';

// Define types for social share links
type SocialShareLinks = {
  [key: string]: (url: string, title: string) => string;
};

// Define social share URLs
const SOCIAL_SHARE_LINKS: SocialShareLinks = {
  facebook: (url: string, title: string) =>
    `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`,
  twitter: (url: string, title: string) =>
    `https://twitter.com/intent/tweet?url=${encodeURIComponent(url)}&text=${encodeURIComponent(title)}`,
  instagram: (url: string, title: string) =>
    `https://www.instagram.com/?url=${encodeURIComponent(url)}`,
  whatsapp: (url: string, title: string) =>
    `whatsapp://send?text=${encodeURIComponent(`${title} ${url}`)}`,
  email: (url: string, title: string) =>
    `mailto:?subject=${encodeURIComponent(title)}&body=${encodeURIComponent(url)}`,
};

// Define props for the ShareModal component
interface ShareModalProps {
  visible: boolean;
  onClose: () => void;
  shareLink: string;
  shareTitle: string;
}

// Define contact type for the contact list
interface Contact {
  id: string;
  name: string;
  phoneNumbers?: { number: string }[];
  emails?: { email: string }[];
  selected: boolean;
}

/**
 * Reusable ShareModal component for sharing links via social media and native options
 * @param visible - Controls modal visibility
 * @param onClose - Callback to close the modal
 * @param shareLink - URL to share
 * @param shareTitle - Title or message for the share
 */
const ShareModal: React.FC<ShareModalProps> = ({
  visible,
  onClose,
  shareLink,
  shareTitle,
}) => {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [copied, setCopied] = useState<boolean>(false);
  const [showContacts, setShowContacts] = useState<boolean>(false);
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [selectAll, setSelectAll] = useState<boolean>(false);

  // Fetch contacts when the modal opens
  useEffect(() => {
    const fetchContacts = async () => {
      const { status } = await Contacts.requestPermissionsAsync();
      if (status === 'granted') {
        const { data } = await Contacts.getContactsAsync({
          fields: [Contacts.Fields.Name, Contacts.Fields.PhoneNumbers, Contacts.Fields.Emails],
        });
        const formattedContacts: Contact[] = data.map((contact) => ({
          id: contact.id,
          name: contact.name || 'Unknown',
          phoneNumbers: contact.phoneNumbers,
          emails: contact.emails,
          selected: false,
        }));
        setContacts(formattedContacts);
      } else {
        alert('Permission to access contacts was denied.');
      }
    };

    if (visible && showContacts) {
      fetchContacts();
    }
  }, [visible, showContacts]);

  // Handle native sharing (fallback for email and WhatsApp)
  const handleNativeShare = async (platform: string) => {
    try {
      setIsLoading(true);
      await Share.share({
        message: `${shareTitle}\n${shareLink}`,
        url: shareLink,
      });
    } catch (error) {
      console.error(`Error sharing via ${platform}:`, error);
    } finally {
      setIsLoading(false);
    }
  };

  // Handle sharing to specific social media platforms
  const handleSocialShare = async (platform: string) => {
    if (platform === 'email' || platform === 'whatsapp') {
      await handleNativeShare(platform);
      return;
    }

    const url = SOCIAL_SHARE_LINKS[platform](shareLink, shareTitle);
    try {
      setIsLoading(true);
      const canOpen = await Linking.canOpenURL(url);
      if (canOpen) {
        await Linking.openURL(url);
      } else {
        await handleNativeShare(platform);
      }
    } catch (error) {
      console.error(`Error sharing to ${platform}:`, error);
      await handleNativeShare(platform);
    } finally {
      setIsLoading(false);
    }
  };

  // Handle copying to clipboard
  const handleCopyToClipboard = async () => {
    try {
      await Clipboard.setString(shareLink);
      setCopied(true);
      setTimeout(() => {
        setCopied(false);
        onClose();
      }, 2000);
    } catch (error) {
      console.error('Error copying to clipboard:', error);
      alert('Failed to copy link to clipboard.');
    }
  };

  // Toggle contact selection
  const toggleContactSelection = (contactId: string) => {
    setContacts((prevContacts) =>
      prevContacts.map((contact) =>
        contact.id === contactId
          ? { ...contact, selected: !contact.selected }
          : contact
      )
    );
  };

  // Toggle "Select All"
  const toggleSelectAll = () => {
    setSelectAll((prev) => {
      const newSelectAll = !prev;
      setContacts((prevContacts) =>
        prevContacts.map((contact) => ({ ...contact, selected: newSelectAll }))
      );
      return newSelectAll;
    });
  };

  // Share with selected contacts
  const shareWithSelectedContacts = async () => {
    const selectedContacts = contacts.filter((contact) => contact.selected);
    if (selectedContacts.length === 0) {
      alert('Please select at least one contact to share with.');
      return;
    }

    try {
      setIsLoading(true);
      const phoneNumbers = selectedContacts
        .filter((contact) => contact.phoneNumbers && contact.phoneNumbers.length > 0)
        .map((contact) => contact.phoneNumbers![0].number);

      if (phoneNumbers.length > 0) {
        const { result } = await SMS.sendSMSAsync(
          phoneNumbers,
          `${shareTitle}\n${shareLink}`
        );
        if (result === 'sent') {
          alert('Link shared successfully via SMS!');
        } else {
          alert('Failed to send SMS.');
        }
      } else {
        alert('No valid phone numbers found for selected contacts.'); // Fixed the syntax error here
      }
    } catch (error) {
      console.error('Error sharing with contacts:', error);
      alert('Failed to share with contacts.');
    } finally {
      setIsLoading(false);
      setShowContacts(false);
      setSelectAll(false);
      setContacts((prevContacts) =>
        prevContacts.map((contact) => ({ ...contact, selected: false }))
      );
    }
  };

  // Social media platforms to display
  const socialPlatforms: string[] = ['facebook', 'twitter', 'instagram', 'whatsapp', 'email'];

  return (
    <Modal
      animationType="slide"
      transparent
      visible={visible}
      onRequestClose={onClose}
    >
      <TouchableOpacity
        activeOpacity={1}
        onPress={onClose}
        className="flex-1 bg-black/80 justify-end"
      >
        <View className="bg-[#12141B] rounded-t-[32px] p-6 w-full max-w-[500px] mx-auto">
          {!showContacts ? (
            <>
              {/* Header */}
              <View className="flex-row items-center justify-between mb-6">
                <Text className="text-[20px] font-PlusJakartaSansBold text-[#f4f4f4]">
                  Share {shareTitle}
                </Text>
              </View>

              {/* Social Media Grid */}
              <View className="flex-row flex-wrap justify-between mb-6">
                {socialPlatforms.map((platform) => (
                  <TouchableOpacity
                    key={platform}
                    className="w-[60px] h-[60px] bg-[#0A0B0F] rounded-[16px] items-center justify-center mb-4"
                    onPress={() => handleSocialShare(platform)}
                    disabled={isLoading}
                  >
                    {platform === 'facebook' && (
                      <Facebook02Icon size={24} color="#1877F2" />
                    )}
                    {platform === 'twitter' && (
                      <TwitterIcon size={24} color="#1DA1F2" />
                    )}
                    {platform === 'instagram' && (
                      <InstagramIcon size={24} color="#E4405F" />
                    )}
                    {platform === 'whatsapp' && (
                      <WhatsappIcon size={24} color="#25D366" />
                    )}
                    {platform === 'email' && (
                      <Mail02Icon size={24} color="#D44638" />
                    )}
                  </TouchableOpacity>
                ))}
              </View>

              {/* Action Buttons */}
              <View className="gap-y-3">
                {/* Share with Contacts Button */}
                <TouchableOpacity
                  className="bg-[#4CD964] p-4 rounded-[12px] items-center"
                  onPress={() => setShowContacts(true)}
                  disabled={isLoading}
                >
                  <Text className="text-[#040405] text-[16px] font-PlusJakartaSansBold">
                    Share with Contacts
                  </Text>
                </TouchableOpacity>

                {/* Copy Link Button */}
                <TouchableOpacity
                  className={`p-4 rounded-[12px] items-center border-2 ${
                    copied ? 'bg-[#1D2029] border-[#4CD964]' : 'border-[#1D2029]'
                  }`}
                  onPress={handleCopyToClipboard}
                  disabled={isLoading || copied}
                >
                  <Text
                    className={`text-[16px] font-PlusJakartaSansBold ${
                      copied ? 'text-[#4CD964]' : 'text-[#f4f4f4]'
                    }`}
                  >
                    {copied ? 'Copied!' : 'Copy Link'}
                  </Text>
                </TouchableOpacity>

                {/* Close Button */}
                <TouchableOpacity
                  className="p-4 rounded-[12px] items-center"
                  onPress={onClose}
                  disabled={isLoading}
                >
                  <Text className="text-[#787A80] text-[16px] font-PlusJakartaSansMedium">
                    Close
                  </Text>
                </TouchableOpacity>
              </View>
            </>
          ) : (
            <>
              {/* Contacts Header */}
              <View className="flex-row items-center justify-between mb-6">
                <Text className="text-[20px] font-PlusJakartaSansBold text-[#f4f4f4]">
                  Select Contacts
                </Text>
                <TouchableOpacity onPress={() => setShowContacts(false)}>
                  <Text className="text-[#787A80] text-[16px] font-PlusJakartaSansMedium">
                    Back
                  </Text>
                </TouchableOpacity>
              </View>

              {/* Select All Option */}
              <View className="flex-row items-center justify-between mb-4">
                <Text className="text-[#f4f4f4] text-[16px] font-PlusJakartaSansMedium">
                  Select All
                </Text>
                <Pressable onPress={toggleSelectAll}>
                  <View
                    className={`w-6 h-6 rounded-[4px] border-2 ${
                      selectAll ? 'bg-[#4CD964] border-[#4CD964]' : 'border-[#1D2029]'
                    }`}
                  />
                </Pressable>
              </View>

              {/* Contact List */}
              <FlatList
                data={contacts}
                keyExtractor={(item) => item.id}
                renderItem={({ item }) => (
                  <Pressable
                    onPress={() => toggleContactSelection(item.id)}
                    className="flex-row items-center justify-between py-3"
                  >
                    <Text className="text-[#f4f4f4] text-[16px] font-PlusJakartaSansMedium">
                      {item.name}
                    </Text>
                    <View
                      className={`w-6 h-6 rounded-[4px] border-2 ${
                        item.selected
                          ? 'bg-[#4CD964] border-[#4CD964]'
                          : 'border-[#1D2029]'
                      }`}
                    />
                  </Pressable>
                )}
                ListEmptyComponent={
                  <Text className="text-[#787A80] text-center">
                    No contacts found.
                  </Text>
                }
                className="max-h-[200px] mb-6"
              />

              {/* Share Button */}
              <TouchableOpacity
                className="bg-[#4CD964] p-4 rounded-[12px] items-center"
                onPress={shareWithSelectedContacts}
                disabled={isLoading}
              >
                <Text className="text-[#040405] text-[16px] font-PlusJakartaSansBold">
                  {isLoading ? 'Sharing...' : 'Share with Selected Contacts'}
                </Text>
              </TouchableOpacity>
            </>
          )}
        </View>
      </TouchableOpacity>
    </Modal>
  );
};

export default ShareModal;
