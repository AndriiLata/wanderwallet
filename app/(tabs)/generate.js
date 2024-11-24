import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  Button,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import QRCode from 'react-native-qrcode-svg';

export default function MerchantScreen() {
  const [amount, setAmount] = useState('');
  const [roundedAmount, setRoundedAmount] = useState(null);
  const [showQRCode, setShowQRCode] = useState(false); // Controls QR code visibility

  // Function to round the amount and trigger QR code generation
  const handleRoundAmount = () => {
    if (amount) {
      const rounded = Math.ceil(parseFloat(amount)); // Round up to the nearest integer
      setRoundedAmount(rounded.toString());
      setShowQRCode(true); // Show the QR code after rounding
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Enter Amount to Generate QR Code</Text>

      {/* Input Field for Amount */}
      <TextInput
        style={styles.input}
        placeholder="Enter amount"
        keyboardType="numeric"
        value={amount}
        onChangeText={(value) => {
          setAmount(value);
          setShowQRCode(false); // Reset QR code visibility on input change
        }}
      />

      {/* Button to Round Amount */}
      <TouchableOpacity style={styles.button} onPress={handleRoundAmount}>
        <Text style={styles.buttonText}>Round Amount</Text>
      </TouchableOpacity>

      {/* Display the Rounded Amount */}
      {roundedAmount && (
        <Text style={styles.roundedText}>
          Rounded Amount: {roundedAmount} (used for QR Code)
        </Text>
      )}

      {/* Generate and Display QR Code */}
      {showQRCode && roundedAmount ? (
        <View style={styles.qrCodeContainer}>
          <QRCode
            value={roundedAmount} // Generate QR code for the rounded amount
            size={200}
            color="black"
            backgroundColor="white"
          />
          <Text style={styles.qrText}>
            Scan this QR Code to pay {roundedAmount}.
          </Text>
        </View>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  input: {
    width: '80%',
    height: 50,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 5,
    padding: 10,
    fontSize: 18,
    marginBottom: 20,
  },
  button: {
    backgroundColor: '#007bff',
    padding: 15,
    borderRadius: 5,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
  },
  roundedText: {
    fontSize: 18,
    marginVertical: 10,
    color: 'green',
  },
  qrCodeContainer: {
    marginTop: 30,
    alignItems: 'center',
  },
  qrText: {
    marginTop: 10,
    fontSize: 16,
  },
});
