import { useState } from "react";
import { trpc } from "@/lib/trpc";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { Plus, DollarSign, TrendingUp, TrendingDown, Receipt, Target, BarChart3 } from "lucide-react";

const EXPENSE_CATEGORIES = [
  "Marketing", "Office", "Travel", "Software", "Professional Fees",
  "Training", "Equipment", "Entertainment", "Utilities", "Other"
];

export default function Financials() {
  const [showExpenseDialog, setShowExpenseDialog] = useState(false);
  const [showGoalDialog, setShowGoalDialog] = useState(false);
  const [activeTab, setActiveTab] = useState<"overview" | "expenses" | "goals">("overview");

  const { data: kpis } = trpc.ceo.getDashboardKPIs.useQuery(undefined, { refetchOnWindowFocus: false });
  const { data: expenses, refetch: refetchExpenses } = trpc.ceo.getExpenses.useQuery({}, { refetchOnWindowFocus: false });
  const { data: goals, refetch: refetchGoals } = trpc.ceo.getGoals.useQuery(undefined, { refetchOnWindowFocus: false });

  const addExpense = trpc.ceo.addExpense.useMutation({
    onSuccess: () => { toast.success("Expense recorded"); setShowExpenseDialog(false); refetchExpenses(); },
    onError: (err) => toast.error(err.message),
  });

  const addGoal = trpc.ceo.addGoal.useMutation({
    onSuccess: () => { toast.success("Goal set"); setShowGoalDialog(false); refetchGoals(); },
    onError: (err) => toast.error(err.message),
  });

  const formatCurrency = (v: number | string | null | undefined) => {
    const n = typeof v === "string" ? parseFloat(v) : (v ?? 0);
    if (isNaN(n)) return "R0";
    return n >= 1_000_000 ? `R${(n / 1_000_000).toFixed(2)}M` : `R${n.toLocaleString("en-ZA", { minimumFractionDigits: 0 })}`;
  };

  const commissionYTD = kpis?.commission.ytd ?? 0;
  const expensesYTD = kpis?.expenses.ytd ?? 0;
  const netYTD = commissionYTD - expensesYTD;

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Financials</h1>
          <p className="text-slate-400 text-sm mt-1">Revenue, expenses, and financial goals</p>
        </div>
        <div className="flex gap-2">
          <Dialog open={showExpenseDialog} onOpenChange={setShowExpenseDialog}>
            <DialogTrigger asChild>
              <Button variant="outline" className="border-slate-600 text-slate-300 hover:text-white">
                <Receipt className="w-4 h-4 mr-2" /> Log Expense
              </Button>
            </DialogTrigger>
            <DialogContent className="bg-slate-800 border-slate-700 text-white">
              <DialogHeader><DialogTitle>Log Expense</DialogTitle></DialogHeader>
              <form onSubmit={(e) => {
                e.preventDefault();
                const fd = new FormData(e.currentTarget);
                addExpense.mutate({
                  description: fd.get("description") as string,
                  amount: parseFloat(fd.get("amount") as string),
                  category: fd.get("category") as string,
                  expenseDate: fd.get("expenseDate") as string,
                  notes: fd.get("notes") as string || undefined,
                });
              }} className="space-y-4">
                <div>
                  <Label>Description *</Label>
                  <Input name="description" required className="bg-slate-700 border-slate-600 text-white mt-1" placeholder="e.g. Facebook Ads — April" />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <Label>Amount (R) *</Label>
                    <Input name="amount" type="number" step="0.01" required className="bg-slate-700 border-slate-600 text-white mt-1" placeholder="0.00" />
                  </div>
                  <div>
                    <Label>Date *</Label>
                    <Input name="expenseDate" type="date" required className="bg-slate-700 border-slate-600 text-white mt-1" defaultValue={new Date().toISOString().split("T")[0]} />
                  </div>
                </div>
                <div>
                  <Label>Category</Label>
                  <Select name="category">
                    <SelectTrigger className="bg-slate-700 border-slate-600 text-white mt-1">
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent className="bg-slate-700 border-slate-600">
                      {EXPENSE_CATEGORIES.map(c => <SelectItem key={c} value={c} className="text-white">{c}</SelectItem>)}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label>Notes</Label>
                  <Textarea name="notes" className="bg-slate-700 border-slate-600 text-white mt-1" rows={2} />
                </div>
                <div className="flex gap-2">
                  <Button type="button" variant="outline" className="flex-1 border-slate-600 text-slate-300" onClick={() => setShowExpenseDialog(false)}>Cancel</Button>
                  <Button type="submit" className="flex-1 bg-amber-500 hover:bg-amber-600 text-slate-900 font-semibold" disabled={addExpense.isPending}>
                    {addExpense.isPending ? "Saving..." : "Save Expense"}
                  </Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>

          <Dialog open={showGoalDialog} onOpenChange={setShowGoalDialog}>
            <DialogTrigger asChild>
              <Button className="bg-amber-500 hover:bg-amber-600 text-slate-900 font-semibold">
                <Target className="w-4 h-4 mr-2" /> Set Goal
              </Button>
            </DialogTrigger>
            <DialogContent className="bg-slate-800 border-slate-700 text-white">
              <DialogHeader><DialogTitle>Set Financial Goal</DialogTitle></DialogHeader>
              <form onSubmit={(e) => {
                e.preventDefault();
                const fd = new FormData(e.currentTarget);
                addGoal.mutate({
                  title: fd.get("title") as string,
                  goalType: fd.get("goalType") as "revenue" | "deals" | "listings" | "leads" | "commission" | "custom",
                  targetValue: parseFloat(fd.get("targetValue") as string),
                  period: (fd.get("period") as "monthly" | "quarterly" | "annual") ?? "monthly",
                });
              }} className="space-y-4">
                <div>
                  <Label>Goal Title *</Label>
                  <Input name="title" required className="bg-slate-700 border-slate-600 text-white mt-1" placeholder="e.g. Q2 Commission Target" />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <Label>Type</Label>
                    <Select name="goalType">
                      <SelectTrigger className="bg-slate-700 border-slate-600 text-white mt-1">
                        <SelectValue placeholder="Goal type" />
                      </SelectTrigger>
                      <SelectContent className="bg-slate-700 border-slate-600">
                        {["revenue", "deals", "listings", "leads", "commission", "custom"].map(t => (
                          <SelectItem key={t} value={t} className="text-white capitalize">{t}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label>Target Value *</Label>
                    <Input name="targetValue" type="number" step="0.01" required className="bg-slate-700 border-slate-600 text-white mt-1" placeholder="e.g. 500000" />
                  </div>
                </div>
                <div>
                  <Label>Period</Label>
                  <Input name="period" className="bg-slate-700 border-slate-600 text-white mt-1" placeholder="e.g. Q2 2026, April 2026" />
                </div>
                <div>
                  <Label>Notes</Label>
                  <Textarea name="notes" className="bg-slate-700 border-slate-600 text-white mt-1" rows={2} />
                </div>
                <div className="flex gap-2">
                  <Button type="button" variant="outline" className="flex-1 border-slate-600 text-slate-300" onClick={() => setShowGoalDialog(false)}>Cancel</Button>
                  <Button type="submit" className="flex-1 bg-amber-500 hover:bg-amber-600 text-slate-900 font-semibold" disabled={addGoal.isPending}>
                    {addGoal.isPending ? "Saving..." : "Save Goal"}
                  </Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-2">
        {(["overview", "expenses", "goals"] as const).map(tab => (
          <button key={tab} onClick={() => setActiveTab(tab)}
            className={`px-4 py-2 rounded-lg text-sm font-medium capitalize transition-all ${
              activeTab === tab ? "bg-amber-500/10 text-amber-400 border border-amber-500/20" : "bg-slate-800 text-slate-400 border border-slate-700 hover:border-slate-500"
            }`}>
            {tab}
          </button>
        ))}
      </div>

      {activeTab === "overview" && (
        <div className="space-y-6">
          {/* Summary cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card className="bg-slate-800 border-slate-700">
              <CardContent className="p-5">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-slate-400 text-xs uppercase tracking-wide">Commission YTD</p>
                    <p className="text-2xl font-bold text-white mt-1">{formatCurrency(commissionYTD)}</p>
                    <p className="text-slate-500 text-xs mt-1">{formatCurrency(kpis?.commission.mtd ?? 0)} this month</p>
                  </div>
                  <div className="p-2.5 rounded-lg bg-green-500/10"><TrendingUp className="w-5 h-5 text-green-400" /></div>
                </div>
              </CardContent>
            </Card>
            <Card className="bg-slate-800 border-slate-700">
              <CardContent className="p-5">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-slate-400 text-xs uppercase tracking-wide">Expenses YTD</p>
                    <p className="text-2xl font-bold text-white mt-1">{formatCurrency(expensesYTD)}</p>
                    <p className="text-slate-500 text-xs mt-1">{(expenses ?? []).length} expense entries</p>
                  </div>
                  <div className="p-2.5 rounded-lg bg-red-500/10"><TrendingDown className="w-5 h-5 text-red-400" /></div>
                </div>
              </CardContent>
            </Card>
            <Card className={`border-slate-700 ${netYTD >= 0 ? "bg-green-500/5" : "bg-red-500/5"}`}>
              <CardContent className="p-5">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-slate-400 text-xs uppercase tracking-wide">Net YTD</p>
                    <p className={`text-2xl font-bold mt-1 ${netYTD >= 0 ? "text-green-400" : "text-red-400"}`}>{formatCurrency(netYTD)}</p>
                    <p className="text-slate-500 text-xs mt-1">Commission minus expenses</p>
                  </div>
                  <div className={`p-2.5 rounded-lg ${netYTD >= 0 ? "bg-green-500/10" : "bg-red-500/10"}`}>
                    <DollarSign className={`w-5 h-5 ${netYTD >= 0 ? "text-green-400" : "text-red-400"}`} />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Expense breakdown by category */}
          <Card className="bg-slate-800 border-slate-700">
            <CardHeader className="pb-3">
              <CardTitle className="text-white text-sm flex items-center gap-2">
                <BarChart3 className="w-4 h-4 text-amber-400" /> Expenses by Category
              </CardTitle>
            </CardHeader>
            <CardContent>
              {(expenses ?? []).length === 0 ? (
                <p className="text-slate-500 text-sm text-center py-4">No expenses logged yet</p>
              ) : (
                <div className="space-y-2">
                  {Object.entries(
                    (expenses ?? []).reduce((acc: Record<string, number>, e: any) => {
                      const cat = e.category ?? "Other";
                      acc[cat] = (acc[cat] ?? 0) + parseFloat(e.amount ?? "0");
                      return acc;
                    }, {})
                  ).sort(([,a], [,b]) => b - a).map(([cat, total]) => {
                    const maxVal = Math.max(...Object.values(
                      (expenses ?? []).reduce((acc: Record<string, number>, e: any) => {
                        const c = e.category ?? "Other";
                        acc[c] = (acc[c] ?? 0) + parseFloat(e.amount ?? "0");
                        return acc;
                      }, {})
                    ));
                    return (
                      <div key={cat} className="flex items-center gap-3">
                        <span className="text-slate-400 text-xs w-28">{cat}</span>
                        <div className="flex-1 bg-slate-700 rounded-full h-2">
                          <div className="bg-red-400 h-2 rounded-full" style={{ width: `${(total / maxVal) * 100}%` }} />
                        </div>
                        <span className="text-white text-xs w-20 text-right">{formatCurrency(total)}</span>
                      </div>
                    );
                  })}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      )}

      {activeTab === "expenses" && (
        <div className="space-y-3">
          {(expenses ?? []).length === 0 ? (
            <div className="text-center py-16 text-slate-500">
              <Receipt className="w-12 h-12 mx-auto mb-3 opacity-30" />
              <p>No expenses logged yet</p>
            </div>
          ) : (
            (expenses ?? []).map((exp: any) => (
              <Card key={exp.id} className="bg-slate-800 border-slate-700">
                <CardContent className="p-4 flex items-center justify-between">
                  <div className="flex-1 min-w-0">
                    <p className="text-white text-sm font-medium">{exp.description}</p>
                    <div className="flex items-center gap-2 mt-1">
                      {exp.category && <Badge variant="outline" className="text-xs border-slate-600 text-slate-400">{exp.category}</Badge>}
                      <span className="text-slate-500 text-xs">{new Date(exp.expenseDate ?? exp.createdAt).toLocaleDateString("en-ZA")}</span>
                    </div>
                    {exp.notes && <p className="text-slate-500 text-xs mt-1">{exp.notes}</p>}
                  </div>
                  <span className="text-red-400 font-semibold ml-4">{formatCurrency(exp.amount)}</span>
                </CardContent>
              </Card>
            ))
          )}
        </div>
      )}

      {activeTab === "goals" && (
        <div className="space-y-3">
          {(goals ?? []).length === 0 ? (
            <div className="text-center py-16 text-slate-500">
              <Target className="w-12 h-12 mx-auto mb-3 opacity-30" />
              <p>No goals set yet</p>
            </div>
          ) : (
            (goals ?? []).map((goal: any) => {
              const progress = goal.targetValue > 0 ? Math.min((parseFloat(goal.currentValue ?? "0") / parseFloat(goal.targetValue)) * 100, 100) : 0;
              return (
                <Card key={goal.id} className="bg-slate-800 border-slate-700">
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <p className="text-white font-medium">{goal.title}</p>
                        <div className="flex items-center gap-2 mt-1">
                          <Badge variant="outline" className="text-xs border-slate-600 text-slate-400 capitalize">{goal.goalType}</Badge>
                          {goal.period && <span className="text-slate-500 text-xs">{goal.period}</span>}
                        </div>
                      </div>
                      <Badge className={`text-xs ${goal.status === "achieved" ? "bg-green-500/10 text-green-400" : goal.status === "missed" ? "bg-red-500/10 text-red-400" : "bg-amber-500/10 text-amber-400"}`}>
                        {goal.status}
                      </Badge>
                    </div>
                    <div className="space-y-1">
                      <div className="flex justify-between text-xs text-slate-400">
                        <span>{formatCurrency(goal.currentValue ?? 0)} achieved</span>
                        <span>{formatCurrency(goal.targetValue)} target</span>
                      </div>
                      <div className="bg-slate-700 rounded-full h-2">
                        <div className="bg-amber-500 h-2 rounded-full transition-all" style={{ width: `${progress}%` }} />
                      </div>
                      <p className="text-xs text-slate-500 text-right">{progress.toFixed(0)}% complete</p>
                    </div>
                  </CardContent>
                </Card>
              );
            })
          )}
        </div>
      )}
    </div>
  );
}
