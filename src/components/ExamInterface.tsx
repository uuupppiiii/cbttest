import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { CBTLayout } from "./CBTLayout";
import { ChevronLeft, ChevronRight, Flag, Clock, CheckCircle } from "lucide-react";

interface Question {
  id: number;
  question: string;
  options: string[];
  correctAnswer: number;
}

interface ExamInterfaceProps {
  studentName: string;
  onSubmit: (answers: Record<number, number>) => void;
}

// Sample questions - in a real app, this would come from a database
const sampleQuestions: Question[] = Array.from({ length: 60 }, (_, i) => ({
  id: i + 1,
  question: `Sample question ${i + 1}: Which of the following is the correct answer for this multiple choice question?`,
  options: [
    "Option A - This is the first possible answer",
    "Option B - This is the second possible answer", 
    "Option C - This is the third possible answer",
    "Option D - This is the fourth possible answer"
  ],
  correctAnswer: Math.floor(Math.random() * 4)
}));

export const ExamInterface = ({ studentName, onSubmit }: ExamInterfaceProps) => {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<Record<number, number>>({});
  const [timeRemaining, setTimeRemaining] = useState(90 * 60); // 90 minutes in seconds
  const [flaggedQuestions, setFlaggedQuestions] = useState<Set<number>>(new Set());

  // Timer effect
  useEffect(() => {
    const timer = setInterval(() => {
      setTimeRemaining((prev) => {
        if (prev <= 1) {
          // Auto-submit when time is up
          onSubmit(answers);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [answers, onSubmit]);

  const formatTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleAnswerSelect = (questionId: number, optionIndex: number) => {
    setAnswers(prev => ({
      ...prev,
      [questionId]: optionIndex
    }));
  };

  const toggleFlag = (questionId: number) => {
    setFlaggedQuestions(prev => {
      const newSet = new Set(prev);
      if (newSet.has(questionId)) {
        newSet.delete(questionId);
      } else {
        newSet.add(questionId);
      }
      return newSet;
    });
  };

  const navigateToQuestion = (index: number) => {
    if (index >= 0 && index < sampleQuestions.length) {
      setCurrentQuestion(index);
    }
  };

  const question = sampleQuestions[currentQuestion];
  const answeredCount = Object.keys(answers).length;
  const progress = Math.round((answeredCount / sampleQuestions.length) * 100);

  return (
    <CBTLayout
      title={`Welcome, ${studentName}`}
      showProgress
      currentQuestion={currentQuestion + 1}
      totalQuestions={sampleQuestions.length}
      timeRemaining={formatTime(timeRemaining)}
    >
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Question Panel */}
        <div className="lg:col-span-3">
          <Card className="shadow-card">
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="text-lg">
                Question {currentQuestion + 1}
              </CardTitle>
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => toggleFlag(question.id)}
                  className={flaggedQuestions.has(question.id) ? "text-warning" : ""}
                >
                  <Flag className="w-4 h-4" />
                  {flaggedQuestions.has(question.id) ? "Flagged" : "Flag"}
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="mb-6">
                <p className="text-foreground text-lg leading-relaxed">{question.question}</p>
              </div>
              
              <div className="space-y-3">
                {question.options.map((option, index) => (
                  <div
                    key={index}
                    onClick={() => handleAnswerSelect(question.id, index)}
                    className={`p-4 border rounded-lg cursor-pointer transition-all hover:shadow-sm ${
                      answers[question.id] === index
                        ? "border-primary bg-primary-light text-primary-foreground"
                        : "border-border hover:border-primary/50"
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center mt-0.5 ${
                        answers[question.id] === index
                          ? "border-primary bg-primary"
                          : "border-muted-foreground"
                      }`}>
                        {answers[question.id] === index && (
                          <div className="w-2 h-2 bg-primary-foreground rounded-full"></div>
                        )}
                      </div>
                      <div className="flex-1">
                        <span className="font-medium mr-2">
                          {String.fromCharCode(65 + index)}.
                        </span>
                        <span>{option}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Navigation */}
          <div className="flex justify-between items-center mt-6">
            <Button
              variant="outline"
              onClick={() => navigateToQuestion(currentQuestion - 1)}
              disabled={currentQuestion === 0}
            >
              <ChevronLeft className="w-4 h-4 mr-2" />
              Previous
            </Button>
            
            <div className="flex items-center gap-4">
              <div className="text-sm text-muted-foreground">
                Progress: {progress}% ({answeredCount}/{sampleQuestions.length})
              </div>
            </div>

            <Button
              onClick={() => navigateToQuestion(currentQuestion + 1)}
              disabled={currentQuestion === sampleQuestions.length - 1}
            >
              Next
              <ChevronRight className="w-4 h-4 ml-2" />
            </Button>
          </div>
        </div>

        {/* Question Navigator */}
        <div className="lg:col-span-1">
          <Card className="shadow-card sticky top-4">
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2">
                <Clock className="w-4 h-4" />
                Question Navigator
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-5 gap-2 mb-4">
                {sampleQuestions.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => navigateToQuestion(index)}
                    className={`w-8 h-8 text-xs rounded transition-all relative ${
                      currentQuestion === index
                        ? "bg-primary text-primary-foreground"
                        : answers[index + 1] !== undefined
                        ? "bg-success text-success-foreground"
                        : "bg-muted text-muted-foreground hover:bg-muted/80"
                    }`}
                  >
                    {index + 1}
                    {flaggedQuestions.has(index + 1) && (
                      <Flag className="w-2 h-2 absolute -top-1 -right-1 text-warning" />
                    )}
                  </button>
                ))}
              </div>
              
              <div className="space-y-3 text-xs">
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 bg-success rounded"></div>
                  <span>Answered ({answeredCount})</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 bg-muted border rounded"></div>
                  <span>Not Answered ({sampleQuestions.length - answeredCount})</span>
                </div>
                <div className="flex items-center gap-2">
                  <Flag className="w-4 h-4 text-warning" />
                  <span>Flagged ({flaggedQuestions.size})</span>
                </div>
              </div>

              <Button 
                className="w-full mt-6 bg-gradient-to-r from-success to-accent"
                onClick={() => onSubmit(answers)}
                disabled={answeredCount === 0}
              >
                <CheckCircle className="w-4 h-4 mr-2" />
                Submit Exam
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </CBTLayout>
  );
};