import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Download, Search, Users, Mail, PhoneCall, TrendingUp } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { format } from "date-fns";

export default function ContactManagement() {
  const { toast } = useToast();
  const [searchQuery, setSearchQuery] = useState("");
  const [sourceFilter, setSourceFilter] = useState<string>("all");
  const [subscriptionFilter, setSubscriptionFilter] = useState<string>("all");

  const { data: contacts, isLoading } = useQuery({
    queryKey: ["admin-contacts", searchQuery, sourceFilter, subscriptionFilter],
    queryFn: async () => {
      let query = supabase
        .from("contacts")
        .select("*")
        .order("created_at", { ascending: false });

      if (searchQuery) {
        query = query.or(`full_name.ilike.%${searchQuery}%,email.ilike.%${searchQuery}%`);
      }

      if (sourceFilter !== "all") {
        query = query.eq("source", sourceFilter);
      }

      if (subscriptionFilter === "subscribed") {
        query = query.eq("subscribed", true);
      } else if (subscriptionFilter === "unsubscribed") {
        query = query.eq("subscribed", false);
      }

      const { data, error } = await query;
      if (error) throw error;
      return data;
    },
  });

  const { data: stats } = useQuery({
    queryKey: ["contact-stats"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("contacts")
        .select("subscribed, source, created_at");
      
      if (error) throw error;

      const totalContacts = data.length;
      const subscribedCount = data.filter(c => c.subscribed).length;
      const sources = [...new Set(data.map(c => c.source))].length;
      
      // Calculate growth (contacts in last 7 days)
      const sevenDaysAgo = new Date();
      sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
      const recentContacts = data.filter(c => new Date(c.created_at) > sevenDaysAgo).length;

      return {
        total: totalContacts,
        subscribed: subscribedCount,
        sources,
        recentGrowth: recentContacts,
      };
    },
  });

  const exportToCSV = () => {
    if (!contacts || contacts.length === 0) {
      toast({
        title: "No data to export",
        description: "There are no contacts matching your filters.",
        variant: "destructive",
      });
      return;
    }

    const headers = ["Name", "Email", "Phone", "Source", "Subscribed", "Date Added"];
    const rows = contacts.map(c => [
      c.full_name,
      c.email,
      c.phone_number || "",
      c.source || "",
      c.subscribed ? "Yes" : "No",
      format(new Date(c.created_at), "yyyy-MM-dd HH:mm"),
    ]);

    const csvContent = [
      headers.join(","),
      ...rows.map(row => row.map(cell => `"${cell}"`).join(",")),
    ].join("\n");

    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `contacts-${format(new Date(), "yyyy-MM-dd")}.csv`;
    a.click();

    toast({
      title: "Export successful",
      description: `Exported ${contacts.length} contacts to CSV.`,
    });
  };

  // Get unique sources for filter
  const uniqueSources = contacts 
    ? [...new Set(contacts.map(c => c.source).filter(Boolean))]
    : [];

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-1 container py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Contact Management</h1>
          <p className="text-muted-foreground">
            Manage and export your captured leads
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Contacts</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats?.total || 0}</div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Subscribed</CardTitle>
              <Mail className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats?.subscribed || 0}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Sources</CardTitle>
              <PhoneCall className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats?.sources || 0}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Last 7 Days</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats?.recentGrowth || 0}</div>
            </CardContent>
          </Card>
        </div>

        {/* Filters and Search */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Filters</CardTitle>
            <CardDescription>Search and filter your contacts</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search by name or email..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
              
              <Select value={sourceFilter} onValueChange={setSourceFilter}>
                <SelectTrigger className="w-full md:w-[200px]">
                  <SelectValue placeholder="Filter by source" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Sources</SelectItem>
                  {uniqueSources.map(source => (
                    <SelectItem key={source} value={source}>
                      {source}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select value={subscriptionFilter} onValueChange={setSubscriptionFilter}>
                <SelectTrigger className="w-full md:w-[200px]">
                  <SelectValue placeholder="Filter by status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="subscribed">Subscribed</SelectItem>
                  <SelectItem value="unsubscribed">Unsubscribed</SelectItem>
                </SelectContent>
              </Select>

              <Button onClick={exportToCSV} variant="outline">
                <Download className="mr-2 h-4 w-4" />
                Export CSV
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Contacts Table */}
        <Card>
          <CardHeader>
            <CardTitle>Contacts</CardTitle>
            <CardDescription>
              {contacts?.length || 0} contact{contacts?.length !== 1 ? 's' : ''} found
            </CardDescription>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="text-center py-8 text-muted-foreground">Loading contacts...</div>
            ) : contacts && contacts.length > 0 ? (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Name</TableHead>
                      <TableHead>Email</TableHead>
                      <TableHead>Phone</TableHead>
                      <TableHead>Source</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Date Added</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {contacts.map((contact) => (
                      <TableRow key={contact.id}>
                        <TableCell className="font-medium">{contact.full_name}</TableCell>
                        <TableCell>{contact.email}</TableCell>
                        <TableCell>{contact.phone_number || "—"}</TableCell>
                        <TableCell>
                          {contact.source ? (
                            <Badge variant="secondary" className="text-xs">
                              {contact.source}
                            </Badge>
                          ) : "—"}
                        </TableCell>
                        <TableCell>
                          {contact.subscribed ? (
                            <Badge variant="default" className="text-xs">Subscribed</Badge>
                          ) : (
                            <Badge variant="outline" className="text-xs">Unsubscribed</Badge>
                          )}
                        </TableCell>
                        <TableCell className="text-sm text-muted-foreground">
                          {format(new Date(contact.created_at), "MMM d, yyyy")}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            ) : (
              <div className="text-center py-8 text-muted-foreground">
                No contacts found matching your filters.
              </div>
            )}
          </CardContent>
        </Card>
      </main>

      <Footer />
    </div>
  );
}
