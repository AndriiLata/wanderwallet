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
      const rounded = amount; // Round up to the nearest integer
      setRoundedAmount(rounded.toString());
      setShowQRCode(true); // Show the QR code after rounding
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Enter Price to Generate QR Code</Text>

      {/* Input Field for Amount */}
      <TextInput
        style={styles.input}
        placeholder="Enter amount of Solana"
        keyboardType="numeric"
        value={amount}
        onChangeText={(value) => {
          setAmount(value);
          setShowQRCode(false); // Reset QR code visibility on input change
        }}
      />

      {/* Button to Round Amount */}
      <TouchableOpacity style={styles.actionButton} onPress={handleRoundAmount}>
        <Text style={styles.actionButtonText}>Get QR Code</Text>
      </TouchableOpacity>

      {/* Display the Rounded Amount */}
      {roundedAmount && (
        <Text style={styles.roundedText}>
          Amount: {roundedAmount} SOL
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
            Scan this QR Code to pay.
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
    backgroundColor: '#fff',
    borderRadius: 8,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    elevation: 2,
    color: '#888',
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
  actionButtonsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginVertical: 20,
  },
  actionButton: {
    backgroundColor: '#4caf50',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 5,
  },
  actionButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
},
});
