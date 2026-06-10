import { useAuth } from '@/_core/hooks/useAuth';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Users, CheckCircle, XCircle, BarChart3 } from 'lucide-react';
import { trpc } from '@/lib/trpc';

export default function Dashboard() {
  const { user } = useAuth();
  const { data: stats, isLoading } = trpc.students.getStats.useQuery();

  if (isLoading) {
    return (
      <div className="space-y-8">
        <div>
          <h1 className="text-4xl font-bold text-foreground mb-2">لوحة التحكم</h1>
          <p className="text-muted-foreground">جاري التحميل...</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[...Array(4)].map((_, i) => (
            <Skeleton key={i} className="h-32 rounded-lg" />
          ))}
        </div>
      </div>
    );
  }

  const stats_data = stats || { total: 0, byStatus: {} as Record<string, number> };
  const completed = (stats_data.byStatus as any)['مستوفى'] || 0;
  const incomplete = (stats_data.byStatus as any)['غير مستوفى'] || 0;

  const StatCard = ({
    title,
    value,
    icon: Icon,
    color,
  }: {
    title: string;
    value: number;
    icon: React.ReactNode;
    color: string;
  }) => (
    <Card className="hover:shadow-lg transition-shadow">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
        <CardTitle className="text-sm font-medium text-muted-foreground">
          {title}
        </CardTitle>
        <div className={`p-2 rounded-lg ${color}`}>
          {Icon}
        </div>
      </CardHeader>
      <CardContent>
        <div className="text-3xl font-bold text-foreground">{value}</div>
        <p className="text-xs text-muted-foreground mt-1">اجمالي السجلات</p>
      </CardContent>
    </Card>
  );

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-4xl font-bold text-foreground mb-2">لوحة التحكم</h1>
        <p className="text-muted-foreground">مرحبا {user?.name}، اليك ملخص البيانات</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="اجمالي الطلاب"
          value={stats_data.total}
          icon={<Users className="w-5 h-5 text-white" />}
          color="bg-blue-500"
        />
        <StatCard
          title="مستوفى"
          value={completed}
          icon={<CheckCircle className="w-5 h-5 text-white" />}
          color="bg-green-500"
        />
        <StatCard
          title="غير مستوفى"
          value={incomplete}
          icon={<XCircle className="w-5 h-5 text-white" />}
          color="bg-red-500"
        />
        <StatCard
          title="نسبة الاكتمال"
          value={stats_data.total > 0 ? Math.round((completed / stats_data.total) * 100) : 0}
          icon={<BarChart3 className="w-5 h-5 text-white" />}
          color="bg-purple-500"
        />
      </div>

      <Card>
        <CardHeader>
          <CardTitle>ملخص الحالة</CardTitle>
          <CardDescription>توزيع الطلاب حسب حالة الاستيفاء</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">مستوفى</span>
              <div className="flex items-center gap-2">
                <div className="w-32 h-2 bg-muted rounded-full overflow-hidden">
                  <div
                    className="h-full bg-green-500 transition-all"
                    style={{
                      width: `${stats_data.total > 0 ? (completed / stats_data.total) * 100 : 0}%`,
                    }}
                  />
                </div>
                <span className="text-sm font-semibold text-foreground w-12 text-left">
                  {stats_data.total > 0 ? Math.round((completed / stats_data.total) * 100) : 0}%
                </span>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">غير مستوفى</span>
              <div className="flex items-center gap-2">
                <div className="w-32 h-2 bg-muted rounded-full overflow-hidden">
                  <div
                    className="h-full bg-red-500 transition-all"
                    style={{
                      width: `${stats_data.total > 0 ? (incomplete / stats_data.total) * 100 : 0}%`,
                    }}
                  />
                </div>
                <span className="text-sm font-semibold text-foreground w-12 text-left">
                  {stats_data.total > 0 ? Math.round((incomplete / stats_data.total) * 100) : 0}%
                </span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
