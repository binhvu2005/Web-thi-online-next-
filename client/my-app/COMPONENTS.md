# UI Components Documentation

## Tổng quan
Dự án đã được cải thiện với các component UI hiện đại, sử dụng Framer Motion cho animation và Tailwind CSS cho styling.

## Các Component đã tạo

### 1. Button
Component button hiện đại với nhiều variant và animation.

```tsx
import { Button } from '@/app/components/ui';

<Button variant="primary" size="md" loading={false}>
  Click me
</Button>
```

**Props:**
- `variant`: 'primary' | 'secondary' | 'outline' | 'ghost' | 'destructive'
- `size`: 'sm' | 'md' | 'lg' | 'xl'
- `loading`: boolean
- `icon`: React.ReactNode
- `iconPosition`: 'left' | 'right'
- `fullWidth`: boolean

### 2. Input
Component input với label, error handling và icon.

```tsx
import { Input } from '@/app/components/ui';

<Input
  label="Email"
  placeholder="Nhập email của bạn"
  error="Email không hợp lệ"
  icon={<Mail className="w-5 h-5" />}
/>
```

### 3. Card
Component card với nhiều variant và animation.

```tsx
import { Card, CardHeader, CardTitle, CardContent } from '@/app/components/ui';

<Card variant="elevated" hover={true}>
  <CardHeader>
    <CardTitle>Tiêu đề</CardTitle>
  </CardHeader>
  <CardContent>
    Nội dung card
  </CardContent>
</Card>
```

### 4. Modal
Component modal với animation và các tính năng hiện đại.

```tsx
import { Modal, ConfirmModal } from '@/app/components/ui';

<Modal isOpen={isOpen} onClose={onClose} title="Tiêu đề">
  Nội dung modal
</Modal>

<ConfirmModal
  isOpen={isOpen}
  onClose={onClose}
  onConfirm={handleConfirm}
  title="Xác nhận"
  message="Bạn có chắc chắn muốn xóa?"
/>
```

### 5. Loading
Component loading với nhiều kiểu hiển thị.

```tsx
import { Loading, PulseLoading, Skeleton } from '@/app/components/ui';

<Loading size="lg" text="Đang tải..." fullScreen={true} />
<PulseLoading count={3} />
<Skeleton lines={3} />
```

### 6. Toast
Hệ thống thông báo với animation.

```tsx
import { useToastNotifications } from '@/app/components/ui';

const { success, error, warning, info } = useToastNotifications();

success("Thành công!", "Dữ liệu đã được lưu");
error("Lỗi!", "Có lỗi xảy ra");
```

### 7. Header
Header hiện đại với search, navigation và user menu.

```tsx
import { Header } from '@/app/components/ui';

<Header 
  user={user} 
  isLoggedIn={isLoggedIn} 
  onLogout={handleLogout}
/>
```

### 8. Footer
Footer với thông tin công ty và links.

```tsx
import { Footer } from '@/app/components/ui';

<Footer />
```

### 9. HeroBanner
Banner chính với animation và stats.

```tsx
import { HeroBanner } from '@/app/components/ui';

<HeroBanner />
```

### 10. ExamCard
Card hiển thị đề thi với animation.

```tsx
import { ExamCard } from '@/app/components/ui';

<ExamCard exam={exam} index={index} />
```

## Cải thiện đã thực hiện

### 1. Giao diện
- ✅ Thiết kế hiện đại với gradient và shadow
- ✅ Responsive design cho mọi thiết bị
- ✅ Color scheme nhất quán với amber/yellow theme
- ✅ Typography cải thiện với Inter font

### 2. Animation
- ✅ Framer Motion cho animation mượt mà
- ✅ Hover effects và micro-interactions
- ✅ Loading animations
- ✅ Page transitions
- ✅ Scroll animations

### 3. Code Quality
- ✅ TypeScript với type safety
- ✅ Component composition
- ✅ Custom hooks
- ✅ Error boundaries
- ✅ Clean code practices

### 4. Performance
- ✅ Lazy loading
- ✅ Optimized animations
- ✅ Efficient re-renders
- ✅ Bundle optimization

## Cách sử dụng

1. Import component cần thiết:
```tsx
import { Button, Input, Card } from '@/app/components/ui';
```

2. Sử dụng với props phù hợp:
```tsx
<Button variant="primary" size="lg" loading={isLoading}>
  Submit
</Button>
```

3. Kết hợp với animation:
```tsx
<motion.div
  initial={{ opacity: 0, y: 20 }}
  animate={{ opacity: 1, y: 0 }}
  transition={{ duration: 0.5 }}
>
  <Card>Content</Card>
</motion.div>
```

## Lưu ý
- Tất cả component đều hỗ trợ dark mode
- Animation được tối ưu cho performance
- Responsive design cho mobile và desktop
- Accessibility features được tích hợp
