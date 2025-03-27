import { View, Text, Button } from 'react-native'
import * as Notifications from 'expo-notifications'

//Step 3. set response 
Notifications.addNotificationReceivedListener({

})

Notifications.setNotificationHandler({
  handleNotification: async () => {
    return {
      shouldPlaySound: false,
      shouldSetBadge: false,
      shouldShowAlert: true
    }
  }
})


function Demo1() {

  //Step 1 Schedule notifications
  function scheduleNotifications(params) {
    Notifications.scheduleNotificationAsync({
      content: {
        title: 'This is a notification',
        body: 'The sender of the notification is Rohan Rawat',
        data: { date: "27/03/2025" }
      },
      trigger: {
        seconds: 5
      }
    })
  }


  //Step 2. handle notifications i.e.the notifications sent must be visible to user or not and many more



  return (
    <View>
      <Text>Expo-notifications</Text>
      <Button title='GET NOTIFICATIONS' onPress={scheduleNotifications} />
    </View>
  )
}


export default Demo1