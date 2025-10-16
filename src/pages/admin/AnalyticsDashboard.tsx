import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Activity, ShoppingCart, Eye, TrendingUp, Users, Clock } from 'lucide-react';
import { format, subDays } from 'date-fns';

export default function AnalyticsDashboard() {
  const { data: stats, isLoading } = useQuery({
    queryKey: ['analytics-stats'],
    queryFn: async () => {
      const sevenDaysAgo = subDays(new Date(), 7).toISOString();
      
      // Get total events
      const { count: totalEvents } = await supabase
        .from('analytics_events')
        .select('*', { count: 'exact', head: true });

      // Get page views
      const { count: pageViews } = await supabase
        .from('analytics_events')
        .select('*', { count: 'exact', head: true })
        .eq('event_type', 'page_view');

      // Get conversions
      const { count: conversions } = await supabase
        .from('analytics_events')
        .select('*', { count: 'exact', head: true })
        .eq('event_type', 'conversion');

      // Get cart actions
      const { count: cartActions } = await supabase
        .from('analytics_events')
        .select('*', { count: 'exact', head: true })
        .eq('event_type', 'cart');

      // Get unique users (last 7 days)
      const { data: uniqueUsers } = await supabase
        .from('analytics_events')
        .select('user_id')
        .gte('created_at', sevenDaysAgo)
        .not('user_id', 'is', null);

      const uniqueUserCount = new Set(uniqueUsers?.map(u => u.user_id)).size;

      // Get top pages
      const { data: topPages } = await supabase
        .from('analytics_events')
        .select('page_url')
        .eq('event_type', 'page_view')
        .gte('created_at', sevenDaysAgo)
        .limit(1000);

      const pageCount: { [key: string]: number } = {};
      topPages?.forEach(p => {
        pageCount[p.page_url] = (pageCount[p.page_url] || 0) + 1;
      });

      const sortedPages = Object.entries(pageCount)
        .sort(([, a], [, b]) => b - a)
        .slice(0, 10);

      // Get recent events
      const { data: recentEvents } = await supabase
        .from('analytics_events')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(50);

      return {
        totalEvents: totalEvents || 0,
        pageViews: pageViews || 0,
        conversions: conversions || 0,
        cartActions: cartActions || 0,
        uniqueUsers: uniqueUserCount,
        topPages: sortedPages,
        recentEvents: recentEvents || []
      };
    }
  });

  const { data: performanceStats } = useQuery({
    queryKey: ['performance-stats'],
    queryFn: async () => {
      const sevenDaysAgo = subDays(new Date(), 7).toISOString();
      
      const { data } = await supabase
        .from('performance_metrics')
        .select('metric_name, metric_value')
        .gte('created_at', sevenDaysAgo);

      if (!data) return {};

      const avgMetrics: { [key: string]: number } = {};
      const metricCounts: { [key: string]: number } = {};

      data.forEach(m => {
        avgMetrics[m.metric_name] = (avgMetrics[m.metric_name] || 0) + m.metric_value;
        metricCounts[m.metric_name] = (metricCounts[m.metric_name] || 0) + 1;
      });

      Object.keys(avgMetrics).forEach(key => {
        avgMetrics[key] = Math.round(avgMetrics[key] / metricCounts[key]);
      });

      return avgMetrics;
    }
  });

  if (isLoading) {
    return (
      <div className="container mx-auto p-6">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-muted rounded w-1/4" />
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="h-32 bg-muted rounded" />
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Analytics Dashboard</h1>
        <p className="text-muted-foreground">Track user behavior and site performance</p>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Events</CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats?.totalEvents.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">All tracked events</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Page Views</CardTitle>
            <Eye className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats?.pageViews.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">Total page visits</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Conversions</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats?.conversions.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">Completed purchases</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Unique Users</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats?.uniqueUsers.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">Last 7 days</p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="events" className="space-y-4">
        <TabsList>
          <TabsTrigger value="events">Events</TabsTrigger>
          <TabsTrigger value="pages">Top Pages</TabsTrigger>
          <TabsTrigger value="performance">Performance</TabsTrigger>
        </TabsList>

        <TabsContent value="events" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Recent Events</CardTitle>
              <CardDescription>Latest user interactions tracked</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {stats?.recentEvents.slice(0, 20).map((event: any) => (
                  <div key={event.id} className="flex items-center justify-between border-b pb-2">
                    <div className="flex-1">
                      <p className="font-medium">{event.event_name}</p>
                      <p className="text-sm text-muted-foreground">{event.page_url}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-medium">{event.event_type}</p>
                      <p className="text-xs text-muted-foreground">
                        {format(new Date(event.created_at), 'MMM d, HH:mm')}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="pages" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Top Pages</CardTitle>
              <CardDescription>Most visited pages (last 7 days)</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {stats?.topPages.map(([url, count]: [string, number]) => (
                  <div key={url} className="flex items-center justify-between border-b pb-2">
                    <p className="font-medium">{url}</p>
                    <p className="text-sm text-muted-foreground">{count} views</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="performance" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Performance Metrics</CardTitle>
              <CardDescription>Average page load times (last 7 days)</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {performanceStats && Object.entries(performanceStats).map(([name, value]) => (
                  <div key={name} className="flex items-center justify-between border-b pb-2">
                    <p className="font-medium">{name}</p>
                    <p className="text-sm text-muted-foreground">{value}ms</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
