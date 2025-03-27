import * as Notifications from 'expo-notifications';
import { View, Text, Button, Platform, Alert } from 'react-native';
import * as Device from 'expo-device';
import { useState, useRef, useEffect } from 'react';

// Configure how notifications should be handled when app is in foreground
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
  }),
});

function MainFile() {
  const [expoPushToken, setExpoPushToken] = useState('');
  const [notification, setNotification] = useState(null);
  const notificationListener = useRef();
  const responseListener = useRef();

  async function registerForPushNotificationsAsync() {
    let token;

    if (!Device.isDevice) {
      Alert.alert('Must use a physical device for notifications');
      return;
    }

    const { status: existingStatus } = await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;

    if (existingStatus !== 'granted') {
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
    }

    if (finalStatus !== 'granted') {
      Alert.alert('Failed to get push token!', 'Please enable notifications in settings.');
      return;
    }

    token = (await Notifications.getExpoPushTokenAsync()).data;
    console.log('Expo Push Token:', token);

    if (Platform.OS === 'android') {
      await Notifications.setNotificationChannelAsync('default', {
        name: 'default',
        importance: Notifications.AndroidImportance.MAX,
        vibrationPattern: [0, 250, 250, 250],
        lightColor: '#FF231F7C',
      });
    }

    return token;
  }

  async function sendPushNotification(expoPushToken) {
    if (!expoPushToken) {
      Alert.alert('No push token available!', 'Wait for token initialization.');
      return;
    }

    try {
      const message = {
        to: expoPushToken,
        sound: 'default',
        title: 'Test Notification',
        body: 'This is a test notification from your app!',
        data: { testData: '123' },
      };

      const response = await fetch('https://exp.host/--/api/v2/push/send', {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Accept-encoding': 'gzip, deflate',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(message),
      });

      const result = await response.json();
      console.log('Notification send result:', result);

      if (result.errors) {
        Alert.alert('Failed to send', JSON.stringify(result.errors));
      } else {
        Alert.alert('Notification sent!');
      }
    } catch (error) {
      console.error('Error sending notification:', error);
      Alert.alert('Error', 'Failed to send notification');
    }
  }

  useEffect(() => {
    registerForPushNotificationsAsync().then(token => {
      if (token) {
        setExpoPushToken(token);
      }
    });

    notificationListener.current = Notifications.addNotificationReceivedListener(notification => {
      console.log('Notification received:', notification);
      setNotification(notification);
    });

    responseListener.current = Notifications.addNotificationResponseReceivedListener(response => {
      console.log('Notification response:', response);
    });

    return () => {
      Notifications.removeNotificationSubscription(notificationListener.current);
      Notifications.removeNotificationSubscription(responseListener.current);
    };
  }, []);

  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'space-around', padding: 20 }}>
      <Text style={{ fontSize: 18, marginBottom: 20 }}>
        Your Expo Push Token: {expoPushToken || 'Loading...'}
      </Text>

      <View style={{ marginBottom: 30, alignItems: 'center' }}>
        <Text style={{ fontSize: 16, fontWeight: 'bold', marginBottom: 10 }}>Last Notification:</Text>
        {notification ? (
          <>
            <Text>Title: {notification.request.content.title}</Text>
            <Text>Body: {notification.request.content.body}</Text>
            <Text>Data: {JSON.stringify(notification.request.content.data)}</Text>
          </>
        ) : (
          <Text>No notifications received yet</Text>
        )}
      </View>

      <Button
        title="Send Test Notification"
        onPress={() => sendPushNotification(expoPushToken)}
      // disabled={!expoPushToken}
      />
    </View>
  );
}

export default MainFile;