import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { Loader2, Heart, ArrowLeft, AlertCircle } from 'lucide-react';
import { useNavigate, useLocation, Link } from 'react-router-dom';

const AuthForm = () => {
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [loading, setLoading] = useState(false);
  const [authError, setAuthError] = useState<string | null>(null);
  
  const { login, register, isAuthenticated } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  const location = useLocation();

  // Get the intended destination from location state
  const from = location.state?.from?.pathname || '/dashboard';

  // Redirect if already authenticated
  useEffect(() => {
    if (isAuthenticated) {
      navigate(from, { replace: true });
    }
  }, [isAuthenticated, navigate, from]);

  // Clear error when switching between sign in/up
  useEffect(() => {
    setAuthError(null);
  }, [isSignUp]);

  // Clear error when user starts typing
  const handleInputChange = (setter: (value: string) => void) => (e: React.ChangeEvent<HTMLInputElement>) => {
    setter(e.target.value);
    if (authError) {
      setAuthError(null);
    }
  };

  const getErrorMessage = (error: Error): string => {
    const message = error.message.toLowerCase();
    
    if (message.includes('invalid login credentials') || message.includes('invalid_credentials')) {
      return isSignUp 
        ? 'Unable to create account. Please check your email and password.'
        : 'Invalid email or password. Please check your credentials and try again.';
    }
    
    if (message.includes('email not confirmed')) {
      return 'Please check your email and click the confirmation link before signing in.';
    }
    
    if (message.includes('user not found')) {
      return 'No account found with this email address. Please sign up first.';
    }
    
    if (message.includes('too many requests')) {
      return 'Too many login attempts. Please wait a few minutes before trying again.';
    }
    
    if (message.includes('weak password')) {
      return 'Password is too weak. Please choose a stronger password.';
    }
    
    if (message.includes('email already registered') || message.includes('user already registered')) {
      return 'An account with this email already exists. Please sign in instead.';
    }
    
    // Return the original error message if we don't have a specific handler
    return error.message;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setAuthError(null);

    try {
      if (isSignUp) {
        await register(email, password, name);
        toast({
          title: 'Account Created',
          description: 'Welcome to Mental Weather! Your account has been created successfully.',
        });
      } else {
        await login(email, password);
        toast({
          title: 'Welcome Back!',
          description: 'You have successfully signed in to your account.',
        });
      }
      
      // Navigate to intended destination
      navigate(from, { replace: true });
      
    } catch (error) {
      const errorMessage = getErrorMessage(error as Error);
      setAuthError(errorMessage);
      
      toast({
        title: 'Authentication Error',
        description: errorMessage,
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Back to Welcome Button */}
        <div className="mb-6">
          <Link to="/welcome">
            <Button variant="ghost" size="sm" className="text-slate-600 hover:text-slate-900">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Welcome
            </Button>
          </Link>
        </div>

        <Card className="shadow-2xl border-0 bg-white/90 backdrop-blur-sm">
          <CardHeader className="text-center pb-6">
            <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <Heart className="w-8 h-8 text-white" />
            </div>
            <CardTitle className="text-2xl font-bold text-slate-900">
              {isSignUp ? 'Create Your Account' : 'Welcome Back'}
            </CardTitle>
            <CardDescription className="text-slate-600">
              {isSignUp 
                ? 'Start your journey to understanding your mental weather'
                : 'Sign in to continue tracking your emotional patterns'
              }
            </CardDescription>
          </CardHeader>
          
          <CardContent>
            {/* Error Display */}
            {authError && (
              <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg flex items-start space-x-2">
                <AlertCircle className="w-5 h-5 text-red-500 mt-0.5 flex-shrink-0" />
                <div className="text-sm text-red-700">
                  {authError}
                  {authError.includes('Invalid email or password') && (
                    <div className="mt-2 text-xs">
                      <p>Don't have an account yet? 
                        <button
                          type="button"
                          onClick={() => setIsSignUp(true)}
                          className="ml-1 text-blue-600 hover:text-blue-700 underline"
                        >
                          Sign up here
                        </button>
                      </p>
                    </div>
                  )}
                </div>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              {isSignUp && (
                <div className="space-y-2">
                  <Label htmlFor="name">Name (Optional)</Label>
                  <Input
                    id="name"
                    type="text"
                    value={name}
                    onChange={handleInputChange(setName)}
                    placeholder="Enter your name"
                    className="h-11"
                  />
                </div>
              )}
              
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={handleInputChange(setEmail)}
                  placeholder="Enter your email"
                  required
                  className="h-11"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={handleInputChange(setPassword)}
                  placeholder="Enter your password"
                  required
                  minLength={6}
                  className="h-11"
                />
                {isSignUp && (
                  <p className="text-xs text-slate-500">
                    Password must be at least 6 characters long
                  </p>
                )}
              </div>
              
              <Button 
                type="submit" 
                className="w-full h-11 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold"
                disabled={loading}
              >
                {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                {isSignUp ? 'Create Account' : 'Sign In'}
              </Button>
            </form>
            
            <div className="mt-6 text-center">
              <button
                type="button"
                onClick={() => {
                  setIsSignUp(!isSignUp);
                  setAuthError(null);
                }}
                className="text-sm text-blue-600 hover:text-blue-700 font-medium"
              >
                {isSignUp 
                  ? 'Already have an account? Sign in'
                  : "Don't have an account? Sign up"
                }
              </button>
            </div>
            
            {/* Helpful Tips */}
            {!isSignUp && (
              <div className="mt-4 p-3 bg-blue-50 rounded-lg">
                <p className="text-xs text-blue-700 text-center">
                  <strong>First time here?</strong> You'll need to create an account first.
                </p>
              </div>
            )}
            
            {isSignUp && (
              <div className="mt-4 p-3 bg-blue-50 rounded-lg">
                <p className="text-xs text-blue-700 text-center">
                  By creating an account, you agree to our{' '}
                  <Link to="/terms-of-service" className="underline hover:no-underline">
                    Terms of Service
                  </Link>{' '}
                  and{' '}
                  <Link to="/privacy-policy" className="underline hover:no-underline">
                    Privacy Policy
                  </Link>
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AuthForm;