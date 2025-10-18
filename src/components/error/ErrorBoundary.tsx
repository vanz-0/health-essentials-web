import React, { Component, ErrorInfo, ReactNode } from 'react';
import { AlertTriangle, RefreshCw, Home } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { supabase } from '@/integrations/supabase/client';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
  errorInfo: ErrorInfo | null;
}

class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null,
    errorInfo: null,
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error, errorInfo: null };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Uncaught error:', error, errorInfo);
    
    this.setState({ errorInfo });
    
    // Log error to Supabase
    this.logError(error, errorInfo);
  }

  private async logError(error: Error, errorInfo: ErrorInfo) {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      await supabase.from('error_logs').insert({
        user_id: user?.id || null,
        error_type: 'COMPONENT_ERROR',
        error_message: error.message,
        error_stack: error.stack || '',
        component_stack: errorInfo.componentStack || '',
        page_url: window.location.href,
        user_agent: navigator.userAgent,
        metadata: {
          timestamp: new Date().toISOString(),
          errorName: error.name,
        },
      });
    } catch (e) {
      console.error('Failed to log error:', e);
    }
  }

  private handleReset = () => {
    this.setState({ hasError: false, error: null, errorInfo: null });
  };

  private handleReload = () => {
    window.location.reload();
  };

  private handleGoHome = () => {
    window.location.href = '/';
  };

  public render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <div className="min-h-screen flex items-center justify-center p-4 bg-background">
          <Card className="max-w-2xl w-full">
            <CardHeader>
              <div className="flex items-center gap-3">
                <AlertTriangle className="h-8 w-8 text-destructive" />
                <div>
                  <CardTitle className="text-2xl">Something went wrong</CardTitle>
                  <CardDescription>
                    We're sorry, but an unexpected error occurred. Our team has been notified.
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            
            <CardContent>
              {this.state.error && (
                <div className="space-y-4">
                  <div className="p-4 rounded-lg bg-destructive/10 border border-destructive/20">
                    <p className="font-mono text-sm text-destructive">
                      {this.state.error.message}
                    </p>
                  </div>
                  
                  {process.env.NODE_ENV === 'development' && this.state.errorInfo && (
                    <details className="mt-4">
                      <summary className="cursor-pointer text-sm font-medium text-muted-foreground hover:text-foreground">
                        Technical Details (Development Only)
                      </summary>
                      <pre className="mt-2 p-4 rounded-lg bg-muted text-xs overflow-auto max-h-64">
                        {this.state.errorInfo.componentStack}
                      </pre>
                    </details>
                  )}
                </div>
              )}
            </CardContent>
            
            <CardFooter className="flex gap-3">
              <Button onClick={this.handleReset} variant="default" className="gap-2">
                <RefreshCw className="h-4 w-4" />
                Try Again
              </Button>
              <Button onClick={this.handleReload} variant="outline" className="gap-2">
                <RefreshCw className="h-4 w-4" />
                Reload Page
              </Button>
              <Button onClick={this.handleGoHome} variant="outline" className="gap-2">
                <Home className="h-4 w-4" />
                Go Home
              </Button>
            </CardFooter>
          </Card>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
