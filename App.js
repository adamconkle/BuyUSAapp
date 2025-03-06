import React, { useState } from "react";
import { View, Text, Button, TextInput, TouchableOpacity, StyleSheet, Modal, Keyboard, TouchableWithoutFeedback } from "react-native";

export default function App() {
    const [modalVisible, setModalVisible] = useState(false);

    const [barcode, setBarcode] = useState("");
    const [productInfo, setProductInfo] = useState(null);

    // Fetch product data from Open Food Facts
    const fetchProductData = async () => {
        if (!barcode) return;
        
        // Dismiss the keyboard when the button is pressed
        Keyboard.dismiss();

        try {
            const response = await fetch(`https://world.openfoodfacts.org/api/v2/product/${barcode}.json`);
            const data = await response.json();

            if (data.status === 1) {
                const product = data.product;
                const country = product.countries_tags?.includes("en:united-states") ? "USA" : "Other";
                setProductInfo({
                    barcode,
                    company: product.brands || "Unknown",
                    location: country,
                });
            } else {
                setProductInfo("none");
            }
        } catch (error) {
            console.error("Error fetching product data:", error);
        }
    };

    return (
        <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
            <View style={styles.container}>
                <Text style={styles.title}>BuyUSA</Text>
                <Text style={styles.instructions}>Check if product is made in USA</Text>
                <TextInput
                    style={styles.input}
                    placeholder="Enter barcode number"
                    keyboardType="numeric"
                    value={barcode}
                    onChangeText={setBarcode}
                />
                <Button title="Check Product" onPress={fetchProductData} />

                {productInfo && (
                    <View style={[styles.result, productInfo.location === "USA" ? styles.resultSuccess : styles.resultFail]}>
                        <Text style={styles.resultText}>
                            {productInfo.location === "USA"
                                ? "✅ This product is Made in the USA!"
                                : "❌ This product is NOT made in the USA."}
                        </Text>
                        <Text style={styles.infoText}>Barcode: {productInfo.barcode}</Text>
                        <Text style={styles.infoText}>Company: {productInfo.company}</Text>
                        <Text style={styles.infoText}>Location: {productInfo.location}</Text>
                    </View>
                )}

                {/* About This App Link */}
                <TouchableOpacity onPress={() => setModalVisible(true)}>
                    <Text style={styles.aboutLink}>About This App</Text>
                </TouchableOpacity>

                {/* About Modal */}
                <Modal visible={modalVisible} animationType="slide" transparent={true}>
                    <View style={styles.modalContainer}>
                        <View style={styles.modalContent}>
                            <Text style={styles.modalTitle}>About BuyUSA</Text>
                            <Text style={styles.modalText}>
                                How to Use This App:{'\n'}
                                BuyUSA is an app that helps you identify whether a product is made in the USA. 
                                Simply enter a barcode to check its country of origin.{'\n'}{''}{'\n'}
                              
                                Disclaimer: {'\n'}
                                While we strive for accuracy, the information provided may not always be complete or up to date. 
                                Please verify product origins through packaging labels when accuracy is important. {'\n'}{''}{'\n'}
                                
                                About Us:{'\n'}
                                BuyUSA is a free tool designed to help consumers identify products made in the USA. 
                                We use the Open Food Facts database to provide information about product origins. 
                            </Text>
                            <TouchableOpacity style={styles.modalButton} onPress={() => setModalVisible(false)}>
                                <Text style={styles.modalButtonText}>Close</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </Modal>
            </View>
        </TouchableWithoutFeedback>
    );
}

const styles = StyleSheet.create({
    container: { 
        flex: 1, 
        justifyContent: "top",
        paddingTop: 200, 
        alignItems: "center", 
        backgroundColor: "#111222" // Dark background
    },
    
    title: {
        fontSize: 36,
        fontWeight: "bold",
        color: "red",
        marginBottom: 30,
    },
    
    instructions: {
        fontSize: 16,
        color: "white",
        marginBottom: 30,
    },
    
    input: {
        width: "80%",
        height: 50,
        borderColor: "#ccc",
        borderWidth: 1,
        borderRadius: 10,
        backgroundColor: "#fff",
        textAlign: "center",
        fontSize: 18,
        paddingHorizontal: 10,
        marginBottom: 10,
    },
    button: {
        backgroundColor: "#007AFF", // iOS Blue
        paddingVertical: 10,
        paddingHorizontal: 20,
        borderRadius: 10,
        marginTop: 10,
    },
    buttonText: {
        color: "#fff",
        fontSize: 18,
        fontWeight: "bold",
    },
    result: {
        marginTop: 20,
        padding: 15,
        borderRadius: 15,
        shadowColor: "#000",
        shadowOffset: { width: 2, height: 2 },
        shadowOpacity: 0.5,
        shadowRadius: 5,
        width: "85%",
        alignItems: "center",
    },
    resultSuccess: {
        backgroundColor: "#2E7D32", // Green for USA
    },
    resultFail: {
        backgroundColor: "#B71C1C", // Red for not USA
    },
    resultText: {
        fontSize: 20,
        fontWeight: "bold",
        color: "#fff",
        textAlign: "center",
        marginBottom: 5,
    },
    infoText: {
        fontSize: 16,
        color: "#fff",
        textAlign: "center",
    },
    
   aboutLink: {
        marginTop: 40,
        fontSize: 16,
        color: "#555",
        textDecorationLine: "underline",
    },
    modalContainer: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "rgba(0, 0, 0, 0.7)",
    },
    modalContent: {
        backgroundColor: "#fff",
        padding: 20,
        borderRadius: 10,
        width: "80%",
        alignItems: "center",
    },
    modalTitle: {
        fontSize: 22,
        fontWeight: "bold",
        marginBottom: 10,
    },
    modalText: {
        fontSize: 16,
        textAlign: "center",
        marginBottom: 20,
    },
    modalButton: {
        backgroundColor: "#007BFF",
        padding: 10,
        borderRadius: 10,
        width: "50%",
        alignItems: "center",
    },
    modalButtonText: {
        fontSize: 16,
        color: "#fff",
        fontWeight: "bold",
    },
});
