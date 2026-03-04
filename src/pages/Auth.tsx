import React, { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Quote, Eye, EyeOff } from 'lucide-react';
import { toast } from 'sonner';

const Auth = () => {
  const { signIn, signUp, resetPassword, user, loading } = useAuth();
  const navigate = useNavigate();
  
  const [isSignIn, setIsSignIn] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPasswordReset, setShowPasswordReset] = useState(false);
  const [resetEmail, setResetEmail] = useState('');

  // Redirect if already authenticated
  useEffect(() => {
    if (user && !loading) {
      navigate('/');
    }
  }, [user, loading, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      if (isSignIn) {
        const { error, locked } = await signIn(email, password);
        if (error) {
          if (locked) {
            toast.error('Account locked due to multiple failed attempts. Please reset your password.');
            setShowPasswordReset(true);
            setResetEmail(email);
          } else if (error.message.includes('Invalid login credentials')) {
            toast.error('Invalid email or password. Please try again.');
          } else {
            toast.error(error.message);
          }
        } else {
          toast.success('Welcome back!');
          navigate('/');
        }
      } else {
        const { error } = await signUp(email, password, firstName, lastName);
        if (error) {
          if (error.message.includes('User already registered')) {
            toast.error('An account with this email already exists. Redirecting to password reset...');
            setShowPasswordReset(true);
            setResetEmail(email);
          } else {
            toast.error(error.message);
          }
        } else {
          toast.success('Account created successfully! Please check your email to verify your account.');
        }
      }
    } catch (error) {
      toast.error('Something went wrong. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handlePasswordReset = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const { error } = await resetPassword(resetEmail);
      if (error) {
        toast.error(error.message);
      } else {
        toast.success('Password reset email sent! Please check your inbox.');
        setShowPasswordReset(false);
        setResetEmail('');
      }
    } catch (error) {
      toast.error('Something went wrong. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-cover bg-center bg-no-repeat flex items-center justify-center" 
           style={{backgroundImage: 'url(/lovable-uploads/2ea333df-496d-43e9-a20e-9f2c751e0397.png)'}}>
        <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/30 to-black/50"></div>
        <div className="relative z-10 text-white text-xl">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-cover bg-center bg-no-repeat flex items-center justify-center p-4" 
         style={{backgroundImage: 'url(/lovable-uploads/2ea333df-496d-43e9-a20e-9f2c751e0397.png)'}}>
      {/* Overlay for better readability */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/30 to-black/50"></div>
      
      <div className="relative z-10 w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 mx-auto bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center shadow-elegant border border-white/30 mb-4">
            <Quote className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-white mb-2 font-serif drop-shadow-lg">
            Her Story Collective
          </h1>
          <p className="text-white/90 drop-shadow-md">Where every woman's story blooms</p>
        </div>

        {/* Auth Form */}
        <Card className="backdrop-blur-md bg-white/10 border border-white/20 shadow-2xl">
          <CardHeader className="text-center">
            <CardTitle className="text-white text-xl">
              {showPasswordReset ? 'Reset Password' : (isSignIn ? 'Welcome Back' : 'Join Our Community')}
            </CardTitle>
            <CardDescription className="text-white/80">
              {showPasswordReset 
                ? 'Enter your email to receive reset instructions'
                : (isSignIn 
                  ? 'Sign in to continue your journey' 
                  : 'Start sharing your story today'
                )
              }
            </CardDescription>
          </CardHeader>
          
          <CardContent>
            {showPasswordReset ? (
              <form onSubmit={handlePasswordReset} className="space-y-4 mt-4">
                <div className="space-y-2">
                  <Label htmlFor="resetEmail" className="text-white">Email</Label>
                  <Input
                    id="resetEmail"
                    type="email"
                    placeholder="Enter your email address"
                    value={resetEmail}
                    onChange={(e) => setResetEmail(e.target.value)}
                    className="bg-white/10 border-white/20 text-white placeholder:text-white/60 focus:border-white/50"
                    required
                  />
                </div>
                
                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-gradient-button text-white hover:shadow-glow transition-all duration-300"
                >
                  {isSubmitting ? 'Sending Reset Email...' : 'Send Reset Email'}
                </Button>
                
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    setShowPasswordReset(false);
                    setResetEmail('');
                  }}
                  className="w-full bg-white/10 border-white/20 text-white hover:bg-white/20"
                >
                  Back to Sign In
                </Button>
              </form>
            ) : (
              <Tabs value={isSignIn ? 'signin' : 'signup'} className="w-full">
                <TabsList className="grid w-full grid-cols-2 bg-white/10 border border-white/20">
                  <TabsTrigger 
                    value="signin" 
                    onClick={() => setIsSignIn(true)}
                    className="text-white data-[state=active]:bg-white/20 data-[state=active]:text-white"
                    aria-label="Switch to sign in form"
                  >
                    Sign In
                  </TabsTrigger>
                  <TabsTrigger 
                    value="signup" 
                    onClick={() => setIsSignIn(false)}
                    className="text-white data-[state=active]:bg-white/20 data-[state=active]:text-white"
                    aria-label="Switch to sign up form"
                  >
                    Sign Up
                  </TabsTrigger>
                </TabsList>
                
                <TabsContent value={isSignIn ? 'signin' : 'signup'}>
                  <form onSubmit={handleSubmit} className="space-y-4 mt-4">
                    {!isSignIn && (
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="firstName" className="text-white">First Name</Label>
                          <Input
                            id="firstName"
                            type="text"
                            placeholder="Sarah"
                            value={firstName}
                            onChange={(e) => setFirstName(e.target.value)}
                            className="bg-white/10 border-white/20 text-white placeholder:text-white/60 focus:border-white/50"
                            required
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="lastName" className="text-white">Last Name</Label>
                          <Input
                            id="lastName"
                            type="text"
                            placeholder="Chen"
                            value={lastName}
                            onChange={(e) => setLastName(e.target.value)}
                            className="bg-white/10 border-white/20 text-white placeholder:text-white/60 focus:border-white/50"
                            required
                          />
                        </div>
                      </div>
                    )}
                    
                    <div className="space-y-2">
                      <Label htmlFor="email" className="text-white">Email</Label>
                      <Input
                        id="email"
                        type="email"
                        placeholder="your@email.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="bg-white/10 border-white/20 text-white placeholder:text-white/60 focus:border-white/50"
                        required
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="password" className="text-white">Password</Label>
                      <div className="relative">
                        <Input
                          id="password"
                          type={showPassword ? 'text' : 'password'}
                          placeholder="Enter your password"
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          className="bg-white/10 border-white/20 text-white placeholder:text-white/60 focus:border-white/50 pr-10"
                          required
                          minLength={6}
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-white/60 hover:text-white p-1 min-w-6 min-h-6 flex items-center justify-center"
                          aria-label={showPassword ? "Hide password" : "Show password"}
                        >
                          {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                        </button>
                      </div>
                    </div>
                    
                    <Button
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full bg-gradient-button text-white hover:shadow-glow transition-all duration-300"
                    >
                      {isSubmitting 
                        ? (isSignIn ? 'Signing in...' : 'Creating account...') 
                        : (isSignIn ? 'Sign In' : 'Create Account')
                      }
                    </Button>

                    {isSignIn && (
                      <Button
                        type="button"
                        variant="link"
                        onClick={() => {
                          setShowPasswordReset(true);
                          setResetEmail(email);
                        }}
                        className="w-full text-white/80 hover:text-white"
                      >
                        Forgot your password?
                      </Button>
                    )}
                  </form>
                </TabsContent>
              </Tabs>
            )}
          </CardContent>
        </Card>
        
        <div className="text-center mt-6">
          <p className="text-white/80 text-sm drop-shadow-sm">
            Join thousands of women sharing their stories
          </p>
        </div>
      </div>
    </div>
  );
};

export default Auth;