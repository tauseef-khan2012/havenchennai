
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Separator } from '@/components/ui/separator';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/components/ui/use-toast';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { Loader2, AlertCircle } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { EnhancedBookingTable } from '@/components/dashboard/EnhancedBookingTable';

const Dashboard = () => {
  const { user, profile, signOut, refreshProfile } = useAuth();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isUpdating, setIsUpdating] = useState(false);
  const [isUpdatingPassword, setIsUpdatingPassword] = useState(false);
  const { toast } = useToast();

  // State for bookings
  const [stayBookings, setStayBookings] = useState([]);
  const [experienceBookings, setExperienceBookings] = useState([]);
  const [loadingStayBookings, setLoadingStayBookings] = useState(true);
  const [loadingExperienceBookings, setLoadingExperienceBookings] = useState(true);
  const [stayBookingsError, setStayBookingsError] = useState(null);
  const [experienceBookingsError, setExperienceBookingsError] = useState(null);

  // Initialize form with profile data
  useEffect(() => {
    if (profile) {
      setName(profile.full_name || '');
      setEmail(profile.email || '');
      setPhone(profile.phone_number || '');
    }
  }, [profile]);

  // Fetch stay bookings
  const fetchStayBookings = async () => {
    if (!user) return;

    try {
      setLoadingStayBookings(true);
      const { data, error } = await supabase
        .from('bookings')
        .select(`
          id,
          check_in_date,
          check_out_date,
          number_of_guests,
          booking_status,
          total_amount_due,
          payment_status,
          property_id,
          properties:property_id(name)
        `)
        .eq('user_id', user.id)
        .order('check_in_date', { ascending: true });

      if (error) throw error;
      
      setStayBookings(data || []);
    } catch (error) {
      console.error('Error fetching stay bookings:', error);
      setStayBookingsError(error.message);
    } finally {
      setLoadingStayBookings(false);
    }
  };

  // Fetch experience bookings
  const fetchExperienceBookings = async () => {
    if (!user) return;

    try {
      setLoadingExperienceBookings(true);
      const { data, error } = await supabase
        .from('experience_bookings')
        .select(`
          id,
          number_of_attendees,
          booking_status,
          total_amount_due,
          payment_status,
          experience_instance_id,
          experience_instances:experience_instance_id(
            date,
            time,
            experiences:experience_id(name)
          )
        `)
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      
      setExperienceBookings(data || []);
    } catch (error) {
      console.error('Error fetching experience bookings:', error);
      setExperienceBookingsError(error.message);
    } finally {
      setLoadingExperienceBookings(false);
    }
  };

  useEffect(() => {
    fetchStayBookings();
  }, [user]);

  useEffect(() => {
    fetchExperienceBookings();
  }, [user]);

  const handleProfileUpdate = async (e) => {
    e.preventDefault();
    
    if (!user) return;
    
    setIsUpdating(true);
    try {
      const { error } = await supabase
        .from('profiles')
        .update({
          full_name: name,
          phone_number: phone,
        })
        .eq('id', user.id);
      
      if (error) throw error;
      
      await refreshProfile();
      
      toast({
        title: "Success!",
        description: "Your profile has been updated successfully.",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: error.message || "An error occurred while updating your profile.",
        variant: "destructive"
      });
    } finally {
      setIsUpdating(false);
    }
  };

  const handlePasswordChange = async (e) => {
    e.preventDefault();
    
    if (!currentPassword || !newPassword || !confirmPassword) {
      toast({
        title: "Error",
        description: "Please fill out all password fields.",
        variant: "destructive"
      });
      return;
    }
    
    if (newPassword !== confirmPassword) {
      toast({
        title: "Error",
        description: "New passwords do not match.",
        variant: "destructive"
      });
      return;
    }
    
    setIsUpdatingPassword(true);
    try {
      const { error } = await supabase.auth.updateUser({
        password: newPassword,
      });
      
      if (error) throw error;
      
      toast({
        title: "Success!",
        description: "Your password has been changed successfully.",
      });
      
      // Reset password fields
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
    } catch (error) {
      toast({
        title: "Error",
        description: error.message || "An error occurred while changing your password.",
        variant: "destructive"
      });
    } finally {
      setIsUpdatingPassword(false);
    }
  };

  // Loading state
  if (!user || !profile) {
    return (
      <>
        <Navbar />
        <main className="py-16 bg-haven-beige bg-opacity-10 min-h-screen">
          <div className="container-custom">
            <div className="text-center">
              <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
              <h1 className="font-serif text-3xl font-bold mb-4">Loading your profile...</h1>
            </div>
          </div>
        </main>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Navbar />
      <main className="py-16 bg-haven-beige bg-opacity-10 min-h-screen">
        <div className="container-custom">
          <div className="flex flex-col md:flex-row items-center md:items-start md:justify-between mb-8">
            <div className="flex flex-col md:flex-row items-center gap-4 mb-4 md:mb-0">
              <Avatar className="w-16 h-16">
                <AvatarFallback className="bg-haven-green text-white text-lg">
                  {profile.full_name?.split(' ').map((n) => n[0]).join('') || user.email?.[0].toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <div className="text-center md:text-left">
                <h1 className="font-serif text-3xl font-bold">{profile.full_name}</h1>
                <p className="text-gray-600">Member since {new Date(profile.created_at).toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' })}</p>
              </div>
            </div>
            <Button 
              variant="outline" 
              className="text-haven-green border-haven-green hover:bg-haven-green hover:text-white"
              onClick={signOut}
            >
              Log Out
            </Button>
          </div>
          
          <Tabs defaultValue="bookings" className="w-full">
            <TabsList className="grid w-full md:w-auto grid-cols-3 mb-8">
              <TabsTrigger value="bookings">My Bookings</TabsTrigger>
              <TabsTrigger value="profile">Profile</TabsTrigger>
              <TabsTrigger value="security">Security</TabsTrigger>
            </TabsList>
            
            <TabsContent value="bookings">
              <div className="space-y-8">
                {/* Stay Bookings Section */}
                <div>
                  <h2 className="font-serif text-2xl font-bold mb-4">Your Stay Bookings</h2>
                  
                  {stayBookingsError && (
                    <Alert variant="destructive" className="mb-4">
                      <AlertCircle className="h-4 w-4" />
                      <AlertTitle>Error</AlertTitle>
                      <AlertDescription>
                        {stayBookingsError}
                      </AlertDescription>
                    </Alert>
                  )}
                  
                  {loadingStayBookings ? (
                    <div className="flex items-center justify-center py-8">
                      <Loader2 className="h-8 w-8 animate-spin mr-2" />
                      <p>Loading your stay bookings...</p>
                    </div>
                  ) : stayBookings.length === 0 ? (
                    <Card>
                      <CardContent className="py-8 text-center">
                        <p className="text-gray-600 mb-4">You don't have any stay bookings yet.</p>
                        <div className="flex justify-center gap-4">
                          <Link to="/stay">
                            <Button className="bg-haven-green hover:bg-haven-green/90">Book a Stay</Button>
                          </Link>
                        </div>
                      </CardContent>
                    </Card>
                  ) : (
                    <EnhancedBookingTable 
                      bookings={stayBookings} 
                      type="stay" 
                      onBookingsUpdate={fetchStayBookings}
                    />
                  )}
                </div>

                {/* Experience Bookings Section */}
                <div>
                  <h2 className="font-serif text-2xl font-bold mb-4">Your Experience Bookings</h2>
                  
                  {experienceBookingsError && (
                    <Alert variant="destructive" className="mb-4">
                      <AlertCircle className="h-4 w-4" />
                      <AlertTitle>Error</AlertTitle>
                      <AlertDescription>
                        {experienceBookingsError}
                      </AlertDescription>
                    </Alert>
                  )}
                  
                  {loadingExperienceBookings ? (
                    <div className="flex items-center justify-center py-8">
                      <Loader2 className="h-8 w-8 animate-spin mr-2" />
                      <p>Loading your experience bookings...</p>
                    </div>
                  ) : experienceBookings.length === 0 ? (
                    <Card>
                      <CardContent className="py-8 text-center">
                        <p className="text-gray-600 mb-4">You don't have any experience bookings yet.</p>
                        <div className="flex justify-center gap-4">
                          <Link to="/experiences">
                            <Button className="bg-haven-green hover:bg-haven-green/90">Explore Experiences</Button>
                          </Link>
                        </div>
                      </CardContent>
                    </Card>
                  ) : (
                    <EnhancedBookingTable 
                      bookings={experienceBookings} 
                      type="experience" 
                      onBookingsUpdate={fetchExperienceBookings}
                    />
                  )}
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="profile">
              <Card>
                <CardHeader>
                  <CardTitle className="font-serif text-2xl">Profile Information</CardTitle>
                  <CardDescription>Update your personal information</CardDescription>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleProfileUpdate} className="space-y-6">
                    <div className="grid md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <Label htmlFor="name">Full Name</Label>
                        <Input 
                          id="name" 
                          value={name} 
                          onChange={(e) => setName(e.target.value)} 
                          required
                          disabled={isUpdating}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="email">Email Address</Label>
                        <Input 
                          id="email" 
                          type="email" 
                          value={email} 
                          disabled
                          required
                        />
                        <p className="text-sm text-gray-500">Email cannot be changed</p>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="phone">Phone Number</Label>
                        <Input 
                          id="phone" 
                          value={phone} 
                          onChange={(e) => setPhone(e.target.value)}
                          disabled={isUpdating}
                        />
                      </div>
                    </div>
                    
                    <Button 
                      type="submit" 
                      className="bg-haven-green hover:bg-haven-green/90"
                      disabled={isUpdating}
                    >
                      {isUpdating ? 'Saving...' : 'Save Changes'}
                    </Button>
                  </form>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="security">
              <Card>
                <CardHeader>
                  <CardTitle className="font-serif text-2xl">Security Settings</CardTitle>
                  <CardDescription>Manage your password and account security</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-8">
                    <form onSubmit={handlePasswordChange} className="space-y-6">
                      <h3 className="text-lg font-semibold">Change Password</h3>
                      <div className="space-y-4">
                        <div className="space-y-2">
                          <Label htmlFor="current-password">Current Password</Label>
                          <Input 
                            id="current-password" 
                            type="password" 
                            value={currentPassword}
                            onChange={(e) => setCurrentPassword(e.target.value)}
                            required
                            disabled={isUpdatingPassword}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="new-password">New Password</Label>
                          <Input 
                            id="new-password" 
                            type="password"
                            value={newPassword}
                            onChange={(e) => setNewPassword(e.target.value)}
                            required
                            disabled={isUpdatingPassword}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="confirm-password">Confirm New Password</Label>
                          <Input 
                            id="confirm-password" 
                            type="password"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            required
                            disabled={isUpdatingPassword}
                          />
                        </div>
                      </div>
                      <Button 
                        type="submit" 
                        className="bg-haven-green hover:bg-haven-green/90"
                        disabled={isUpdatingPassword}
                      >
                        {isUpdatingPassword ? 'Updating...' : 'Update Password'}
                      </Button>
                    </form>
                    
                    <Separator />
                    
                    <div className="space-y-4">
                      <h3 className="text-lg font-semibold">Delete Account</h3>
                      <p className="text-gray-600">
                        Once you delete your account, there is no going back. Please be certain.
                      </p>
                      <Button variant="destructive">Delete Account</Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </main>
      <Footer />
    </>
  );
};

export default Dashboard;
