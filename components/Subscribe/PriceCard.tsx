// PriceCard.js
import React from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity } from 'react-native';
import { AppleIcon, CreditCardPosIcon, Message02Icon, Playlist01Icon, StarIcon } from '@hugeicons/react-native';

export const PriceCard = ({ price = 2950.00 }) => (
  <View style={styles.priceCard}>
    <View style={styles.priceContent}>
      <View style={styles.priceRow}>
        <Text style={styles.currency}>₦</Text>
        <Text style={styles.price}>{price.toFixed(2)}</Text>
        <Text style={styles.period}>/month</Text>
      </View>
      <Text style={styles.stickersText}>5 stickers</Text>
    </View>
    <View style={styles.starContainer}>
      <StarIcon size={32} color="#FFB800" />
    </View>
  </View>
);

// BenefitsList.js
export const BenefitsList = () => (
  <View style={styles.benefitsSection}>
    <Text style={styles.benefitsTitle}>Get access to exclusive content</Text>
    <BenefitItem
      icon={<Message02Icon size={24} color="#FFFFFF" />}
      text="Sub-only LIVE chats"
    />
    <BenefitItem
      icon={<Playlist01Icon size={24} color="#FFFFFF" />}
      text="Sub-only LIVE"
    />
  </View>
);

const BenefitItem = ({ icon, text }) => (
  <View style={styles.benefitRow}>
    <View style={styles.benefitIcon}>
      {icon}
    </View>
    <Text style={styles.benefitText}>{text}</Text>
  </View>
);

// BillingOptions.js
export const BillingOptions = ({ selectedPayment, onSelect, price }) => (
  <View style={styles.billingOptions}>
    <BillingOption
      title="1 month"
      price={price}
      isSelected={selectedPayment === 'month'}
      onSelect={() => onSelect('month')}
      isRecurring={true}
    />
    <BillingOption
      title="1 month (non-renewing)"
      price={price}
      isSelected={selectedPayment === 'month-nonrenewing'}
      onSelect={() => onSelect('month-nonrenewing')}
      isRecurring={false}
    />
  </View>
);

const BillingOption = ({ title, price, isSelected, onSelect, isRecurring }) => (
  <TouchableOpacity
    style={[styles.billingOption, isSelected && styles.billingOptionSelected]}
    onPress={onSelect}
  >
    <View style={styles.billingOptionContent}>
      <Text style={styles.billingTitle}>{title}</Text>
      <Text style={styles.billingPrice}>
        ₦ {price.toFixed(2)}{isRecurring ? '/month' : ''}
      </Text>
    </View>
    <View style={[styles.radio, isSelected && styles.radioSelected]}>
      {isSelected && <View style={styles.radioInner} />}
    </View>
  </TouchableOpacity>
);

// PaymentMethodsList.js
export const PaymentMethodsList = ({ activeMethod, onSelect }) => (
  <View style={styles.paymentMethods}>
    <PaymentMethod
      method="apple"
      icon={<AppleIcon size={24} color="#FFFFFF" />}
      label="Apple Pay"
      isSelected={activeMethod === 'apple'}
      onSelect={() => onSelect('apple')}
    />
    <PaymentMethod
      method="card"
      icon={<CreditCardPosIcon size={24} color="#FFFFFF" />}
      label="Credit Card"
      isSelected={activeMethod === 'card'}
      onSelect={() => onSelect('card')}
    />
    <PaymentMethod
      method="starknet"
      icon={
        <Image
          source={require("../../../assets/images/starknet.png")}
          style={styles.methodIcon}
        />
      }
      label="Starknet USDC"
      isSelected={activeMethod === 'starknet'}
      onSelect={() => onSelect('starknet')}
    />
  </View>
);

const PaymentMethod = ({ icon, label, isSelected, onSelect }) => (
  <TouchableOpacity
    style={[styles.paymentMethod, isSelected && styles.paymentMethodSelected]}
    onPress={onSelect}
  >
    <View style={styles.paymentMethodContent}>
      {icon}
      <Text style={styles.paymentMethodLabel}>{label}</Text>
    </View>
    <View style={[styles.radio, isSelected && styles.radioSelected]}>
      {isSelected && <View style={styles.radioInner} />}
    </View>
  </TouchableOpacity>
);

// Button.js
export const Button = ({
  onPress,
  label,
  variant = 'primary',
  loading = false,
  disabled = false,
}) => (
  <TouchableOpacity
    style={[
      styles.button,
      styles[`button${variant}`],
      disabled && styles.buttonDisabled
    ]}
    onPress={onPress}
    disabled={disabled || loading}
  >
    {loading ? (
      <ActivityIndicator color={variant === 'primary' ? '#FFFFFF' : '#000000'} />
    ) : (
      <Text style={[
        styles.buttonText,
        styles[`buttonText${variant}`]
      ]}>
        {label}
      </Text>
    )}
  </TouchableOpacity>
);

const styles = StyleSheet.create({
  priceCard: {
    backgroundColor: '#FFF5E6',
    borderRadius: 16,
    padding: 20,
    marginBottom: 24,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  priceContent: {
    flex: 1,
  },
  priceRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
  },
  currency: {
    fontSize: 20,
    color: '#000000',
    fontFamily: 'PlusJakartaSansBold',
    marginRight: 2,
  },
  price: {
    fontSize: 32,
    color: '#000000',
    fontFamily: 'PlusJakartaSansBold',
  },
  period: {
    fontSize: 16,
    color: '#000000',
    fontFamily: 'PlusJakartaSansRegular',
    marginLeft: 4,
  },
  stickersText: {
    fontSize: 14,
    color: '#000000',
    fontFamily: 'PlusJakartaSansRegular',
    marginTop: 4,
  },
  starContainer: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  benefitsSection: {
    marginBottom: 32,
  },
  benefitsTitle: {
    fontSize: 20,
    color: '#FFFFFF',
    fontFamily: 'PlusJakartaSansBold',
    marginBottom: 16,
  },
  benefitRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1A1A1A',
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
  },
  benefitIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#2A2A2A',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  benefitText: {
    flex: 1,
    fontSize: 16,
    color: '#FFFFFF',
    fontFamily: 'PlusJakartaSansSemiBold',
  },
  button: {
    height: 52,
    borderRadius: 26,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  buttonPrimary: {
    backgroundColor: '#FF1B6D',
  },
  buttonSecondary: {
    backgroundColor: '#1A1A1A',
  },
  buttonDisabled: {
    opacity: 0.5,
  },
  buttonText: {
    fontSize: 16,
    fontFamily: 'PlusJakartaSansBold',
  },
  buttonTextPrimary: {
    color: '#FFFFFF',
  },
  buttonTextSecondary: {
    color: '#FFFFFF',
  },
  // Billing Options
  billingOptions: {
    marginBottom: 24,
  },
  billingOption: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#1A1A1A',
    borderRadius: 12,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#2A2A2A',
  },
  billingOptionSelected: {
    borderColor: '#FF1B6D',
    backgroundColor: '#2A2A2A',
  },
  billingOptionContent: {
    flex: 1,
  },
  billingTitle: {
    fontSize: 16,
    color: '#FFFFFF',
    fontFamily: 'PlusJakartaSansSemiBold',
    marginBottom: 4,
  },
  billingPrice: {
    fontSize: 14,
    color: '#787A80',
    fontFamily: 'PlusJakartaSansRegular',
  },
  // Payment Methods
  paymentMethods: {
    marginBottom: 24,
  },
  paymentMethod: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#1A1A1A',
    borderRadius: 12,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#2A2A2A',
  },
  paymentMethodSelected: {
    borderColor: '#FF1B6D',
    backgroundColor: '#2A2A2A',
  },
  paymentMethodContent: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  paymentMethodLabel: {
    fontSize: 16,
    color: '#FFFFFF',
    fontFamily: 'PlusJakartaSansSemiBold',
    marginLeft: 12,
  },
  methodIcon: {
    width: 24,
    height: 24,
  },
  radio: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: '#787A80',
    justifyContent: 'center',
    alignItems: 'center',
  },
  radioSelected: {
    borderColor: '#FF1B6D',
  },
  radioInner: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#FF1B6D',
  },
});
