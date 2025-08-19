import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { CBTLayout } from "./CBTLayout";
import { Trophy, CheckCircle, XCircle, Clock, RotateCcw } from "lucide-react";

interface ExamResultsProps {
  studentName: string;
  answers: Record<number, number>;
  onRestart: () => void;
}

// For demo purposes - in a real app, this would calculate from actual correct answers
const calculateResults = (answers: Record<number, number>) => {
  const totalQuestions = 60;
  const answeredQuestions = Object.keys(answers).length;
  // Simulate 70-85% correct answers for demo
  const correctAnswers = Math.floor(answeredQuestions * (0.7 + Math.random() * 0.15));
  const incorrectAnswers = answeredQuestions - correctAnswers;
  const unanswered = totalQuestions - answeredQuestions;
  const percentage = Math.round((correctAnswers / totalQuestions) * 100);
  
  return {
    totalQuestions,
    answeredQuestions,
    correctAnswers,
    incorrectAnswers,
    unanswered,
    percentage
  };
};

const getGrade = (percentage: number) => {
  if (percentage >= 90) return { grade: "A+", color: "success", message: "Excellent!" };
  if (percentage >= 80) return { grade: "A", color: "success", message: "Very Good!" };
  if (percentage >= 70) return { grade: "B", color: "primary", message: "Good!" };
  if (percentage >= 60) return { grade: "C", color: "warning", message: "Fair" };
  if (percentage >= 50) return { grade: "D", color: "warning", message: "Pass" };
  return { grade: "F", color: "destructive", message: "Failed" };
};

export const ExamResults = ({ studentName, answers, onRestart }: ExamResultsProps) => {
  const results = calculateResults(answers);
  const gradeInfo = getGrade(results.percentage);

  return (
    <CBTLayout title="Examination Results">
      <div className="max-w-4xl mx-auto">
        {/* Header Card */}
        <Card className="shadow-elegant mb-8 bg-gradient-to-br from-primary-light to-accent-light">
          <CardContent className="p-8 text-center">
            <div className="flex justify-center mb-4">
              <div className="p-4 bg-white rounded-full shadow-lg">
                <Trophy className="w-12 h-12 text-primary" />
              </div>
            </div>
            <h2 className="text-3xl font-bold text-primary mb-2">Examination Complete!</h2>
            <p className="text-lg text-muted-foreground mb-4">
              Well done, <span className="font-semibold">{studentName}</span>
            </p>
            <div className="flex justify-center">
              <Badge 
                variant="secondary" 
                className={`text-2xl px-6 py-2 bg-${gradeInfo.color} text-${gradeInfo.color}-foreground`}
              >
                {results.percentage}% - Grade {gradeInfo.grade}
              </Badge>
            </div>
            <p className="text-lg font-medium mt-2 text-primary">{gradeInfo.message}</p>
          </CardContent>
        </Card>

        {/* Results Breakdown */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <Card className="shadow-card">
            <CardContent className="p-6 text-center">
              <div className="flex justify-center mb-3">
                <CheckCircle className="w-8 h-8 text-success" />
              </div>
              <div className="text-2xl font-bold text-success">{results.correctAnswers}</div>
              <div className="text-sm text-muted-foreground">Correct Answers</div>
            </CardContent>
          </Card>

          <Card className="shadow-card">
            <CardContent className="p-6 text-center">
              <div className="flex justify-center mb-3">
                <XCircle className="w-8 h-8 text-destructive" />
              </div>
              <div className="text-2xl font-bold text-destructive">{results.incorrectAnswers}</div>
              <div className="text-sm text-muted-foreground">Incorrect Answers</div>
            </CardContent>
          </Card>

          <Card className="shadow-card">
            <CardContent className="p-6 text-center">
              <div className="flex justify-center mb-3">
                <Clock className="w-8 h-8 text-warning" />
              </div>
              <div className="text-2xl font-bold text-warning">{results.unanswered}</div>
              <div className="text-sm text-muted-foreground">Unanswered</div>
            </CardContent>
          </Card>

          <Card className="shadow-card">
            <CardContent className="p-6 text-center">
              <div className="flex justify-center mb-3">
                <Trophy className="w-8 h-8 text-primary" />
              </div>
              <div className="text-2xl font-bold text-primary">{results.answeredQuestions}/{results.totalQuestions}</div>
              <div className="text-sm text-muted-foreground">Attempted</div>
            </CardContent>
          </Card>
        </div>

        {/* Detailed Analysis */}
        <Card className="shadow-card mb-8">
          <CardHeader>
            <CardTitle>Performance Analysis</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm font-medium">Overall Score</span>
                  <span className="text-sm font-bold">{results.percentage}%</span>
                </div>
                <div className="w-full bg-muted rounded-full h-3">
                  <div 
                    className="h-3 bg-gradient-to-r from-primary to-accent rounded-full transition-all duration-1000"
                    style={{ width: `${results.percentage}%` }}
                  ></div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4">
                <div className="text-center p-4 bg-success-light rounded-lg">
                  <div className="text-lg font-bold text-success">
                    {Math.round((results.correctAnswers / results.totalQuestions) * 100)}%
                  </div>
                  <div className="text-sm text-muted-foreground">Accuracy Rate</div>
                </div>
                
                <div className="text-center p-4 bg-primary-light rounded-lg">
                  <div className="text-lg font-bold text-primary">
                    {Math.round((results.answeredQuestions / results.totalQuestions) * 100)}%
                  </div>
                  <div className="text-sm text-muted-foreground">Completion Rate</div>
                </div>
                
                <div className="text-center p-4 bg-accent-light rounded-lg">
                  <div className="text-lg font-bold text-accent">90:00</div>
                  <div className="text-sm text-muted-foreground">Time Allocated</div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Action Buttons */}
        <div className="flex justify-center gap-4">
          <Button 
            onClick={onRestart}
            variant="outline"
            className="px-8"
          >
            <RotateCcw className="w-4 h-4 mr-2" />
            Take Another Test
          </Button>
          
          <Button 
            className="px-8 bg-gradient-to-r from-primary to-accent"
            onClick={() => window.print()}
          >
            Print Results
          </Button>
        </div>
      </div>
    </CBTLayout>
  );
};