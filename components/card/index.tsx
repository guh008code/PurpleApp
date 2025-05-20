import React from 'react';
import { View, Text } from 'react-native';

export const StatCard = ({ title, value }: { title: string; value: string }) => {
  return (
    <View className="w-[48%] bg-blue-100 rounded-2xl p-4 mb-4 shadow-sm">
      <Text className="text-sm text-blue-800">{title}</Text>
      <Text className="text-xl font-bold text-blue-900">{value}</Text>
    </View>
  );
};