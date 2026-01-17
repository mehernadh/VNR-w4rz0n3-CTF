import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Layout } from '@/components/layout/layout';
import { Star } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { apiRequest } from '@/lib/queryClient';

const reviewResponseSchema = z.object({
  customerName: z.string().min(1, 'Customer name is required'),
  rating: z.coerce.number().min(1).max(5),
  comment: z.string().min(1, 'Comment is required'),
  response: z.string().min(1, 'Response is required'),
});

type ReviewResponseForm = z.infer<typeof reviewResponseSchema>;

export default function Reviews() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  
  const { data: reviews, isLoading } = useQuery<any[]>({
    queryKey: ['/api/reviews'],
  });

  const form = useForm<ReviewResponseForm>({
    resolver: zodResolver(reviewResponseSchema),
    defaultValues: {
      customerName: '',
      rating: 5,
      comment: '',
      response: '',
    },
  });

  const createReviewMutation = useMutation({
    mutationFn: async (data: ReviewResponseForm) => {
      const response = await apiRequest('POST', '/api/reviews', data);
      return response.json();
    },
    onSuccess: async (reviewData: any) => {
      toast({
        title: 'Success',
        description: 'Review response added successfully',
      });
      
      // Check if XSS was detected and validate with server
      if (reviewData.xssDetected) {
        try {
          const challengeResponse = await apiRequest('POST', '/api/challenges/xss', {
            responseData: form.getValues('response')
          });
          const challengeData = await challengeResponse.json();
          
          if (challengeData.success && challengeData.flag) {
            setTimeout(() => {
              console.log('🚨 Advanced XSS Detected! 🚨');
              console.log('Non-script based injection successful');
              console.log('Flag: ' + challengeData.flag);
              alert('XSS Flag Found!\n\nFlag: ' + challengeData.flag + '\n\nCongratulations! You found the XSS vulnerability!');
            }, 500);
          }
        } catch (error) {
          // Silent fail for challenge validation
        }
      }
      
      form.reset();
      queryClient.invalidateQueries({ queryKey: ['/api/reviews'] });
    },
    onError: (error: any) => {
      toast({
        title: 'Error',
        description: error.message || 'Failed to add review response',
        variant: 'destructive',
      });
    },
  });

  // Sanitize customer input fields (remove all HTML/scripts)
  const sanitizeInput = (input: string): string => {
    return input.replace(/<[^>]*>/g, '').replace(/javascript:/gi, '').replace(/on\w+\s*=/gi, '');
  };

  const onSubmit = (data: ReviewResponseForm) => {
    // Sanitize customer name and comment (remove all HTML/scripts)
    const sanitizedData = {
      ...data,
      customerName: sanitizeInput(data.customerName),
      comment: sanitizeInput(data.comment),
      // Keep response as-is for XSS challenge
    };
    
    createReviewMutation.mutate(sanitizedData);
  };

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`h-4 w-4 ${i < rating ? 'text-yellow-400 fill-current' : 'text-gray-300'}`}
      />
    ));
  };

  return (
    <Layout>
      <div className="p-6">
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-foreground mb-2">Customer Reviews</h2>
          <p className="text-muted-foreground">Manage and respond to customer feedback.</p>
        </div>

        <Card className="mb-6" data-testid="card-add-review">
          <CardHeader>
            <CardTitle>Add Review Response</CardTitle>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="customerName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Customer Name</FormLabel>
                        <FormControl>
                          <Input 
                            placeholder="Enter customer name" 
                            {...field} 
                            data-testid="input-customer-name"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="rating"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Rating (1-5)</FormLabel>
                        <FormControl>
                          <Input 
                            type="number" 
                            min="1" 
                            max="5" 
                            placeholder="5" 
                            {...field} 
                            data-testid="input-rating"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                
                <FormField
                  control={form.control}
                  name="comment"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Customer Comment</FormLabel>
                      <FormControl>
                        <Textarea 
                          placeholder="Enter customer's review comment..." 
                          className="h-20"
                          {...field} 
                          data-testid="textarea-comment"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                {/* XSS Vulnerability - No input sanitization */}
                <FormField
                  control={form.control}
                  name="response"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Management Response</FormLabel>
                      <FormControl>
                        <Textarea 
                          placeholder="Enter your response to the customer..." 
                          className="h-24"
                          {...field} 
                          data-testid="textarea-response"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <Button 
                  type="submit" 
                  disabled={createReviewMutation.isPending}
                  data-testid="button-submit-response"
                >
                  {createReviewMutation.isPending ? 'Adding Response...' : 'Submit Response'}
                </Button>
              </form>
            </Form>
          </CardContent>
        </Card>

        <Card data-testid="card-reviews-list">
          <CardHeader>
            <CardTitle>Recent Reviews</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {isLoading ? (
                <p className="text-muted-foreground">Loading reviews...</p>
              ) : reviews?.length ? (
                reviews.map((review: any) => (
                  <div key={review.id} className="border-b border-border pb-4 last:border-b-0">
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <h4 className="font-medium text-foreground" data-testid={`text-reviewer-name-${review.id}`}>
                          {review.customerName}
                        </h4>
                        <div className="flex items-center mt-1 space-x-2">
                          <div className="flex">
                            {renderStars(review.rating)}
                          </div>
                          <span className="text-sm text-muted-foreground">
                            {new Date(review.createdAt).toLocaleDateString()}
                          </span>
                        </div>
                      </div>
                    </div>
                    <p className="text-foreground mb-2" data-testid={`text-review-comment-${review.id}`}>
                      {review.comment}
                    </p>
                    {review.response && (
                      <div className="bg-muted p-3 rounded-lg">
                        <p className="text-sm text-muted-foreground mb-1">
                          <strong>Management Response:</strong>
                        </p>
                        {/* Render management response as plain text to prevent XSS */}
                        <div 
                          className="text-sm text-foreground"
                          data-testid={`text-review-response-${review.id}`}
                        >
                          {review.response}
                        </div>
                      </div>
                    )}
                  </div>
                ))
              ) : (
                <p className="text-muted-foreground">No reviews found</p>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
}
