import { useAuth } from '@/_core/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { useLocation } from 'wouter';
import { getLoginUrl } from '@/const';

export default function Home() {
  const { user, isAuthenticated } = useAuth();
  const [, setLocation] = useLocation();

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
        <div className="text-center">
          <h1 className="text-5xl font-bold text-gray-900 mb-4">نظام إدارة بيانات الطلاب</h1>
          <p className="text-xl text-gray-600 mb-8">مرحبا بك في نظام إدارة البيانات المتقدم</p>
          <a href={getLoginUrl()}>
            <Button size="lg" className="bg-blue-600 hover:bg-blue-700">
              تسجيل الدخول
            </Button>
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="text-center">
        <h1 className="text-5xl font-bold text-gray-900 mb-4">مرحبا {user?.name}</h1>
        <p className="text-xl text-gray-600 mb-8">اهلا وسهلا في نظام إدارة بيانات الطلاب</p>
        <Button
          size="lg"
          className="bg-blue-600 hover:bg-blue-700"
          onClick={() => setLocation('/dashboard')}
        >
          الذهاب إلى لوحة التحكم
        </Button>
      </div>
    </div>
  );
}
