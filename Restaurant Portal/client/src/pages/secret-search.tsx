import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useMutation } from '@tanstack/react-query';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Layout } from '@/components/layout/layout';
import { Search, Database, AlertTriangle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { apiRequest } from '@/lib/queryClient';

const searchSchema = z.object({
  query: z.string().min(1, 'Search query is required'),
  searchType: z.string().min(1, 'Search type is required'),
});

type SearchForm = z.infer<typeof searchSchema>;

export default function SecretSearch() {
  const [searchResults, setSearchResults] = useState<any>(null);
  const { toast } = useToast();

  const form = useForm<SearchForm>({
    resolver: zodResolver(searchSchema),
    defaultValues: {
      query: '',
      searchType: 'menu',
    },
  });

  const searchMutation = useMutation({
    mutationFn: async (data: SearchForm) => {
      const response = await apiRequest('POST', '/api/secret-search', data);
      return response.json();
    },
    onSuccess: (data) => {
      setSearchResults(data);
      
      // Check if SQL injection was successful
      if (data.results?.length && data.results[0]?.results) {
        const hasFlag = data.results[0].results.some((result: any) => result.flag);
        if (hasFlag) {
          toast({
            title: '🚨 SQL Injection Detected!',
            description: 'Flag Retrieved Successfully',
            variant: 'destructive',
          });
        }
      }
    },
    onError: (error: any) => {
      toast({
        title: 'Search Failed',
        description: error.message || 'An error occurred during search',
        variant: 'destructive',
      });
    },
  });

  const onSubmit = (data: SearchForm) => {
    searchMutation.mutate(data);
  };

  return (
    <Layout>
      <div className="p-6 max-w-4xl mx-auto">
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-foreground mb-2 flex items-center space-x-2">
            <Search className="h-6 w-6" />
            <span>🔍 Search Portal</span>
          </h2>
          <p className="text-muted-foreground">Advanced search interface</p>
        </div>

        <Card className="mb-6" data-testid="card-search-form">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Database className="h-5 w-5" />
              <span>Database Query Interface</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <FormField
                  control={form.control}
                  name="query"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Search Query</FormLabel>
                      <FormControl>
                        <Input 
                          placeholder="Enter Here..." 
                          {...field} 
                          data-testid="input-search-query"
                        />
                      </FormControl>
                      <FormMessage />
                      <p className="text-xs text-muted-foreground">
                        Advanced Search.
                      </p>
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="searchType"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Search Type</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger data-testid="select-search-type">
                            <SelectValue placeholder="Select search type" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="menu">Menu Items</SelectItem>
                          <SelectItem value="users">System Users</SelectItem>
                          <SelectItem value="orders">Order History</SelectItem>
                          <SelectItem value="admin">Admin Data</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <Button 
                  type="submit" 
                  className="w-full" 
                  disabled={searchMutation.isPending}
                  data-testid="button-execute-search"
                >
                  {searchMutation.isPending ? 'Executing Search...' : 'Execute Search'}
                </Button>
              </form>
            </Form>
          </CardContent>
        </Card>

        {searchResults && (
          <Card data-testid="card-search-results">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Database className="h-5 w-5" />
                <span>Search Results</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="bg-gray-900 text-green-400 p-4 rounded-lg font-mono text-sm mb-4">
                <p className="text-yellow-400 mb-2">Query executed:</p>
                <p className="mb-4" data-testid="text-executed-query">{searchResults.query}</p>
                
                {searchResults.results?.length > 0 && (
                  <>
                    <p className="text-yellow-400 mb-2">Results found:</p>
                    <div className="border-t border-gray-600 pt-2">
                      {searchResults.results.map((result: any, index: number) => (
                        <div key={index} className="mb-4">
                          {result.results ? (
                            // SQL injection results
                            <div>
                              <p className="text-white mb-2">==========================================</p>
                              {result.results.map((row: any, rowIndex: number) => (
                                <div key={rowIndex} className="mb-1" data-testid={`result-row-${rowIndex}`}>
                                  {row.name && <span>{row.name} | </span>}
                                  {row.email && <span>{row.email} | </span>}
                                  {row.flag && (
                                    <span className="text-red-400 font-bold">{row.flag}</span>
                                  )}
                                  {row.access && <span>{row.access}</span>}
                                </div>
                              ))}
                              <p className="text-white mt-2">==========================================</p>
                              <p className="text-red-400 font-bold mt-2">
                                🚨 SQL Injection Detected! Flag Retrieved Successfully 🚨
                              </p>
                            </div>
                          ) : (
                            // Normal results
                            <p>No matches found for the specified criteria.</p>
                          )}
                        </div>
                      ))}
                    </div>
                  </>
                )}
              </div>
              
              <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                <AlertTriangle className="h-4 w-4" />
                <span>Search completed. {searchResults.results?.length || 0} result(s) returned.</span>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </Layout>
  );
}
