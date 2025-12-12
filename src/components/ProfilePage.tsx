import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import Icon from '@/components/ui/icon';

interface Order {
  id: number;
  date: string;
  status: 'delivered' | 'shipping' | 'processing' | 'cancelled';
  items: { name: string; quantity: number; price: number; image: string }[];
  total: number;
}

interface Review {
  id: number;
  productName: string;
  rating: number;
  comment: string;
  date: string;
  image: string;
}

interface Product {
  id: number;
  name: string;
  price: number;
  category: string;
  description: string;
  image: string;
}

interface ProfilePageProps {
  onBack: () => void;
  onLogout: () => void;
  userData?: { name: string; email: string; phone: string };
}

export const ProfilePage = ({ onBack, onLogout, userData }: ProfilePageProps) => {
  const savedUsers = JSON.parse(localStorage.getItem('marketplace_users') || '[]');
  const currentUserData = userData ? savedUsers.find((u: any) => u.email === userData.email) : null;
  
  const [user, setUser] = useState({
    name: userData?.name || 'Пользователь',
    email: userData?.email || 'user@example.com',
    phone: userData?.phone || '+7 (999) 123-45-67',
    address: currentUserData?.address || 'Не указан',
  });

  const [myProducts, setMyProducts] = useState<Product[]>([]);
  const [isAddProductOpen, setIsAddProductOpen] = useState(false);
  const [newProduct, setNewProduct] = useState({
    name: '',
    price: '',
    category: 'electronics',
    description: '',
    image: '📦'
  });

  const emojiOptions = ['📦', '🎧', '⌚', '🧥', '👟', '🍳', '💄', '🖱️', '🧘', '💻', '📱', '🎮', '📷', '🎨', '📚', '⚽', '🎸', '🏀'];

  const orders: Order[] = [];
  const reviews: Review[] = [];

  const handleAddProduct = () => {
    if (!newProduct.name || !newProduct.price) {
      alert('Заполните название и цену товара');
      return;
    }

    const product: Product = {
      id: Date.now(),
      name: newProduct.name,
      price: parseFloat(newProduct.price),
      category: newProduct.category,
      description: newProduct.description,
      image: newProduct.image
    };

    setMyProducts([...myProducts, product]);
    setNewProduct({
      name: '',
      price: '',
      category: 'electronics',
      description: '',
      image: '📦'
    });
    setIsAddProductOpen(false);
  };

  const handleDeleteProduct = (id: number) => {
    setMyProducts(myProducts.filter(p => p.id !== id));
  };

  const getStatusInfo = (status: Order['status']) => {
    switch (status) {
      case 'delivered':
        return { label: 'Доставлен', color: 'bg-green-500', icon: 'CheckCircle2' };
      case 'shipping':
        return { label: 'В пути', color: 'bg-blue-500', icon: 'Truck' };
      case 'processing':
        return { label: 'Обрабатывается', color: 'bg-yellow-500', icon: 'Clock' };
      case 'cancelled':
        return { label: 'Отменён', color: 'bg-red-500', icon: 'XCircle' };
    }
  };

  const totalSpent = orders.filter(o => o.status === 'delivered').reduce((sum, o) => sum + o.total, 0);
  const totalOrders = orders.length;
  const completedOrders = orders.filter(o => o.status === 'delivered').length;

  const handleLogoutClick = () => {
    if (confirm('Вы уверены, что хотите выйти из аккаунта?')) {
      onLogout();
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-orange-50">
      <header className="bg-white/80 backdrop-blur-md border-b shadow-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" onClick={onBack}>
              <Icon name="ArrowLeft" size={20} />
            </Button>
            <h1 className="text-2xl font-bold">Личный кабинет</h1>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <div className="grid lg:grid-cols-12 gap-6">
          <div className="lg:col-span-4">
            <Card className="animate-fade-in">
              <CardContent className="p-6">
                <div className="flex flex-col items-center text-center">
                  <Avatar className="w-24 h-24 mb-4 bg-gradient-to-br from-primary to-secondary">
                    <AvatarFallback className="text-3xl text-white">АС</AvatarFallback>
                  </Avatar>
                  <h2 className="text-2xl font-bold mb-1">{user.name}</h2>
                  <p className="text-muted-foreground mb-4">{user.email}</p>
                  
                  <div className="grid grid-cols-3 gap-4 w-full mt-4">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-primary">{totalOrders}</div>
                      <div className="text-xs text-muted-foreground">Заказов</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-secondary">{reviews.length}</div>
                      <div className="text-xs text-muted-foreground">Отзывов</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-accent">{myProducts.length}</div>
                      <div className="text-xs text-muted-foreground">Товаров</div>
                    </div>
                  </div>

                  <Separator className="my-6" />

                  <div className="w-full space-y-2">
                    <div className="flex items-center gap-2 text-sm">
                      <Icon name="Phone" size={16} className="text-muted-foreground" />
                      <span>{user.phone}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <Icon name="MapPin" size={16} className="text-muted-foreground" />
                      <span className="text-left">{user.address}</span>
                    </div>
                  </div>

                  <Card className="w-full mt-6 bg-gradient-to-r from-primary/10 to-secondary/10 border-primary/20">
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <div className="text-xs text-muted-foreground">Всего потрачено</div>
                          <div className="text-2xl font-bold text-primary">
                            {totalSpent.toLocaleString()} ₽
                          </div>
                        </div>
                        <Icon name="TrendingUp" size={32} className="text-primary" />
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="lg:col-span-8">
            <Tabs defaultValue="products" className="animate-slide-up">
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="products" className="gap-2">
                  <Icon name="Package" size={16} />
                  Мои товары
                </TabsTrigger>
                <TabsTrigger value="orders" className="gap-2">
                  <Icon name="ShoppingBag" size={16} />
                  Заказы
                </TabsTrigger>
                <TabsTrigger value="reviews" className="gap-2">
                  <Icon name="Star" size={16} />
                  Отзывы
                </TabsTrigger>
                <TabsTrigger value="settings" className="gap-2">
                  <Icon name="Settings" size={16} />
                  Настройки
                </TabsTrigger>
              </TabsList>

              <TabsContent value="products" className="mt-6">
                <div className="mb-4">
                  <Dialog open={isAddProductOpen} onOpenChange={setIsAddProductOpen}>
                    <DialogTrigger asChild>
                      <Button className="w-full gap-2" size="lg">
                        <Icon name="Plus" size={20} />
                        Добавить товар
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-2xl">
                      <DialogHeader>
                        <DialogTitle>Добавить новый товар</DialogTitle>
                      </DialogHeader>
                      <div className="space-y-4 mt-4">
                        <div className="space-y-2">
                          <Label htmlFor="productName">Название товара</Label>
                          <Input
                            id="productName"
                            placeholder="Например: Умные часы"
                            value={newProduct.name}
                            onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })}
                          />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <Label htmlFor="productPrice">Цена (₽)</Label>
                            <Input
                              id="productPrice"
                              type="number"
                              placeholder="5990"
                              value={newProduct.price}
                              onChange={(e) => setNewProduct({ ...newProduct, price: e.target.value })}
                            />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="productCategory">Категория</Label>
                            <Select 
                              value={newProduct.category} 
                              onValueChange={(value) => setNewProduct({ ...newProduct, category: value })}
                            >
                              <SelectTrigger id="productCategory">
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="electronics">Электроника</SelectItem>
                                <SelectItem value="fashion">Одежда</SelectItem>
                                <SelectItem value="home">Для дома</SelectItem>
                                <SelectItem value="beauty">Красота</SelectItem>
                                <SelectItem value="sports">Спорт</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                        </div>
                        <div className="space-y-2">
                          <Label>Выберите иконку</Label>
                          <div className="grid grid-cols-9 gap-2">
                            {emojiOptions.map((emoji) => (
                              <Button
                                key={emoji}
                                variant={newProduct.image === emoji ? 'default' : 'outline'}
                                className="text-2xl h-12"
                                onClick={() => setNewProduct({ ...newProduct, image: emoji })}
                              >
                                {emoji}
                              </Button>
                            ))}
                          </div>
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="productDesc">Описание</Label>
                          <Textarea
                            id="productDesc"
                            placeholder="Опишите ваш товар..."
                            rows={4}
                            value={newProduct.description}
                            onChange={(e) => setNewProduct({ ...newProduct, description: e.target.value })}
                          />
                        </div>
                        <Button onClick={handleAddProduct} className="w-full" size="lg">
                          <Icon name="Check" size={20} className="mr-2" />
                          Добавить товар
                        </Button>
                      </div>
                    </DialogContent>
                  </Dialog>
                </div>

                <ScrollArea className="h-[500px]">
                  {myProducts.length === 0 ? (
                    <div className="text-center py-20 text-muted-foreground">
                      <div className="text-8xl mb-4">📦</div>
                      <p className="text-lg">У вас пока нет товаров</p>
                      <p className="text-sm">Нажмите кнопку выше, чтобы добавить первый</p>
                    </div>
                  ) : (
                    <div className="grid md:grid-cols-2 gap-4 pr-4">
                      {myProducts.map((product) => (
                        <Card key={product.id} className="hover:shadow-lg transition-all">
                          <CardContent className="p-6">
                            <div className="flex gap-4">
                              <div className="text-6xl">{product.image}</div>
                              <div className="flex-1">
                                <h3 className="font-semibold text-lg mb-1">{product.name}</h3>
                                <p className="text-2xl font-bold text-primary mb-2">
                                  {product.price.toLocaleString()} ₽
                                </p>
                                <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
                                  {product.description || 'Без описания'}
                                </p>
                                <Button 
                                  variant="destructive" 
                                  size="sm" 
                                  className="w-full gap-2"
                                  onClick={() => handleDeleteProduct(product.id)}
                                >
                                  <Icon name="Trash2" size={14} />
                                  Удалить
                                </Button>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  )}
                </ScrollArea>
              </TabsContent>

              <TabsContent value="orders" className="mt-6">
                <ScrollArea className="h-[600px]">
                  {orders.length === 0 ? (
                    <div className="text-center py-20 text-muted-foreground">
                      <div className="text-8xl mb-4">📦</div>
                      <p className="text-lg">У вас пока нет заказов</p>
                      <p className="text-sm">Заказы появятся здесь после оформления покупок</p>
                    </div>
                  ) : (
                    <div className="space-y-4 pr-4">
                      {orders.map((order) => {
                      const statusInfo = getStatusInfo(order.status);
                      return (
                        <Card key={order.id} className="hover:shadow-lg transition-all">
                          <CardHeader>
                            <div className="flex items-start justify-between">
                              <div>
                                <CardTitle className="text-lg">Заказ #{order.id}</CardTitle>
                                <p className="text-sm text-muted-foreground mt-1">{order.date}</p>
                              </div>
                              <Badge className={`${statusInfo.color} text-white gap-1`}>
                                <Icon name={statusInfo.icon as any} size={14} />
                                {statusInfo.label}
                              </Badge>
                            </div>
                          </CardHeader>
                          <CardContent>
                            <div className="space-y-3">
                              {order.items.map((item, idx) => (
                                <div key={idx} className="flex items-center gap-3">
                                  <div className="text-3xl">{item.image}</div>
                                  <div className="flex-1">
                                    <p className="font-medium">{item.name}</p>
                                    <p className="text-sm text-muted-foreground">
                                      {item.quantity} шт. × {item.price.toLocaleString()} ₽
                                    </p>
                                  </div>
                                </div>
                              ))}
                              <Separator />
                              <div className="flex items-center justify-between">
                                <span className="font-semibold">Итого:</span>
                                <span className="text-xl font-bold text-primary">
                                  {order.total.toLocaleString()} ₽
                                </span>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      );
                    })}
                    </div>
                  )}
                </ScrollArea>
              </TabsContent>

              <TabsContent value="reviews" className="mt-6">
                <ScrollArea className="h-[600px]">
                  {reviews.length === 0 ? (
                    <div className="text-center py-20 text-muted-foreground">
                      <div className="text-8xl mb-4">⭐</div>
                      <p className="text-lg">У вас пока нет отзывов</p>
                      <p className="text-sm">Оставляйте отзывы на купленные товары</p>
                    </div>
                  ) : (
                    <div className="space-y-4 pr-4">
                      {reviews.map((review) => (
                      <Card key={review.id} className="hover:shadow-lg transition-all">
                        <CardContent className="p-6">
                          <div className="flex items-start gap-4">
                            <div className="text-5xl">{review.image}</div>
                            <div className="flex-1">
                              <div className="flex items-start justify-between mb-2">
                                <div>
                                  <h3 className="font-semibold">{review.productName}</h3>
                                  <p className="text-sm text-muted-foreground">{review.date}</p>
                                </div>
                                <div className="flex gap-1">
                                  {[...Array(5)].map((_, i) => (
                                    <Icon
                                      key={i}
                                      name="Star"
                                      size={16}
                                      className={i < review.rating ? 'text-yellow-500 fill-yellow-500' : 'text-gray-300'}
                                    />
                                  ))}
                                </div>
                              </div>
                              <p className="text-sm leading-relaxed">{review.comment}</p>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                      ))}
                    </div>
                  )}
                </ScrollArea>
              </TabsContent>

              <TabsContent value="settings" className="mt-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Настройки профиля</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="space-y-2">
                      <Label htmlFor="name">Имя</Label>
                      <Input
                        id="name"
                        value={user.name}
                        onChange={(e) => setUser({ ...user, name: e.target.value })}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="email">Email</Label>
                      <Input
                        id="email"
                        type="email"
                        value={user.email}
                        onChange={(e) => setUser({ ...user, email: e.target.value })}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="phone">Телефон</Label>
                      <Input
                        id="phone"
                        value={user.phone}
                        onChange={(e) => setUser({ ...user, phone: e.target.value })}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="address">Адрес доставки</Label>
                      <Input
                        id="address"
                        value={user.address}
                        onChange={(e) => setUser({ ...user, address: e.target.value })}
                      />
                    </div>
                    <Separator />
                    <div className="space-y-3">
                      <Button className="w-full gap-2">
                        <Icon name="Save" size={16} />
                        Сохранить изменения
                      </Button>
                      <Button variant="outline" className="w-full gap-2">
                        <Icon name="Lock" size={16} />
                        Изменить пароль
                      </Button>
                      <Button 
                        variant="outline" 
                        className="w-full gap-2 text-red-600 hover:text-red-700 hover:bg-red-50"
                        onClick={handleLogoutClick}
                      >
                        <Icon name="LogOut" size={16} />
                        Выйти из аккаунта
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </main>
    </div>
  );
};