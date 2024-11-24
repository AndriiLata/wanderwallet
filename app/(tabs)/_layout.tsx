import FontAwesome from '@expo/vector-icons/FontAwesome';
import { Tabs } from 'expo-router';

export default function TabLayout() {
  return (
    <Tabs screenOptions={{ tabBarActiveTintColor: 'green' }}>
      <Tabs.Screen
        name="camera"
        options={{
          title: 'Wander Wallet',
          tabBarIcon: ({ color }) => <FontAwesome size={28} name="camera" color={color} />,
        }}
      />
      <Tabs.Screen
        name="balance"
        options={{
          title: 'Wander Wallet',
          tabBarIcon: ({ color }) => <FontAwesome size={28} name="home" color={color} />,
        }}
      />
      <Tabs.Screen
        name="generate"
        options={{
          title: 'Wander Wallet',
          tabBarIcon: ({ color }) => <FontAwesome size={28} name="image" color={color} />,
        }}
      />
    </Tabs>
  );
}
