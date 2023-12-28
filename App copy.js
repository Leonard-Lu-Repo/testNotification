import { StatusBar } from "expo-status-bar";
import { useEffect } from "react";
import { Alert, StyleSheet, Text, View } from "react-native";
import messaging from "@react-native-firebase/messaging";
export default function App() {
	const requestUserPermission = async () => {
		const status = await messaging().requestPermission();
		const enabled =
			status === messaging.AuthorizationStatus.AUTHORIZED ||
			status === messaging.AuthorizationStatus.PROVISIONAL;
		if (enabled) {
			console.log("status", status);
		}
	};

	useEffect(() => {
		if (requestUserPermission()) {
			messaging()
				.getToken()
				.then((token) => {
					console.log(token);
				});
		} else {
			console.log("Failed token", status);
		}
		messaging()
			.getInitialNotification()
			.then(async (remoteMessage) => {
				if (remoteMessage) {
					console.log(
						"Notification caused app to open from quit state",
						remoteMessage.notification
					);
				}
			});
		messaging().onNotificationOpenedApp(async (remoteMessage) => {
			console.log(
				"Notification caused app to open from background state",
				remoteMessage.notification
			);
		});
		messaging().setBackgroundMessageHandler(async (remoteMessage) => {
			console.log("Message handled in the background", remoteMessage);
		});

		const unsubscribe = messaging().onMessage(async (remoteMessage) => {
			Alert.alert("A new FCM Message arrived", JSON.stringify(remoteMessage));
		});
		return unsubscribe;
	}, []);
	return (
		<View style={styles.container}>
			<Text>Open up App.js to start working on your app!</Text>
			<StatusBar style="auto" />
		</View>
	);
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: "#fff",
		alignItems: "center",
		justifyContent: "center",
	},
});
