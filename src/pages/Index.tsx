import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { ScrollArea } from '@/components/ui/scroll-area';
import Icon from '@/components/ui/icon';
import { ProfilePage } from '@/components/ProfilePage';
import { AuthPage } from '@/components/AuthPage';

interface Product {
  id: number;
  name: string;
  price: number;
  seller: string;
  rating: number;
  reviews: number;
  category: string;
  image: string;
}

interface CartItem extends Product {
  quantity: number;
}

interface Message {
  id: number;
  sender: string;
  text: string;
  time: string;
  isUser: boolean;
}

const Index = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [currentUser, setCurrentUser] = useState<{ name: string; email: string; phone: string } | null>(null);
  const [showProfile, setShowProfile] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState('all');
  const [cart, setCart] = useState<CartItem[]>([]);
  const [chatOpen, setChatOpen] = useState(false);
  const [products, setProducts] = useState<Product[]>([]);
  const [messages, setMessages] = useState<Message[]>([
    { id: 1, sender: 'Магазин "Электроника+"', text: 'Здравствуйте! Чем могу помочь?', time: '14:23', isUser: false }
  ]);
  const [newMessage, setNewMessage] = useState('');

  useEffect(() => {
    const savedSession = localStorage.getItem('marketplace_session');
    if (savedSession) {
      const userData = JSON.parse(savedSession);
      setCurrentUser(userData);
      setIsLoggedIn(true);
    }
  }, []);

  const categories = [
    { id: 'all', name: 'Все товары', icon: 'Grid3x3' },
    { id: 'electronics', name: 'Электроника', icon: 'Laptop' },
    { id: 'fashion', name: 'Одежда', icon: 'Shirt' },
    { id: 'home', name: 'Для дома', icon: 'Home' },
    { id: 'beauty', name: 'Красота', icon: 'Sparkles' },
    { id: 'sports', name: 'Спорт', icon: 'Dumbbell' },
  ];

  const handleLogout = () => {
    setIsLoggedIn(false);
    setCurrentUser(null);
    setShowProfile(false);
    setCart([]);
    localStorage.removeItem('marketplace_session');
  };

  const handleLogin = (userData: { name: string; email: string; phone: string }) => {
    setCurrentUser(userData);
    setIsLoggedIn(true);
    localStorage.setItem('marketplace_session', JSON.stringify(userData));
  };

  if (!isLoggedIn) {
    return <AuthPage onLogin={handleLogin} />;
  }

  if (showProfile && isLoggedIn) {
    return <ProfilePage onBack={() => setShowProfile(false)} onLogout={handleLogout} userData={currentUser || undefined} />;
  }

  const filteredProducts = products.filter(p => 
    (activeCategory === 'all' || p.category === activeCategory) &&
    p.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const addToCart = (product: Product) => {
    if (!isLoggedIn) {
      alert('Войдите в аккаунт, чтобы добавить товар в корзину');
      return;
    }
    setCart(prev => {
      const existing = prev.find(item => item.id === product.id);
      if (existing) {
        return prev.map(item => 
          item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
        );
      }
      return [...prev, { ...product, quantity: 1 }];
    });
  };

  const removeFromCart = (productId: number) => {
    setCart(prev => prev.filter(item => item.id !== productId));
  };

  const getTotalPrice = () => {
    return cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  };

  const sendMessage = () => {
    if (!newMessage.trim()) return;
    
    setMessages(prev => [...prev, {
      id: prev.length + 1,
      sender: 'Вы',
      text: newMessage,
      time: new Date().toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' }),
      isUser: true
    }]);
    setNewMessage('');
    
    setTimeout(() => {
      setMessages(prev => [...prev, {
        id: prev.length + 1,
        sender: 'Магазин "Электроника+"',
        text: 'Спасибо за ваш вопрос! Менеджер свяжется с вами в ближайшее время.',
        time: new Date().toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' }),
        isUser: false
      }]);
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-orange-50">
      <header className="bg-white/80 backdrop-blur-md border-b sticky top-0 z-50 shadow-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-secondary flex items-center justify-center">
                <Icon name="Store" className="text-white" size={24} />
              </div>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                MarketHub
              </h1>
            </div>
            
            <div className="flex-1 max-w-xl">
              <div className="relative">
                <Icon name="Search" className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={20} />
                <Input
                  placeholder="Найти товары..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 pr-4 h-11 border-2 focus:border-primary"
                />
              </div>
            </div>

            <div className="flex items-center gap-3">
              {isLoggedIn ? (
                <>
                  <Button
                    variant="outline"
                    size="icon"
                    className="relative hover:scale-105 transition-transform"
                    onClick={() => setChatOpen(true)}
                  >
                    <Icon name="MessageCircle" size={20} />
                    <span className="absolute -top-1 -right-1 w-5 h-5 bg-secondary text-white text-xs rounded-full flex items-center justify-center animate-pulse">
                      1
                    </span>
                  </Button>

                  <Sheet>
                    <SheetTrigger asChild>
                      <Button variant="outline" size="icon" className="relative hover:scale-105 transition-transform">
                        <Icon name="ShoppingCart" size={20} />
                        {cart.length > 0 && (
                          <span className="absolute -top-1 -right-1 w-5 h-5 bg-primary text-white text-xs rounded-full flex items-center justify-center">
                            {cart.length}
                          </span>
                        )}
                      </Button>
                    </SheetTrigger>
                    <SheetContent className="w-full sm:max-w-lg">
                      <SheetHeader>
                        <SheetTitle className="text-2xl">Корзина</SheetTitle>
                      </SheetHeader>
                      <div className="mt-6 space-y-4">
                        {cart.length === 0 ? (
                          <div className="text-center py-12 text-muted-foreground">
                            <Icon name="ShoppingBag" size={48} className="mx-auto mb-4 opacity-50" />
                            <p>Корзина пуста</p>
                          </div>
                        ) : (
                          <>
                            <ScrollArea className="h-[400px]">
                              {cart.map(item => (
                                <Card key={item.id} className="mb-3">
                                  <CardContent className="p-4">
                                    <div className="flex items-start gap-3">
                                      <div className="text-4xl">{item.image}</div>
                                      <div className="flex-1">
                                        <h4 className="font-semibold">{item.name}</h4>
                                        <p className="text-sm text-muted-foreground">{item.seller}</p>
                                        <div className="flex items-center justify-between mt-2">
                                          <span className="font-bold text-primary">{item.price.toLocaleString()} ₽</span>
                                          <span className="text-sm text-muted-foreground">x{item.quantity}</span>
                                        </div>
                                      </div>
                                      <Button 
                                        variant="ghost" 
                                        size="icon"
                                        onClick={() => removeFromCart(item.id)}
                                      >
                                        <Icon name="X" size={16} />
                                      </Button>
                                    </div>
                                  </CardContent>
                                </Card>
                              ))}
                            </ScrollArea>
                            <div className="border-t pt-4 space-y-3">
                              <div className="flex justify-between text-lg font-bold">
                                <span>Итого:</span>
                                <span className="text-primary">{getTotalPrice().toLocaleString()} ₽</span>
                              </div>
                              <Button className="w-full h-12 text-lg" size="lg">
                                Оформить заказ
                                <Icon name="ArrowRight" className="ml-2" size={20} />
                              </Button>
                            </div>
                          </>
                        )}
                      </div>
                    </SheetContent>
                  </Sheet>

                  <Button 
                    variant="ghost" 
                    size="icon" 
                    className="hover:scale-105 transition-transform"
                    onClick={() => setShowProfile(true)}
                  >
                    <Icon name="User" size={20} />
                  </Button>
                </>
              ) : null}
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <section className="mb-12 animate-fade-in">
          <div className="bg-gradient-to-r from-primary via-secondary to-accent rounded-3xl p-12 text-white relative overflow-hidden">
            <div className="relative z-10 max-w-2xl">
              <h2 className="text-5xl font-bold mb-4">Добро пожаловать на MarketHub!</h2>
              <p className="text-xl mb-6 text-white/90">
                {isLoggedIn 
                  ? 'Начните продавать свои товары прямо сейчас' 
                  : 'Войдите, чтобы начать покупать и продавать'}
              </p>
              {isLoggedIn && (
                <Button 
                  size="lg" 
                  className="bg-white text-primary hover:bg-white/90 h-12 px-8 text-lg font-semibold"
                  onClick={() => setShowProfile(true)}
                >
                  Добавить товар
                  <Icon name="Plus" className="ml-2" size={20} />
                </Button>
              )}
            </div>
            <div className="absolute right-0 top-0 text-9xl opacity-10">🎁</div>
          </div>
        </section>

        <section className="mb-8">
          <ScrollArea className="w-full">
            <div className="flex gap-3 pb-4">
              {categories.map((cat) => (
                <Button
                  key={cat.id}
                  variant={activeCategory === cat.id ? 'default' : 'outline'}
                  className={`flex items-center gap-2 whitespace-nowrap transition-all ${
                    activeCategory === cat.id ? 'shadow-lg scale-105' : 'hover:scale-105'
                  }`}
                  onClick={() => setActiveCategory(cat.id)}
                >
                  <Icon name={cat.icon as any} size={18} />
                  {cat.name}
                </Button>
              ))}
            </div>
          </ScrollArea>
        </section>

        <section>
          {filteredProducts.length === 0 ? (
            <div className="text-center py-20 animate-fade-in">
              <div className="text-8xl mb-6">📦</div>
              <h3 className="text-2xl font-bold mb-2">Пока нет товаров</h3>
              <p className="text-muted-foreground mb-6">
                {isLoggedIn 
                  ? 'Станьте первым продавцом! Добавьте свой товар.' 
                  : 'Войдите в аккаунт, чтобы видеть товары'}
              </p>
              {isLoggedIn && (
                <Button 
                  size="lg" 
                  onClick={() => setShowProfile(true)}
                  className="gap-2"
                >
                  <Icon name="Plus" size={20} />
                  Добавить первый товар
                </Button>
              )}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {filteredProducts.map((product, index) => (
                <Card 
                  key={product.id} 
                  className="group hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 border-2 hover:border-primary animate-slide-up"
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <CardContent className="p-6">
                    <div className="text-7xl mb-4 text-center group-hover:scale-110 transition-transform">
                      {product.image}
                    </div>
                    <div className="space-y-2">
                      <div className="flex items-start justify-between gap-2">
                        <h3 className="font-semibold text-lg leading-tight">{product.name}</h3>
                        <Badge variant="secondary" className="shrink-0">
                          <Icon name="Star" size={12} className="mr-1" />
                          {product.rating}
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground flex items-center gap-1">
                        <Icon name="Store" size={14} />
                        {product.seller}
                      </p>
                      <div className="flex items-center gap-1 text-sm text-muted-foreground">
                        <Icon name="MessageSquare" size={14} />
                        <span>{product.reviews} отзывов</span>
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter className="p-6 pt-0 flex items-center justify-between gap-3">
                    <span className="text-2xl font-bold text-primary">
                      {product.price.toLocaleString()} ₽
                    </span>
                    <Button 
                      className="gap-2 hover:scale-105 transition-transform"
                      onClick={() => addToCart(product)}
                    >
                      <Icon name="ShoppingCart" size={16} />
                      В корзину
                    </Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
          )}
        </section>
      </main>

      {isLoggedIn && (
        <Sheet open={chatOpen} onOpenChange={setChatOpen}>
          <SheetContent side="right" className="w-full sm:max-w-md">
            <SheetHeader>
              <SheetTitle className="text-2xl">Чат с продавцом</SheetTitle>
            </SheetHeader>
            
            <Tabs defaultValue="chat1" className="mt-6">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="chat1">Электроника+</TabsTrigger>
                <TabsTrigger value="chat2">GadgetStore</TabsTrigger>
                <TabsTrigger value="chat3">SportLife</TabsTrigger>
              </TabsList>
              
              <TabsContent value="chat1" className="mt-4">
                <div className="flex flex-col h-[calc(100vh-250px)]">
                  <ScrollArea className="flex-1 pr-4">
                    <div className="space-y-4">
                      {messages.map((msg) => (
                        <div
                          key={msg.id}
                          className={`flex gap-3 animate-fade-in ${msg.isUser ? 'flex-row-reverse' : ''}`}
                        >
                          <Avatar className={msg.isUser ? 'bg-primary' : 'bg-secondary'}>
                            <AvatarFallback className="text-white">
                              {msg.isUser ? 'Вы' : 'П'}
                            </AvatarFallback>
                          </Avatar>
                          <div className={`flex-1 ${msg.isUser ? 'text-right' : ''}`}>
                            <div className={`inline-block p-3 rounded-2xl ${
                              msg.isUser 
                                ? 'bg-primary text-white rounded-tr-none' 
                                : 'bg-muted rounded-tl-none'
                            }`}>
                              <p className="text-sm">{msg.text}</p>
                            </div>
                            <p className="text-xs text-muted-foreground mt-1">{msg.time}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </ScrollArea>
                  
                  <div className="mt-4 flex gap-2">
                    <Input
                      placeholder="Напишите сообщение..."
                      value={newMessage}
                      onChange={(e) => setNewMessage(e.target.value)}
                      onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
                      className="flex-1"
                    />
                    <Button onClick={sendMessage} size="icon">
                      <Icon name="Send" size={18} />
                    </Button>
                  </div>
                </div>
              </TabsContent>
              
              <TabsContent value="chat2" className="mt-4">
                <div className="text-center py-12 text-muted-foreground">
                  <Icon name="MessageCircle" size={48} className="mx-auto mb-4 opacity-50" />
                  <p>Начните диалог с GadgetStore</p>
                </div>
              </TabsContent>
              
              <TabsContent value="chat3" className="mt-4">
                <div className="text-center py-12 text-muted-foreground">
                  <Icon name="MessageCircle" size={48} className="mx-auto mb-4 opacity-50" />
                  <p>Начните диалог с SportLife</p>
                </div>
              </TabsContent>
            </Tabs>
          </SheetContent>
        </Sheet>
      )}
    </div>
  );
};

export default Index;