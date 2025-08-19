import { useState } from "react";
import { StudentLogin } from "@/components/StudentLogin";
import { ExamInterface } from "@/components/ExamInterface";
import { ExamResults } from "@/components/ExamResults";
import { useToast } from "@/hooks/use-toast";

type AppState = "login" | "exam" | "results";

interface Student {
  id: string;
  name: string;
}

const Index = () => {
  const [appState, setAppState] = useState<AppState>("login");
  const [student, setStudent] = useState<Student | null>(null);
  const [examAnswers, setExamAnswers] = useState<Record<number, number>>({});
  const { toast } = useToast();

  const handleLogin = (studentId: string, name: string) => {
    setStudent({ id: studentId, name });
    setAppState("exam");
    toast({
      title: "Login Successful",
      description: `Welcome, ${name}! Your examination is ready to begin.`,
    });
  };

  const handleExamSubmit = (answers: Record<number, number>) => {
    setExamAnswers(answers);
    setAppState("results");
    toast({
      title: "Exam Submitted",
      description: "Your answers have been recorded successfully.",
    });
  };

  const handleRestart = () => {
    setAppState("login");
    setStudent(null);
    setExamAnswers({});
  };

  if (appState === "login") {
    return <StudentLogin onLogin={handleLogin} />;
  }

  if (appState === "exam" && student) {
    return (
      <ExamInterface 
        studentName={student.name} 
        onSubmit={handleExamSubmit}
      />
    );
  }

  if (appState === "results" && student) {
    return (
      <ExamResults 
        studentName={student.name}
        answers={examAnswers}
        onRestart={handleRestart}
      />
    );
  }

  return null;
};

export default Index;
