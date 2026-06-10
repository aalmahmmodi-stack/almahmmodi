import { useState, useCallback } from 'react';
import { trpc } from '@/lib/trpc';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { useLocation } from 'wouter';
import { Plus, Download, FileText } from 'lucide-react';
import { toast } from 'sonner';

export default function StudentsList() {
  const [, setLocation] = useLocation();
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState('');
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [newStudent, setNewStudent] = useState({
    sequentialNumber: '',
    name: '',
    dateOfBirth: '',
    qualification: '',
    graduationYear: '',
    university: '',
    notes: '',
    deficiencies: '',
    status: 'غير مستوفى',
    nationalNumber: '',
  });

  const { data: students, isLoading, refetch } = trpc.students.list.useQuery({
    search,
    status,
    graduationYear: 0,
    university: '',
    qualification: '',
  });

  const { data: excelData } = trpc.students.exportExcel.useQuery({
    search,
    status,
    graduationYear: 0,
    university: '',
    qualification: '',
  }, { enabled: false });

  const { data: pdfData } = trpc.students.exportPDF.useQuery({
    search,
    status,
    graduationYear: 0,
    university: '',
    qualification: '',
  }, { enabled: false });

  const createMutation = trpc.students.create.useMutation({
    onSuccess: () => {
      toast.success('تم إضافة الطالب بنجاح');
      refetch();
      setShowAddDialog(false);
      setNewStudent({
        sequentialNumber: '',
        name: '',
        dateOfBirth: '',
        qualification: '',
        graduationYear: '',
        university: '',
        notes: '',
        deficiencies: '',
        status: 'غير مستوفى',
        nationalNumber: '',
      });
    },
    onError: (error) => {
      toast.error('فشل في إضافة الطالب');
      console.error(error);
    },
  });

  const handleExportExcel = useCallback(async () => {
    try {
      const base64 = await (trpc.students.exportExcel as any).query({
        search,
        status,
        graduationYear: 0,
        university: '',
        qualification: '',
      });
      const link = document.createElement('a');
      link.href = `data:application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;base64,${base64}`;
      link.download = `students_${new Date().toISOString().split('T')[0]}.xlsx`;
      link.click();
      toast.success('تم تصدير الملف بنجاح');
    } catch (error) {
      toast.error('فشل التصدير');
      console.error('Export failed:', error);
    }
  }, [search, status]);

  const handleExportPDF = useCallback(async () => {
    try {
      const base64 = await (trpc.students.exportPDF as any).query({
        search,
        status,
        graduationYear: 0,
        university: '',
        qualification: '',
      });
      const link = document.createElement('a');
      link.href = `data:application/pdf;base64,${base64}`;
      link.download = `students_${new Date().toISOString().split('T')[0]}.pdf`;
      link.click();
      toast.success('تم تصدير الملف بنجاح');
    } catch (error) {
      toast.error('فشل التصدير');
      console.error('Export failed:', error);
    }
  }, [search, status]);

  const handleAddStudent = async () => {
    if (!newStudent.name || !newStudent.nationalNumber) {
      toast.error('الرجاء ملء جميع الحقول المطلوبة');
      return;
    }
    await createMutation.mutateAsync({
      sequentialNumber: parseInt(newStudent.sequentialNumber) || 0,
      name: newStudent.name,
      dateOfBirth: newStudent.dateOfBirth,
      qualification: newStudent.qualification,
      graduationYear: parseInt(newStudent.graduationYear) || 0,
      university: newStudent.university,
      notes: newStudent.notes || null,
      deficiencies: newStudent.deficiencies || null,
      status: newStudent.status,
      nationalNumber: newStudent.nationalNumber,
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-bold text-foreground mb-2">الطلاب</h1>
          <p className="text-muted-foreground">ادارة وتصفية بيانات الطلاب</p>
        </div>
        <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
          <DialogTrigger asChild>
            <Button className="bg-blue-600 hover:bg-blue-700">
              <Plus className="w-4 h-4 ml-2" />
              اضافة طالب جديد
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>اضافة طالب جديد</DialogTitle>
            </DialogHeader>
            <div className="grid grid-cols-2 gap-4">
              <Input
                placeholder="الرقم التسلسلي"
                type="number"
                value={newStudent.sequentialNumber}
                onChange={(e) => setNewStudent({...newStudent, sequentialNumber: e.target.value})}
              />
              <Input
                placeholder="الاسم"
                value={newStudent.name}
                onChange={(e) => setNewStudent({...newStudent, name: e.target.value})}
              />
              <Input
                placeholder="تاريخ الميلاد"
                type="date"
                value={newStudent.dateOfBirth}
                onChange={(e) => setNewStudent({...newStudent, dateOfBirth: e.target.value})}
              />
              <Input
                placeholder="المؤهل العلمي"
                value={newStudent.qualification}
                onChange={(e) => setNewStudent({...newStudent, qualification: e.target.value})}
              />
              <Input
                placeholder="سنة التخرج"
                type="number"
                value={newStudent.graduationYear}
                onChange={(e) => setNewStudent({...newStudent, graduationYear: e.target.value})}
              />
              <Input
                placeholder="الجامعة"
                value={newStudent.university}
                onChange={(e) => setNewStudent({...newStudent, university: e.target.value})}
              />
              <Input
                placeholder="الرقم الوطني"
                value={newStudent.nationalNumber}
                onChange={(e) => setNewStudent({...newStudent, nationalNumber: e.target.value})}
              />
              <Select value={newStudent.status} onValueChange={(value) => setNewStudent({...newStudent, status: value})}>
                <SelectTrigger>
                  <SelectValue placeholder="اختر الحالة" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="مستوفى">مستوفى</SelectItem>
                  <SelectItem value="غير مستوفى">غير مستوفى</SelectItem>
                </SelectContent>
              </Select>
              <Input
                placeholder="الملاحظات"
                value={newStudent.notes}
                onChange={(e) => setNewStudent({...newStudent, notes: e.target.value})}
                className="col-span-2"
              />
              <Input
                placeholder="النواقص"
                value={newStudent.deficiencies}
                onChange={(e) => setNewStudent({...newStudent, deficiencies: e.target.value})}
                className="col-span-2"
              />
            </div>
            <Button onClick={handleAddStudent} className="w-full bg-green-600 hover:bg-green-700 mt-4" disabled={createMutation.isPending}>
              {createMutation.isPending ? 'جاري الحفظ...' : 'حفظ'}
            </Button>
          </DialogContent>
        </Dialog>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>البحث والتصفية</CardTitle>
          <CardDescription>ابحث وصفي البيانات حسب معاييرك</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="text-sm font-medium mb-2 block">البحث بالاسم او الرقم الوطني</label>
              <Input
                placeholder="ابحث..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="text-right"
              />
            </div>
            <div>
              <label className="text-sm font-medium mb-2 block">الحالة</label>
              <Select value={status} onValueChange={setStatus}>
                <SelectTrigger>
                  <SelectValue placeholder="اختر الحالة" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">الكل</SelectItem>
                  <SelectItem value="مستوفى">مستوفى</SelectItem>
                  <SelectItem value="غير مستوفى">غير مستوفى</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex gap-2 items-end">
              <Button onClick={handleExportExcel} variant="outline" className="flex-1">
                <Download className="w-4 h-4 ml-2" />
                Excel
              </Button>
              <Button onClick={handleExportPDF} variant="outline" className="flex-1">
                <FileText className="w-4 h-4 ml-2" />
                PDF
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>قائمة الطلاب</CardTitle>
          <CardDescription>عدد الطلاب: {students?.length || 0}</CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="text-center py-8">جاري التحميل...</div>
          ) : students && students.length > 0 ? (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="text-right">الرقم</TableHead>
                    <TableHead className="text-right">الاسم</TableHead>
                    <TableHead className="text-right">الرقم الوطني</TableHead>
                    <TableHead className="text-right">الجامعة</TableHead>
                    <TableHead className="text-right">سنة التخرج</TableHead>
                    <TableHead className="text-right">الحالة</TableHead>
                    <TableHead className="text-right">حالة</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {students.map((student: any) => (
                    <TableRow key={student.id} className={student.isDuplicate === 1 ? 'bg-yellow-50' : ''}>
                      <TableCell>{student.sequentialNumber}</TableCell>
                      <TableCell>{student.name}</TableCell>
                      <TableCell>{student.nationalNumber}</TableCell>
                      <TableCell>{student.university}</TableCell>
                      <TableCell>{student.graduationYear}</TableCell>
                      <TableCell>
                        <span className={`px-2 py-1 rounded text-sm font-medium ${
                          student.status === 'مستوفى' 
                            ? 'bg-green-100 text-green-800' 
                            : 'bg-red-100 text-red-800'
                        }`}>
                          {student.status}
                        </span>
                      </TableCell>
                      <TableCell>
                        {student.isDuplicate === 1 ? (
                          <span className="px-2 py-1 rounded text-sm font-medium bg-yellow-100 text-yellow-800">
                            مكرر
                          </span>
                        ) : (
                          <span className="px-2 py-1 rounded text-sm font-medium bg-blue-100 text-blue-800">
                            فريد
                          </span>
                        )}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          ) : (
            <div className="text-center py-8 text-muted-foreground">
              لا توجد نتائج
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
