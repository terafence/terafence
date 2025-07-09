/**
 * Newsletter Service
 * 
 * Simple service for managing newsletter subscriptions.
 */

export interface SubscriberData {
    email: string;
    name?: string;
    company?: string;
    interests?: string[];
    source?: string;
    subscriptionDate?: Date;
    isActive?: boolean;
  }
  
  export interface NewsletterService {
    /**
     * Subscribe a new user to the newsletter
     */
    subscribe(data: SubscriberData): Promise<void>;
    
    /**
     * Unsubscribe a user from the newsletter
     */
    unsubscribe(email: string): Promise<void>;
    
    /**
     * Check if an email is already subscribed
     */
    isSubscribed(email: string): Promise<boolean>;
    
    /**
     * Get subscriber statistics
     */
    getStats(): Promise<{
      totalSubscribers: number;
      activeSubscribers: number;
      lastThirtyDaysSubscribers: number;
    }>;
  }
  
  /**
   * In-memory implementation for development
   */
  export class InMemoryNewsletterService implements NewsletterService {
    private subscribers: Map<string, SubscriberData> = new Map();
    
    async subscribe(data: SubscriberData): Promise<void> {
      const normalizedEmail = data.email.toLowerCase();
      
      // Check if already subscribed
      if (this.subscribers.has(normalizedEmail)) {
        const existingSubscriber = this.subscribers.get(normalizedEmail);
        if (existingSubscriber?.isActive) {
          throw new Error('Email is already subscribed');
        } else {
          // Reactivate the subscription
          this.subscribers.set(normalizedEmail, {
            ...existingSubscriber,
            ...data,
            isActive: true,
            subscriptionDate: new Date(),
          });
          return;
        }
      }
      
      // Add new subscription
      this.subscribers.set(normalizedEmail, {
        ...data,
        email: normalizedEmail,
        subscriptionDate: new Date(),
        isActive: true,
      });
    }
    
    async unsubscribe(email: string): Promise<void> {
      const normalizedEmail = email.toLowerCase();
      
      if (!this.subscribers.has(normalizedEmail)) {
        throw new Error('Email not found in subscribers list');
      }
      
      const subscriber = this.subscribers.get(normalizedEmail);
      if (subscriber) {
        this.subscribers.set(normalizedEmail, {
          ...subscriber,
          isActive: false,
        });
      }
    }
    
    async isSubscribed(email: string): Promise<boolean> {
      const normalizedEmail = email.toLowerCase();
      const subscriber = this.subscribers.get(normalizedEmail);
      return subscriber ? !!subscriber.isActive : false;
    }
    
    async getStats(): Promise<{
      totalSubscribers: number;
      activeSubscribers: number;
      lastThirtyDaysSubscribers: number;
    }> {
      const subscribers = Array.from(this.subscribers.values());
      const activeSubscribers = subscribers.filter(sub => sub.isActive);
      
      // Calculate subscribers in the last 30 days
      const thirtyDaysAgo = new Date();
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
      
      const recentSubscribers = subscribers.filter(sub => {
        return sub.subscriptionDate && sub.subscriptionDate >= thirtyDaysAgo;
      });
      
      return {
        totalSubscribers: subscribers.length,
        activeSubscribers: activeSubscribers.length,
        lastThirtyDaysSubscribers: recentSubscribers.length,
      };
    }
  }
  
  // Create and export a default service instance
  const newsletterService = new InMemoryNewsletterService();
  export default newsletterService;