import { View, Text, TouchableOpacity, ScrollView } from 'react-native'
import React, { useState } from 'react'
import { ImageAdd02Icon } from '@hugeicons/react-native';
import { FormField } from '@/components/app-components/formField';
import { FontAwesome, FontAwesome6 } from '@expo/vector-icons';

const countries = [
    {
      label: "Nigeria",
      value: "NG",
      icon: "https://flagcdn.com/w320/ng.png",
      cities: ["Lagos", "Abuja", "Port Harcourt", "Kano", "Ibadan", "Enugu", "Jos", "Benin City", "Abeokuta", "Calabar"],
    },
    {
      label: "United States",
      value: "US",
      icon: "https://flagcdn.com/w320/us.png",
      cities: ["New York", "Los Angeles", "Chicago", "Houston", "Miami", "San Francisco", "Seattle", "Atlanta", "Boston", "Dallas"],
    },
    {
      label: "United Kingdom",
      value: "UK",
      icon: "https://flagcdn.com/w320/gb.png",
      cities: ["London", "Manchester", "Birmingham", "Liverpool", "Bristol", "Leeds", "Glasgow", "Sheffield", "Cardiff", "Edinburgh"],
    },
    {
      label: "India",
      value: "IN",
      icon: "https://flagcdn.com/w320/in.png",
      cities: ["Mumbai", "Delhi", "Bangalore", "Hyderabad", "Chennai", "Kolkata", "Pune", "Jaipur", "Ahmedabad", "Surat"],
    },
    {
      label: "Canada",
      value: "CA",
      icon: "https://flagcdn.com/w320/ca.png",
      cities: ["Toronto", "Vancouver", "Montreal", "Calgary", "Ottawa", "Edmonton", "Winnipeg", "Quebec City", "Halifax", "Hamilton"],
    },
    {
      label: "Germany",
      value: "DE",
      icon: "https://flagcdn.com/w320/de.png",
      cities: ["Berlin", "Munich", "Frankfurt", "Hamburg", "Cologne", "Stuttgart", "Düsseldorf", "Dresden", "Leipzig", "Nuremberg"],
    },
    {
      label: "France",
      value: "FR",
      icon: "https://flagcdn.com/w320/fr.png",
      cities: ["Paris", "Marseille", "Lyon", "Toulouse", "Nice", "Nantes", "Strasbourg", "Montpellier", "Bordeaux", "Lille"],
    },
    {
      label: "Italy",
      value: "IT",
      icon: "https://flagcdn.com/w320/it.png",
      cities: ["Rome", "Milan", "Naples", "Turin", "Palermo", "Florence", "Venice", "Verona", "Bologna", "Genoa"],
    },
    {
      label: "Brazil",
      value: "BR",
      icon: "https://flagcdn.com/w320/br.png",
      cities: ["São Paulo", "Rio de Janeiro", "Brasília", "Salvador", "Fortaleza", "Belo Horizonte", "Curitiba", "Manaus", "Recife", "Porto Alegre"],
    },
    {
      label: "China",
      value: "CN",
      icon: "https://flagcdn.com/w320/cn.png",
      cities: ["Beijing", "Shanghai", "Guangzhou", "Shenzhen", "Chengdu", "Wuhan", "Hangzhou", "Tianjin", "Chongqing", "Xi'an"],
    },
    {
      label: "Japan",
      value: "JP",
      icon: "https://flagcdn.com/w320/jp.png",
      cities: ["Tokyo", "Osaka", "Kyoto", "Yokohama", "Nagoya", "Sapporo", "Kobe", "Fukuoka", "Hiroshima", "Sendai"],
    },
    {
      label: "Australia",
      value: "AU",
      icon: "https://flagcdn.com/w320/au.png",
      cities: ["Sydney", "Melbourne", "Brisbane", "Perth", "Adelaide", "Gold Coast", "Canberra", "Hobart", "Darwin", "Newcastle"],
    },
    {
      label: "South Africa",
      value: "ZA",
      icon: "https://flagcdn.com/w320/za.png",
      cities: ["Cape Town", "Johannesburg", "Durban", "Pretoria", "Port Elizabeth", "Bloemfontein", "East London", "Soweto", "Pietermaritzburg", "Kimberley"],
    },
    {
      label: "Mexico",
      value: "MX",
      icon: "https://flagcdn.com/w320/mx.png",
      cities: ["Mexico City", "Guadalajara", "Monterrey", "Cancún", "Tijuana", "Puebla", "Mérida", "Toluca", "Querétaro", "Chihuahua"],
    },
    {
      label: "Russia",
      value: "RU",
      icon: "https://flagcdn.com/w320/ru.png",
      cities: ["Moscow", "Saint Petersburg", "Novosibirsk", "Kazan", "Sochi", "Yekaterinburg", "Nizhny Novgorod", "Samara", "Rostov-on-Don", "Ufa"],
    },
    {
      label: "Spain",
      value: "ES",
      icon: "https://flagcdn.com/w320/es.png",
      cities: ["Madrid", "Barcelona", "Valencia", "Seville", "Bilbao", "Granada", "Malaga", "Zaragoza", "Salamanca", "San Sebastián"],
    },
    {
      label: "Turkey",
      value: "TR",
      icon: "https://flagcdn.com/w320/tr.png",
      cities: ["Istanbul", "Ankara", "Izmir", "Antalya", "Bursa", "Adana", "Gaziantep", "Konya", "Mersin", "Eskişehir"],
    },
    {
      label: "South Korea",
      value: "KR",
      icon: "https://flagcdn.com/w320/kr.png",
      cities: ["Seoul", "Busan", "Incheon", "Daegu", "Gwangju", "Daejeon", "Ulsan", "Suwon", "Jeonju", "Pohang"],
    },
    {
      label: "Argentina",
      value: "AR",
      icon: "https://flagcdn.com/w320/ar.png",
      cities: ["Buenos Aires", "Córdoba", "Rosario", "Mendoza", "La Plata", "Salta", "Mar del Plata", "Santa Fe", "San Juan", "Bahía Blanca"],
    },
    {
      label: "Indonesia",
      value: "ID",
      icon: "https://flagcdn.com/w320/id.png",
      cities: ["Jakarta", "Surabaya", "Bandung", "Medan", "Bekasi", "Palembang", "Semarang", "Makassar", "Depok", "Tangerang"],
    },
  ];

    const social = [
      {
        title: "X (Formerly Twitter)",
        socialIcon: <FontAwesome6 name="x-twitter" size={18} color="#FFFFFF" />
      },
      {
        title: "Instagram",
        socialIcon: <FontAwesome name="instagram" size={18} color="#ffffff"/>
      },
      {
        title: "TikTok",
        socialIcon:<FontAwesome6 name="tiktok" size={18} color="#ffffff" />

      }
    ];

  const genres = [
    { label: "Pop", value: "pop" },
    { label: "Rock", value: "rock" },
    { label: "Hip Hop", value: "hiphop" },
    { label: "Classical", value: "classical" },
    { label: "Jazz", value: "jazz" },
    { label: "Country", value: "country" },
    { label: "Electronic", value: "electronic" },
    { label: "R&B", value: "rb" },
    { label: "Reggae", value: "reggae" },
    { label: "Blues", value: "blues" },
  ];

  type MultiSelectOption = {
    label: string;
    value: string;
  };


  const CreatorForm = () => {
    const [selectedGenres, setSelectedGenres] = useState<MultiSelectOption[]>([])
    const [selectedCountry, setSelectedCountry] = useState("")
    const [selectedCity, setSelectedCity] = useState("")
    const [cities, setCities] = useState<string[]>([])
    const [formData, setFormData] = useState({
        stageName: '',
        email: '',
        bio: '',
        addressLine1: '',
        addressLine2: '',
        postalCode: '',
        websiteUrl: '',
        socialAccounts: {
            twitter: '',
            instagram: '',
            tiktok: ''
        }
    })

    const handleCountrySelect = (countryValue: string) => {
        const selected = countries.find((c) => c.value === countryValue)
        if (selected) {
            setSelectedCountry(selected.label)
            setCities(selected.cities)
            setSelectedCity("")
        }
    }

    return (
        <ScrollView
            contentContainerStyle={{
                paddingHorizontal: 24,
                paddingBottom: 120,
                flexGrow: 1,
            }}
            style={{
                backgroundColor: "#0A0B0F",
            }}
        >
            {/* Basic Information Section */}
            <View style={{ marginTop: 40, marginBottom: 20 }}>
                <Text style={styles.sectionTitle}>Basic Information</Text>

                {/* Profile Image Upload */}
                <View style={{ alignItems: "center", marginBottom: 40 }}>
                    <TouchableOpacity style={styles.imageUpload}>
                        <ImageAdd02Icon size={40} color="#787A80" />
                    </TouchableOpacity>
                    <View style={{ marginTop: 12, alignItems: "center" }}>
                        <Text style={styles.uploadTitle}>Upload Profile Image</Text>
                        <Text style={styles.uploadSubtitle}>PNG, GIF, WEBP. Max 50MB</Text>
                    </View>
                </View>

                {/* Basic Fields */}
                <View style={{ gap: 16 }}>
                    <FormField.TextField
                        label='Stage Name / Alias'
                        placeholder="Enter fullname"
                        value={formData.stageName}
                        onChangeText={(text) => setFormData({...formData, stageName: text})}
                    />
                    <FormField.TextField
                        label='Business email address'
                        placeholder="example@email.com"
                        value={formData.email}
                        onChangeText={(text) => setFormData({...formData, email: text})}
                    />
                    <FormField.MultiSelectField
                        label="Select Genres"
                        placeholder="Search and add main genres you create songs in"
                        selectedValues={selectedGenres}
                        onSelect={(values) => setSelectedGenres(values)}
                        options={genres}
                    />
                </View>
            </View>

            {/* Location and Biography Section */}
            <View style={{ marginTop: 20, marginBottom: 20 }}>
                <Text style={styles.sectionTitle}>Location and Biography</Text>
                <View style={{ gap: 16 }}>
                    <FormField.TextField
                        label='Bio'
                        placeholder="Tell us about yourself"
                        value={formData.bio}
                        onChangeText={(text) => setFormData({...formData, bio: text})}
                        multiline={true}
                        numberOfLines={4}
                    />
                    <FormField.TextField
                        label='Address Line 1'
                        placeholder="Your house address"
                        value={formData.addressLine1}
                        onChangeText={(text) => setFormData({...formData, addressLine1: text})}
                    />
                    <FormField.TextField
                        label='Address Line 2 (Optional)'
                        placeholder="Your house address"
                        value={formData.addressLine2}
                        onChangeText={(text) => setFormData({...formData, addressLine2: text})}
                    />
                    <FormField.PickerField
                        label="Country"
                        placeholder="Select a country"
                        value={selectedCountry}
                        onSelect={handleCountrySelect}
                        options={countries}
                    />
                    {cities.length > 0 && (
                        <FormField.PickerField
                            label="City"
                            placeholder="Select a city"
                            value={selectedCity}
                            onSelect={(city) => setSelectedCity(city)}
                            options={cities.map((city) => ({ label: city, value: city }))}
                        />
                    )}
                    <FormField.TextField
                        label='Postal Code'
                        placeholder="100100"
                        value={formData.postalCode}
                        onChangeText={(text) => setFormData({...formData, postalCode: text})}
                    />
                </View>
            </View>

            {/* Media & Links Section */}
            <View style={{ marginTop: 20, marginBottom: 20 }}>
                <Text style={styles.sectionTitle}>Media & Links</Text>
                <View style={{ gap: 16 }}>
                    <FormField.TextField
                        label='Website URL'
                        placeholder="www.artiste.com"
                        value={formData.websiteUrl}
                        onChangeText={(text) => setFormData({...formData, websiteUrl: text})}
                    />
                </View>
            </View>

            {/* Social Accounts Section */}
            <View style={{ marginTop: 20, marginBottom: 20 }}>
                <Text style={styles.sectionTitle}>Connect Social Accounts</Text>
                <View style={styles.socialContainer}>
                    {social.map((item) => (
                        <TouchableOpacity
                            key={item.title}
                            style={styles.socialButton}
                        >
                            {item.socialIcon}
                            <Text style={styles.socialText}>{item.title}</Text>
                        </TouchableOpacity>
                    ))}
                </View>
            </View>
        </ScrollView>
    )
}

const styles = {
    sectionTitle: {
        fontSize: 24,
        color: "#A5A6AA",
        fontFamily: "PlusJakartaSans-Bold",
        marginBottom: 20,
    },
    imageUpload: {
        width: 183,
        height: 183,
        backgroundColor: "#12141B",
        borderRadius: 183 / 2,
        alignItems: "center",
        justifyContent: "center",
        borderWidth: 1,
        borderColor: "#1E1F25",
        borderStyle: "dashed",
    },
    uploadTitle: {
        fontSize: 20,
        color: "#F4F4F4",
        fontFamily: "PlusJakartaSans-Medium",
    },
    uploadSubtitle: {
        fontSize: 16,
        color: "#787A80",
        fontFamily: "PlusJakartaSans-Medium",
        marginTop: 4,
    },
    socialContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        alignItems: 'center',
        gap: 12,
        marginTop: 16,
    },
    socialButton: {
        flexDirection: 'row',
        padding: 12,
        alignItems: 'center',
        gap: 8,
        backgroundColor: "#12141B",
        borderRadius: 12,
        borderWidth: 1,
        borderColor: "#1E1F25",
    },
    socialText: {
        fontSize: 16,
        fontFamily: "PlusJakartaSans-Medium",
        color: "#A5A6AA",
    },
}

export default CreatorForm
