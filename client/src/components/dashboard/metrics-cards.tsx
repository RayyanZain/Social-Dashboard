import { Card, CardContent } from "@/components/ui/card";
import { BarChart3, Instagram, Hash, Linkedin, Twitter, TrendingUp } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

interface MetricsCardsProps {
  metrics?: {
    totalPosts: number;
    instagramPosts: number;
    tiktokPosts: number;
    linkedinPosts: number;
    twitterPosts: number;
  };
  loading?: boolean;
}

export default function MetricsCards({ metrics, loading }: MetricsCardsProps) {
  const cards = [
    {
      title: "Total Posts",
      value: metrics?.totalPosts || 0,
      icon: BarChart3,
      color: "bg-primary/10 text-primary",
      testId: "metric-total-posts",
    },
    {
      title: "Instagram",
      value: metrics?.instagramPosts || 0,
      icon: Instagram,
      color: "bg-pink-100 text-pink-600",
      testId: "metric-instagram-posts",
    },
    {
      title: "TikTok",
      value: metrics?.tiktokPosts || 0,
      icon: Hash,
      color: "bg-black/10 text-black",
      testId: "metric-tiktok-posts",
    },
    {
      title: "LinkedIn",
      value: metrics?.linkedinPosts || 0,
      icon: Linkedin,
      color: "bg-blue-100 text-blue-600",
      testId: "metric-linkedin-posts",
    },
    {
      title: "Twitter",
      value: metrics?.twitterPosts || 0,
      icon: Twitter,
      color: "bg-sky-100 text-sky-600",
      testId: "metric-twitter-posts",
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
      {cards.map((card) => {
        const Icon = card.icon;
        return (
          <Card key={card.title} className="hover:shadow-md transition-shadow duration-200">
            <CardContent className="p-6">
              <div className="flex items-center">
                <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${card.color}`}>
                  <Icon className="h-6 w-6" />
                </div>
                <div className="ml-4 flex-1">
                  <p className="text-sm font-medium text-muted-foreground">{card.title}</p>
                  {loading ? (
                    <Skeleton className="h-8 w-16 mt-1" />
                  ) : (
                    <p className="text-2xl font-bold text-foreground" data-testid={card.testId}>
                      {card.value.toLocaleString()}
                    </p>
                  )}
                  <p className="text-xs text-success flex items-center mt-1">
                    <TrendingUp className="h-3 w-3 mr-1" />
                    Active
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
