import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { Loader2, Heart, ArrowLeft } from 'lucide-react';
import { useNavigate, useLocation, Link } from 'react-router-dom';

const AuthForm = () => {
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [loading, setLoading] = useState(false);
  
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

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
      toast({
        title: 'Authentication Error',
        description: error instanceof Error ? error.message : 'An unexpected error occurred.',
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
            <form onSubmit={handleSubmit} className="space-y-4">
              {isSignUp && (
                <div className="space-y-2">
                  <Label htmlFor="name">Name (Optional)</Label>
                  <Input
                    id="name"
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
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
                  onChange={(e) => setEmail(e.target.value)}
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
                  onChange={(e) => setPassword(e.target.value)}
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
                onClick={() => setIsSignUp(!isSignUp)}
                className="text-sm text-blue-600 hover:text-blue-700 font-medium"
              >
                {isSignUp 
                  ? 'Already have an account? Sign in'
                  : "Don't have an account? Sign up"
                }
              </button>
            </div>
            
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