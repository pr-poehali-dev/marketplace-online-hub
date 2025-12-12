import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import Icon from '@/components/ui/icon';

interface AuthPageProps {
  onLogin: (userData: { name: string; email: string; phone: string }) => void;
}

export const AuthPage = ({ onLogin }: AuthPageProps) => {
  const [loginData, setLoginData] = useState({
    email: '',
    password: ''
  });

  const [registerData, setRegisterData] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: ''
  });

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!loginData.email || !loginData.password) {
      alert('Заполните все поля');
      return;
    }

    const savedUsers = JSON.parse(localStorage.getItem('marketplace_users') || '[]');
    const user = savedUsers.find((u: any) => u.email === loginData.email && u.password === loginData.password);

    if (user) {
      onLogin({
        name: user.name,
        email: user.email,
        phone: user.phone
      });
    } else {
      alert('Неверный email или пароль');
    }
  };

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();

    if (!registerData.name || !registerData.email || !registerData.phone || !registerData.password) {
      alert('Заполните все поля');
      return;
    }

    if (registerData.password !== registerData.confirmPassword) {
      alert('Пароли не совпадают');
      return;
    }

    if (registerData.password.length < 6) {
      alert('Пароль должен быть не менее 6 символов');
      return;
    }

    const savedUsers = JSON.parse(localStorage.getItem('marketplace_users') || '[]');
    
    if (savedUsers.find((u: any) => u.email === registerData.email)) {
      alert('Пользователь с таким email уже существует');
      return;
    }

    const newUser = {
      name: registerData.name,
      email: registerData.email,
      phone: registerData.phone,
      password: registerData.password,
      address: '',
      createdAt: new Date().toISOString()
    };

    savedUsers.push(newUser);
    localStorage.setItem('marketplace_users', JSON.stringify(savedUsers));

    onLogin({
      name: newUser.name,
      email: newUser.email,
      phone: newUser.phone
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-cyan-50 to-sky-50 flex items-center justify-center p-4">
      <div className="w-full max-w-4xl grid md:grid-cols-2 gap-8 items-center">
        <div className="hidden md:block animate-fade-in">
          <div className="text-center space-y-6">
            <div className="w-32 h-32 mx-auto rounded-3xl bg-gradient-to-br from-primary to-secondary flex items-center justify-center shadow-2xl">
              <Icon name="Store" className="text-white" size={64} />
            </div>
            <h1 className="text-5xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              MarketHub
            </h1>
            <p className="text-xl text-muted-foreground">
              Ваша платформа для покупок и продаж
            </p>
            <div className="grid grid-cols-3 gap-4 pt-8">
              <div className="text-center">
                <div className="text-4xl mb-2">🛍️</div>
                <p className="text-sm font-medium">Покупайте</p>
              </div>
              <div className="text-center">
                <div className="text-4xl mb-2">💰</div>
                <p className="text-sm font-medium">Продавайте</p>
              </div>
              <div className="text-center">
                <div className="text-4xl mb-2">💬</div>
                <p className="text-sm font-medium">Общайтесь</p>
              </div>
            </div>
          </div>
        </div>

        <Card className="animate-slide-up shadow-2xl">
          <CardHeader>
            <div className="md:hidden text-center mb-4">
              <div className="w-20 h-20 mx-auto rounded-2xl bg-gradient-to-br from-primary to-secondary flex items-center justify-center mb-3">
                <Icon name="Store" className="text-white" size={40} />
              </div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                MarketHub
              </h1>
            </div>
            <CardTitle>Добро пожаловать!</CardTitle>
            <CardDescription>Войдите или создайте новый аккаунт</CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="login" className="w-full">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="login">Вход</TabsTrigger>
                <TabsTrigger value="register">Регистрация</TabsTrigger>
              </TabsList>

              <TabsContent value="login" className="space-y-4 mt-4">
                <form onSubmit={handleLogin} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="login-email">Email</Label>
                    <Input
                      id="login-email"
                      type="email"
                      placeholder="your@email.com"
                      value={loginData.email}
                      onChange={(e) => setLoginData({ ...loginData, email: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="login-password">Пароль</Label>
                    <Input
                      id="login-password"
                      type="password"
                      placeholder="••••••••"
                      value={loginData.password}
                      onChange={(e) => setLoginData({ ...loginData, password: e.target.value })}
                    />
                  </div>
                  <Button type="submit" className="w-full gap-2" size="lg">
                    <Icon name="LogIn" size={18} />
                    Войти
                  </Button>
                </form>
              </TabsContent>

              <TabsContent value="register" className="space-y-4 mt-4">
                <form onSubmit={handleRegister} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="register-name">Имя и фамилия</Label>
                    <Input
                      id="register-name"
                      placeholder="Анна Смирнова"
                      value={registerData.name}
                      onChange={(e) => setRegisterData({ ...registerData, name: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="register-email">Email</Label>
                    <Input
                      id="register-email"
                      type="email"
                      placeholder="your@email.com"
                      value={registerData.email}
                      onChange={(e) => setRegisterData({ ...registerData, email: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="register-phone">Телефон</Label>
                    <Input
                      id="register-phone"
                      placeholder="+7 (999) 123-45-67"
                      value={registerData.phone}
                      onChange={(e) => setRegisterData({ ...registerData, phone: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="register-password">Пароль</Label>
                    <Input
                      id="register-password"
                      type="password"
                      placeholder="Минимум 6 символов"
                      value={registerData.password}
                      onChange={(e) => setRegisterData({ ...registerData, password: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="register-confirm">Подтвердите пароль</Label>
                    <Input
                      id="register-confirm"
                      type="password"
                      placeholder="Повторите пароль"
                      value={registerData.confirmPassword}
                      onChange={(e) => setRegisterData({ ...registerData, confirmPassword: e.target.value })}
                    />
                  </div>
                  <Button type="submit" className="w-full gap-2" size="lg">
                    <Icon name="UserPlus" size={18} />
                    Создать аккаунт
                  </Button>
                </form>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};