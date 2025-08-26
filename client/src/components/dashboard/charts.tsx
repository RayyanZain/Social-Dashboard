import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line } from "recharts";
import { Skeleton } from "@/components/ui/skeleton";

interface ChartsProps {
  brandStats?: Array<{ brand_name: string; post_count: number; brand_id: string }>;
  metrics?: {
    totalPosts: number;
    instagramPosts: number;
    tiktokPosts: number;
    linkedinPosts: number;
    twitterPosts: number;
  };
  loading?: boolean;
}

const COLORS = ['#E91E63', '#0077B5', '#000000', '#1DA1F2'];

export default function Charts({ brandStats, metrics, loading }: ChartsProps) {
  const platformData = metrics ? [
    { name: 'Instagram', value: metrics.instagramPosts, color: '#E91E63' },
    { name: 'LinkedIn', value: metrics.linkedinPosts, color: '#0077B5' },
    { name: 'TikTok', value: metrics.tiktokPosts, color: '#000000' },
    { name: 'Twitter', value: metrics.twitterPosts, color: '#1DA1F2' },
  ] : [];

  const trendData = [
    { month: 'Jan', posts: 65 },
    { month: 'Feb', posts: 78 },
    { month: 'Mar', posts: 90 },
    { month: 'Apr', posts: 81 },
    { month: 'May', posts: 95 },
    { month: 'Jun', posts: 105 },
    { month: 'Jul', posts: 112 },
    { month: 'Aug', posts: 98 },
    { month: 'Sep', posts: 87 },
    { month: 'Oct', posts: 93 },
    { month: 'Nov', posts: 108 },
    { month: 'Dec', posts: 115 },
  ];

  if (loading) {
    return (
      <>
        <Card>
          <CardHeader>
            <CardTitle>Posts per Brand</CardTitle>
          </CardHeader>
          <CardContent>
            <Skeleton className="h-64 w-full" />
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Posts Trend</CardTitle>
          </CardHeader>
          <CardContent>
            <Skeleton className="h-64 w-full" />
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Platform Distribution</CardTitle>
          </CardHeader>
          <CardContent>
            <Skeleton className="h-64 w-full" />
          </CardContent>
        </Card>
      </>
    );
  }

  return (
    <>
      {/* Posts per Brand Chart */}
      <Card data-testid="chart-posts-per-brand">
        <CardHeader>
          <CardTitle>Posts per Brand</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={brandStats?.slice(0, 5) || []}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis 
                  dataKey="brand_name" 
                  tick={{ fontSize: 12 }}
                  axisLine={false}
                />
                <YAxis 
                  tick={{ fontSize: 12 }}
                  axisLine={false}
                />
                <Tooltip 
                  contentStyle={{
                    backgroundColor: '#fff',
                    border: '1px solid #e2e8f0',
                    borderRadius: '8px',
                  }}
                />
                <Bar 
                  dataKey="post_count" 
                  fill="hsl(203.8863, 88.2845%, 53.1373%)"
                  radius={[4, 4, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      {/* Posts Trend Chart */}
      <Card data-testid="chart-posts-trend">
        <CardHeader>
          <CardTitle>Posts Trend</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={trendData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis 
                  dataKey="month" 
                  tick={{ fontSize: 12 }}
                  axisLine={false}
                />
                <YAxis 
                  tick={{ fontSize: 12 }}
                  axisLine={false}
                />
                <Tooltip 
                  contentStyle={{
                    backgroundColor: '#fff',
                    border: '1px solid #e2e8f0',
                    borderRadius: '8px',
                  }}
                />
                <Line 
                  type="monotone" 
                  dataKey="posts" 
                  stroke="hsl(203.8863, 88.2845%, 53.1373%)"
                  strokeWidth={2}
                  dot={{ fill: 'hsl(203.8863, 88.2845%, 53.1373%)', strokeWidth: 2, r: 4 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      {/* Platform Distribution Chart */}
      <Card data-testid="chart-platform-distribution">
        <CardHeader>
          <CardTitle>Platform Distribution</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={platformData}
                  cx="50%"
                  cy="50%"
                  innerRadius={40}
                  outerRadius={80}
                  paddingAngle={2}
                  dataKey="value"
                >
                  {platformData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{
                    backgroundColor: '#fff',
                    border: '1px solid #e2e8f0',
                    borderRadius: '8px',
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="flex justify-center mt-4 space-x-4">
            {platformData.map((entry, index) => (
              <div key={entry.name} className="flex items-center text-xs">
                <div 
                  className="w-3 h-3 rounded-full mr-1" 
                  style={{ backgroundColor: entry.color }}
                />
                <span>{entry.name}</span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </>
  );
}
