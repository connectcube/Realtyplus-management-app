import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '../ui/form';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { LockIcon, MailIcon, UserIcon } from 'lucide-react';
import userRegistration from './auth-helpers/register';
import login from './auth-helpers/login';
const loginSchema = z.object({
  email: z.string().email({ message: 'Please enter a valid email address' }),
  password: z.string().min(6, { message: 'Password must be at least 6 characters' }),
  userType: z.enum(['landlord', 'tenant', 'contractor'], {
    required_error: 'Please select a user type',
  }),
});

const registerSchema = z
  .object({
    name: z.string().min(2, { message: 'Name must be at least 2 characters' }),
    email: z.string().email({ message: 'Please enter a valid email address' }),
    password: z.string().min(6, { message: 'Password must be at least 6 characters' }),
    confirmPassword: z.string().min(6, { message: 'Password must be at least 6 characters' }),
    userType: z.enum(['landlord', 'tenant', 'contractor'], {
      required_error: 'Please select a user type',
    }),
  })
  .refine(data => data.password === data.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword'],
  });

type LoginFormValues = z.infer<typeof loginSchema>;
type RegisterFormValues = z.infer<typeof registerSchema>;

const LoginForm = ({ userType }: { userType: 'landlord' | 'tenant' | 'contractor' }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('login');
  const navigate = useNavigate();

  const loginForm = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
      userType,
    },
  });

  const registerForm = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      name: '',
      email: '',
      password: '',
      confirmPassword: '',
      userType,
    },
  });

  const onLoginSubmit = async (values: LoginFormValues) => {
    const loginResult = await login(setIsLoading, values);
    // Simulate API call
    setTimeout(() => {
      setIsLoading(false);
      // Redirect to appropriate dashboard based on user type
      switch (loginResult) {
        case 'landlord':
          navigate('/landlord-dashboard');
          console.log('Landlord login successful:', values);
          break;
        case 'tenant':
          navigate('/tenant-dashboard');
          console.log('Tenant login successful:', values);
          break;
        case 'contractor':
          navigate('/contractor-dashboard');
          console.log('Contractor login successful:', values);
          break;
        default:
          navigate('/tenant-dashboard');
      }
    }, 1500);
  };

  const onRegisterSubmit = async (values: RegisterFormValues) => {
    try {
      const result = await userRegistration(setIsLoading, values, setActiveTab);
      if (result === '/dashboard') {
        // Redirect to the appropriate dashboard based on user type
        switch (values.userType) {
          case 'landlord':
            navigate('/landlord-dashboard');
            break;
          case 'tenant':
            navigate('/tenant-dashboard');
            break;
          case 'contractor':
            navigate('/contractor-dashboard');
            break;
          default:
            navigate('/tenant-dashboard');
        }
      } else if (result === '/login') {
        setActiveTab('login'); // Switch to login tab if that's what was returned
      }
    } catch (error) {
      // Handle error
      console.error('Registration error:', error);
    }
  };

  return (
    <div className="flex justify-center items-center bg-gray-50 min-h-screen">
      <Card className="bg-white shadow-lg rounded-lg w-full max-w-md">
        <CardHeader className="space-y-1">
          <CardTitle className="font-bold text-2xl text-center">RealtyPlus</CardTitle>
          <CardDescription className="text-center">
            Login or create an account to continue
          </CardDescription>
        </CardHeader>
        <Tabs value={activeTab} onValueChange={setActiveTab} className="mx-3 w-[100%-12px]">
          <TabsList className="grid grid-cols-2 w-full">
            <TabsTrigger value="login">Login</TabsTrigger>
            <TabsTrigger value="register">Register</TabsTrigger>
          </TabsList>
          <TabsContent value="login">
            <Form {...loginForm}>
              <form onSubmit={loginForm.handleSubmit(onLoginSubmit)} className="space-y-4 p-6">
                <FormField
                  control={loginForm.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <MailIcon className="top-3 left-3 absolute w-4 h-4 text-gray-400" />
                          <Input placeholder="email@example.com" className="pl-10" {...field} />
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={loginForm.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Password</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <LockIcon className="top-3 left-3 absolute w-4 h-4 text-gray-400" />
                          <Input
                            type="password"
                            placeholder="******"
                            className="pl-10"
                            {...field}
                          />
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button type="submit" className="w-full" disabled={isLoading}>
                  {isLoading ? 'Logging in...' : 'Login'}
                </Button>
              </form>
            </Form>
          </TabsContent>
          <TabsContent value="register">
            <Form {...registerForm}>
              <form
                onSubmit={registerForm.handleSubmit(onRegisterSubmit)}
                className="space-y-4 p-6"
              >
                <FormField
                  control={registerForm.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Full Name</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <UserIcon className="top-3 left-3 absolute w-4 h-4 text-gray-400" />
                          <Input placeholder="John Doe" className="pl-10" {...field} />
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={registerForm.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <MailIcon className="top-3 left-3 absolute w-4 h-4 text-gray-400" />
                          <Input placeholder="email@example.com" className="pl-10" {...field} />
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={registerForm.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Password</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <LockIcon className="top-3 left-3 absolute w-4 h-4 text-gray-400" />
                          <Input
                            type="password"
                            placeholder="******"
                            className="pl-10"
                            {...field}
                          />
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={registerForm.control}
                  name="confirmPassword"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Confirm Password</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <LockIcon className="top-3 left-3 absolute w-4 h-4 text-gray-400" />
                          <Input
                            type="password"
                            placeholder="******"
                            className="pl-10"
                            {...field}
                          />
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={registerForm.control}
                  name="userType"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>I am a</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select user type" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="tenant">Tenant</SelectItem>
                          <SelectItem value="landlord">Landlord</SelectItem>
                          <SelectItem value="contractor">Contractor</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button type="submit" className="w-full" disabled={isLoading}>
                  {isLoading ? 'Creating account...' : 'Create account'}
                </Button>
              </form>
            </Form>
          </TabsContent>
        </Tabs>
        <CardFooter className="flex flex-col space-y-2 p-6 pt-0">
          <div className="text-gray-500 text-xs text-center">
            By continuing, you agree to our Terms of Service and Privacy Policy.
          </div>
        </CardFooter>
      </Card>
    </div>
  );
};

export default LoginForm;
