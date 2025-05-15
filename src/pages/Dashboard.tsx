
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/components/ui/use-toast';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';

// Sample booking data that would come from Supabase (will be replaced with real data later)
const bookingsData = [
  {
    id: 'b1',
    type: 'stay',
    title: 'Container Home Stay',
    startDate: '2023-06-10',
    endDate: '2023-06-12',
    guests: 2,
    status: 'completed',
    totalAmount: 498,
    imageUrl: 'https://images.unsplash.com/photo-1500673922987-e212871fec22?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80'
  },
  {
    id: 'b2',
    type: 'experience',
    title: 'Forest Hike & Meditation',
    date: '2023-07-05',
    time: '10:00 AM',
    participants: 1,
    status: 'completed',
    totalAmount: 89,
    imageUrl: 'https://images.unsplash.com/photo-1649972904349-6e44c42644a7?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80'
  },
  {
    id: 'b3',
    type: 'stay',
    title: 'Container Home Stay',
    startDate: '2023-08-20',
    endDate: '2023-08-25',
    guests: 2,
    status: 'upcoming',
    totalAmount: 1245,
    imageUrl: 'https://images.unsplash.com/photo-1500673922987-e212871fec22?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80'
  }
];

const Dashboard = () => {
  const { user, profile, signOut, refreshProfile } = useAuth();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isUpdating, setIsUpdating] = useState(false);
  const [isUpdatingPassword, setIsUpdatingPassword] = useState(false);
  const { toast } = useToast();

  // Initialize form with profile data
  useEffect(() => {
    if (profile) {
      setName(profile.full_name || '');
      setEmail(profile.email || '');
      setPhone(profile.phone_number || '');
    }
  }, [profile]);

  const handleProfileUpdate = async (e: React.FormEvent) => {
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
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "An error occurred while updating your profile.",
        variant: "destructive"
      });
    } finally {
      setIsUpdating(false);
    }
  };

  const handlePasswordChange = async (e: React.FormEvent) => {
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
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "An error occurred while changing your password.",
        variant: "destructive"
      });
    } finally {
      setIsUpdatingPassword(false);
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'completed':
        return <Badge variant="secondary">Completed</Badge>;
      case 'upcoming':
        return <Badge className="bg-haven-green">Upcoming</Badge>;
      case 'cancelled':
        return <Badge variant="destructive">Cancelled</Badge>;
      default:
        return <Badge variant="outline">Unknown</Badge>;
    }
  };

  const formatDate = (dateString: string) => {
    const options: Intl.DateTimeFormatOptions = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  if (!user || !profile) {
    return (
      <>
        <Navbar />
        <main className="py-16 bg-haven-beige bg-opacity-10 min-h-screen">
          <div className="container-custom">
            <div className="text-center">
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
                  {profile.full_name?.split(' ').map((n: string) => n[0]).join('') || user.email?.[0].toUpperCase()}
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
              <div className="mb-8">
                <h2 className="font-serif text-2xl font-bold mb-4">Your Bookings</h2>
                
                {bookingsData.length === 0 ? (
                  <Card>
                    <CardContent className="py-8 text-center">
                      <p className="text-gray-600 mb-4">You don't have any bookings yet.</p>
                      <div className="flex justify-center gap-4">
                        <Link to="/stay">
                          <Button className="btn-primary">Book a Stay</Button>
                        </Link>
                        <Link to="/experiences">
                          <Button variant="outline">Explore Experiences</Button>
                        </Link>
                      </div>
                    </CardContent>
                  </Card>
                ) : (
                  <div className="space-y-6">
                    {bookingsData.map((booking) => (
                      <Card key={booking.id} className="overflow-hidden">
                        <div className="flex flex-col md:flex-row">
                          <div className="w-full md:w-1/4">
                            <img 
                              src={booking.imageUrl} 
                              alt={booking.title} 
                              className="w-full h-48 md:h-full object-cover"
                            />
                          </div>
                          <div className="flex-1 p-6">
                            <div className="flex flex-col md:flex-row md:items-start md:justify-between mb-4">
                              <div>
                                <div className="flex items-center gap-2 mb-1">
                                  <h3 className="font-serif text-xl font-semibold">{booking.title}</h3>
                                  {getStatusBadge(booking.status)}
                                </div>
                                {booking.type === 'stay' ? (
                                  <p className="text-gray-600">
                                    {formatDate(booking.startDate)} to {formatDate(booking.endDate)} · {booking.guests} {booking.guests === 1 ? 'guest' : 'guests'}
                                  </p>
                                ) : (
                                  <p className="text-gray-600">
                                    {formatDate(booking.date)} at {booking.time} · {booking.participants} {booking.participants === 1 ? 'participant' : 'participants'}
                                  </p>
                                )}
                              </div>
                              <div className="mt-4 md:mt-0 text-right">
                                <p className="font-bold text-lg">${booking.totalAmount}</p>
                                <p className="text-sm text-gray-600">Total amount</p>
                              </div>
                            </div>
                            
                            <div className="flex flex-wrap gap-2 mt-4">
                              {booking.status === 'upcoming' && (
                                <>
                                  <Button variant="outline" size="sm">Manage Booking</Button>
                                  <Button variant="destructive" size="sm">Cancel</Button>
                                </>
                              )}
                              {booking.status === 'completed' && (
                                <Button variant="outline" size="sm">Write a Review</Button>
                              )}
                              <Button variant="ghost" size="sm">View Details</Button>
                            </div>
                          </div>
                        </div>
                      </Card>
                    ))}
                  </div>
                )}
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
                      className="btn-primary"
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
                        className="btn-primary"
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
