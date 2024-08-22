import { Text, Pressable, StyleSheet, Animated, Easing } from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';

import { useColorScheme } from '@/hooks/useColorScheme';
import React, { useEffect,useRef } from 'react';
function delay(ms: number) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
export const Notification = ({ text, type, isVisible, onClose }) => {
    const colorScheme = useColorScheme();
    const color = colorScheme === "dark" ? "white" : "black";
    const buttonBackground = colorScheme === "dark" ? "#151718" : "white";

    // Animated value for the notification position
    const slideAnim = useRef(new Animated.Value(100)).current; // 100% (off-screen) by default

    useEffect(() => {
        async function set(){
            
            if (isVisible) {
                // Slide up animation
                Animated.timing(slideAnim, {
                    toValue: 0, // Bring it to the bottom of the screen
                    duration: 500,
                    easing: Easing.out(Easing.ease),
                    useNativeDriver: true,
                }).start();
    
                await delay(1500);
    
                Animated.timing(slideAnim, {
                    toValue: 100, // Move it off-screen
                    duration: 500,
                    easing: Easing.in(Easing.ease),
                    useNativeDriver: true,
                }).start();
                await delay(500)
                onClose()
                
            }
        }
        set()

    }, [isVisible, slideAnim]);

    if (!isVisible) {
        return null; // Don't render anything if it's not visible
    }

    const styles = StyleSheet.create({
        notifySuccess: {
            position: "absolute",
            flexDirection: "row",
            height: "10%",
            width: "100%",
            backgroundColor: buttonBackground,
            alignSelf: "center",
            bottom: 0,
            justifyContent: "center",
            borderWidth: 3,
            borderColor: "green",
            borderRadius: 25,
            transform: [{ translateY: slideAnim.interpolate({ inputRange: [0, 100], outputRange: [0, 100] }) }],
        },
        notifyFail: {
            position: "absolute",
            flexDirection: "row",
            height: "10%",
            width: "100%",
            backgroundColor: buttonBackground,
            alignSelf: "center",
            bottom: 0,
            justifyContent: "center",
            borderWidth: 3,
            borderColor: "red",
            borderRadius: 25,
            transform: [{ translateY: slideAnim.interpolate({ inputRange: [0, 100], outputRange: [0, 100] }) }],
        }
    });
    if (type === 0) {
        return (
            <Animated.View style={styles.notifyFail}>
                <Ionicons name="close" size={48} style={{ color: "red", verticalAlign: "middle", paddingLeft: 10, flex: 1.5 }} />
                <Text style={{ flex: 7, verticalAlign: "middle", fontWeight: "bold", color: color, fontSize: 20 }}>{text}</Text>
                <Pressable style={{ justifyContent: "center", paddingLeft: 10, flex: 1.5 }} onPress={onClose}>
                    <Ionicons name="close" size={36} style={{ color: color }} />
                </Pressable>
            </Animated.View>
        );
    }
    return (
        <Animated.View style={styles.notifySuccess}>
            <Ionicons name="checkmark-sharp" size={48} style={{ color: "green", verticalAlign: "middle", paddingLeft: 10, flex: 1.5 }} />
            <Text style={{ flex: 7, verticalAlign: "middle", fontWeight: "bold", color: color, fontSize: 20 }}>{text}</Text>
            <Pressable style={{ justifyContent: "center", paddingLeft: 10, flex: 1.5 }} onPress={onClose}>
                <Ionicons name="close" size={36} style={{ color: color }} />
            </Pressable>
        </Animated.View>
    );
}