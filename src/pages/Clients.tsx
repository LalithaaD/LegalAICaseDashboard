import { useState } from 'react';
import { DashboardLayout } from '@/components/dashboard/DashboardLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { AddClientModal } from '@/components/modals/AddClientModal';
import { EditClientModal } from '@/components/modals/EditClientModal';
import { useAppStore } from '@/store/useAppStore';
import { Plus, Search, Download, Users, DollarSign, Briefcase, Edit } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

export default function Clients() {
  const { clients, clientFilters, setClientFilters, cases } = useAppStore();
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingClient, setEditingClient] = useState<any>(null);
  
  // Calculate dynamic client statistics based on actual cases
  const getClientStats = (clientName: string) => {
    const clientCases = cases.filter(case_ => case_.clientName === clientName);
    const totalCases = clientCases.length;
    const activeCases = clientCases.filter(c => c.status === 'Open').length;
    const totalPayout = clientCases.reduce((sum, c) => sum + (c.actualPayout || c.estimatedPayout || 0), 0);
    
    return { totalCases, activeCases, totalPayout };
  };

  // Get all unique client names from cases
  const caseClientNames = Array.from(new Set(cases.map(case_ => case_.clientName)));
  
  // Combine existing clients with clients that only exist in cases
  const allClientNames = Array.from(new Set([
    ...clients.map(c => c.name),
    ...caseClientNames
  ]));
  
  // Create dynamic client data with real case statistics
  const dynamicClients = allClientNames.map(clientName => {
    const existingClient = clients.find(c => c.name === clientName);
    const stats = getClientStats(clientName);
    
    // If client exists in static data, use it with updated stats
    if (existingClient) {
      return {
        ...existingClient,
        totalCases: stats.totalCases,
        activeCases: stats.activeCases,
        totalPayout: stats.totalPayout
      };
    }
    
    // If client only exists in cases, create a minimal client entry
    return {
      id: `client-${clientName.toLowerCase().replace(/\s+/g, '-')}`,
      name: clientName,
      email: `${clientName.toLowerCase().replace(/\s+/g, '.')}@email.com`,
      phone: '(555) 000-0000',
      company: undefined,
      address: 'Address not provided',
      joinDate: new Date().toISOString().split('T')[0],
      totalCases: stats.totalCases,
      activeCases: stats.activeCases,
      totalPayout: stats.totalPayout,
      status: 'active' as const
    };
  });
  
  const filteredClients = dynamicClients
    .filter(client => {
      const matchesSearch = client.name.toLowerCase().includes(clientFilters.search.toLowerCase()) ||
                           client.email.toLowerCase().includes(clientFilters.search.toLowerCase()) ||
                           client.company?.toLowerCase().includes(clientFilters.search.toLowerCase());
      const matchesStatus = !clientFilters.status || client.status === clientFilters.status;
      
      return matchesSearch && matchesStatus;
    })
    .sort((a, b) => a.name.localeCompare(b.name));

  const handleExportCSV = () => {
    const csvData = filteredClients.map(client => ({
      Name: client.name,
      Email: client.email,
      Phone: client.phone,
      Company: client.company || 'N/A',
      Status: client.status,
      'Total Cases': client.totalCases,
      'Active Cases': client.activeCases,
      'Total Payout': `$${client.totalPayout.toLocaleString()}`
    }));
    
    const csvString = [
      Object.keys(csvData[0]).join(','),
      ...csvData.map(row => Object.values(row).join(','))
    ].join('\n');
    
    const blob = new Blob([csvString], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'clients.csv';
    a.click();
    
    toast({
      title: "Export Complete",
      description: "Client data has been exported to CSV file.",
    });
  };

  const handleClientEdit = (clientId: string) => {
    const clientToEdit = dynamicClients.find(c => c.id === clientId);
    if (clientToEdit) {
      setEditingClient(clientToEdit);
    }
  };

  const totalClients = dynamicClients.length;
  const activeClients = dynamicClients.filter(c => c.status === 'active').length;
  const totalPayout = dynamicClients.reduce((sum, c) => sum + c.totalPayout, 0);

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold text-foreground">Client Management</h1>
          <p className="text-muted-foreground mt-2">
            Manage client information and relationships
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Clients</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalClients}</div>
              <p className="text-xs text-muted-foreground">
                {activeClients} active clients
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Payouts</CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">${totalPayout.toLocaleString()}</div>
              <p className="text-xs text-muted-foreground">
                Across all clients
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Average Cases</CardTitle>
              <Briefcase className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {totalClients > 0 ? (dynamicClients.reduce((sum, c) => sum + c.totalCases, 0) / totalClients).toFixed(1) : '0'}
              </div>
              <p className="text-xs text-muted-foreground">
                Cases per client
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-4 justify-between">
          <div className="flex gap-2">
            <Button onClick={() => setShowAddModal(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Add Client
            </Button>
            <Button variant="outline" onClick={handleExportCSV}>
              <Download className="h-4 w-4 mr-2" />
              Export CSV
            </Button>
          </div>
          
          <div className="flex gap-2">
            <div className="relative">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search clients..."
                className="pl-8 w-[250px]"
                value={clientFilters.search}
                onChange={(e) => setClientFilters({ search: e.target.value })}
              />
            </div>
            
            <Select value={clientFilters.status || "all"} onValueChange={(value) => setClientFilters({ status: value === "all" ? "" : value })}>
              <SelectTrigger className="w-[140px]">
                <SelectValue placeholder="All Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="inactive">Inactive</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Clients Table */}
        <Card>
          <CardHeader>
            <CardTitle>Client Directory</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Client</TableHead>
                  <TableHead>Contact</TableHead>
                  <TableHead>Company</TableHead>
                  <TableHead>Cases</TableHead>
                  <TableHead>Total Payout</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Join Date</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredClients.map((client) => (
                  <TableRow key={client.id}>
                    <TableCell>
                      <div>
                        <div className="font-medium">{client.name}</div>
                        <div className="text-sm text-muted-foreground">{client.email}</div>
                        {!clients.find(c => c.name === client.name) && (
                          <div className="text-xs text-blue-600 mt-1">
                            Auto-generated from cases
                          </div>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="text-sm">{client.phone}</div>
                    </TableCell>
                    <TableCell>
                      <div className="text-sm">{client.company || 'N/A'}</div>
                    </TableCell>
                    <TableCell>
                      <div className="text-sm">
                        <div>{client.totalCases} total</div>
                        <div className="text-muted-foreground">{client.activeCases} active</div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="font-medium">${client.totalPayout.toLocaleString()}</div>
                    </TableCell>
                    <TableCell>
                      <Badge variant={client.status === 'active' ? 'success' : 'secondary'}>
                        {client.status}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="text-sm">{new Date(client.joinDate).toLocaleDateString()}</div>
                    </TableCell>
                    <TableCell>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleClientEdit(client.id)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        <AddClientModal 
          open={showAddModal} 
          onClose={() => setShowAddModal(false)} 
        />

        <EditClientModal 
          open={!!editingClient} 
          onClose={() => setEditingClient(null)} 
          clientData={editingClient}
        />
      </div>
    </DashboardLayout>
  );
}