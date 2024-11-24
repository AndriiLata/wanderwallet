import React, { useState } from 'react';
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    StyleSheet,
    Modal,
    FlatList,
    Image,
} from 'react-native';

export default function BalanceTab() {
    const [walletAddress, setWalletAddress] = useState('');
    const [loggedIn, setLoggedIn] = useState(false);
    const [addMoneyModalVisible, setAddMoneyModalVisible] = useState(false);
    const [sendMoneyModalVisible, setSendMoneyModalVisible] = useState(false);
    const [fakeBalance, setFakeBalance] = useState('202.00');
    const [transactionAmount, setTransactionAmount] = useState('');
    const [transactions, setTransactions] = useState<Transaction[]>([
        { id: '1', type: 'Received', amount: 50, date: '2024-11-22' },
        { id: '2', type: 'Received', amount: 20, date: '2024-11-20' },
        { id: '3', type: 'Received', amount: 50, date: '2023-10-20' },
        { id: '4', type: 'Sent', amount: 20, date: '2023-09-19' },
    ]);
    const [showRoundModal, setShowRoundModal] = useState(false);
    const [amountToSend, setAmountToSend] = useState(0);
    const [additionalAmount, setAdditionalAmount] = useState(0);

    type Transaction = {
        id: string;
        type: string;
        amount: number;
        date: string;
    };

    const addMoneyToBalance = (amount: number) => {
        setFakeBalance((prev) => (parseFloat(prev) + amount).toFixed(2));
        setTransactions((prev) => [
            ...prev,
            {
                id: (prev.length + 1).toString(),
                type: 'Received',
                amount,
                date: new Date().toISOString().split('T')[0],
            },
        ]);
        setAddMoneyModalVisible(false);
        setTransactionAmount('');
    };

    const sendMoneyFromBalance = (amount: number, isDonation: boolean = false) => {
        setFakeBalance((prev) => (parseFloat(prev) - amount).toFixed(2));
        setTransactions((prev) => [
            ...prev,
            {
                id: (prev.length + 1).toString(),
                type: isDonation ? 'Donation' : 'Sent',
                amount,
                date: new Date().toISOString().split('T')[0],
            },
        ]);
    };

    const handleAddMoney = () => {
        const amount = parseFloat(transactionAmount);
        if (!isNaN(amount) && amount > 0) {
            addMoneyToBalance(amount);
        } else {
            alert('Please enter a valid amount.');
        }
    };

    const handleSendMoney = () => {
        const amount = parseFloat(transactionAmount);
        if (!isNaN(amount) && amount > 0) {
            if (amount > parseFloat(fakeBalance)) {
                alert('Insufficient balance.');
                return;
            }

            if (!Number.isInteger(amount)) {
                // Calculate the additional amount needed to round up
                const nextWholeNumber = Math.ceil(amount);
                const extraAmount = parseFloat((nextWholeNumber - amount).toFixed(2));
                setAdditionalAmount(extraAmount);
                setShowRoundModal(true);
                setAmountToSend(amount);
            } else {
                // Proceed without rounding
                sendMoneyFromBalance(amount);
                setSendMoneyModalVisible(false);
                setTransactionAmount('');
            }
        } else {
            alert('Please enter a valid amount.');
        }
    };

    const handleConfirmAdditional = () => {
        // Subtract both the original amount and the additional amount
        sendMoneyFromBalance(amountToSend);
        sendMoneyFromBalance(additionalAmount, true); // Mark as a donation
        setShowRoundModal(false);
        setSendMoneyModalVisible(false);
        setTransactionAmount('');
    };

    const handleDeclineAdditional = () => {
        // Subtract only the original amount
        sendMoneyFromBalance(amountToSend);
        setShowRoundModal(false);
        setSendMoneyModalVisible(false);
        setTransactionAmount('');
    };

    const renderTransaction = ({ item }: { item: Transaction }) => (
        <View style={styles.transactionCard}>
            <Text style={styles.transactionType}>
                {item.type}:{' '}
                <Text
                    style={[
                        styles.transactionAmount,
                        {
                            color:
                                item.type === 'Received'
                                    ? '#4caf50'
                                    : item.type === 'Donation'
                                    ? '#ff9800'
                                    : '#f44336',
                        },
                    ]}
                >
                    {item.amount} SOL
                </Text>
            </Text>
            <Text style={styles.transactionDate}>{item.date}</Text>
        </View>
    );

    return (
        <View style={styles.container}>
            {loggedIn ? (
                <>
                    <View style={styles.balanceContainer}>
                        <Text style={styles.balanceText}>{fakeBalance} SOL</Text>
                        <Text style={styles.balanceSubText}>Your current balance</Text>
                    </View>

                    <FlatList
                        data={transactions}
                        keyExtractor={(item) => item.id}
                        renderItem={renderTransaction}
                        contentContainerStyle={styles.transactionList}
                    />

                    {/* Action Buttons */}
                    <View style={styles.actionButtonsContainer}>
                        <TouchableOpacity
                            style={styles.actionButton}
                            onPress={() => setAddMoneyModalVisible(true)}
                        >
                            <Text style={styles.actionButtonText}>Add Money</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={styles.actionButton}
                            onPress={() => setSendMoneyModalVisible(true)}
                        >
                            <Text style={styles.actionButtonText}>Send Money</Text>
                        </TouchableOpacity>
                    </View>

                    {/* Add Money Modal */}
                    <Modal
                        visible={addMoneyModalVisible}
                        transparent={true}
                        animationType="slide"
                        onRequestClose={() => setAddMoneyModalVisible(false)}
                    >
                        <View style={styles.modalOverlay}>
                            <View style={styles.modalContent}>
                                <Text style={styles.modalText}>Add Money</Text>
                                <TextInput
                                    style={styles.input}
                                    value={transactionAmount}
                                    onChangeText={setTransactionAmount}
                                    placeholder="Enter amount"
                                    keyboardType="numeric"
                                />
                                <View style={styles.modalButtons}>
                                    <TouchableOpacity
                                        style={styles.modalButtonCancel}
                                        onPress={() => setAddMoneyModalVisible(false)}
                                    >
                                        <Text style={styles.modalButtonText}>Cancel</Text>
                                    </TouchableOpacity>
                                    <TouchableOpacity
                                        style={styles.modalButtonConfirm}
                                        onPress={handleAddMoney}
                                    >
                                        <Text style={styles.modalButtonText}>Confirm</Text>
                                    </TouchableOpacity>
                                </View>
                            </View>
                        </View>
                    </Modal>

                    {/* Send Money Modal */}
                    <Modal
                        visible={sendMoneyModalVisible}
                        transparent={true}
                        animationType="slide"
                        onRequestClose={() => setSendMoneyModalVisible(false)}
                    >
                        <View style={styles.modalOverlay}>
                            <View style={styles.modalContent}>
                                <Text style={styles.modalText}>Send Money</Text>
                                <TextInput
                                    style={styles.input}
                                    value={transactionAmount}
                                    onChangeText={setTransactionAmount}
                                    placeholder="Enter amount"
                                    keyboardType="numeric"
                                />
                                <View style={styles.modalButtons}>
                                    <TouchableOpacity
                                        style={styles.modalButtonCancel}
                                        onPress={() => setSendMoneyModalVisible(false)}
                                    >
                                        <Text style={styles.modalButtonText}>Cancel</Text>
                                    </TouchableOpacity>
                                    <TouchableOpacity
                                        style={styles.modalButtonConfirm}
                                        onPress={handleSendMoney}
                                    >
                                        <Text style={styles.modalButtonText}>Confirm</Text>
                                    </TouchableOpacity>
                                </View>
                            </View>
                        </View>
                    </Modal>

                    {/* Round Number Modal */}
                    <Modal
                        visible={showRoundModal}
                        transparent={true}
                        animationType="slide"
                        onRequestClose={() => setShowRoundModal(false)}
                    >
                        <View style={styles.modalOverlay}>
                            <View style={styles.modalContent}>
                                {/* Placeholder Image */}
                                <Image
                                    source={require('./rb_127569.png')} // Replace with your image path
                                    style={styles.placeholderImage}
                                />
                                <Text style={styles.modalText}>
                                    Add {additionalAmount} SOL to save the world!
                                </Text>
                                <View style={styles.modalButtons}>
                                    <TouchableOpacity
                                        style={styles.modalButtonCancel}
                                        onPress={handleDeclineAdditional}
                                    >
                                        <Text style={styles.modalButtonText}>No, thanks</Text>
                                    </TouchableOpacity>
                                    <TouchableOpacity
                                        style={styles.modalButtonConfirm}
                                        onPress={handleConfirmAdditional}
                                    >
                                        <Text style={styles.modalButtonText}>Yes, let's do it!</Text>
                                    </TouchableOpacity>
                                </View>
                            </View>
                        </View>
                    </Modal>
                </>
            ) : (
                <View style={styles.loginContainer}>
                    <Text style={styles.title}>Enter Your Wallet Address</Text>
                    <TextInput
                        style={styles.Forma}
                        value={walletAddress}
                        onChangeText={setWalletAddress}
                        placeholder="e.g., 4f3s...8e9k"
                        autoCapitalize="none"
                    />
                    <TouchableOpacity
                        style={styles.loginButton}
                        onPress={() => setLoggedIn(true)}
                    >
                        <Text style={styles.loginButtonText}>Log In</Text>
                    </TouchableOpacity>
                </View>
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    title: {
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 20,
      },
    Forma: {
        width: '80%',
        height: 50,
        borderColor: '#ccc',
        borderWidth: 1,
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
    container: {
        flex: 1,
        backgroundColor: '#f9f9f9',
    },
    balanceContainer: {
        alignItems: 'center',
        marginVertical: 20,
    },
    balanceText: {
        fontSize: 32,
        fontWeight: 'bold',
        color: '#4caf50',
    },
    balanceSubText: {
        fontSize: 16,
        color: '#888',
    },
    transactionList: {
        paddingHorizontal: 16,
    },
    transactionCard: {
        backgroundColor: '#fff',
        borderRadius: 8,
        padding: 16,
        marginVertical: 8,
        shadowColor: '#000',
        shadowOpacity: 0.1,
        shadowOffset: { width: 0, height: 2 },
        shadowRadius: 4,
        elevation: 2,
    },
    transactionType: {
        fontSize: 16,
        fontWeight: '600',
        color: '#333',
    },
    transactionAmount: {
        fontWeight: 'bold',
    },
    transactionDate: {
        marginTop: 4,
        fontSize: 14,
        color: '#888',
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
    modalOverlay: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    modalContent: {
        backgroundColor: '#fff',
        borderRadius: 10,
        padding: 20,
        width: '80%',
        alignItems: 'center',
    },
    modalText: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 16,
        textAlign: 'center',
    },
    modalButtons: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 20,
        width: '100%',
    },
    modalButtonCancel: {
        backgroundColor: '#f44336',
        borderRadius: 5,
        paddingVertical: 10,
        paddingHorizontal: 20,
        flex: 1,
        marginRight: 5,
    },
    modalButtonConfirm: {
        backgroundColor: '#4caf50',
        borderRadius: 5,
        paddingVertical: 10,
        paddingHorizontal: 20,
        flex: 1,
        marginLeft: 5,
    },
    modalButtonText: {
        color: '#fff',
        fontWeight: 'bold',
        textAlign: 'center',
    },
    loginContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 16,
    },
    text: {
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 16,
    },
    input: {
        width: '100%',
        height: 40,
        borderColor: '#ccc',
        borderWidth: 1,
        borderRadius: 5,
        paddingHorizontal: 8,
        marginBottom: 16,
    },
    loginButton: {
        backgroundColor: '#4caf50',
        paddingVertical: 12,
        paddingHorizontal: 24,
        borderRadius: 5,
        marginLeft: 5,
        marginRight: 5
    },
    loginButtonText: {
        color: '#fff',
        fontWeight: 'bold',
        fontSize: 18,
    },
    placeholderImage: {
        width: 100,
        height: 100,
        marginBottom: 16,
    },
});
