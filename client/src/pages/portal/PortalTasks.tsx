import { useState } from "react";
import PortalLayout from "@/components/PortalLayout";
import { trpc } from "@/lib/trpc";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Checkbox } from "@/components/ui/checkbox";
import { toast } from "sonner";
import { Plus, CheckSquare, Clock, AlertTriangle } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

const taskSchema = z.object({
  title: z.string().min(2, "Task title required"),
  description: z.string().optional(),
  priority: z.enum(["low", "medium", "high", "urgent"]),
  dueDate: z.string().optional(),
});

type TaskForm = z.infer<typeof taskSchema>;

const priorityColors: Record<string, string> = {
  low: "bg-gray-100 text-gray-600",
  medium: "bg-yellow-100 text-yellow-700",
  high: "bg-orange-100 text-orange-700",
  urgent: "bg-red-100 text-red-700",
};

const priorityDots: Record<string, string> = {
  low: "bg-gray-300",
  medium: "bg-yellow-500",
  high: "bg-orange-500",
  urgent: "bg-red-500",
};

export default function PortalTasks() {
  const [open, setOpen] = useState(false);
  const utils = trpc.useUtils();

  const { data: tasks, isLoading } = trpc.portal.listMyTasks.useQuery();
  const createTask = trpc.portal.createTask.useMutation({
    onSuccess: () => {
      utils.portal.listMyTasks.invalidate();
      utils.portal.getDashboardStats.invalidate();
      setOpen(false);
      toast.success("Task created!");
    },
    onError: () => toast.error("Failed to create task"),
  });
  const updateTask = trpc.portal.updateTaskStatus.useMutation({
    onSuccess: () => {
      utils.portal.listMyTasks.invalidate();
    },
  });

  const { register, handleSubmit, reset, setValue, formState: { errors } } = useForm<TaskForm>({
    resolver: zodResolver(taskSchema),
    defaultValues: { priority: "medium" },
  });

  const onSubmit = (data: TaskForm) => {
    createTask.mutate(data);
    reset();
  };

  const pending = tasks?.filter((t) => t.status === "todo" || t.status === "in_progress") ?? [];
  const done = tasks?.filter((t) => t.status === "done") ?? [];

  const overdue = pending.filter((t) => t.dueDate && new Date(t.dueDate) < new Date());

  return (
    <PortalLayout title="Tasks">
      <div className="max-w-3xl mx-auto space-y-6">

        {/* Header */}
        <div className="flex items-center justify-between">
          <p className="text-gray-500 text-sm">{pending.length} pending · {done.length} completed</p>
          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
              <Button className="bg-[#0A1628] hover:bg-[#0A1628]/90 text-white">
                <Plus className="w-4 h-4 mr-2" /> New Task
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-md">
              <DialogHeader>
                <DialogTitle>Create Task</DialogTitle>
              </DialogHeader>
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 mt-2">
                <div>
                  <Label>Task Title *</Label>
                  <Input {...register("title")} placeholder="What needs to be done?" className="mt-1" />
                  {errors.title && <p className="text-red-500 text-xs mt-1">{errors.title.message}</p>}
                </div>
                <div>
                  <Label>Description</Label>
                  <Textarea {...register("description")} placeholder="Additional details..." className="mt-1" rows={2} />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label>Priority</Label>
                    <Select defaultValue="medium" onValueChange={(v) => setValue("priority", v as TaskForm["priority"])}>
                      <SelectTrigger className="mt-1">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="low">Low</SelectItem>
                        <SelectItem value="medium">Medium</SelectItem>
                        <SelectItem value="high">High</SelectItem>
                        <SelectItem value="urgent">Urgent</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label>Due Date</Label>
                    <Input {...register("dueDate")} type="date" className="mt-1" />
                  </div>
                </div>
                <Button type="submit" className="w-full bg-[#0A1628] text-white" disabled={createTask.isPending}>
                  {createTask.isPending ? "Creating..." : "Create Task"}
                </Button>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        {/* Overdue Alert */}
        {overdue.length > 0 && (
          <div className="flex items-center gap-3 bg-red-50 border border-red-200 rounded-lg p-4">
            <AlertTriangle className="w-5 h-5 text-red-500 flex-shrink-0" />
            <p className="text-sm text-red-700">
              <strong>{overdue.length} overdue task{overdue.length > 1 ? "s" : ""}</strong> need your attention.
            </p>
          </div>
        )}

        {/* Pending Tasks */}
        <Card className="border-0 shadow-sm">
          <CardHeader className="pb-3">
            <CardTitle className="text-base font-semibold text-[#0A1628]">Pending Tasks</CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            {isLoading ? (
              <div className="text-center py-10 text-gray-400">Loading tasks...</div>
            ) : pending.length === 0 ? (
              <div className="text-center py-12">
                <CheckSquare className="w-12 h-12 text-gray-200 mx-auto mb-3" />
                <p className="text-gray-500">No pending tasks. You're all caught up!</p>
              </div>
            ) : (
              <div className="divide-y divide-gray-50">
                {pending.map((task) => {
                  const isOverdue = task.dueDate && new Date(task.dueDate) < new Date();
                  return (
                    <div key={task.id} className={`px-5 py-3.5 flex items-start gap-3 hover:bg-gray-50 transition-colors ${isOverdue ? "bg-red-50/50" : ""}`}>
                      <Checkbox
                        className="mt-0.5"
                        checked={task.status === "done"}
                        onCheckedChange={(checked) => {
                          updateTask.mutate({ taskId: task.id, status: checked ? "done" : "todo" });
                        }}
                      />
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                          <p className="text-sm font-medium text-[#0A1628]">{task.title}</p>
                          <Badge className={`text-xs ${priorityColors[task.priority]}`}>{task.priority}</Badge>
                          {isOverdue && <Badge className="text-xs bg-red-100 text-red-700">Overdue</Badge>}
                        </div>
                        {task.description && <p className="text-xs text-gray-500 mt-0.5 truncate">{task.description}</p>}
                        {task.dueDate && (
                          <p className={`text-xs mt-1 flex items-center gap-1 ${isOverdue ? "text-red-500" : "text-gray-400"}`}>
                            <Clock className="w-3 h-3" />
                            Due {new Date(task.dueDate).toLocaleDateString("en-ZA", { day: "numeric", month: "short" })}
                          </p>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Completed Tasks */}
        {done.length > 0 && (
          <Card className="border-0 shadow-sm opacity-70">
            <CardHeader className="pb-3">
              <CardTitle className="text-base font-semibold text-gray-500">Completed ({done.length})</CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <div className="divide-y divide-gray-50">
                {done.slice(0, 5).map((task) => (
                  <div key={task.id} className="px-5 py-3 flex items-center gap-3">
                    <Checkbox
                      checked
                      onCheckedChange={() => updateTask.mutate({ taskId: task.id, status: "todo" })}
                    />
                    <p className="text-sm text-gray-400 line-through">{task.title}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </PortalLayout>
  );
}
