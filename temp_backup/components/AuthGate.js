import { useEffect } from 'react';
import { View, ActivityIndicator, Text } from 'react-native';
import { supabase } from '../lib/supabase';
import { useNavigation } from '@react-navigation/native';

export default function AuthGate() {
  const navigation = useNavigation();

  useEffect(() => {
    const checkAuth = async () => {
      try {
        // 1. Check current auth session
        const { data: { session }, error } = await supabase.auth.getSession();
        
        if (error) throw error;

        if (!session) {
          navigation.reset({
            index: 0,
            routes: [{ name: 'LoginScreen' }],
          });
          return;
        }

        // 2. Get user role from Supabase
        const { data: roleData, error: roleError } = await supabase
          .from('user_roles')
          .select('role')
          .eq('user_id', session.user.id)
          .single();

        if (roleError) throw roleError;

        // 3. Route based on role
        navigation.reset({
          index: 0,
          routes: [{
            name: roleData?.role === 'volunteer' ? 'VolunteerHome' : 'ListenerHome'
          }],
        });

      } catch (error) {
        console.error('Auth error:', error);
        navigation.reset({
          index: 0,
          routes: [{ name: 'LoginScreen' }],
        });
      }
    };

    // 4. Set up auth state listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(checkAuth);
    
    // Initial check
    checkAuth();

    return () => subscription?.unsubscribe();
  }, []);

  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <ActivityIndicator size="large" />
      <Text style={{ marginTop: 10 }}>Checking authentication...</Text>
    </View>
  );
}