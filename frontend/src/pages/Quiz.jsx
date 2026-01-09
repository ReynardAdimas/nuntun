import { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"

export default function Quiz() {
  const [questions, setQuestions] = useState([]);
  const [currentIdx, setCurrentIdx] = useState(0);
  const [userTags, setUserTags] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const API_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:8080";

  useEffect(() => {
    axios.get(`${API_URL}/api/questions`)
      .then(res => {
        setQuestions(res.data);
        setLoading(false);
      })
      .catch(err => {
        console.error("Gagal koneksi ke backend:", err);
        alert("Pastikan Backend FastAPI sudah jalan!");
      });
  }, []);

  const handleAnswer = (tagsString) => {
    const newTags = tagsString.split(" ");
    const updatedTags = [...userTags, ...newTags];
    setUserTags(updatedTags);
    if (currentIdx < questions.length - 1) {
      setCurrentIdx(currentIdx + 1);
    } else {
      navigate('/result', { state: { tags: updatedTags } });
    }
  };

  if (loading) return <div className="text-white animate-pulse">Sedang memuat pertanyaan...</div>;

  const question = questions[currentIdx];
  const progressValue = ((currentIdx + 1) / questions.length) * 100;

  return (
    <div className="w-full max-w-xl space-y-6">
      <div className="space-y-2">
        <div className="flex justify-between text-sm text-slate-400">
          <span>Pertanyaan {currentIdx + 1} dari {questions.length}</span>
          <span>{Math.round(progressValue)}%</span>
        </div>
        <Progress value={progressValue} className="h-2" />
      </div>
      <motion.div
        key={currentIdx}
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.3 }}
      >
        <Card className="border-slate-800 bg-slate-900/50 backdrop-blur-sm shadow-xl">
          <CardHeader>
            <CardTitle className="text-2xl text-center leading-relaxed text-white">
              {question.text}
            </CardTitle>
          </CardHeader>
          <CardContent className="grid gap-3">
            {question.options.map((opt, idx) => (
              <Button
                key={idx}
                variant="outline"
                className="w-full h-auto py-4 justify-start text-left text-base text-slate-200 border-slate-700 hover:bg-blue-600 hover:text-white hover:border-blue-500 transition-all whitespace-normal"
                onClick={() => handleAnswer(opt.tags)}
              >
                {opt.answer}
              </Button>
            ))}
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}