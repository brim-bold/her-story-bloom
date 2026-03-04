import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { 
  ArrowLeft, 
  HelpCircle, 
  MessageCircle, 
  Mail, 
  Phone,
  ChevronDown,
  Search,
  BookOpen,
  Users,
  Shield,
  CreditCard
} from 'lucide-react';
import { toast } from 'sonner';

const HelpSupport = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [contactForm, setContactForm] = useState({
    subject: '',
    message: ''
  });
  const [submitting, setSubmitting] = useState(false);

  const faqs = [
    {
      category: 'Getting Started',
      icon: BookOpen,
      questions: [
        {
          q: 'How do I create my profile?',
          a: 'Go to your profile page and click "Edit Profile" to add your bio, interests, location, and other details that help other women connect with you.'
        },
        {
          q: 'How do I find other women to connect with?',
          a: 'Use the Discover page to browse profiles of women in your area. You can like profiles or send messages to start conversations.'
        },
        {
          q: 'What makes a good profile?',
          a: 'Include a clear bio that shares your interests, location, and what you\'re looking for. Add relevant interests and keep your information up to date.'
        }
      ]
    },
    {
      category: 'Connections & Messaging',
      icon: Users,
      questions: [
        {
          q: 'How do I start a conversation?',
          a: 'Click the message button on someone\'s profile. Start with something personal based on their interests or bio to make a genuine connection.'
        },
        {
          q: 'What if someone doesn\'t respond?',
          a: 'Don\'t take it personally! People have busy lives. Focus on connecting with others who are actively engaging on the platform.'
        },
        {
          q: 'Can I block or report someone?',
          a: 'Yes, you can block users who make you uncomfortable. Report any inappropriate behavior to help keep our community safe.'
        }
      ]
    },
    {
      category: 'Events',
      icon: Users,
      questions: [
        {
          q: 'How do I join an event?',
          a: 'Browse events on the Events page and click "Join Event" on ones that interest you. You\'ll get reminders and details about the meetup.'
        },
        {
          q: 'Can I create my own event?',
          a: 'Yes! Click the + button on the Events page to create your own gathering. This is a great way to bring together women with similar interests.'
        },
        {
          q: 'What if I need to cancel my attendance?',
          a: 'You can cancel your attendance anytime before the event. Please do so as early as possible so others can take your spot.'
        }
      ]
    },
    {
      category: 'Privacy & Safety',
      icon: Shield,
      questions: [
        {
          q: 'How is my personal information protected?',
          a: 'We use industry-standard encryption and never share your personal data with third parties. You control what information is visible on your profile.'
        },
        {
          q: 'Can I control who sees my profile?',
          a: 'Yes, you can adjust your privacy settings to control profile visibility, location sharing, and message permissions in Settings.'
        },
        {
          q: 'What should I do if I feel unsafe?',
          a: 'Trust your instincts. Block or report users who make you feel uncomfortable. Meet in public places for first meetings and let someone know where you\'re going.'
        }
      ]
    }
  ];

  const handleContactSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    
    // Simulate form submission
    setTimeout(() => {
      toast.success('Your message has been sent! We\'ll get back to you within 24 hours.');
      setContactForm({ subject: '', message: '' });
      setSubmitting(false);
    }, 1000);
  };

  const filteredFaqs = faqs.map(category => ({
    ...category,
    questions: category.questions.filter(item =>
      item.q.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.a.toLowerCase().includes(searchQuery.toLowerCase())
    )
  })).filter(category => category.questions.length > 0);

  return (
    <div className="min-h-screen bg-gradient-profile">
      <div className="max-w-4xl mx-auto p-6">
        {/* Header */}
        <div className="flex items-center gap-4 mb-6">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate('/profile')}
            className="hover:bg-secondary"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back
          </Button>
          <h1 className="text-2xl font-bold text-foreground font-serif">Help & Support</h1>
        </div>

        {/* Search */}
        <Card className="mb-6 shadow-card border-border">
          <CardContent className="p-6">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
              <Input
                placeholder="Search for help topics..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
          </CardContent>
        </Card>

        <div className="grid gap-6 lg:grid-cols-3">
          {/* FAQ Section */}
          <div className="lg:col-span-2 space-y-6">
            <Card className="shadow-card border-border">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <HelpCircle className="w-5 h-5 text-primary" />
                  Frequently Asked Questions
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {filteredFaqs.length > 0 ? (
                  filteredFaqs.map((category, categoryIndex) => (
                    <div key={categoryIndex} className="space-y-3">
                      <div className="flex items-center gap-2 text-lg font-semibold text-card-foreground">
                        <category.icon className="w-5 h-5 text-primary" />
                        {category.category}
                      </div>
                      {category.questions.map((faq, faqIndex) => (
                        <Collapsible key={faqIndex}>
                          <CollapsibleTrigger className="flex items-center justify-between w-full p-3 text-left bg-secondary/50 rounded-lg hover:bg-secondary/70 transition-colors">
                            <span className="font-medium text-card-foreground">{faq.q}</span>
                            <ChevronDown className="w-4 h-4 text-muted-foreground" />
                          </CollapsibleTrigger>
                          <CollapsibleContent className="p-3 text-sm text-muted-foreground bg-secondary/20 rounded-b-lg">
                            {faq.a}
                          </CollapsibleContent>
                        </Collapsible>
                      ))}
                    </div>
                  ))
                ) : (
                  <p className="text-muted-foreground text-center py-8">
                    No FAQs match your search. Try different keywords or contact us directly.
                  </p>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Contact & Quick Help */}
          <div className="space-y-6">
            {/* Quick Contact */}
            <Card className="shadow-card border-border">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MessageCircle className="w-5 h-5 text-accent" />
                  Quick Contact
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center gap-3 p-3 bg-secondary/20 rounded-lg">
                  <Mail className="w-5 h-5 text-primary" />
                  <div>
                    <div className="font-medium text-card-foreground">Email Support</div>
                    <div className="text-sm text-muted-foreground">support@herstory.app</div>
                  </div>
                </div>
                
                <div className="flex items-center gap-3 p-3 bg-secondary/20 rounded-lg">
                  <MessageCircle className="w-5 h-5 text-accent" />
                  <div>
                    <div className="font-medium text-card-foreground">Live Chat</div>
                    <div className="text-sm text-muted-foreground">Available 9AM-6PM EST</div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Contact Form */}
            <Card className="shadow-card border-border">
              <CardHeader>
                <CardTitle>Send us a Message</CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleContactSubmit} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="subject">Subject</Label>
                    <Input
                      id="subject"
                      value={contactForm.subject}
                      onChange={(e) => setContactForm(prev => ({ ...prev, subject: e.target.value }))}
                      placeholder="How can we help?"
                      required
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="message">Message</Label>
                    <Textarea
                      id="message"
                      value={contactForm.message}
                      onChange={(e) => setContactForm(prev => ({ ...prev, message: e.target.value }))}
                      placeholder="Describe your question or issue..."
                      rows={4}
                      required
                    />
                  </div>
                  
                  <Button
                    type="submit"
                    disabled={submitting}
                    className="w-full bg-gradient-button hover:shadow-glow"
                  >
                    {submitting ? 'Sending...' : 'Send Message'}
                  </Button>
                </form>
              </CardContent>
            </Card>

            {/* Community Guidelines */}
            <Card className="shadow-card border-border">
              <CardHeader>
                <CardTitle className="text-base">Community Guidelines</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <p className="text-sm text-muted-foreground">
                  Our community thrives on respect, kindness, and authentic connections.
                </p>
                <ul className="text-sm text-muted-foreground space-y-1">
                  <li>• Be respectful and inclusive</li>
                  <li>• Keep conversations genuine</li>
                  <li>• Respect privacy and boundaries</li>
                  <li>• Report inappropriate behavior</li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HelpSupport;