
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { BookOpen, Clock, List, Plus, Save, Trash2, Edit2, Check, X, HelpCircle } from 'lucide-react';
import { toast } from 'sonner';
import { z } from 'zod';
import { useForm, useFieldArray } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import GlassCard from '@/components/ui-custom/GlassCard';
import Button from '@/components/ui-custom/Button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { Switch } from '@/components/ui/switch';

// Basic test schema
const testSchema = z.object({
  name: z.string().min(3, { message: "Test name must be at least 3 characters" }),
  description: z.string().min(10, { message: "Description must be at least 10 characters" }),
  hours: z.string().refine((val) => !isNaN(Number(val)), { message: "Hours must be a number" }),
  minutes: z.string().refine((val) => !isNaN(Number(val)) && Number(val) >= 0 && Number(val) < 60, {
    message: "Minutes must be between 0 and 59",
  }),
});

// Multiple choice question schema
const multipleChoiceSchema = z.object({
  questionType: z.literal("multiple-choice"),
  questionText: z.string().min(3, { message: "Question text is required" }),
  options: z.array(z.object({
    id: z.string(),
    text: z.string().min(1, { message: "Option text is required" }),
    isCorrect: z.boolean()
  })).min(2, { message: "At least 2 options are required" }),
  points: z.string().refine((val) => !isNaN(Number(val)) && Number(val) > 0, {
    message: "Points must be a positive number",
  }),
});

// True/False question schema
const trueFalseSchema = z.object({
  questionType: z.literal("true-false"),
  questionText: z.string().min(3, { message: "Question text is required" }),
  correctAnswer: z.enum(["true", "false"], { 
    required_error: "Please select the correct answer" 
  }),
  points: z.string().refine((val) => !isNaN(Number(val)) && Number(val) > 0, {
    message: "Points must be a positive number",
  }),
});

// Short answer question schema
const shortAnswerSchema = z.object({
  questionType: z.literal("short-answer"),
  questionText: z.string().min(3, { message: "Question text is required" }),
  expectedAnswer: z.string().min(1, { message: "Expected answer is required" }),
  points: z.string().refine((val) => !isNaN(Number(val)) && Number(val) > 0, {
    message: "Points must be a positive number",
  }),
});

// Combined question schema
const questionSchema = z.discriminatedUnion("questionType", [
  multipleChoiceSchema,
  trueFalseSchema,
  shortAnswerSchema
]);

type TestFormValues = z.infer<typeof testSchema>;
type QuestionFormValues = z.infer<typeof questionSchema>;

const LecturerDashboard = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("test-details");
  const [test, setTest] = useState<TestFormValues | null>(null);
  const [questions, setQuestions] = useState<QuestionFormValues[]>([]);
  const [currentQuestionType, setCurrentQuestionType] = useState<"multiple-choice" | "true-false" | "short-answer">("multiple-choice");
  const [editingQuestionIndex, setEditingQuestionIndex] = useState<number | null>(null);
  
  // Test form
  const testForm = useForm<TestFormValues>({
    resolver: zodResolver(testSchema),
    defaultValues: {
      name: "",
      description: "",
      hours: "1",
      minutes: "30",
    },
  });
  
  // Multiple choice form
  const multipleChoiceForm = useForm<z.infer<typeof multipleChoiceSchema>>({
    resolver: zodResolver(multipleChoiceSchema),
    defaultValues: {
      questionType: "multiple-choice",
      questionText: "",
      options: [
        { id: "1", text: "", isCorrect: false },
        { id: "2", text: "", isCorrect: false },
      ],
      points: "1",
    },
  });
  
  const { fields: multipleChoiceOptions, append: appendOption, remove: removeOption } = 
    useFieldArray({
      control: multipleChoiceForm.control,
      name: "options",
    });
  
  // True/False form
  const trueFalseForm = useForm<z.infer<typeof trueFalseSchema>>({
    resolver: zodResolver(trueFalseSchema),
    defaultValues: {
      questionType: "true-false",
      questionText: "",
      correctAnswer: undefined,
      points: "1",
    },
  });
  
  // Short answer form
  const shortAnswerForm = useForm<z.infer<typeof shortAnswerSchema>>({
    resolver: zodResolver(shortAnswerSchema),
    defaultValues: {
      questionType: "short-answer",
      questionText: "",
      expectedAnswer: "",
      points: "1",
    },
  });
  
  const handleCreateTest = (data: TestFormValues) => {
    setTest(data);
    toast.success("Test details saved", {
      description: "Now you can add questions to your test.",
    });
    setActiveTab("questions");
  };
  
  const addMultipleChoiceQuestion = (data: z.infer<typeof multipleChoiceSchema>) => {
    if (editingQuestionIndex !== null) {
      // Update existing question
      const updatedQuestions = [...questions];
      updatedQuestions[editingQuestionIndex] = data;
      setQuestions(updatedQuestions);
      setEditingQuestionIndex(null);
      toast.success("Question updated", {
        description: "The question has been updated successfully.",
      });
    } else {
      // Add new question
      setQuestions([...questions, data]);
      toast.success("Question added", {
        description: "The question has been added to your test.",
      });
    }
    
    multipleChoiceForm.reset({
      questionType: "multiple-choice",
      questionText: "",
      options: [
        { id: "1", text: "", isCorrect: false },
        { id: "2", text: "", isCorrect: false },
      ],
      points: "1",
    });
  };
  
  const addTrueFalseQuestion = (data: z.infer<typeof trueFalseSchema>) => {
    if (editingQuestionIndex !== null) {
      // Update existing question
      const updatedQuestions = [...questions];
      updatedQuestions[editingQuestionIndex] = data;
      setQuestions(updatedQuestions);
      setEditingQuestionIndex(null);
      toast.success("Question updated", {
        description: "The question has been updated successfully.",
      });
    } else {
      // Add new question
      setQuestions([...questions, data]);
      toast.success("Question added", {
        description: "The question has been added to your test.",
      });
    }
    
    trueFalseForm.reset({
      questionType: "true-false",
      questionText: "",
      correctAnswer: undefined,
      points: "1",
    });
  };
  
  const addShortAnswerQuestion = (data: z.infer<typeof shortAnswerSchema>) => {
    if (editingQuestionIndex !== null) {
      // Update existing question
      const updatedQuestions = [...questions];
      updatedQuestions[editingQuestionIndex] = data;
      setQuestions(updatedQuestions);
      setEditingQuestionIndex(null);
      toast.success("Question updated", {
        description: "The question has been updated successfully.",
      });
    } else {
      // Add new question
      setQuestions([...questions, data]);
      toast.success("Question added", {
        description: "The question has been added to your test.",
      });
    }
    
    shortAnswerForm.reset({
      questionType: "short-answer",
      questionText: "",
      expectedAnswer: "",
      points: "1",
    });
  };
  
  const handleEditQuestion = (index: number) => {
    const question = questions[index];
    setCurrentQuestionType(question.questionType);
    
    setEditingQuestionIndex(index);
    
    if (question.questionType === "multiple-choice") {
      multipleChoiceForm.reset(question);
    } else if (question.questionType === "true-false") {
      trueFalseForm.reset(question);
    } else if (question.questionType === "short-answer") {
      shortAnswerForm.reset(question);
    }
  };
  
  const handleDeleteQuestion = (index: number) => {
    const updatedQuestions = [...questions];
    updatedQuestions.splice(index, 1);
    setQuestions(updatedQuestions);
    toast.success("Question deleted", {
      description: "The question has been removed from your test.",
    });
  };

  const handleSaveTest = () => {
    if (!test) {
      toast.error("Test details missing", {
        description: "Please fill in the test details first.",
      });
      setActiveTab("test-details");
      return;
    }
    
    if (questions.length === 0) {
      toast.error("No questions added", {
        description: "Please add at least one question to your test.",
      });
      return;
    }
    
    // Here you would normally save the test to your backend
    toast.success("Test saved successfully", {
      description: "Your test has been created and saved.",
    });
    
    console.log("Saving test:", {
      ...test,
      questions,
    });
    
    // Optional: Reset and navigate back
    // navigate("/lecturer/tests");
  };
  
  return (
    <div className="min-h-screen bg-eduPrimary-light py-16 px-4 md:px-8">
      <div className="container mx-auto max-w-5xl pt-12">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-eduText-dark">Lecturer Dashboard</h1>
            <p className="text-eduText-light mt-2">Create and manage tests</p>
          </div>
          <Button 
            variant="primary" 
            to="/"
            className="mt-4 md:mt-0"
          >
            Back to Home
          </Button>
        </div>
        
        <GlassCard className="mb-8 p-6">
          <Tabs defaultValue="test-details" value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="test-details" className="flex items-center">
                <BookOpen className="mr-2 h-4 w-4" />
                Test Details
              </TabsTrigger>
              <TabsTrigger value="questions" className="flex items-center">
                <List className="mr-2 h-4 w-4" />
                Questions {questions.length > 0 && `(${questions.length})`}
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="test-details" className="pt-4">
              <Form {...testForm}>
                <form onSubmit={testForm.handleSubmit(handleCreateTest)} className="space-y-6">
                  <FormField
                    control={testForm.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Test Name</FormLabel>
                        <FormControl>
                          <Input placeholder="Enter test name" {...field} />
                        </FormControl>
                        <FormDescription>
                          Provide a descriptive name for your test.
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={testForm.control}
                    name="description"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Test Description</FormLabel>
                        <FormControl>
                          <Textarea 
                            placeholder="Enter test description" 
                            className="resize-none h-24"
                            {...field} 
                          />
                        </FormControl>
                        <FormDescription>
                          Provide details about what the test covers.
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <div>
                    <FormLabel>Test Duration</FormLabel>
                    <div className="flex items-center gap-4 mt-2">
                      <div className="w-1/2">
                        <FormField
                          control={testForm.control}
                          name="hours"
                          render={({ field }) => (
                            <FormItem>
                              <FormControl>
                                <div className="flex items-center">
                                  <Input type="number" min="0" {...field} />
                                  <span className="ml-2">Hours</span>
                                </div>
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                      
                      <div className="w-1/2">
                        <FormField
                          control={testForm.control}
                          name="minutes"
                          render={({ field }) => (
                            <FormItem>
                              <FormControl>
                                <div className="flex items-center">
                                  <Input type="number" min="0" max="59" {...field} />
                                  <span className="ml-2">Minutes</span>
                                </div>
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                    </div>
                    <FormDescription className="mt-1">
                      Set how long students will have to complete the test.
                    </FormDescription>
                  </div>
                  
                  <div className="flex justify-end">
                    <Button type="submit" variant="primary">
                      Save Test Details
                    </Button>
                  </div>
                </form>
              </Form>
            </TabsContent>
            
            <TabsContent value="questions" className="pt-4">
              {!test && (
                <div className="text-center py-12">
                  <HelpCircle className="mx-auto h-12 w-12 text-eduText-light opacity-50" />
                  <h3 className="mt-4 text-lg font-medium">Test Details Required</h3>
                  <p className="mt-2 text-eduText-light">
                    Please fill in the test details first before adding questions.
                  </p>
                  <Button 
                    variant="primary" 
                    className="mt-4"
                    onClick={() => setActiveTab("test-details")}
                  >
                    Go to Test Details
                  </Button>
                </div>
              )}
              
              {test && (
                <>
                  <div className="flex flex-wrap justify-between items-center mb-6">
                    <div>
                      <h3 className="text-xl font-semibold">{test.name}</h3>
                      <p className="text-sm text-eduText-light mt-1">
                        Duration: {test.hours} hours {test.minutes} minutes
                      </p>
                    </div>
                    
                    <div className="flex gap-2 mt-4 sm:mt-0">
                      <Select
                        value={currentQuestionType}
                        onValueChange={(value: "multiple-choice" | "true-false" | "short-answer") => {
                          setCurrentQuestionType(value);
                          if (editingQuestionIndex !== null) {
                            setEditingQuestionIndex(null);
                            multipleChoiceForm.reset({
                              questionType: "multiple-choice",
                              questionText: "",
                              options: [
                                { id: "1", text: "", isCorrect: false },
                                { id: "2", text: "", isCorrect: false },
                              ],
                              points: "1",
                            });
                            trueFalseForm.reset({
                              questionType: "true-false",
                              questionText: "",
                              correctAnswer: undefined,
                              points: "1",
                            });
                            shortAnswerForm.reset({
                              questionType: "short-answer",
                              questionText: "",
                              expectedAnswer: "",
                              points: "1",
                            });
                          }
                        }}
                      >
                        <SelectTrigger className="w-[180px]">
                          <SelectValue placeholder="Question type" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="multiple-choice">Multiple Choice</SelectItem>
                          <SelectItem value="true-false">True/False</SelectItem>
                          <SelectItem value="short-answer">Short Answer</SelectItem>
                        </SelectContent>
                      </Select>
                      
                      <Button 
                        variant="primary" 
                        onClick={handleSaveTest}
                        icon={<Save className="w-4 h-4" />}
                      >
                        Save Test
                      </Button>
                    </div>
                  </div>
                  
                  <div className="bg-white rounded-lg p-4 mb-6">
                    {currentQuestionType === "multiple-choice" && (
                      <Form {...multipleChoiceForm}>
                        <form onSubmit={multipleChoiceForm.handleSubmit(addMultipleChoiceQuestion)} className="space-y-4">
                          <div className="flex justify-between items-center">
                            <h4 className="text-lg font-medium">
                              {editingQuestionIndex !== null ? "Edit Multiple Choice Question" : "Add Multiple Choice Question"}
                            </h4>
                            {editingQuestionIndex !== null && (
                              <Button 
                                type="button" 
                                variant="ghost" 
                                size="sm"
                                onClick={() => {
                                  setEditingQuestionIndex(null);
                                  multipleChoiceForm.reset({
                                    questionType: "multiple-choice",
                                    questionText: "",
                                    options: [
                                      { id: "1", text: "", isCorrect: false },
                                      { id: "2", text: "", isCorrect: false },
                                    ],
                                    points: "1",
                                  });
                                }}
                              >
                                Cancel Edit
                              </Button>
                            )}
                          </div>
                          
                          <FormField
                            control={multipleChoiceForm.control}
                            name="questionText"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Question</FormLabel>
                                <FormControl>
                                  <Textarea 
                                    placeholder="Enter your question" 
                                    className="resize-none"
                                    {...field} 
                                  />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          
                          <div>
                            <div className="flex justify-between items-center mb-2">
                              <FormLabel>Answer Options</FormLabel>
                              <Button
                                type="button"
                                variant="ghost"
                                size="sm"
                                onClick={() => appendOption({ id: crypto.randomUUID(), text: "", isCorrect: false })}
                                icon={<Plus className="w-4 h-4" />}
                              >
                                Add Option
                              </Button>
                            </div>
                            
                            {multipleChoiceOptions.map((field, index) => (
                              <div key={field.id} className="flex items-center gap-2 mb-2">
                                <FormField
                                  control={multipleChoiceForm.control}
                                  name={`options.${index}.isCorrect`}
                                  render={({ field }) => (
                                    <FormItem className="flex items-center space-x-2">
                                      <FormControl>
                                        <Switch
                                          checked={field.value}
                                          onCheckedChange={field.onChange}
                                        />
                                      </FormControl>
                                    </FormItem>
                                  )}
                                />
                                
                                <FormField
                                  control={multipleChoiceForm.control}
                                  name={`options.${index}.text`}
                                  render={({ field }) => (
                                    <FormItem className="flex-1">
                                      <FormControl>
                                        <Input placeholder={`Option ${index + 1}`} {...field} />
                                      </FormControl>
                                      <FormMessage />
                                    </FormItem>
                                  )}
                                />
                                
                                {multipleChoiceOptions.length > 2 && (
                                  <Button
                                    type="button"
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => removeOption(index)}
                                    className="text-red-500 hover:text-red-700 p-1"
                                  >
                                    <Trash2 className="w-4 h-4" />
                                  </Button>
                                )}
                              </div>
                            ))}
                          </div>
                          
                          <FormField
                            control={multipleChoiceForm.control}
                            name="points"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Points</FormLabel>
                                <FormControl>
                                  <Input type="number" min="1" {...field} />
                                </FormControl>
                                <FormDescription>
                                  Points awarded for correct answer.
                                </FormDescription>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          
                          <div className="flex justify-end">
                            <Button type="submit" variant="primary">
                              {editingQuestionIndex !== null ? "Update Question" : "Add Question"}
                            </Button>
                          </div>
                        </form>
                      </Form>
                    )}
                    
                    {currentQuestionType === "true-false" && (
                      <Form {...trueFalseForm}>
                        <form onSubmit={trueFalseForm.handleSubmit(addTrueFalseQuestion)} className="space-y-4">
                          <div className="flex justify-between items-center">
                            <h4 className="text-lg font-medium">
                              {editingQuestionIndex !== null ? "Edit True/False Question" : "Add True/False Question"}
                            </h4>
                            {editingQuestionIndex !== null && (
                              <Button 
                                type="button" 
                                variant="ghost" 
                                size="sm"
                                onClick={() => {
                                  setEditingQuestionIndex(null);
                                  trueFalseForm.reset({
                                    questionType: "true-false",
                                    questionText: "",
                                    correctAnswer: undefined,
                                    points: "1",
                                  });
                                }}
                              >
                                Cancel Edit
                              </Button>
                            )}
                          </div>
                          
                          <FormField
                            control={trueFalseForm.control}
                            name="questionText"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Question</FormLabel>
                                <FormControl>
                                  <Textarea 
                                    placeholder="Enter your question" 
                                    className="resize-none"
                                    {...field} 
                                  />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          
                          <FormField
                            control={trueFalseForm.control}
                            name="correctAnswer"
                            render={({ field }) => (
                              <FormItem className="space-y-3">
                                <FormLabel>Correct Answer</FormLabel>
                                <FormControl>
                                  <RadioGroup
                                    onValueChange={field.onChange}
                                    defaultValue={field.value}
                                    className="flex space-x-4"
                                  >
                                    <div className="flex items-center space-x-2">
                                      <RadioGroupItem value="true" id="true" />
                                      <Label htmlFor="true">True</Label>
                                    </div>
                                    <div className="flex items-center space-x-2">
                                      <RadioGroupItem value="false" id="false" />
                                      <Label htmlFor="false">False</Label>
                                    </div>
                                  </RadioGroup>
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          
                          <FormField
                            control={trueFalseForm.control}
                            name="points"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Points</FormLabel>
                                <FormControl>
                                  <Input type="number" min="1" {...field} />
                                </FormControl>
                                <FormDescription>
                                  Points awarded for correct answer.
                                </FormDescription>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          
                          <div className="flex justify-end">
                            <Button type="submit" variant="primary">
                              {editingQuestionIndex !== null ? "Update Question" : "Add Question"}
                            </Button>
                          </div>
                        </form>
                      </Form>
                    )}
                    
                    {currentQuestionType === "short-answer" && (
                      <Form {...shortAnswerForm}>
                        <form onSubmit={shortAnswerForm.handleSubmit(addShortAnswerQuestion)} className="space-y-4">
                          <div className="flex justify-between items-center">
                            <h4 className="text-lg font-medium">
                              {editingQuestionIndex !== null ? "Edit Short Answer Question" : "Add Short Answer Question"}
                            </h4>
                            {editingQuestionIndex !== null && (
                              <Button 
                                type="button" 
                                variant="ghost" 
                                size="sm"
                                onClick={() => {
                                  setEditingQuestionIndex(null);
                                  shortAnswerForm.reset({
                                    questionType: "short-answer",
                                    questionText: "",
                                    expectedAnswer: "",
                                    points: "1",
                                  });
                                }}
                              >
                                Cancel Edit
                              </Button>
                            )}
                          </div>
                          
                          <FormField
                            control={shortAnswerForm.control}
                            name="questionText"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Question</FormLabel>
                                <FormControl>
                                  <Textarea 
                                    placeholder="Enter your question" 
                                    className="resize-none"
                                    {...field} 
                                  />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          
                          <FormField
                            control={shortAnswerForm.control}
                            name="expectedAnswer"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Expected Answer</FormLabel>
                                <FormControl>
                                  <Textarea 
                                    placeholder="Enter the expected answer" 
                                    className="resize-none"
                                    {...field} 
                                  />
                                </FormControl>
                                <FormDescription>
                                  The answer that will be used to grade the student's response.
                                </FormDescription>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          
                          <FormField
                            control={shortAnswerForm.control}
                            name="points"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Points</FormLabel>
                                <FormControl>
                                  <Input type="number" min="1" {...field} />
                                </FormControl>
                                <FormDescription>
                                  Points awarded for correct answer.
                                </FormDescription>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          
                          <div className="flex justify-end">
                            <Button type="submit" variant="primary">
                              {editingQuestionIndex !== null ? "Update Question" : "Add Question"}
                            </Button>
                          </div>
                        </form>
                      </Form>
                    )}
                  </div>
                  
                  {questions.length > 0 ? (
                    <div>
                      <h4 className="text-lg font-medium mb-4">Added Questions ({questions.length})</h4>
                      <div className="space-y-4">
                        {questions.map((question, index) => (
                          <div key={index} className="bg-white rounded-lg p-4 shadow-soft border border-eduPrimary">
                            <div className="flex justify-between items-start">
                              <div>
                                <div className="flex items-center gap-2">
                                  <span className="text-eduText-light">#{index + 1}</span>
                                  <span className="px-2 py-0.5 rounded text-xs font-medium bg-eduPrimary text-eduText-dark">
                                    {question.questionType === "multiple-choice" 
                                      ? "Multiple Choice" 
                                      : question.questionType === "true-false" 
                                        ? "True/False" 
                                        : "Short Answer"}
                                  </span>
                                  <span className="px-2 py-0.5 rounded text-xs font-medium bg-eduAccent-light text-eduAccent-dark">
                                    {question.points} {Number(question.points) === 1 ? "point" : "points"}
                                  </span>
                                </div>
                                <p className="mt-2 font-medium">{question.questionText}</p>
                                
                                {question.questionType === "multiple-choice" && (
                                  <div className="mt-2 pl-4">
                                    {question.options.map((option, i) => (
                                      <div key={i} className="flex items-center gap-2 text-sm mt-1">
                                        {option.isCorrect ? (
                                          <Check className="h-4 w-4 text-green-500" />
                                        ) : (
                                          <span className="ml-4"></span>
                                        )}
                                        <span>{option.text}</span>
                                      </div>
                                    ))}
                                  </div>
                                )}
                                
                                {question.questionType === "true-false" && (
                                  <div className="mt-2 pl-4 text-sm">
                                    Correct answer: <span className="font-semibold">{question.correctAnswer}</span>
                                  </div>
                                )}
                                
                                {question.questionType === "short-answer" && (
                                  <div className="mt-2 pl-4 text-sm">
                                    Expected answer: <span className="font-semibold">{question.expectedAnswer}</span>
                                  </div>
                                )}
                              </div>
                              
                              <div className="flex gap-1">
                                <Button
                                  type="button"
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => handleEditQuestion(index)}
                                  className="p-1"
                                >
                                  <Edit2 className="h-4 w-4 text-blue-500" />
                                </Button>
                                <Button
                                  type="button"
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => handleDeleteQuestion(index)}
                                  className="p-1"
                                >
                                  <Trash2 className="h-4 w-4 text-red-500" />
                                </Button>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  ) : (
                    <div className="text-center py-8 bg-white rounded-lg">
                      <List className="mx-auto h-12 w-12 text-eduText-light opacity-50" />
                      <h3 className="mt-4 text-lg font-medium">No Questions Yet</h3>
                      <p className="mt-2 text-eduText-light">
                        Add questions to your test using the form above.
                      </p>
                    </div>
                  )}
                </>
              )}
            </TabsContent>
          </Tabs>
        </GlassCard>
      </div>
    </div>
  );
};

export default LecturerDashboard;
