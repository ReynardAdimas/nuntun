import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"

export default function Result() {
  const { state } = useLocation();
  const navigate = useNavigate();
  const [recommendations, setRecommendations] = useState([]);
  const [loading, setLoading] = useState(true);
  const API_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:8080";

  useEffect(() => {
    if (!state?.tags) {
      navigate('/');
      return;
    }

    const fetchRecommendation = async () => {
      try {
        const res = await axios.post(`${API_URL}/api/recommend`, {
          tags: state.tags
        });
        setRecommendations(res.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchRecommendation();
  }, [state, navigate]);

  if (loading) return (
    <div className="flex flex-col items-center justify-center space-y-4">
      <div className="text-4xl animate-bounce">🤖</div>
      <p className="text-slate-400 animate-pulse">Sedang menganalisis profilmu...</p>
    </div>
  );

  return (
    <div className="w-full max-w-2xl space-y-8 py-10">
      <div className="text-center space-y-2">
        <h2 className="text-3xl font-bold tracking-tight text-white">Hasil Analisis</h2>
        <p className="text-slate-400">Berikut adalah karir yang paling cocok dengan pola jawabanmu.</p>
      </div>
      
      <div className="grid gap-4">
        {recommendations.map((job, idx) => (
          <Card key={idx} className="border-slate-800 bg-slate-900 hover:border-blue-500/50 transition-colors">
            <CardHeader className="pb-3">
              <div className="flex justify-between items-start">
                <CardTitle className="text-xl font-bold text-blue-400">
                  {job.title}
                </CardTitle>
                <Badge variant={idx === 0 ? "default" : "secondary"} className="text-sm">
                  {(job.match_score * 100).toFixed(0)}% Match
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              <CardDescription className="text-slate-300 leading-relaxed text-sm">
                {job.description}
              </CardDescription>
            </CardContent>
            {idx !== recommendations.length - 1 && <Separator className="bg-slate-800" />}
          </Card>
        ))}
      </div>

      <div className="text-center pt-6">
        <Button variant="ghost" className="text-slate-400 hover:text-white" onClick={() => navigate('/')}>
          ↺ Ulangi Tes
        </Button>
      </div>
    </div>
  );
}